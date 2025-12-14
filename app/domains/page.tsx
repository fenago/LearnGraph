'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ReactFlow,
  Node,
  Edge,
  Controls,
  Background,
  MiniMap,
  useNodesState,
  useEdgesState,
  NodeTypes,
  MarkerType,
  Handle,
  Position,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Sidebar } from '../components/Sidebar';
import { EtherealShadow } from '@/components/ui/ethereal-shadow';
import { cn } from '@/lib/utils';
import {
  Brain,
  RefreshCw,
  X,
  Layers,
  Eye,
  EyeOff,
  Zap,
  Link2,
  Users,
} from 'lucide-react';
import {
  ALL_DOMAIN_IDS,
  DOMAIN_METADATA,
  DOMAIN_CATEGORIES,
  getDomainsByCategory,
} from '@/src/models/psychometrics';

// =============================================================================
// DOMAIN RELATIONSHIPS - The "edges" in Graph A
// =============================================================================

// Well-established psychological correlations (based on research literature)
const DOMAIN_CORRELATIONS: Array<{
  source: string;
  target: string;
  strength: 'strong' | 'moderate' | 'weak';
  direction: 'positive' | 'negative';
  description: string;
}> = [
  // Big Five intercorrelations
  { source: 'big_five_openness', target: 'creativity', strength: 'strong', direction: 'positive', description: 'Openness strongly predicts creativity' },
  { source: 'big_five_conscientiousness', target: 'achievement_motivation', strength: 'strong', direction: 'positive', description: 'Conscientiousness drives achievement motivation' },
  { source: 'big_five_conscientiousness', target: 'self_efficacy', strength: 'moderate', direction: 'positive', description: 'Conscientious people develop higher self-efficacy' },
  { source: 'big_five_extraversion', target: 'communication_style', strength: 'moderate', direction: 'positive', description: 'Extraverts tend toward assertive communication' },
  { source: 'big_five_extraversion', target: 'social_support', strength: 'moderate', direction: 'positive', description: 'Extraverts build larger support networks' },
  { source: 'big_five_agreeableness', target: 'emotional_empathy', strength: 'strong', direction: 'positive', description: 'Agreeableness strongly correlates with empathy' },
  { source: 'big_five_neuroticism', target: 'stress_coping', strength: 'strong', direction: 'negative', description: 'High neuroticism impairs stress coping' },
  { source: 'big_five_neuroticism', target: 'life_satisfaction', strength: 'moderate', direction: 'negative', description: 'Neuroticism negatively affects life satisfaction' },

  // Dark Triad correlations
  { source: 'dark_triad_narcissism', target: 'big_five_extraversion', strength: 'moderate', direction: 'positive', description: 'Narcissists often appear extraverted' },
  { source: 'dark_triad_narcissism', target: 'self_efficacy', strength: 'weak', direction: 'positive', description: 'Narcissism can inflate self-efficacy beliefs' },
  { source: 'dark_triad_machiavellianism', target: 'big_five_agreeableness', strength: 'moderate', direction: 'negative', description: 'Machiavellians score low on agreeableness' },
  { source: 'dark_triad_psychopathy', target: 'emotional_empathy', strength: 'strong', direction: 'negative', description: 'Psychopathy inversely related to empathy' },

  // Emotional intelligence cluster
  { source: 'emotional_intelligence', target: 'emotional_empathy', strength: 'strong', direction: 'positive', description: 'EI includes empathic abilities' },
  { source: 'emotional_intelligence', target: 'social_cognition', strength: 'moderate', direction: 'positive', description: 'EI enhances social understanding' },
  { source: 'emotional_intelligence', target: 'stress_coping', strength: 'moderate', direction: 'positive', description: 'EI improves emotion regulation' },

  // Motivation cluster
  { source: 'growth_mindset', target: 'self_efficacy', strength: 'moderate', direction: 'positive', description: 'Growth mindset builds self-efficacy' },
  { source: 'growth_mindset', target: 'achievement_motivation', strength: 'moderate', direction: 'positive', description: 'Growth mindset sustains motivation' },
  { source: 'locus_of_control', target: 'self_efficacy', strength: 'moderate', direction: 'positive', description: 'Internal locus enhances self-efficacy' },

  // Cognitive cluster
  { source: 'cognitive_abilities', target: 'metacognition', strength: 'moderate', direction: 'positive', description: 'Higher ability enables better metacognition' },
  { source: 'cognitive_abilities', target: 'information_processing', strength: 'strong', direction: 'positive', description: 'Cognitive ability affects processing speed' },
  { source: 'executive_functions', target: 'metacognition', strength: 'strong', direction: 'positive', description: 'Executive functions support metacognition' },
  { source: 'executive_functions', target: 'decision_style', strength: 'moderate', direction: 'positive', description: 'Executive functions affect decision making' },

  // Learning-related
  { source: 'learning_styles', target: 'information_processing', strength: 'moderate', direction: 'positive', description: 'Learning style affects processing preferences' },
  { source: 'big_five_openness', target: 'learning_styles', strength: 'weak', direction: 'positive', description: 'Open people explore diverse learning modes' },

  // Values and wellbeing
  { source: 'authenticity', target: 'life_satisfaction', strength: 'moderate', direction: 'positive', description: 'Authenticity contributes to wellbeing' },
  { source: 'social_support', target: 'stress_coping', strength: 'moderate', direction: 'positive', description: 'Support buffers against stress' },
  { source: 'social_support', target: 'life_satisfaction', strength: 'moderate', direction: 'positive', description: 'Social support enhances life satisfaction' },

  // Sensory/aesthetic
  { source: 'sensory_processing', target: 'aesthetic_preferences', strength: 'moderate', direction: 'positive', description: 'Sensory sensitivity shapes aesthetic taste' },
  { source: 'big_five_openness', target: 'aesthetic_preferences', strength: 'moderate', direction: 'positive', description: 'Openness predicts aesthetic appreciation' },
];

