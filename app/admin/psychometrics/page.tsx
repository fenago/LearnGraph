'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from '@/app/components/Sidebar';
import { EtherealShadow } from '@/components/ui/ethereal-shadow';
import { Save, RefreshCw, ChevronDown, ChevronRight, Brain, User, AlertCircle, CheckCircle2, X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LearnerProfile {
  userId: string;
  name: string;
}

interface PsychometricScore {
  score: number;
  confidence: number;
  lastUpdated: string;
  source?: string;
}

interface LearningStyle {
  primary: string;
  secondary?: string;
  socialPreference: string;
  pacePreference: string;
  feedbackPreference: string;
}

interface CognitiveProfile {
  workingMemoryCapacity: string;
  attentionSpan: string;
  processingSpeed: string;
  abstractThinking: string;
}

interface PsychometricData {
  userId: string;
  psychometricScores: Record<string, PsychometricScore & { metadata?: DomainMetadata }>;
  scoreCount: number;
  totalDomains: number;
  learningStyle?: LearningStyle;
  learningStyleDescription?: string;
  cognitiveProfile?: CognitiveProfile;
}

interface DomainMetadata {
  name: string;
  category: string;
  description: string;
  scoreInterpretation: { low: string; high: string };
  educationalRelevance: string;
}

// Domain categories for grouping
const DOMAIN_CATEGORIES = {
  'Big Five': ['big_five_openness', 'big_five_conscientiousness', 'big_five_extraversion', 'big_five_agreeableness', 'big_five_neuroticism'],
  'Dark Triad': ['dark_triad_narcissism', 'dark_triad_machiavellianism', 'dark_triad_psychopathy'],
  'Emotional': ['emotional_empathy', 'emotional_intelligence'],
  'Social': ['attachment_style', 'love_languages', 'communication_style', 'social_support'],
  'Decision Making': ['risk_tolerance', 'decision_style', 'time_orientation', 'locus_of_control'],
  'Motivation': ['achievement_motivation', 'self_efficacy', 'growth_mindset'],
  'Self': ['authenticity', 'personal_values', 'interests', 'life_satisfaction', 'stress_coping'],
  'Cognitive': ['cognitive_abilities', 'creativity', 'learning_styles', 'information_processing', 'metacognition', 'executive_functions', 'social_cognition'],
  'Values': ['political_ideology', 'cultural_values', 'moral_reasoning'],
  'Other': ['work_career_style', 'sensory_processing', 'aesthetic_preferences'],
};

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

export default function PsychometricsPage() {
  const [learners, setLearners] = useState<LearnerProfile[]>([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [psychometricData, setPsychometricData] = useState<PsychometricData | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['Big Five', 'Cognitive']));
  const [editedScores, setEditedScores] = useState<Record<string, number>>({});

  useEffect(() => {
    fetchLearners();
  }, []);

  useEffect(() => {
    if (selectedUserId) {
      fetchPsychometricData(selectedUserId);
    } else {
      setPsychometricData(null);
      setEditedScores({});
    }
  }, [selectedUserId]);

  async function fetchLearners() {
    try {
      const res = await fetch('/api/learners');
      const data = await res.json();
      setLearners(data);
    } catch (err) {
      setError('Failed to fetch learners');
    }
  }

  async function fetchPsychometricData(userId: string) {
    try {
      setLoading(true);
      setError('');
      const res = await fetch(`/api/learners/${userId}/psychometrics?includeMetadata=true`);
      if (!res.ok) {
        throw new Error('Failed to fetch psychometric data');
      }
      const data = await res.json();
      setPsychometricData(data);
      // Initialize edited scores with existing scores
      const scores: Record<string, number> = {};
      for (const [domain, scoreData] of Object.entries(data.psychometricScores)) {
        const score = (scoreData as PsychometricScore & { metadata?: DomainMetadata }).score;
        if (score !== null && score !== undefined) {
          scores[domain] = score;
        }
      }
      setEditedScores(scores);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveScores() {
    if (!selectedUserId) return;

    try {
      setSaving(true);
      setError('');
      setSuccess('');

      // Convert edited scores to API format
      const scores: Record<string, { score: number; confidence: number; source: string }> = {};
      for (const [domain, score] of Object.entries(editedScores)) {
        scores[domain] = {
          score,
          confidence: 0.8,
          source: 'admin-ui',
        };
      }

      const res = await fetch(`/api/learners/${selectedUserId}/psychometrics`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scores, computeDerived: true }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save scores');
      }

      setSuccess('Scores saved and profiles computed successfully!');
      await fetchPsychometricData(selectedUserId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setSaving(false);
    }
  }

  async function handleComputeProfiles() {
    if (!selectedUserId) return;

    try {
      setSaving(true);
      setError('');
      setSuccess('');

      const res = await fetch(`/api/learners/${selectedUserId}/psychometrics`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'all' }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to compute profiles');
      }

      setSuccess('Profiles computed successfully!');
      await fetchPsychometricData(selectedUserId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setSaving(false);
    }
  }

  function toggleCategory(category: string) {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  }

  function handleScoreChange(domain: string, value: number) {
    setEditedScores(prev => ({ ...prev, [domain]: value }));
  }

  function getScoreColor(score: number): string {
    if (score >= 70) return 'bg-emerald-500';
    if (score >= 40) return 'bg-amber-500';
    return 'bg-red-500';
  }

  function getDomainName(domain: string): string {
    if (psychometricData?.psychometricScores[domain]?.metadata) {
      return psychometricData.psychometricScores[domain].metadata!.name;
    }
    return domain.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  }

  const hasScores = Object.keys(editedScores).length > 0;

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <main className="flex-1 relative overflow-hidden">
        {/* Background Effect */}
        <div className="absolute inset-0 pointer-events-none">
          <EtherealShadow
            color="rgba(236, 72, 153, 0.12)"
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
              <div className="p-2.5 rounded-xl bg-pink-500/10">
                <Brain className="w-6 h-6 text-pink-500" />
              </div>
              <h1 className="text-3xl font-bold text-foreground">Psychometric Profiles</h1>
            </div>
            <p className="text-muted-foreground ml-14">
              View and edit learner psychometric scores
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

          {/* Success Message */}
          <AnimatePresence>
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <span className="text-emerald-600 dark:text-emerald-400">{success}</span>
                <button
                  onClick={() => setSuccess('')}
                  className="ml-auto text-emerald-500/70 hover:text-emerald-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Learner Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="glass-card p-6 mb-6"
          >
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <User className="w-5 h-5 text-blue-500" />
              </div>
              <label className="text-sm font-medium text-foreground">Select Learner:</label>
              <select
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                className="form-input flex-1 max-w-md"
              >
                <option value="">Choose a learner...</option>
                {learners.map((l) => (
                  <option key={l.userId} value={l.userId}>
                    {l.name || l.userId}
                  </option>
                ))}
              </select>
            </div>
          </motion.div>

          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">Loading psychometric data...</p>
            </motion.div>
          ) : !selectedUserId ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16 glass-card"
            >
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                <Brain className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">Select a learner</h3>
              <p className="text-muted-foreground">
                Choose a learner to view and edit their psychometric profile
              </p>
            </motion.div>
          ) : psychometricData ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Learning Style Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="glass-card p-6"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-purple-500/10">
                      <Brain className="w-5 h-5 text-purple-500" />
                    </div>
                    <h3 className="font-semibold text-lg text-foreground">Learning Style</h3>
                  </div>
                  {psychometricData.learningStyle ? (
                    <div className="space-y-3">
                      <p className="text-muted-foreground text-sm">{psychometricData.learningStyleDescription}</p>
                      <div className="grid grid-cols-2 gap-2 mt-4">
                        <div className="bg-purple-500/10 px-3 py-2 rounded-lg">
                          <span className="text-muted-foreground text-xs">Primary:</span>{' '}
                          <span className="font-medium text-sm text-foreground">{psychometricData.learningStyle.primary}</span>
                        </div>
                        {psychometricData.learningStyle.secondary && (
                          <div className="bg-purple-500/10 px-3 py-2 rounded-lg">
                            <span className="text-muted-foreground text-xs">Secondary:</span>{' '}
                            <span className="font-medium text-sm text-foreground">{psychometricData.learningStyle.secondary}</span>
                          </div>
                        )}
                        <div className="bg-purple-500/10 px-3 py-2 rounded-lg">
                          <span className="text-muted-foreground text-xs">Social:</span>{' '}
                          <span className="font-medium text-sm text-foreground">{psychometricData.learningStyle.socialPreference}</span>
                        </div>
                        <div className="bg-purple-500/10 px-3 py-2 rounded-lg">
                          <span className="text-muted-foreground text-xs">Pace:</span>{' '}
                          <span className="font-medium text-sm text-foreground">{psychometricData.learningStyle.pacePreference}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-muted-foreground italic text-sm">
                      No learning style computed yet. Add scores and click &quot;Compute Profiles&quot;.
                    </p>
                  )}
                </motion.div>

                {/* Cognitive Profile Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.05 }}
                  className="glass-card p-6"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-blue-500/10">
                      <Brain className="w-5 h-5 text-blue-500" />
                    </div>
                    <h3 className="font-semibold text-lg text-foreground">Cognitive Profile</h3>
                  </div>
                  {psychometricData.cognitiveProfile ? (
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-blue-500/10 px-3 py-2 rounded-lg">
                        <span className="text-muted-foreground text-xs">Working Memory:</span>{' '}
                        <span className="font-medium text-sm text-foreground">{psychometricData.cognitiveProfile.workingMemoryCapacity}</span>
                      </div>
                      <div className="bg-blue-500/10 px-3 py-2 rounded-lg">
                        <span className="text-muted-foreground text-xs">Attention Span:</span>{' '}
                        <span className="font-medium text-sm text-foreground">{psychometricData.cognitiveProfile.attentionSpan}</span>
                      </div>
                      <div className="bg-blue-500/10 px-3 py-2 rounded-lg">
                        <span className="text-muted-foreground text-xs">Processing Speed:</span>{' '}
                        <span className="font-medium text-sm text-foreground">{psychometricData.cognitiveProfile.processingSpeed}</span>
                      </div>
                      <div className="bg-blue-500/10 px-3 py-2 rounded-lg">
                        <span className="text-muted-foreground text-xs">Abstract Thinking:</span>{' '}
                        <span className="font-medium text-sm text-foreground">{psychometricData.cognitiveProfile.abstractThinking}</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-muted-foreground italic text-sm">
                      No cognitive profile computed yet. Add scores and click &quot;Compute Profiles&quot;.
                    </p>
                  )}
                </motion.div>
              </div>

              {/* Score Progress */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="glass-card p-6"
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <span className="text-sm text-muted-foreground">
                      Scores: {psychometricData.scoreCount} / {psychometricData.totalDomains} domains
                    </span>
                    <div className="w-48 h-2 bg-muted rounded-full mt-2">
                      <div
                        className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full transition-all"
                        style={{ width: `${(psychometricData.scoreCount / psychometricData.totalDomains) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={handleComputeProfiles}
                      disabled={saving || !hasScores}
                      className="btn btn-secondary flex items-center gap-2 disabled:opacity-50"
                    >
                      <RefreshCw className={cn('w-4 h-4', saving && 'animate-spin')} />
                      Compute Profiles
                    </button>
                    <button
                      onClick={handleSaveScores}
                      disabled={saving || Object.keys(editedScores).length === 0}
                      className="btn btn-success flex items-center gap-2 disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                      Save Scores
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* Domain Scores by Category */}
              <div className="space-y-4">
                {Object.entries(DOMAIN_CATEGORIES).map(([category, domains], index) => (
                  <motion.div
                    key={category}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.15 + index * 0.05 }}
                    className="glass-card overflow-hidden"
                  >
                    <button
                      onClick={() => toggleCategory(category)}
                      className="w-full px-6 py-4 flex items-center justify-between bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {expandedCategories.has(category) ? (
                          <ChevronDown className="w-5 h-5 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-muted-foreground" />
                        )}
                        <span className="font-semibold text-foreground">{category}</span>
                        <span className="text-sm text-muted-foreground">({domains.length} domains)</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {domains.map(domain => {
                          const score = editedScores[domain];
                          return score !== undefined ? (
                            <div
                              key={domain}
                              className={cn('w-2 h-2 rounded-full', getScoreColor(score))}
                              title={`${getDomainName(domain)}: ${score}`}
                            />
                          ) : (
                            <div key={domain} className="w-2 h-2 rounded-full bg-muted" />
                          );
                        })}
                      </div>
                    </button>

                    <AnimatePresence>
                      {expandedCategories.has(category) && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="p-6 space-y-6">
                            {domains.map(domain => {
                              const metadata = psychometricData.psychometricScores[domain]?.metadata;
                              const currentScore = editedScores[domain] ?? 50;

                              return (
                                <div key={domain} className="border-b border-border/30 pb-6 last:border-b-0 last:pb-0">
                                  <div className="flex justify-between items-start mb-3">
                                    <div className="flex-1">
                                      <span className="font-medium text-foreground">{getDomainName(domain)}</span>
                                      {metadata && (
                                        <p className="text-sm text-muted-foreground mt-1">{metadata.description}</p>
                                      )}
                                    </div>
                                    <span className="font-mono text-sm bg-muted px-3 py-1 rounded-lg text-foreground">
                                      {editedScores[domain] !== undefined ? editedScores[domain] : '—'}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-4">
                                    <input
                                      type="range"
                                      min="0"
                                      max="100"
                                      value={currentScore}
                                      onChange={(e) => handleScoreChange(domain, parseInt(e.target.value))}
                                      className="flex-1 h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-pink-500"
                                    />
                                    <div className="flex gap-2 text-xs text-muted-foreground w-48">
                                      {metadata && (
                                        <>
                                          <span className="truncate">{metadata.scoreInterpretation.low}</span>
                                          <span className="text-border">|</span>
                                          <span className="truncate">{metadata.scoreInterpretation.high}</span>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                  {metadata && (
                                    <p className="text-xs text-pink-600 dark:text-pink-400 mt-2">{metadata.educationalRelevance}</p>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : null}
        </div>
      </main>
    </div>
  );
}
