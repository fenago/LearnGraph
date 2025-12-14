'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Sparkles,
  Clock,
  Target,
  BookOpen,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Zap,
  Brain,
  Route,
} from 'lucide-react';
import { Sidebar } from '../components/Sidebar';
import { cn } from '@/lib/utils';

interface ScaffoldingStrategy {
  type: string;
  reason: string;
  priority: number;
}

interface ConceptNode {
  conceptId: string;
  name: string;
  domain: string;
  description: string;
  difficulty: {
    absolute: number;
    cognitiveLoad: number;
    abstractness: number;
  };
}

interface ZPDRecommendation {
  concept: ConceptNode;
  readinessScore: number;
  estimatedMasteryTime: number;
  psychometricMatch: number;
  scaffoldingStrategies: ScaffoldingStrategy[];
  reasons: string[];
  prerequisiteChain: string[];
}

interface ZonedConcept {
  concept: ConceptNode;
  zone: 'too_easy' | 'zpd' | 'too_hard';
  readiness: number;
  prerequisitesMet: number;
  missingPrerequisites: string[];
  reason: string;
}

interface PsychometricAdjustments {
  difficultyModifier: number;
  paceRecommendation: 'slower' | 'normal' | 'faster';
  attentionConsiderations: string[];
  scaffoldingStrategies: ScaffoldingStrategy[];
  presentationStyle: string;
}

interface ZPDResult {
  userId: string;
  computedAt: string;
  computationTimeMs: number;
  tooEasy: ZonedConcept[];
  zpd: ZonedConcept[];
  tooHard: ZonedConcept[];
  recommendations: ZPDRecommendation[];
  psychometricAdjustments: PsychometricAdjustments;
  suggestedPath: string[];
}

interface Learner {
  userId: string;
  name?: string;
}

