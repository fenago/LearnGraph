/**
 * Browser-compatible database using BrowserLevel (IndexedDB)
 * This allows the entire application to run client-side without server APIs
 */

import { BrowserLevel } from 'browser-level';
import { v4 as uuidv4 } from 'uuid';
import {
  KEY_PREFIXES,
  LearnerProfile,
  ConceptNode,
  PrerequisiteEdge,
  RelatedEdge,
  KnowledgeState,
  BatchOperation,
  QueryOptions,
  DBStats,
  BloomLevel,
  Misconception,
  PsychometricScore,
  ZPDResult,
  ZonedConcept,
  ZoneType,
  PsychometricAdjustments,
  ScaffoldingStrategy,
  ZPDRecommendation,
  LearningPathStep,
} from '../src/models/types';
import {
  deriveLearningStyle,
  estimateCognitiveProfile,
} from '../src/models/psychometrics';

/**
 * Browser-compatible EducationGraphDB using IndexedDB via BrowserLevel
 */
export class BrowserEducationGraphDB {
  private db: BrowserLevel<string, string>;
  private dbName: string;
  private isOpen: boolean = false;

  constructor(dbName: string = 'learngraph-db') {
    this.dbName = dbName;
    this.db = new BrowserLevel(dbName, { valueEncoding: 'utf8' });
  }

  // ===========================================================================
  // LIFECYCLE
  // ===========================================================================

  async open(): Promise<void> {
    if (!this.isOpen) {
      await this.db.open();
      this.isOpen = true;
    }
  }

  async close(): Promise<void> {
    if (this.isOpen) {
      await this.db.close();
      this.isOpen = false;
    }
  }

  get opened(): boolean {
    return this.isOpen;
  }

  // ===========================================================================
  // KEY GENERATION
  // ===========================================================================

  private learnerKey(userId: string): string {
    return `${KEY_PREFIXES.LEARNER}:${userId}`;
  }

  private conceptKey(conceptId: string): string {
    return `${KEY_PREFIXES.CONCEPT}:${conceptId}`;
  }

  private prereqEdgeKey(from: string, to: string): string {
    return `${KEY_PREFIXES.EDGE}:prereq:${from}:${to}`;
  }

  private relatedEdgeKey(edgeId: string): string {
    return `${KEY_PREFIXES.EDGE}:related:${edgeId}`;
  }

  private stateKey(userId: string, conceptId: string): string {
    return `${KEY_PREFIXES.STATE}:${userId}:${conceptId}`;
  }

  private domainIndexKey(domain: string, conceptId: string): string {
    return `${KEY_PREFIXES.INDEX}:domain:${domain}:${conceptId}`;
  }

  private learnerStatesIndexKey(userId: string, conceptId: string): string {
    return `${KEY_PREFIXES.INDEX}:learner-states:${userId}:${conceptId}`;
  }

  // ===========================================================================
  // LOW-LEVEL OPERATIONS
  // ===========================================================================

  private async get<T>(key: string): Promise<T | null> {
    try {
      const value = await this.db.get(key);
      if (value === undefined) return null;
      return JSON.parse(value) as T;
    } catch (error: unknown) {
      if ((error as { code?: string }).code === 'LEVEL_NOT_FOUND') {
        return null;
      }
      throw error;
    }
  }

  private async put<T>(key: string, value: T): Promise<void> {
    await this.db.put(key, JSON.stringify(value));
  }

  private async del(key: string): Promise<void> {
    try {
      await this.db.del(key);
    } catch (error: unknown) {
      if ((error as { code?: string }).code === 'LEVEL_NOT_FOUND') {
        return;
      }
      throw error;
    }
  }

  private async exists(key: string): Promise<boolean> {
    try {
      await this.db.get(key);
      return true;
    } catch (error: unknown) {
      if ((error as { code?: string }).code === 'LEVEL_NOT_FOUND') {
        return false;
      }
      throw error;
    }
  }

  private async listKeys(prefix: string, options: QueryOptions = {}): Promise<string[]> {
    const keys: string[] = [];
    const iterator = this.db.keys({
      gte: prefix,
      lt: prefix + '\xFF',
      limit: options.limit,
      reverse: options.reverse,
    });

    for await (const key of iterator) {
      keys.push(key);
    }

    return keys;
  }

  private async listEntries<T>(prefix: string, options: QueryOptions = {}): Promise<{ key: string; value: T }[]> {
    const entries: { key: string; value: T }[] = [];
    const iterator = this.db.iterator({
      gte: prefix,
      lt: prefix + '\xFF',
      limit: options.limit,
      reverse: options.reverse,
    });

    for await (const [key, value] of iterator) {
      entries.push({ key, value: JSON.parse(value) as T });
    }

    return entries;
  }

  // ===========================================================================
  // BATCH OPERATIONS
  // ===========================================================================

  async batch(operations: BatchOperation[]): Promise<void> {
    const batch = this.db.batch();

    for (const op of operations) {
      if (op.type === 'put' && op.value !== undefined) {
        batch.put(op.key, JSON.stringify(op.value));
      } else if (op.type === 'del') {
        batch.del(op.key);
      }
    }

    await batch.write();
  }

  // ===========================================================================
  // LEARNER OPERATIONS (Graph A)
  // ===========================================================================

  async setLearnerProfile(userId: string, profile: Partial<LearnerProfile>): Promise<LearnerProfile> {
    const now = new Date().toISOString();
    const existing = await this.getLearnerProfile(userId);

    const fullProfile: LearnerProfile = {
      userId,
      createdAt: existing?.createdAt || now,
      updatedAt: now,
      psychometricScores: existing?.psychometricScores || {},
      ...existing,
      ...profile,
    };

    await this.put(this.learnerKey(userId), fullProfile);
    return fullProfile;
  }

  async getLearnerProfile(userId: string): Promise<LearnerProfile | null> {
    return this.get<LearnerProfile>(this.learnerKey(userId));
  }

  async deleteLearnerProfile(userId: string): Promise<void> {
    await this.del(this.learnerKey(userId));

    const stateKeys = await this.listKeys(`${KEY_PREFIXES.STATE}:${userId}:`);
    const indexKeys = await this.listKeys(`${KEY_PREFIXES.INDEX}:learner-states:${userId}:`);

    const ops: BatchOperation[] = [
      ...stateKeys.map(key => ({ type: 'del' as const, key })),
      ...indexKeys.map(key => ({ type: 'del' as const, key })),
    ];

    if (ops.length > 0) {
      await this.batch(ops);
    }
  }

  async listLearnerProfiles(options: QueryOptions = {}): Promise<LearnerProfile[]> {
    const entries = await this.listEntries<LearnerProfile>(`${KEY_PREFIXES.LEARNER}:`, options);
    return entries.map(e => e.value);
  }

  async updatePsychometricScore(
    userId: string,
    domain: string,
    score: number,
    confidence: number = 0.5,
    source?: string
  ): Promise<void> {
    const profile = await this.getLearnerProfile(userId);
    if (!profile) {
      throw new Error(`Learner not found: ${userId}`);
    }

    profile.psychometricScores[domain] = {
      score,
      confidence,
      lastUpdated: new Date().toISOString(),
      source,
    };
    profile.updatedAt = new Date().toISOString();

    await this.put(this.learnerKey(userId), profile);
  }

