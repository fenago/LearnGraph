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
  ShieldCheck,
  Fingerprint,
  HeartHandshake,
  Flame,
  Star,
  Trophy,
  Frown,
  Smile,
  Meh,
  BrainCircuit,
  Route,
  MapPin,
  Gauge,
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
function Section({ id, title, icon: Icon, children, badge }: { id: string; title: string; icon?: React.ElementType; children: React.ReactNode; badge?: string }) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mb-16 scroll-mt-20"
    >
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-foreground">
        {Icon && <Icon className="w-6 h-6 text-primary" />}
        {title}
        {badge && (
          <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">
            {badge}
          </span>
        )}
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

// Value Card component
function ValueCard({ icon: Icon, title, description, gradient }: { icon: React.ElementType; title: string; description: string; gradient: string }) {
  return (
    <div className="p-6 rounded-xl border border-border/50 bg-card/50 hover:bg-card transition-colors">
      <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-4", gradient)}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
    </div>
  );
}

// Table of Contents
function TableOfContents() {
  const sections = [
    { id: 'what-is', label: 'The Vision' },
    { id: 'the-problem', label: 'The Problem We Solve' },
    { id: 'privacy', label: 'Privacy First' },
    { id: 'architecture', label: 'How It Works' },
    { id: 'gap-detection', label: 'Knowledge Gap Detection' },
    { id: 'zpd', label: 'Zone of Proximal Development' },
    { id: 'domains', label: '39 Psychological Domains' },
    { id: 'scaffolding', label: 'Personalized Scaffolding' },
    { id: 'forgetting', label: 'Fighting Forgetting' },
    { id: 'comparison', label: 'Traditional vs LearnGraph' },
    { id: 'who-benefits', label: 'Who Benefits?' },
    { id: 'magic-moments', label: 'Magic Moments' },
    { id: 'quick-test', label: 'Try It Yourself' },
    { id: 'technical', label: 'Technical Deep Dive' },
    { id: 'bottom-line', label: 'The Bottom Line' },
  ];

  return (
    <div className="mb-16 p-6 rounded-xl border border-border/50 bg-card/50">
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
            className="mb-16 text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-500 text-sm font-medium mb-6">
              <ShieldCheck className="w-4 h-4" />
              100% Private • On-Device • No Cloud Required
            </div>
            <h1 className="text-5xl font-bold tracking-tight text-foreground mb-6">
              <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                LearnGraph
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-4">
              A <strong>Local Browser-Based GraphRAG</strong> that transforms AI tutors from generic assistants into deeply personalized learning companions who truly understand you.
            </p>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Every learner is unique. Yet every AI tutor treats them the same.
              <span className="text-primary font-medium"> Until now.</span>
            </p>
          </motion.section>

          {/* Table of Contents */}
          <TableOfContents />

          {/* What Is LearnGraph - THE VISION */}
          <Section id="what-is" title="The Vision: Education That Truly Sees You" icon={Heart}>
            <div className="space-y-6">
              <p className="text-lg text-muted-foreground leading-relaxed">
                Imagine an AI tutor that doesn't just know <em>what</em> you're learning, but understands <em>who you are</em> as a learner. One that knows you're a visual learner who gets anxious about math, that you process information deeply but slowly, that you respond better to analogies than abstract definitions.
              </p>

              <p className="text-lg text-muted-foreground leading-relaxed">
                Imagine a system that remembers that you struggled with "moving terms" in algebra three months ago, notices when you're about to forget something critical, and knows exactly which teaching approach will click for <em>you</em> specifically.
              </p>

              <div className="p-6 rounded-xl bg-gradient-to-br from-primary/5 to-purple-500/5 border border-primary/20">
                <p className="text-lg font-medium text-foreground mb-4">
                  That's LearnGraph.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  It's not another chatbot. It's not a database. It's a <strong>personalization layer</strong> that makes any AI tutor profoundly smarter about each individual learner. LearnGraph is the difference between "here's how algebra works" and "here's how algebra works <em>for you, Sarah, in the way you learn best, building on what you already know, at exactly the right time</em>."
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  And here's the remarkable part: <strong>it runs entirely in your browser</strong>. No servers. No cloud. No tokens to count. No API costs. Your most intimate learning data—your psychological profile, your struggles, your misconceptions—never leaves your device. It's private by design, secure by architecture, and environmentally friendly because there's no data center crunching your requests.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mt-8">
                <ValueCard
                  icon={Fingerprint}
                  title="Deeply Personal"
                  description="Track 39 psychological dimensions to understand how each learner thinks, feels, and processes information. Not one-size-fits-all—one-size-fits-you."
                  gradient="bg-gradient-to-br from-indigo-500 to-purple-500"
                />
                <ValueCard
                  icon={ShieldCheck}
                  title="100% Private"
                  description="Everything runs locally in your browser. Your psychological profile, learning struggles, and progress never leave your device. Your data belongs to you."
                  gradient="bg-gradient-to-br from-emerald-500 to-green-500"
                />
                <ValueCard
                  icon={BrainCircuit}
                  title="Scientifically Grounded"
                  description="Built on Vygotsky's Zone of Proximal Development, Ebbinghaus's forgetting curve, and decades of educational psychology research. Not guesswork—science."
                  gradient="bg-gradient-to-br from-amber-500 to-orange-500"
                />
              </div>
            </div>
          </Section>

          {/* THE PROBLEM WE SOLVE */}
          <Section id="the-problem" title="The Problem: AI Tutors Are Blind" icon={AlertTriangle}>
            <div className="space-y-6">
              <p className="text-lg text-muted-foreground leading-relaxed">
                Today's AI tutors are remarkably intelligent—but they're also remarkably blind. They can explain quantum physics or solve differential equations, but they have no idea who they're talking to.
              </p>

              <p className="text-lg text-muted-foreground leading-relaxed">
                And the solutions that try to fix this? They come with their own problems: <strong>privacy nightmares</strong> (your learning struggles stored on corporate servers), <strong>security risks</strong> (data breaches exposing your psychological profile), <strong>mounting costs</strong> (every query burns tokens and API calls), and <strong>environmental impact</strong> (data centers consuming electricity for every personalization request). There had to be a better way.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 rounded-xl border border-red-500/20 bg-red-500/5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-red-500/10">
                      <XCircle className="w-6 h-6 text-red-500" />
                    </div>
                    <h3 className="font-semibold text-lg">WITHOUT LearnGraph</h3>
                  </div>
                  <div className="space-y-4 text-sm">
                    <div className="p-3 rounded-lg bg-background/50">
                      <p className="font-medium mb-1">User: "Explain linear equations"</p>
                      <p className="text-muted-foreground">AI: Gives the same generic explanation to every learner—whether they're a visual learner or auditory, whether they're anxious or confident, whether they already know arithmetic or not.</p>
                    </div>
                    <div className="p-3 rounded-lg bg-background/50">
                      <p className="font-medium mb-1">User: "What should I learn next?"</p>
                      <p className="text-muted-foreground">AI: No idea. Can only guess based on what seems logical, not what's actually appropriate for this specific learner's knowledge state and readiness.</p>
                    </div>
                    <div className="p-3 rounded-lg bg-background/50">
                      <p className="font-medium mb-1">User: "I'm stuck on this problem"</p>
                      <p className="text-muted-foreground">AI: Provides help that might work for some learners, but doesn't know this learner's specific misconceptions, struggles, or preferred learning approach.</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 rounded-xl border border-green-500/20 bg-green-500/5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-green-500/10">
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    </div>
                    <h3 className="font-semibold text-lg">WITH LearnGraph</h3>
                  </div>
                  <div className="space-y-4 text-sm">
                    <div className="p-3 rounded-lg bg-background/50">
                      <p className="font-medium mb-1">User: "Explain linear equations"</p>
                      <p className="text-muted-foreground">AI receives: "Sarah is a visual learner with high math anxiety, struggles with 'moving terms,' responds well to gentle encouragement, has mastered arithmetic."</p>
                      <p className="text-green-600 mt-2 font-medium">→ Personalized explanation with diagrams, addresses her specific confusion, warm tone, builds on arithmetic knowledge.</p>
                    </div>
                    <div className="p-3 rounded-lg bg-background/50">
                      <p className="font-medium mb-1">User: "What should I learn next?"</p>
                      <p className="text-muted-foreground">AI receives: Full knowledge state, mastery levels, ZPD analysis showing which concepts Sarah is ready for.</p>
                      <p className="text-green-600 mt-2 font-medium">→ "Based on your strong arithmetic foundation, you're ready for algebraic expressions. Want to start there?"</p>
                    </div>
                    <div className="p-3 rounded-lg bg-background/50">
                      <p className="font-medium mb-1">User: "I'm stuck on this problem"</p>
                      <p className="text-muted-foreground">AI receives: Sarah's logged misconception about "terms don't move, we do inverse operations," her preference for visual scaffolding.</p>
                      <p className="text-green-600 mt-2 font-medium">→ Uses visual diagram to show balance method, directly addresses her specific misunderstanding.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-xl border border-border/50 bg-card/50">
                <h3 className="font-semibold text-lg mb-3">The Gap That LearnGraph Fills</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Large Language Models are incredibly capable—but they're stateless. Every conversation starts fresh. They don't remember you, don't track your progress, don't understand your unique cognitive fingerprint. LearnGraph is the <strong>persistent memory and personalization layer</strong> that bridges this gap. It's the difference between a tutor who meets you for the first time every session, and one who has worked with you for years.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  But unlike cloud-based solutions that store your intimate learning data on corporate servers, LearnGraph runs <strong>100% in your browser</strong>. No tokens burned. No API bills. No privacy concerns. No security vulnerabilities from network transmission. And because all computation happens locally, it's better for the planet—no energy-hungry data centers processing your every question.
                </p>
              </div>
            </div>
          </Section>

          {/* PRIVACY FIRST */}
          <Section id="privacy" title="Privacy First: Your Mind, Your Data" icon={Lock} badge="100% On-Device">
            <div className="space-y-6">
              <p className="text-lg text-muted-foreground leading-relaxed">
                Your psychological profile is perhaps the most intimate data that exists about you. It reveals how you think, what you struggle with, your anxieties and strengths. <strong>This data should never leave your device.</strong>
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
                  <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-500" />
                    What This Means For You
                  </h3>
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                      <span><strong>No account required</strong> — start using LearnGraph immediately</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                      <span><strong>No data transmitted</strong> — everything stays in your browser's local storage</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                      <span><strong>No tracking</strong> — we don't know who you are or what you're learning</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                      <span><strong>Your data, your control</strong> — export, delete, or modify anytime</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                      <span><strong>Works offline</strong> — no internet required after initial load</span>
                    </li>
                  </ul>
                </div>

                <div className="p-6 rounded-xl border border-border/50 bg-card/50">
                  <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <Database className="w-5 h-5 text-primary" />
                    Technical Implementation
                  </h3>
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <ChevronRight className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      <span><strong>LevelDB</strong> — Embedded database runs entirely in browser</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      <span><strong>IndexedDB</strong> — Browser-native storage for persistence</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      <span><strong>No server calls</strong> — All graph operations happen locally</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      <span><strong>Open source</strong> — Verify our privacy claims yourself</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      <span><strong>Custom Graph DB</strong> — 2,000+ line dual-graph engine with zero external dependencies</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="p-5 rounded-xl bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-500/20">
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Why this matters:</strong> When you use cloud-based learning systems, your struggles, misconceptions, and psychological profile become someone else's data. They can be sold, breached, or used to profile you. LearnGraph believes learning is personal—and your personal data should stay personal.
                </p>
              </div>
            </div>
          </Section>

          {/* HOW IT WORKS - ARCHITECTURE */}
          <Section id="architecture" title="How It Works: The Dual-Graph Brain" icon={Network}>
            <div className="space-y-6">
              <p className="text-lg text-muted-foreground leading-relaxed">
                LearnGraph maintains two interconnected graphs that work together to understand both what you're learning and who you are as a learner.
              </p>

              <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 mb-6">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-primary" />
                  Why Two Graphs?
                </h3>
                <p className="text-sm text-muted-foreground">
                  Traditional learning systems track either <em>what</em> you know OR <em>who</em> you are—never both in an integrated way. LearnGraph's dual-graph architecture connects your psychological profile (Graph A) with your knowledge state (Graph B), enabling truly personalized recommendations that consider both your readiness and your learning style.
                </p>
              </div>

              <CodeBlock title="The Dual-Graph Architecture">{`┌─────────────────────────────────────────────────────────────────────────┐
│                           LearnGraph Engine                              │
│                                                                          │
│  ┌─────────────────────────────┐    ┌─────────────────────────────────┐ │
│  │     LEARNER MODEL          │    │      KNOWLEDGE MODEL            │ │
│  │     (Graph A)              │    │      (Graph B)                  │ │
│  │     "Who You Are"          │    │      "What You're Learning"     │ │
│  │                            │    │                                 │ │
│  │  • Your Profile            │    │  • Concept Nodes                │ │
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
│                          │                   │                          │
│                          │ "What should you  │                          │
│                          │  learn next, and  │                          │
│                          │  HOW should we    │                          │
│                          │  teach it to YOU?"│                          │
│                          └───────────────────┘                          │
└─────────────────────────────────────────────────────────────────────────┘`}</CodeBlock>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 rounded-xl border border-indigo-500/20 bg-indigo-500/5">
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <Users className="w-5 h-5 text-indigo-500" />
                    Graph A: The Learner Model
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    This graph represents <em>you</em>. Not a generic learner, but your specific psychological profile, learning history, and knowledge state.
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• <strong>39 Psychometric Dimensions:</strong> From Big Five personality to learning styles</li>
                    <li>• <strong>Knowledge States:</strong> Your mastery level for every concept</li>
                    <li>• <strong>Misconceptions:</strong> Where you've gone wrong before</li>
                    <li>• <strong>Learning History:</strong> Timestamps, repetitions, decay rates</li>
                    <li>• <strong>Preferences:</strong> How you like to learn</li>
                  </ul>
                </div>

                <div className="p-6 rounded-xl border border-purple-500/20 bg-purple-500/5">
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-purple-500" />
                    Graph B: The Knowledge Model
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    This graph represents your curriculum—the knowledge domain you're learning, with all its internal structure.
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• <strong>Concept Nodes:</strong> Individual things you can learn</li>
                    <li>• <strong>Prerequisite Edges:</strong> What comes before what</li>
                    <li>• <strong>Bloom's Levels:</strong> Remember → Understand → Apply → Analyze → Evaluate → Create</li>
                    <li>• <strong>Difficulty Ratings:</strong> How hard each concept is</li>
                    <li>• <strong>Scaffolding Strategies:</strong> Best ways to teach each concept</li>
                  </ul>
                </div>
              </div>

              <div className="p-6 rounded-xl border border-amber-500/20 bg-amber-500/5">
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-500" />
                  The ZPD Bridge: Where Magic Happens
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  The ZPD Bridge computes the intersection of both graphs—what you're ready to learn (from Graph B) given who you are (from Graph A).
                </p>
                <p className="text-sm text-muted-foreground">
                  When you ask "What should I learn next?", LearnGraph doesn't just check prerequisites. It considers your psychological readiness, your anxiety levels, your learning style, your recent forgetting patterns, and your metacognitive abilities. The result is recommendations that are genuinely achievable and optimized for <em>you</em>.
                </p>
              </div>
            </div>
          </Section>

          {/* KNOWLEDGE GAP DETECTION - CORE FEATURE */}
          <Section id="gap-detection" title="Knowledge Gap Detection: The Heart of LearnGraph" icon={Search} badge="CORE FEATURE">
            <div className="space-y-6">
              <div className="p-6 rounded-xl bg-gradient-to-br from-red-500/5 to-orange-500/5 border border-red-500/20">
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Every learner has gaps—concepts they never learned, things they half-understand, knowledge they've forgotten, and mental models that are subtly wrong. <strong>Traditional education is terrible at finding these gaps.</strong> You only discover them when you fail a test or hit a wall trying to learn something new.
                </p>
                <p className="text-lg text-foreground font-medium mt-4">
                  LearnGraph changes this. It continuously, proactively hunts for gaps before they become problems.
                </p>
              </div>

              <h3 className="text-xl font-semibold mt-8 mb-4">The Four Types of Knowledge Gaps</h3>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 rounded-xl border border-border/50 bg-card/50">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                      <XCircle className="w-5 h-5 text-red-500" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Missing Gaps</h4>
                      <p className="text-xs text-muted-foreground">Never learned at all</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    You've never been exposed to this concept, but you need it as a prerequisite for something you're trying to learn.
                  </p>
                  <div className="p-3 rounded-lg bg-muted/30">
                    <p className="text-xs font-medium mb-1">Example:</p>
                    <p className="text-xs text-muted-foreground">Trying to learn calculus but never learned algebra. LearnGraph detects this immediately and builds a remediation path.</p>
                  </div>
                  <div className="mt-3 p-2 rounded-lg bg-red-500/5 border border-red-500/10">
                    <p className="text-xs font-medium text-red-500">Action: Full teaching sequence required</p>
                  </div>
                </div>

                <div className="p-6 rounded-xl border border-border/50 bg-card/50">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                      <Meh className="w-5 h-5 text-amber-500" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Partial Gaps</h4>
                      <p className="text-xs text-muted-foreground">Started but not mastered</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    You've studied this concept but haven't reached mastery. Your knowledge is incomplete or shaky.
                  </p>
                  <div className="p-3 rounded-lg bg-muted/30">
                    <p className="text-xs font-medium mb-1">Example:</p>
                    <p className="text-xs text-muted-foreground">You understand fractions conceptually but struggle when denominators are different. LearnGraph tracks exactly where your understanding breaks down.</p>
                  </div>
                  <div className="mt-3 p-2 rounded-lg bg-amber-500/5 border border-amber-500/10">
                    <p className="text-xs font-medium text-amber-500">Action: Targeted reinforcement of weak areas</p>
                  </div>
                </div>

                <div className="p-6 rounded-xl border border-border/50 bg-card/50">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Forgotten Gaps</h4>
                      <p className="text-xs text-muted-foreground">Knew it, lost it</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    You once had this mastered, but memory has decayed over time. This is the most common and most invisible type of gap.
                  </p>
                  <div className="p-3 rounded-lg bg-muted/30">
                    <p className="text-xs font-medium mb-1">Example:</p>
                    <p className="text-xs text-muted-foreground">You learned quadratic equations last year and got an A. But without practice, your retention has dropped to 40%. LearnGraph's forgetting curve model detected this.</p>
                  </div>
                  <div className="mt-3 p-2 rounded-lg bg-blue-500/5 border border-blue-500/10">
                    <p className="text-xs font-medium text-blue-500">Action: Quick refresh review, not full reteaching</p>
                  </div>
                </div>

                <div className="p-6 rounded-xl border border-border/50 bg-card/50">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                      <AlertTriangle className="w-5 h-5 text-purple-500" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Misconception Gaps</h4>
                      <p className="text-xs text-muted-foreground">Wrong mental model</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    The most dangerous type. You <em>think</em> you understand, but your mental model is incorrect. This leads to systematic errors.
                  </p>
                  <div className="p-3 rounded-lg bg-muted/30">
                    <p className="text-xs font-medium mb-1">Example:</p>
                    <p className="text-xs text-muted-foreground">You believe you can "move" terms in an equation. Actually, you perform inverse operations. This misconception causes errors in more advanced math.</p>
                  </div>
                  <div className="mt-3 p-2 rounded-lg bg-purple-500/5 border border-purple-500/10">
                    <p className="text-xs font-medium text-purple-500">Action: Targeted correction with counterexamples</p>
                  </div>
                </div>
              </div>

              <CodeBlock title="Gap Detection Engine">{`┌───────────────────────────────────────────────────────────────────────────┐
│                        GAP DETECTION ENGINE                                │
│                                                                           │
│   For each concept in the knowledge graph:                                │
│                                                                           │
│   1. Check if MISSING                                                     │
│      └─ Is mastery = 0 AND concept is prerequisite for current goals?     │
│         → Flag as MISSING gap, priority = HIGH                            │
│                                                                           │
│   2. Check if PARTIAL                                                     │
│      └─ Is mastery > 0 but < 70%?                                        │
│         → Flag as PARTIAL gap, priority based on prerequisite depth       │
│                                                                           │
│   3. Check if FORGOTTEN                                                   │
│      └─ Was mastery ≥ 70% but predicted retention now < 60%?             │
│         → Flag as FORGOTTEN gap, calculate decay rate                     │
│         → Schedule for review before critical threshold                   │
│                                                                           │
│   4. Check for MISCONCEPTION                                              │
│      └─ Has learner:misconception:{conceptId} entries?                    │
│         → Flag for targeted correction                                    │
│         → Include counterexample teaching strategies                      │
│                                                                           │
│   Output: Prioritized gap list with remediation strategies                │
└───────────────────────────────────────────────────────────────────────────┘`}</CodeBlock>

              <div className="p-6 rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20">
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-green-500" />
                  Why This Matters
                </h3>
                <p className="text-muted-foreground mb-4">
                  Traditional education discovers gaps reactively—you fail a test, struggle with new material, or lose confidence. By then, the damage is done: you've built shaky foundations, developed misconceptions, and potentially lost motivation.
                </p>
                <p className="text-muted-foreground">
                  <strong>LearnGraph is proactive.</strong> It continuously scans for gaps, predicts when you'll forget things, and intervenes before problems compound. It's the difference between a doctor who only sees you when you're sick versus one who catches problems early through regular checkups.
                </p>
              </div>
            </div>
          </Section>

          {/* ZPD - ZONE OF PROXIMAL DEVELOPMENT */}
          <Section id="zpd" title="Zone of Proximal Development: The Science of 'Just Right'" icon={Target}>
            <div className="space-y-6">
              <p className="text-lg text-muted-foreground leading-relaxed">
                In the 1930s, Soviet psychologist Lev Vygotsky discovered something profound: there's a "sweet spot" for learning—concepts that are challenging enough to grow your abilities but not so hard that you give up. He called this the <strong>Zone of Proximal Development</strong>.
              </p>

              <div className="p-6 rounded-xl border border-primary/20 bg-primary/5">
                <p className="text-lg text-foreground font-medium mb-3">
                  "What a learner can do with help today, they can do alone tomorrow."
                </p>
                <p className="text-sm text-muted-foreground">— Lev Vygotsky</p>
              </div>

              <CodeBlock title="Zone Partitioning">{`┌─────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│    ┌───────────────────────────────────────────────────────────────┐    │
│    │                                                               │    │
│    │    ┌─────────────────────────────────────────────────────┐   │    │
│    │    │                                                     │   │    │
│    │    │    ┌───────────────────────────────────────────┐   │   │    │
│    │    │    │                                           │   │   │    │
│    │    │    │     MASTERED CONCEPTS                     │   │   │    │
│    │    │    │     (Can do independently)                │   │   │    │
│    │    │    │     "I've got this"                       │   │   │    │
│    │    │    │                                           │   │   │    │
│    │    │    └───────────────────────────────────────────┘   │   │    │
│    │    │                                                     │   │    │
│    │    │         ZONE OF PROXIMAL DEVELOPMENT               │   │    │
│    │    │         (Can learn with support)                   │   │    │
│    │    │         "This is challenging but I can do it"      │   │    │
│    │    │         ← THIS IS WHERE LEARNING HAPPENS           │   │    │
│    │    │                                                     │   │    │
│    │    └─────────────────────────────────────────────────────┘   │    │
│    │                                                               │    │
│    │              STRETCH ZONE                                     │    │
│    │              (Challenging but achievable)                     │    │
│    │              "I need significant help here"                   │    │
│    │                                                               │    │
│    └───────────────────────────────────────────────────────────────┘    │
│                                                                          │
│                    FRUSTRATION ZONE                                      │
│                    (Missing prerequisites)                               │
│                    "I have no idea what's going on"                      │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘`}</CodeBlock>

              <h3 className="text-xl font-semibold mt-8 mb-4">How LearnGraph Computes Your ZPD</h3>

              <div className="space-y-4">
                <div className="p-4 rounded-lg border border-border/50 bg-card/50">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-primary/20 text-primary text-sm flex items-center justify-center font-semibold">1</div>
                    <h4 className="font-semibold">Load Your Learner Profile</h4>
                  </div>
                  <p className="text-sm text-muted-foreground ml-11">
                    All 39 psychometric dimensions are retrieved—your anxiety levels, learning preferences, cognitive style, risk tolerance, and more.
                  </p>
                </div>

                <div className="p-4 rounded-lg border border-border/50 bg-card/50">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-primary/20 text-primary text-sm flex items-center justify-center font-semibold">2</div>
                    <h4 className="font-semibold">Scan Your Knowledge State</h4>
                  </div>
                  <p className="text-sm text-muted-foreground ml-11">
                    For every concept in the curriculum, check your mastery level, last access time, and predicted retention.
                  </p>
                </div>

                <div className="p-4 rounded-lg border border-border/50 bg-card/50">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-primary/20 text-primary text-sm flex items-center justify-center font-semibold">3</div>
                    <h4 className="font-semibold">Calculate Prerequisite Readiness</h4>
                  </div>
                  <p className="text-sm text-muted-foreground ml-11">
                    For each unmastered concept, calculate what percentage of its prerequisites you've completed. This gives a raw "readiness score."
                  </p>
                </div>

                <div className="p-4 rounded-lg border border-border/50 bg-card/50">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-primary/20 text-primary text-sm flex items-center justify-center font-semibold">4</div>
                    <h4 className="font-semibold">Apply Psychometric Adjustments</h4>
                  </div>
                  <p className="text-sm text-muted-foreground ml-11">
                    Modify readiness based on your psychological profile. High anxiety? We lower readiness thresholds for difficult concepts. High openness? Abstract concepts get a readiness boost.
                  </p>
                  <div className="mt-3 ml-11">
                    <Table
                      headers={['If You Are...', 'Effect on Recommendations']}
                      rows={[
                        ['High anxiety (neuroticism)', 'More cautious progression, gentler challenges'],
                        ['High openness', 'Faster access to abstract/novel concepts'],
                        ['High conscientiousness', 'Longer learning paths are acceptable'],
                        ['Low risk tolerance', 'Prefer well-structured, proven concepts first'],
                        ['Visual learner', 'Prioritize concepts with diagram support'],
                      ]}
                    />
                  </div>
                </div>

                <div className="p-4 rounded-lg border border-border/50 bg-card/50">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-primary/20 text-primary text-sm flex items-center justify-center font-semibold">5</div>
                    <h4 className="font-semibold">Partition Into Zones</h4>
                  </div>
                  <p className="text-sm text-muted-foreground ml-11">
                    Concepts are sorted into zones based on adjusted readiness: Mastered (0.8+), ZPD (0.5-0.8), Stretch (0.3-0.5), Too Hard (&lt;0.3)
                  </p>
                </div>

                <div className="p-4 rounded-lg border border-green-500/50 bg-green-500/5">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-green-500/20 text-green-500 text-sm flex items-center justify-center font-semibold">6</div>
                    <h4 className="font-semibold text-green-600">Return Optimal Learning Targets</h4>
                  </div>
                  <p className="text-sm text-muted-foreground ml-11">
                    The ZPD concepts are your sweet spot—challenging enough to learn, achievable enough to succeed. These are what LearnGraph recommends when you ask "What should I learn next?"
                  </p>
                </div>
              </div>

              <div className="p-6 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 mt-8">
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-amber-500" />
                  Why This is Revolutionary
                </h3>
                <p className="text-muted-foreground mb-4">
                  Most learning platforms recommend content based on what's "next" in a fixed sequence, or what's popular, or what the algorithm thinks might engage you. They don't actually know if you're <em>ready</em>.
                </p>
                <p className="text-muted-foreground">
                  LearnGraph's ZPD engine ensures you're never bored (too easy) or overwhelmed (too hard). Every recommendation is personalized to your exact knowledge state AND your psychological profile. You stay in flow state—that magical zone where learning feels engaging rather than frustrating.
                </p>
              </div>
            </div>
          </Section>

          {/* 39 PSYCHOLOGICAL DOMAINS */}
          <Section id="domains" title="39 Psychological Domains: Understanding The Whole Learner" icon={Brain}>
            <div className="space-y-6">
              <p className="text-lg text-muted-foreground leading-relaxed">
                Every learner is different. Not just in what they know, but in <em>how they think</em>, <em>how they feel about learning</em>, <em>how they process information</em>, and <em>what motivates them</em>. LearnGraph captures this through 39 research-backed psychological dimensions.
              </p>

              <div className="p-6 rounded-xl border border-primary/20 bg-primary/5">
                <h3 className="font-semibold text-lg mb-3">Why Track 39 Dimensions?</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                  <div>
                    <p className="mb-2">
                      <strong>Personalized Teaching Strategies:</strong> A visual learner with high anxiety needs diagrams presented gently. An analytical learner with high confidence can handle abstract proofs directly.
                    </p>
                    <p>
                      <strong>Accurate Readiness Assessment:</strong> Your openness to new ideas affects how quickly you can tackle abstract concepts. Your conscientiousness affects whether you can stick with long learning paths.
                    </p>
                  </div>
                  <div>
                    <p className="mb-2">
                      <strong>Better Scaffolding Selection:</strong> High extraversion? You'll benefit from peer discussion scaffolds. Low working memory? Content should be chunked into smaller pieces.
                    </p>
                    <p>
                      <strong>Emotional Awareness:</strong> Learning isn't purely cognitive. Stress, motivation, self-efficacy—these affect learning outcomes dramatically.
                    </p>
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-semibold mt-8 mb-4">The 8 Categories</h3>

              <div className="space-y-6">
                {/* Category A */}
                <div className="p-5 rounded-xl border border-indigo-500/20 bg-indigo-500/5">
                  <h4 className="font-semibold text-lg text-indigo-500 mb-3">A. Core Personality (Big Five)</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    The gold standard in personality psychology. These five traits predict everything from academic success to learning preferences.
                  </p>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs">
                    <div className="p-2 rounded bg-background/50"><code>big_five_openness</code> — Curiosity, creativity, abstract thinking</div>
                    <div className="p-2 rounded bg-background/50"><code>big_five_conscientiousness</code> — Self-discipline, persistence</div>
                    <div className="p-2 rounded bg-background/50"><code>big_five_extraversion</code> — Solo vs. social learning</div>
                    <div className="p-2 rounded bg-background/50"><code>big_five_agreeableness</code> — Response to feedback</div>
                    <div className="p-2 rounded bg-background/50"><code>big_five_neuroticism</code> — Anxiety, stress response</div>
                  </div>
                </div>

                {/* Category B */}
                <div className="p-5 rounded-xl border border-purple-500/20 bg-purple-500/5">
                  <h4 className="font-semibold text-lg text-purple-500 mb-3">B. Dark Personality (SD3)</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Not "evil" traits—just traits that affect competitive learning and risk-taking.
                  </p>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs">
                    <div className="p-2 rounded bg-background/50"><code>dark_triad_narcissism</code> — Recognition needs</div>
                    <div className="p-2 rounded bg-background/50"><code>dark_triad_machiavellianism</code> — Strategic thinking</div>
                    <div className="p-2 rounded bg-background/50"><code>dark_triad_psychopathy</code> — Risk tolerance</div>
                  </div>
                </div>

                {/* Category C */}
                <div className="p-5 rounded-xl border border-pink-500/20 bg-pink-500/5">
                  <h4 className="font-semibold text-lg text-pink-500 mb-3">C. Emotional/Social Intelligence</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    How you relate to others and regulate your emotions during learning.
                  </p>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs">
                    <div className="p-2 rounded bg-background/50"><code>emotional_empathy</code> — Peer learning</div>
                    <div className="p-2 rounded bg-background/50"><code>emotional_intelligence</code> — Self-regulation</div>
                    <div className="p-2 rounded bg-background/50"><code>attachment_style</code> — Trust in relationships</div>
                    <div className="p-2 rounded bg-background/50"><code>love_languages</code> — Feedback preferences</div>
                    <div className="p-2 rounded bg-background/50"><code>communication_style</code> — DISC profile</div>
                  </div>
                </div>

                {/* Category D */}
                <div className="p-5 rounded-xl border border-orange-500/20 bg-orange-500/5">
                  <h4 className="font-semibold text-lg text-orange-500 mb-3">D. Decision Making & Motivation</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    What drives you and how you make choices about learning.
                  </p>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs">
                    <div className="p-2 rounded bg-background/50"><code>risk_tolerance</code> — New approaches</div>
                    <div className="p-2 rounded bg-background/50"><code>decision_style</code> — Rational vs. intuitive</div>
                    <div className="p-2 rounded bg-background/50"><code>time_orientation</code> — Past/present/future</div>
                    <div className="p-2 rounded bg-background/50"><code>achievement_motivation</code> — Goal-setting</div>
                    <div className="p-2 rounded bg-background/50"><code>self_efficacy</code> — Belief in capabilities</div>
                    <div className="p-2 rounded bg-background/50"><code>locus_of_control</code> — Internal vs. external</div>
                    <div className="p-2 rounded bg-background/50"><code>growth_mindset</code> — Fixed vs. growth</div>
                  </div>
                </div>

                {/* Category E */}
                <div className="p-5 rounded-xl border border-green-500/20 bg-green-500/5">
                  <h4 className="font-semibold text-lg text-green-500 mb-3">E. Values & Wellbeing</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Your values affect what content resonates and how you handle challenges.
                  </p>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs">
                    <div className="p-2 rounded bg-background/50"><code>personal_values</code> — Schwartz PVQ</div>
                    <div className="p-2 rounded bg-background/50"><code>interests</code> — RIASEC profile</div>
                    <div className="p-2 rounded bg-background/50"><code>life_satisfaction</code> — Engagement capacity</div>
                    <div className="p-2 rounded bg-background/50"><code>stress_coping</code> — Challenge response</div>
                    <div className="p-2 rounded bg-background/50"><code>social_support</code> — Support network</div>
                    <div className="p-2 rounded bg-background/50"><code>authenticity</code> — True self alignment</div>
                  </div>
                </div>

                {/* Category F */}
                <div className="p-5 rounded-xl border border-blue-500/20 bg-blue-500/5">
                  <h4 className="font-semibold text-lg text-blue-500 mb-3">F. Cognitive/Learning Styles</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    How you actually process and retain information.
                  </p>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs">
                    <div className="p-2 rounded bg-background/50"><code>cognitive_abilities</code> — Verbal/numerical/spatial</div>
                    <div className="p-2 rounded bg-background/50"><code>creativity</code> — Divergent thinking</div>
                    <div className="p-2 rounded bg-background/50"><code>learning_styles</code> — VARK model</div>
                    <div className="p-2 rounded bg-background/50"><code>information_processing</code> — Deep vs. shallow</div>
                    <div className="p-2 rounded bg-background/50"><code>metacognition</code> — Thinking about thinking</div>
                    <div className="p-2 rounded bg-background/50"><code>executive_functions</code> — Planning, flexibility</div>
                  </div>
                </div>

                {/* Category G */}
                <div className="p-5 rounded-xl border border-teal-500/20 bg-teal-500/5">
                  <h4 className="font-semibold text-lg text-teal-500 mb-3">G. Social/Cultural Values</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Cultural context affects how you learn and what examples resonate.
                  </p>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs">
                    <div className="p-2 rounded bg-background/50"><code>social_cognition</code> — Theory of mind</div>
                    <div className="p-2 rounded bg-background/50"><code>political_ideology</code> — Worldview</div>
                    <div className="p-2 rounded bg-background/50"><code>cultural_values</code> — Hofstede dimensions</div>
                    <div className="p-2 rounded bg-background/50"><code>moral_reasoning</code> — MFQ profile</div>
                    <div className="p-2 rounded bg-background/50"><code>work_career_style</code> — Career anchors</div>
                  </div>
                </div>

                {/* Category H */}
                <div className="p-5 rounded-xl border border-amber-500/20 bg-amber-500/5">
                  <h4 className="font-semibold text-lg text-amber-500 mb-3">H. Sensory/Aesthetic</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    How you respond to stimulation and presentation affects content delivery.
                  </p>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs">
                    <div className="p-2 rounded bg-background/50"><code>sensory_processing</code> — HSP sensitivity</div>
                    <div className="p-2 rounded bg-background/50"><code>aesthetic_preferences</code> — Design preferences</div>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-xl bg-gradient-to-r from-primary/10 to-purple-500/10 border border-primary/20 mt-8">
                <h3 className="font-semibold text-lg mb-3">How LearnGraph Uses This Data</h3>
                <p className="text-muted-foreground mb-4">
                  Every time LearnGraph makes a recommendation or generates context for an AI tutor, it considers relevant psychological dimensions:
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <span><strong>High neuroticism + difficult concept</strong> → Lower readiness score, recommend easier prerequisite first</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <span><strong>Visual learner + abstract concept</strong> → Add VISUAL_REPRESENTATION scaffolding strategy</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <span><strong>Low self-efficacy</strong> → Include WORKED_EXAMPLES and gentle encouragement in AI context</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <span><strong>High extraversion</strong> → Recommend PEER_DISCUSSION and COLLABORATIVE activities</span>
                  </li>
                </ul>
              </div>
            </div>
          </Section>

          {/* SCAFFOLDING STRATEGIES */}
          <Section id="scaffolding" title="Personalized Scaffolding: Teaching You The Way You Learn" icon={Puzzle}>
            <div className="space-y-6">
              <p className="text-lg text-muted-foreground leading-relaxed">
                A brilliant explanation that works for one learner might completely confuse another. LearnGraph doesn't just tell you <em>what</em> to learn—it customizes <em>how</em> you'll learn it based on your psychological profile.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 rounded-xl border border-border/50 bg-card/50">
                  <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <Brain className="w-5 h-5 text-indigo-500" />
                    Cognitive Scaffolds
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">Help you process and understand new information.</p>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-start gap-2">
                      <code className="text-xs bg-muted px-1.5 py-0.5 rounded shrink-0">CHUNKING</code>
                      <span className="text-muted-foreground">Break content into smaller, digestible pieces (for low working memory)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <code className="text-xs bg-muted px-1.5 py-0.5 rounded shrink-0">ANALOGY</code>
                      <span className="text-muted-foreground">Connect new concepts to things you already know</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <code className="text-xs bg-muted px-1.5 py-0.5 rounded shrink-0">VISUAL_REPRESENTATION</code>
                      <span className="text-muted-foreground">Diagrams, charts, concept maps (for visual learners)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <code className="text-xs bg-muted px-1.5 py-0.5 rounded shrink-0">WORKED_EXAMPLES</code>
                      <span className="text-muted-foreground">Step-by-step demonstrations (for beginners)</span>
                    </li>
                  </ul>
                </div>

                <div className="p-6 rounded-xl border border-border/50 bg-card/50">
                  <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-amber-500" />
                    Metacognitive Scaffolds
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">Help you think about your own learning.</p>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-start gap-2">
                      <code className="text-xs bg-muted px-1.5 py-0.5 rounded shrink-0">SELF_EXPLANATION</code>
                      <span className="text-muted-foreground">Prompt you to explain your reasoning (builds understanding)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <code className="text-xs bg-muted px-1.5 py-0.5 rounded shrink-0">PREDICTION</code>
                      <span className="text-muted-foreground">"What do you think happens next?" (builds engagement)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <code className="text-xs bg-muted px-1.5 py-0.5 rounded shrink-0">REFLECTION</code>
                      <span className="text-muted-foreground">"What did you learn?" (consolidates knowledge)</span>
                    </li>
                  </ul>
                </div>

                <div className="p-6 rounded-xl border border-border/50 bg-card/50">
                  <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <ClipboardList className="w-5 h-5 text-emerald-500" />
                    Procedural Scaffolds
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">Provide structure for how to approach learning.</p>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-start gap-2">
                      <code className="text-xs bg-muted px-1.5 py-0.5 rounded shrink-0">CHECKLIST</code>
                      <span className="text-muted-foreground">Step-by-step guides (for high conscientiousness)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <code className="text-xs bg-muted px-1.5 py-0.5 rounded shrink-0">TEMPLATE</code>
                      <span className="text-muted-foreground">Fill-in-the-blank frameworks (for structure-seekers)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <code className="text-xs bg-muted px-1.5 py-0.5 rounded shrink-0">HINTS</code>
                      <span className="text-muted-foreground">Progressive hints revealed one at a time</span>
                    </li>
                  </ul>
                </div>

                <div className="p-6 rounded-xl border border-border/50 bg-card/50">
                  <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-pink-500" />
                    Social Scaffolds
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">Leverage social interaction for learning.</p>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-start gap-2">
                      <code className="text-xs bg-muted px-1.5 py-0.5 rounded shrink-0">PEER_DISCUSSION</code>
                      <span className="text-muted-foreground">Discussion prompts (for extraverts)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <code className="text-xs bg-muted px-1.5 py-0.5 rounded shrink-0">EXPERT_MODELING</code>
                      <span className="text-muted-foreground">Watch expert demonstrations</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <code className="text-xs bg-muted px-1.5 py-0.5 rounded shrink-0">COLLABORATIVE</code>
                      <span className="text-muted-foreground">Pair/group activities</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="p-6 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
                <h3 className="font-semibold text-lg mb-3">Automatic Scaffolding Selection</h3>
                <p className="text-muted-foreground text-sm">
                  When LearnGraph generates a learning recommendation or RAG context, it automatically includes appropriate scaffolding strategies based on your profile. For example, if you're a visual learner with low confidence approaching a difficult concept, the AI tutor receives: "Use VISUAL_REPRESENTATION and WORKED_EXAMPLES scaffolds. Present gently with encouragement."
                </p>
              </div>
            </div>
          </Section>

          {/* FIGHTING FORGETTING */}
          <Section id="forgetting" title="Fighting Forgetting: The Science of Retention" icon={Clock}>
            <div className="space-y-6">
              <p className="text-lg text-muted-foreground leading-relaxed">
                In 1885, German psychologist Hermann Ebbinghaus discovered something that explains why you forget 80% of what you learn within a month. His "forgetting curve" shows that memory decays exponentially—but <em>can be reset with strategic reviews</em>.
              </p>

              <CodeBlock title="The Forgetting Curve (Ebbinghaus)">{`100% ┤████████████████████████████████████████████████████████████
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

     ↑ Review HERE maintains 90% retention`}</CodeBlock>

              <div className="p-6 rounded-xl border border-primary/20 bg-primary/5">
                <h3 className="font-semibold text-lg mb-3">The Formula</h3>
                <code className="text-lg block mb-3">Retention = e^(-t/S) × 100%</code>
                <p className="text-sm text-muted-foreground">
                  Where <strong>t</strong> = days since last review, and <strong>S</strong> = stability (increases with each successful review and with mastery level).
                </p>
              </div>

              <h3 className="text-xl font-semibold mt-8 mb-4">Spaced Repetition: The SM-2 Algorithm</h3>

              <p className="text-muted-foreground mb-4">
                LearnGraph uses the SM-2 algorithm (the same algorithm behind Anki) to schedule reviews at precisely the right time—just before you forget.
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
│   Interval GROWS exponentially with successful reviews                 │
│   Interval RESETS to short interval if you forget                      │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘`}</CodeBlock>

              <div className="p-6 rounded-xl bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20">
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-blue-500" />
                  Why This Matters
                </h3>
                <p className="text-muted-foreground mb-4">
                  Without spaced repetition, you spend most of your time relearning things you've forgotten. Studies show spaced repetition can <strong>reduce learning time by up to 50%</strong> while improving long-term retention by up to 200%.
                </p>
                <p className="text-muted-foreground">
                  LearnGraph automatically calculates when you're about to forget each concept and adds it to your review queue. You don't have to manage flashcard decks or remember to review—the system handles it all.
                </p>
              </div>
            </div>
          </Section>

          {/* COMPARISON TABLE */}
          <Section id="comparison" title="Traditional Assessment vs. LearnGraph" icon={Scale}>
            <div className="space-y-6">
              <p className="text-lg text-muted-foreground leading-relaxed">
                Traditional education and LearnGraph represent fundamentally different philosophies about how learning should work.
              </p>

              <Table
                headers={['Aspect', 'Traditional', 'LearnGraph']}
                rows={[
                  [
                    <strong key="1">When gaps are discovered</strong>,
                    'After you fail a test',
                    'Continuously, before they become problems'
                  ],
                  [
                    <strong key="2">Forgetting</strong>,
                    'Ignored—re-learn when needed',
                    'Predicted and prevented with spaced repetition'
                  ],
                  [
                    <strong key="3">Personalization</strong>,
                    'Same pace, style, sequence for everyone',
                    'Unique to your psychology and knowledge state'
                  ],
                  [
                    <strong key="4">Difficulty calibration</strong>,
                    'Fixed curriculum sequence',
                    'Dynamic ZPD—always in your learning sweet spot'
                  ],
                  [
                    <strong key="5">Teaching approach</strong>,
                    'One style fits all',
                    'Scaffolding selected based on how you learn'
                  ],
                  [
                    <strong key="6">Misconception handling</strong>,
                    'Discovered through wrong answers',
                    'Tracked and targeted for correction'
                  ],
                  [
                    <strong key="7">Privacy</strong>,
                    'Your data on their servers',
                    '100% on-device, never leaves your browser'
                  ],
                  [
                    <strong key="8">Learning analytics</strong>,
                    'Class averages, simple completion rates',
                    '39 psychological dimensions + knowledge graph'
                  ],
                  [
                    <strong key="9">AI tutoring</strong>,
                    'Generic responses',
                    'Rich context about YOU for every interaction'
                  ],
                  [
                    <strong key="10">Flexibility</strong>,
                    'Fixed curriculum structure',
                    'Any knowledge domain, any structure'
                  ],
                ]}
              />

              <div className="p-6 rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20">
                <h3 className="font-semibold text-lg mb-3">The Bottom Line</h3>
                <p className="text-muted-foreground">
                  Traditional systems treat learners as passive recipients of a fixed curriculum. LearnGraph treats you as a unique individual with specific needs, preferences, and a continuously evolving knowledge state. It's the difference between mass production and personalized craftsmanship.
                </p>
              </div>
            </div>
          </Section>

          {/* WHO BENEFITS */}
          <Section id="who-benefits" title="Who Benefits From LearnGraph?" icon={Users}>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 rounded-xl border border-border/50 bg-card/50">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-4">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Self-Directed Learners</h3>
                <p className="text-sm text-muted-foreground">
                  Finally, an AI tutor that actually understands you. Stop getting generic advice and start getting recommendations based on your real knowledge state and learning style.
                </p>
              </div>

              <div className="p-6 rounded-xl border border-border/50 bg-card/50">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Teachers & Tutors</h3>
                <p className="text-sm text-muted-foreground">
                  Use LearnGraph to track individual students, identify gaps before they become problems, and get recommendations for how to teach each student effectively.
                </p>
              </div>

              <div className="p-6 rounded-xl border border-border/50 bg-card/50">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mb-4">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-lg mb-2">AI Application Builders</h3>
                <p className="text-sm text-muted-foreground">
                  Building an AI tutor or learning assistant? LearnGraph provides the personalization layer you need. Use our RAG context API to make any LLM dramatically smarter about your users.
                </p>
              </div>

              <div className="p-6 rounded-xl border border-border/50 bg-card/50">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center mb-4">
                  <Database className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Curriculum Designers</h3>
                <p className="text-sm text-muted-foreground">
                  Model any knowledge domain as a prerequisite graph. Use LearnGraph's gap analysis to see where learners struggle, and optimize your curriculum based on real data.
                </p>
              </div>
            </div>
          </Section>

          {/* MAGIC MOMENTS */}
          <Section id="magic-moments" title="Magic Moments: When LearnGraph Shines" icon={Sparkles}>
            <div className="space-y-4">
              <div className="p-5 rounded-xl border border-border/50 bg-card/50">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shrink-0">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">"How did it know I'd struggle with that?"</h3>
                    <p className="text-sm text-muted-foreground">
                      LearnGraph predicted you'd find this concept difficult based on your anxiety levels and the abstract nature of the material—and recommended an easier prerequisite first.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-xl border border-border/50 bg-card/50">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">"I would have completely forgotten that!"</h3>
                    <p className="text-sm text-muted-foreground">
                      LearnGraph's forgetting curve model predicted you'd drop below 60% retention tomorrow and scheduled a quick review today.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-xl border border-border/50 bg-card/50">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center shrink-0">
                    <Heart className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">"This explanation actually makes sense to me!"</h3>
                    <p className="text-sm text-muted-foreground">
                      Based on your visual learning style and preference for analogies, LearnGraph told the AI tutor to use diagrams and connect to real-world examples you'd understand.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-xl border border-border/50 bg-card/50">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">"I didn't even know I had that misconception!"</h3>
                    <p className="text-sm text-muted-foreground">
                      LearnGraph detected a pattern in your errors that revealed a subtle mental model problem—and provided targeted correction with counterexamples.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-xl border border-border/50 bg-card/50">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shrink-0">
                    <Route className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">"The path to my goal is actually achievable!"</h3>
                    <p className="text-sm text-muted-foreground">
                      Instead of an overwhelming 50-concept curriculum, LearnGraph showed you the 12 concepts you actually need—you already know the prerequisites for the rest.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Section>

          {/* QUICK TEST - MOVED DOWN */}
          <Section id="quick-test" title="Try It Yourself: 5-Minute Demo" icon={Play}>
            <p className="text-muted-foreground mb-6">
              See LearnGraph in action. After starting the app, run these commands:
            </p>

            <div className="space-y-4">
              <div className="p-4 rounded-lg border border-border/50 bg-card/50">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-sm flex items-center justify-center">1</span>
                  Create Your Learner Profile
                </h4>
                <CodeBlock>{`curl -X POST http://localhost:3000/api/learners \\
  -H "Content-Type: application/json" \\
  -d '{"name": "Your Name", "email": "you@example.com"}'`}</CodeBlock>
                <p className="text-xs text-muted-foreground">Save the <code className="bg-muted px-1 rounded">userId</code> from the response.</p>
              </div>

              <div className="p-4 rounded-lg border border-border/50 bg-card/50">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-sm flex items-center justify-center">2</span>
                  Load Sample Curriculum
                </h4>
                <CodeBlock>{`curl -X POST http://localhost:3000/api/seed-concepts`}</CodeBlock>
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

              <div className="p-4 rounded-lg border border-green-500/50 bg-green-500/5">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-green-500/20 text-green-500 text-sm flex items-center justify-center">4</span>
                  Ask "What Should I Learn Next?"
                </h4>
                <CodeBlock>{`curl "http://localhost:3000/api/zpd?userId=YOUR_USER_ID"`}</CodeBlock>
                <p className="text-xs text-green-500">→ Returns concepts in your Zone of Proximal Development</p>
              </div>

              <div className="p-4 rounded-lg border border-amber-500/50 bg-amber-500/5">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-500 text-sm flex items-center justify-center">5</span>
                  Check for Knowledge Gaps
                </h4>
                <CodeBlock>{`curl "http://localhost:3000/api/gaps?userId=YOUR_USER_ID"`}</CodeBlock>
                <p className="text-xs text-amber-500">→ Returns missing, partial, forgotten, and misconception gaps</p>
              </div>

              <div className="p-4 rounded-lg border border-blue-500/50 bg-blue-500/5">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-500 text-sm flex items-center justify-center">6</span>
                  See It Visually
                </h4>
                <p className="text-sm text-muted-foreground">
                  Open <code className="bg-muted px-1 rounded">http://localhost:3000/graph</code> to see the knowledge graph with your mastery levels overlaid.
                </p>
              </div>
            </div>
          </Section>

          {/* TECHNICAL DEEP DIVE */}
          <Section id="technical" title="Technical Deep Dive" icon={Code}>
            <div className="space-y-6">
              {/* Custom Graph Database Layer */}
              <div className="p-6 rounded-xl bg-gradient-to-br from-indigo-500/5 to-purple-500/5 border border-indigo-500/20">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Database className="w-5 h-5 text-indigo-500" />
                  Custom Dual-Graph Database Layer
                </h3>
                <p className="text-muted-foreground mb-4">
                  LearnGraph doesn't use an off-the-shelf graph database. Instead, it implements a <strong>custom dual-graph database layer</strong> built on top of LevelDB—a high-performance embedded key-value store. This gives us complete control over the data model while maintaining sub-millisecond performance.
                </p>
                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div className="p-3 rounded-lg bg-card/50 border border-border/50 text-center">
                    <p className="text-2xl font-bold text-primary">2,046</p>
                    <p className="text-xs text-muted-foreground">Lines of Code</p>
                    <p className="text-xs text-muted-foreground/70">EducationGraphDB class</p>
                  </div>
                  <div className="p-3 rounded-lg bg-card/50 border border-border/50 text-center">
                    <p className="text-2xl font-bold text-emerald-500">0.02ms</p>
                    <p className="text-xs text-muted-foreground">Read Latency</p>
                    <p className="text-xs text-muted-foreground/70">Average operation</p>
                  </div>
                  <div className="p-3 rounded-lg bg-card/50 border border-border/50 text-center">
                    <p className="text-2xl font-bold text-amber-500">0.10ms</p>
                    <p className="text-xs text-muted-foreground">Write Latency</p>
                    <p className="text-xs text-muted-foreground/70">Average operation</p>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground space-y-2">
                  <p><strong>Why custom?</strong> Off-the-shelf graph databases are designed for networked, multi-user scenarios. LearnGraph needs something different: a local, embedded, zero-configuration graph store that runs entirely in the browser's Node.js runtime.</p>
                </div>
              </div>

              {/* Key Components */}
              <h3 className="text-xl font-semibold mt-8">Graph Database Components</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg border border-border/50 bg-card/50">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-indigo-500" />
                    Key Prefix Schema
                  </h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Two logical graphs stored in one LevelDB instance using prefixed keys:
                  </p>
                  <ul className="text-xs text-muted-foreground space-y-1 font-mono">
                    <li>• <span className="text-indigo-400">learner:*</span> → Graph A nodes</li>
                    <li>• <span className="text-emerald-400">concept:*</span> → Graph B nodes</li>
                    <li>• <span className="text-purple-400">edge:*</span> → Graph edges</li>
                    <li>• <span className="text-amber-400">state:*</span> → User×Concept states</li>
                    <li>• <span className="text-pink-400">index:*</span> → Secondary indexes</li>
                  </ul>
                </div>
                <div className="p-4 rounded-lg border border-border/50 bg-card/50">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <GitBranch className="w-4 h-4 text-emerald-500" />
                    BFS Graph Traversal
                  </h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Custom breadth-first search for prerequisite chains:
                  </p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• <strong>getPrerequisiteChain()</strong> - What must be learned first</li>
                    <li>• <strong>getDependentChain()</strong> - What depends on this</li>
                    <li>• Cycle detection via visited set</li>
                    <li>• Configurable max depth (default: 5)</li>
                  </ul>
                </div>
                <div className="p-4 rounded-lg border border-border/50 bg-card/50">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Search className="w-4 h-4 text-amber-500" />
                    Secondary Indexes
                  </h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Fast lookups without full table scans:
                  </p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• <strong>index:domain:*</strong> - Concepts by domain</li>
                    <li>• <strong>index:learner-states:*</strong> - User's concepts</li>
                    <li>• Iterator-based prefix scanning</li>
                    <li>• Automatic index maintenance on writes</li>
                  </ul>
                </div>
                <div className="p-4 rounded-lg border border-border/50 bg-card/50">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-pink-500" />
                    Atomic Batch Operations
                  </h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Transactional writes for data integrity:
                  </p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Cascading deletes (learner → all states)</li>
                    <li>• Multi-key atomic updates</li>
                    <li>• Index consistency guarantees</li>
                    <li>• Rollback on failure</li>
                  </ul>
                </div>
              </div>

              <h3 className="text-xl font-semibold mt-8">Data Architecture</h3>
              <CodeBlock title="LevelDB Key Schema">{`┌──────────────────────────────────────────────────────────────────────────┐
│                    CUSTOM GRAPH DATABASE ON LEVELDB                       │
│                                                                          │
│  GRAPH A: LEARNER MODEL                                                  │
│  ───────────────────────                                                 │
│  learner:{userId}                      → LearnerProfile (39 domains)     │
│  state:{userId}:{conceptId}            → KnowledgeState (mastery, etc)   │
│                                                                          │
│  GRAPH B: KNOWLEDGE MODEL                                                │
│  ────────────────────────                                                │
│  concept:{conceptId}                   → ConceptNode (difficulty, Bloom) │
│  edge:prereq:{from}:{to}               → PrerequisiteEdge (strength)     │
│  edge:related:{edgeId}                 → RelatedEdge (bidirectional)     │
│                                                                          │
│  SECONDARY INDEXES                                                       │
│  ─────────────────                                                       │
│  index:domain:{domain}:{conceptId}     → Fast domain lookup              │
│  index:learner-states:{userId}:{cId}   → Learner's touched concepts      │
│                                                                          │
│  PERFORMANCE                                                             │
│  ───────────                                                             │
│  Read: 0.02ms avg    Write: 0.10ms avg    Traversal (depth 5): <100ms   │
└──────────────────────────────────────────────────────────────────────────┘`}</CodeBlock>

              <h3 className="text-xl font-semibold mt-8">API Endpoints</h3>
              <Table
                headers={['Endpoint', 'Method', 'Purpose']}
                rows={[
                  [<code key="1">/api/learners</code>, 'GET, POST', 'List/create learner profiles'],
                  [<code key="2">/api/learners/[id]</code>, 'GET, PUT, DELETE', 'Individual learner CRUD'],
                  [<code key="3">/api/concepts</code>, 'GET, POST', 'List/create concepts'],
                  [<code key="4">/api/prerequisites</code>, 'GET, POST, DELETE', 'Manage prerequisite edges'],
                  [<code key="5">/api/knowledge-state</code>, 'GET, POST', 'Track learner mastery'],
                  [<code key="6">/api/zpd</code>, 'GET', 'Compute Zone of Proximal Development'],
                  [<code key="7">/api/gaps</code>, 'GET', 'Detect knowledge gaps'],
                  [<code key="8">/api/decay</code>, 'GET', 'Predict memory decay'],
                  [<code key="9">/api/review-schedule</code>, 'GET', 'Get spaced repetition schedule'],
                  [<code key="10">/api/remediation</code>, 'GET', 'Generate remediation plans'],
                ]}
              />

              <h3 className="text-xl font-semibold mt-8">Tech Stack</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg border border-border/50 bg-card/50">
                  <h4 className="font-medium mb-2">Frontend</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Next.js 14 (App Router)</li>
                    <li>• React 18</li>
                    <li>• TailwindCSS</li>
                    <li>• Framer Motion</li>
                    <li>• React Flow (graph visualization)</li>
                  </ul>
                </div>
                <div className="p-4 rounded-lg border border-border/50 bg-card/50">
                  <h4 className="font-medium mb-2">Backend</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• <strong>Custom Graph DB</strong> on LevelDB</li>
                    <li>• EducationGraphDB (2,046 LOC)</li>
                    <li>• TypeScript</li>
                    <li>• Next.js API Routes</li>
                    <li>• Zero external services</li>
                  </ul>
                </div>
              </div>
            </div>
          </Section>

          {/* THE BOTTOM LINE */}
          <Section id="bottom-line" title="The Bottom Line" icon={Heart}>
            <div className="space-y-6">
              <div className="p-8 rounded-2xl bg-gradient-to-br from-primary/10 via-purple-500/10 to-pink-500/10 border border-primary/20">
                <p className="text-xl text-foreground font-medium mb-6 text-center">
                  LearnGraph isn't just another educational tool.<br />
                  It's a fundamentally different approach to how AI understands learners.
                </p>

                <div className="grid md:grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center mx-auto mb-3">
                      <Fingerprint className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-semibold mb-1">Deeply Personal</h3>
                    <p className="text-sm text-muted-foreground">39 psychological dimensions create a complete picture of how you learn</p>
                  </div>
                  <div>
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center mx-auto mb-3">
                      <ShieldCheck className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-semibold mb-1">100% Private</h3>
                    <p className="text-sm text-muted-foreground">Your most intimate data never leaves your device</p>
                  </div>
                  <div>
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mx-auto mb-3">
                      <BrainCircuit className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-semibold mb-1">Scientifically Grounded</h3>
                    <p className="text-sm text-muted-foreground">Built on decades of research in educational psychology</p>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <p className="text-lg text-muted-foreground mb-6">
                  Every learner deserves an AI tutor that truly understands them.<br />
                  LearnGraph makes that possible.
                </p>
                <p className="text-sm text-muted-foreground">
                  Built with ❤️ by Dr. Lee
                </p>
              </div>
            </div>
          </Section>

        </div>
      </main>
    </div>
  );
}