const SCAFFOLDING_ICONS: Record<string, string> = {
  worked_example: '📝',
  guided_practice: '🎯',
  hints: '💡',
  visual_aids: '🖼️',
  chunking: '🧩',
  peer_discussion: '👥',
  analogy: '🔗',
  repetition: '🔄',
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
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

const tabVariants = {
  inactive: { scale: 1 },
  active: { scale: 1.02 },
};

export default function RecommendationsPage() {
  const [learners, setLearners] = useState<Learner[]>([]);
  const [selectedLearner, setSelectedLearner] = useState<string>('');
  const [zpd, setZpd] = useState<ZPDResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'recommendations' | 'zones' | 'path'>('recommendations');

  useEffect(() => {
    fetch('/api/learners')
      .then((res) => res.json())
      .then((data) => {
        setLearners(data);
        if (data.length > 0) {
          setSelectedLearner(data[0].userId);
        }
      })
      .catch((err) => console.error('Failed to load learners:', err));
  }, []);

  useEffect(() => {
    if (!selectedLearner) return;

    setLoading(true);
    setError(null);

    fetch(`/api/zpd?userId=${encodeURIComponent(selectedLearner)}&limit=10`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to compute recommendations');
        return res.json();
      })
      .then((data) => {
        setZpd(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [selectedLearner]);

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty <= 3) return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400';
    if (difficulty <= 6) return 'bg-amber-500/10 text-amber-600 dark:text-amber-400';
    return 'bg-red-500/10 text-red-600 dark:text-red-400';
  };

  const getReadinessColor = (readiness: number) => {
    if (readiness >= 0.8) return 'text-emerald-500';
    if (readiness >= 0.5) return 'text-amber-500';
    return 'text-red-500';
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <main className="flex-1 px-8 py-10 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 shadow-lg shadow-pink-500/25">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">
              What Should I Learn Next?
            </h1>
          </div>
          <p className="text-muted-foreground ml-14">
            Personalized recommendations based on your profile and progress
          </p>
        </motion.div>

        {/* Learner Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="glass-card p-5 mb-6"
        >
          <div className="flex items-center gap-4">
            <label className="font-medium text-foreground">Select Learner:</label>
            <select
              value={selectedLearner}
              onChange={(e) => setSelectedLearner(e.target.value)}
              className="form-input flex-1 max-w-xs"
            >
              {learners.map((learner) => (
                <option key={learner.userId} value={learner.userId}>
                  {learner.name || learner.userId}
                </option>
              ))}
            </select>
            {zpd && (
              <span className="text-sm text-muted-foreground">
                Computed in {zpd.computationTimeMs}ms
              </span>
            )}
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {loading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="glass-card text-center py-16"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full mx-auto mb-4"
              />
              <p className="text-muted-foreground">Computing personalized recommendations...</p>
            </motion.div>
          )}

          {error && (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="glass-card bg-destructive/10 border-destructive/20"
            >
              <p className="text-destructive p-5">{error}</p>
            </motion.div>
          )}

          {zpd && !loading && (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Psychometric Summary */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-card p-5 mb-6 bg-gradient-to-r from-primary/5 to-purple-500/5"
              >
                <h2 className="font-semibold mb-4 flex items-center gap-2 text-foreground">
                  <Brain className="w-5 h-5 text-purple-500" />
                  Your Learning Profile
                </h2>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div className="p-3 rounded-xl bg-background/50">
                    <span className="text-muted-foreground">Pace:</span>{' '}
                    <span className="font-medium text-foreground capitalize">
                      {zpd.psychometricAdjustments.paceRecommendation}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-background/50">
                    <span className="text-muted-foreground">Style:</span>{' '}
                    <span className="font-medium text-foreground capitalize">
                      {zpd.psychometricAdjustments.presentationStyle.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-background/50">
                    <span className="text-muted-foreground">Difficulty Modifier:</span>{' '}
                    <span className="font-medium text-foreground">
                      {zpd.psychometricAdjustments.difficultyModifier > 0 ? '+' : ''}
                      {(zpd.psychometricAdjustments.difficultyModifier * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
                {zpd.psychometricAdjustments.attentionConsiderations.length > 0 && (
                  <div className="mt-4 text-sm">
                    <span className="text-muted-foreground">Considerations:</span>
                    <ul className="mt-2 space-y-1.5">
                      {zpd.psychometricAdjustments.attentionConsiderations.map((c, i) => (
                        <li key={i} className="flex items-start gap-2 text-foreground">
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5" />
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>

              {/* Tabs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex gap-2 mb-6"
              >
                {[
                  { id: 'recommendations', icon: Target, label: `Recommendations (${zpd.recommendations.length})` },
                  { id: 'zones', icon: TrendingUp, label: 'Zone Analysis' },
                  { id: 'path', icon: Route, label: 'Learning Path' },
                ].map((tab) => (
                  <motion.button
                    key={tab.id}
                    variants={tabVariants}
                    animate={activeTab === tab.id ? 'active' : 'inactive'}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveTab(tab.id as typeof activeTab)}
                    className={cn(
                      'px-4 py-2.5 rounded-xl font-medium transition-all duration-200 flex items-center gap-2',
                      activeTab === tab.id
                        ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                        : 'bg-secondary hover:bg-secondary/80 text-secondary-foreground'
                    )}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </motion.button>
                ))}
              </motion.div>

              {/* Recommendations Tab */}
              <AnimatePresence mode="wait">
                {activeTab === 'recommendations' && (
                  <motion.div
                    key="recommendations"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0 }}
                    className="space-y-4"
                  >
                    {zpd.recommendations.length === 0 ? (
                      <motion.div variants={itemVariants} className="glass-card text-center py-16">
                        <CheckCircle2 className="w-14 h-14 text-emerald-500 mx-auto mb-4" />
                        <p className="text-lg font-medium text-foreground">All caught up!</p>
                        <p className="text-muted-foreground">No new concepts ready to learn right now.</p>
                      </motion.div>
                    ) : (
                      zpd.recommendations.map((rec, idx) => (
                        <motion.div
                          key={rec.concept.conceptId}
                          variants={itemVariants}
                          whileHover={{ y: -2 }}
                          className="glass-card p-5 hover:shadow-xl transition-all duration-300"
                        >
                          <div className="flex items-start gap-4">
                            <div className="text-3xl font-bold bg-gradient-to-br from-primary/20 to-purple-500/20 text-primary w-12 h-12 rounded-xl flex items-center justify-center">
                              {idx + 1}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2 flex-wrap">
                                <h3 className="text-xl font-semibold text-foreground">{rec.concept.name}</h3>
                                <span className={cn('px-2.5 py-0.5 rounded-lg text-xs font-medium', getDifficultyColor(rec.concept.difficulty.absolute))}>
                                  Level {rec.concept.difficulty.absolute}
                                </span>
                                <span className="px-2.5 py-0.5 rounded-lg text-xs bg-muted text-muted-foreground">
                                  {rec.concept.domain}
                                </span>
                              </div>

                              <p className="text-muted-foreground mb-4">{rec.concept.description}</p>

                              {/* Metrics */}
                              <div className="flex flex-wrap gap-4 mb-4 text-sm">
                                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary/50">
                                  <Zap className={cn('w-4 h-4', getReadinessColor(rec.readinessScore))} />
                                  <span className="text-foreground">Readiness: {Math.round(rec.readinessScore * 100)}%</span>
                                </div>
                                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary/50">
                                  <Clock className="w-4 h-4 text-muted-foreground" />
                                  <span className="text-foreground">Est. time: {formatDuration(rec.estimatedMasteryTime)}</span>
                                </div>
                                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary/50">
                                  <Brain className="w-4 h-4 text-purple-500" />
                                  <span className="text-foreground">Profile match: {Math.round(rec.psychometricMatch * 100)}%</span>
                                </div>
                              </div>

                              {/* Reasons */}
                              {rec.reasons.length > 0 && (
                                <div className="mb-4">
                                  <span className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                                    Why this concept?
                                  </span>
                                  <ul className="mt-2 space-y-1.5">
                                    {rec.reasons.map((reason, i) => (
                                      <li key={i} className="text-sm flex items-start gap-2 text-foreground">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                                        {reason}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {/* Prerequisites */}
                              {rec.prerequisiteChain.length > 0 && (
                                <div className="mb-4">
                                  <span className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                                    Prerequisite Chain
                                  </span>
                                  <div className="mt-2 flex flex-wrap gap-1.5 items-center">
                                    {rec.prerequisiteChain.map((prereq, i) => (
                                      <span key={i} className="flex items-center gap-1.5">
                                        {i > 0 && <span className="text-muted-foreground">→</span>}
                                        <span className="px-2.5 py-1 bg-secondary rounded-lg text-sm text-foreground">
                                          {prereq}
                                        </span>
                                      </span>
                                    ))}
                                    <span className="text-muted-foreground">→</span>
                                    <span className="px-2.5 py-1 bg-primary/10 text-primary rounded-lg text-sm font-medium">
                                      {rec.concept.name}
                                    </span>
                                  </div>
                                </div>
                              )}

                              {/* Scaffolding Strategies */}
                              <div>
                                <span className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                                  Recommended Teaching Strategies
                                </span>
                                <div className="mt-2 flex flex-wrap gap-2">
                                  {rec.scaffoldingStrategies.map((strategy, i) => (
                                    <motion.span
                                      key={i}
                                      whileHover={{ scale: 1.05 }}
                                      className="px-3 py-1.5 bg-purple-500/10 rounded-full text-sm flex items-center gap-1.5 text-foreground cursor-default"
                                      title={strategy.reason}
                                    >
                                      <span>{SCAFFOLDING_ICONS[strategy.type] || '📚'}</span>
                                      <span className="capitalize">{strategy.type.replace('_', ' ')}</span>
                                    </motion.span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </motion.div>
                )}

                {/* Zones Tab */}
                {activeTab === 'zones' && (
                  <motion.div
                    key="zones"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0 }}
                    className="grid md:grid-cols-3 gap-6"
                  >
                    {/* Too Easy */}
                    <motion.div variants={itemVariants} className="glass-card p-5 bg-emerald-500/5 border-emerald-500/20">
                      <h3 className="font-semibold mb-4 flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="w-5 h-5" />
                        Mastered ({zpd.tooEasy.length})
                      </h3>
                      <div className="space-y-2 max-h-96 overflow-y-auto scrollbar-hide">
                        {zpd.tooEasy.map((zc) => (
                          <motion.div
                            key={zc.concept.conceptId}
                            whileHover={{ scale: 1.02 }}
                            className="p-3 bg-background/80 rounded-xl shadow-sm"
                          >
                            <div className="font-medium text-sm text-foreground">{zc.concept.name}</div>
                            <div className="text-xs text-muted-foreground mt-1">{zc.reason}</div>
                          </motion.div>
                        ))}
                        {zpd.tooEasy.length === 0 && (
                          <p className="text-sm text-emerald-600 dark:text-emerald-400">No mastered concepts yet</p>
                        )}
                      </div>
                    </motion.div>

                    {/* ZPD */}
                    <motion.div variants={itemVariants} className="glass-card p-5 bg-purple-500/5 border-purple-500/20">
                      <h3 className="font-semibold mb-4 flex items-center gap-2 text-purple-600 dark:text-purple-400">
                        <Target className="w-5 h-5" />
                        Ready to Learn ({zpd.zpd.length})
                      </h3>
                      <div className="space-y-2 max-h-96 overflow-y-auto scrollbar-hide">
                        {zpd.zpd.map((zc) => (
                          <motion.div
                            key={zc.concept.conceptId}
                            whileHover={{ scale: 1.02 }}
                            className="p-3 bg-background/80 rounded-xl shadow-sm"
                          >
                            <div className="font-medium text-sm text-foreground">{zc.concept.name}</div>
                            <div className="text-xs text-muted-foreground mt-1">{zc.reason}</div>
                            <div className="text-xs text-purple-600 dark:text-purple-400 mt-1 font-medium">
                              Readiness: {Math.round(zc.readiness * 100)}%
                            </div>
                          </motion.div>
                        ))}
                        {zpd.zpd.length === 0 && (
                          <p className="text-sm text-purple-600 dark:text-purple-400">No concepts in ZPD</p>
                        )}
                      </div>
                    </motion.div>

                    {/* Too Hard */}
                    <motion.div variants={itemVariants} className="glass-card p-5 bg-red-500/5 border-red-500/20">
                      <h3 className="font-semibold mb-4 flex items-center gap-2 text-red-600 dark:text-red-400">
                        <AlertTriangle className="w-5 h-5" />
                        Not Ready ({zpd.tooHard.length})
                      </h3>
                      <div className="space-y-2 max-h-96 overflow-y-auto scrollbar-hide">
                        {zpd.tooHard.map((zc) => (
                          <motion.div
                            key={zc.concept.conceptId}
                            whileHover={{ scale: 1.02 }}
                            className="p-3 bg-background/80 rounded-xl shadow-sm"
                          >
                            <div className="font-medium text-sm text-foreground">{zc.concept.name}</div>
                            <div className="text-xs text-muted-foreground mt-1">{zc.reason}</div>
                            {zc.missingPrerequisites.length > 0 && (
                              <div className="text-xs text-red-600 dark:text-red-400 mt-1">
                                Missing: {zc.missingPrerequisites.slice(0, 3).join(', ')}
                                {zc.missingPrerequisites.length > 3 && '...'}
                              </div>
                            )}
                          </motion.div>
                        ))}
                        {zpd.tooHard.length === 0 && (
                          <p className="text-sm text-red-600 dark:text-red-400">All concepts are accessible!</p>
                        )}
                      </div>
                    </motion.div>
                  </motion.div>
                )}

                {/* Learning Path Tab */}
                {activeTab === 'path' && (
                  <motion.div
                    key="path"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0 }}
                  >
                    <motion.div variants={itemVariants} className="glass-card p-5">
                      <h3 className="font-semibold mb-6 flex items-center gap-2 text-foreground">
                        <Route className="w-5 h-5 text-purple-500" />
                        Suggested Learning Path
                      </h3>
                      {zpd.suggestedPath.length === 0 ? (
                        <p className="text-muted-foreground">No learning path available</p>
                      ) : (
                        <div className="space-y-4">
                          {zpd.suggestedPath.map((conceptId, idx) => {
                            const rec = zpd.recommendations.find((r) => r.concept.conceptId === conceptId);
                            const zc =
                              zpd.zpd.find((z) => z.concept.conceptId === conceptId) ||
                              zpd.tooHard.find((z) => z.concept.conceptId === conceptId);

                            return (
                              <motion.div
                                key={conceptId}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="flex items-center gap-4"
                              >
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white flex items-center justify-center font-bold shadow-lg shadow-purple-500/25">
                                  {idx + 1}
                                </div>
                                <div className="flex-1 p-4 bg-secondary/50 rounded-xl">
                                  <div className="font-medium text-foreground">
                                    {zc?.concept.name || conceptId}
                                  </div>
                                  {rec && (
                                    <div className="text-sm text-muted-foreground mt-1">
                                      Est. {formatDuration(rec.estimatedMasteryTime)} •
                                      Readiness {Math.round(rec.readinessScore * 100)}%
                                    </div>
                                  )}
                                </div>
                                {idx < zpd.suggestedPath.length - 1 && (
                                  <div className="w-8 text-center text-muted-foreground text-xl">↓</div>
                                )}
                              </motion.div>
                            );
                          })}
                        </div>
                      )}
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
