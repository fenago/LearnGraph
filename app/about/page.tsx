'use client';

import { motion } from 'framer-motion';
import { Sidebar } from '../components/Sidebar';
import {
  Brain,
  GitBranch,
  Lightbulb,
  Target,
  Clock,
  Users,
  Sparkles,
  BookOpen,
  BarChart3,
  Shield,
  Zap,
  Heart,
  CheckCircle2,
  ArrowRight,
  Database,
  Network,
  AlertTriangle,
  TrendingUp,
  GraduationCap,
  Terminal,
  Bot,
  FileText,
  ClipboardList,
  Settings,
  Upload,
  Play,
  RefreshCw,
  ToggleLeft,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const staggerChildren = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function AboutPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-8 py-12">
          {/* Hero Section */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-16 text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Psychometric-Adaptive Learning Intelligence
            </div>
            <h1 className="text-5xl font-bold tracking-tight text-foreground mb-6">
              Welcome to{' '}
              <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                LearnGraph
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              A personalized tutoring database that makes any LLM smarter about each specific user.
              LearnGraph combines psychometric profiling with educational psychology to deliver
              truly personalized learning experiences.
            </p>
          </motion.section>

          {/* The Problem & Solution */}
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-16"
          >
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl border border-border/50 bg-card/50">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-red-500/10">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                  </div>
                  <h3 className="font-semibold text-lg">Without LearnGraph</h3>
                </div>
                <div className="bg-muted/50 rounded-lg p-4 font-mono text-sm">
                  <p className="text-muted-foreground">User: "Explain linear equations"</p>
                  <p className="text-foreground mt-2">LLM: [Generic explanation, same for everyone]</p>
                </div>
              </div>

              <div className="p-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-emerald-500/10">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  </div>
                  <h3 className="font-semibold text-lg">With LearnGraph</h3>
                </div>
                <div className="bg-background/50 rounded-lg p-4 font-mono text-sm">
                  <p className="text-muted-foreground">User: "Explain linear equations"</p>
                  <p className="text-xs text-primary mt-2 mb-2">
                    System retrieves: visual learner, struggles with "moving terms", high anxiety
                  </p>
                  <p className="text-foreground">
                    LLM: [Personalized explanation with diagrams, addresses their confusion, gentle tone]
                  </p>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Main Features: The Core Value */}
          <motion.section
            variants={staggerChildren}
            initial="initial"
            animate="animate"
            className="mb-16"
          >
            <h2 className="text-2xl font-bold text-foreground mb-8 flex items-center gap-3">
              <Zap className="w-6 h-6 text-amber-500" />
              Main Features: The Core Value
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  icon: GitBranch,
                  title: 'Personalized Learning Paths',
                  description: 'Every student gets a unique path based on what they know and how they learn',
                  gradient: 'from-blue-500 to-cyan-500',
                },
                {
                  icon: Brain,
                  title: 'Psychometric Profiling',
                  description: 'Track 39 psychological domains to understand how each learner thinks',
                  gradient: 'from-purple-500 to-violet-500',
                },
                {
                  icon: Network,
                  title: 'Prerequisite Intelligence',
                  description: "Never learn something you're not ready for; always know what comes next",
                  gradient: 'from-indigo-500 to-blue-500',
                },
                {
                  icon: AlertTriangle,
                  title: 'Gap Detection',
                  description: 'Automatically find missing knowledge, forgotten concepts, and misconceptions',
                  gradient: 'from-amber-500 to-orange-500',
                },
                {
                  icon: Clock,
                  title: 'Spaced Repetition',
                  description: 'Science-backed review scheduling using the Ebbinghaus forgetting curve',
                  gradient: 'from-emerald-500 to-green-500',
                },
                {
                  icon: Target,
                  title: 'ZPD Engine',
                  description: "Vygotsky's Zone of Proximal Development to find challenging but achievable concepts",
                  gradient: 'from-pink-500 to-rose-500',
                },
                {
                  icon: Upload,
                  title: 'AI Curriculum Ingestion',
                  description: 'Teachers describe a course in plain English, AI generates the knowledge graph',
                  gradient: 'from-cyan-500 to-teal-500',
                  badge: 'NEW',
                },
                {
                  icon: ClipboardList,
                  title: 'AI Assessment Generation',
                  description: 'Auto-generate quizzes and tests for each concept (toggle on/off)',
                  gradient: 'from-violet-500 to-purple-500',
                  badge: 'NEW',
                },
                {
                  icon: Bot,
                  title: 'RAG Context for LLMs',
                  description: 'Give any AI tutor rich context about the learner for personalized responses',
                  gradient: 'from-slate-500 to-gray-500',
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  variants={fadeInUp}
                  className="p-5 rounded-xl border border-border/50 bg-card/50 hover:bg-card/80 transition-colors relative"
                >
                  {item.badge && (
                    <span className="absolute top-3 right-3 px-2 py-0.5 text-[10px] font-bold rounded-full bg-primary text-primary-foreground">
                      {item.badge}
                    </span>
                  )}
                  <div
                    className={cn(
                      'w-10 h-10 rounded-lg flex items-center justify-center mb-4',
                      `bg-gradient-to-br ${item.gradient}`
                    )}
                  >
                    <item.icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Quick Test Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-3">
              <Terminal className="w-6 h-6 text-emerald-500" />
              Quick Test: See the Value in 2 Minutes
            </h2>
            <p className="text-muted-foreground mb-6">
              Run these commands after starting the app to see what LearnGraph does:
            </p>
            <div className="space-y-4">
              {[
                {
                  step: '1',
                  title: 'Create a Learner',
                  code: `curl -X POST http://localhost:3000/api/learners \\
  -H "Content-Type: application/json" \\
  -d '{"name": "Test User", "email": "test@example.com"}'`,
                  note: 'Save the userId from the response',
                },
                {
                  step: '2',
                  title: 'Add Sample Curriculum',
                  code: 'curl -X POST http://localhost:3000/api/seed-concepts',
                  note: 'Creates a sample knowledge graph with concepts and prerequisites',
                },
                {
                  step: '3',
                  title: 'Track Some Knowledge',
                  code: `curl -X POST http://localhost:3000/api/knowledge-state \\
  -H "Content-Type: application/json" \\
  -d '{"userId": "YOUR_USER_ID", "conceptId": "arithmetic", "mastery": 85}'`,
                },
                {
                  step: '4',
                  title: 'Ask "What Should I Learn Next?"',
                  code: 'curl "http://localhost:3000/api/zpd?userId=YOUR_USER_ID"',
                  result: 'Returns concepts in your Zone of Proximal Development',
                },
                {
                  step: '5',
                  title: 'Check for Knowledge Gaps',
                  code: 'curl "http://localhost:3000/api/gaps?userId=YOUR_USER_ID"',
                  result: 'Identifies missing prerequisites, forgotten concepts, and misconceptions',
                },
                {
                  step: '6',
                  title: 'View in the UI',
                  code: 'Open http://localhost:3000/graph',
                  result: 'See the knowledge graph visualized with your mastery levels overlaid',
                },
              ].map((item, i) => (
                <div key={i} className="p-4 rounded-xl border border-border/50 bg-card/30">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-primary font-bold text-sm">{item.step}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-foreground mb-2">{item.title}</h4>
                      <div className="bg-slate-900 rounded-lg p-3 overflow-x-auto">
                        <code className="text-emerald-400 text-xs whitespace-pre">{item.code}</code>
                      </div>
                      {item.note && (
                        <p className="text-xs text-muted-foreground mt-2 italic">{item.note}</p>
                      )}
                      {item.result && (
                        <p className="text-xs text-emerald-500 mt-2 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          {item.result}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Dual-Graph Architecture */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-2xl font-bold text-foreground mb-8 flex items-center gap-3">
              <Network className="w-6 h-6 text-indigo-500" />
              Dual-Graph Architecture
            </h2>
            <div className="p-8 rounded-2xl border border-border/50 bg-card/30">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="p-5 rounded-xl bg-blue-500/5 border border-blue-500/20">
                  <div className="flex items-center gap-3 mb-4">
                    <Users className="w-5 h-5 text-blue-500" />
                    <h3 className="font-semibold">Learner Model (Graph A)</h3>
                  </div>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      User Profiles
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      39 Psychometric Scores
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      Knowledge State
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      Learning History
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      Misconceptions
                    </li>
                  </ul>
                </div>

                <div className="p-5 rounded-xl bg-purple-500/5 border border-purple-500/20 flex flex-col items-center justify-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-4">
                    <Brain className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-center mb-2">ZPD Bridge</h3>
                  <p className="text-sm text-muted-foreground text-center">
                    Zone of Proximal Development Engine
                  </p>
                </div>

                <div className="p-5 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                  <div className="flex items-center gap-3 mb-4">
                    <BookOpen className="w-5 h-5 text-emerald-500" />
                    <h3 className="font-semibold">Knowledge Model (Graph B)</h3>
                  </div>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Concept Nodes
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Prerequisite Edges
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Bloom's Taxonomy Tags
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Difficulty Ratings
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Scaffolding Strategies
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Getting Learner Profiles - 4 Ways */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-3">
              <Users className="w-6 h-6 text-blue-500" />
              Getting Learner Profiles Into the Graph
            </h2>
            <p className="text-muted-foreground mb-6">
              Four ways to populate the learner model with psychometric data:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                {
                  title: 'LLM Integration',
                  subtitle: 'Primary - Recommended for Production',
                  effort: 'None for user',
                  accuracy: 'High (continuous)',
                  desc: 'Connect LearnGraph to your AI tutor. The LLM periodically updates the learner model based on interactions.',
                  color: 'blue',
                  icon: Bot,
                },
                {
                  title: 'Psychological Assessments',
                  subtitle: 'Highest Accuracy',
                  effort: '~30 min',
                  accuracy: 'Highest (validated)',
                  desc: 'Use validated instruments like BFI-44, VARK, MSLQ for research or formal education settings.',
                  color: 'purple',
                  icon: ClipboardList,
                },
                {
                  title: 'Manual Entry',
                  subtitle: 'Quick Setup',
                  effort: '~5 min',
                  accuracy: 'Medium (self-report)',
                  desc: 'Users or administrators directly set scores. Great for quick onboarding or user control.',
                  color: 'amber',
                  icon: Settings,
                },
                {
                  title: 'Behavioral Learning',
                  subtitle: 'Cold Start',
                  effort: 'None',
                  accuracy: 'Grows over time',
                  desc: 'Start with neutral defaults, let the system learn from behavior. Confidence grows with interactions.',
                  color: 'emerald',
                  icon: RefreshCw,
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className={cn(
                    'p-5 rounded-xl border',
                    item.color === 'blue' && 'border-blue-500/30 bg-blue-500/5',
                    item.color === 'purple' && 'border-purple-500/30 bg-purple-500/5',
                    item.color === 'amber' && 'border-amber-500/30 bg-amber-500/5',
                    item.color === 'emerald' && 'border-emerald-500/30 bg-emerald-500/5'
                  )}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={cn(
                        'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0',
                        item.color === 'blue' && 'bg-blue-500/20',
                        item.color === 'purple' && 'bg-purple-500/20',
                        item.color === 'amber' && 'bg-amber-500/20',
                        item.color === 'emerald' && 'bg-emerald-500/20'
                      )}
                    >
                      <item.icon
                        className={cn(
                          'w-5 h-5',
                          item.color === 'blue' && 'text-blue-500',
                          item.color === 'purple' && 'text-purple-500',
                          item.color === 'amber' && 'text-amber-500',
                          item.color === 'emerald' && 'text-emerald-500'
                        )}
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">{item.title}</h4>
                      <p className="text-xs text-primary mb-2">{item.subtitle}</p>
                      <p className="text-sm text-muted-foreground mb-3">{item.desc}</p>
                      <div className="flex gap-4 text-xs">
                        <span className="text-muted-foreground">
                          Effort: <span className="text-foreground">{item.effort}</span>
                        </span>
                        <span className="text-muted-foreground">
                          Accuracy: <span className="text-foreground">{item.accuracy}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Hybrid Approach */}
            <div className="mt-6 p-5 rounded-xl border border-primary/30 bg-primary/5">
              <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                Hybrid Approach (Recommended)
              </h4>
              <p className="text-sm text-muted-foreground mb-4">
                Combine multiple sources for the best results. Priority order:
              </p>
              <div className="grid md:grid-cols-4 gap-3">
                {[
                  { priority: '1', name: 'Validated Assessments', conf: '0.9' },
                  { priority: '2', name: 'User Self-Report', conf: '0.7' },
                  { priority: '3', name: 'LLM Inference', conf: '0.3-0.6' },
                  { priority: '4', name: 'Behavioral Defaults', conf: '0.1' },
                ].map((p, i) => (
                  <div key={i} className="p-3 rounded-lg bg-background/50 text-center">
                    <div className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-bold flex items-center justify-center mx-auto mb-2">
                      {p.priority}
                    </div>
                    <p className="text-xs font-medium text-foreground">{p.name}</p>
                    <p className="text-[10px] text-muted-foreground">conf: {p.conf}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* Teacher Workflow - AI Curriculum Ingestion */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-3">
              <Upload className="w-6 h-6 text-cyan-500" />
              Getting Content Into the Graph: Teacher Workflow
            </h2>
            <p className="text-muted-foreground mb-6">
              How do teachers get their curriculum into the system?
            </p>

            {/* Three Approaches */}
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              {[
                {
                  approach: 'Manual Entry',
                  effort: 'High',
                  quality: 'Highest (expert curated)',
                  best: 'Small courses, precise control',
                },
                {
                  approach: 'AI from Syllabus',
                  effort: 'Low',
                  quality: 'Medium (needs review)',
                  best: 'Quick setup, large courses',
                },
                {
                  approach: 'Hybrid',
                  effort: 'Medium',
                  quality: 'High (AI draft → teacher refines)',
                  best: 'Recommended',
                  highlight: true,
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className={cn(
                    'p-4 rounded-xl border',
                    item.highlight
                      ? 'border-cyan-500/50 bg-cyan-500/10'
                      : 'border-border/50 bg-card/50'
                  )}
                >
                  <h4 className="font-semibold text-foreground mb-3 flex items-center justify-between">
                    {item.approach}
                    {item.highlight && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500 text-white">
                        RECOMMENDED
                      </span>
                    )}
                  </h4>
                  <div className="space-y-1 text-xs">
                    <p className="text-muted-foreground">
                      Effort: <span className="text-foreground">{item.effort}</span>
                    </p>
                    <p className="text-muted-foreground">
                      Quality: <span className="text-foreground">{item.quality}</span>
                    </p>
                    <p className="text-muted-foreground">
                      Best for: <span className="text-foreground">{item.best}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Hybrid Workflow Steps */}
            <div className="p-6 rounded-2xl border border-border/50 bg-card/30 mb-6">
              <h4 className="font-semibold text-foreground mb-4">The Hybrid Workflow</h4>
              <div className="space-y-4">
                {[
                  {
                    step: '1',
                    title: 'Teacher Input',
                    desc: 'Upload syllabus, lesson plans, or describe the course in plain English',
                    icon: FileText,
                  },
                  {
                    step: '2',
                    title: 'AI Generates Draft Graph',
                    desc: 'Identifies concepts, infers prerequisites, estimates difficulty, suggests Bloom levels',
                    icon: Bot,
                  },
                  {
                    step: '3',
                    title: 'Teacher Reviews in Visual Graph UI',
                    desc: 'Drag nodes, edit difficulty, add missing prerequisites, approve or modify suggestions',
                    icon: Network,
                  },
                  {
                    step: '4',
                    title: 'System Learns from Corrections',
                    desc: 'Improves future suggestions, builds domain-specific patterns, creates reusable templates',
                    icon: RefreshCw,
                  },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-cyan-500 font-bold text-sm">{item.step}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <item.icon className="w-4 h-4 text-cyan-500" />
                        <h5 className="font-medium text-foreground">{item.title}</h5>
                      </div>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                    {i < 3 && <ArrowRight className="w-4 h-4 text-muted-foreground mt-2 hidden md:block" />}
                  </div>
                ))}
              </div>
            </div>

            {/* Supported Input Formats */}
            <div className="grid md:grid-cols-3 gap-3">
              {[
                { format: 'Syllabus (PDF/Word)', extracts: 'Topics, objectives, weekly schedule' },
                { format: 'Textbook chapters', extracts: 'Concept hierarchy, difficulty progression' },
                { format: 'Lesson plans', extracts: 'Specific skills, prerequisites mentioned' },
                { format: 'Learning objectives', extracts: "Bloom's levels, measurable outcomes" },
                { format: 'Plain text description', extracts: 'Topic list, inferred relationships' },
                { format: 'Curriculum standards', extracts: 'State standards, AP frameworks, etc.' },
              ].map((item, i) => (
                <div key={i} className="p-3 rounded-lg border border-border/50 bg-card/30">
                  <p className="font-medium text-foreground text-sm">{item.format}</p>
                  <p className="text-xs text-muted-foreground">{item.extracts}</p>
                </div>
              ))}
            </div>
          </motion.section>

          {/* AI-Generated Assessments */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-3">
              <ClipboardList className="w-6 h-6 text-violet-500" />
              AI-Generated Assessments
              <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-violet-500/20 text-violet-500">
                Optional Feature
              </span>
            </h2>
            <p className="text-muted-foreground mb-6">
              When curriculum is imported, the system can optionally generate assessments to measure mastery.
              <span className="inline-flex items-center gap-1 ml-2 text-violet-500">
                <ToggleLeft className="w-4 h-4" />
                Toggle ON/OFF
              </span>
            </p>

            {/* Assessment Types */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {[
                { type: 'Quick Check', questions: '2-3', purpose: 'Gate progression', when: 'Before marking complete' },
                { type: 'Mastery Test', questions: '5-10', purpose: 'Determine mastery %', when: 'After studying content' },
                { type: 'Misconception Probe', questions: '3-5', purpose: 'Detect wrong mental models', when: 'When errors indicate confusion' },
                { type: 'Spaced Review', questions: '2-3', purpose: 'Verify retention', when: 'During spaced repetition' },
              ].map((item, i) => (
                <div key={i} className="p-4 rounded-xl border border-violet-500/30 bg-violet-500/5">
                  <h4 className="font-semibold text-foreground mb-2">{item.type}</h4>
                  <p className="text-xs text-violet-500 mb-2">{item.questions} questions</p>
                  <p className="text-xs text-muted-foreground mb-1">
                    <strong>Purpose:</strong> {item.purpose}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    <strong>When:</strong> {item.when}
                  </p>
                </div>
              ))}
            </div>

            {/* Question Types */}
            <div className="p-4 rounded-xl border border-border/50 bg-card/30">
              <h4 className="font-medium text-foreground mb-3">Supported Question Types</h4>
              <div className="grid md:grid-cols-3 gap-2">
                {[
                  { type: 'multiple_choice', example: '"What is 2x when x=3?" A) 5 B) 6 C) 8 D) 9' },
                  { type: 'numeric', example: '"Solve: 3x + 5 = 14. x = ___"' },
                  { type: 'short_answer', example: '"Define what a linear equation is."' },
                  { type: 'worked_problem', example: '"Solve step by step: 2x + 3 = 7"' },
                  { type: 'classification', example: '"Drag each expression to: Linear / Non-linear"' },
                  { type: 'ordering', example: '"Order the steps for solving this equation"' },
                ].map((item, i) => (
                  <div key={i} className="p-2 rounded-lg bg-muted/30">
                    <p className="text-xs font-mono text-violet-500">{item.type}</p>
                    <p className="text-[10px] text-muted-foreground">{item.example}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* 39 Psychological Domains */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-3">
              <Brain className="w-6 h-6 text-pink-500" />
              39 Psychological Domains
            </h2>
            <p className="text-muted-foreground mb-8">
              LearnGraph tracks 39 research-backed psychological dimensions organized into 8 categories:
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { name: 'Core Personality', count: 5, color: 'bg-blue-500', desc: 'Big Five (NEO-PI-R)' },
                { name: 'Dark Personality', count: 3, color: 'bg-slate-500', desc: 'Dark Triad (SD3)' },
                { name: 'Emotional/Social', count: 5, color: 'bg-pink-500', desc: 'EQ, Empathy, Attachment' },
                { name: 'Decision/Motivation', count: 7, color: 'bg-amber-500', desc: 'Risk, Growth Mindset' },
                { name: 'Values/Wellbeing', count: 6, color: 'bg-emerald-500', desc: 'Values, Interests, Coping' },
                { name: 'Cognitive/Learning', count: 6, color: 'bg-purple-500', desc: 'VARK, Metacognition' },
                { name: 'Social/Cultural', count: 5, color: 'bg-indigo-500', desc: 'Moral, Political, Cultural' },
                { name: 'Sensory/Aesthetic', count: 2, color: 'bg-cyan-500', desc: 'HSP, Preferences' },
              ].map((category, i) => (
                <div key={i} className="p-4 rounded-xl border border-border/50 bg-card/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className={cn('w-3 h-3 rounded-full', category.color)} />
                    <span className="text-xs font-medium text-muted-foreground">
                      {category.count} domains
                    </span>
                  </div>
                  <h4 className="font-semibold text-foreground text-sm mb-1">{category.name}</h4>
                  <p className="text-xs text-muted-foreground">{category.desc}</p>
                </div>
              ))}
            </div>
          </motion.section>

          {/* ZPD Zones */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-2xl font-bold text-foreground mb-8 flex items-center gap-3">
              <Target className="w-6 h-6 text-emerald-500" />
              Zone of Proximal Development
            </h2>
            <div className="p-8 rounded-2xl border border-border/50 bg-card/30">
              <div className="space-y-4">
                {[
                  {
                    zone: 'Mastered',
                    desc: 'Can do independently',
                    readiness: '> 0.8',
                    color: 'bg-emerald-500',
                  },
                  {
                    zone: 'Zone of Proximal Development',
                    desc: 'Can learn with support — OPTIMAL TARGET',
                    readiness: '0.5 - 0.8',
                    color: 'bg-blue-500',
                    highlight: true,
                  },
                  {
                    zone: 'Stretch Zone',
                    desc: 'Challenging but achievable',
                    readiness: '0.3 - 0.5',
                    color: 'bg-amber-500',
                  },
                  {
                    zone: 'Too Hard',
                    desc: 'Missing prerequisites',
                    readiness: '< 0.3',
                    color: 'bg-red-500',
                  },
                ].map((zone, i) => (
                  <div
                    key={i}
                    className={cn(
                      'p-4 rounded-xl border transition-all',
                      zone.highlight
                        ? 'border-blue-500/50 bg-blue-500/10'
                        : 'border-border/50 bg-card/50'
                    )}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className={cn('w-3 h-3 rounded-full', zone.color)} />
                        <span className="font-semibold text-foreground">{zone.zone}</span>
                        {zone.highlight && (
                          <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-blue-500 text-white">
                            TARGET
                          </span>
                        )}
                      </div>
                      <span className="text-sm font-mono text-muted-foreground">
                        Readiness: {zone.readiness}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground ml-6">{zone.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* Gap Detection */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-2xl font-bold text-foreground mb-8 flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-amber-500" />
              Knowledge Gap Detection
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  type: 'Missing',
                  desc: 'Never learned this concept',
                  action: 'Full teaching',
                  color: 'red',
                },
                {
                  type: 'Partial',
                  desc: 'Started but not mastered (< 70%)',
                  action: 'Reinforcement',
                  color: 'amber',
                },
                {
                  type: 'Forgotten',
                  desc: 'Was mastered but memory has decayed',
                  action: 'Quick refresh',
                  color: 'blue',
                },
                {
                  type: 'Misconception',
                  desc: 'Wrong mental model needs correction',
                  action: 'Targeted correction',
                  color: 'purple',
                },
              ].map((gap, i) => (
                <div key={i} className="p-5 rounded-xl border border-border/50 bg-card/50">
                  <div
                    className={cn(
                      'w-10 h-10 rounded-lg flex items-center justify-center mb-4',
                      gap.color === 'red' && 'bg-red-500/10',
                      gap.color === 'amber' && 'bg-amber-500/10',
                      gap.color === 'blue' && 'bg-blue-500/10',
                      gap.color === 'purple' && 'bg-purple-500/10'
                    )}
                  >
                    <AlertTriangle
                      className={cn(
                        'w-5 h-5',
                        gap.color === 'red' && 'text-red-500',
                        gap.color === 'amber' && 'text-amber-500',
                        gap.color === 'blue' && 'text-blue-500',
                        gap.color === 'purple' && 'text-purple-500'
                      )}
                    />
                  </div>
                  <h4 className="font-semibold text-foreground mb-2">{gap.type}</h4>
                  <p className="text-sm text-muted-foreground mb-3">{gap.desc}</p>
                  <div className="flex items-center gap-2 text-xs">
                    <ArrowRight className="w-3 h-3 text-primary" />
                    <span className="text-primary font-medium">{gap.action}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Performance Metrics */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-2xl font-bold text-foreground mb-8 flex items-center gap-3">
              <TrendingUp className="w-6 h-6 text-emerald-500" />
              Technical Performance
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { metric: 'Database Write', target: '< 5ms', achieved: '0.10ms', improvement: '50x' },
                { metric: 'Database Read', target: '< 2ms', achieved: '0.02ms', improvement: '100x' },
                { metric: 'ZPD Computation', target: '< 200ms', achieved: '< 100ms', improvement: '2x' },
              ].map((item, i) => (
                <div key={i} className="p-5 rounded-xl border border-emerald-500/30 bg-emerald-500/5">
                  <p className="text-sm text-muted-foreground mb-1">{item.metric}</p>
                  <p className="text-2xl font-bold text-foreground mb-2">{item.achieved}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Target: {item.target}</span>
                    <span className="text-xs font-medium text-emerald-500">{item.improvement} faster</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Magic Moments */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-2xl font-bold text-foreground mb-8 flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-amber-500" />
              Magic Moments
            </h2>
            <div className="space-y-4">
              {[
                {
                  moment: 'The "How did it know?" moment',
                  desc: 'When the first recommendation addresses a struggle they never explicitly mentioned',
                },
                {
                  moment: 'The "Finally, someone understands" moment',
                  desc: "When explanations match their learning style perfectly",
                },
                {
                  moment: 'The "That\'s exactly what I needed" moment',
                  desc: 'When scaffolding strategies feel intuitive, not prescribed',
                },
                {
                  moment: 'The "I\'m actually learning" moment',
                  desc: 'When spaced repetition surfaces forgotten concepts at the perfect time',
                },
                {
                  moment: 'The "I feel seen" moment',
                  desc: "When the system's assessment of their strengths/challenges matches their self-perception",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 p-4 rounded-xl border border-border/50 bg-card/50 hover:bg-card/80 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-bold">{i + 1}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">{item.moment}</h4>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Privacy & Trust */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-2xl font-bold text-foreground mb-8 flex items-center gap-3">
              <Shield className="w-6 h-6 text-blue-500" />
              Privacy & Trust
            </h2>
            <div className="p-6 rounded-2xl border border-blue-500/30 bg-blue-500/5">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { title: 'Data Minimization', desc: 'Only collect what directly improves recommendations' },
                  { title: 'User Control', desc: 'See, edit, and delete your psychometric profile anytime' },
                  { title: 'Privacy-First Mode', desc: 'System works with minimal data if preferred' },
                  { title: 'Transparency', desc: 'Every recommendation includes a "Why this?" explanation' },
                  { title: 'No Judgment', desc: "System adapts to you; it doesn't label you" },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-foreground text-sm">{item.title}</h4>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* Implementation Status */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-2xl font-bold text-foreground mb-8 flex items-center gap-3">
              <Database className="w-6 h-6 text-purple-500" />
              Implementation Status
            </h2>
            <div className="space-y-3">
              {[
                { phase: 'Phase 1: Core Database', status: 'done', desc: 'LevelDB setup, CRUD operations' },
                { phase: 'Phase 2: Learner Model', status: 'done', desc: '39 psychometric domains, profile management' },
                { phase: 'Phase 3: Knowledge Model', status: 'done', desc: "Concept graph, prerequisites, Bloom's taxonomy" },
                { phase: 'Phase 4: ZPD Engine', status: 'done', desc: 'Zone computation, scaffolding selection' },
                { phase: 'Phase 5: Gap Analysis', status: 'done', desc: 'Gap detection, forgetting curve, spaced repetition' },
                { phase: 'Phase 6: Content Delivery + AI Curriculum + Assessments', status: 'planned', desc: 'Adaptive content, AI graph generation, auto-assessments' },
                { phase: 'Phase 7: RAG Integration', status: 'planned', desc: 'LLM context generation' },
                { phase: 'Phase 8: GNN Preparation', status: 'future', desc: 'Neural network training export' },
              ].map((item, i) => (
                <div
                  key={i}
                  className={cn(
                    'flex items-center gap-4 p-4 rounded-xl border',
                    item.status === 'done'
                      ? 'border-emerald-500/30 bg-emerald-500/5'
                      : item.status === 'planned'
                      ? 'border-blue-500/30 bg-blue-500/5'
                      : 'border-border/50 bg-card/30'
                  )}
                >
                  <div
                    className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
                      item.status === 'done' && 'bg-emerald-500 text-white',
                      item.status === 'planned' && 'bg-blue-500/20 text-blue-500',
                      item.status === 'future' && 'bg-muted text-muted-foreground'
                    )}
                  >
                    {item.status === 'done' ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <span className="text-sm font-bold">{i + 1}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground">{item.phase}</h4>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                  <span
                    className={cn(
                      'px-3 py-1 rounded-full text-xs font-medium',
                      item.status === 'done' && 'bg-emerald-500/20 text-emerald-500',
                      item.status === 'planned' && 'bg-blue-500/20 text-blue-500',
                      item.status === 'future' && 'bg-muted text-muted-foreground'
                    )}
                  >
                    {item.status === 'done' ? 'DONE' : item.status === 'planned' ? 'PLANNED' : 'FUTURE'}
                  </span>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Educational Psychology References */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-2xl font-bold text-foreground mb-8 flex items-center gap-3">
              <GraduationCap className="w-6 h-6 text-indigo-500" />
              Educational Psychology Foundation
            </h2>
            <div className="grid md:grid-cols-2 gap-3">
              {[
                { theory: 'Zone of Proximal Development', ref: 'Vygotsky (1978)', use: 'Optimal challenge selection' },
                { theory: "Bloom's Taxonomy", ref: 'Bloom (1956)', use: 'Cognitive level tracking' },
                { theory: 'Forgetting Curve', ref: 'Ebbinghaus (1885)', use: 'Memory decay prediction' },
                { theory: 'Scaffolding Theory', ref: 'Bruner (1966)', use: 'Support strategy selection' },
                { theory: 'Big Five Personality', ref: 'Costa & McCrae (1992)', use: 'Core trait modeling' },
                { theory: 'Growth Mindset', ref: 'Dweck (2006)', use: 'Belief system adaptation' },
                { theory: 'Multimedia Learning', ref: 'Mayer (2009)', use: 'Presentation optimization' },
                { theory: 'Spaced Repetition (SM-2)', ref: 'Wozniak (1987)', use: 'Review scheduling' },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-card/30"
                >
                  <div>
                    <span className="font-medium text-foreground text-sm">{item.theory}</span>
                    <span className="text-muted-foreground text-sm"> — {item.use}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{item.ref}</span>
                </div>
              ))}
            </div>
          </motion.section>

          {/* The Bottom Line */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <div className="p-8 rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/5 to-purple-500/5">
              <h2 className="text-2xl font-bold text-foreground mb-6 text-center">The Bottom Line</h2>
              <p className="text-lg text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
                <strong className="text-foreground">LearnGraph transforms education from one-size-fits-all to truly personalized.</strong>
                {' '}Every learner is different. LearnGraph makes that difference visible, measurable, and actionable.
              </p>

              <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                  <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                    Before LearnGraph
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Random guess based on course order
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    After LearnGraph
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Optimal concept based on YOUR mastery, prerequisites, anxiety level, learning style, forgetting curve, and cognitive profile
                  </p>
                </div>
              </div>

              <p className="text-center text-lg font-semibold text-primary mt-8">
                That's the difference.
              </p>
            </div>
          </motion.section>

          {/* Footer */}
          <motion.footer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center pt-8 border-t border-border/50"
          >
            <p className="text-muted-foreground text-sm mb-2">
              LearnGraph — Making AI tutoring truly personal.
            </p>
            <p className="text-xs text-muted-foreground/70">
              Created by <span className="font-medium text-foreground/60">Dr. Lee</span>
            </p>
          </motion.footer>
        </div>
      </main>
    </div>
  );
}
