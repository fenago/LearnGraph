'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Database,
  Users,
  BookOpen,
  GitBranch,
  BarChart3,
  ChevronDown,
  ChevronRight,
  Plus,
  Check,
  AlertCircle,
  Info,
  Sparkles,
  Brain,
  Network,
  ArrowRight,
  Code,
  FileText,
  Loader2,
} from 'lucide-react';
import { Sidebar } from '../components/Sidebar';
import { EtherealShadow } from '@/components/ui/ethereal-shadow';
import { cn } from '@/lib/utils';
import { useDB, useLearners, useConcepts, useEdges, useKnowledgeStates } from '@/lib/DBContext';
import { v4 as uuidv4 } from 'uuid';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' as const },
  },
};

// Psychometric domain definitions
const PSYCHOMETRIC_CATEGORIES = {
  'Big Five Personality': [
    { id: 'big_five_openness', name: 'Openness to Experience', desc: 'Curiosity, creativity, preference for novelty' },
    { id: 'big_five_conscientiousness', name: 'Conscientiousness', desc: 'Organization, self-discipline, goal-directed' },
    { id: 'big_five_extraversion', name: 'Extraversion', desc: 'Sociability, assertiveness, energy' },
    { id: 'big_five_agreeableness', name: 'Agreeableness', desc: 'Cooperation, trust, consideration' },
    { id: 'big_five_neuroticism', name: 'Neuroticism', desc: 'Emotional instability, anxiety tendency' },
  ],
  'Dark Triad': [
    { id: 'dark_triad_narcissism', name: 'Narcissism', desc: 'Self-importance, need for admiration' },
    { id: 'dark_triad_machiavellianism', name: 'Machiavellianism', desc: 'Strategic thinking, pragmatism' },
    { id: 'dark_triad_psychopathy', name: 'Psychopathy', desc: 'Boldness, reduced emotional reactivity' },
  ],
  'Emotional Intelligence': [
    { id: 'emotional_empathy', name: 'Empathy', desc: 'Understanding others\' feelings' },
    { id: 'emotional_intelligence', name: 'Emotional Intelligence', desc: 'Perceive, understand, manage emotions' },
    { id: 'attachment_style', name: 'Attachment Style', desc: 'Pattern of relating to others' },
    { id: 'love_languages', name: 'Love Languages', desc: 'Preferred appreciation styles' },
  ],
  'Communication & Social': [
    { id: 'communication_style', name: 'Communication Style', desc: 'Preferred mode of communication' },
    { id: 'social_support', name: 'Social Support', desc: 'Perceived support from networks' },
  ],
  'Decision Making & Risk': [
    { id: 'risk_tolerance', name: 'Risk Tolerance', desc: 'Willingness to accept uncertainty' },
    { id: 'decision_style', name: 'Decision Style', desc: 'Intuitive vs analytical approach' },
    { id: 'time_orientation', name: 'Time Orientation', desc: 'Past, present, or future focus' },
    { id: 'locus_of_control', name: 'Locus of Control', desc: 'Belief about control over outcomes' },
  ],
  'Motivation & Achievement': [
    { id: 'achievement_motivation', name: 'Achievement Motivation', desc: 'Drive to accomplish goals' },
    { id: 'self_efficacy', name: 'Self-Efficacy', desc: 'Belief in ability to succeed' },
    { id: 'growth_mindset', name: 'Growth Mindset', desc: 'Belief abilities can develop' },
    { id: 'authenticity', name: 'Authenticity', desc: 'Self-awareness and genuine expression' },
  ],
  'Values & Interests': [
    { id: 'personal_values', name: 'Personal Values', desc: 'Core beliefs guiding behavior' },
    { id: 'interests', name: 'Interests', desc: 'Areas of curiosity' },
    { id: 'life_satisfaction', name: 'Life Satisfaction', desc: 'Overall contentment' },
  ],
  'Coping & Wellbeing': [
    { id: 'stress_coping', name: 'Stress Coping', desc: 'Strategies for managing stress' },
  ],
  'Cognitive': [
    { id: 'cognitive_abilities', name: 'Cognitive Abilities', desc: 'Reasoning and problem-solving' },
    { id: 'creativity', name: 'Creativity', desc: 'Generate novel ideas' },
    { id: 'learning_styles', name: 'Learning Styles', desc: 'VARK preferences' },
    { id: 'information_processing', name: 'Information Processing', desc: 'How info is encoded/retrieved' },
    { id: 'metacognition', name: 'Metacognition', desc: 'Awareness of own thinking' },
    { id: 'executive_functions', name: 'Executive Functions', desc: 'Planning, focus, task management' },
  ],
  'Social Cognition': [
    { id: 'social_cognition', name: 'Social Cognition', desc: 'Understanding social situations' },
  ],
  'Worldview': [
    { id: 'political_ideology', name: 'Political Ideology', desc: 'Political beliefs orientation' },
    { id: 'cultural_values', name: 'Cultural Values', desc: 'Collectivism vs individualism' },
    { id: 'moral_reasoning', name: 'Moral Reasoning', desc: 'Ethical framework' },
  ],
  'Work & Lifestyle': [
    { id: 'work_career_style', name: 'Work/Career Style', desc: 'Work preferences' },
    { id: 'sensory_processing', name: 'Sensory Processing', desc: 'Sensitivity to stimulation' },
    { id: 'aesthetic_preferences', name: 'Aesthetic Preferences', desc: 'Visual style preferences' },
  ],
};

interface Learner {
  userId: string;
  name?: string;
  email?: string;
}

interface Concept {
  conceptId: string;
  name: string;
  domain: string;
}

type TabType = 'overview' | 'learners' | 'concepts' | 'prerequisites' | 'knowledge-states';

const TAB_CONFIG = [
  { id: 'overview' as const, label: 'Overview', icon: Database, color: 'from-indigo-500 to-purple-500' },
  { id: 'learners' as const, label: 'Learners', icon: Users, color: 'from-emerald-500 to-green-500' },
  { id: 'concepts' as const, label: 'Concepts', icon: BookOpen, color: 'from-purple-500 to-violet-500' },
  { id: 'prerequisites' as const, label: 'Prerequisites', icon: GitBranch, color: 'from-amber-500 to-orange-500' },
  { id: 'knowledge-states' as const, label: 'Knowledge States', icon: BarChart3, color: 'from-cyan-500 to-blue-500' },
];