  async updatePsychometricScores(
    userId: string,
    scores: Record<string, { score: number; confidence?: number; source?: string }>
  ): Promise<LearnerProfile> {
    const profile = await this.getLearnerProfile(userId);
    if (!profile) {
      throw new Error(`Learner not found: ${userId}`);
    }

    const now = new Date().toISOString();

    for (const [domain, data] of Object.entries(scores)) {
      profile.psychometricScores[domain] = {
        score: data.score,
        confidence: data.confidence ?? 0.5,
        lastUpdated: now,
        source: data.source,
      };
    }

    profile.updatedAt = now;
    await this.put(this.learnerKey(userId), profile);
    return profile;
  }

  async computeAndStoreLearningStyle(userId: string): Promise<LearnerProfile> {
    const profile = await this.getLearnerProfile(userId);
    if (!profile) {
      throw new Error(`Learner not found: ${userId}`);
    }

    profile.learningStyle = deriveLearningStyle(profile.psychometricScores);
    profile.updatedAt = new Date().toISOString();

    await this.put(this.learnerKey(userId), profile);
    return profile;
  }

  async computeAndStoreCognitiveProfile(userId: string): Promise<LearnerProfile> {
    const profile = await this.getLearnerProfile(userId);
    if (!profile) {
      throw new Error(`Learner not found: ${userId}`);
    }

    profile.cognitiveProfile = estimateCognitiveProfile(profile.psychometricScores);
    profile.updatedAt = new Date().toISOString();

    await this.put(this.learnerKey(userId), profile);
    return profile;
  }

  async computeAndStoreDerivedProfiles(userId: string): Promise<LearnerProfile> {
    const profile = await this.getLearnerProfile(userId);
    if (!profile) {
      throw new Error(`Learner not found: ${userId}`);
    }

    profile.learningStyle = deriveLearningStyle(profile.psychometricScores);
    profile.cognitiveProfile = estimateCognitiveProfile(profile.psychometricScores);
    profile.updatedAt = new Date().toISOString();

    await this.put(this.learnerKey(userId), profile);
    return profile;
  }

  async getPsychometricScores(userId: string): Promise<Record<string, PsychometricScore>> {
    const profile = await this.getLearnerProfile(userId);
    if (!profile) {
      throw new Error(`Learner not found: ${userId}`);
    }
    return profile.psychometricScores;
  }

  // ===========================================================================
  // CONCEPT OPERATIONS (Graph B)
  // ===========================================================================

  async addConcept(concept: Partial<ConceptNode> & { conceptId: string }): Promise<ConceptNode> {
    const now = new Date().toISOString();
    const existing = await this.getConcept(concept.conceptId);

    const defaults = {
      name: concept.conceptId,
      domain: 'general' as const,
      description: '',
      difficulty: { absolute: 5, cognitiveLoad: 0.5, abstractness: 0.5 },
    };

    const fullConcept: ConceptNode = {
      ...defaults,
      ...existing,
      ...concept,
      createdAt: existing?.createdAt || now,
      updatedAt: now,
    };

    await this.put(this.conceptKey(concept.conceptId), fullConcept);
    await this.put(this.domainIndexKey(fullConcept.domain, concept.conceptId), concept.conceptId);

    return fullConcept;
  }

  async getConcept(conceptId: string): Promise<ConceptNode | null> {
    return this.get<ConceptNode>(this.conceptKey(conceptId));
  }

  async deleteConcept(conceptId: string): Promise<void> {
    const concept = await this.getConcept(conceptId);
    if (!concept) return;

    const ops: BatchOperation[] = [
      { type: 'del', key: this.conceptKey(conceptId) },
      { type: 'del', key: this.domainIndexKey(concept.domain, conceptId) },
    ];

    const prereqFromKeys = await this.listKeys(`${KEY_PREFIXES.EDGE}:prereq:${conceptId}:`);
    const prereqToKeys = await this.getEdgesToConcept(conceptId);

    ops.push(...prereqFromKeys.map(key => ({ type: 'del' as const, key })));
    for (const edge of prereqToKeys) {
      ops.push({ type: 'del', key: this.prereqEdgeKey(edge.from, edge.to) });
    }

    await this.batch(ops);
  }

  async listConcepts(options: QueryOptions = {}): Promise<ConceptNode[]> {
    const entries = await this.listEntries<ConceptNode>(`${KEY_PREFIXES.CONCEPT}:`, options);
    return entries.map(e => e.value);
  }

  async listConceptsByDomain(domain: string): Promise<ConceptNode[]> {
    const keys = await this.listKeys(`${KEY_PREFIXES.INDEX}:domain:${domain}:`);
    const concepts: ConceptNode[] = [];

    for (const key of keys) {
      const conceptId = key.split(':').pop();
      if (conceptId) {
        const concept = await this.getConcept(conceptId);
        if (concept) concepts.push(concept);
      }
    }

    return concepts;
  }

  // ===========================================================================
  // EDGE OPERATIONS
  // ===========================================================================

  async addEdge(edge: { from: string; to: string; strength?: string; reason?: string }): Promise<PrerequisiteEdge> {
    const fullEdge: PrerequisiteEdge = {
      edgeId: `${edge.from}:${edge.to}`,
      from: edge.from,
      to: edge.to,
      strength: (edge.strength as PrerequisiteEdge['strength']) || 'recommended',
      reason: edge.reason,
      createdAt: new Date().toISOString(),
    };

    await this.put(this.prereqEdgeKey(edge.from, edge.to), fullEdge);
    return fullEdge;
  }

  async getEdge(from: string, to: string): Promise<PrerequisiteEdge | null> {
    return this.get<PrerequisiteEdge>(this.prereqEdgeKey(from, to));
  }

  async deleteEdge(from: string, to: string): Promise<void> {
    await this.del(this.prereqEdgeKey(from, to));
  }

  private async getEdgesToConcept(conceptId: string): Promise<PrerequisiteEdge[]> {
    const allEdges = await this.listEntries<PrerequisiteEdge>(`${KEY_PREFIXES.EDGE}:prereq:`);
    return allEdges.filter(e => e.value.to === conceptId).map(e => e.value);
  }

  async getPrerequisites(conceptId: string): Promise<PrerequisiteEdge[]> {
    return this.getEdgesToConcept(conceptId);
  }

  async getDependents(conceptId: string): Promise<PrerequisiteEdge[]> {
    const entries = await this.listEntries<PrerequisiteEdge>(`${KEY_PREFIXES.EDGE}:prereq:${conceptId}:`);
    return entries.map(e => e.value);
  }

  async listEdges(): Promise<PrerequisiteEdge[]> {
    const entries = await this.listEntries<PrerequisiteEdge>(`${KEY_PREFIXES.EDGE}:prereq:`);
    return entries.map(e => e.value);
  }

