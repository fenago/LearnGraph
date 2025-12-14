'use client';

/**
 * React Context for browser-based database access
 * Provides the BrowserEducationGraphDB instance to all components
 */

import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { BrowserEducationGraphDB, getBrowserDB } from './browser-db';
import type {
  LearnerProfile,
  ConceptNode,
  PrerequisiteEdge,
  KnowledgeState,
  DBStats,
  ZPDResult,
} from '../src/models/types';

// Demo data for initial seeding
import { demoLearners, demoConcepts, demoEdges, demoKnowledgeStates } from './demo-data';

interface DBContextValue {
  db: BrowserEducationGraphDB | null;
  isLoading: boolean;
  error: Error | null;
  isReady: boolean;
}

const DBContext = createContext<DBContextValue>({
  db: null,
  isLoading: true,
  error: null,
  isReady: false,
});

interface DBProviderProps {
  children: ReactNode;
  seedDemoData?: boolean;
}

export function DBProvider({ children, seedDemoData = true }: DBProviderProps) {
  const [db, setDb] = useState<BrowserEducationGraphDB | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    async function initDB() {
      try {
        const database = await getBrowserDB();

        if (!mounted) return;

        // Check if we need to seed demo data
        if (seedDemoData) {
          const stats = await database.getStats();

          // Only seed if database is empty
          if (stats.learnerCount === 0 && stats.conceptCount === 0) {
            console.log('Seeding demo data...');

            // Seed learners
            for (const learner of demoLearners) {
              await database.setLearnerProfile(learner.userId, {
                name: learner.name,
                email: learner.email,
                learningStyle: learner.learningStyle as any,
                cognitiveProfile: learner.cognitiveProfile as any,
                psychometricScores: learner.psychometricScores as any,
                tags: learner.tags,
                notes: learner.notes,
              });
            }

            // Seed concepts
            for (const concept of demoConcepts) {
              // Demo data uses 'id' but actual type uses 'conceptId'
              const conceptId = (concept as any).id?.replace('concept:', '') || (concept as any).conceptId;
              const difficultyValue = typeof concept.difficulty === 'number' ? concept.difficulty : 5;
              const estimatedMins = (concept as any).estimatedMinutes || 60;
              await database.addConcept({
                conceptId,
                name: concept.name,
                domain: concept.domain,
                description: concept.description || '',
                difficulty: {
                  absolute: difficultyValue,
                  cognitiveLoad: 0.5,
                  abstractness: 0.5,
                },
                timeEstimates: {
                  introduction: Math.round(estimatedMins / 4),
                  basicMastery: estimatedMins,
                  deepMastery: estimatedMins * 2,
                },
              });
            }

            // Seed edges
            for (const edge of demoEdges) {
              const from = edge.from.replace('concept:', '');
              const to = edge.to.replace('concept:', '');
              // Demo data uses 'weight' but actual type uses 'strength'
              const weight = (edge as any).weight ?? 1.0;
              await database.addEdge({
                from,
                to,
                strength: weight >= 0.9 ? 'required' : weight >= 0.7 ? 'recommended' : 'helpful',
              });
            }

            // Seed knowledge states
            for (const state of demoKnowledgeStates) {
              // Demo data uses 'learnerId' but format varies
              const learnerId = ((state as any).learnerId || '').replace('demo-', '');
              const conceptId = (state.conceptId || '').replace('concept:', '');
              const confidence = (state as any).confidence ?? 0.8;
              const lastReviewed = (state as any).lastReviewed || new Date().toISOString();
              const reviewCount = (state as any).reviewCount ?? 0;

              if (learnerId && conceptId) {
                await database.setKnowledgeState(
                  learnerId,
                  conceptId,
                  {
                    mastery: state.mastery,
                    retentionStrength: confidence,
                    lastReviewed: lastReviewed,
                    reviewCount: reviewCount,
                  }
                );
              }
            }

            console.log('Demo data seeded successfully!');
          }
        }

        setDb(database);
        setIsLoading(false);
      } catch (err) {
        console.error('Failed to initialize database:', err);
        if (mounted) {
          setError(err instanceof Error ? err : new Error('Failed to initialize database'));
          setIsLoading(false);
        }
      }
    }

    initDB();

    return () => {
      mounted = false;
    };
  }, [seedDemoData]);

  const value: DBContextValue = {
    db,
    isLoading,
    error,
    isReady: !isLoading && !error && db !== null,
  };

  return <DBContext.Provider value={value}>{children}</DBContext.Provider>;
}

