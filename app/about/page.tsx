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
  Code,
  Eye,
  Ear,
  Hand,
  BookMarked,
  Layers,
  Search,
  Calendar,
  Award,
  MessageSquare,
  PenTool,
  Puzzle,
  Scale,
  Compass,
  Lock,
  Info,
  ChevronRight,
  CheckCircle,
  XCircle,
  HelpCircle,
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

// Code block component for displaying code/ascii art
function CodeBlock({ children, title }: { children: string; title?: string }) {
  return (
    <div className="my-4 rounded-lg border border-border/50 overflow-hidden">
      {title && (
        <div className="bg-muted/50 px-4 py-2 border-b border-border/50 text-sm font-medium">
          {title}
        </div>
      )}
      <pre className="bg-muted/30 p-4 overflow-x-auto text-xs sm:text-sm font-mono whitespace-pre">
        {children}
      </pre>
    </div>
  );
}

// Section component
function Section({ id, title, icon: Icon, children }: { id: string; title: string; icon?: React.ElementType; children: React.ReactNode }) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mb-12 scroll-mt-20"
    >
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-foreground">
        {Icon && <Icon className="w-6 h-6 text-primary" />}
        {title}
      </h2>
      {children}
    </motion.section>
  );
}

// Table component
function Table({ headers, rows }: { headers: string[]; rows: (string | React.ReactNode)[][] }) {
  return (
    <div className="overflow-x-auto my-4">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-muted/50">
            {headers.map((header, i) => (
              <th key={i} className="border border-border/50 px-4 py-2 text-left font-semibold">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="hover:bg-muted/30">
              {row.map((cell, j) => (
                <td key={j} className="border border-border/50 px-4 py-2">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Table of Contents
function TableOfContents() {
  const sections = [
    { id: 'what-is', label: 'What Is LearnGraph?' },
    { id: 'quick-test', label: 'Quick Test (2 Minutes)' },
    { id: 'architecture', label: 'Dual-Graph Architecture' },
    { id: 'pipeline', label: 'Learning Pipeline' },
    { id: 'zpd-step-by-step', label: 'ZPD Step-by-Step' },
    { id: 'domains', label: '39 Psychological Domains' },
    { id: 'gaps', label: 'Gap Detection' },
    { id: 'forgetting', label: 'Forgetting Curve' },
    { id: 'spaced-repetition', label: 'Spaced Repetition' },
    { id: 'blooms', label: "Bloom's Taxonomy" },
    { id: 'scaffolding', label: 'Scaffolding Strategies' },
    { id: 'data-architecture', label: 'Data Architecture' },
    { id: 'rag-context', label: 'RAG Context' },
    { id: 'comparison', label: 'Traditional vs LearnGraph' },
    { id: 'who-benefits', label: 'Who Benefits?' },
    { id: 'quick-start', label: 'Quick Start Code' },
    { id: 'requirements', label: 'System Requirements' },
    { id: 'status', label: 'Implementation Status' },
    { id: 'psychometric-data', label: 'Getting Psychometric Data' },
    { id: 'teacher-workflow', label: 'Teacher Workflow' },
    { id: 'assessments', label: 'AI Assessments' },
    { id: 'future', label: 'Future Vision' },
    { id: 'validation', label: 'Validation Tests' },
    { id: 'metrics', label: 'Success Metrics' },
    { id: 'magic-moments', label: 'Magic Moments' },
    { id: 'privacy', label: 'Privacy & Trust' },
    { id: 'api-reference', label: 'API Reference' },
    { id: 'edu-psychology', label: 'Educational Psychology' },
    { id: 'expert-perspectives', label: 'Expert Perspectives' },
    { id: 'bottom-line', label: 'The Bottom Line' },
  ];

  return (
    <div className="mb-12 p-6 rounded-xl border border-border/50 bg-card/50">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <BookMarked className="w-5 h-5 text-primary" />
        Table of Contents
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {sections.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
          >
            <ChevronRight className="w-3 h-3" />
            {section.label}
          </a>
        ))}
      </div>
    </div>
  );
}

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
            className="mb-12 text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Psychometric-Adaptive Learning Intelligence
            </div>
            <h1 className="text-5xl font-bold tracking-tight text-foreground mb-6">
              <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                LearnGraph
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              A <strong>Local Browser-Based GraphRAG</strong> that makes any LLM smarter about each specific user.
              LearnGraph combines psychometric profiling with educational psychology to deliver truly personalized learning experiences.
            </p>
          </motion.section>

          {/* Table of Contents */}
          <TableOfContents />

          {/* What Is LearnGraph */}
          <Section id="what-is" title="What Is LearnGraph?" icon={HelpCircle}>
            <p className="text-muted-foreground mb-4">
              LearnGraph is a <strong>Graph RAG (Retrieval-Augmented Generation) system</strong> that transforms generic AI tutoring into deeply personalized education. Instead of giving everyone the same explanation, LearnGraph provides AI tutors with comprehensive context about each learner.
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="p-6 rounded-xl border border-red-500/20 bg-red-500/5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-red-500/10">
                    <XCircle className="w-5 h-5 text-red-500" />
                  </div>
                  <h3 className="font-semibold">WITHOUT LearnGraph</h3>
                </div>
                <CodeBlock>{`User: "Explain linear equations"
LLM: [Generic explanation, same for everyone]`}</CodeBlock>
              </div>

              <div className="p-6 rounded-xl border border-green-500/20 bg-green-500/5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-green-500/10">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  </div>
                  <h3 className="font-semibold">WITH LearnGraph</h3>
                </div>
                <CodeBlock>{`User: "Explain linear equations"
System retrieves: visual learner, struggles with
"moving terms", high anxiety, mastered arithmetic,
partial algebra knowledge

LLM: [Personalized explanation with diagrams,
addresses their specific confusion, gentle
encouraging tone, builds on what they already know]`}</CodeBlock>
              </div>
            </div>

            <h3 className="text-lg font-semibold mb-4">Key Value Propositions</h3>
            <Table
              headers={['Feature', 'Description']}
              rows={[
                [<strong key="1">"What should I learn next?"</strong>, 'Compares your mastery against prerequisites to find optimal concepts'],
                [<strong key="2">Personalized explanations</strong>, 'Gives LLMs your learning style, misconceptions, and preferences'],
                [<strong key="3">Gap detection</strong>, 'Finds missing, forgotten, or misunderstood knowledge'],
                [<strong key="4">Spaced repetition</strong>, 'Schedules reviews based on your personal forgetting curve'],
                [<strong key="5">Smart scaffolding</strong>, 'Selects teaching strategies based on your psychometric profile'],
                [<strong key="6">Learning paths</strong>, 'Generates custom roadmaps to any learning goal'],
              ]}
            />

            <h3 className="text-lg font-semibold mb-4 mt-6">Main Features: The Core Value</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { icon: Target, title: 'Personalized Learning Paths', desc: 'Every student gets a unique path based on what they know and how they learn' },
                { icon: Brain, title: 'Psychometric Profiling', desc: 'Track 39 psychological domains to understand how each learner thinks' },
                { icon: GitBranch, title: 'Prerequisite Intelligence', desc: "Never learn something you're not ready for; always know what comes next" },
                { icon: Search, title: 'Gap Detection', desc: 'Automatically find missing knowledge, forgotten concepts, and misconceptions' },
                { icon: Clock, title: 'Spaced Repetition', desc: 'Science-backed review scheduling using the Ebbinghaus forgetting curve' },
                { icon: Lightbulb, title: 'ZPD Engine', desc: "Vygotsky's Zone of Proximal Development to find concepts that are challenging but achievable" },
                { icon: Bot, title: 'AI Curriculum Ingestion', desc: 'Teachers describe a course in plain English, AI generates the knowledge graph', badge: 'NEW' },
                { icon: ClipboardList, title: 'AI Assessment Generation', desc: 'Auto-generate quizzes and tests for each concept (toggle on/off)', badge: 'NEW' },
                { icon: MessageSquare, title: 'RAG Context for LLMs', desc: 'Give any AI tutor rich context about the learner for personalized responses' },
              ].map((feature, i) => (
                <div key={i} className="p-4 rounded-lg border border-border/50 bg-card/50 hover:bg-card transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                    <feature.icon className="w-5 h-5 text-primary" />
                    <h4 className="font-medium text-sm">{feature.title}</h4>
                    {feature.badge && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-500/20 text-green-500 font-medium">
                        {feature.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{feature.desc}</p>
                </div>
              ))}
            </div>
          </Section>

          {/* Quick Test */}
          <Section id="quick-test" title="Quick Test: See the Value in 2 Minutes" icon={Play}>
            <p className="text-muted-foreground mb-4">
              Want to quickly see what LearnGraph does? Run these commands after starting the app:
            </p>

            <div className="space-y-4">
              <div className="p-4 rounded-lg border border-border/50 bg-card/50">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-sm flex items-center justify-center">1</span>
                  Create a Learner
                </h4>
                <CodeBlock>{`curl -X POST http://localhost:3000/api/learners \\
  -H "Content-Type: application/json" \\
  -d '{"name": "Test User", "email": "test@example.com"}'`}</CodeBlock>
                <p className="text-xs text-muted-foreground">Save the <code className="bg-muted px-1 rounded">userId</code> from the response.</p>
              </div>

              <div className="p-4 rounded-lg border border-border/50 bg-card/50">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-sm flex items-center justify-center">2</span>
                  Add Sample Curriculum
                </h4>
                <CodeBlock>{`curl -X POST http://localhost:3000/api/seed-concepts`}</CodeBlock>
                <p className="text-xs text-muted-foreground">This creates a sample knowledge graph with concepts and prerequisites.</p>
              </div>

              <div className="p-4 rounded-lg border border-border/50 bg-card/50">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-sm flex items-center justify-center">3</span>
                  Track Some Knowledge
                </h4>
                <CodeBlock>{`curl -X POST http://localhost:3000/api/knowledge-state \\
  -H "Content-Type: application/json" \\
  -d '{"userId": "YOUR_USER_ID", "conceptId": "arithmetic", "mastery": 85}'`}</CodeBlock>
              </div>

              <div className="p-4 rounded-lg border border-border/50 bg-card/50">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-sm flex items-center justify-center">4</span>
                  Ask "What Should I Learn Next?"
                </h4>
                <CodeBlock>{`curl "http://localhost:3000/api/zpd?userId=YOUR_USER_ID"`}</CodeBlock>
                <p className="text-xs text-green-500">Expected: Concepts in your Zone of Proximal Development — things you're ready to learn.</p>
              </div>

              <div className="p-4 rounded-lg border border-border/50 bg-card/50">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-sm flex items-center justify-center">5</span>
                  Check for Knowledge Gaps
                </h4>
                <CodeBlock>{`curl "http://localhost:3000/api/gaps?userId=YOUR_USER_ID"`}</CodeBlock>
                <p className="text-xs text-green-500">Expected: Missing prerequisites, forgotten concepts, and misconceptions.</p>
              </div>

              <div className="p-4 rounded-lg border border-border/50 bg-card/50">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-sm flex items-center justify-center">6</span>
                  View in the UI
                </h4>
                <p className="text-sm text-muted-foreground">
                  Open <code className="bg-muted px-1 rounded">http://localhost:3000/graph</code> to see the knowledge graph visualized, with your mastery levels overlaid.
                </p>
              </div>
            </div>
          </Section>

          {/* Dual-Graph Architecture */}
          <Section id="architecture" title="The Dual-Graph Architecture" icon={Layers}>
            <p className="text-muted-foreground mb-4">
              LearnGraph uses a single database with two interconnected graphs:
            </p>
            <CodeBlock title="System Architecture">{`┌─────────────────────────────────────────────────────────────────────────┐
│                           LevelDB Instance                               │
│                                                                          │
│  ┌─────────────────────────────┐    ┌─────────────────────────────────┐ │
│  │     LEARNER MODEL          │    │      KNOWLEDGE MODEL            │ │
│  │     (Graph A)              │    │      (Graph B)                  │ │
│  │                            │    │                                 │ │
│  │  • User Profiles           │    │  • Concept Nodes                │ │
│  │  • 39 Psychometric Scores  │◄──►│  • Prerequisite Edges           │ │
│  │  • Knowledge State         │    │  • Bloom's Taxonomy Tags        │ │
│  │  • Learning History        │    │  • Difficulty Ratings           │ │
│  │  • Misconceptions          │    │  • Learning Objectives          │ │
│  │  • Preferences             │    │  • Scaffolding Strategies       │ │
│  │                            │    │                                 │ │
│  └─────────────────────────────┘    └─────────────────────────────────┘ │
│                           │                    │                        │
│                           └────────┬───────────┘                        │
│                                    │                                    │
│                          ┌─────────▼─────────┐                          │
│                          │   ZPD BRIDGE      │                          │
│                          │   (Computed)      │                          │
│                          │                   │                          │
│                          │ Zone of Proximal  │                          │
│                          │ Development Engine│                          │
│                          └───────────────────┘                          │
└─────────────────────────────────────────────────────────────────────────┘`}</CodeBlock>
          </Section>

          {/* Learning Pipeline */}
          <Section id="pipeline" title="How It Works: The Learning Pipeline" icon={Zap}>
            <p className="text-muted-foreground mb-4">
              When you interact with LearnGraph, multiple systems work together automatically:
            </p>
            <CodeBlock title="Context Retrieval Pipeline">{`┌───────────────────────────────────────────────────────────────────────────┐
│                          USER INTERACTION                                  │
│                                                                           │
│   "What should I learn next?"   "Explain this concept"   "I'm stuck"     │
│                    │                    │                     │           │
└────────────────────┼────────────────────┼─────────────────────┼───────────┘
                     │                    │                     │
                     ▼                    ▼                     ▼
┌───────────────────────────────────────────────────────────────────────────┐
│                       CONTEXT RETRIEVAL                                    │
│                                                                           │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────────┐   │
│  │ Learner Profile │  │ Knowledge State │  │   ZPD Computation       │   │
│  │                 │  │                 │  │                         │   │
│  │ • Big Five      │  │ • Mastery %     │  │ • Ready concepts        │   │
│  │ • Learning      │  │ • Bloom Level   │  │ • Gap analysis          │   │
│  │   Style         │  │ • Last Access   │  │ • Prerequisites met     │   │
│  │ • Cognitive     │  │ • Decay Rate    │  │ • Scaffolding needed    │   │
│  │   Profile       │  │ • Misconceptions│  │                         │   │
│  └────────┬────────┘  └────────┬────────┘  └───────────┬─────────────┘   │
│           │                    │                       │                  │
│           └────────────────────┼───────────────────────┘                  │
│                                │                                          │
│                                ▼                                          │
│                    ┌───────────────────────┐                              │
│                    │   RAG CONTEXT         │                              │
│                    │   AGGREGATOR          │                              │
│                    │                       │                              │
│                    │   Combines learner    │                              │
│                    │   data + knowledge    │                              │
│                    │   graph + ZPD into    │                              │
│                    │   < 2000 tokens       │                              │
│                    └───────────┬───────────┘                              │
│                                │                                          │
└────────────────────────────────┼──────────────────────────────────────────┘
                                 │
                                 ▼
┌───────────────────────────────────────────────────────────────────────────┐
│                       LLM AUGMENTED RESPONSE                               │
│                                                                           │
│   The AI tutor now knows:                                                 │
│   • Your learning style (visual/auditory/kinesthetic)                     │
│   • Your current mastery of relevant concepts                             │
│   • Your specific misconceptions to address                               │
│   • What scaffolding strategies work for you                              │
│   • What you should learn next                                            │
│                                                                           │
│   → Delivers personalized, context-aware response                         │
│                                                                           │
└───────────────────────────────────────────────────────────────────────────┘`}</CodeBlock>
          </Section>

          {/* ZPD Step by Step */}
          <Section id="zpd-step-by-step" title="What Happens When You Ask 'What Should I Learn Next?'" icon={Target}>
            <div className="space-y-6">
              <div className="p-4 rounded-lg border border-border/50 bg-card/50">
                <h4 className="font-semibold mb-2">1. Profile Retrieval</h4>
                <p className="text-sm text-muted-foreground">System loads your 39 psychometric domain scores and learning preferences</p>
              </div>

              <div className="p-4 rounded-lg border border-border/50 bg-card/50">
                <h4 className="font-semibold mb-2">2. Knowledge State Scan</h4>
                <p className="text-sm text-muted-foreground">Checks mastery level for all concepts you've studied</p>
              </div>

              <div className="p-4 rounded-lg border border-border/50 bg-card/50">
                <h4 className="font-semibold mb-2">3. Prerequisite Analysis</h4>
                <p className="text-sm text-muted-foreground">For each concept you haven't mastered:</p>
                <ul className="text-sm text-muted-foreground list-disc list-inside mt-2">
                  <li>Counts how many prerequisites you've completed</li>
                  <li>Calculates "readiness score" (0-1)</li>
                </ul>
              </div>

              <div className="p-4 rounded-lg border border-border/50 bg-card/50">
                <h4 className="font-semibold mb-2">4. Psychometric Adjustment</h4>
                <p className="text-sm text-muted-foreground mb-2">Modifies readiness based on your profile:</p>
                <Table
                  headers={['Your Profile', 'Effect on Recommendations']}
                  rows={[
                    ['High anxiety', 'Lower readiness for difficult concepts'],
                    ['High openness', 'Higher readiness for abstract concepts'],
                    ['High conscientiousness', 'Ready for longer learning paths'],
                    ['Low risk tolerance', 'Prefer well-structured concepts'],
                  ]}
                />
              </div>

              <div className="p-4 rounded-lg border border-border/50 bg-card/50">
                <h4 className="font-semibold mb-2">5. Zone Partitioning</h4>
                <p className="text-sm text-muted-foreground mb-2">Concepts are sorted into zones:</p>
                <CodeBlock>{`┌─────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│    ┌───────────────────────────────────────────────────────────────┐    │
│    │                                                               │    │
│    │    ┌─────────────────────────────────────────────────────┐   │    │
│    │    │                                                     │   │    │
│    │    │    ┌───────────────────────────────────────────┐   │   │    │
│    │    │    │                                           │   │   │    │
│    │    │    │     MASTERED CONCEPTS                     │   │   │    │
│    │    │    │     (Can do independently)                │   │   │    │
│    │    │    │     Readiness > 0.8                       │   │   │    │
│    │    │    │                                           │   │   │    │
│    │    │    └───────────────────────────────────────────┘   │   │    │
│    │    │                                                     │   │    │
│    │    │         ZONE OF PROXIMAL DEVELOPMENT               │   │    │
│    │    │         (Can learn with support)                   │   │    │
│    │    │         Readiness 0.5 - 0.8  ← OPTIMAL TARGET      │   │    │
│    │    │                                                     │   │    │
│    │    └─────────────────────────────────────────────────────┘   │    │
│    │                                                               │    │
│    │              STRETCH ZONE                                     │    │
│    │              (Challenging but achievable)                     │    │
│    │              Readiness 0.3 - 0.5                              │    │
│    │                                                               │    │
│    └───────────────────────────────────────────────────────────────┘    │
│                                                                          │
│                    TOO HARD (Missing prerequisites)                      │
│                    Readiness < 0.3                                       │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘`}</CodeBlock>
              </div>

              <div className="p-4 rounded-lg border border-border/50 bg-card/50">
                <h4 className="font-semibold mb-2">6. Scaffolding Selection</h4>
                <p className="text-sm text-muted-foreground mb-2">Based on your profile, selects support strategies:</p>
                <Table
                  headers={['If You Are...', 'Scaffolding Strategy']}
                  rows={[
                    ['Visual learner', 'VISUAL_REPRESENTATION - diagrams, charts'],
                    ['High cognitive complexity', 'ANALOGY - connect to known concepts'],
                    ['Low working memory', 'CHUNKING - break into smaller pieces'],
                    ['High extraversion', 'PEER_DISCUSSION, COLLABORATIVE'],
                    ['High conscientiousness', 'CHECKLIST, TEMPLATE'],
                    ['Low self-esteem', 'WORKED_EXAMPLES, HINTS'],
                  ]}
                />
              </div>

              <div className="p-4 rounded-lg border border-border/50 bg-card/50">
                <h4 className="font-semibold mb-2">7. Path Generation</h4>
                <p className="text-sm text-muted-foreground">Creates personalized learning path to your goals</p>
              </div>
            </div>
          </Section>

          {/* 39 Psychological Domains */}
          <Section id="domains" title="The 39 Psychological Domains" icon={Brain}>
            <p className="text-muted-foreground mb-6">
              LearnGraph tracks 39 research-backed psychological dimensions organized into 8 categories:
            </p>

            {/* Category A */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 text-indigo-500">Category A: Core Personality (Big Five) - NEO-PI-R Based</h3>
              <Table
                headers={['Domain ID', 'Trait', 'Educational Relevance']}
                rows={[
                  [<code key="1">big_five_openness</code>, 'Openness', 'Receptivity to novel concepts, abstract thinking'],
                  [<code key="2">big_five_conscientiousness</code>, 'Conscientiousness', 'Self-discipline, goal persistence'],
                  [<code key="3">big_five_extraversion</code>, 'Extraversion', 'Preference for collaborative vs. solo learning'],
                  [<code key="4">big_five_agreeableness</code>, 'Agreeableness', 'Response to feedback, peer learning'],
                  [<code key="5">big_five_neuroticism</code>, 'Neuroticism', 'Stress response, anxiety management needs'],
                ]}
              />
            </div>

            {/* Category B */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 text-purple-500">Category B: Dark Personality - SD3 Based</h3>
              <Table
                headers={['Domain ID', 'Trait', 'Educational Relevance']}
                rows={[
                  [<code key="1">dark_triad_narcissism</code>, 'Narcissism', 'Competitive learning, recognition needs'],
                  [<code key="2">dark_triad_machiavellianism</code>, 'Machiavellianism', 'Strategic approach to goals'],
                  [<code key="3">dark_triad_psychopathy</code>, 'Psychopathy', 'Risk-taking in learning challenges'],
                ]}
              />
            </div>

            {/* Category C */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 text-pink-500">Category C: Emotional/Social Intelligence</h3>
              <Table
                headers={['Domain ID', 'Trait', 'Educational Relevance']}
                rows={[
                  [<code key="1">emotional_empathy</code>, 'Empathy', 'Peer learning, perspective-taking'],
                  [<code key="2">emotional_intelligence</code>, 'EQ', 'Self-regulation, emotional awareness'],
                  [<code key="3">attachment_style</code>, 'Attachment', 'Trust in learning relationships'],
                  [<code key="4">love_languages</code>, 'Love Languages', 'Preferred feedback/recognition style'],
                  [<code key="5">communication_style</code>, 'Communication (DISC)', 'Interaction pattern preferences'],
                ]}
              />
            </div>

            {/* Category D */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 text-orange-500">Category D: Decision Making & Motivation</h3>
              <Table
                headers={['Domain ID', 'Trait', 'Educational Relevance']}
                rows={[
                  [<code key="1">risk_tolerance</code>, 'Risk Tolerance', 'Willingness to try new approaches'],
                  [<code key="2">decision_style</code>, 'Decision Style', 'Rational vs. intuitive learning'],
                  [<code key="3">time_orientation</code>, 'Time Orientation', 'Past, present, or future focus'],
                  [<code key="4">achievement_motivation</code>, 'Achievement', 'Need for accomplishment, goal-setting'],
                  [<code key="5">self_efficacy</code>, 'Self-Efficacy', 'Belief in own capabilities'],
                  [<code key="6">locus_of_control</code>, 'Locus of Control', 'Internal vs. external attribution'],
                  [<code key="7">growth_mindset</code>, 'Growth Mindset', 'Fixed vs. growth beliefs about ability'],
                ]}
              />
            </div>

            {/* Category E */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 text-green-500">Category E: Values & Wellbeing</h3>
              <Table
                headers={['Domain ID', 'Trait', 'Educational Relevance']}
                rows={[
                  [<code key="1">personal_values</code>, 'Values (Schwartz PVQ)', 'What content resonates'],
                  [<code key="2">interests</code>, 'Interests (RIASEC)', 'Career/interest alignment'],
                  [<code key="3">life_satisfaction</code>, 'Life Satisfaction', 'Overall engagement capacity'],
                  [<code key="4">stress_coping</code>, 'Stress Coping', 'Response to learning challenges'],
                  [<code key="5">social_support</code>, 'Social Support', 'Support network awareness'],
                  [<code key="6">authenticity</code>, 'Authenticity', 'Alignment with true self'],
                ]}
              />
            </div>

            {/* Category F */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 text-blue-500">Category F: Cognitive/Learning Styles</h3>
              <Table
                headers={['Domain ID', 'Trait', 'Educational Relevance']}
                rows={[
                  [<code key="1">cognitive_abilities</code>, 'Cognitive Style', 'Verbal, numerical, spatial preferences'],
                  [<code key="2">creativity</code>, 'Creativity', 'Divergent thinking, originality'],
                  [<code key="3">learning_styles</code>, 'Learning Styles (VARK)', 'Visual, auditory, reading, kinesthetic'],
                  [<code key="4">information_processing</code>, 'Info Processing', 'Deep vs. shallow processing'],
                  [<code key="5">metacognition</code>, 'Metacognition', 'Awareness of own thinking'],
                  [<code key="6">executive_functions</code>, 'Executive Functions', 'Planning, inhibition, flexibility'],
                ]}
              />
            </div>

            {/* Category G */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 text-teal-500">Category G: Social/Cultural Values</h3>
              <Table
                headers={['Domain ID', 'Trait', 'Educational Relevance']}
                rows={[
                  [<code key="1">social_cognition</code>, 'Social Cognition', 'Theory of mind, perspective-taking'],
                  [<code key="2">political_ideology</code>, 'Political Values', 'Worldview influence on learning'],
                  [<code key="3">cultural_values</code>, 'Cultural Values (Hofstede)', 'Individualism, power distance'],
                  [<code key="4">moral_reasoning</code>, 'Moral Reasoning (MFQ)', 'Ethical framework preferences'],
                  [<code key="5">work_career_style</code>, 'Career Style', 'Work values, career anchors'],
                ]}
              />
            </div>

            {/* Category H */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 text-amber-500">Category H: Sensory/Aesthetic</h3>
              <Table
                headers={['Domain ID', 'Trait', 'Educational Relevance']}
                rows={[
                  [<code key="1">sensory_processing</code>, 'Sensory Sensitivity (HSP)', 'Stimulation tolerance'],
                  [<code key="2">aesthetic_preferences</code>, 'Aesthetic Preferences', 'Design/presentation preferences'],
                ]}
              />
            </div>
          </Section>

          {/* Gap Detection */}
          <Section id="gaps" title="Knowledge Gap Detection" icon={AlertTriangle}>
            <p className="text-muted-foreground mb-4">
              LearnGraph continuously monitors for four types of knowledge gaps:
            </p>
            <CodeBlock title="Gap Detection Engine">{`┌───────────────────────────────────────────────────────────────────────────┐
│                        GAP DETECTION ENGINE                                │
│                                                                           │
│   ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────────┐  │
│   │    MISSING      │  │    PARTIAL      │  │      FORGOTTEN          │  │
│   │                 │  │                 │  │                         │  │
│   │  Never learned  │  │  Started but    │  │  Was mastered but       │  │
│   │  this concept   │  │  not mastered   │  │  memory has decayed     │  │
│   │                 │  │  (< 70%)        │  │                         │  │
│   │  Action:        │  │  Action:        │  │  Action:                │  │
│   │  Full teaching  │  │  Reinforcement  │  │  Quick refresh          │  │
│   └─────────────────┘  └─────────────────┘  └─────────────────────────┘  │
│                                                                           │
│                        ┌─────────────────────────┐                        │
│                        │     MISCONCEPTION       │                        │
│                        │                         │                        │
│                        │  Wrong mental model     │                        │
│                        │  needs correction       │                        │
│                        │                         │                        │
│                        │  Action:                │                        │
│                        │  Targeted correction    │                        │
│                        │  with counterexamples   │                        │
│                        └─────────────────────────┘                        │
│                                                                           │
└───────────────────────────────────────────────────────────────────────────┘`}</CodeBlock>
          </Section>

          {/* Forgetting Curve */}
          <Section id="forgetting" title="Forgetting Curve (Ebbinghaus)" icon={TrendingUp}>
            <p className="text-muted-foreground mb-4">
              LearnGraph predicts memory decay using the Ebbinghaus forgetting curve:
            </p>
            <div className="p-4 rounded-lg border border-border/50 bg-card/50 mb-4">
              <code className="text-lg">Retention = e^(-t/S) × 100%</code>
              <p className="text-sm text-muted-foreground mt-2">
                Where: <strong>t</strong> = days since last access, <strong>S</strong> = stability (increases with repetitions and mastery)
              </p>
            </div>
            <CodeBlock title="Memory Decay Over Time">{`100% ┤████████████████████████████████████████████████████████████
     │███████████████
 80% ┤              ████████████
     │                         █████████
 60% ┤                                  ███████
     │                                        ██████
 40% ┤                                              █████
     │                                                   ████
 20% ┤                                                       ███
     │                                                          ██████████
  0% ┼───────┬───────┬───────┬───────┬───────┬───────┬───────┬───────┬───→
     0       1       3       7      14      21      28      45      60   Days

     ↑ Review here maintains 90% retention`}</CodeBlock>
          </Section>

          {/* Spaced Repetition */}
          <Section id="spaced-repetition" title="Spaced Repetition (SM-2 Algorithm)" icon={RefreshCw}>
            <p className="text-muted-foreground mb-4">
              Reviews are scheduled to catch concepts just before they decay below 90% retention:
            </p>
            <CodeBlock title="Spaced Repetition Schedule">{`┌────────────────────────────────────────────────────────────────────────┐
│                    SPACED REPETITION SCHEDULE                          │
│                                                                        │
│   Initial Learning                                                     │
│         │                                                              │
│         ▼                                                              │
│   ┌─────────┐                                                          │
│   │ Day 0   │  First exposure                                          │
│   └────┬────┘                                                          │
│        │                                                               │
│        ▼                                                               │
│   ┌─────────┐                                                          │
│   │ Day 1   │  First review (if remembered → next in 3 days)           │
│   └────┬────┘                                                          │
│        │                                                               │
│        ▼                                                               │
│   ┌─────────┐                                                          │
│   │ Day 4   │  Second review (if remembered → next in 7 days)          │
│   └────┬────┘                                                          │
│        │                                                               │
│        ▼                                                               │
│   ┌─────────┐                                                          │
│   │ Day 11  │  Third review (if remembered → next in 14 days)          │
│   └────┬────┘                                                          │
│        │                                                               │
│        ▼                                                               │
│   ┌─────────┐                                                          │
│   │ Day 25  │  Fourth review (if remembered → next in 30 days)         │
│   └─────────┘                                                          │
│                                                                        │
│   Interval grows exponentially with successful reviews                 │
│   Resets to shorter interval if forgotten                              │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘`}</CodeBlock>
          </Section>

          {/* Bloom's Taxonomy */}
          <Section id="blooms" title="Bloom's Taxonomy Integration" icon={Layers}>
            <p className="text-muted-foreground mb-4">
              Each concept is mapped across six cognitive levels:
            </p>
            <CodeBlock title="Bloom's Taxonomy Levels">{`┌─────────────────────────────────────────────────────────────────────────┐
│                        BLOOM'S TAXONOMY                                  │
│                                                                          │
│     Level 6: CREATE                                                      │
│     ┌─────────────────────────────────────────────────────────────────┐ │
│     │ Design, construct, develop, formulate, synthesize                │ │
│     │ Example: "Model a real-world situation with linear equations"    │ │
│     └─────────────────────────────────────────────────────────────────┘ │
│                                    ▲                                     │
│     Level 5: EVALUATE                                                    │
│     ┌─────────────────────────────────────────────────────────────────┐ │
│     │ Evaluate, critique, justify, assess, defend, judge               │ │
│     │ Example: "Choose the best method for solving this system"        │ │
│     └─────────────────────────────────────────────────────────────────┘ │
│                                    ▲                                     │
│     Level 4: ANALYZE                                                     │
│     ┌─────────────────────────────────────────────────────────────────┐ │
│     │ Analyze, differentiate, organize, deconstruct, attribute         │ │
│     │ Example: "Determine if this equation is linear"                  │ │
│     └─────────────────────────────────────────────────────────────────┘ │
│                                    ▲                                     │
│     Level 3: APPLY                                                       │
│     ┌─────────────────────────────────────────────────────────────────┐ │
│     │ Apply, demonstrate, solve, use, implement, execute               │ │
│     │ Example: "Solve 3x + 5 = 20"                                     │ │
│     └─────────────────────────────────────────────────────────────────┘ │
│                                    ▲                                     │
│     Level 2: UNDERSTAND                                                  │
│     ┌─────────────────────────────────────────────────────────────────┐ │
│     │ Explain, describe, interpret, summarize, classify, compare       │ │
│     │ Example: "Explain why the graph is a straight line"              │ │
│     └─────────────────────────────────────────────────────────────────┘ │
│                                    ▲                                     │
│     Level 1: REMEMBER                                                    │
│     ┌─────────────────────────────────────────────────────────────────┐ │
│     │ Define, list, recall, identify, name, recognize, reproduce       │ │
│     │ Example: "Define what a linear equation is"                      │ │
│     └─────────────────────────────────────────────────────────────────┘ │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘`}</CodeBlock>
            <p className="text-muted-foreground mt-4">
              LearnGraph tracks which Bloom level you've achieved for each concept:
            </p>
            <ul className="list-disc list-inside text-muted-foreground">
              <li><strong>Current Level:</strong> What you can do now</li>
              <li><strong>Target Level:</strong> What you're working toward</li>
              <li><strong>Progression:</strong> Moving up requires mastering lower levels first</li>
            </ul>
          </Section>

          {/* Scaffolding Strategies */}
          <Section id="scaffolding" title="Scaffolding Strategies" icon={Puzzle}>
            <p className="text-muted-foreground mb-6">
              Based on your psychometric profile, LearnGraph selects appropriate scaffolding:
            </p>

            <h3 className="text-lg font-semibold mb-3">Cognitive Scaffolds</h3>
            <Table
              headers={['Strategy', 'When Used', 'Implementation']}
              rows={[
                [<code key="1">CHUNKING</code>, 'Low working memory', 'Break content into smaller pieces'],
                [<code key="2">ANALOGY</code>, 'High cognitive complexity', 'Connect to familiar concepts'],
                [<code key="3">WORKED_EXAMPLES</code>, 'Low confidence, beginners', 'Step-by-step demonstrations'],
                [<code key="4">VISUAL_REPRESENTATION</code>, 'Visual learners', 'Diagrams, charts, concept maps'],
              ]}
            />

            <h3 className="text-lg font-semibold mb-3 mt-6">Metacognitive Scaffolds</h3>
            <Table
              headers={['Strategy', 'When Used', 'Implementation']}
              rows={[
                [<code key="1">SELF_EXPLANATION</code>, 'High analytical thinking', 'Prompt to explain reasoning'],
                [<code key="2">PREDICTION</code>, 'Engagement building', '"What do you think happens?"'],
                [<code key="3">REFLECTION</code>, 'Consolidation', '"What did you learn?"'],
              ]}
            />

            <h3 className="text-lg font-semibold mb-3 mt-6">Procedural Scaffolds</h3>
            <Table
              headers={['Strategy', 'When Used', 'Implementation']}
              rows={[
                [<code key="1">CHECKLIST</code>, 'High conscientiousness', 'Step-by-step guides'],
                [<code key="2">TEMPLATE</code>, 'Structure-seekers', 'Fill-in-the-blank frameworks'],
                [<code key="3">HINTS</code>, 'Progressive support', 'Reveal hints one at a time'],
              ]}
            />

            <h3 className="text-lg font-semibold mb-3 mt-6">Social Scaffolds</h3>
            <Table
              headers={['Strategy', 'When Used', 'Implementation']}
              rows={[
                [<code key="1">PEER_DISCUSSION</code>, 'High extraversion', 'Discussion prompts'],
                [<code key="2">EXPERT_MODELING</code>, 'Visual/auditory learners', 'Watch expert demonstrations'],
                [<code key="3">COLLABORATIVE</code>, 'Group-oriented learners', 'Pair/group activities'],
              ]}
            />
          </Section>

          {/* Data Architecture */}
          <Section id="data-architecture" title="Data Architecture" icon={Database}>
            <p className="text-muted-foreground mb-4">
              LearnGraph uses LevelDB with a key-prefix schema for fast, typed access:
            </p>
            <CodeBlock title="LevelDB Storage Schema">{`┌──────────────────────────────────────────────────────────────────────────┐
│                          LEVELDB STORAGE                                  │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │                    LEARNER MODEL KEYS                               │ │
│  │                                                                     │ │
│  │  learner:{userId}:profile              → Core psychometric profile  │ │
│  │  learner:{userId}:domain:{domainName}  → Individual domain scores   │ │
│  │  learner:{userId}:knowledge:{conceptId}→ Mastery level per concept  │ │
│  │  learner:{userId}:history:{timestamp}  → Learning session history   │ │
│  │  learner:{userId}:misconception:{id}   → Tracked misconceptions     │ │
│  │  learner:{userId}:zpd:current          → Current ZPD snapshot       │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │                    KNOWLEDGE MODEL KEYS                             │ │
│  │                                                                     │ │
│  │  knowledge:concept:{conceptId}         → Concept node data          │ │
│  │  knowledge:edge:prerequisite:{from}:{to} → Prerequisite edges       │ │
│  │  knowledge:edge:related:{from}:{to}    → Related concept edges      │ │
│  │  knowledge:bloom:{conceptId}:{level}   → Bloom's taxonomy mapping   │ │
│  │  knowledge:difficulty:{conceptId}      → Difficulty rating          │ │
│  │  knowledge:scaffold:{conceptId}        → Scaffolding strategies     │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │                    INDEX KEYS (Fast Lookups)                        │ │
│  │                                                                     │ │
│  │  index:concept:by-difficulty:{level}:{id}                           │ │
│  │  index:concept:by-bloom:{level}:{id}                                │ │
│  │  index:concept:by-domain:{domain}:{id}                              │ │
│  │  index:user:by-gap:{conceptId}:{userId}                             │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  Performance:                                                            │
│  • Single write: < 5ms                                                   │
│  • Single read: < 2ms                                                    │
│  • Batch throughput: > 2,000 ops/sec                                     │
│  • Data persistence: 100% across restarts                                │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘`}</CodeBlock>
          </Section>

          {/* RAG Context */}
          <Section id="rag-context" title="RAG Context Generation" icon={MessageSquare}>
            <p className="text-muted-foreground mb-4">
              When an LLM needs context about a learner, LearnGraph generates optimized RAG context:
            </p>
            <CodeBlock title="RAG Context Interface (TypeScript)">{`interface RAGContext {
  // Who is this learner?
  learnerProfile: {
    learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'reading';
    socialPreference: 'solo' | 'collaborative' | 'mixed';
    cognitiveProfile: {
      workingMemoryEstimate: number;
      attentionSpan: number;
      complexityTolerance: number;
    };
  };

  // What do they know?
  relevantKnowledgeStates: {
    conceptId: string;
    mastery: number;
    bloomLevel: number;
    lastAccessed: Date;
  }[];

  // What should they learn?
  zpd: {
    optimalConcepts: string[];
    scaffoldingNeeded: string[];
  };

  // What are they getting wrong?
  misconceptions: {
    concept: string;
    description: string;
    severity: 'minor' | 'moderate' | 'blocking';
  }[];

  // How should we teach them?
  recommendedScaffolding: ScaffoldingStrategy[];
}`}</CodeBlock>
            <p className="text-sm text-muted-foreground mt-4">
              <strong>Token Budget:</strong> &lt; 2000 tokens to leave room for the response
            </p>
          </Section>

          {/* Comparison */}
          <Section id="comparison" title="Traditional Assessment vs. LearnGraph" icon={Scale}>
            <Table
              headers={['Aspect', 'Traditional LMS', 'LearnGraph']}
              rows={[
                ['Personalization', 'Same content for everyone', 'Adapts to 39 psychological dimensions'],
                ['Recommendations', 'Fixed curriculum order', 'Dynamic ZPD-based paths'],
                ['Gap Detection', 'Manual quizzes only', 'Continuous monitoring + decay prediction'],
                ['Scaffolding', 'One-size-fits-all', 'Profile-matched strategies'],
                ['Review Scheduling', 'Manual or none', 'Automated spaced repetition'],
                ['AI Integration', 'Generic responses', 'Context-rich personalized tutoring'],
                ['Prerequisites', 'Course sequences', 'Concept-level graph relationships'],
                ['Progress Tracking', 'Completion % only', 'Bloom level + mastery + decay'],
              ]}
            />
          </Section>

          {/* Who Benefits */}
          <Section id="who-benefits" title="Who Benefits?" icon={Users}>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 rounded-xl border border-border/50 bg-card/50">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-primary" />
                  For Learners
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Get AI tutoring that actually knows you</li>
                  <li>• Never waste time on too-easy or too-hard content</li>
                  <li>• Automatically review at optimal times</li>
                  <li>• Receive explanations matched to your learning style</li>
                </ul>
              </div>

              <div className="p-6 rounded-xl border border-border/50 bg-card/50">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  For Educators
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Understand each student's psychometric profile</li>
                  <li>• See knowledge gaps across your class</li>
                  <li>• Get AI teaching assistant that adapts to students</li>
                  <li>• Focus human attention where it matters most</li>
                </ul>
              </div>

              <div className="p-6 rounded-xl border border-border/50 bg-card/50">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Code className="w-5 h-5 text-primary" />
                  For Developers
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Plug any LLM into a rich context layer</li>
                  <li>• Graph database for educational content</li>
                  <li>• RESTful APIs for all operations</li>
                  <li>• Extensible psychometric framework</li>
                </ul>
              </div>

              <div className="p-6 rounded-xl border border-border/50 bg-card/50">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  For Researchers
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Track learning effectiveness over time</li>
                  <li>• Correlate psychometrics with outcomes</li>
                  <li>• Export data for analysis</li>
                  <li>• Future GNN training support</li>
                </ul>
              </div>
            </div>
          </Section>

          {/* Quick Start */}
          <Section id="quick-start" title="Quick Start Code" icon={Code}>
            <div className="space-y-4">
              <div className="p-4 rounded-lg border border-border/50 bg-card/50">
                <h4 className="font-semibold mb-2">1. Store a Learner</h4>
                <CodeBlock>{`await db.setLearnerProfile('user-123', {
  userId: 'user-123',
  psychometricProfile: {
    big_five_openness: { score: 75, confidence: 0.8 },
    learning_styles: { score: 80, confidence: 0.9 },  // Visual
    // ... 37 more domains
  },
  learningStyle: {
    primary: 'visual',
    secondary: 'reading',
    socialPreference: 'solo',
    pacePreference: 'self-paced',
    feedbackPreference: 'immediate'
  }
});`}</CodeBlock>
              </div>

              <div className="p-4 rounded-lg border border-border/50 bg-card/50">
                <h4 className="font-semibold mb-2">2. Store Concepts with Prerequisites</h4>
                <CodeBlock>{`await db.addConcept({
  id: 'arithmetic',
  name: 'Basic Arithmetic',
  difficulty: 1
});

await db.addConcept({
  id: 'algebra',
  name: 'Algebraic Expressions',
  difficulty: 3
});

await db.addEdge({
  from: 'arithmetic',
  to: 'algebra',
  strength: 'required'
});`}</CodeBlock>
              </div>

              <div className="p-4 rounded-lg border border-border/50 bg-card/50">
                <h4 className="font-semibold mb-2">3. Track Progress</h4>
                <CodeBlock>{`await db.setKnowledgeState('user-123', 'arithmetic', {
  mastery: 90,
  bloomLevel: 4,
  lastAccessed: new Date()
});`}</CodeBlock>
              </div>

              <div className="p-4 rounded-lg border border-border/50 bg-card/50">
                <h4 className="font-semibold mb-2">4. Get Recommendations</h4>
                <CodeBlock>{`const zpd = await db.computeZPD('user-123');

// Returns:
// {
//   optimalTarget: ['algebra'],  // Ready to learn!
//   scaffolding: ['VISUAL_REPRESENTATION', 'WORKED_EXAMPLES'],
//   estimatedTime: '2 hours'
// }`}</CodeBlock>
              </div>

              <div className="p-4 rounded-lg border border-border/50 bg-card/50">
                <h4 className="font-semibold mb-2">5. Get RAG Context for AI Tutor</h4>
                <CodeBlock>{`const context = await db.getRAGContext('user-123', 'explain algebra');

// Pass to LLM:
// "User is a visual learner with high anxiety. They've mastered
// arithmetic (90%) but struggle with word problems. Use diagrams
// and gentle tone. Address their confusion about 'moving terms'..."`}</CodeBlock>
              </div>
            </div>
          </Section>

          {/* System Requirements */}
          <Section id="requirements" title="System Requirements" icon={Settings}>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg border border-border/50 bg-card/50">
                <h4 className="font-semibold mb-2">Runtime</h4>
                <p className="text-sm text-muted-foreground">Node.js 18+ or Bun</p>
              </div>
              <div className="p-4 rounded-lg border border-border/50 bg-card/50">
                <h4 className="font-semibold mb-2">Database</h4>
                <p className="text-sm text-muted-foreground">LevelDB (embedded, no separate server)</p>
              </div>
              <div className="p-4 rounded-lg border border-border/50 bg-card/50">
                <h4 className="font-semibold mb-2">Framework</h4>
                <p className="text-sm text-muted-foreground">Next.js 14+ with App Router</p>
              </div>
              <div className="p-4 rounded-lg border border-border/50 bg-card/50">
                <h4 className="font-semibold mb-2">Storage</h4>
                <p className="text-sm text-muted-foreground">~50MB for database + indexes</p>
              </div>
            </div>
          </Section>

          {/* Implementation Status */}
          <Section id="status" title="Implementation Status" icon={CheckCircle2}>
            <Table
              headers={['Phase', 'Status', 'Description']}
              rows={[
                ['1 - Core Database', <span key="1" className="text-green-500 font-semibold">DONE</span>, 'LevelDB setup, CRUD operations'],
                ['2 - Learner Model', <span key="2" className="text-green-500 font-semibold">DONE</span>, '39 psychometric domains, profile management'],
                ['3 - Knowledge Model', <span key="3" className="text-green-500 font-semibold">DONE</span>, "Concept graph, prerequisites, Bloom's taxonomy"],
                ['4 - ZPD Engine', <span key="4" className="text-green-500 font-semibold">DONE</span>, 'Zone computation, scaffolding selection'],
                ['5 - Gap Analysis', <span key="5" className="text-green-500 font-semibold">DONE</span>, 'Gap detection, forgetting curve, spaced repetition'],
                ['6 - Content Delivery + AI Curriculum + Assessments', <span key="6" className="text-yellow-500 font-semibold">Planned</span>, 'Adaptive content, AI graph generation, auto-assessments'],
                ['7 - RAG Integration', <span key="7" className="text-yellow-500 font-semibold">Planned</span>, 'LLM context generation'],
                ['8 - GNN Preparation', <span key="8" className="text-muted-foreground">Future</span>, 'Neural network training export'],
              ]}
            />
            <p className="text-sm text-green-500 mt-4 font-medium">
              MVP Complete: Phases 1-5 deliver personalized "what to learn next" with gap analysis.
            </p>
          </Section>

          {/* Getting Psychometric Data */}
          <Section id="psychometric-data" title="Getting Learner Profiles Into the Graph" icon={Users}>
            <p className="text-muted-foreground mb-4">
              A critical question: <strong>How does the system know about each learner's personality, learning style, and cognitive profile?</strong>
            </p>

            <h3 className="text-lg font-semibold mb-4">Four Ways to Populate the Learner Model</h3>
            <Table
              headers={['Approach', 'Effort', 'Accuracy', 'Best For']}
              rows={[
                [<strong key="1">LLM Integration</strong>, 'None for user', 'High (continuous)', 'Production systems with AI tutoring'],
                [<strong key="2">Psychological Assessments</strong>, '~30 min', 'Highest (validated)', 'Research, formal education'],
                [<strong key="3">Manual Entry</strong>, '~5 min', 'Medium (self-report)', 'Quick setup, user control'],
                [<strong key="4">Behavioral Learning</strong>, 'None', 'Grows over time', 'Cold start, implicit inference'],
              ]}
            />

            <h3 className="text-lg font-semibold mb-4 mt-8">Option 1: LLM Integration (Recommended for Production)</h3>
            <p className="text-muted-foreground mb-4">
              <strong>The Primary Use Case:</strong> Connect LearnGraph to your AI tutor. The LLM periodically updates the learner model based on how the student interacts with the system.
            </p>
            <CodeBlock title="LLM-Driven Profile Updates">{`┌─────────────────────────────────────────────────────────────────────────┐
│                    LLM-DRIVEN PROFILE UPDATES                            │
│                                                                          │
│  Student interacts with AI Tutor                                        │
│              │                                                           │
│              ▼                                                           │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │  LLM observes:                                                   │    │
│  │  • Response patterns (visual explanations work better)           │    │
│  │  • Struggle indicators (frustration, confusion markers)          │    │
│  │  • Learning speed (fast on math, slow on reading comprehension)  │    │
│  │  • Question types asked (wants examples vs. theory)              │    │
│  │  • Engagement patterns (short sessions, high frequency)          │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│              │                                                           │
│              ▼                                                           │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │  LLM calls LearnGraph API:                                       │    │
│  │                                                                  │    │
│  │  POST /api/learner-profile/update                                │    │
│  │  {                                                               │    │
│  │    "userId": "user-123",                                         │    │
│  │    "updates": {                                                  │    │
│  │      "learning_styles": { "score": 75, "confidence": 0.6 },      │    │
│  │      "big_five_openness": { "score": 68, "confidence": 0.4 }     │    │
│  │    },                                                            │    │
│  │    "source": "llm_inference"                                     │    │
│  │  }                                                               │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│              │                                                           │
│              ▼                                                           │
│  Profile continuously improves → Better personalization → Better        │
│  learning outcomes → More data → Better profile (virtuous cycle)        │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘`}</CodeBlock>

            <h3 className="text-lg font-semibold mb-4 mt-8">Option 2: Psychological Assessments (Highest Accuracy)</h3>
            <p className="text-muted-foreground mb-4">
              For formal educational settings or research, use validated psychological instruments:
            </p>
            <Table
              headers={['Assessment', 'Domains Covered', 'Time', 'Confidence']}
              rows={[
                ['Big Five Inventory (BFI-44)', 'Openness, Conscientiousness, Extraversion, Agreeableness, Neuroticism', '10 min', '0.9'],
                ['VARK Questionnaire', 'Visual, Auditory, Reading/Writing, Kinesthetic learning styles', '5 min', '0.8'],
                ['Motivated Strategies for Learning (MSLQ)', 'Self-efficacy, test anxiety, metacognition', '15 min', '0.85'],
                ['Growth Mindset Scale', 'Fixed vs. growth mindset', '3 min', '0.8'],
                ['Test Anxiety Inventory', 'Math anxiety, test anxiety', '5 min', '0.85'],
              ]}
            />

            <h3 className="text-lg font-semibold mb-4 mt-8">Option 3: Manual Entry (Quick Setup)</h3>
            <p className="text-muted-foreground mb-4">
              Users or administrators can directly set psychometric scores through the Profile page.
            </p>
            <p className="text-sm text-muted-foreground">
              <strong>When to Use:</strong> Quick onboarding, user wants control, teacher setting up student profiles, testing/development.
            </p>

            <h3 className="text-lg font-semibold mb-4 mt-8">Option 4: Behavioral Learning (Start from Defaults)</h3>
            <p className="text-muted-foreground mb-4">
              Start with default/neutral values and let the system learn from behavior:
            </p>
            <CodeBlock>{`// Default profile (all neutral)
const defaultProfile = {
  learning_styles: { score: 50, confidence: 0.1 },
  big_five_openness: { score: 50, confidence: 0.1 },
  // ... all 39 domains at 50 with low confidence
};

// Confidence Grows Over Time:
Day 1:  learning_styles = { score: 50, confidence: 0.1 }  (default)
Day 7:  learning_styles = { score: 62, confidence: 0.3 }  (some signal)
Day 30: learning_styles = { score: 71, confidence: 0.6 }  (clearer pattern)
Day 90: learning_styles = { score: 75, confidence: 0.8 }  (high confidence)`}</CodeBlock>

            <h3 className="text-lg font-semibold mb-4 mt-8">Hybrid Approach (Recommended)</h3>
            <CodeBlock title="Multi-Source Profile Building">{`┌─────────────────────────────────────────────────────────────────────────┐
│                    MULTI-SOURCE PROFILE BUILDING                         │
│                                                                          │
│  Priority 1: Validated Assessments (if taken)                           │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │  Big Five from BFI-44: confidence = 0.9                          │    │
│  │  These scores are "locked" unless user retakes assessment        │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                              +                                           │
│  Priority 2: User Self-Report (manual entry)                            │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │  "I'm a visual learner" → learning_styles.visual: confidence 0.7 │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                              +                                           │
│  Priority 3: LLM Inference (ongoing)                                    │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │  Updates domains not covered by assessments or self-report       │    │
│  │  Lower confidence (0.3-0.6), but continuous improvement          │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                              +                                           │
│  Priority 4: Behavioral Defaults (fill gaps)                            │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │  Any domain without data starts at 50 with confidence 0.1        │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                              =                                           │
│                    COMPLETE 39-DOMAIN PROFILE                            │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘`}</CodeBlock>

            <h3 className="text-lg font-semibold mb-4 mt-8">Configuration Modes</h3>
            <Table
              headers={['Mode', 'Behavior', 'Best For']}
              rows={[
                ['Auto-Discovery', 'System continuously updates from LLM + behavior', 'Production with AI tutor'],
                ['Manual Only', 'User sets values, system never changes them', 'Privacy-conscious users'],
                ['Adaptive', 'User sets initial, system refines over time', 'Balance of control + learning'],
                ['Assessment', 'Scores from validated tests, highest confidence', 'Research, formal education'],
              ]}
            />
          </Section>

          {/* Teacher Workflow */}
          <Section id="teacher-workflow" title="Getting Content Into the Graph: Teacher Workflow" icon={Upload}>
            <p className="text-muted-foreground mb-4">
              A critical question for educators: <strong>How do I get my curriculum into the system?</strong>
            </p>

            <h3 className="text-lg font-semibold mb-4">Three Approaches to Curriculum Entry</h3>
            <Table
              headers={['Approach', 'Teacher Effort', 'Quality', 'Best For']}
              rows={[
                ['Manual Entry', 'High', 'Highest (expert curated)', 'Small courses, precise control'],
                ['AI from Syllabus', 'Low', 'Medium (needs review)', 'Quick setup, large courses'],
                [<strong key="1">Hybrid</strong>, 'Medium', 'High (AI draft → teacher refines)', <strong key="2">Recommended</strong>],
              ]}
            />

            <h3 className="text-lg font-semibold mb-4 mt-8">The Hybrid Workflow (Recommended)</h3>
            <CodeBlock title="Hybrid Curriculum Ingestion">{`┌─────────────────────────────────────────────────────────────────────────┐
│                    HYBRID CURRICULUM INGESTION                           │
│                                                                          │
│  Step 1: TEACHER INPUT                                                   │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │  Upload syllabus, lesson plans, textbook chapters, or just       │    │
│  │  describe: "I'm teaching intro data analytics covering Excel,    │    │
│  │  SQL basics, Python pandas, and data visualization"              │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                              │                                           │
│                              ▼                                           │
│  Step 2: AI GENERATES DRAFT GRAPH                                        │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │  • Identifies concepts and their Bloom levels                    │    │
│  │  • Infers prerequisite relationships                             │    │
│  │  • Estimates difficulty ratings                                  │    │
│  │  • Suggests related concepts students might need                 │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                              │                                           │
│                              ▼                                           │
│  Step 3: TEACHER REVIEWS IN VISUAL GRAPH UI                              │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │  • Drag nodes to adjust relationships                            │    │
│  │  • Click to edit difficulty levels                               │    │
│  │  • Add missing prerequisites                                     │    │
│  │  • Remove incorrect connections                                  │    │
│  │  • Approve or modify AI suggestions                              │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                              │                                           │
│                              ▼                                           │
│  Step 4: SYSTEM LEARNS FROM CORRECTIONS                                  │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │  • Improves future suggestions based on teacher feedback         │    │
│  │  • Builds domain-specific pattern recognition                    │    │
│  │  • Creates reusable curriculum templates                         │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘`}</CodeBlock>

            <h3 className="text-lg font-semibold mb-4 mt-8">Supported Input Formats</h3>
            <Table
              headers={['Input Type', 'What AI Extracts']}
              rows={[
                ['Syllabus (PDF/Word)', 'Course topics, learning objectives, weekly schedule'],
                ['Textbook chapters', 'Concept hierarchy, difficulty progression'],
                ['Lesson plans', 'Specific skills, prerequisites mentioned'],
                ['Learning objectives', "Bloom's taxonomy levels, measurable outcomes"],
                ['Plain text description', 'Topic list, inferred relationships'],
                ['Existing curriculum standards', 'State standards, AP frameworks, etc.'],
              ]}
            />
          </Section>

          {/* AI Assessments */}
          <Section id="assessments" title="AI-Generated Assessments (Optional Feature)" icon={ClipboardList}>
            <p className="text-muted-foreground mb-4">
              When curriculum is imported, the system can <strong>optionally</strong> generate assessments to measure mastery. This feature includes a <strong>toggle switch</strong> to enable/disable it.
            </p>

            <div className="p-4 rounded-lg border border-border/50 bg-card/50 mb-6 flex items-center gap-3">
              <ToggleLeft className="w-6 h-6 text-primary" />
              <span className="font-medium">Assessments can be toggled ON/OFF per course or globally</span>
            </div>

            <h3 className="text-lg font-semibold mb-4">Assessment Types</h3>
            <Table
              headers={['Type', 'Questions', 'Purpose', 'When Used']}
              rows={[
                ['Quick Check', '2-3', 'Gate progression', 'Before marking concept "complete"'],
                ['Mastery Test', '5-10', 'Determine mastery %', 'After studying concept content'],
                ['Misconception Probe', '3-5', 'Detect wrong mental models', 'When errors indicate confusion'],
                ['Spaced Review', '2-3', 'Verify retention', 'During spaced repetition reviews'],
              ]}
            />

            <h3 className="text-lg font-semibold mb-4 mt-6">Question Types Supported</h3>
            <Table
              headers={['Type', 'Example']}
              rows={[
                [<code key="1">multiple_choice</code>, '"What is 2x when x=3?" A) 5 B) 6 C) 8 D) 9'],
                [<code key="2">numeric</code>, '"Solve: 3x + 5 = 14. x = ___"'],
                [<code key="3">short_answer</code>, '"Define what a linear equation is."'],
                [<code key="4">worked_problem</code>, '"Solve step by step: 2x + 3 = 7"'],
                [<code key="5">classification</code>, '"Drag each expression to: Linear / Non-linear"'],
                [<code key="6">ordering</code>, '"Order the steps for solving this equation"'],
              ]}
            />

            <h3 className="text-lg font-semibold mb-4 mt-6">Assessment Impact on System</h3>
            <Table
              headers={['Event', 'System Update']}
              rows={[
                ['Quick Check passed', 'Concept marked complete, unlock next concepts'],
                ['Quick Check failed', 'Flag for review, suggest re-engagement'],
                ['Mastery Test completed', 'Update knowledgeState.mastery with exact %'],
                ['Misconception detected', 'Add to learner profile for targeted help'],
                ['Spaced review passed', 'Extend review interval (3 days → 7 days)'],
                ['Spaced review failed', 'Reset interval, add to priority queue'],
              ]}
            />
          </Section>

          {/* Future Vision */}
          <Section id="future" title="Future Vision: Complete System" icon={Sparkles}>
            <h3 className="text-lg font-semibold mb-4">Phase 6: Adaptive Content Delivery + AI Curriculum + Assessments</h3>
            <CodeBlock>{`CONTENT MATCHING ENGINE
• scoreContentMatch()     → Find best-fit learning materials
• buildSessionPlan()      → Structure optimal learning session
• determinePresentationStrategy() → Visual? Audio? Interactive?
• Adaptive pacing         → Speed up or slow down based on response
• Break recommendations   → Cognitive load management

Target: 70% content match satisfaction, 80% session completion

AI CURRICULUM INGESTION ENGINE
• parseCurriculumInput()   → Extract topics from syllabus/text
• inferPrerequisites()     → AI determines concept dependencies
• estimateDifficulty()     → Rate concepts 1-10 based on complexity
• generateBloomLevels()    → Map to Remember/Understand/Apply/etc.
• presentForReview()       → Show draft graph for teacher approval

Target: 80% of AI-generated edges approved, < 5 min to full course

AI ASSESSMENT GENERATION ENGINE (toggle-enabled)
• generateAssessments()       → Create questions from Bloom levels
• generateQuickCheck()        → 2-3 gating questions
• generateMasteryTest()       → 5-10 questions for mastery %
• generateMisconceptionProbes()→ Detect wrong mental models

Target: 80% AI questions approved, < 2 min teacher review per concept`}</CodeBlock>

            <h3 className="text-lg font-semibold mb-4 mt-6">Phase 7: RAG Integration (LLM Augmentation)</h3>
            <CodeBlock>{`RAG CONTEXT PIPELINE
1. getRAGContext(userId, query)
   │
   ├─► Query-type detection (explanation? practice? review?)
   │
   ├─► Context aggregation
   │   • Learner profile summary
   │   • Relevant knowledge states
   │   • Active misconceptions
   │   • Recommended scaffolding
   │
   ├─► Prompt augmentation with templates
   │
   └─► Context optimization (< 2000 tokens)

Target: Context retrieval < 150ms, 80% feel responses are personalized`}</CodeBlock>

            <h3 className="text-lg font-semibold mb-4 mt-6">Phase 8: GNN Preparation (Machine Learning)</h3>
            <CodeBlock>{`NEURAL NETWORK TRAINING EXPORT

Learner Features (16-dimensional vector):
[openness, conscientiousness, extraversion, agreeableness,
 neuroticism, anxiety, risk_tolerance, growth_mindset,
 self_efficacy, learning_style_visual, learning_style_auditory,
 learning_style_kinesthetic, metacognition, executive_functions,
 working_memory_estimate, attention_span]

Concept Features (13-dimensional vector):
[difficulty_overall, difficulty_cognitive, bloom_level,
 prerequisite_count, dependent_count, domain_embedding...,
 avg_time_to_master, common_misconception_count]

Export format: PyTorch Geometric compatible
Validation: All features in [0,1], no NaN values`}</CodeBlock>
          </Section>

          {/* Validation */}
          <Section id="validation" title="How to Prove It Works" icon={CheckCircle2}>
            <p className="text-muted-foreground mb-4">
              LearnGraph includes validation tests that prove personalization actually happens:
            </p>

            <h3 className="text-lg font-semibold mb-4">The "Different Users, Different Results" Test</h3>
            <p className="text-muted-foreground mb-4">Create two learners with opposite profiles:</p>

            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="p-4 rounded-lg border border-red-500/20 bg-red-500/5">
                <h4 className="font-semibold mb-2">Learner A: "Anxious Visual Learner"</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>Test Anxiety: 90%</li>
                  <li>Openness: 30%</li>
                  <li>Learning Style: Visual</li>
                  <li>Risk Tolerance: 20%</li>
                  <li>Self-Efficacy: 25%</li>
                </ul>
              </div>
              <div className="p-4 rounded-lg border border-green-500/20 bg-green-500/5">
                <h4 className="font-semibold mb-2">Learner B: "Confident Analytical Learner"</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>Test Anxiety: 10%</li>
                  <li>Openness: 90%</li>
                  <li>Learning Style: Reading/Writing</li>
                  <li>Risk Tolerance: 80%</li>
                  <li>Self-Efficacy: 90%</li>
                </ul>
              </div>
            </div>

            <p className="text-muted-foreground mb-4">
              <strong>With identical knowledge states</strong>, the system produces:
            </p>

            <Table
              headers={['Output', 'Learner A (Anxious)', 'Learner B (Confident)']}
              rows={[
                ['ZPD Size', 'Smaller (fewer ready concepts)', 'Larger (more challenges)'],
                ['Scaffolding', 'Visual aids, chunking, encouragement', 'Complex explanations, independent study'],
                ['Learning Path', 'Smaller steps, more reviews', 'Larger leaps, fewer reviews'],
                ['Difficulty Curve', 'Gradual, confidence-building', 'Steeper, challenge-seeking'],
              ]}
            />

            <p className="text-sm text-green-500 mt-4 font-medium">
              Pass criteria: Clear, measurable differences in ALL outputs.
            </p>
          </Section>

          {/* Success Metrics */}
          <Section id="metrics" title="Success Metrics" icon={BarChart3}>
            <h3 className="text-lg font-semibold mb-4">Technical Performance</h3>
            <Table
              headers={['Metric', 'Target', 'Achieved']}
              rows={[
                ['Database write', '< 5ms', <span key="1" className="text-green-500 font-semibold">0.10ms</span>],
                ['Database read', '< 2ms', <span key="2" className="text-green-500 font-semibold">0.02ms</span>],
                ['Profile retrieval', '< 10ms', <span key="3" className="text-green-500 font-semibold">&lt; 5ms</span>],
                ['Graph traversal (depth 5)', '< 100ms', <span key="4" className="text-green-500 font-semibold">&lt; 50ms</span>],
                ['ZPD computation', '< 200ms', <span key="5" className="text-green-500 font-semibold">&lt; 100ms</span>],
                ['API response', '< 500ms', <span key="6" className="text-green-500 font-semibold">&lt; 100ms</span>],
              ]}
            />

            <h3 className="text-lg font-semibold mb-4 mt-6">Algorithm Accuracy</h3>
            <Table
              headers={['Metric', 'Target']}
              rows={[
                ['ZPD classification', '90% concepts in correct zone'],
                ['Gap detection', '90% true positive rate'],
                ['Forgotten detection', '85% based on decay formula'],
                ['Retention at review', '85% post-review mastery'],
              ]}
            />

            <h3 className="text-lg font-semibold mb-4 mt-6">User Experience (Phase 7+)</h3>
            <Table
              headers={['Metric', 'Target']}
              rows={[
                ['Recommendation relevance', '75%+ feel "personalized to them"'],
                ['Simplicity', '90%+ can explain what system does in one sentence'],
                ['Emotional resonance', 'Described as "helpful," "understanding," or "magical"'],
                ['Time to first recommendation', '< 5 minutes from signup'],
              ]}
            />
          </Section>

          {/* Magic Moments */}
          <Section id="magic-moments" title="Magic Moments" icon={Sparkles}>
            <p className="text-muted-foreground mb-4">
              LearnGraph creates specific moments where users realize the system truly knows them:
            </p>
            <div className="space-y-4">
              {[
                { num: 1, title: 'The "How did it know?" moment', desc: 'When the first recommendation addresses a struggle they never explicitly mentioned' },
                { num: 2, title: 'The "Finally, someone understands" moment', desc: 'When explanations match their learning style perfectly' },
                { num: 3, title: 'The "That\'s exactly what I needed" moment', desc: 'When scaffolding strategies feel intuitive, not prescribed' },
                { num: 4, title: 'The "I\'m actually learning" moment', desc: 'When spaced repetition surfaces forgotten concepts at the perfect time' },
                { num: 5, title: 'The "I feel seen" moment', desc: "When the system's assessment of their strengths/challenges matches their self-perception" },
              ].map((moment) => (
                <div key={moment.num} className="p-4 rounded-lg border border-border/50 bg-card/50 flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-semibold shrink-0">
                    {moment.num}
                  </div>
                  <div>
                    <h4 className="font-semibold">{moment.title}</h4>
                    <p className="text-sm text-muted-foreground">{moment.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* Privacy */}
          <Section id="privacy" title="Privacy & Trust" icon={Shield}>
            <p className="text-muted-foreground mb-4">
              LearnGraph is designed with privacy as a core principle:
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { icon: Lock, title: 'Data minimization', desc: 'Only collect what directly improves recommendations' },
                { icon: Settings, title: 'User control', desc: 'See, edit, and delete your psychometric profile anytime' },
                { icon: Shield, title: 'Privacy-first mode', desc: 'System works with minimal data if preferred' },
                { icon: Eye, title: 'Transparency', desc: 'Every recommendation includes a "Why this?" explanation' },
                { icon: Heart, title: 'No judgment', desc: "System adapts to you; it doesn't label you" },
              ].map((item, i) => (
                <div key={i} className="p-4 rounded-lg border border-border/50 bg-card/50 flex gap-3">
                  <item.icon className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-sm">{item.title}</h4>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* API Reference */}
          <Section id="api-reference" title="Complete API Reference" icon={Code}>
            <h3 className="text-lg font-semibold mb-4">Core Endpoints</h3>
            <Table
              headers={['Endpoint', 'Method', 'Description']}
              rows={[
                [<code key="1">/api/learners</code>, 'GET, POST', 'List/create learners'],
                [<code key="2">/api/learners/:userId</code>, 'GET, PUT, DELETE', 'Individual learner operations'],
                [<code key="3">/api/learners/:userId/psychometrics</code>, 'GET, PUT', 'Psychometric profile'],
                [<code key="4">/api/concepts</code>, 'GET, POST', 'List/create concepts'],
                [<code key="5">/api/concepts/:conceptId</code>, 'GET, PUT, DELETE', 'Individual concept'],
                [<code key="6">/api/edges</code>, 'GET, POST, DELETE', 'Prerequisite relationships'],
                [<code key="7">/api/states</code>, 'GET, POST, DELETE', 'Knowledge states'],
                [<code key="8">/api/graph</code>, 'GET', 'Full graph for visualization'],
              ]}
            />

            <h3 className="text-lg font-semibold mb-4 mt-6">Intelligence Endpoints</h3>
            <Table
              headers={['Endpoint', 'Method', 'Description']}
              rows={[
                [<code key="1">/api/zpd</code>, 'GET', 'Zone of Proximal Development'],
                [<code key="2">/api/learning-path</code>, 'GET', 'Personalized learning path'],
                [<code key="3">/api/gaps</code>, 'GET', 'Knowledge gap detection'],
                [<code key="4">/api/decay</code>, 'GET', 'Memory decay prediction'],
                [<code key="5">/api/review-schedule</code>, 'GET', 'Optimal review timing (SM-2)'],
                [<code key="6">/api/review-queue</code>, 'GET', 'Prioritized review queue'],
                [<code key="7">/api/remediation</code>, 'GET', 'Gap remediation plan'],
                [<code key="8">/api/status</code>, 'GET', 'System health check'],
              ]}
            />
          </Section>

          {/* Educational Psychology */}
          <Section id="edu-psychology" title="Educational Psychology Foundation" icon={GraduationCap}>
            <p className="text-muted-foreground mb-4">
              LearnGraph is built on decades of validated research:
            </p>
            <Table
              headers={['Theory', 'Application', 'Reference']}
              rows={[
                ['Zone of Proximal Development', 'Optimal challenge selection', 'Vygotsky (1978)'],
                ["Bloom's Taxonomy", 'Cognitive level tracking', 'Bloom (1956)'],
                ['Forgetting Curve', 'Memory decay prediction', 'Ebbinghaus (1885)'],
                ['Scaffolding Theory', 'Support strategy selection', 'Bruner (1966)'],
                ['Big Five Personality', 'Core trait modeling', 'Costa & McCrae (1992)'],
                ['Growth Mindset', 'Belief system adaptation', 'Dweck (2006)'],
                ['Multimedia Learning', 'Presentation optimization', 'Mayer (2009)'],
                ['Self-Efficacy', 'Confidence-based adjustments', 'Bandura (1977)'],
                ['Multiple Intelligences', 'Learning style diversity', 'Gardner (1983)'],
                ['Spaced Repetition', 'Review scheduling (SM-2)', 'Wozniak (1987)'],
              ]}
            />
          </Section>

          {/* Expert Perspectives */}
          <Section id="expert-perspectives" title="The Vision: Expert Perspectives" icon={Lightbulb}>
            <p className="text-muted-foreground mb-6">
              LearnGraph was evaluated by three expert perspectives, each bringing a unique lens:
            </p>

            <div className="space-y-6">
              <div className="p-6 rounded-xl border border-border/50 bg-card/50">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-500" />
                  Engineering Focus (Execution & Speed)
                </h3>
                <blockquote className="italic text-muted-foreground border-l-2 border-primary pl-4 mb-3">
                  "The core concept of combining psychometric profiling, a knowledge graph, and a ZPD engine is fundamentally sound and aligns with a first-principles approach to education."
                </blockquote>
                <p className="text-sm text-muted-foreground">
                  <strong>Key insight:</strong> The foundation is done—the real engineering happens in personalization. Move fast, build the simplest working version, then iterate.
                </p>
              </div>

              <div className="p-6 rounded-xl border border-border/50 bg-card/50">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-500" />
                  AI Research Focus (Mathematical Elegance)
                </h3>
                <blockquote className="italic text-muted-foreground border-l-2 border-primary pl-4 mb-3">
                  "The true potential lies in whether the ZPD engine and Graph RAG can be rigorously defined as scalable, purely technical problems."
                </blockquote>
                <p className="text-sm text-muted-foreground">
                  <strong>Key insight:</strong> Every algorithm must be formalized, scalable, and empirically validated. The 39 psychological domains must become computationally tractable features.
                </p>
              </div>

              <div className="p-6 rounded-xl border border-border/50 bg-card/50">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-pink-500" />
                  Product Vision Focus (User Experience)
                </h3>
                <blockquote className="italic text-muted-foreground border-l-2 border-primary pl-4 mb-3">
                  "LearnGraph has the seeds of something truly revolutionary. The complex engines must become invisible to users."
                </blockquote>
                <p className="text-sm text-muted-foreground">
                  <strong>Key insight:</strong> Users should feel <em>understood and effortlessly guided</em>, not "processed" by a system. The question to answer: <strong>"What is the one thing the user <em>feels</em> when they interact with this?"</strong>
                </p>
              </div>
            </div>

            <h3 className="text-lg font-semibold mb-4 mt-8">The Three Commandments</h3>
            <Table
              headers={['Principle', 'Test', 'Application']}
              rows={[
                [<strong key="1">Move Fast</strong>, 'Can we build it this week?', 'Prioritize shipping over perfection'],
                [<strong key="2">Mathematical Elegance</strong>, 'Will it scale to 100K users?', 'Every algorithm must be O(n log n) or better'],
                [<strong key="3">Make Complexity Disappear</strong>, 'Will users notice (in a bad way)?', 'Technical language becomes human language'],
              ]}
            />
          </Section>

          {/* Bottom Line */}
          <Section id="bottom-line" title="The Bottom Line" icon={Target}>
            <div className="p-8 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-purple-500/5 text-center">
              <h3 className="text-2xl font-bold mb-4">
                LearnGraph transforms education from one-size-fits-all to truly personalized.
              </h3>
              <p className="text-muted-foreground mb-6">
                Every learner is different. LearnGraph makes that difference visible, measurable, and actionable—enabling any AI to become a tutor that actually knows who it's teaching.
              </p>
              <CodeBlock>{`"What should I learn next?"

Before LearnGraph:  [Random guess based on course order]

After LearnGraph:   [Optimal concept based on YOUR mastery,
                     YOUR prerequisites, YOUR anxiety level,
                     YOUR learning style, YOUR forgetting curve,
                     and YOUR cognitive profile]

That's the difference.`}</CodeBlock>
            </div>

            <p className="text-center text-muted-foreground mt-8 italic">
              LearnGraph - Making AI tutoring truly personal.
            </p>
          </Section>
        </div>
      </main>
    </div>
  );
}