  async getPrerequisiteChain(
    conceptId: string,
    maxDepth: number = 5
  ): Promise<{ concept: ConceptNode; depth: number; edge: PrerequisiteEdge }[]> {
    const result: { concept: ConceptNode; depth: number; edge: PrerequisiteEdge }[] = [];
    const visited = new Set<string>();
    const queue: { conceptId: string; depth: number }[] = [{ conceptId, depth: 0 }];

    while (queue.length > 0) {
      const current = queue.shift()!;
      if (current.depth >= maxDepth || visited.has(current.conceptId)) continue;
      visited.add(current.conceptId);

      const edges = await this.getPrerequisites(current.conceptId);
      for (const edge of edges) {
        if (!visited.has(edge.from)) {
          const concept = await this.getConcept(edge.from);
          if (concept) {
            result.push({ concept, depth: current.depth + 1, edge });
            queue.push({ conceptId: edge.from, depth: current.depth + 1 });
          }
        }
      }
    }

    return result.sort((a, b) => a.depth - b.depth);
  }

  async getDependentChain(
    conceptId: string,
    maxDepth: number = 5
  ): Promise<{ concept: ConceptNode; depth: number; edge: PrerequisiteEdge }[]> {
    const result: { concept: ConceptNode; depth: number; edge: PrerequisiteEdge }[] = [];
    const visited = new Set<string>();
    const queue: { conceptId: string; depth: number }[] = [{ conceptId, depth: 0 }];

    while (queue.length > 0) {
      const current = queue.shift()!;
      if (current.depth >= maxDepth || visited.has(current.conceptId)) continue;
      visited.add(current.conceptId);

      const edges = await this.getDependents(current.conceptId);
      for (const edge of edges) {
        if (!visited.has(edge.to)) {
          const concept = await this.getConcept(edge.to);
          if (concept) {
            result.push({ concept, depth: current.depth + 1, edge });
            queue.push({ conceptId: edge.to, depth: current.depth + 1 });
          }
        }
      }
    }

    return result.sort((a, b) => a.depth - b.depth);
  }

  async searchConcepts(query: string, options: { limit?: number } = {}): Promise<ConceptNode[]> {
    const allConcepts = await this.listConcepts();
    const lowerQuery = query.toLowerCase();

    const matches = allConcepts.filter(concept =>
      concept.name.toLowerCase().includes(lowerQuery) ||
      concept.description.toLowerCase().includes(lowerQuery) ||
      concept.conceptId.toLowerCase().includes(lowerQuery) ||
      concept.domain.toLowerCase().includes(lowerQuery) ||
      concept.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
    );

    matches.sort((a, b) => {
      const aNameExact = a.name.toLowerCase() === lowerQuery ? 0 : 1;
      const bNameExact = b.name.toLowerCase() === lowerQuery ? 0 : 1;
      if (aNameExact !== bNameExact) return aNameExact - bNameExact;

      const aNameContains = a.name.toLowerCase().includes(lowerQuery) ? 0 : 1;
      const bNameContains = b.name.toLowerCase().includes(lowerQuery) ? 0 : 1;
      return aNameContains - bNameContains;
    });

    return options.limit ? matches.slice(0, options.limit) : matches;
  }

  async listConceptsByDifficulty(
    minDifficulty: number = 1,
    maxDifficulty: number = 10
  ): Promise<ConceptNode[]> {
    const allConcepts = await this.listConcepts();
    return allConcepts.filter(
      concept =>
        concept.difficulty.absolute >= minDifficulty &&
        concept.difficulty.absolute <= maxDifficulty
    ).sort((a, b) => a.difficulty.absolute - b.difficulty.absolute);
  }

  async listConceptsByBloomLevel(bloomLevel: keyof import('../src/models/types').BloomObjectives): Promise<ConceptNode[]> {
    const allConcepts = await this.listConcepts();
    return allConcepts.filter(
      concept => concept.bloomObjectives?.[bloomLevel]?.length
    );
  }

  // ===========================================================================
  // RELATED EDGE OPERATIONS
  // ===========================================================================

  async addRelatedEdge(
    conceptA: string,
    conceptB: string,
    relationship: string,
    bidirectional: boolean = true
  ): Promise<RelatedEdge> {
    const edgeId = `${conceptA}:${conceptB}:${relationship}`;
    const edge: RelatedEdge = {
      edgeId,
      conceptA,
      conceptB,
      relationship,
      bidirectional,
      createdAt: new Date().toISOString(),
    };

    await this.put(this.relatedEdgeKey(edgeId), edge);
    return edge;
  }

  async getRelatedEdges(conceptId: string): Promise<RelatedEdge[]> {
    const entries = await this.listEntries<RelatedEdge>(`${KEY_PREFIXES.EDGE}:related:`);
    return entries
      .map(e => e.value)
      .filter(edge =>
        edge.conceptA === conceptId ||
        (edge.bidirectional && edge.conceptB === conceptId)
      );
  }

  async deleteRelatedEdge(edgeId: string): Promise<void> {
    await this.del(this.relatedEdgeKey(edgeId));
  }

  async listRelatedEdges(): Promise<RelatedEdge[]> {
    const entries = await this.listEntries<RelatedEdge>(`${KEY_PREFIXES.EDGE}:related:`);
    return entries.map(e => e.value);
  }

  // ===========================================================================
  // KNOWLEDGE STATE OPERATIONS
  // ===========================================================================

  async setKnowledgeState(
    userId: string,
    conceptId: string,
    state: Partial<KnowledgeState>
  ): Promise<KnowledgeState> {
    const now = new Date().toISOString();
    const existing = await this.getKnowledgeState(userId, conceptId);

    const fullState: KnowledgeState = {
      userId,
      conceptId,
      mastery: 0,
      bloomLevel: 1 as BloomLevel,
      retentionStrength: 1,
      reviewCount: 0,
      misconceptions: [],
      interactions: [],
      updatedAt: now,
      ...existing,
      ...state,
    };

    if (!existing && !fullState.firstSeen) {
      fullState.firstSeen = now;
    }

    fullState.lastAccessed = now;
    fullState.updatedAt = now;

    await this.put(this.stateKey(userId, conceptId), fullState);
    await this.put(this.learnerStatesIndexKey(userId, conceptId), true);

    return fullState;
  }

  async getKnowledgeState(userId: string, conceptId: string): Promise<KnowledgeState | null> {
    return this.get<KnowledgeState>(this.stateKey(userId, conceptId));
  }

  async deleteKnowledgeState(userId: string, conceptId: string): Promise<void> {
    await this.del(this.stateKey(userId, conceptId));
    await this.del(this.learnerStatesIndexKey(userId, conceptId));
  }

  async getLearnerKnowledgeStates(userId: string): Promise<KnowledgeState[]> {
    const entries = await this.listEntries<KnowledgeState>(`${KEY_PREFIXES.STATE}:${userId}:`);
    return entries.map(e => e.value);
  }