export default function DataEntryPage() {
  const { isLoading: dbLoading, error: dbError } = useDB();
  const { learners: learnersData, createLearner } = useLearners();
  const { concepts: conceptsData, createConcept } = useConcepts();
  const { createEdge } = useEdges();

  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Map data to local interfaces
  const learners: Learner[] = learnersData.map(l => ({
    userId: l.userId,
    name: l.name,
    email: l.email,
  }));

  const concepts: Concept[] = conceptsData.map(c => ({
    conceptId: c.conceptId,
    name: c.name,
    domain: c.domain || 'other',
  }));

  // Input mode toggles
  const [learnerInputMode, setLearnerInputMode] = useState<'form' | 'json'>('form');

  // JSON input states
  const [learnerJson, setLearnerJson] = useState('');

  // Expanded category tracking
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  // Learner form state - expanded
  const [learnerForm, setLearnerForm] = useState({
    name: '',
    email: '',
    userId: '',
    // Learning style
    learningStylePrimary: '' as '' | 'visual' | 'auditory' | 'kinesthetic' | 'reading',
    socialPreference: '' as '' | 'solo' | 'collaborative' | 'mixed',
    pacePreference: '' as '' | 'self-paced' | 'structured' | 'intensive',
    // Cognitive profile
    workingMemoryCapacity: '' as '' | 'low' | 'medium' | 'high',
    attentionSpan: '' as '' | 'short' | 'medium' | 'long',
    processingSpeed: '' as '' | 'slow' | 'medium' | 'fast',
    abstractThinking: '' as '' | 'concrete' | 'mixed' | 'abstract',
  });

  // Psychometric scores state
  const [psychometricScores, setPsychometricScores] = useState<Record<string, { score: number; confidence: number }>>({});

  // Concept form state
  const [conceptForm, setConceptForm] = useState({
    conceptId: '',
    name: '',
    domain: 'mathematics',
    subdomain: '',
    description: '',
    difficulty: 5,
    cognitiveLoad: 0.5,
    abstractness: 0.5,
  });

  // Prerequisite form state
  const [prereqForm, setPrereqForm] = useState({
    from: '',
    to: '',
    strength: 'recommended' as 'required' | 'recommended' | 'helpful',
    reason: '',
  });

  // Knowledge state form
  const [stateForm, setStateForm] = useState<{
    userId: string;
    conceptId: string;
    mastery: number;
    bloomLevel: 1 | 2 | 3 | 4 | 5 | 6;
  }>({
    userId: '',
    conceptId: '',
    mastery: 0,
    bloomLevel: 1,
  });

  // Knowledge state hook (needs userId which changes based on form)
  const { setKnowledgeState } = useKnowledgeStates(stateForm.userId || undefined);

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  // Toggle category expansion
  const toggleCategory = (category: string) => {
    setExpandedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  // Update psychometric score
  const updatePsychometricScore = (domainId: string, score: number, confidence: number = 0.8) => {
    setPsychometricScores(prev => ({
      ...prev,
      [domainId]: { score, confidence }
    }));
  };

  // Handle learner submission (form or JSON)
  const handleAddLearner = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let payload: Record<string, unknown>;

      if (learnerInputMode === 'json') {
        // Parse and submit raw JSON
        try {
          payload = JSON.parse(learnerJson);
        } catch {
          showMessage('error', 'Invalid JSON format');
          return;
        }
      } else {
        // Build payload from form fields
        payload = {
          name: learnerForm.name,
          email: learnerForm.email || undefined,
          psychometricScores: Object.keys(psychometricScores).length > 0 ? psychometricScores : undefined,
          learningStyle: learnerForm.learningStylePrimary ? {
            primary: learnerForm.learningStylePrimary,
            socialPreference: learnerForm.socialPreference || undefined,
            pacePreference: learnerForm.pacePreference || undefined,
          } : undefined,
          cognitiveProfile: learnerForm.workingMemoryCapacity ? {
            workingMemoryCapacity: learnerForm.workingMemoryCapacity,
            attentionSpan: learnerForm.attentionSpan || undefined,
            processingSpeed: learnerForm.processingSpeed || undefined,
            abstractThinking: learnerForm.abstractThinking || undefined,
          } : undefined,
        };
      }

      const userId = (learnerInputMode === 'json' && payload.userId)
        ? String(payload.userId)
        : learnerForm.userId || uuidv4();

      await createLearner(userId, payload as Record<string, unknown>);

      showMessage('success', 'Learner added successfully!');
      setLearnerForm({
        name: '', email: '', userId: '',
        learningStylePrimary: '', socialPreference: '', pacePreference: '',
        workingMemoryCapacity: '', attentionSpan: '', processingSpeed: '', abstractThinking: '',
      });
      setPsychometricScores({});
      setLearnerJson('');
    } catch (err) {
      showMessage('error', err instanceof Error ? err.message : 'Failed to add learner');
    }
  };

  const handleAddConcept = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createConcept({
        conceptId: conceptForm.conceptId,
        name: conceptForm.name,
        domain: conceptForm.domain,
        description: conceptForm.description,
        difficulty: {
          absolute: conceptForm.difficulty,
          cognitiveLoad: conceptForm.cognitiveLoad,
          abstractness: conceptForm.abstractness,
        },
      });

      showMessage('success', 'Concept added successfully!');
      setConceptForm({
        conceptId: '',
        name: '',
        domain: 'mathematics',
        subdomain: '',
        description: '',
        difficulty: 5,
        cognitiveLoad: 0.5,
        abstractness: 0.5,
      });
    } catch (err) {
      showMessage('error', err instanceof Error ? err.message : 'Failed to add concept');
    }
  };

  const handleAddPrerequisite = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createEdge({
        from: prereqForm.from,
        to: prereqForm.to,
        strength: prereqForm.strength,
        reason: prereqForm.reason || undefined,
      });

      showMessage('success', 'Prerequisite edge added successfully!');
      setPrereqForm({ from: '', to: '', strength: 'recommended', reason: '' });
    } catch (err) {
      showMessage('error', err instanceof Error ? err.message : 'Failed to add prerequisite');
    }
  };

  const handleAddKnowledgeState = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await setKnowledgeState(
        stateForm.userId,
        stateForm.conceptId,
        {
          mastery: stateForm.mastery / 100, // Convert percentage to 0-1
          bloomLevel: stateForm.bloomLevel,
        }
      );

      showMessage('success', 'Knowledge state added successfully!');
      setStateForm({ userId: '', conceptId: '', mastery: 0, bloomLevel: 1 });
    } catch (err) {
      showMessage('error', err instanceof Error ? err.message : 'Failed to add knowledge state');
    }
  };

  // Show DB loading state
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
            color="rgba(99, 102, 241, 0.12)"
            animation={{ scale: 30, speed: 40 }}
            noise={{ opacity: 0.3, scale: 0.8 }}
          />
        </div>

        <div className="relative z-10 px-8 py-10 max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' as const }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="p-2 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/25"
              >
                <Database className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                  Data Entry
                </h1>
                <p className="text-sm text-muted-foreground">
                  Build your knowledge graph and learner profiles
                </p>
              </div>
            </div>
          </motion.div>

          {/* Message Banner */}
          <AnimatePresence>
            {message && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={cn(
                  'mb-6 px-4 py-3 rounded-xl flex items-center gap-3',
                  message.type === 'success'
                    ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                    : 'bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400'
                )}
              >
                {message.type === 'success' ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <AlertCircle className="w-5 h-5" />
                )}
                <span className="font-medium">{message.text}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Tab Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="mb-8"
          >
            <div className="flex flex-wrap gap-2 p-1 glass-card">
              {TAB_CONFIG.map((tab, index) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <motion.button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={cn(
                      'flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200',
                      isActive
                        ? 'bg-primary text-primary-foreground shadow-lg'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0 }}
                className="space-y-8"
              >
                {/* Introduction Section */}
                <motion.div variants={itemVariants} className="glass-card p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/25">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-foreground mb-2">
                        Welcome to LearnGraph Data Entry
                      </h2>
                      <p className="text-muted-foreground mb-4">
                        LearnGraph is an <span className="text-primary font-semibold">adaptive education system</span> that personalizes learning
                        by understanding each learner&apos;s cognitive profile and tracking their progress through a knowledge graph.
                      </p>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="rounded-xl bg-primary/5 p-4 border border-primary/10">
                          <h3 className="font-semibold text-foreground text-sm mb-3 flex items-center gap-2">
                            <Info className="w-4 h-4 text-primary" />
                            How It Works
                          </h3>
                          <ol className="text-sm text-muted-foreground space-y-2">
                            <li className="flex items-start gap-2">
                              <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-xs font-bold shrink-0">1</span>
                              <span><strong>Add Learners</strong> — Create profiles with optional psychometric assessments</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="w-5 h-5 rounded-full bg-purple-500/10 text-purple-500 flex items-center justify-center text-xs font-bold shrink-0">2</span>
                              <span><strong>Define Concepts</strong> — Build your knowledge graph with topics and difficulty levels</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="w-5 h-5 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center text-xs font-bold shrink-0">3</span>
                              <span><strong>Set Prerequisites</strong> — Connect concepts to show learning dependencies</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="w-5 h-5 rounded-full bg-cyan-500/10 text-cyan-500 flex items-center justify-center text-xs font-bold shrink-0">4</span>
                              <span><strong>Track Progress</strong> — Record knowledge states as learners master concepts</span>
                            </li>
                          </ol>
                        </div>
                        <div className="rounded-xl bg-emerald-500/5 p-4 border border-emerald-500/10">
                          <h3 className="font-semibold text-foreground text-sm mb-3 flex items-center gap-2">
                            <Network className="w-4 h-4 text-emerald-500" />
                            Key Data Types
                          </h3>
                          <ul className="text-sm text-muted-foreground space-y-2">
                            <li className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-emerald-500" />
                              <span><strong>Learners</strong> — Users with psychometric profiles (39 domains)</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-purple-500" />
                              <span><strong>Concepts</strong> — Knowledge units with Bloom levels & difficulty</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-amber-500" />
                              <span><strong>Prerequisites</strong> — Directed edges: &quot;learn A before B&quot;</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-cyan-500" />
                              <span><strong>Knowledge States</strong> — Mastery scores linking learners to concepts</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Data Type Summary Cards */}
                <motion.div variants={itemVariants} className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <motion.button
                    onClick={() => setActiveTab('learners')}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="glass-card p-5 text-left group"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2.5 rounded-xl bg-emerald-500/10 group-hover:bg-emerald-500/20 transition-colors">
                        <Users className="w-5 h-5 text-emerald-500" />
                      </div>
                      <h3 className="font-semibold text-foreground">Learners</h3>
                    </div>
                    <p className="text-muted-foreground text-sm mb-3">User profiles with psychometric assessments</p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-emerald-500">{learners.length}</span>
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                    </div>
                  </motion.button>

                  <motion.button
                    onClick={() => setActiveTab('concepts')}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="glass-card p-5 text-left group"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2.5 rounded-xl bg-purple-500/10 group-hover:bg-purple-500/20 transition-colors">
                        <BookOpen className="w-5 h-5 text-purple-500" />
                      </div>
                      <h3 className="font-semibold text-foreground">Concepts</h3>
                    </div>
                    <p className="text-muted-foreground text-sm mb-3">Knowledge units with Bloom taxonomy levels</p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-purple-500">{concepts.length}</span>
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-purple-500 group-hover:translate-x-1 transition-all" />
                    </div>
                  </motion.button>

                  <motion.button
                    onClick={() => setActiveTab('prerequisites')}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="glass-card p-5 text-left group"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2.5 rounded-xl bg-amber-500/10 group-hover:bg-amber-500/20 transition-colors">
                        <GitBranch className="w-5 h-5 text-amber-500" />
                      </div>
                      <h3 className="font-semibold text-foreground">Prerequisites</h3>
                    </div>
                    <p className="text-muted-foreground text-sm mb-3">Dependency edges between concepts</p>
                    <div className="flex items-center justify-between">
                      <Link href="/graph" className="text-sm text-amber-500 hover:underline">View in Graph</Link>
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-amber-500 group-hover:translate-x-1 transition-all" />
                    </div>
                  </motion.button>

                  <motion.button
                    onClick={() => setActiveTab('knowledge-states')}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="glass-card p-5 text-left group"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2.5 rounded-xl bg-cyan-500/10 group-hover:bg-cyan-500/20 transition-colors">
                        <BarChart3 className="w-5 h-5 text-cyan-500" />
                      </div>
                      <h3 className="font-semibold text-foreground">Knowledge States</h3>
                    </div>
                    <p className="text-muted-foreground text-sm mb-3">Learner progress on each concept</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">mastery & bloom</span>
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-cyan-500 group-hover:translate-x-1 transition-all" />
                    </div>
                  </motion.button>
                </motion.div>

                {/* Live Data Preview */}
                <motion.div variants={itemVariants} className="glass-card p-6">
                  <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Live Data Preview
                  </h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-medium text-sm text-muted-foreground mb-3">Recent Learners</h3>
                      {learners.length > 0 ? (
                        <div className="space-y-2">
                          {learners.slice(0, 3).map((l) => (
                            <div key={l.userId} className="flex items-center gap-3 p-3 rounded-xl bg-accent/50">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-white font-bold text-sm">
                                {(l.name || l.userId).charAt(0).toUpperCase()}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-foreground truncate">{l.name || 'Unnamed'}</div>
                                <div className="text-xs text-muted-foreground font-mono truncate">{l.userId}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-6 rounded-xl bg-accent/30">
                          <p className="text-muted-foreground text-sm mb-2">No learners yet</p>
                          <button
                            onClick={() => setActiveTab('learners')}
                            className="text-emerald-500 text-sm hover:underline flex items-center gap-1 mx-auto"
                          >
                            <Plus className="w-3 h-3" />
                            Add your first learner
                          </button>
                        </div>
                      )}
                    </div>

                    <div>
                      <h3 className="font-medium text-sm text-muted-foreground mb-3">Recent Concepts</h3>
                      {concepts.length > 0 ? (
                        <div className="space-y-2">
                          {concepts.slice(0, 3).map((c) => (
                            <div key={c.conceptId} className="flex items-center gap-3 p-3 rounded-xl bg-accent/50">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm">
                                {c.name.charAt(0).toUpperCase()}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-foreground truncate">{c.name}</div>
                                <div className="text-xs text-muted-foreground truncate">{c.domain}</div>
                              </div>
                              <span className="text-xs px-2 py-1 rounded-lg bg-purple-500/10 text-purple-500 font-mono">
                                {c.conceptId}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-6 rounded-xl bg-accent/30">
                          <p className="text-muted-foreground text-sm mb-2">No concepts yet</p>
                          <button
                            onClick={() => setActiveTab('concepts')}
                            className="text-purple-500 text-sm hover:underline flex items-center gap-1 mx-auto"
                          >
                            <Plus className="w-3 h-3" />
                            Add your first concept
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* Learners Tab */}
            {activeTab === 'learners' && (
              <motion.div
                key="learners"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0 }}
                className="grid lg:grid-cols-2 gap-8"
              >
                {/* Documentation */}
                <motion.div variants={itemVariants} className="glass-card p-6">
                  <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-emerald-500" />
                    Learner Data Structure
                  </h2>

                  <div className="space-y-4">
                    <div className="rounded-xl bg-accent/50 p-4">
                      <h3 className="font-semibold text-foreground text-sm mb-2">Required Fields</h3>
                      <code className="text-sm text-muted-foreground block">
                        name: string - Display name for the learner
                      </code>
                    </div>

                    <div className="rounded-xl bg-accent/50 p-4">
                      <h3 className="font-semibold text-foreground text-sm mb-2">Optional Fields</h3>
                      <ul className="text-sm text-muted-foreground space-y-1.5">
                        <li><code className="text-primary">userId</code> - Custom ID (auto-generated if not provided)</li>
                        <li><code className="text-primary">email</code> - Contact email</li>
                        <li><code className="text-primary">psychometricScores</code> - Object with 39 domain scores (0-100)</li>
                        <li><code className="text-primary">learningStyle</code> - Visual/Auditory/Kinesthetic/Reading preferences</li>
                        <li><code className="text-primary">cognitiveProfile</code> - Working memory, attention span, processing speed</li>
                      </ul>
                    </div>

                    <div className="rounded-xl bg-accent/50 p-4">
                      <h3 className="font-semibold text-foreground text-sm mb-2">Example JSON</h3>
                      <pre className="text-xs text-muted-foreground overflow-x-auto bg-background/50 p-3 rounded-lg">
{`{
  "name": "Alex Chen",
  "email": "alex@example.com",
  "psychometricScores": {
    "verbal-comprehension": {
      "score": 75,
      "confidence": 0.8
    }
  },
  "learningStyle": {
    "primary": "visual",
    "socialPreference": "solo"
  }
}`}
                      </pre>
                    </div>
                  </div>
                </motion.div>

                {/* Form */}
                <motion.div variants={itemVariants} className="glass-card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                      <Plus className="w-5 h-5 text-emerald-500" />
                      Add New Learner
                    </h2>
                    {/* Input Mode Toggle */}
                    <div className="flex bg-accent rounded-lg p-1">
                      <button
                        type="button"
                        onClick={() => setLearnerInputMode('form')}
                        className={cn(
                          'px-3 py-1.5 text-xs font-medium rounded-md transition-all',
                          learnerInputMode === 'form'
                            ? 'bg-primary text-primary-foreground shadow'
                            : 'text-muted-foreground hover:text-foreground'
                        )}
                      >
                        <FileText className="w-3 h-3 inline mr-1" />
                        Form
                      </button>
                      <button
                        type="button"
                        onClick={() => setLearnerInputMode('json')}
                        className={cn(
                          'px-3 py-1.5 text-xs font-medium rounded-md transition-all',
                          learnerInputMode === 'json'
                            ? 'bg-primary text-primary-foreground shadow'
                            : 'text-muted-foreground hover:text-foreground'
                        )}
                      >
                        <Code className="w-3 h-3 inline mr-1" />
                        JSON
                      </button>
                    </div>
                  </div>

                  <form onSubmit={handleAddLearner} className="space-y-4">
                    {learnerInputMode === 'json' ? (
                      /* JSON Input Mode */
                      <div>
                        <label className="form-label">Paste Full Learner JSON</label>
                        <textarea
                          value={learnerJson}
                          onChange={(e) => setLearnerJson(e.target.value)}
                          className="form-input font-mono text-xs h-64"
                          placeholder={`{
  "name": "Alex Chen",
  "email": "alex@example.com",
  "psychometricScores": {...},
  "learningStyle": {...}
}`}
                        />
                      </div>
                    ) : (
                      /* Form Input Mode */
                      <div className="space-y-6">
                        {/* Basic Info Section */}
                        <div className="space-y-4">
                          <h3 className="text-sm font-semibold text-muted-foreground border-b border-border pb-1">Basic Information</h3>
                          <div>
                            <label className="form-label">
                              Name <span className="text-destructive">*</span>
                            </label>
                            <input
                              type="text"
                              required
                              value={learnerForm.name}
                              onChange={(e) => setLearnerForm({ ...learnerForm, name: e.target.value })}
                              className="form-input"
                              placeholder="Alex Chen"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="form-label">Email</label>
                              <input
                                type="email"
                                value={learnerForm.email}
                                onChange={(e) => setLearnerForm({ ...learnerForm, email: e.target.value })}
                                className="form-input"
                                placeholder="alex@example.com"
                              />
                            </div>
                            <div>
                              <label className="form-label">Custom ID</label>
                              <input
                                type="text"
                                value={learnerForm.userId}
                                onChange={(e) => setLearnerForm({ ...learnerForm, userId: e.target.value })}
                                className="form-input"
                                placeholder="auto-generated"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Learning Style Section */}
                        <div className="space-y-3">
                          <h3 className="text-sm font-semibold text-blue-500 dark:text-blue-400 border-b border-border pb-1">Learning Style (Optional)</h3>
                          <div className="grid grid-cols-3 gap-3">
                            <div>
                              <label className="text-xs font-medium text-muted-foreground mb-1 block">Primary Modality</label>
                              <select
                                value={learnerForm.learningStylePrimary}
                                onChange={(e) => setLearnerForm({ ...learnerForm, learningStylePrimary: e.target.value as '' | 'visual' | 'auditory' | 'kinesthetic' | 'reading' })}
                                className="form-input text-sm py-2"
                              >
                                <option value="">Select...</option>
                                <option value="visual">Visual</option>
                                <option value="auditory">Auditory</option>
                                <option value="kinesthetic">Kinesthetic</option>
                                <option value="reading">Reading/Writing</option>
                              </select>
                            </div>
                            <div>
                              <label className="text-xs font-medium text-muted-foreground mb-1 block">Social Pref</label>
                              <select
                                value={learnerForm.socialPreference}
                                onChange={(e) => setLearnerForm({ ...learnerForm, socialPreference: e.target.value as '' | 'solo' | 'collaborative' | 'mixed' })}
                                className="form-input text-sm py-2"
                              >
                                <option value="">Select...</option>
                                <option value="solo">Solo</option>
                                <option value="collaborative">Collaborative</option>
                                <option value="mixed">Mixed</option>
                              </select>
                            </div>
                            <div>
                              <label className="text-xs font-medium text-muted-foreground mb-1 block">Pace Pref</label>
                              <select
                                value={learnerForm.pacePreference}
                                onChange={(e) => setLearnerForm({ ...learnerForm, pacePreference: e.target.value as '' | 'self-paced' | 'structured' | 'intensive' })}
                                className="form-input text-sm py-2"
                              >
                                <option value="">Select...</option>
                                <option value="self-paced">Self-Paced</option>
                                <option value="structured">Structured</option>
                                <option value="intensive">Intensive</option>
                              </select>
                            </div>
                          </div>
                        </div>

                        {/* Cognitive Profile Section */}
                        <div className="space-y-3">
                          <h3 className="text-sm font-semibold text-purple-500 dark:text-purple-400 border-b border-border pb-1">Cognitive Profile (Optional)</h3>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="text-xs font-medium text-muted-foreground mb-1 block">Working Memory</label>
                              <select
                                value={learnerForm.workingMemoryCapacity}
                                onChange={(e) => setLearnerForm({ ...learnerForm, workingMemoryCapacity: e.target.value as '' | 'low' | 'medium' | 'high' })}
                                className="form-input text-sm py-2"
                              >
                                <option value="">Select...</option>
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                              </select>
                            </div>
                            <div>
                              <label className="text-xs font-medium text-muted-foreground mb-1 block">Attention Span</label>
                              <select
                                value={learnerForm.attentionSpan}
                                onChange={(e) => setLearnerForm({ ...learnerForm, attentionSpan: e.target.value as '' | 'short' | 'medium' | 'long' })}
                                className="form-input text-sm py-2"
                              >
                                <option value="">Select...</option>
                                <option value="short">Short</option>
                                <option value="medium">Medium</option>
                                <option value="long">Long</option>
                              </select>
                            </div>
                            <div>
                              <label className="text-xs font-medium text-muted-foreground mb-1 block">Processing Speed</label>
                              <select
                                value={learnerForm.processingSpeed}
                                onChange={(e) => setLearnerForm({ ...learnerForm, processingSpeed: e.target.value as '' | 'slow' | 'medium' | 'fast' })}
                                className="form-input text-sm py-2"
                              >
                                <option value="">Select...</option>
                                <option value="slow">Slow</option>
                                <option value="medium">Medium</option>
                                <option value="fast">Fast</option>
                              </select>
                            </div>
                            <div>
                              <label className="text-xs font-medium text-muted-foreground mb-1 block">Abstract Thinking</label>
                              <select
                                value={learnerForm.abstractThinking}
                                onChange={(e) => setLearnerForm({ ...learnerForm, abstractThinking: e.target.value as '' | 'concrete' | 'mixed' | 'abstract' })}
                                className="form-input text-sm py-2"
                              >
                                <option value="">Select...</option>
                                <option value="concrete">Concrete</option>
                                <option value="mixed">Mixed</option>
                                <option value="abstract">Abstract</option>
                              </select>
                            </div>
                          </div>
                        </div>

                        {/* Psychometric Scores Section */}
                        <div className="space-y-3">
                          <h3 className="text-sm font-semibold text-emerald-500 dark:text-emerald-400 border-b border-border pb-1 flex items-center gap-2">
                            <Brain className="w-4 h-4" />
                            Psychometric Scores (Optional) — 39 Domains
                          </h3>
                          <p className="text-xs text-muted-foreground">Click a category to expand and set scores (0-100)</p>

                          <div className="max-h-64 overflow-y-auto space-y-2 pr-2">
                            {Object.entries(PSYCHOMETRIC_CATEGORIES).map(([category, domains]) => (
                              <div key={category} className="rounded-xl bg-accent/50 overflow-hidden">
                                <button
                                  type="button"
                                  onClick={() => toggleCategory(category)}
                                  className="w-full px-3 py-2 flex items-center justify-between text-left hover:bg-accent transition-colors"
                                >
                                  <span className="text-sm font-medium text-foreground">{category}</span>
                                  <span className="text-xs text-muted-foreground flex items-center gap-2">
                                    {domains.filter(d => psychometricScores[d.id]).length}/{domains.length}
                                    {expandedCategories.includes(category) ? (
                                      <ChevronDown className="w-4 h-4" />
                                    ) : (
                                      <ChevronRight className="w-4 h-4" />
                                    )}
                                  </span>
                                </button>

                                <AnimatePresence>
                                  {expandedCategories.includes(category) && (
                                    <motion.div
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: 'auto', opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      className="px-3 pb-3 space-y-2 border-t border-border"
                                    >
                                      {domains.map((domain) => (
                                        <div key={domain.id} className="flex items-center gap-2 mt-2">
                                          <div className="flex-1 min-w-0">
                                            <label className="block text-xs font-medium text-foreground truncate" title={domain.desc}>
                                              {domain.name}
                                            </label>
                                            <p className="text-[10px] text-muted-foreground truncate">{domain.desc}</p>
                                          </div>
                                          <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            value={psychometricScores[domain.id]?.score ?? ''}
                                            onChange={(e) => {
                                              const val = e.target.value;
                                              if (val === '') {
                                                const newScores = { ...psychometricScores };
                                                delete newScores[domain.id];
                                                setPsychometricScores(newScores);
                                              } else {
                                                updatePsychometricScore(domain.id, parseInt(val) || 0);
                                              }
                                            }}
                                            className="w-16 form-input text-xs text-center py-1 px-2"
                                            placeholder="0-100"
                                          />
                                        </div>
                                      ))}
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            ))}
                          </div>

                          {Object.keys(psychometricScores).length > 0 && (
                            <div className="text-xs text-emerald-500 mt-2">
                              {Object.keys(psychometricScores).length} score(s) set
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    <button
                      type="submit"
                      className="btn btn-success w-full"
                    >
                      {learnerInputMode === 'json' ? 'Submit JSON' : 'Add Learner'}
                    </button>
                  </form>

                  <div className="mt-6">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">
                      Existing Learners ({learners.length})
                    </h3>
                    <div className="max-h-32 overflow-y-auto rounded-xl bg-accent/50 p-2">
                      {learners.length === 0 ? (
                        <p className="text-muted-foreground text-sm text-center py-2">No learners yet</p>
                      ) : (
                        learners.map((l) => (
                          <div key={l.userId} className="text-sm text-foreground py-1.5 px-2 rounded-lg hover:bg-accent">
                            {l.name || l.userId}
                            <span className="text-muted-foreground ml-2">({l.userId})</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* Concepts Tab */}
            {activeTab === 'concepts' && (
              <motion.div
                key="concepts"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0 }}
                className="grid lg:grid-cols-2 gap-8"
              >
                {/* Documentation */}
                <motion.div variants={itemVariants} className="glass-card p-6">
                  <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-purple-500" />
                    Concept Data Structure
                  </h2>

                  <div className="space-y-4">
                    <div className="rounded-xl bg-accent/50 p-4">
                      <h3 className="font-semibold text-foreground text-sm mb-2">Required Fields</h3>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li><code className="text-primary">conceptId</code> - Unique identifier (e.g., &quot;algebra-101&quot;)</li>
                        <li><code className="text-primary">name</code> - Human-readable name</li>
                        <li><code className="text-primary">domain</code> - Subject area (e.g., &quot;mathematics&quot;)</li>
                        <li><code className="text-primary">description</code> - What this concept covers</li>
                      </ul>
                    </div>

                    <div className="rounded-xl bg-accent/50 p-4">
                      <h3 className="font-semibold text-foreground text-sm mb-2">Difficulty Object</h3>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li><code className="text-primary">absolute</code> - Overall difficulty (1-10 scale)</li>
                        <li><code className="text-primary">cognitiveLoad</code> - Working memory demand (0-1)</li>
                        <li><code className="text-primary">abstractness</code> - Concrete to abstract (0-1)</li>
                      </ul>
                    </div>

                    <div className="rounded-xl bg-accent/50 p-4">
                      <h3 className="font-semibold text-foreground text-sm mb-2">Bloom&apos;s Taxonomy Levels</h3>
                      <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                        <li><strong>Remember</strong> - Recall facts and basic concepts</li>
                        <li><strong>Understand</strong> - Explain ideas or concepts</li>
                        <li><strong>Apply</strong> - Use information in new situations</li>
                        <li><strong>Analyze</strong> - Draw connections among ideas</li>
                        <li><strong>Evaluate</strong> - Justify a decision or course of action</li>
                        <li><strong>Create</strong> - Produce new or original work</li>
                      </ol>
                    </div>
                  </div>
                </motion.div>

                {/* Form */}
                <motion.div variants={itemVariants} className="glass-card p-6">
                  <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                    <Plus className="w-5 h-5 text-purple-500" />
                    Add New Concept
                  </h2>

                  <form onSubmit={handleAddConcept} className="space-y-4">
                    <div>
                      <label className="form-label">
                        Concept ID <span className="text-destructive">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={conceptForm.conceptId}
                        onChange={(e) => setConceptForm({ ...conceptForm, conceptId: e.target.value })}
                        className="form-input"
                        placeholder="algebra-quadratics"
                      />
                    </div>

                    <div>
                      <label className="form-label">
                        Name <span className="text-destructive">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={conceptForm.name}
                        onChange={(e) => setConceptForm({ ...conceptForm, name: e.target.value })}
                        className="form-input"
                        placeholder="Quadratic Equations"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="form-label">
                          Domain <span className="text-destructive">*</span>
                        </label>
                        <select
                          value={conceptForm.domain}
                          onChange={(e) => setConceptForm({ ...conceptForm, domain: e.target.value })}
                          className="form-input"
                        >
                          <option value="mathematics">Mathematics</option>
                          <option value="science">Science</option>
                          <option value="programming">Programming</option>
                          <option value="language">Language</option>
                          <option value="history">History</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="form-label">Subdomain</label>
                        <input
                          type="text"
                          value={conceptForm.subdomain}
                          onChange={(e) => setConceptForm({ ...conceptForm, subdomain: e.target.value })}
                          className="form-input"
                          placeholder="algebra"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="form-label">
                        Description <span className="text-destructive">*</span>
                      </label>
                      <textarea
                        required
                        value={conceptForm.description}
                        onChange={(e) => setConceptForm({ ...conceptForm, description: e.target.value })}
                        className="form-input"
                        rows={2}
                        placeholder="What this concept covers..."
                      />
                    </div>

                    <div>
                      <label className="form-label">
                        Difficulty (1-10): <span className="text-purple-500 font-bold">{conceptForm.difficulty}</span>
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={conceptForm.difficulty}
                        onChange={(e) => setConceptForm({ ...conceptForm, difficulty: parseInt(e.target.value) })}
                        className="w-full accent-purple-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="form-label">
                          Cognitive Load: <span className="text-purple-500">{conceptForm.cognitiveLoad.toFixed(1)}</span>
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={conceptForm.cognitiveLoad}
                          onChange={(e) => setConceptForm({ ...conceptForm, cognitiveLoad: parseFloat(e.target.value) })}
                          className="w-full accent-purple-500"
                        />
                      </div>

                      <div>
                        <label className="form-label">
                          Abstractness: <span className="text-purple-500">{conceptForm.abstractness.toFixed(1)}</span>
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={conceptForm.abstractness}
                          onChange={(e) => setConceptForm({ ...conceptForm, abstractness: parseFloat(e.target.value) })}
                          className="w-full accent-purple-500"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="btn w-full bg-purple-600 text-white hover:bg-purple-700 shadow-lg shadow-purple-600/20"
                    >
                      Add Concept
                    </button>
                  </form>

                  <div className="mt-6">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">
                      Existing Concepts ({concepts.length})
                    </h3>
                    <div className="max-h-40 overflow-y-auto rounded-xl bg-accent/50 p-2">
                      {concepts.map((c) => (
                        <div key={c.conceptId} className="text-sm text-foreground py-1.5 px-2 rounded-lg hover:bg-accent">
                          {c.name}
                          <span className="text-muted-foreground ml-2">({c.domain})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* Prerequisites Tab */}
            {activeTab === 'prerequisites' && (
              <motion.div
                key="prerequisites"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0 }}
                className="grid lg:grid-cols-2 gap-8"
              >
                {/* Documentation */}
                <motion.div variants={itemVariants} className="glass-card p-6">
                  <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-amber-500" />
                    Prerequisite Edge Structure
                  </h2>

                  <div className="space-y-4">
                    <div className="rounded-xl bg-accent/50 p-4">
                      <h3 className="font-semibold text-foreground text-sm mb-2">What is a Prerequisite Edge?</h3>
                      <p className="text-sm text-muted-foreground">
                        A prerequisite edge connects two concepts, indicating that one concept
                        should be learned before another. The edge goes FROM the prerequisite
                        TO the dependent concept.
                      </p>
                    </div>

                    <div className="rounded-xl bg-accent/50 p-4">
                      <h3 className="font-semibold text-foreground text-sm mb-2">Required Fields</h3>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li><code className="text-primary">from</code> - The prerequisite concept ID</li>
                        <li><code className="text-primary">to</code> - The concept that depends on the prerequisite</li>
                      </ul>
                    </div>

                    <div className="rounded-xl bg-accent/50 p-4">
                      <h3 className="font-semibold text-foreground text-sm mb-2">Strength Levels</h3>
                      <ul className="text-sm text-muted-foreground space-y-2">
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-red-500" />
                          <strong className="text-red-500 dark:text-red-400">required</strong> - Must be mastered first
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-amber-500" />
                          <strong className="text-amber-500 dark:text-amber-400">recommended</strong> - Should be learned first
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          <strong className="text-emerald-500 dark:text-emerald-400">helpful</strong> - Nice to have
                        </li>
                      </ul>
                    </div>

                    <div className="rounded-xl bg-accent/50 p-4">
                      <h3 className="font-semibold text-foreground text-sm mb-2">Example</h3>
                      <pre className="text-xs text-muted-foreground overflow-x-auto bg-background/50 p-3 rounded-lg">
{`// "Variables" is required before "Linear Equations"
{
  "from": "math-variables",
  "to": "math-linear-equations",
  "strength": "required"
}

// Visual: [Variables] ──required──> [Linear Equations]`}
                      </pre>
                    </div>
                  </div>
                </motion.div>

                {/* Form */}
                <motion.div variants={itemVariants} className="glass-card p-6">
                  <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                    <Plus className="w-5 h-5 text-amber-500" />
                    Add Prerequisite Edge
                  </h2>

                  <form onSubmit={handleAddPrerequisite} className="space-y-4">
                    <div>
                      <label className="form-label">
                        From (Prerequisite) <span className="text-destructive">*</span>
                      </label>
                      <select
                        required
                        value={prereqForm.from}
                        onChange={(e) => setPrereqForm({ ...prereqForm, from: e.target.value })}
                        className="form-input"
                      >
                        <option value="">Select prerequisite concept...</option>
                        {concepts.map((c) => (
                          <option key={c.conceptId} value={c.conceptId}>
                            {c.name} ({c.conceptId})
                          </option>
                        ))}
                      </select>
                      <p className="text-xs text-muted-foreground mt-1">
                        The concept that should be learned FIRST
                      </p>
                    </div>

                    <div className="flex justify-center py-2">
                      <div className="flex flex-col items-center text-muted-foreground">
                        <ChevronDown className="w-6 h-6 animate-bounce" />
                        <span className="text-xs">leads to</span>
                      </div>
                    </div>

                    <div>
                      <label className="form-label">
                        To (Dependent) <span className="text-destructive">*</span>
                      </label>
                      <select
                        required
                        value={prereqForm.to}
                        onChange={(e) => setPrereqForm({ ...prereqForm, to: e.target.value })}
                        className="form-input"
                      >
                        <option value="">Select dependent concept...</option>
                        {concepts.map((c) => (
                          <option key={c.conceptId} value={c.conceptId}>
                            {c.name} ({c.conceptId})
                          </option>
                        ))}
                      </select>
                      <p className="text-xs text-muted-foreground mt-1">
                        The concept that requires the prerequisite
                      </p>
                    </div>

                    <div>
                      <label className="form-label">Strength</label>
                      <div className="flex gap-4">
                        {(['required', 'recommended', 'helpful'] as const).map((s) => (
                          <label key={s} className="flex items-center cursor-pointer">
                            <input
                              type="radio"
                              name="strength"
                              value={s}
                              checked={prereqForm.strength === s}
                              onChange={(e) => setPrereqForm({ ...prereqForm, strength: e.target.value as typeof prereqForm.strength })}
                              className="mr-2 accent-amber-500"
                            />
                            <span className={cn(
                              'text-sm font-medium',
                              s === 'required' ? 'text-red-500 dark:text-red-400' :
                              s === 'recommended' ? 'text-amber-500 dark:text-amber-400' : 'text-emerald-500 dark:text-emerald-400'
                            )}>
                              {s}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="form-label">Reason (optional)</label>
                      <input
                        type="text"
                        value={prereqForm.reason}
                        onChange={(e) => setPrereqForm({ ...prereqForm, reason: e.target.value })}
                        className="form-input"
                        placeholder="Why is this prerequisite needed?"
                      />
                    </div>

                    <button
                      type="submit"
                      className="btn w-full bg-amber-600 text-white hover:bg-amber-700 shadow-lg shadow-amber-600/20"
                    >
                      Add Prerequisite Edge
                    </button>
                  </form>

                  {prereqForm.from && prereqForm.to && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 p-4 rounded-xl bg-accent/50"
                    >
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">Preview</h3>
                      <div className="text-center text-foreground">
                        <span className="text-purple-500">
                          {concepts.find(c => c.conceptId === prereqForm.from)?.name || prereqForm.from}
                        </span>
                        <span className={cn(
                          'mx-2',
                          prereqForm.strength === 'required' ? 'text-red-500' :
                          prereqForm.strength === 'recommended' ? 'text-amber-500' : 'text-emerald-500'
                        )}>
                          ──{prereqForm.strength}──▶
                        </span>
                        <span className="text-purple-500">
                          {concepts.find(c => c.conceptId === prereqForm.to)?.name || prereqForm.to}
                        </span>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              </motion.div>
            )}

            {/* Knowledge States Tab */}
            {activeTab === 'knowledge-states' && (
              <motion.div
                key="knowledge-states"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0 }}
                className="grid lg:grid-cols-2 gap-8"
              >
                {/* Documentation */}
                <motion.div variants={itemVariants} className="glass-card p-6">
                  <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-cyan-500" />
                    Knowledge State Structure
                  </h2>

                  <div className="space-y-4">
                    <div className="rounded-xl bg-accent/50 p-4">
                      <h3 className="font-semibold text-foreground text-sm mb-2">What is a Knowledge State?</h3>
                      <p className="text-sm text-muted-foreground">
                        A knowledge state tracks a learner&apos;s progress on a specific concept.
                        It bridges the learner graph with the knowledge graph, recording
                        mastery level, Bloom level achieved, and learning history.
                      </p>
                    </div>

                    <div className="rounded-xl bg-accent/50 p-4">
                      <h3 className="font-semibold text-foreground text-sm mb-2">Required Fields</h3>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li><code className="text-primary">userId</code> - The learner&apos;s ID</li>
                        <li><code className="text-primary">conceptId</code> - The concept being tracked</li>
                      </ul>
                    </div>

                    <div className="rounded-xl bg-accent/50 p-4">
                      <h3 className="font-semibold text-foreground text-sm mb-2">Progress Fields</h3>
                      <ul className="text-sm text-muted-foreground space-y-2">
                        <li>
                          <strong>mastery</strong> (0-100) - Overall understanding percentage
                          <div className="ml-4 mt-1 space-y-1 text-xs">
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-red-500" />
                              0-39: Gap (Red)
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-amber-500" />
                              40-79: Partial (Yellow)
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-emerald-500" />
                              80-100: Mastered (Green)
                            </div>
                          </div>
                        </li>
                        <li className="mt-2">
                          <strong>bloomLevel</strong> (1-6) - Highest demonstrated cognitive level
                        </li>
                      </ul>
                    </div>
                  </div>
                </motion.div>

                {/* Form */}
                <motion.div variants={itemVariants} className="glass-card p-6">
                  <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                    <Plus className="w-5 h-5 text-cyan-500" />
                    Add/Update Knowledge State
                  </h2>

                  <form onSubmit={handleAddKnowledgeState} className="space-y-4">
                    <div>
                      <label className="form-label">
                        Learner <span className="text-destructive">*</span>
                      </label>
                      <select
                        required
                        value={stateForm.userId}
                        onChange={(e) => setStateForm({ ...stateForm, userId: e.target.value })}
                        className="form-input"
                      >
                        <option value="">Select learner...</option>
                        {learners.map((l) => (
                          <option key={l.userId} value={l.userId}>
                            {l.name || l.userId}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="form-label">
                        Concept <span className="text-destructive">*</span>
                      </label>
                      <select
                        required
                        value={stateForm.conceptId}
                        onChange={(e) => setStateForm({ ...stateForm, conceptId: e.target.value })}
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

                    <div>
                      <label className="form-label">
                        Mastery Level: <span className={cn(
                          'font-bold',
                          stateForm.mastery >= 80 ? 'text-emerald-500' :
                          stateForm.mastery >= 40 ? 'text-amber-500' : 'text-red-500'
                        )}>{stateForm.mastery}%</span>
                        <span className="ml-2 text-xs text-muted-foreground">
                          ({stateForm.mastery >= 80 ? 'Mastered' :
                            stateForm.mastery >= 40 ? 'Partial' : 'Gap'})
                        </span>
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={stateForm.mastery}
                        onChange={(e) => setStateForm({ ...stateForm, mastery: parseInt(e.target.value) })}
                        className={cn(
                          'w-full',
                          stateForm.mastery >= 80 ? 'accent-emerald-500' :
                          stateForm.mastery >= 40 ? 'accent-amber-500' : 'accent-red-500'
                        )}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>0 (No knowledge)</span>
                        <span>100 (Full mastery)</span>
                      </div>
                    </div>

                    <div>
                      <label className="form-label">Bloom Level Achieved</label>
                      <select
                        value={stateForm.bloomLevel}
                        onChange={(e) => setStateForm({ ...stateForm, bloomLevel: parseInt(e.target.value) as 1 | 2 | 3 | 4 | 5 | 6 })}
                        className="form-input"
                      >
                        <option value={1}>1 - Remember (recall facts)</option>
                        <option value={2}>2 - Understand (explain ideas)</option>
                        <option value={3}>3 - Apply (use in new situations)</option>
                        <option value={4}>4 - Analyze (draw connections)</option>
                        <option value={5}>5 - Evaluate (justify decisions)</option>
                        <option value={6}>6 - Create (produce new work)</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      className="btn w-full bg-cyan-600 text-white hover:bg-cyan-700 shadow-lg shadow-cyan-600/20"
                    >
                      Save Knowledge State
                    </button>
                  </form>

                  {stateForm.userId && stateForm.conceptId && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 p-4 rounded-xl bg-accent/50"
                    >
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">Preview</h3>
                      <div className="text-foreground text-sm">
                        <span className="text-emerald-500">
                          {learners.find(l => l.userId === stateForm.userId)?.name || stateForm.userId}
                        </span>
                        {' → '}
                        <span className="text-purple-500">
                          {concepts.find(c => c.conceptId === stateForm.conceptId)?.name || stateForm.conceptId}
                        </span>
                        <div className="mt-2 flex items-center gap-2">
                          <span className={cn(
                            'px-2 py-1 rounded-lg text-xs font-medium',
                            stateForm.mastery >= 80 ? 'bg-emerald-500/10 text-emerald-500' :
                            stateForm.mastery >= 40 ? 'bg-amber-500/10 text-amber-500' : 'bg-red-500/10 text-red-500'
                          )}>
                            {stateForm.mastery}% mastery
                          </span>
                          <span className="text-muted-foreground text-xs">
                            Bloom Level {stateForm.bloomLevel}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
