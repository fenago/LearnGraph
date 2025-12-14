'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Users,
  BookOpen,
  GitBranch,
  BarChart3,
  Network,
  TestTube2,
  Home,
  Brain,
  GraduationCap,
  AlertTriangle,
  Sparkles,
  Activity,
  UserCircle,
  Hexagon,
  Layers,
  Info,
} from 'lucide-react';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Dashboard', icon: Home, description: 'Overview' },
  { href: '/profile', label: 'My Profile', icon: UserCircle, description: '39 psychometric domains' },
  { href: '/admin/learners', label: 'Learners', icon: Users, description: 'Manage profiles' },
  { href: '/admin/psychometrics', label: 'Psychometrics', icon: Brain, description: 'Cognitive traits' },
  { href: '/admin/concepts', label: 'Concepts', icon: BookOpen, description: 'Knowledge nodes' },
  { href: '/admin/prerequisites', label: 'Prerequisites', icon: GitBranch, description: 'Dependencies' },
  { href: '/admin/states', label: 'Knowledge States', icon: BarChart3, description: 'Progress tracking' },
  { href: '/recommendations', label: 'Recommendations', icon: Sparkles, description: 'ZPD & learning paths' },
  { href: '/gaps', label: 'Gap Analysis', icon: AlertTriangle, description: 'Find knowledge gaps' },
  { href: '/graph', label: 'Knowledge Graph', icon: Network, description: 'Concepts (Graph B)' },
  { href: '/domains', label: 'Domain Graph', icon: Hexagon, description: 'Psychometrics (Graph A)' },
  { href: '/combined-graph', label: 'Combined View', icon: Layers, description: 'Both graphs + bridge' },
  { href: '/edu-psychology', label: 'Edu Psychology', icon: GraduationCap, description: 'Learn theory' },
  { href: '/about', label: 'About LearnGraph', icon: Info, description: 'System overview' },
  { href: '/status', label: 'System Status', icon: Activity, description: 'Health monitoring' },
  { href: '/tests', label: 'Functional Tests', icon: TestTube2, description: 'Run tests' },
];

const navItemVariants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  hover: { x: 4 },
};

const iconVariants = {
  initial: { scale: 1 },
  hover: { scale: 1.1, rotate: [0, -10, 10, 0] },
};

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-72 bg-sidebar-background border-r border-sidebar-border min-h-screen flex flex-col">
      {/* Logo Section */}
      <div className="p-6 border-b border-sidebar-border">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' as const }}
          className="flex items-center gap-3"
        >
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/25">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <motion.div
              className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
          <div>
            <h1 className="text-lg font-bold text-sidebar-foreground tracking-tight">
              LearnGraph
            </h1>
            <p className="text-xs text-muted-foreground">Adaptive Education</p>
          </div>
        </motion.div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto scrollbar-hide">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== '/' && pathname.startsWith(item.href));

          return (
            <motion.div
              key={item.href}
              variants={navItemVariants}
              initial="initial"
              animate="animate"
              whileHover="hover"
              transition={{ delay: index * 0.05, duration: 0.3 }}
            >
              <Link
                href={item.href}
                className={cn(
                  'group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200',
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                )}
              >
                <motion.div
                  variants={iconVariants}
                  transition={{ duration: 0.3 }}
                  className={cn(
                    'flex items-center justify-center w-9 h-9 rounded-lg transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : 'bg-muted/50 group-hover:bg-muted'
                  )}
                >
                  <Icon size={18} />
                </motion.div>
                <div className="flex-1 min-w-0">
                  <span className="block text-sm font-medium truncate">
                    {item.label}
                  </span>
                  <span className="block text-xs text-muted-foreground truncate opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.description}
                  </span>
                </div>
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="w-1.5 h-8 rounded-full bg-primary"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </Link>
            </motion.div>
          );
        })}
      </nav>

      {/* Footer with Theme Toggle */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
              P5
            </div>
            <div>
              <p className="text-xs font-medium text-sidebar-foreground">Phase 5</p>
              <p className="text-[10px] text-muted-foreground">Gap Analysis</p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </aside>
  );
}