/**
 * Hook to access the database context
 */
export function useDB() {
  const context = useContext(DBContext);
  if (!context) {
    throw new Error('useDB must be used within a DBProvider');
  }
  return context;
}

/**
 * Hook for learner operations
 */
export function useLearners() {
  const { db, isReady } = useDB();
  const [learners, setLearners] = useState<LearnerProfile[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!db || !isReady) return;
    setLoading(true);
    try {
      const data = await db.listLearnerProfiles();
      setLearners(data);
    } catch (err) {
      console.error('Failed to fetch learners:', err);
    } finally {
      setLoading(false);
    }
  }, [db, isReady]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const createLearner = useCallback(async (userId: string, profile: Partial<LearnerProfile>) => {
    if (!db) throw new Error('Database not ready');
    const learner = await db.setLearnerProfile(userId, profile);
    await refresh();
    return learner;
  }, [db, refresh]);

  const updateLearner = useCallback(async (userId: string, profile: Partial<LearnerProfile>) => {
    if (!db) throw new Error('Database not ready');
    const learner = await db.setLearnerProfile(userId, profile);
    await refresh();
    return learner;
  }, [db, refresh]);

  const deleteLearner = useCallback(async (userId: string) => {
    if (!db) throw new Error('Database not ready');
    await db.deleteLearnerProfile(userId);
    await refresh();
  }, [db, refresh]);

  const getLearner = useCallback(async (userId: string) => {
    if (!db) throw new Error('Database not ready');
    return db.getLearnerProfile(userId);
  }, [db]);

  return {
    learners,
    loading,
    refresh,
    createLearner,
    updateLearner,
    deleteLearner,
    getLearner,
  };
}

/**
 * Hook for concept operations
 */
export function useConcepts() {
  const { db, isReady } = useDB();
  const [concepts, setConcepts] = useState<ConceptNode[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!db || !isReady) return;
    setLoading(true);
    try {
      const data = await db.listConcepts();
      setConcepts(data);
    } catch (err) {
      console.error('Failed to fetch concepts:', err);
    } finally {
      setLoading(false);
    }
  }, [db, isReady]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const createConcept = useCallback(async (concept: Partial<ConceptNode> & { conceptId: string }) => {
    if (!db) throw new Error('Database not ready');
    const created = await db.addConcept(concept);
    await refresh();
    return created;
  }, [db, refresh]);

  const updateConcept = useCallback(async (concept: Partial<ConceptNode> & { conceptId: string }) => {
    if (!db) throw new Error('Database not ready');
    const updated = await db.addConcept(concept);
    await refresh();
    return updated;
  }, [db, refresh]);

  const deleteConcept = useCallback(async (conceptId: string) => {
    if (!db) throw new Error('Database not ready');
    await db.deleteConcept(conceptId);
    await refresh();
  }, [db, refresh]);

  const getConcept = useCallback(async (conceptId: string) => {
    if (!db) throw new Error('Database not ready');
    return db.getConcept(conceptId);
  }, [db]);

  const searchConcepts = useCallback(async (query: string) => {
    if (!db) throw new Error('Database not ready');
    return db.searchConcepts(query);
  }, [db]);

  return {
    concepts,
    loading,
    refresh,
    createConcept,
    updateConcept,
    deleteConcept,
    getConcept,
    searchConcepts,
  };
}

/**
 * Hook for edge operations
 */
export function useEdges() {
  const { db, isReady } = useDB();
  const [edges, setEdges] = useState<PrerequisiteEdge[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!db || !isReady) return;
    setLoading(true);
    try {
      const data = await db.listEdges();
      setEdges(data);
    } catch (err) {
      console.error('Failed to fetch edges:', err);
    } finally {
      setLoading(false);
    }
  }, [db, isReady]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const createEdge = useCallback(async (edge: { from: string; to: string; strength?: string; reason?: string }) => {
    if (!db) throw new Error('Database not ready');
    const created = await db.addEdge(edge);
    await refresh();
    return created;
  }, [db, refresh]);

  const deleteEdge = useCallback(async (from: string, to: string) => {
    if (!db) throw new Error('Database not ready');
    await db.deleteEdge(from, to);
    await refresh();
  }, [db, refresh]);

  const getPrerequisites = useCallback(async (conceptId: string) => {
    if (!db) throw new Error('Database not ready');
    return db.getPrerequisites(conceptId);
  }, [db]);

  const getDependents = useCallback(async (conceptId: string) => {
    if (!db) throw new Error('Database not ready');
    return db.getDependents(conceptId);
  }, [db]);

  return {
    edges,
    loading,
    refresh,
    createEdge,
    deleteEdge,
    getPrerequisites,
    getDependents,
  };
}