// Subscale relationships (parent → child)
const SUBSCALE_EDGES: Array<{ parent: string; subscales: string[] }> = [
  { parent: 'learning_styles', subscales: ['visual', 'auditory', 'reading', 'kinesthetic'] },
  { parent: 'emotional_intelligence', subscales: ['perceiving', 'using', 'understanding', 'managing'] },
  { parent: 'attachment_style', subscales: ['secure', 'anxious', 'avoidant', 'fearful'] },
  { parent: 'love_languages', subscales: ['words', 'acts', 'gifts', 'time', 'touch'] },
  { parent: 'communication_style', subscales: ['dominance', 'influence', 'steadiness', 'conscientiousness'] },
  { parent: 'risk_tolerance', subscales: ['financial', 'physical', 'social', 'career'] },
  { parent: 'interests', subscales: ['realistic', 'investigative', 'artistic', 'social', 'enterprising', 'conventional'] },
  { parent: 'social_support', subscales: ['emotional', 'instrumental', 'informational', 'appraisal'] },
  { parent: 'stress_coping', subscales: ['problem_focused', 'emotion_focused', 'avoidant'] },
];

// Canonical 8 categories from domain-reference.md (source of truth)
const CANONICAL_CATEGORIES = [
  'A. Core Personality',
  'B. Dark Personality',
  'C. Emotional/Social Intelligence',
  'D. Decision Making & Motivation',
  'E. Values & Wellbeing',
  'F. Cognitive/Learning',
  'G. Social/Cultural/Values',
  'H. Sensory/Aesthetic',
] as const;

// Map detailed categories to canonical categories
const CATEGORY_MAPPING: Record<string, string> = {
  'Big Five Personality': 'A. Core Personality',
  'Dark Triad': 'B. Dark Personality',
  'Emotional Intelligence': 'C. Emotional/Social Intelligence',
  'Communication & Social': 'C. Emotional/Social Intelligence',
  'Decision Making & Risk': 'D. Decision Making & Motivation',
  'Motivation & Achievement': 'D. Decision Making & Motivation',
  'Values & Interests': 'E. Values & Wellbeing',
  'Coping & Wellbeing': 'E. Values & Wellbeing',
  'Cognitive': 'F. Cognitive/Learning',
  'Social Cognition': 'G. Social/Cultural/Values',
  'Worldview': 'G. Social/Cultural/Values',
  'Work & Lifestyle': 'G. Social/Cultural/Values',
};

