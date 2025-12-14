'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Clock, Brain, Target, RefreshCw, TrendingDown, CheckCircle, XCircle, Loader2, AlertCircle } from 'lucide-react';
import { Sidebar } from '../components/Sidebar';
import { cn } from '@/lib/utils';
import { useLearners, useDB } from '@/lib/DBContext';

interface GapItem {
  conceptId: string;
  conceptName?: string;
  type: 'missing' | 'partial' | 'forgotten' | 'misconception';
  severity: 'high' | 'medium' | 'low';
  mastery?: number;
  predictedRetention?: number;
  daysSinceReview?: number;
  blockedConcepts?: string[];
  incorrectUnderstanding?: string;
}

interface ReviewQueueItem {
  conceptId: string;
  conceptName?: string;
  priority: 'urgent' | 'normal' | 'low';
  predictedRetention: number;
  daysSinceReview: number;
  nextReviewDate: string;
  intervalDays: number;
}

interface RemediationStep {
  order: number;
  conceptId: string;
  conceptName?: string;
  gapType: string;
  action: string;
  estimatedTime: number;
  priority: string;
}

interface Learner {
  userId: string;
  name?: string;
}

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

export default function GapsDashboard() {
  const { db, isLoading: dbLoading, error: dbError, isReady } = useDB();
  const { learners } = useLearners();
  const [selectedLearnerId, setSelectedLearnerId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [gaps, setGaps] = useState<{
    missing: GapItem[];
    partial: GapItem[];
    forgotten: GapItem[];
    misconceptions: GapItem[];
    summary: { total: number; critical: number; byType: Record<string, number> };
  } | null>(null);
  const [reviewQueue, setReviewQueue] = useState<{
    queue: ReviewQueueItem[];
    stats: { totalItems: number; urgent: number; normal: number; low: number; overdue: number };
  } | null>(null);
  const [remediation, setRemediation] = useState<{
    plan: { steps: RemediationStep[]; estimatedTotalTime: number; priorityFocus: string };
    gaps: { total: number };
  } | null>(null);

  const fetchGapData = useCallback(async (userId: string) => {
    if (!db || !isReady) return;

    setLoading(true);
    try {
      // Detect gaps using the database
      const detectedGaps = await db.detectGaps(userId);
      // Map the database format to our local GapItem format
      const missing: GapItem[] = detectedGaps.missing.map(g => ({
        conceptId: g.conceptId,
        conceptName: g.concept?.name,
        type: 'missing' as const,
        severity: 'high' as const,
      }));
      const partial: GapItem[] = detectedGaps.partial.map(g => ({
        conceptId: g.conceptId,
        conceptName: g.concept?.name,
        type: 'partial' as const,
        severity: g.mastery < 50 ? 'high' as const : 'medium' as const,
        mastery: g.mastery,
      }));
      const forgotten: GapItem[] = detectedGaps.forgotten.map(g => ({
        conceptId: g.conceptId,
        conceptName: g.concept?.name,
        type: 'forgotten' as const,
        severity: g.predictedRetention < 50 ? 'high' as const : 'medium' as const,
        predictedRetention: g.predictedRetention,
        daysSinceReview: g.daysSinceReview,
      }));
      const misconceptions: GapItem[] = detectedGaps.misconceptions.map(g => ({
        conceptId: g.conceptId,
        conceptName: g.concept?.name,
        type: 'misconception' as const,
        severity: 'high' as const,
        incorrectUnderstanding: g.misconceptions?.[0]?.description,
      }));
      setGaps({
        missing,
        partial,
        forgotten,
        misconceptions,
        summary: detectedGaps.summary,
      });

      // Get review queue - already returns {queue, stats}
      const reviewResult = await db.getReviewQueue(userId);
      setReviewQueue({
        queue: reviewResult.queue.map(item => ({
          conceptId: item.conceptId,
          conceptName: item.concept?.name,
          priority: item.priority,
          predictedRetention: item.predictedRetention,
          daysSinceReview: item.daysSinceReview,
          nextReviewDate: item.nextReviewDate,
          intervalDays: 1, // Default interval, not returned by getReviewQueue
        })),
        stats: reviewResult.stats,
      });

      // Generate remediation plan
      const remediationResult = await db.generateRemediationPlan(userId);
      setRemediation({
        plan: {
          steps: remediationResult.plan.steps.map(step => ({
            order: step.order,
            conceptId: step.conceptId,
            conceptName: step.concept?.name,
            gapType: step.type, // Map 'type' to 'gapType'
            action: step.action,
            estimatedTime: step.estimatedTime,
            priority: step.type === 'correct_misconception' ? 'critical' : step.type === 'relearn' ? 'high' : 'medium', // Derive priority from type
          })),
          estimatedTotalTime: remediationResult.plan.estimatedTotalTime,
          priorityFocus: remediationResult.plan.priorityFocus,
        },
        gaps: { total: remediationResult.gaps.summary.total },
      });
    } catch (error) {
      console.error('Error fetching gap data:', error);
    }
    setLoading(false);
  }, [db, isReady]);

  const handleLearnerChange = (userId: string) => {
    setSelectedLearnerId(userId);
    if (userId) {
      fetchGapData(userId);
    } else {
      setGaps(null);
      setReviewQueue(null);
      setRemediation(null);
    }
  };

  const getGapIcon = (type: string) => {
    switch (type) {
      case 'missing': return <XCircle className="text-red-500" size={20} />;
      case 'partial': return <Target className="text-amber-500" size={20} />;
      case 'forgotten': return <TrendingDown className="text-orange-500" size={20} />;
      case 'misconception': return <AlertTriangle className="text-purple-500" size={20} />;
      default: return <Brain size={20} />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20';
      case 'medium': return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
      case 'low': return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500';
      case 'normal': return 'bg-amber-500';
      case 'low': return 'bg-emerald-500';
      default: return 'bg-muted-foreground';
    }
  };

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

      <main className="flex-1 px-8 py-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 shadow-lg shadow-red-500/25">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Knowledge Gap Analysis</h1>
          </div>
          <p className="text-muted-foreground ml-14">
            Identify forgotten topics, track review schedules, and get personalized remediation plans
          </p>
        </motion.div>

        {/* Learner Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="glass-card p-5 mb-6"
        >
          <label className="block text-sm font-medium text-foreground mb-2">Select Learner</label>
          <div className="flex gap-4">
            <select
              value={selectedLearnerId}
              onChange={(e) => handleLearnerChange(e.target.value)}
              className="form-input flex-1"
            >
              <option value="">Choose a learner...</option>
              {learners.map((learner) => (
                <option key={learner.userId} value={learner.userId}>
                  {learner.name || learner.userId}
                </option>
              ))}
            </select>
            {selectedLearnerId && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => fetchGapData(selectedLearnerId)}
                disabled={loading}
                className="btn btn-primary flex items-center gap-2"
              >
                <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                Refresh
              </motion.button>
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
              >
                <RefreshCw size={48} className="mx-auto text-primary" />
              </motion.div>
              <p className="mt-4 text-muted-foreground">Analyzing knowledge gaps...</p>
            </motion.div>
          )}

          {!loading && selectedLearnerId && gaps && (
            <motion.div
              key="content"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                {[
                  { label: 'Missing', value: gaps.missing.length, icon: XCircle, color: 'red' },
                  { label: 'Partial', value: gaps.partial.length, icon: Target, color: 'amber' },
                  { label: 'Forgotten', value: gaps.forgotten.length, icon: TrendingDown, color: 'orange' },
                  { label: 'Misconceptions', value: gaps.misconceptions.length, icon: AlertTriangle, color: 'purple' },
                ].map((card, idx) => (
                  <motion.div
                    key={card.label}
                    variants={itemVariants}
                    whileHover={{ y: -4 }}
                    className={cn(
                      'glass-card p-5 border-l-4',
                      card.color === 'red' && 'border-l-red-500',
                      card.color === 'amber' && 'border-l-amber-500',
                      card.color === 'orange' && 'border-l-orange-500',
                      card.color === 'purple' && 'border-l-purple-500'
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">{card.label}</p>
                        <p className={cn(
                          'text-3xl font-bold',
                          card.color === 'red' && 'text-red-500',
                          card.color === 'amber' && 'text-amber-500',
                          card.color === 'orange' && 'text-orange-500',
                          card.color === 'purple' && 'text-purple-500'
                        )}>
                          {card.value}
                        </p>
                      </div>
                      <card.icon className={cn(
                        'w-8 h-8',
                        card.color === 'red' && 'text-red-500',
                        card.color === 'amber' && 'text-amber-500',
                        card.color === 'orange' && 'text-orange-500',
                        card.color === 'purple' && 'text-purple-500'
                      )} />
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Gap Details */}
                <motion.div variants={itemVariants} className="glass-card p-6">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-foreground">
                    <Brain className="text-primary" />
                    Knowledge Gaps
                  </h2>

                  {gaps.summary.total === 0 ? (
                    <div className="text-center py-12">
                      <CheckCircle size={48} className="mx-auto text-emerald-500 mb-2" />
                      <p className="text-foreground font-medium">No knowledge gaps detected!</p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-96 overflow-y-auto scrollbar-hide">
                      {/* Missing */}
                      {gaps.missing.map((gap, i) => (
                        <motion.div
                          key={`missing-${i}`}
                          whileHover={{ scale: 1.01 }}
                          className={cn('p-4 rounded-xl border', getSeverityColor(gap.severity))}
                        >
                          <div className="flex items-start gap-3">
                            {getGapIcon('missing')}
                            <div className="flex-1">
                              <p className="font-medium text-foreground">{gap.conceptId}</p>
                              <p className="text-sm opacity-75">Missing prerequisite knowledge</p>
                              {gap.blockedConcepts && gap.blockedConcepts.length > 0 && (
                                <p className="text-xs mt-1 opacity-60">Blocks: {gap.blockedConcepts.join(', ')}</p>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}

                      {/* Partial */}
                      {gaps.partial.map((gap, i) => (
                        <motion.div
                          key={`partial-${i}`}
                          whileHover={{ scale: 1.01 }}
                          className={cn('p-4 rounded-xl border', getSeverityColor(gap.severity))}
                        >
                          <div className="flex items-start gap-3">
                            {getGapIcon('partial')}
                            <div className="flex-1">
                              <p className="font-medium text-foreground">{gap.conceptId}</p>
                              <p className="text-sm opacity-75">Mastery: {gap.mastery}%</p>
                            </div>
                          </div>
                        </motion.div>
                      ))}

                      {/* Forgotten */}
                      {gaps.forgotten.map((gap, i) => (
                        <motion.div
                          key={`forgotten-${i}`}
                          whileHover={{ scale: 1.01 }}
                          className={cn('p-4 rounded-xl border', getSeverityColor(gap.severity))}
                        >
                          <div className="flex items-start gap-3">
                            {getGapIcon('forgotten')}
                            <div className="flex-1">
                              <p className="font-medium text-foreground">{gap.conceptId}</p>
                              <p className="text-sm opacity-75">
                                Predicted retention: {gap.predictedRetention?.toFixed(0)}%
                                ({gap.daysSinceReview} days since review)
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ))}

                      {/* Misconceptions */}
                      {gaps.misconceptions.map((gap, i) => (
                        <motion.div
                          key={`misconception-${i}`}
                          whileHover={{ scale: 1.01 }}
                          className={cn('p-4 rounded-xl border', getSeverityColor(gap.severity))}
                        >
                          <div className="flex items-start gap-3">
                            {getGapIcon('misconception')}
                            <div className="flex-1">
                              <p className="font-medium text-foreground">{gap.conceptId}</p>
                              <p className="text-sm opacity-75">{gap.incorrectUnderstanding || 'Incorrect understanding detected'}</p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>

                {/* Review Queue */}
                <motion.div variants={itemVariants} className="glass-card p-6">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-foreground">
                    <Clock className="text-primary" />
                    Review Queue
                    {reviewQueue && (
                      <span className="text-sm font-normal text-muted-foreground ml-2">
                        ({reviewQueue.stats.totalItems} items)
                      </span>
                    )}
                  </h2>

                  {reviewQueue && reviewQueue.stats.overdue > 0 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl"
                    >
                      <p className="text-red-600 dark:text-red-400 font-medium flex items-center gap-2">
                        <AlertTriangle size={16} />
                        {reviewQueue.stats.overdue} overdue reviews!
                      </p>
                    </motion.div>
                  )}

                  {!reviewQueue || reviewQueue.queue.length === 0 ? (
                    <div className="text-center py-12">
                      <CheckCircle size={48} className="mx-auto text-emerald-500 mb-2" />
                      <p className="text-foreground font-medium">No reviews scheduled</p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-96 overflow-y-auto scrollbar-hide">
                      {reviewQueue.queue.map((item, i) => (
                        <motion.div
                          key={i}
                          whileHover={{ scale: 1.01 }}
                          className="p-4 bg-secondary/50 rounded-xl border border-border/50 flex items-center gap-3"
                        >
                          <div className={cn('w-3 h-3 rounded-full', getPriorityColor(item.priority))} />
                          <div className="flex-1">
                            <p className="font-medium text-foreground">{item.conceptId}</p>
                            <p className="text-sm text-muted-foreground">
                              Retention: {item.predictedRetention.toFixed(0)}% •
                              Next review: {new Date(item.nextReviewDate).toLocaleDateString()}
                            </p>
                          </div>
                          <span className={cn(
                            'px-2.5 py-1 text-xs rounded-full font-medium',
                            item.priority === 'urgent' && 'bg-red-500/10 text-red-600 dark:text-red-400',
                            item.priority === 'normal' && 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
                            item.priority === 'low' && 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          )}>
                            {item.priority}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              </div>

              {/* Remediation Plan */}
              {remediation && remediation.plan.steps.length > 0 && (
                <motion.div
                  variants={itemVariants}
                  className="mt-6 glass-card p-6"
                >
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-foreground">
                    <Target className="text-primary" />
                    Remediation Plan
                    <span className="text-sm font-normal text-muted-foreground ml-2">
                      (Est. {remediation.plan.estimatedTotalTime} minutes)
                    </span>
                  </h2>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 p-4 bg-primary/5 border border-primary/10 rounded-xl"
                  >
                    <p className="text-foreground">
                      <strong>Priority Focus:</strong> {remediation.plan.priorityFocus}
                    </p>
                  </motion.div>

                  <div className="space-y-4">
                    {remediation.plan.steps.map((step, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-start gap-4 p-4 bg-secondary/50 rounded-xl border border-border/50"
                      >
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-purple-500 text-white flex items-center justify-center font-bold text-sm shadow-lg shadow-primary/25">
                          {step.order}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-foreground">{step.conceptId}</p>
                          <p className="text-sm text-muted-foreground">{step.action}</p>
                          <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                            <span>Type: {step.gapType}</span>
                            <span>Est: {step.estimatedTime} min</span>
                            <span className={cn(
                              'px-2 py-0.5 rounded',
                              step.priority === 'critical' && 'bg-red-500/10 text-red-600 dark:text-red-400',
                              step.priority === 'high' && 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
                              step.priority === 'medium' && 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
                              !['critical', 'high', 'medium'].includes(step.priority) && 'bg-muted text-muted-foreground'
                            )}>
                              {step.priority}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {!selectedLearnerId && (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="glass-card text-center py-16"
            >
              <Brain size={64} className="mx-auto text-muted-foreground/30 mb-4" />
              <h3 className="text-xl font-medium text-foreground">Select a learner to analyze</h3>
              <p className="text-muted-foreground mt-2">
                Choose a learner from the dropdown to view their knowledge gaps and review schedule
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Forgetting Curve Visualization */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 glass-card p-6"
        >
          <h2 className="text-xl font-semibold mb-4 text-foreground">Understanding the Forgetting Curve</h2>
          <div className="flex justify-center">
            <svg viewBox="0 0 500 280" className="w-full max-w-2xl">
              {/* Background grid */}
              <defs>
                <pattern id="grid" width="50" height="25" patternUnits="userSpaceOnUse">
                  <path d="M 50 0 L 0 0 0 25" fill="none" className="stroke-border" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect x="50" y="20" width="400" height="200" fill="url(#grid)" />

              {/* Axes */}
              <line x1="50" y1="220" x2="450" y2="220" className="stroke-foreground" strokeWidth="2" />
              <line x1="50" y1="20" x2="50" y2="220" className="stroke-foreground" strokeWidth="2" />

              {/* Y-axis labels */}
              <text x="45" y="25" textAnchor="end" fontSize="12" className="fill-muted-foreground">100%</text>
              <text x="45" y="120" textAnchor="end" fontSize="12" className="fill-muted-foreground">50%</text>
              <text x="45" y="220" textAnchor="end" fontSize="12" className="fill-muted-foreground">0%</text>
              <text x="20" y="120" textAnchor="middle" fontSize="12" className="fill-muted-foreground" transform="rotate(-90, 20, 120)">Retention</text>

              {/* X-axis labels */}
              <text x="50" y="240" textAnchor="middle" fontSize="12" className="fill-muted-foreground">0</text>
              <text x="150" y="240" textAnchor="middle" fontSize="12" className="fill-muted-foreground">7 days</text>
              <text x="250" y="240" textAnchor="middle" fontSize="12" className="fill-muted-foreground">14 days</text>
              <text x="350" y="240" textAnchor="middle" fontSize="12" className="fill-muted-foreground">21 days</text>
              <text x="450" y="240" textAnchor="middle" fontSize="12" className="fill-muted-foreground">28 days</text>
              <text x="250" y="260" textAnchor="middle" fontSize="12" className="fill-muted-foreground">Time</text>

              {/* Without spaced repetition curve */}
              <path
                d="M 50 20 Q 100 80 150 140 T 250 180 T 350 195 T 450 200"
                fill="none"
                stroke="#ef4444"
                strokeWidth="3"
                strokeDasharray="8,4"
              />

              {/* With spaced repetition curves */}
              <path
                d="M 50 20 Q 80 60 100 100 L 100 40 Q 130 80 160 110 L 160 50 Q 200 90 250 120 L 250 60 Q 320 100 400 130 L 400 70"
                fill="none"
                stroke="#22c55e"
                strokeWidth="3"
              />

              {/* Review points */}
              <circle cx="100" cy="40" r="5" fill="#22c55e" />
              <circle cx="160" cy="50" r="5" fill="#22c55e" />
              <circle cx="250" cy="60" r="5" fill="#22c55e" />
              <circle cx="400" cy="70" r="5" fill="#22c55e" />

              {/* Legend */}
              <line x1="280" y1="15" x2="310" y2="15" stroke="#ef4444" strokeWidth="3" strokeDasharray="8,4" />
              <text x="315" y="19" fontSize="11" className="fill-muted-foreground">Without review</text>
              <line x1="280" y1="35" x2="310" y2="35" stroke="#22c55e" strokeWidth="3" />
              <text x="315" y="39" fontSize="11" className="fill-muted-foreground">With spaced repetition</text>
              <circle cx="295" cy="55" r="4" fill="#22c55e" />
              <text x="315" y="59" fontSize="11" className="fill-muted-foreground">Review session</text>
            </svg>
          </div>
          <p className="text-center text-muted-foreground mt-4 text-sm">
            Spaced repetition reviews at optimal intervals dramatically improve long-term retention
          </p>
        </motion.div>
      </main>
    </div>
  );
}