  async addMisconception(
    userId: string,
    conceptId: string,
    description: string,
    severity: Misconception['severity'] = 'moderate'
  ): Promise<void> {
    const state = await this.getKnowledgeState(userId, conceptId);
    if (!state) {
      throw new Error(`Knowledge state not found for ${userId}:${conceptId}`);
    }

    state.misconceptions.push({
      id: uuidv4(),
      description,
      severity,
      identified: new Date().toISOString(),
    });

    await this.setKnowledgeState(userId, conceptId, state);
  }

  // ===========================================================================
  // STATISTICS
  // ===========================================================================

  async getStats(): Promise<DBStats> {
    const learners = await this.listKeys(`${KEY_PREFIXES.LEARNER}:`);
    const concepts = await this.listKeys(`${KEY_PREFIXES.CONCEPT}:`);
    const edges = await this.listKeys(`${KEY_PREFIXES.EDGE}:prereq:`);
    const states = await this.listKeys(`${KEY_PREFIXES.STATE}:`);

    return {
      learnerCount: learners.length,
      conceptCount: concepts.length,
      edgeCount: edges.length,
      stateCount: states.length,
    };
  }

  async clear(): Promise<void> {
    await this.db.clear();
  }

  // ===========================================================================
  // ZPD ENGINE (Zone of Proximal Development)
  // ===========================================================================

  private readonly MASTERY_THRESHOLD = 80;
  private readonly PARTIAL_MASTERY_THRESHOLD = 40;

  async computeZPD(userId: string, options: { limit?: number } = {}): Promise<ZPDResult> {
    const startTime = Date.now();
    const limit = options.limit ?? 10;

    const profile = await this.getLearnerProfile(userId);
    if (!profile) {
      throw new Error(`Learner not found: ${userId}`);
    }

    const concepts = await this.listConcepts();
    const states = await this.getLearnerKnowledgeStates(userId);
    const stateMap = new Map(states.map(s => [s.conceptId, s]));

    const psychometricAdjustments = this.adjustForPsychometrics(profile);

    const zonedConcepts: ZonedConcept[] = [];

    for (const concept of concepts) {
      const zonedConcept = await this.classifyConcept(
        concept,
        stateMap,
        psychometricAdjustments
      );
      zonedConcepts.push(zonedConcept);
    }

    const tooEasy: ZonedConcept[] = [];
    const zpd: ZonedConcept[] = [];
    const tooHard: ZonedConcept[] = [];

    for (const zc of zonedConcepts) {
      switch (zc.zone) {
        case 'too_easy':
          tooEasy.push(zc);
          break;
        case 'zpd':
          zpd.push(zc);
          break;
        case 'too_hard':
          tooHard.push(zc);
          break;
      }
    }

    zpd.sort((a, b) => b.readiness - a.readiness);

    const recommendations: ZPDRecommendation[] = [];
    for (const zc of zpd.slice(0, limit)) {
      const recommendation = await this.generateRecommendation(
        zc,
        profile,
        psychometricAdjustments
      );
      recommendations.push(recommendation);
    }

    const suggestedPath = await this.generateLearningPath(userId, limit);

    const computationTimeMs = Date.now() - startTime;

    return {
      userId,
      computedAt: new Date().toISOString(),
      computationTimeMs,
      tooEasy,
      zpd,
      tooHard,
      recommendations,
      psychometricAdjustments,
      suggestedPath: suggestedPath.map(step => step.conceptId),
    };
  }

  private async classifyConcept(
    concept: ConceptNode,
    stateMap: Map<string, KnowledgeState>,
    adjustments: PsychometricAdjustments
  ): Promise<ZonedConcept> {
    const state = stateMap.get(concept.conceptId);
    const currentMastery = state?.mastery ?? 0;

    const prereqs = await this.getPrerequisites(concept.conceptId);
    const missingPrerequisites: string[] = [];
    let prereqsMasteredCount = 0;

    for (const prereq of prereqs) {
      const prereqState = stateMap.get(prereq.from);
      const prereqMastery = prereqState?.mastery ?? 0;

      if (prereqMastery >= this.MASTERY_THRESHOLD) {
        prereqsMasteredCount++;
      } else {
        missingPrerequisites.push(prereq.from);
      }
    }

    const prerequisitesMet = prereqs.length > 0
      ? prereqsMasteredCount / prereqs.length
      : 1;

    const readiness = this.calculateReadiness(
      concept,
      currentMastery,
      prerequisitesMet,
      adjustments
    );

    let zone: ZoneType;
    let reason: string;

    if (currentMastery >= this.MASTERY_THRESHOLD) {
      zone = 'too_easy';
      reason = `Already mastered (${currentMastery}% mastery)`;
    } else if (prerequisitesMet < 0.7) {
      zone = 'too_hard';
      reason = `Missing ${missingPrerequisites.length} prerequisite(s): ${missingPrerequisites.slice(0, 3).join(', ')}${missingPrerequisites.length > 3 ? '...' : ''}`;
    } else if (readiness >= 0.5) {
      zone = 'zpd';
      reason = prerequisitesMet === 1
        ? 'All prerequisites mastered - ready to learn!'
        : `Most prerequisites met (${Math.round(prerequisitesMet * 100)}%) - good candidate for learning`;
    } else {
      zone = 'too_hard';
      reason = `Low readiness (${Math.round(readiness * 100)}%) - build foundation first`;
    }

    const recommendedOrder = zone === 'zpd'
      ? Math.round((1 - readiness) * 100) + concept.difficulty.absolute
      : zone === 'too_easy' ? 1000 : 2000;

    return {
      concept,
      zone,
      readiness,
      prerequisitesMet,
      missingPrerequisites,
      recommendedOrder,
      reason,
    };
  }

  private calculateReadiness(
    concept: ConceptNode,
    currentMastery: number,
    prerequisitesMet: number,
    adjustments: PsychometricAdjustments
  ): number {
    let readiness = prerequisitesMet;

    const masteryPenalty = currentMastery / 100 * 0.3;
    readiness -= masteryPenalty;

    const adjustedDifficulty = concept.difficulty.absolute + (adjustments.difficultyModifier * 10);
    const difficultyFactor = 1 - Math.abs(adjustedDifficulty - 5) / 10;
    readiness *= (0.5 + difficultyFactor * 0.5);

    if (adjustments.paceRecommendation === 'faster' && concept.difficulty.cognitiveLoad < 0.5) {
      readiness *= 1.1;
    } else if (adjustments.paceRecommendation === 'slower' && concept.difficulty.cognitiveLoad < 0.3) {
      readiness *= 1.1;
    }

    return Math.max(0, Math.min(1, readiness));
  }