// Category colors for visual clustering (using canonical 8 categories)
const CATEGORY_COLORS: Record<string, { bg: string; border: string; text: string; hex: string }> = {
  'A. Core Personality': { bg: 'bg-blue-100 dark:bg-blue-950', border: 'border-blue-400', text: 'text-blue-700 dark:text-blue-300', hex: '#3b82f6' },
  'B. Dark Personality': { bg: 'bg-red-100 dark:bg-red-950', border: 'border-red-400', text: 'text-red-700 dark:text-red-300', hex: '#ef4444' },
  'C. Emotional/Social Intelligence': { bg: 'bg-pink-100 dark:bg-pink-950', border: 'border-pink-400', text: 'text-pink-700 dark:text-pink-300', hex: '#ec4899' },
  'D. Decision Making & Motivation': { bg: 'bg-amber-100 dark:bg-amber-950', border: 'border-amber-400', text: 'text-amber-700 dark:text-amber-300', hex: '#f59e0b' },
  'E. Values & Wellbeing': { bg: 'bg-green-100 dark:bg-green-950', border: 'border-green-400', text: 'text-green-700 dark:text-green-300', hex: '#22c55e' },
  'F. Cognitive/Learning': { bg: 'bg-cyan-100 dark:bg-cyan-950', border: 'border-cyan-400', text: 'text-cyan-700 dark:text-cyan-300', hex: '#06b6d4' },
  'G. Social/Cultural/Values': { bg: 'bg-violet-100 dark:bg-violet-950', border: 'border-violet-400', text: 'text-violet-700 dark:text-violet-300', hex: '#8b5cf6' },
  'H. Sensory/Aesthetic': { bg: 'bg-rose-100 dark:bg-rose-950', border: 'border-rose-400', text: 'text-rose-700 dark:text-rose-300', hex: '#f43f5e' },
};

// Helper to get canonical category
function getCanonicalCategory(detailedCategory: string): string {
  return CATEGORY_MAPPING[detailedCategory] || detailedCategory;
}

interface DomainDetails {
  id: string;
  name: string;
  category: string;
  canonicalCategory: string;
  description: string;
  educationalRelevance?: string;
  correlations: Array<{ domain: string; strength: string; direction: string; description: string }>;
  hasSubscales: boolean;
}

function DomainNode({ data }: { data: Record<string, unknown> }) {
  const detailedCategory = data.category as string;
  const canonicalCategory = data.canonicalCategory as string;
  const isSelected = data.isSelected as boolean | undefined;
  const hasSubscales = data.hasSubscales as boolean | undefined;

  const colors = CATEGORY_COLORS[canonicalCategory] || { bg: 'bg-gray-100 dark:bg-gray-800', border: 'border-gray-400', text: 'text-gray-700 dark:text-gray-300' };
  const selectedStyles = isSelected ? 'ring-2 ring-primary ring-offset-2 ring-offset-background scale-110' : '';

  return (
    <div
      className={cn(
        'px-3 py-2 rounded-xl shadow-md border-2 min-w-[100px] relative cursor-pointer',
        'transition-all duration-200 hover:shadow-lg hover:scale-105',
        colors.bg,
        colors.border,
        selectedStyles
      )}
      title={data.description as string}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="w-2 h-2 !bg-muted-foreground"
      />
      <Handle
        type="target"
        position={Position.Left}
        className="w-2 h-2 !bg-muted-foreground"
      />
      <div className={cn('font-medium text-sm', colors.text)}>{data.label as string}</div>
      <div className="text-xs text-muted-foreground truncate max-w-[120px]">{canonicalCategory}</div>
      {hasSubscales && (
        <div className="text-[10px] text-primary font-medium mt-0.5">Has subscales</div>
      )}
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-2 h-2 !bg-muted-foreground"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-2 h-2 !bg-muted-foreground"
      />
    </div>
  );
}

function SubscaleNode({ data }: { data: Record<string, unknown> }) {
  const isSelected = data.isSelected as boolean | undefined;
  const selectedStyles = isSelected ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : '';

  return (
    <div
      className={cn(
        'px-2 py-1 rounded-lg shadow-sm border min-w-[60px] relative cursor-pointer',
        'transition-all duration-200 hover:shadow-md hover:scale-105',
        'bg-muted/50 border-muted-foreground/30',
        selectedStyles
      )}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="w-1.5 h-1.5 !bg-muted-foreground"
      />
      <div className="font-medium text-xs text-muted-foreground">{data.label as string}</div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-1.5 h-1.5 !bg-muted-foreground"
      />
    </div>
  );
}

