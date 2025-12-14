/**
 * Core type definitions for LearnGraph Database
 * Phase 1: Foundation types for learners, concepts, and knowledge states
 */

// =============================================================================
// KEY PREFIX SCHEMA
// =============================================================================

/**
 * Database key prefixes for organizing data
 * - learner:* - Learner profiles and related data
 * - concept:* - Knowledge graph concept nodes
 * - edge:* - Prerequisite and related edges
 * - state:* - Knowledge states (learner + concept)
 * - index:* - Secondary indexes for queries
 */
export const KEY_PREFIXES = {
  LEARNER: 'learner',
  CONCEPT: 'concept',
  EDGE: 'edge',
  STATE: 'state',
  INDEX: 'index',
} as const;

export type KeyPrefix = typeof KEY_PREFIXES[keyof typeof KEY_PREFIXES];

// =============================================================================
// LEARNER MODEL (Graph A)
// =============================================================================

/**
 * Learning modality preferences
 */
export type LearningModality = 'visual' | 'auditory' | 'kinesthetic' | 'reading';

/**
 * Psychometric domain score with confidence
 */
export interface PsychometricScore {
  score: number;        // 0-100 normalized score
  confidence: number;   // 0-1 confidence in this score
  lastUpdated: string;  // ISO date string
  source?: string;      // Where this score came from
}

/**
 * Learning style derived from psychometrics
 */
export interface LearningStyle {
  primary: LearningModality;
  secondary?: LearningModality;
  socialPreference: 'solo' | 'collaborative' | 'mixed';
  pacePreference: 'self-paced' | 'structured' | 'intensive';
  feedbackPreference: 'immediate' | 'delayed' | 'on-request';
}

/**
 * Cognitive profile derived from psychometrics
 */
export interface CognitiveProfile {
  workingMemoryCapacity: 'low' | 'medium' | 'high';
  attentionSpan: 'short' | 'medium' | 'long';
  processingSpeed: 'slow' | 'medium' | 'fast';
  abstractThinking: 'concrete' | 'mixed' | 'abstract';
}

/**
 * Core learner profile
 */
export interface LearnerProfile {
  userId: string;
  name?: string;
  email?: string;
  createdAt: string;
  updatedAt: string;

  // Psychometric scores (39 domains - all optional)
  psychometricScores: Record<string, PsychometricScore>;

  // Derived profiles (computed from psychometrics)
  learningStyle?: LearningStyle;
  cognitiveProfile?: CognitiveProfile;

  // Metadata
  tags?: string[];
  notes?: string;
}

// =============================================================================
// KNOWLEDGE MODEL (Graph B)
// =============================================================================

/**
 * Bloom's Taxonomy levels (1-6)
 */
export type BloomLevel = 1 | 2 | 3 | 4 | 5 | 6;

export const BLOOM_LEVELS = {
  REMEMBER: 1,
  UNDERSTAND: 2,
  APPLY: 3,
  ANALYZE: 4,
  EVALUATE: 5,
  CREATE: 6,
} as const;

/**
 * Bloom level learning objectives
 */
export interface BloomObjectives {
  remember?: string[];
  understand?: string[];
  apply?: string[];
  analyze?: string[];
  evaluate?: string[];
  create?: string[];
}

/**
 * Concept difficulty metrics
 */
export interface ConceptDifficulty {
  absolute: number;       // 1-10 overall difficulty
  cognitiveLoad: number;  // 0-1 working memory demand
  abstractness: number;   // 0-1 concrete to abstract
}

/**
 * Time estimates for concept mastery (in minutes)
 */
export interface TimeEstimates {
  introduction: number;
  basicMastery: number;
  deepMastery: number;
}

/**
 * Concept node in knowledge graph
 */
export interface ConceptNode {
  conceptId: string;
  name: string;
  domain: string;
  subdomain?: string;
  description: string;

  difficulty: ConceptDifficulty;
  bloomObjectives?: BloomObjectives;
  timeEstimates?: TimeEstimates;

  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Edge strength for prerequisites
 */
export type EdgeStrength = 'required' | 'recommended' | 'helpful';

/**
 * Prerequisite edge connecting concepts
 */
export interface PrerequisiteEdge {
  edgeId: string;
  from: string;           // Prerequisite concept ID
  to: string;             // Target concept ID
  strength: EdgeStrength;
  reason?: string;
  createdAt: string;
}

/**
 * Related edge (non-prerequisite relationship)
 */
export interface RelatedEdge {
  edgeId: string;
  conceptA: string;
  conceptB: string;
  relationship: string;   // e.g., "similar", "contrasts", "extends"
  bidirectional: boolean;
  createdAt: string;
}

// =============================================================================
// KNOWLEDGE STATE (Bridge between Graph A and B)
// =============================================================================

/**
 * Misconception record
 */
export interface Misconception {
  id: string;
  description: string;
  severity: 'minor' | 'moderate' | 'major';
  identified: string;     // ISO date
  resolved?: string;      // ISO date when corrected
}

/**
 * Learning interaction record
 */
export interface LearningInteraction {
  timestamp: string;
  type: 'lesson' | 'quiz' | 'practice' | 'review';
  duration: number;       // minutes
  score?: number;         // 0-100 if applicable
  bloomLevel?: BloomLevel;
  notes?: string;
}

/**
 * Knowledge state for a learner on a specific concept
 */
export interface KnowledgeState {
  userId: string;
  conceptId: string;