  adjustForPsychometrics(profile: LearnerProfile): PsychometricAdjustments {
    const scores = profile.psychometricScores;

    let difficultyModifier = 0;
    let paceRecommendation: 'slower' | 'normal' | 'faster' = 'normal';
    const attentionConsiderations: string[] = [];
    const scaffoldingStrategies = this.selectScaffoldingStrategies(profile);
    let presentationStyle: 'visual' | 'verbal' | 'hands_on' | 'mixed' = 'mixed';

    const openness = scores['openness_to_experience']?.score;
    if (openness !== undefined) {
      if (openness > 70) {
        difficultyModifier += 0.2;
      } else if (openness < 30) {
        difficultyModifier -= 0.1;
      }
    }

    const conscientiousness = scores['conscientiousness']?.score;
    if (conscientiousness !== undefined) {
      if (conscientiousness > 70) {
        paceRecommendation = 'faster';
      } else if (conscientiousness < 30) {
        paceRecommendation = 'slower';
        attentionConsiderations.push('May need more structure and checkpoints');
      }
    }

    const neuroticism = scores['neuroticism']?.score;
    if (neuroticism !== undefined) {
      if (neuroticism > 70) {
        difficultyModifier -= 0.2;
        attentionConsiderations.push('Keep encouragement high, minimize failure scenarios');
      }
    }

    const extraversion = scores['extraversion']?.score;
    if (extraversion !== undefined) {
      if (extraversion > 70) {
        attentionConsiderations.push('Benefits from collaborative learning');
      } else if (extraversion < 30) {
        attentionConsiderations.push('Prefers solo study, may be overwhelmed by group work');
      }
    }

    if (profile.learningStyle) {
      switch (profile.learningStyle.primary) {
        case 'visual':
          presentationStyle = 'visual';
          break;
        case 'auditory':
          presentationStyle = 'verbal';
          break;
        case 'kinesthetic':
          presentationStyle = 'hands_on';
          break;
        default:
          presentationStyle = 'mixed';
      }
    }

    difficultyModifier = Math.max(-0.5, Math.min(0.5, difficultyModifier));

    return {
      difficultyModifier,
      paceRecommendation,
      attentionConsiderations,
      scaffoldingStrategies,
      presentationStyle,
    };
  }

  selectScaffoldingStrategies(profile: LearnerProfile): ScaffoldingStrategy[] {
    const strategies: ScaffoldingStrategy[] = [];
    const scores = profile.psychometricScores;

    strategies.push({
      type: 'worked_example',
      reason: 'Universal foundation for learning new concepts',
      priority: 8,
    });

    if (profile.learningStyle?.primary === 'visual') {
      strategies.push({
        type: 'visual_aids',
        reason: 'Primary learning modality is visual',
        priority: 9,
      });
    }

    const neuroticism = scores['neuroticism']?.score;
    if (neuroticism !== undefined && neuroticism > 60) {
      strategies.push({
        type: 'guided_practice',
        reason: 'Reduces anxiety through step-by-step guidance',
        priority: 8,
      });
      strategies.push({
        type: 'hints',
        reason: 'Provides safety net when struggling',
        priority: 7,
      });
    }

    if (profile.cognitiveProfile?.workingMemoryCapacity === 'low') {
      strategies.push({
        type: 'chunking',
        reason: 'Accommodates limited working memory capacity',
        priority: 9,
      });
    }

    const extraversion = scores['extraversion']?.score;
    if (extraversion !== undefined && extraversion > 70) {
      strategies.push({
        type: 'peer_discussion',
        reason: 'Leverages social learning preference',
        priority: 6,
      });
    }

    const openness = scores['openness_to_experience']?.score;
    if (openness !== undefined && openness < 40) {
      strategies.push({
        type: 'analogy',
        reason: 'Connects new concepts to familiar ones',
        priority: 7,
      });
    }

    if (profile.cognitiveProfile?.attentionSpan === 'short') {
      strategies.push({
        type: 'repetition',
        reason: 'Reinforces learning with shorter attention span',
        priority: 7,
      });
    }

    if (profile.learningStyle?.primary === 'kinesthetic') {
      strategies.push({
        type: 'guided_practice',
        reason: 'Hands-on practice matches learning style',
        priority: 9,
      });
    }

    strategies.sort((a, b) => b.priority - a.priority);

    return strategies;
  }

  private async generateRecommendation(
    zonedConcept: ZonedConcept,
    profile: LearnerProfile,
    adjustments: PsychometricAdjustments
  ): Promise<ZPDRecommendation> {
    const concept = zonedConcept.concept;

    const prereqChain = await this.getPrerequisiteChain(concept.conceptId, 3);
    const prerequisiteChain = prereqChain.map(p => p.concept.name);

    let baseTime = concept.timeEstimates?.basicMastery ?? (concept.difficulty.absolute * 15);

    if (adjustments.paceRecommendation === 'slower') {
      baseTime *= 1.3;
    } else if (adjustments.paceRecommendation === 'faster') {
      baseTime *= 0.8;
    }

    const psychometricMatch = this.calculatePsychometricMatch(concept, profile, adjustments);

    const reasons: string[] = [];

    if (zonedConcept.prerequisitesMet === 1) {
      reasons.push('All prerequisites are mastered');
    } else if (zonedConcept.prerequisitesMet >= 0.7) {
      reasons.push(`${Math.round(zonedConcept.prerequisitesMet * 100)}% of prerequisites are mastered`);
    }

    if (zonedConcept.readiness > 0.8) {
      reasons.push('High readiness score - optimal timing');
    }

    if (psychometricMatch > 0.7) {
      reasons.push('Good match with your learning profile');
    }

    if (concept.difficulty.absolute <= 5 && adjustments.difficultyModifier < 0) {
      reasons.push('Appropriate difficulty level for your profile');
    }

    return {
      concept,
      readinessScore: zonedConcept.readiness,
      estimatedMasteryTime: Math.round(baseTime),
      psychometricMatch,
      scaffoldingStrategies: adjustments.scaffoldingStrategies.slice(0, 3),
      reasons,
      prerequisiteChain,
    };
  }

  private calculatePsychometricMatch(
    concept: ConceptNode,
    profile: LearnerProfile,
    adjustments: PsychometricAdjustments
  ): number {
    let match = 0.5;

    const openness = profile.psychometricScores['openness_to_experience']?.score;
    if (openness !== undefined) {
      if (concept.difficulty.abstractness > 0.7 && openness > 60) {
        match += 0.2;
      } else if (concept.difficulty.abstractness > 0.7 && openness < 40) {
        match -= 0.2;
      }
    }

    if (profile.cognitiveProfile?.workingMemoryCapacity === 'high' && concept.difficulty.cognitiveLoad > 0.7) {
      match += 0.15;
    } else if (profile.cognitiveProfile?.workingMemoryCapacity === 'low' && concept.difficulty.cognitiveLoad > 0.7) {
      match -= 0.15;
    }

    const adjustedDifficulty = concept.difficulty.absolute + (adjustments.difficultyModifier * 10);
    if (adjustedDifficulty >= 4 && adjustedDifficulty <= 7) {
      match += 0.1;
    }

    return Math.max(0, Math.min(1, match));
  }

