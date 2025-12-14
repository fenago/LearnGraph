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
  addEdge,
  Connection,
  NodeTypes,
  MarkerType,
  Handle,
  Position,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Sidebar } from '../components/Sidebar';
import { EtherealShadow } from '@/components/ui/ethereal-shadow';
import { cn } from '@/lib/utils';
import { useLearners, useConcepts, useEdges, useDB } from '@/lib/DBContext';
import type { KnowledgeState } from '@/src/models/types';
import {
  RefreshCw,
  User,
  X,
  BookOpen,
  GitBranch,
  Clock,
  Network,
  Layers,
  Users,
  BarChart3,
  Loader2,
  AlertCircle,
} from 'lucide-react';

// Domain color mapping for visual differentiation
const DOMAIN_COLORS: Record<string, { bg: string; darkBg: string; border: string; text: string; darkText: string }> = {
  mathematics: { bg: 'bg-blue-50', darkBg: 'dark:bg-blue-950/50', border: 'border-blue-400', text: 'text-blue-700', darkText: 'dark:text-blue-300' },
  programming: { bg: 'bg-purple-50', darkBg: 'dark:bg-purple-950/50', border: 'border-purple-400', text: 'text-purple-700', darkText: 'dark:text-purple-300' },
  science: { bg: 'bg-green-50', darkBg: 'dark:bg-green-950/50', border: 'border-green-400', text: 'text-green-700', darkText: 'dark:text-green-300' },
  language: { bg: 'bg-yellow-50', darkBg: 'dark:bg-yellow-950/50', border: 'border-yellow-400', text: 'text-yellow-700', darkText: 'dark:text-yellow-300' },
  history: { bg: 'bg-amber-50', darkBg: 'dark:bg-amber-950/50', border: 'border-amber-400', text: 'text-amber-700', darkText: 'dark:text-amber-300' },
  art: { bg: 'bg-pink-50', darkBg: 'dark:bg-pink-950/50', border: 'border-pink-400', text: 'text-pink-700', darkText: 'dark:text-pink-300' },
  music: { bg: 'bg-indigo-50', darkBg: 'dark:bg-indigo-950/50', border: 'border-indigo-400', text: 'text-indigo-700', darkText: 'dark:text-indigo-300' },
  default: { bg: 'bg-gray-50', darkBg: 'dark:bg-gray-800/50', border: 'border-gray-400', text: 'text-gray-700', darkText: 'dark:text-gray-300' },
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
    transition: { duration: 0.5, ease: 'easeOut' as const },
  },
};

interface ConceptDetails {
  conceptId: string;
  name: string;
  domain: string;
  subdomain?: string;
  description?: string;
  difficulty?: { absolute: number; cognitiveLoad: number; abstractness: number };
  mastery?: number;
  isZPD?: boolean;
  isForgotten?: boolean;
  prerequisites?: string[];
  dependents?: string[];
}

interface GraphData {
  nodes: Node[];
  edges: Edge[];
  overlay?: {
    userId: string;
    learnerName: string;
    masteryLevels: Record<string, number>;
    zpdConcepts: string[];
    forgottenConcepts: string[];
  };
  stats: {
    learners: number;
    concepts: number;
    edges: number;
    knowledgeStates: number;
  };
}

interface LearnerProfile {
  userId: string;
  name?: string;
}

interface GraphOverlay {
  userId: string;
  learnerName: string;
  masteryLevels: Record<string, number>;
  zpdConcepts: string[];
  forgottenConcepts: string[];
}