/**
 * Hook for knowledge state operations
 */
export function useKnowledgeStates(userId?: string) {
  const { db, isReady } = useDB();
  const [states, setStates] = useState<KnowledgeState[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!db || !isReady || !userId) return;
    setLoading(true);
    try {
      const data = await db.getLearnerKnowledgeStates(userId);
      setStates(data);
    } catch (err) {
      console.error('Failed to fetch knowledge states:', err);
    } finally {
      setLoading(false);
    }
  }, [db, isReady, userId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const setKnowledgeState = useCallback(async (
    learnerId: string,
    conceptId: string,
    state: Partial<KnowledgeState>
  ) => {
    if (!db) throw new Error('Database not ready');
    const updated = await db.setKnowledgeState(learnerId, conceptId, state);
    await refresh();
    return updated;
  }, [db, refresh]);

  const deleteKnowledgeState = useCallback(async (learnerId: string, conceptId: string) => {
    if (!db) throw new Error('Database not ready');
    await db.deleteKnowledgeState(learnerId, conceptId);
    await refresh();
  }, [db, refresh]);

  return {
    states,
    loading,
    refresh,
    setKnowledgeState,
    deleteKnowledgeState,
  };
}

/**
 * Hook for ZPD computations
 */
export function useZPD(userId?: string) {
  const { db, isReady } = useDB();
  const [zpd, setZpd] = useState<ZPDResult | null>(null);
  const [loading, setLoading] = useState(false);

  const computeZPD = useCallback(async (options?: { limit?: number }) => {
    if (!db || !isReady || !userId) return null;
    setLoading(true);
    try {
      const result = await db.computeZPD(userId, options);
      setZpd(result);
      return result;
    } catch (err) {
      console.error('Failed to compute ZPD:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [db, isReady, userId]);

  const generateLearningPath = useCallback(async (maxConcepts?: number) => {
    if (!db || !userId) throw new Error('Database not ready or no user');
    return db.generateLearningPath(userId, maxConcepts);
  }, [db, userId]);

  return {
    zpd,
    loading,
    computeZPD,
    generateLearningPath,
  };
}

/**
 * Hook for gap analysis
 */
export function useGapAnalysis(userId?: string) {
  const { db, isReady } = useDB();

  const detectGaps = useCallback(async (options?: Parameters<BrowserEducationGraphDB['detectGaps']>[1]) => {
    if (!db || !isReady || !userId) throw new Error('Database not ready or no user');
    return db.detectGaps(userId, options);
  }, [db, isReady, userId]);

  const getReviewQueue = useCallback(async (options?: Parameters<BrowserEducationGraphDB['getReviewQueue']>[1]) => {
    if (!db || !isReady || !userId) throw new Error('Database not ready or no user');
    return db.getReviewQueue(userId, options);
  }, [db, isReady, userId]);

  const generateRemediationPlan = useCallback(async (options?: Parameters<BrowserEducationGraphDB['generateRemediationPlan']>[1]) => {
    if (!db || !isReady || !userId) throw new Error('Database not ready or no user');
    return db.generateRemediationPlan(userId, options);
  }, [db, isReady, userId]);

  return {
    detectGaps,
    getReviewQueue,
    generateRemediationPlan,
  };
}

/**
 * Hook for database stats
 */
export function useDBStats() {
  const { db, isReady } = useDB();
  const [stats, setStats] = useState<DBStats | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!db || !isReady) return;
    setLoading(true);
    try {
      const data = await db.getStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    } finally {
      setLoading(false);
    }
  }, [db, isReady]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const clearDatabase = useCallback(async () => {
    if (!db) throw new Error('Database not ready');
    await db.clear();
    await refresh();
  }, [db, refresh]);

  return {
    stats,
    loading,
    refresh,
    clearDatabase,
  };
}