  async generateLearningPath(userId: string, maxConcepts: number = 10): Promise<LearningPathStep[]> {
    const profile = await this.getLearnerProfile(userId);
    if (!profile) {
      throw new Error(`Learner not found: ${userId}`);
    }

    const concepts = await this.listConcepts();
    const states = await this.getLearnerKnowledgeStates(userId);
    const stateMap = new Map(states.map(s => [s.conceptId, s]));
    const adjustments = this.adjustForPsychometrics(profile);

    const unmasteredConcepts = concepts.filter(c => {
      const state = stateMap.get(c.conceptId);
      return !state || state.mastery < this.MASTERY_THRESHOLD;
    });

    const edges = await this.listEdges();
    const dependencies = new Map<string, Set<string>>();

    for (const concept of concepts) {
      dependencies.set(concept.conceptId, new Set());
    }

    for (const edge of edges) {
      const deps = dependencies.get(edge.to);
      if (deps) {
        deps.add(edge.from);
      }
    }

    const path: LearningPathStep[] = [];
    const visited = new Set<string>();
    const inPath = new Set<string>();

    const getScore = (conceptId: string): number => {
      const concept = concepts.find(c => c.conceptId === conceptId)!;
      const state = stateMap.get(conceptId);
      const mastery = state?.mastery ?? 0;

      const deps = dependencies.get(conceptId) || new Set();
      let unmasteredDeps = 0;
      for (const dep of deps) {
        const depState = stateMap.get(dep);
        if (!depState || depState.mastery < this.MASTERY_THRESHOLD) {
          unmasteredDeps++;
        }
      }

      return unmasteredDeps * 100 + (100 - mastery) * 0.5 + Math.abs(concept.difficulty.absolute - 5) * 10;
    };

    const queue = [...unmasteredConcepts.map(c => c.conceptId)];
    queue.sort((a, b) => getScore(a) - getScore(b));

    while (queue.length > 0 && path.length < maxConcepts) {
      let foundIdx = -1;
      for (let i = 0; i < queue.length; i++) {
        const conceptId = queue[i];
        const deps = dependencies.get(conceptId) || new Set();
        let allDepsMet = true;

        for (const dep of deps) {
          const depState = stateMap.get(dep);
          const depMastery = depState?.mastery ?? 0;
          if (depMastery < this.MASTERY_THRESHOLD && !inPath.has(dep)) {
            allDepsMet = false;
            break;
          }
        }

        if (allDepsMet) {
          foundIdx = i;
          break;
        }
      }

      if (foundIdx === -1) {
        for (const conceptId of queue) {
          const deps = dependencies.get(conceptId) || new Set();
          for (const dep of deps) {
            if (!inPath.has(dep) && !visited.has(dep)) {
              foundIdx = queue.indexOf(dep);
              if (foundIdx === -1) {
                queue.push(dep);
                foundIdx = queue.length - 1;
              }
              break;
            }
          }
          if (foundIdx !== -1) break;
        }

        if (foundIdx === -1) break;
      }

      const conceptId = queue[foundIdx];
      queue.splice(foundIdx, 1);

      if (visited.has(conceptId)) continue;
      visited.add(conceptId);

      const concept = concepts.find(c => c.conceptId === conceptId);
      if (!concept) continue;

      let duration = concept.timeEstimates?.basicMastery ?? (concept.difficulty.absolute * 15);
      if (adjustments.paceRecommendation === 'slower') {
        duration *= 1.3;
      } else if (adjustments.paceRecommendation === 'faster') {
        duration *= 0.8;
      }

      const milestones: string[] = [];
      if (concept.bloomObjectives?.understand) {
        milestones.push(...concept.bloomObjectives.understand.slice(0, 2));
      }
      if (concept.bloomObjectives?.apply) {
        milestones.push(...concept.bloomObjectives.apply.slice(0, 1));
      }

      path.push({
        conceptId,
        concept,
        estimatedDuration: Math.round(duration),
        scaffolding: adjustments.scaffoldingStrategies.slice(0, 3),
        milestones,
      });

      inPath.add(conceptId);
    }

    return path;
  }

  // ===========================================================================
  // PHASE 5: KNOWLEDGE GAP ANALYSIS
  // ===========================================================================

  private readonly GAP_TYPES = {
    MISSING: 'missing',
    PARTIAL: 'partial',
    FORGOTTEN: 'forgotten',
    MISCONCEPTION: 'misconception',
  } as const;

  private readonly FORGOTTEN_THRESHOLD = 60;
  private readonly BASE_STABILITY = 7;

  async detectGaps(
    userId: string,
    options: {
      type?: 'missing' | 'partial' | 'forgotten' | 'misconceptions' | 'all';
      includeRecommendations?: boolean;
    } = {}
  ): Promise<{
    missing: { conceptId: string; concept: ConceptNode; reason: string }[];
    partial: { conceptId: string; concept: ConceptNode; mastery: number; reason: string }[];
    forgotten: { conceptId: string; concept: ConceptNode; predictedRetention: number; daysSinceReview: number; reason: string }[];
    misconceptions: { conceptId: string; concept: ConceptNode; misconceptions: Misconception[]; reason: string }[];
    summary: { total: number; critical: number; byType: Record<string, number> };
  }> {
    const type = options.type ?? 'all';

    const profile = await this.getLearnerProfile(userId);
    if (!profile) {
      throw new Error(`Learner not found: ${userId}`);
    }

    const concepts = await this.listConcepts();
    const states = await this.getLearnerKnowledgeStates(userId);
    const stateMap = new Map(states.map(s => [s.conceptId, s]));

    const missing: { conceptId: string; concept: ConceptNode; reason: string }[] = [];
    const partial: { conceptId: string; concept: ConceptNode; mastery: number; reason: string }[] = [];
    const forgotten: { conceptId: string; concept: ConceptNode; predictedRetention: number; daysSinceReview: number; reason: string }[] = [];
    const misconceptions: { conceptId: string; concept: ConceptNode; misconceptions: Misconception[]; reason: string }[] = [];

    for (const concept of concepts) {
      const state = stateMap.get(concept.conceptId);

      if ((type === 'all' || type === 'missing') && !state) {
        const prereqs = await this.getPrerequisites(concept.conceptId);
        let prereqsMet = true;

        for (const prereq of prereqs) {
          const prereqState = stateMap.get(prereq.from);
          if (!prereqState || prereqState.mastery < this.MASTERY_THRESHOLD) {
            prereqsMet = false;
            break;
          }
        }

        if (prereqsMet && prereqs.length > 0) {
          missing.push({
            conceptId: concept.conceptId,
            concept,
            reason: 'Prerequisites are mastered but this concept has not been started',
          });
        }
      }

      if (!state) continue;

      if ((type === 'all' || type === 'partial') &&
          state.mastery >= this.PARTIAL_MASTERY_THRESHOLD &&
          state.mastery < this.MASTERY_THRESHOLD) {
        partial.push({
          conceptId: concept.conceptId,
          concept,
          mastery: state.mastery,
          reason: `Partially mastered at ${state.mastery}% - needs reinforcement to reach ${this.MASTERY_THRESHOLD}%`,
        });
      }

      if (type === 'all' || type === 'forgotten') {
        if (state.mastery >= this.PARTIAL_MASTERY_THRESHOLD && state.lastReviewed) {
          const decay = this.predictDecay(state, concept);

          if (decay.predictedRetention < this.FORGOTTEN_THRESHOLD) {
            forgotten.push({
              conceptId: concept.conceptId,
              concept,
              predictedRetention: decay.predictedRetention,
              daysSinceReview: decay.daysSinceReview,
              reason: `Last reviewed ${decay.daysSinceReview} days ago - predicted retention is ${Math.round(decay.predictedRetention)}%`,
            });
          }
        }
      }

      if ((type === 'all' || type === 'misconceptions') &&
          state.misconceptions &&
          state.misconceptions.length > 0) {
        const unresolvedMisconceptions = state.misconceptions.filter(m => !m.resolved);
        if (unresolvedMisconceptions.length > 0) {
          misconceptions.push({
            conceptId: concept.conceptId,
            concept,
            misconceptions: unresolvedMisconceptions,
            reason: `Has ${unresolvedMisconceptions.length} unresolved misconception(s) that may impede learning`,
          });
        }
      }
    }

    const total = missing.length + partial.length + forgotten.length + misconceptions.length;
    const critical = forgotten.filter(f => f.predictedRetention < 40).length +
                    misconceptions.filter(m => m.misconceptions.some(mc => mc.severity === 'major')).length;

    return {
      missing,
      partial,
      forgotten,
      misconceptions,
      summary: {
        total,
        critical,
        byType: {
          missing: missing.length,
          partial: partial.length,
          forgotten: forgotten.length,
          misconceptions: misconceptions.length,
        },
      },
    };
  }