const nodeTypes: NodeTypes = {
  domain: DomainNode,
  subscale: SubscaleNode,
};

export default function DomainsPage() {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDomain, setSelectedDomain] = useState<DomainDetails | null>(null);
  const [showCorrelations, setShowCorrelations] = useState(true);
  const [showSubscales, setShowSubscales] = useState(false);
  const [learnerScores, setLearnerScores] = useState<Record<string, number> | null>(null);
  const [learners, setLearners] = useState<Array<{ userId: string; name: string }>>([]);
  const [selectedLearner, setSelectedLearner] = useState('');

  useEffect(() => {
    fetchLearners();
  }, []);

  useEffect(() => {
    buildGraph();
  }, [showCorrelations, showSubscales, learnerScores]);

  useEffect(() => {
    if (selectedLearner) {
      fetchLearnerScores(selectedLearner);
    } else {
      setLearnerScores(null);
    }
  }, [selectedLearner]);

  async function fetchLearners() {
    try {
      const res = await fetch('/api/learners');
      const data = await res.json();
      setLearners(data);
    } catch (err) {
      console.error('Failed to fetch learners:', err);
    }
  }

  async function fetchLearnerScores(userId: string) {
    try {
      const res = await fetch(`/api/learners/${userId}`);
      const data = await res.json();
      if (data.psychometricScores) {
        const scores: Record<string, number> = {};
        Object.entries(data.psychometricScores).forEach(([key, val]) => {
          scores[key] = (val as { score: number }).score;
        });
        setLearnerScores(scores);
      }
    } catch (err) {
      console.error('Failed to fetch learner scores:', err);
    }
  }

  const buildGraph = useCallback(() => {
    setLoading(true);

    const newNodes: Node[] = [];
    const newEdges: Edge[] = [];

    // Position domains in a circular layout by canonical category (8 categories)
    const categoryAngles = new Map<string, { startAngle: number; count: number; index: number }>();
    const anglePerCategory = (2 * Math.PI) / CANONICAL_CATEGORIES.length;

    // First, count domains per canonical category
    const domainsByCanonical = new Map<string, string[]>();
    ALL_DOMAIN_IDS.forEach((domainId) => {
      const metadata = DOMAIN_METADATA[domainId];
      const canonical = getCanonicalCategory(metadata.category);
      if (!domainsByCanonical.has(canonical)) {
        domainsByCanonical.set(canonical, []);
      }
      domainsByCanonical.get(canonical)!.push(domainId);
    });

    CANONICAL_CATEGORIES.forEach((cat, i) => {
      const count = domainsByCanonical.get(cat)?.length || 0;
      categoryAngles.set(cat, {
        startAngle: i * anglePerCategory - Math.PI / 2,
        count,
        index: 0,
      });
    });

    const radius = 400;
    const categorySpread = 60;

    // Create domain nodes
    ALL_DOMAIN_IDS.forEach((domainId) => {
      const metadata = DOMAIN_METADATA[domainId];
      const canonicalCategory = getCanonicalCategory(metadata.category);
      const catInfo = categoryAngles.get(canonicalCategory);
      if (!catInfo) return;

      const angleOffset = (catInfo.index / Math.max(catInfo.count - 1, 1) - 0.5) * (anglePerCategory * 0.7);
      const angle = catInfo.startAngle + angleOffset;
      const r = radius + (catInfo.index % 2 === 0 ? 0 : categorySpread);

      const hasSubscales = SUBSCALE_EDGES.some((s) => s.parent === domainId);
      const score = learnerScores?.[domainId];

      newNodes.push({
        id: domainId,
        type: 'domain',
        position: {
          x: Math.cos(angle) * r + 500,
          y: Math.sin(angle) * r + 500,
        },
        data: {
          label: metadata.name,
          category: metadata.category,
          canonicalCategory,
          description: metadata.description,
          hasSubscales,
          score,
        },
      });

      catInfo.index++;
    });

    // Add correlation edges
    if (showCorrelations) {
      DOMAIN_CORRELATIONS.forEach((corr, i) => {
        const edgeColor = corr.direction === 'positive' ? '#22c55e' : '#ef4444';
        const strokeWidth = corr.strength === 'strong' ? 2 : corr.strength === 'moderate' ? 1.5 : 1;
        const strokeDasharray = corr.strength === 'weak' ? '5,5' : undefined;

        newEdges.push({
          id: `corr-${i}`,
          source: corr.source,
          target: corr.target,
          type: 'smoothstep',
          animated: false,
          style: {
            stroke: edgeColor,
            strokeWidth,
            strokeDasharray,
            opacity: 0.6,
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: edgeColor,
          },
          label: corr.direction === 'positive' ? '+' : '−',
          labelStyle: { fill: edgeColor, fontWeight: 'bold', fontSize: 10 },
          labelBgStyle: { fill: 'transparent' },
        });
      });
    }

    // Add subscale nodes and edges
    if (showSubscales) {
      SUBSCALE_EDGES.forEach((sub) => {
        const parentNode = newNodes.find((n) => n.id === sub.parent);
        if (!parentNode) return;

        sub.subscales.forEach((subscale, i) => {
          const angle = ((i / sub.subscales.length) * Math.PI * 0.5) - Math.PI * 0.25;
          const subRadius = 80;

          newNodes.push({
            id: `${sub.parent}-${subscale}`,
            type: 'subscale',
            position: {
              x: parentNode.position.x + Math.cos(angle) * subRadius + 50,
              y: parentNode.position.y + Math.sin(angle) * subRadius + 50,
            },
            data: {
              label: subscale.replace(/_/g, ' '),
            },
          });

          newEdges.push({
            id: `sub-${sub.parent}-${subscale}`,
            source: sub.parent,
            target: `${sub.parent}-${subscale}`,
            type: 'smoothstep',
            style: { stroke: '#9ca3af', strokeWidth: 1 },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: '#9ca3af',
            },
          });
        });
      });
    }

    setNodes(newNodes);
    setEdges(newEdges);
    setLoading(false);
  }, [showCorrelations, showSubscales, learnerScores, setNodes, setEdges]);

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    if (node.type === 'subscale') return;

    const domainId = node.id;
    const metadata = DOMAIN_METADATA[domainId as keyof typeof DOMAIN_METADATA];
    if (!metadata) return;

    const correlations = DOMAIN_CORRELATIONS
      .filter((c) => c.source === domainId || c.target === domainId)
      .map((c) => ({
        domain: c.source === domainId ? c.target : c.source,
        strength: c.strength,
        direction: c.source === domainId ? c.direction : (c.direction === 'positive' ? 'positive' : 'negative'),
        description: c.description,
      }));

    const hasSubscales = SUBSCALE_EDGES.some((s) => s.parent === domainId);

    const details: DomainDetails = {
      id: domainId,
      name: metadata.name,
      category: metadata.category,
      canonicalCategory: getCanonicalCategory(metadata.category),
      description: metadata.description,
      educationalRelevance: metadata.educationalRelevance,
      correlations,
      hasSubscales,
    };

    setSelectedDomain(details);

    setNodes((prevNodes) =>
      prevNodes.map((n) => ({
        ...n,
        data: {
          ...n.data,
          isSelected: n.id === node.id,
        },
      }))
    );
  }, [setNodes]);

  const stats = useMemo(() => ({
    domains: ALL_DOMAIN_IDS.length,
    categories: CANONICAL_CATEGORIES.length,
    correlations: DOMAIN_CORRELATIONS.length,
    subscaleGroups: SUBSCALE_EDGES.length,
  }), []);

  const statCards = [
    { label: 'Domains', value: stats.domains, icon: Brain, gradient: 'from-blue-500 to-cyan-500', bg: 'bg-blue-500/10' },
    { label: 'Categories', value: stats.categories, icon: Layers, gradient: 'from-purple-500 to-violet-500', bg: 'bg-purple-500/10' },
    { label: 'Correlations', value: stats.correlations, icon: Link2, gradient: 'from-emerald-500 to-green-500', bg: 'bg-emerald-500/10' },
    { label: 'Subscale Groups', value: stats.subscaleGroups, icon: Zap, gradient: 'from-amber-500 to-orange-500', bg: 'bg-amber-500/10' },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <main className="flex-1 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 pointer-events-none">
          <EtherealShadow
            color="rgba(236, 72, 153, 0.12)"
            animation={{ scale: 30, speed: 40 }}
            noise={{ opacity: 0.3, scale: 0.8 }}
          />
        </div>

        <div className="relative z-10 px-8 py-10 max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="p-3 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 shadow-lg shadow-pink-500/25"
              >
                <Brain className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                  Psychometric Domain Graph
                </h1>
                <p className="text-muted-foreground">
                  Graph A: 39 psychological domains and their relationships
                </p>
              </div>
            </div>
          </motion.div>

          {/* Controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="glass-card p-4 mb-6"
          >
            <div className="flex flex-wrap items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={buildGraph}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium shadow-lg shadow-primary/25 hover:shadow-xl transition-all"
              >
                <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                Refresh
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowCorrelations(!showCorrelations)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all',
                  showCorrelations
                    ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/50'
                    : 'bg-secondary text-muted-foreground border border-transparent'
                )}
              >
                {showCorrelations ? <Eye size={18} /> : <EyeOff size={18} />}
                Correlations
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowSubscales(!showSubscales)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all',
                  showSubscales
                    ? 'bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-500/50'
                    : 'bg-secondary text-muted-foreground border border-transparent'
                )}
              >
                {showSubscales ? <Eye size={18} /> : <EyeOff size={18} />}
                Subscales
              </motion.button>

              <div className="flex items-center gap-3 flex-1">
                <Users size={18} className="text-muted-foreground" />
                <label className="text-sm text-muted-foreground">Overlay scores:</label>
                <select
                  value={selectedLearner}
                  onChange={(e) => setSelectedLearner(e.target.value)}
                  className="flex-1 max-w-xs px-4 py-2.5 bg-secondary/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-foreground"
                >
                  <option value="">No overlay</option>
                  {learners.map((l) => (
                    <option key={l.userId} value={l.userId}>
                      {l.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
            }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
          >
            {statCards.map((card) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.label}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  className="glass-card p-4 text-center"
                >
                  <div className={cn('mx-auto w-10 h-10 rounded-xl flex items-center justify-center mb-2', card.bg)}>
                    <Icon className="w-5 h-5" style={{ color: card.gradient.includes('blue') ? '#3b82f6' : card.gradient.includes('purple') ? '#a855f7' : card.gradient.includes('emerald') ? '#10b981' : '#f59e0b' }} />
                  </div>
                  <div className="text-2xl font-bold text-foreground">{card.value}</div>
                  <div className="text-xs text-muted-foreground">{card.label}</div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Graph Container */}
          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-card p-12 text-center"
            >
              <RefreshCw className="w-8 h-8 text-muted-foreground animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Building domain graph...</p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex gap-4"
            >
              {/* Graph Container */}
              <div
                className={cn(
                  'glass-card overflow-hidden flex-1 transition-all duration-300',
                  selectedDomain ? 'w-2/3' : 'w-full'
                )}
                style={{ height: '600px' }}
              >
                <ReactFlow
                  nodes={nodes}
                  edges={edges}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
                  onNodeClick={onNodeClick}
                  nodeTypes={nodeTypes}
                  fitView
                  fitViewOptions={{ padding: 0.2 }}
                  className="bg-background/50"
                >
                  <Background className="!bg-transparent" />
                  <Controls className="!bg-card !border-border !rounded-xl !shadow-lg" />
                  <MiniMap
                    className="!bg-card/80 !border-border !rounded-xl"
                    nodeColor={(node) => {
                      if (node.type === 'subscale') return '#9ca3af';
                      const canonicalCategory = node.data?.canonicalCategory as string;
                      return CATEGORY_COLORS[canonicalCategory]?.hex || '#9ca3af';
                    }}
                  />
                </ReactFlow>
              </div>

              {/* Details Panel */}
              <AnimatePresence>
                {selectedDomain && (
                  <motion.div
                    initial={{ opacity: 0, x: 20, width: 0 }}
                    animate={{ opacity: 1, x: 0, width: '33.333%' }}
                    exit={{ opacity: 0, x: 20, width: 0 }}
                    className="glass-card p-5 overflow-y-auto"
                    style={{ height: '600px' }}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-bold text-foreground">{selectedDomain.name}</h3>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => {
                          setSelectedDomain(null);
                          setNodes((prevNodes) =>
                            prevNodes.map((n) => ({
                              ...n,
                              data: { ...n.data, isSelected: false },
                            }))
                          );
                        }}
                        className="p-1.5 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
                      >
                        <X size={18} />
                      </motion.button>
                    </div>

                    <div className="space-y-4">
                      {/* Category */}
                      <div className="flex items-center gap-2">
                        <Layers size={16} className="text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Category:</span>
                        <span
                          className={cn(
                            'text-sm font-medium px-2 py-0.5 rounded-md',
                            CATEGORY_COLORS[selectedDomain.canonicalCategory]?.bg,
                            CATEGORY_COLORS[selectedDomain.canonicalCategory]?.text
                          )}
                        >
                          {selectedDomain.canonicalCategory}
                        </span>
                      </div>

                      {/* Description */}
                      <div className="rounded-xl bg-secondary/50 p-3">
                        <p className="text-sm text-foreground">{selectedDomain.description}</p>
                      </div>

                      {/* Educational Relevance */}
                      {selectedDomain.educationalRelevance && (
                        <div className="space-y-2">
                          <h4 className="text-sm font-semibold text-foreground">Educational Relevance</h4>
                          <p className="text-sm text-muted-foreground">{selectedDomain.educationalRelevance}</p>
                        </div>
                      )}

                      {/* Has Subscales */}
                      {selectedDomain.hasSubscales && (
                        <div className="inline-block bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs px-3 py-1.5 rounded-lg">
                          ✓ Has subscales (toggle to view)
                        </div>
                      )}

                      {/* Correlations */}
                      {selectedDomain.correlations.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-sm font-semibold text-foreground">
                            Correlations ({selectedDomain.correlations.length})
                          </h4>
                          <div className="space-y-2">
                            {selectedDomain.correlations.map((corr, i) => (
                              <div
                                key={i}
                                className={cn(
                                  'rounded-lg p-2 text-xs',
                                  corr.direction === 'positive'
                                    ? 'bg-emerald-500/10 border border-emerald-500/30'
                                    : 'bg-red-500/10 border border-red-500/30'
                                )}
                              >
                                <div className="flex items-center gap-2 mb-1">
                                  <span
                                    className={cn(
                                      'font-bold',
                                      corr.direction === 'positive' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
                                    )}
                                  >
                                    {corr.direction === 'positive' ? '+' : '−'}
                                  </span>
                                  <span className="font-medium text-foreground">
                                    {DOMAIN_METADATA[corr.domain as keyof typeof DOMAIN_METADATA]?.name || corr.domain}
                                  </span>
                                  <span className="text-muted-foreground">({corr.strength})</span>
                                </div>
                                <p className="text-muted-foreground">{corr.description}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Domain ID */}
                      <div className="text-xs text-muted-foreground pt-3 border-t border-border">
                        ID: <span className="font-mono">{selectedDomain.id}</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* Legend */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card p-5 mt-6"
          >
            <h4 className="text-sm font-semibold text-foreground mb-3">Category Colors</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              {Object.entries(CATEGORY_COLORS).map(([category, colors]) => (
                <div key={category} className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-md shadow-sm"
                    style={{ backgroundColor: colors.hex }}
                  />
                  <span className="text-muted-foreground text-xs">{category}</span>
                </div>
              ))}
            </div>
            {showCorrelations && (
              <div className="mt-4 pt-4 border-t border-border">
                <h4 className="text-sm font-semibold text-foreground mb-2">Correlation Legend</h4>
                <div className="flex flex-wrap gap-4 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-0.5 bg-emerald-500" />
                    <span className="text-muted-foreground">Positive correlation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-0.5 bg-red-500" />
                    <span className="text-muted-foreground">Negative correlation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-0.5 bg-gray-400" style={{ strokeDasharray: '5,5' }} />
                    <span className="text-muted-foreground">Weak (dashed)</span>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
