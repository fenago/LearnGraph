'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from '@/app/components/Sidebar';
import { EtherealShadow } from '@/components/ui/ethereal-shadow';
import { Plus, Trash2, X, Save, BarChart3, AlertCircle, Loader2, AlertTriangle, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLearners, useConcepts, useDB } from '@/lib/DBContext';
import type { KnowledgeState } from '@/src/models/types';

const BLOOM_LEVELS = [
  'remember',
  'understand',
  'apply',
  'analyze',
  'evaluate',
  'create',
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' as const },
  },
};

function getMasteryColor(mastery: number): string {
  if (mastery >= 80) return 'bg-emerald-500';
  if (mastery >= 40) return 'bg-amber-500';
  return 'bg-red-500';
}

function getMasteryLabel(mastery: number): string {
  if (mastery >= 80) return 'Mastered';
  if (mastery >= 40) return 'Partial';
  return 'Gap';
}

function getMasteryBadgeStyle(mastery: number): string {
  if (mastery >= 80) return 'bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/20';
  if (mastery >= 40) return 'bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400';
  return 'bg-red-500/10 text-red-500 dark:bg-red-500/20';
}

export default function StatesPage() {
  const { db, isLoading: dbLoading, error: dbError, isReady } = useDB();
  const { learners, loading: learnersLoading } = useLearners();
  const { concepts, loading: conceptsLoading } = useConcepts();
  const [states, setStates] = useState<KnowledgeState[]>([]);
  const [statesLoading, setStatesLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    userId: '',
    conceptId: '',
    mastery: 50,
    bloomLevel: 'understand',
  });
  const [error, setError] = useState('');
  const [filterUser, setFilterUser] = useState('');
  const [filterConcept, setFilterConcept] = useState('');

  // Fetch all knowledge states
  const fetchStates = useCallback(async () => {
    if (!db || !isReady) return;
    setStatesLoading(true);
    try {
      // Get all learners and fetch their states
      const allStates: KnowledgeState[] = [];
      for (const learner of learners) {
        const learnerStates = await db.getLearnerKnowledgeStates(learner.userId);
        allStates.push(...learnerStates);
      }
      setStates(allStates);
    } catch (err) {
      setError('Failed to fetch knowledge states');
    } finally {
      setStatesLoading(false);
    }
  }, [db, isReady, learners]);

  useEffect(() => {
    if (isReady && learners.length > 0) {
      fetchStates();
    }
  }, [isReady, learners, fetchStates]);

  // Filter states based on user/concept selection
  const filteredStates = useMemo(() => {
    return states.filter(state => {
      if (filterUser && state.userId !== filterUser) return false;
      if (filterConcept && state.conceptId !== filterConcept) return false;
      return true;
    });
  }, [states, filterUser, filterConcept]);

  const loading = dbLoading || learnersLoading || conceptsLoading || statesLoading;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!db) {
      setError('Database not ready');
      return;
    }

    try {
      await db.setKnowledgeState(formData.userId, formData.conceptId, {
        mastery: formData.mastery,
        bloomLevel: formData.bloomLevel as any,
      });

      setShowForm(false);
      setFormData({ userId: '', conceptId: '', mastery: 50, bloomLevel: 'understand' });
      fetchStates();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  }

  async function handleDelete(userId: string, conceptId: string) {
    if (!confirm('Are you sure you want to delete this knowledge state?')) return;

    if (!db) {
      setError('Database not ready');
      return;
    }

    try {
      await db.deleteKnowledgeState(userId, conceptId);
      fetchStates();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  }

  function getLearnerName(userId: string): string {
    const learner = learners.find((l) => l.userId === userId);
    return learner?.name || userId;
  }

  function getConceptName(conceptId: string): string {
    const concept = concepts.find((c) => c.conceptId === conceptId);
    return concept?.name || conceptId;
  }

  const canCreateState = learners.length > 0 && concepts.length > 0;

  if (dbLoading) {
    return (
      <div className="flex min-h-screen bg-background items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">Initializing database...</p>
        </div>
      </div>
    );
  }

  if (dbError) {
    return (
      <div className="flex min-h-screen bg-background items-center justify-center">
        <div className="text-center text-destructive">
          <AlertCircle className="w-8 h-8 mx-auto mb-3" />
          <p>Database error: {dbError.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <main className="flex-1 relative overflow-hidden">
        {/* Background Effect */}
        <div className="absolute inset-0 pointer-events-none">
          <EtherealShadow
            color="rgba(245, 158, 11, 0.12)"
            animation={{ scale: 30, speed: 40 }}
            noise={{ opacity: 0.3, scale: 0.8 }}
          />
        </div>

        <div className="relative z-10 px-8 py-10 max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 rounded-xl bg-amber-500/10">
                <BarChart3 className="w-6 h-6 text-amber-500" />
              </div>
              <h1 className="text-3xl font-bold text-foreground">Knowledge States</h1>
            </div>
            <p className="text-muted-foreground ml-14">
              Track learner progress on concepts
            </p>
          </motion.div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive/20 flex items-center gap-3"
              >
                <AlertCircle className="w-5 h-5 text-destructive" />
                <span className="text-destructive">{error}</span>
                <button
                  onClick={() => setError('')}
                  className="ml-auto text-destructive/70 hover:text-destructive"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Warning if no learners/concepts */}
          <AnimatePresence>
            {!canCreateState && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-3"
              >
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <span className="text-amber-600 dark:text-amber-400">
                  You need at least 1 learner and 1 concept to track knowledge states.
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Actions Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6"
          >
            <button
              onClick={() => setShowForm(true)}
              disabled={!canCreateState}
              className="btn btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4" />
              Add Knowledge State
            </button>

            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-sm text-muted-foreground">Learner:</label>
                <select
                  value={filterUser}
                  onChange={(e) => setFilterUser(e.target.value)}
                  className="form-input py-2 min-w-[160px]"
                >
                  <option value="">All Learners</option>
                  {learners.map((l) => (
                    <option key={l.userId} value={l.userId}>
                      {l.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-sm text-muted-foreground">Concept:</label>
                <select
                  value={filterConcept}
                  onChange={(e) => setFilterConcept(e.target.value)}
                  className="form-input py-2 min-w-[160px]"
                >
                  <option value="">All Concepts</option>
                  {concepts.map((c) => (
                    <option key={c.conceptId} value={c.conceptId}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>

          {/* Form */}
          <AnimatePresence>
            {showForm && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="glass-card p-6 mb-6"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold text-foreground">
                    Track Knowledge State
                  </h2>
                  <button
                    onClick={() => setShowForm(false)}
                    className="p-2 rounded-lg hover:bg-muted transition-colors"
                  >
                    <X className="w-5 h-5 text-muted-foreground" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="form-label">
                        Learner <span className="text-destructive">*</span>
                      </label>
                      <select
                        value={formData.userId}
                        onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                        required
                        className="form-input"
                      >
                        <option value="">Select learner...</option>
                        {learners.map((l) => (
                          <option key={l.userId} value={l.userId}>
                            {l.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="form-label">
                        Concept <span className="text-destructive">*</span>
                      </label>
                      <select
                        value={formData.conceptId}
                        onChange={(e) => setFormData({ ...formData, conceptId: e.target.value })}
                        required
                        className="form-input"
                      >
                        <option value="">Select concept...</option>
                        {concepts.map((c) => (
                          <option key={c.conceptId} value={c.conceptId}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="form-label">
                      Mastery Level: {formData.mastery}%{' '}
                      <span className={cn(
                        'ml-2 px-2 py-0.5 rounded-full text-xs font-medium',
                        getMasteryBadgeStyle(formData.mastery)
                      )}>
                        {getMasteryLabel(formData.mastery)}
                      </span>
                    </label>
                    <div className="mt-2">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={formData.mastery}
                        onChange={(e) => setFormData({ ...formData, mastery: parseInt(e.target.value) })}
                        className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-amber-500"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>0% (No Knowledge)</span>
                        <span>100% (Mastered)</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="form-label">Bloom Level</label>
                    <select
                      value={formData.bloomLevel}
                      onChange={(e) => setFormData({ ...formData, bloomLevel: e.target.value })}
                      className="form-input"
                    >
                      {BLOOM_LEVELS.map((level) => (
                        <option key={level} value={level}>
                          {level.charAt(0).toUpperCase() + level.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button type="submit" className="btn btn-success flex items-center gap-2">
                      <Save className="w-4 h-4" />
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="btn btn-secondary"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Content */}
          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">Loading knowledge states...</p>
            </motion.div>
          ) : states.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16 glass-card"
            >
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">No knowledge states yet</h3>
              <p className="text-muted-foreground mb-6">
                Click &quot;Add Knowledge State&quot; to start tracking learner progress
              </p>
              {canCreateState && (
                <button onClick={() => setShowForm(true)} className="btn btn-primary">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Knowledge State
                </button>
              )}
            </motion.div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="glass-card overflow-hidden"
            >
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/50">
                      <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Learner
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Concept
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Mastery
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Bloom Level
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Last Accessed
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30">
                    {filteredStates.map((state, index) => (
                      <motion.tr
                        key={`${state.userId}-${state.conceptId}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                        className="hover:bg-muted/30 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
                              <User className="w-4 h-4 text-white" />
                            </div>
                            <span className="font-medium text-foreground">{getLearnerName(state.userId)}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-foreground">{getConceptName(state.conceptId)}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className={cn('h-full transition-all', getMasteryColor(state.mastery))}
                                style={{ width: `${state.mastery}%` }}
                              />
                            </div>
                            <span className={cn(
                              'text-xs font-medium px-2 py-0.5 rounded-full',
                              getMasteryBadgeStyle(state.mastery)
                            )}>
                              {state.mastery}%
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded text-xs font-medium">
                            {state.bloomLevel || '—'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                          {state.lastAccessed
                            ? new Date(state.lastAccessed).toLocaleDateString()
                            : '—'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <button
                            onClick={() => handleDelete(state.userId, state.conceptId)}
                            className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}