  predictDecay(
    state: KnowledgeState,
    concept: ConceptNode
  ): {
    predictedRetention: number;
    daysSinceReview: number;
    stabilityFactor: number;
    decayRate: number;
  } {
    const now = new Date();
    const lastReview = state.lastReviewed ? new Date(state.lastReviewed) : new Date(state.updatedAt);
    const daysSinceReview = Math.max(0, (now.getTime() - lastReview.getTime()) / (1000 * 60 * 60 * 24));

    const reviewBonus = Math.log2(Math.max(1, state.reviewCount || 1)) * 2;
    const masteryBonus = (state.mastery / 100) * 3;
    const difficultyPenalty = (concept.difficulty.absolute / 10) * 2;

    const stabilityFactor = this.BASE_STABILITY + reviewBonus + masteryBonus - difficultyPenalty;
    const clampedStability = Math.max(1, stabilityFactor);

    const decayRate = 1 / clampedStability;
    const retentionFactor = Math.exp(-daysSinceReview * decayRate);
    const predictedRetention = state.mastery * retentionFactor;

    return {
      predictedRetention: Math.max(0, Math.min(100, predictedRetention)),
      daysSinceReview: Math.round(daysSinceReview * 10) / 10,
      stabilityFactor: Math.round(clampedStability * 10) / 10,
      decayRate: Math.round(decayRate * 1000) / 1000,
    };
  }

  scheduleNextReview(
    state: KnowledgeState,
    concept: ConceptNode,
    performance?: 'failed' | 'difficult' | 'good' | 'easy'
  ): {
    nextReviewDate: string;
    intervalDays: number;
    optimalWindowStart: string;
    optimalWindowEnd: string;
    priority: 'urgent' | 'normal' | 'low';
  } {
    const decay = this.predictDecay(state, concept);
    const reviewCount = state.reviewCount || 0;

    let baseInterval: number;

    if (reviewCount === 0) {
      baseInterval = 1;
    } else if (reviewCount === 1) {
      baseInterval = 3;
    } else if (reviewCount === 2) {
      baseInterval = 7;
    } else {
      const easinessFactor = 1.5 + (state.mastery / 100) * 1;
      const previousInterval = Math.pow(2, reviewCount - 1);
      baseInterval = previousInterval * easinessFactor;
    }

    let intervalMultiplier = 1;
    if (performance) {
      switch (performance) {
        case 'failed':
          intervalMultiplier = 0.25;
          break;
        case 'difficult':
          intervalMultiplier = 0.5;
          break;
        case 'good':
          intervalMultiplier = 1;
          break;
        case 'easy':
          intervalMultiplier = 1.5;
          break;
      }
    }

    if (decay.predictedRetention < 50) {
      intervalMultiplier *= 0.5;
    }

    const intervalDays = Math.max(1, Math.round(baseInterval * intervalMultiplier));

    const now = new Date();
    const nextReview = new Date(now.getTime() + intervalDays * 24 * 60 * 60 * 1000);

    const windowBuffer = Math.max(1, Math.round(intervalDays * 0.2));
    const windowStart = new Date(nextReview.getTime() - windowBuffer * 24 * 60 * 60 * 1000);
    const windowEnd = new Date(nextReview.getTime() + windowBuffer * 24 * 60 * 60 * 1000);

    let priority: 'urgent' | 'normal' | 'low';
    if (decay.predictedRetention < 40 || (state.misconceptions?.length ?? 0) > 0) {
      priority = 'urgent';
    } else if (decay.predictedRetention < 60) {
      priority = 'normal';
    } else {
      priority = 'low';
    }

    return {
      nextReviewDate: nextReview.toISOString(),
      intervalDays,
      optimalWindowStart: windowStart.toISOString(),
      optimalWindowEnd: windowEnd.toISOString(),
      priority,
    };
  }

  async getReviewQueue(
    userId: string,
    options: { limit?: number; includeNotDue?: boolean } = {}
  ): Promise<{
    queue: {
      conceptId: string;
      concept: ConceptNode;
      priority: 'urgent' | 'normal' | 'low';
      predictedRetention: number;
      daysSinceReview: number;
      nextReviewDate: string;
      reason: string;
    }[];
    stats: {
      totalItems: number;
      urgent: number;
      normal: number;
      low: number;
      overdue: number;
    };
  }> {
    const limit = options.limit ?? 20;
    const includeNotDue = options.includeNotDue ?? false;

    const states = await this.getLearnerKnowledgeStates(userId);
    const now = new Date();

    const queue: {
      conceptId: string;
      concept: ConceptNode;
      priority: 'urgent' | 'normal' | 'low';
      predictedRetention: number;
      daysSinceReview: number;
      nextReviewDate: string;
      reason: string;
      sortScore: number;
    }[] = [];

    for (const state of states) {
      if (state.mastery < this.PARTIAL_MASTERY_THRESHOLD) continue;

      const concept = await this.getConcept(state.conceptId);
      if (!concept) continue;

      const decay = this.predictDecay(state, concept);
      const schedule = this.scheduleNextReview(state, concept);
      const nextReviewDate = new Date(schedule.nextReviewDate);
      const isOverdue = nextReviewDate <= now;

      if (!isOverdue && !includeNotDue) continue;

      let reason: string;
      if (isOverdue) {
        reason = `Overdue for review - retention at ${Math.round(decay.predictedRetention)}%`;
      } else if (decay.predictedRetention < 50) {
        reason = `Low retention (${Math.round(decay.predictedRetention)}%) - review soon`;
      } else if (state.misconceptions && state.misconceptions.length > 0) {
        reason = `Has ${state.misconceptions.length} misconception(s) to address`;
      } else {
        reason = `Scheduled review to maintain mastery`;
      }

      let sortScore = decay.predictedRetention;
      if (isOverdue) sortScore -= 100;
      if (schedule.priority === 'urgent') sortScore -= 50;
      else if (schedule.priority === 'normal') sortScore -= 25;
      if (state.misconceptions && state.misconceptions.length > 0) sortScore -= 20;

      queue.push({
        conceptId: state.conceptId,
        concept,
        priority: schedule.priority,
        predictedRetention: Math.round(decay.predictedRetention),
        daysSinceReview: decay.daysSinceReview,
        nextReviewDate: schedule.nextReviewDate,
        reason,
        sortScore,
      });
    }

    queue.sort((a, b) => a.sortScore - b.sortScore);

    const now_time = now.getTime();
    const stats = {
      totalItems: queue.length,
      urgent: queue.filter(q => q.priority === 'urgent').length,
      normal: queue.filter(q => q.priority === 'normal').length,
      low: queue.filter(q => q.priority === 'low').length,
      overdue: queue.filter(q => new Date(q.nextReviewDate).getTime() <= now_time).length,
    };

    return {
      queue: queue.slice(0, limit).map(({ sortScore, ...item }) => item),
      stats,
    };
  }