  // Mastery tracking
  mastery: number;        // 0-100 current mastery level
  bloomLevel: BloomLevel; // Highest demonstrated Bloom level

  // Timing
  firstSeen?: string;     // ISO date
  lastAccessed?: string;  // ISO date
  lastAssessed?: string;  // ISO date
  lastReviewed?: string;  // ISO date for spaced repetition tracking
  nextReview?: string;    // ISO date for spaced repetition

  // Retention (Ebbinghaus)
  retentionStrength: number;  // 0-1 memory strength
  reviewCount: number;        // Number of reviews

  // Issues
  misconceptions: Misconception[];

  // History
  interactions: LearningInteraction[];

  updatedAt: string;
}

// =============================================================================
// DATABASE OPERATIONS
// =============================================================================

/**
 * Batch operation types
 */
export type BatchOperationType = 'put' | 'del';

export interface BatchOperation {
  type: BatchOperationType;
  key: string;
  value?: unknown;
}

/**
 * Query options for listing
 */
export interface QueryOptions {
  prefix?: string;
  limit?: number;
  offset?: number;
  reverse?: boolean;
}

/**
 * Database statistics
 */
export interface DBStats {
  learnerCount: number;
  conceptCount: number;
  edgeCount: number;
  stateCount: number;
}

// =============================================================================
// ZPD ENGINE (Zone of Proximal Development)
// =============================================================================

/**
 * Zone classification for a concept relative to a learner
 */
export type ZoneType = 'too_easy' | 'zpd' | 'too_hard' | 'unknown';

/**
 * A concept classified into a learning zone
 */
export interface ZonedConcept {
  concept: ConceptNode;
  zone: ZoneType;
  readiness: number;           // 0-1 how ready to learn
  prerequisitesMet: number;    // Percentage of prerequisites mastered
  missingPrerequisites: string[]; // Concept IDs that need to be learned first
  recommendedOrder: number;    // Suggested learning order (lower = sooner)
  reason: string;              // Human-readable explanation
}

/**
 * Scaffolding strategy for teaching a concept
 */
export interface ScaffoldingStrategy {
  type: 'worked_example' | 'guided_practice' | 'hints' | 'visual_aids' | 'chunking' | 'peer_discussion' | 'analogy' | 'repetition';
  reason: string;
  priority: number;  // 1-10, higher = more important
}

/**
 * Psychometric adjustments for learning recommendations
 */
export interface PsychometricAdjustments {
  difficultyModifier: number;      // -0.5 to +0.5, adjusts concept difficulty threshold
  paceRecommendation: 'slower' | 'normal' | 'faster';
  attentionConsiderations: string[];
  scaffoldingStrategies: ScaffoldingStrategy[];
  presentationStyle: 'visual' | 'verbal' | 'hands_on' | 'mixed';
}

/**
 * A recommended concept in the ZPD with full context
 */
export interface ZPDRecommendation {
  concept: ConceptNode;
  readinessScore: number;      // 0-1, how ready to learn
  estimatedMasteryTime: number; // minutes
  psychometricMatch: number;    // 0-1, how well this matches learner profile
  scaffoldingStrategies: ScaffoldingStrategy[];
  reasons: string[];            // Why this is recommended
  prerequisiteChain: string[];  // Concept IDs to show "First learn: A → B → C"
}

/**
 * Full ZPD computation result
 */
export interface ZPDResult {
  userId: string;
  computedAt: string;
  computationTimeMs: number;

  // Zone partitions
  tooEasy: ZonedConcept[];
  zpd: ZonedConcept[];
  tooHard: ZonedConcept[];

  // Top recommendations
  recommendations: ZPDRecommendation[];

  // Psychometric context
  psychometricAdjustments: PsychometricAdjustments;

  // Learning path
  suggestedPath: string[];  // Ordered list of concept IDs to learn
}

/**
 * Learning path step
 */
export interface LearningPathStep {
  conceptId: string;
  concept: ConceptNode;
  estimatedDuration: number;  // minutes
  scaffolding: ScaffoldingStrategy[];
  milestones: string[];       // What learner will be able to do after
}
