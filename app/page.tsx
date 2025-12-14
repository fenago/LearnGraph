'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Users,
  GitBranch,
  BarChart3,
  FlaskConical,
  Network,
  Database,
  Lightbulb,
  ArrowRight,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { BackgroundBeamsWithCollision } from '@/components/ui/background-beams';
import { EtherealShadow } from '@/components/ui/ethereal-shadow';
import { cn } from '@/lib/utils';

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

const featureCards = [
  {
    href: '/admin/learners',
    label: 'Learners',
    description: 'Manage learner profiles and psychometric data',
    icon: Users,
    gradient: 'from-blue-500 to-cyan-500',
    bg: 'bg-blue-500/10',
  },
  {
    href: '/admin/concepts',
    label: 'Concepts',
    description: 'Build your knowledge graph with concept nodes',
    icon: BookOpen,
    gradient: 'from-emerald-500 to-green-500',
    bg: 'bg-emerald-500/10',
  },
  {
    href: '/admin/prerequisites',
    label: 'Prerequisites',
    description: 'Define concept dependencies and relationships',
    icon: GitBranch,
    gradient: 'from-purple-500 to-violet-500',
    bg: 'bg-purple-500/10',
  },
  {
    href: '/admin/states',
    label: 'Knowledge States',
    description: 'Track learner progress and mastery levels',
    icon: BarChart3,
    gradient: 'from-amber-500 to-orange-500',
    bg: 'bg-amber-500/10',
  },
  {
    href: '/recommendations',
    label: 'Recommendations',
    description: 'ZPD-powered personalized learning paths',
    icon: Lightbulb,
    gradient: 'from-pink-500 to-rose-500',
    bg: 'bg-pink-500/10',
    badge: 'ZPD',
  },
  {
    href: '/gaps',
    label: 'Gap Analysis',
    description: 'Detect and remediate knowledge gaps',
    icon: AlertTriangle,
    gradient: 'from-red-500 to-orange-500',
    bg: 'bg-red-500/10',
    badge: 'Phase 5',
  },
  {
    href: '/graph',
    label: 'Graph View',
    description: 'Interactive knowledge graph visualization',
    icon: Network,
    gradient: 'from-indigo-500 to-blue-500',
    bg: 'bg-indigo-500/10',
  },
  {
    href: '/tests',
    label: 'Functional Tests',
    description: 'Verify system functionality across phases',
    icon: FlaskConical,
    gradient: 'from-slate-500 to-gray-500',
    bg: 'bg-slate-500/10',
  },
];

export default function HomePage() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <main className="flex-1 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 pointer-events-none">
          <EtherealShadow
            color="rgba(139, 92, 246, 0.15)"
            animation={{ scale: 30, speed: 40 }}
            noise={{ opacity: 0.3, scale: 0.8 }}
          />
        </div>

        <div className="relative z-10 px-8 py-10 max-w-7xl mx-auto">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' as const }}
            className="mb-12"
          >
            <div className="flex items-center gap-3 mb-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="h-2 w-2 rounded-full bg-emerald-500"
              />
              <span className="text-sm font-medium text-muted-foreground">
                Phase 5 Active
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
              Welcome to{' '}
              <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                LearnGraph
              </span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-2xl">
              Graph-Based Adaptive Education System. Personalized tutoring that
              makes any LLM smarter about each specific learner.
            </p>
          </motion.div>

          {/* Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="glass-card mb-10 p-6"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/25">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-foreground mb-2">
                  Works With Any Knowledge Domain
                </h2>
                <p className="text-muted-foreground text-sm mb-4">
                  LearnGraph is a metadata and recommendation layer — not a
                  content management system. Model any subject: math,
                  programming, music theory, languages, or corporate training.
                </p>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="rounded-xl bg-primary/5 p-4 border border-primary/10">
                    <h3 className="font-medium text-foreground text-sm mb-2">
                      What LearnGraph Stores
                    </h3>
                    <ul className="text-muted-foreground text-xs space-y-1.5">
                      <li className="flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-primary" />
                        Concept names and prerequisites
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-primary" />
                        Difficulty ratings and Bloom levels
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-primary" />
                        Learner profiles and psychometrics
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-primary" />
                        Mastery levels and learning history
                      </li>
                    </ul>
                  </div>
                  <div className="rounded-xl bg-emerald-500/5 p-4 border border-emerald-500/10">
                    <h3 className="font-medium text-foreground text-sm mb-2">
                      What LearnGraph Computes
                    </h3>
                    <ul className="text-muted-foreground text-xs space-y-1.5">
                      <li className="flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-emerald-500" />
                        "What should this learner study next?"
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-emerald-500" />
                        "How should we teach this concept?"
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-emerald-500" />
                        Personalized scaffolding strategies
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-emerald-500" />
                        Learning path recommendations
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Feature Cards Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {featureCards.map((card) => {
              const Icon = card.icon;
              return (
                <motion.div key={card.href} variants={itemVariants}>
                  <Link
                    href={card.href}
                    className={cn(
                      'group block p-5 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm',
                      'transition-all duration-300 hover:shadow-lg hover:shadow-primary/5',
                      'hover:-translate-y-1 hover:border-border'
                    )}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className={cn(
                          'p-2.5 rounded-xl',
                          card.bg,
                          'group-hover:scale-110 transition-transform duration-300'
                        )}
                      >
                        <Icon
                          className={cn(
                            'w-5 h-5 bg-gradient-to-br bg-clip-text',
                            card.gradient
                          )}
                          style={{
                            color: 'transparent',
                            backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))`,
                          }}
                        />
                        <Icon
                          className={cn('w-5 h-5 absolute opacity-100')}
                          style={{
                            marginTop: '-20px',
                            color: card.gradient.includes('blue')
                              ? '#3b82f6'
                              : card.gradient.includes('emerald')
                              ? '#10b981'
                              : card.gradient.includes('purple')
                              ? '#a855f7'
                              : card.gradient.includes('amber')
                              ? '#f59e0b'
                              : card.gradient.includes('pink')
                              ? '#ec4899'
                              : card.gradient.includes('red')
                              ? '#ef4444'
                              : card.gradient.includes('indigo')
                              ? '#6366f1'
                              : '#64748b',
                          }}
                        />
                      </div>
                      {card.badge && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                          {card.badge}
                        </span>
                      )}
                    </div>

                    <h3 className="font-semibold text-foreground mb-1.5 group-hover:text-primary transition-colors">
                      {card.label}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                      {card.description}
                    </p>

                    <div className="flex items-center text-xs text-muted-foreground group-hover:text-primary transition-colors">
                      <span>Explore</span>
                      <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Quick Access */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-10 p-5 rounded-2xl border border-border/50 bg-card/30 backdrop-blur-sm"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Database className="w-5 h-5 text-muted-foreground" />
                <div>
                  <h3 className="font-medium text-foreground text-sm">
                    Data Entry Guide
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Learn how to structure your educational content
                  </p>
                </div>
              </div>
              <Link
                href="/data-entry"
                className="px-4 py-2 text-sm font-medium rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center gap-2"
              >
                Get Started
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>

          {/* Footer */}
          <motion.footer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-12 text-center"
          >
            <p className="text-xs text-muted-foreground">
              Phase 5: Knowledge Gap Analysis & Spaced Repetition
            </p>
          </motion.footer>
        </div>
      </main>
    </div>
  );
}