  async generateRemediationPlan(
    userId: string,
    options: { maxSteps?: number; focusType?: 'missing' | 'partial' | 'forgotten' | 'misconceptions' } = {}
  ): Promise<{
    plan: {
      steps: {
        order: number;
        type: 'review' | 'relearn' | 'correct_misconception' | 'new_learning';
        conceptId: string;
        concept: ConceptNode;
        action: string;
        estimatedTime: number;
        scaffolding: ScaffoldingStrategy[];
        resources?: string[];
      }[];
      estimatedTotalTime: number;
      priorityFocus: string;
    };
    gaps: {
      missing: { conceptId: string; concept: ConceptNode; reason: string }[];
      partial: { conceptId: string; concept: ConceptNode; mastery: number; reason: string }[];
      forgotten: { conceptId: string; concept: ConceptNode; predictedRetention: number; daysSinceReview: number; reason: string }[];
      misconceptions: { conceptId: string; concept: ConceptNode; misconceptions: Misconception[]; reason: string }[];
      summary: { total: number; critical: number; byType: Record<string, number> };
    };
  }> {
    const maxSteps = options.maxSteps ?? 10;

    const profile = await this.getLearnerProfile(userId);
    if (!profile) {
      throw new Error(`Learner not found: ${userId}`);
    }

    const gaps = await this.detectGaps(userId);
    const adjustments = this.adjustForPsychometrics(profile);

    const steps: {
      order: number;
      type: 'review' | 'relearn' | 'correct_misconception' | 'new_learning';
      conceptId: string;
      concept: ConceptNode;
      action: string;
      estimatedTime: number;
      scaffolding: ScaffoldingStrategy[];
      resources?: string[];
      priority: number;
    }[] = [];

    if (!options.focusType || options.focusType === 'misconceptions') {
      for (const gap of gaps.misconceptions) {
        const severity = gap.misconceptions.reduce((max, m) => {
          const scores: Record<'minor' | 'moderate' | 'major', number> = { minor: 1, moderate: 2, major: 3 };
          return Math.max(max, scores[m.severity] || 1);
        }, 0);

        steps.push({
          order: 0,
          type: 'correct_misconception',
          conceptId: gap.conceptId,
          concept: gap.concept,
          action: `Address ${gap.misconceptions.length} misconception(s): ${gap.misconceptions.map(m => m.description).join('; ')}`,
          estimatedTime: 15 + severity * 10,
          scaffolding: adjustments.scaffoldingStrategies,
          priority: 100 + severity * 10,
        });
      }
    }

    if (!options.focusType || options.focusType === 'forgotten') {
      for (const gap of gaps.forgotten) {
        const urgency = (100 - gap.predictedRetention) / 10;

        steps.push({
          order: 0,
          type: 'review',
          conceptId: gap.conceptId,
          concept: gap.concept,
          action: `Review to restore retention from ${Math.round(gap.predictedRetention)}% to ${this.MASTERY_THRESHOLD}%`,
          estimatedTime: 10 + Math.round(gap.concept.difficulty.absolute * 2),
          scaffolding: [
            { type: 'repetition', reason: 'Reinforce fading memory', priority: 9 },
            ...adjustments.scaffoldingStrategies.slice(0, 2),
          ],
          priority: 80 + urgency,
        });
      }
    }

    if (!options.focusType || options.focusType === 'partial') {
      for (const gap of gaps.partial) {
        const progress = gap.mastery / this.MASTERY_THRESHOLD;

        steps.push({
          order: 0,
          type: 'relearn',
          conceptId: gap.conceptId,
          concept: gap.concept,
          action: `Strengthen mastery from ${gap.mastery}% to ${this.MASTERY_THRESHOLD}%`,
          estimatedTime: Math.round(gap.concept.difficulty.absolute * 5 * (1 - progress)),
          scaffolding: adjustments.scaffoldingStrategies,
          priority: 60 + (1 - progress) * 20,
        });
      }
    }

    if (!options.focusType || options.focusType === 'missing') {
      for (const gap of gaps.missing) {
        steps.push({
          order: 0,
          type: 'new_learning',
          conceptId: gap.conceptId,
          concept: gap.concept,
          action: `Learn new concept - prerequisites are ready`,
          estimatedTime: gap.concept.timeEstimates?.basicMastery ?? (gap.concept.difficulty.absolute * 15),
          scaffolding: adjustments.scaffoldingStrategies,
          priority: 40 - gap.concept.difficulty.absolute,
        });
      }
    }

    steps.sort((a, b) => b.priority - a.priority);
    steps.forEach((step, idx) => {
      step.order = idx + 1;
    });

    const limitedSteps = steps.slice(0, maxSteps).map(({ priority, ...step }) => step);

    const estimatedTotalTime = limitedSteps.reduce((sum, step) => sum + step.estimatedTime, 0);

    let priorityFocus: string;
    if (gaps.misconceptions.length > 0) {
      priorityFocus = 'Addressing misconceptions first to prevent learning interference';
    } else if (gaps.forgotten.length > 0) {
      priorityFocus = 'Recovering forgotten knowledge before it decays further';
    } else if (gaps.partial.length > 0) {
      priorityFocus = 'Strengthening partial mastery to complete understanding';
    } else if (gaps.missing.length > 0) {
      priorityFocus = 'Building on prerequisites with new concepts';
    } else {
      priorityFocus = 'No significant gaps detected - maintain through spaced review';
    }

    return {
      plan: {
        steps: limitedSteps,
        estimatedTotalTime,
        priorityFocus,
      },
      gaps,
    };
  }
}

// Singleton instance for client-side use
let dbInstance: BrowserEducationGraphDB | null = null;

export async function getBrowserDB(): Promise<BrowserEducationGraphDB> {
  if (typeof window === 'undefined') {
    throw new Error('getBrowserDB can only be called in browser environment');
  }

  if (!dbInstance) {
    dbInstance = new BrowserEducationGraphDB('learngraph-db');
    await dbInstance.open();
  }

  return dbInstance;
}

export function resetBrowserDB(): void {
  dbInstance = null;
}