function ConceptNode({ data }: { data: Record<string, unknown> }) {
  const mastery = data.mastery as number | undefined;
  const isZPD = data.isZPD as boolean | undefined;
  const isForgotten = data.isForgotten as boolean | undefined;
  const domain = (data.domain as string || '').toLowerCase();
  const difficulty = data.difficulty as number | undefined;
  const isSelected = data.isSelected as boolean | undefined;

  // Get domain colors
  const domainColors = DOMAIN_COLORS[domain] || DOMAIN_COLORS.default;

  let bgColor = `${domainColors.bg} ${domainColors.darkBg}`;
  let borderColor = domainColors.border;
  let textColor = `${domainColors.text} ${domainColors.darkText}`;

  // Override with mastery colors if learner overlay is active
  if (mastery !== undefined) {
    if (mastery >= 80) {
      bgColor = 'bg-emerald-100 dark:bg-emerald-900/50';
      borderColor = 'border-emerald-500';
      textColor = 'text-emerald-800 dark:text-emerald-200';
    } else if (mastery >= 40) {
      bgColor = 'bg-amber-100 dark:bg-amber-900/50';
      borderColor = 'border-amber-500';
      textColor = 'text-amber-800 dark:text-amber-200';
    } else if (mastery > 0) {
      bgColor = 'bg-red-100 dark:bg-red-900/50';
      borderColor = 'border-red-500';
      textColor = 'text-red-800 dark:text-red-200';
    } else {
      bgColor = 'bg-muted';
      borderColor = 'border-border';
      textColor = 'text-muted-foreground';
    }
  }

  if (isZPD) {
    borderColor = 'border-blue-500 dark:border-blue-400 border-2';
  }

  if (isForgotten) {
    bgColor = 'bg-orange-100 dark:bg-orange-900/50';
    borderColor = 'border-orange-500';
    textColor = 'text-orange-800 dark:text-orange-200';
  }

  const selectedStyles = isSelected ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : '';

  return (
    <div
      className={cn(
        'px-4 py-2 rounded-xl shadow-md border-2 min-w-[120px] relative cursor-pointer',
        'transition-all duration-200 hover:shadow-lg hover:scale-105',
        bgColor,
        borderColor,
        selectedStyles
      )}
      title={`${data.label as string}\nDomain: ${data.domain as string}${difficulty ? `\nDifficulty: ${difficulty}/10` : ''}${mastery !== undefined ? `\nMastery: ${mastery}%` : ''}`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 !bg-muted-foreground"
      />
      <div className={cn('font-medium', textColor)}>{data.label as string}</div>
      <div className="text-xs text-muted-foreground">{data.domain as string}</div>
      {difficulty && (
        <div className="text-xs text-muted-foreground/70 mt-0.5">Diff: {difficulty}/10</div>
      )}
      {mastery !== undefined && (
        <div className="text-xs mt-1 font-medium">
          Mastery: {mastery}%
        </div>
      )}
      {isZPD && (
        <div className="text-xs text-blue-600 dark:text-blue-400 font-semibold mt-1">🎯 ZPD</div>
      )}
      {isForgotten && (
        <div className="text-xs text-orange-600 dark:text-orange-400 font-semibold mt-1">⏰ Needs Review</div>
      )}
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 !bg-muted-foreground"
      />
    </div>
  );
}

const nodeTypes: NodeTypes = {
  concept: ConceptNode,
};

export default function GraphPage() {
  const { db, isLoading: dbLoading, error: dbError, isReady } = useDB();
  const { learners } = useLearners();
  const { concepts } = useConcepts();
  const { edges: dbEdges } = useEdges();

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [selectedLearner, setSelectedLearner] = useState('');
  const [loading, setLoading] = useState(false);
  const [knowledgeStatesCount, setKnowledgeStatesCount] = useState(0);
  const [overlay, setOverlay] = useState<GraphOverlay | undefined>();
  const [selectedConcept, setSelectedConcept] = useState<ConceptDetails | null>(null);

  // Compute stats from the hooks data
  const stats = useMemo(() => ({
    learners: learners.length,
    concepts: concepts.length,
    edges: dbEdges.length,
    knowledgeStates: knowledgeStatesCount,
  }), [learners.length, concepts.length, dbEdges.length, knowledgeStatesCount]);

  // Build graph when data changes
  const buildGraph = useCallback(async () => {
    if (!isReady || !db) return;

    setLoading(true);
    try {
      // Count all knowledge states
      let statesCount = 0;
      for (const learner of learners) {
        const states = await db.getLearnerKnowledgeStates(learner.userId);
        statesCount += states.length;
      }
      setKnowledgeStatesCount(statesCount);

      // Build overlay if a learner is selected
      let graphOverlay: GraphOverlay | undefined;
      if (selectedLearner) {
        const selectedLearnerData = learners.find(l => l.userId === selectedLearner);
        const learnerStates = await db.getLearnerKnowledgeStates(selectedLearner);
        const masteryLevels: Record<string, number> = {};
        const forgottenConcepts: string[] = [];

        for (const state of learnerStates) {
          masteryLevels[state.conceptId] = state.mastery;
          // Check for forgotten concepts (low predicted retention)
          if (state.lastAccessed) {
            const daysSinceReview = (Date.now() - new Date(state.lastAccessed).getTime()) / (1000 * 60 * 60 * 24);
            const retention = Math.exp(-daysSinceReview / ((state.retentionStrength * 20) || 10));
            if (retention < 0.5 && state.mastery > 40) {
              forgottenConcepts.push(state.conceptId);
            }
          }
        }

        // Compute ZPD concepts
        const zpdResult = await db.computeZPD(selectedLearner);
        const zpdConcepts = zpdResult.zpd.map(z => z.concept.conceptId);

        graphOverlay = {
          userId: selectedLearner,
          learnerName: selectedLearnerData?.name || selectedLearner,
          masteryLevels,
          zpdConcepts,
          forgottenConcepts,
        };
      }
      setOverlay(graphOverlay);

      // Convert concepts to nodes
      let processedNodes: Node[] = concepts.map((concept) => ({
        id: concept.conceptId,
        type: 'concept',
        position: { x: 0, y: 0 },
        data: {
          label: concept.name,
          domain: concept.domain || 'general',
          subdomain: concept.subdomain,
          description: concept.description,
          difficulty: concept.difficulty,
          mastery: graphOverlay?.masteryLevels?.[concept.conceptId],
          isZPD: graphOverlay?.zpdConcepts?.includes(concept.conceptId),
          isForgotten: graphOverlay?.forgottenConcepts?.includes(concept.conceptId),
        },
      }));

      // Convert edges
      const graphEdges: Edge[] = dbEdges.map((edge) => ({
        id: `${edge.from}-${edge.to}`,
        source: edge.from,
        target: edge.to,
        type: 'smoothstep',
        markerEnd: { type: MarkerType.ArrowClosed },
        style: { strokeWidth: 2 },
      }));

      processedNodes = autoLayout(processedNodes, graphEdges);

      setNodes(processedNodes);
      setEdges(graphEdges);
    } catch (err) {
      console.error('Failed to build graph:', err);
    } finally {
      setLoading(false);
    }
  }, [db, isReady, concepts, dbEdges, learners, selectedLearner, setNodes, setEdges]);

  useEffect(() => {
    if (isReady) {
      buildGraph();
    }
  }, [isReady, buildGraph]);

  function autoLayout(nodes: Node[], edges: Edge[]): Node[] {
    if (nodes.length === 0) return nodes;

    const nodeMap = new Map<string, Node>();
    nodes.forEach((n) => nodeMap.set(n.id, { ...n }));

    const levels = new Map<string, number>();
    const incoming = new Map<string, Set<string>>();

    nodes.forEach((n) => incoming.set(n.id, new Set()));
    edges.forEach((e) => {
      const set = incoming.get(e.target);
      if (set) set.add(e.source);
    });

    const queue: string[] = [];
    nodes.forEach((n) => {
      if ((incoming.get(n.id)?.size || 0) === 0) {
        levels.set(n.id, 0);
        queue.push(n.id);
      }
    });

    while (queue.length > 0) {
      const nodeId = queue.shift()!;
      const level = levels.get(nodeId)!;
      edges.forEach((e) => {
        if (e.source === nodeId && !levels.has(e.target)) {
          levels.set(e.target, level + 1);
          queue.push(e.target);
        }
      });
    }

    nodes.forEach((n) => {
      if (!levels.has(n.id)) {
        levels.set(n.id, 0);
      }
    });

    const levelNodes = new Map<number, string[]>();
    levels.forEach((level, nodeId) => {
      if (!levelNodes.has(level)) levelNodes.set(level, []);
      levelNodes.get(level)!.push(nodeId);
    });

    const xSpacing = 250;
    const ySpacing = 150;

    levelNodes.forEach((nodeIds, level) => {
      const startY = -((nodeIds.length - 1) * ySpacing) / 2;
      nodeIds.forEach((nodeId, index) => {
        const node = nodeMap.get(nodeId);
        if (node) {
          node.position = {
            x: level * xSpacing,
            y: startY + index * ySpacing,
          };
        }
      });
    });

    return Array.from(nodeMap.values());
  }

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    const prerequisites = edges
      .filter(e => e.target === node.id)
      .map(e => {
        const sourceNode = nodes.find(n => n.id === e.source);
        return sourceNode?.data?.label as string || e.source;
      });

    const dependents = edges
      .filter(e => e.source === node.id)
      .map(e => {
        const targetNode = nodes.find(n => n.id === e.target);
        return targetNode?.data?.label as string || e.target;
      });

    const conceptDetails: ConceptDetails = {
      conceptId: node.id,
      name: node.data?.label as string || node.id,
      domain: node.data?.domain as string || 'Unknown',
      subdomain: node.data?.subdomain as string,
      description: node.data?.description as string,
      difficulty: node.data?.difficulty as ConceptDetails['difficulty'],
      mastery: node.data?.mastery as number,
      isZPD: node.data?.isZPD as boolean,
      isForgotten: node.data?.isForgotten as boolean,
      prerequisites,
      dependents,
    };

    setSelectedConcept(conceptDetails);

    setNodes(prevNodes => prevNodes.map(n => ({
      ...n,
      data: {
        ...n.data,
        isSelected: n.id === node.id,
      }
    })));
  }, [edges, nodes, setNodes]);

  const statCards = [
    { label: 'Concepts', value: stats.concepts, icon: BookOpen, gradient: 'from-blue-500 to-cyan-500', bg: 'bg-blue-500/10' },
    { label: 'Prerequisites', value: stats.edges, icon: GitBranch, gradient: 'from-purple-500 to-violet-500', bg: 'bg-purple-500/10' },
    { label: 'Learners', value: stats.learners, icon: Users, gradient: 'from-emerald-500 to-green-500', bg: 'bg-emerald-500/10' },
    { label: 'Knowledge States', value: stats.knowledgeStates, icon: BarChart3, gradient: 'from-amber-500 to-orange-500', bg: 'bg-amber-500/10' },
  ];

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
        {/* Background Effects */}
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
                className="p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 shadow-lg shadow-indigo-500/25"
              >
                <Network className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                  Knowledge Graph
                </h1>
                <p className="text-muted-foreground">
                  Visualize concepts and their relationships
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
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all"
              >
                <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                Refresh
              </motion.button>

              <div className="flex items-center gap-3 flex-1">
                <User size={18} className="text-muted-foreground" />
                <label className="text-sm text-muted-foreground">View as Learner:</label>
                <select
                  value={selectedLearner}
                  onChange={(e) => setSelectedLearner(e.target.value)}
                  className="flex-1 max-w-xs px-4 py-2.5 bg-secondary/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all text-foreground"
                >
                  <option value="">No overlay (raw graph)</option>
                  {learners.map((l) => (
                    <option key={l.userId} value={l.userId}>
                      {l.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>

          {/* Learner Overlay Legend */}
          <AnimatePresence>
            {overlay && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="glass-card p-5 mb-6 border-l-4 border-l-blue-500"
              >
                <h3 className="font-semibold text-foreground mb-3">
                  Viewing as: <span className="text-primary">{overlay.learnerName}</span>
                </h3>
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-emerald-500 rounded-md shadow-sm"></div>
                    <span className="text-muted-foreground">Mastered (&gt;80%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-amber-500 rounded-md shadow-sm"></div>
                    <span className="text-muted-foreground">Partial (40-80%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-500 rounded-md shadow-sm"></div>
                    <span className="text-muted-foreground">Gap (&lt;40%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-blue-500 bg-background rounded-md"></div>
                    <span className="text-muted-foreground">ZPD (Ready to learn)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-orange-500 rounded-md shadow-sm"></div>
                    <span className="text-muted-foreground">Needs Review</span>
                  </div>
                </div>
                {overlay.zpdConcepts.length > 0 && (
                  <div className="mt-3 text-sm">
                    <strong className="text-foreground">Recommended next:</strong>{' '}
                    <span className="text-primary">{overlay.zpdConcepts.join(', ')}</span>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Stats Cards */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
          >
            {statCards.map((card) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.label}
                  variants={itemVariants}
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
              <p className="text-muted-foreground">Loading graph...</p>
            </motion.div>
          ) : nodes.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-card p-12 text-center"
            >
              <Layers className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                No concepts in the graph yet. Add some concepts from the Concepts page.
              </p>
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
                  selectedConcept ? 'w-2/3' : 'w-full'
                )}
                style={{ height: '600px' }}
              >
                <ReactFlow
                  nodes={nodes}
                  edges={edges}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
                  onConnect={onConnect}
                  onNodeClick={onNodeClick}
                  nodeTypes={nodeTypes}
                  fitView
                  fitViewOptions={{ padding: 0.2 }}
                  defaultEdgeOptions={{
                    type: 'smoothstep',
                    markerEnd: { type: MarkerType.ArrowClosed },
                    style: { strokeWidth: 2 },
                  }}
                  className="bg-background/50"
                >
                  <Background className="!bg-transparent" />
                  <Controls className="!bg-card !border-border !rounded-xl !shadow-lg" />
                  <MiniMap
                    className="!bg-card/80 !border-border !rounded-xl"
                    nodeColor={(node) => {
                      const mastery = node.data?.mastery as number | undefined;
                      const domain = (node.data?.domain as string || '').toLowerCase();

                      if (mastery !== undefined) {
                        if (mastery >= 80) return '#22c55e';
                        if (mastery >= 40) return '#eab308';
                        if (mastery > 0) return '#ef4444';
                        return '#6b7280';
                      }

                      const domainColorMap: Record<string, string> = {
                        mathematics: '#3b82f6',
                        programming: '#a855f7',
                        science: '#22c55e',
                        language: '#eab308',
                        history: '#f59e0b',
                        art: '#ec4899',
                        music: '#6366f1',
                      };
                      return domainColorMap[domain] || '#9ca3af';
                    }}
                  />
                </ReactFlow>
              </div>

              {/* Details Panel */}
              <AnimatePresence>
                {selectedConcept && (
                  <motion.div
                    initial={{ opacity: 0, x: 20, width: 0 }}
                    animate={{ opacity: 1, x: 0, width: '33.333%' }}
                    exit={{ opacity: 0, x: 20, width: 0 }}
                    className="glass-card p-5 overflow-y-auto"
                    style={{ height: '600px' }}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-bold text-foreground">{selectedConcept.name}</h3>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => {
                          setSelectedConcept(null);
                          setNodes(prevNodes => prevNodes.map(n => ({
                            ...n,
                            data: { ...n.data, isSelected: false }
                          })));
                        }}
                        className="p-1.5 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
                      >
                        <X size={18} />
                      </motion.button>
                    </div>

                    <div className="space-y-4">
                      {/* Domain */}
                      <div className="flex items-center gap-2">
                        <BookOpen size={16} className="text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Domain:</span>
                        <span className="text-sm font-medium capitalize text-foreground">{selectedConcept.domain}</span>
                        {selectedConcept.subdomain && (
                          <span className="text-sm text-muted-foreground">/ {selectedConcept.subdomain}</span>
                        )}
                      </div>

                      {/* Description */}
                      {selectedConcept.description && (
                        <div className="rounded-xl bg-secondary/50 p-3">
                          <p className="text-sm text-foreground">{selectedConcept.description}</p>
                        </div>
                      )}

                      {/* Difficulty */}
                      {selectedConcept.difficulty && (
                        <div className="space-y-2">
                          <h4 className="text-sm font-semibold text-foreground">Difficulty</h4>
                          <div className="grid grid-cols-3 gap-2 text-xs">
                            <div className="rounded-xl bg-blue-500/10 p-2 text-center">
                              <div className="font-bold text-blue-600 dark:text-blue-400">{selectedConcept.difficulty.absolute}/10</div>
                              <div className="text-muted-foreground">Overall</div>
                            </div>
                            <div className="rounded-xl bg-purple-500/10 p-2 text-center">
                              <div className="font-bold text-purple-600 dark:text-purple-400">{(selectedConcept.difficulty.cognitiveLoad * 100).toFixed(0)}%</div>
                              <div className="text-muted-foreground">Cognitive Load</div>
                            </div>
                            <div className="rounded-xl bg-indigo-500/10 p-2 text-center">
                              <div className="font-bold text-indigo-600 dark:text-indigo-400">{(selectedConcept.difficulty.abstractness * 100).toFixed(0)}%</div>
                              <div className="text-muted-foreground">Abstractness</div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Mastery */}
                      {selectedConcept.mastery !== undefined && (
                        <div className="space-y-2">
                          <h4 className="text-sm font-semibold text-foreground">Learner Progress</h4>
                          <div className="bg-secondary rounded-full h-3 overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${selectedConcept.mastery}%` }}
                              transition={{ duration: 0.5, ease: 'easeOut' as const }}
                              className={cn(
                                'h-full rounded-full',
                                selectedConcept.mastery >= 80 ? 'bg-emerald-500' :
                                selectedConcept.mastery >= 40 ? 'bg-amber-500' : 'bg-red-500'
                              )}
                            />
                          </div>
                          <div className="text-center text-sm font-medium text-foreground">
                            {selectedConcept.mastery}% Mastery
                          </div>
                          {selectedConcept.isZPD && (
                            <div className="inline-block bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs px-3 py-1.5 rounded-lg">
                              🎯 In Zone of Proximal Development
                            </div>
                          )}
                          {selectedConcept.isForgotten && (
                            <div className="inline-block bg-orange-500/10 text-orange-600 dark:text-orange-400 text-xs px-3 py-1.5 rounded-lg ml-2">
                              ⏰ Needs Review (retention decay)
                            </div>
                          )}
                        </div>
                      )}

                      {/* Prerequisites */}
                      {selectedConcept.prerequisites && selectedConcept.prerequisites.length > 0 && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <GitBranch size={16} className="text-muted-foreground" />
                            <h4 className="text-sm font-semibold text-foreground">Prerequisites ({selectedConcept.prerequisites.length})</h4>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {selectedConcept.prerequisites.map((prereq, i) => (
                              <span key={i} className="bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs px-2.5 py-1 rounded-lg">
                                {prereq}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Dependents */}
                      {selectedConcept.dependents && selectedConcept.dependents.length > 0 && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Clock size={16} className="text-muted-foreground" />
                            <h4 className="text-sm font-semibold text-foreground">Unlocks ({selectedConcept.dependents.length})</h4>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {selectedConcept.dependents.map((dep, i) => (
                              <span key={i} className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs px-2.5 py-1 rounded-lg">
                                {dep}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Concept ID */}
                      <div className="text-xs text-muted-foreground pt-3 border-t border-border">
                        ID: <span className="font-mono">{selectedConcept.conceptId}</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* Domain Legend (when no learner overlay) */}
          <AnimatePresence>
            {!overlay && nodes.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: 0.4 }}
                className="glass-card p-5 mt-6"
              >
                <h4 className="text-sm font-semibold text-foreground mb-3">Domain Colors</h4>
                <div className="flex flex-wrap gap-4 text-sm">
                  {[
                    { name: 'Mathematics', color: 'bg-blue-400' },
                    { name: 'Programming', color: 'bg-purple-400' },
                    { name: 'Science', color: 'bg-green-400' },
                    { name: 'Language', color: 'bg-yellow-400' },
                    { name: 'History', color: 'bg-amber-400' },
                    { name: 'Art', color: 'bg-pink-400' },
                    { name: 'Music', color: 'bg-indigo-400' },
                    { name: 'Other', color: 'bg-gray-400' },
                  ].map((domain) => (
                    <div key={domain.name} className="flex items-center gap-2">
                      <div className={cn('w-4 h-4 rounded-md shadow-sm', domain.color)}></div>
                      <span className="text-muted-foreground">{domain.name}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  Click on any concept node to view details. Hover over nodes to see quick info.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
