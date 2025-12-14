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
  RefreshCw,
  Network,
  Brain,
  User,
  Layers,
  Eye,
  EyeOff,
  ArrowRight,
  BookOpen,
  X,
} from 'lucide-react';
import {
  ALL_DOMAIN_IDS,
  DOMAIN_METADATA,
} from '@/src/models/psychometrics';

// =============================================================================
// TYPES
// =============================================================================

interface LearnerProfile {
  userId: string;
  name: string;
  psychometricScores?: Record<string, { score: number; confidence: number }>;
}

interface ConceptNode {
  conceptId: string;
  name: string;
  domain: string;
  difficulty?: { absolute: number };
}

interface KnowledgeState {
  conceptId: string;
  mastery: number;
}

// =============================================================================
// CATEGORY MAPPING (from source of truth)
// =============================================================================

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

function getCanonicalCategory(detailedCategory: string): string {
  return CATEGORY_MAPPING[detailedCategory] || detailedCategory;
}

// =============================================================================
// COLOR SCHEMES
// =============================================================================

const DOMAIN_CATEGORY_COLORS: Record<string, string> = {
  'A. Core Personality': '#3b82f6',
  'B. Dark Personality': '#ef4444',
  'C. Emotional/Social Intelligence': '#ec4899',
  'D. Decision Making & Motivation': '#f59e0b',
  'E. Values & Wellbeing': '#22c55e',
  'F. Cognitive/Learning': '#06b6d4',
  'G. Social/Cultural/Values': '#8b5cf6',
  'H. Sensory/Aesthetic': '#f43f5e',
};

const CONCEPT_DOMAIN_COLORS: Record<string, string> = {
  mathematics: '#3b82f6',
  programming: '#a855f7',
  science: '#22c55e',
  language: '#eab308',
  history: '#f59e0b',
  art: '#ec4899',
  music: '#6366f1',
  default: '#9ca3af',
};

// =============================================================================
// CUSTOM NODES
// =============================================================================

function LearnerNode({ data }: { data: Record<string, unknown> }) {
  const isSelected = data.isSelected as boolean | undefined;
  const selectedStyles = isSelected ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : '';

  return (
    <div
      className={cn(
        'px-4 py-3 rounded-xl shadow-lg border-2 min-w-[140px] cursor-pointer',
        'transition-all duration-200 hover:shadow-xl hover:scale-105',
        'bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-950 dark:to-purple-950',
        'border-indigo-400',
        selectedStyles
      )}
    >
      <Handle type="source" position={Position.Right} className="w-3 h-3 !bg-indigo-500" />
      <div className="flex items-center gap-2 mb-1">
        <User size={16} className="text-indigo-600 dark:text-indigo-400" />
        <span className="font-bold text-indigo-700 dark:text-indigo-300">{data.label as string}</span>
      </div>
      <div className="text-xs text-muted-foreground">Learner Profile</div>
      {data.domainCount && (
        <div className="text-xs text-indigo-600 dark:text-indigo-400 mt-1">
          {data.domainCount as number} domains assessed
        </div>
      )}
    </div>
  );
}

function DomainNode({ data }: { data: Record<string, unknown> }) {
  const canonicalCategory = data.canonicalCategory as string;
  const score = data.score as number | undefined;
  const color = DOMAIN_CATEGORY_COLORS[canonicalCategory] || '#9ca3af';

  return (
    <div
      className={cn(
        'px-2 py-1 rounded-lg shadow-sm border min-w-[80px] cursor-pointer text-center',
        'transition-all duration-200 hover:shadow-md hover:scale-105',
        'bg-white/80 dark:bg-gray-800/80'
      )}
      style={{ borderColor: color }}
    >
      <Handle type="target" position={Position.Left} className="w-2 h-2" style={{ background: color }} />
      <div className="font-medium text-xs truncate" style={{ color }}>{data.label as string}</div>
      {score !== undefined && (
        <div className="text-[10px] text-muted-foreground">{score}%</div>
      )}
      <Handle type="source" position={Position.Right} className="w-2 h-2" style={{ background: color }} />
    </div>
  );
}

function ConceptNode({ data }: { data: Record<string, unknown> }) {
  const domain = (data.domain as string || '').toLowerCase();
  const mastery = data.mastery as number | undefined;
  const color = CONCEPT_DOMAIN_COLORS[domain] || CONCEPT_DOMAIN_COLORS.default;

  let bgOpacity = '20';
  if (mastery !== undefined) {
    if (mastery >= 80) bgOpacity = '40';
    else if (mastery >= 40) bgOpacity = '30';
    else bgOpacity = '20';
  }

  return (
    <div
      className={cn(
        'px-3 py-2 rounded-xl shadow-md border-2 min-w-[100px] cursor-pointer',
        'transition-all duration-200 hover:shadow-lg hover:scale-105'
      )}
      style={{
        borderColor: color,
        backgroundColor: `${color}${bgOpacity}`,
      }}
    >
      <Handle type="target" position={Position.Left} className="w-2 h-2" style={{ background: color }} />
      <Handle type="target" position={Position.Top} className="w-2 h-2" style={{ background: color }} />
      <div className="font-medium text-sm" style={{ color }}>{data.label as string}</div>
      <div className="text-xs text-muted-foreground capitalize">{data.domain as string}</div>
      {mastery !== undefined && (
        <div className="text-xs font-medium mt-1" style={{ color }}>
          {mastery}% mastery
        </div>
      )}
      <Handle type="source" position={Position.Right} className="w-2 h-2" style={{ background: color }} />
      <Handle type="source" position={Position.Bottom} className="w-2 h-2" style={{ background: color }} />
    </div>
  );
}

function BridgeNode({ data }: { data: Record<string, unknown> }) {
  return (
    <div
      className={cn(
        'px-3 py-2 rounded-lg shadow-md border-2 min-w-[100px] cursor-pointer text-center',
        'bg-gradient-to-r from-pink-100 to-orange-100 dark:from-pink-950 dark:to-orange-950',
        'border-pink-400'
      )}
    >
      <Handle type="target" position={Position.Left} className="w-2 h-2 !bg-pink-500" />
      <div className="font-bold text-xs text-pink-600 dark:text-pink-400">Knowledge State</div>
      <div className="text-[10px] text-muted-foreground">{data.label as string}</div>
      <div className="text-xs font-medium text-pink-600 dark:text-pink-400 mt-1">
        {data.mastery as number}% mastery
      </div>
      <Handle type="source" position={Position.Right} className="w-2 h-2 !bg-pink-500" />
    </div>
  );
}

const nodeTypes: NodeTypes = {
  learner: LearnerNode,
  domain: DomainNode,
  concept: ConceptNode,
  bridge: BridgeNode,
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function CombinedGraphPage() {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [loading, setLoading] = useState(true);
  const [learners, setLearners] = useState<LearnerProfile[]>([]);
  const [concepts, setConcepts] = useState<ConceptNode[]>([]);
  const [selectedLearner, setSelectedLearner] = useState('');
  const [selectedLearnerData, setSelectedLearnerData] = useState<LearnerProfile | null>(null);
  const [knowledgeStates, setKnowledgeStates] = useState<KnowledgeState[]>([]);

  // View toggles
  const [showDomains, setShowDomains] = useState(true);
  const [showConcepts, setShowConcepts] = useState(true);
  const [showBridges, setShowBridges] = useState(true);

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (selectedLearner) {
      fetchLearnerData(selectedLearner);
    } else {
      setSelectedLearnerData(null);
      setKnowledgeStates([]);
    }
  }, [selectedLearner]);

  useEffect(() => {
    buildGraph();
  }, [selectedLearnerData, knowledgeStates, showDomains, showConcepts, showBridges, concepts]);

  async function fetchInitialData() {
    try {
      const [learnersRes, conceptsRes] = await Promise.all([
        fetch('/api/learners'),
        fetch('/api/concepts'),
      ]);

      const learnersData = await learnersRes.json();
      const conceptsData = await conceptsRes.json();

      setLearners(Array.isArray(learnersData) ? learnersData : []);
      setConcepts(Array.isArray(conceptsData) ? conceptsData : []);
    } catch (err) {
      console.error('Failed to fetch initial data:', err);
    }
  }

  async function fetchLearnerData(userId: string) {
    try {
      setLoading(true);
      const [profileRes, statesRes] = await Promise.all([
        fetch(`/api/learners/${userId}`),
        fetch(`/api/knowledge-states?userId=${userId}`),
      ]);

      const profileData = await profileRes.json();
      const statesData = await statesRes.json();

      setSelectedLearnerData(profileData);
      setKnowledgeStates(Array.isArray(statesData) ? statesData : []);
    } catch (err) {
      console.error('Failed to fetch learner data:', err);
    } finally {
      setLoading(false);
    }
  }

  const buildGraph = useCallback(() => {
    if (!selectedLearnerData) {
      setNodes([]);
      setEdges([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const newNodes: Node[] = [];
    const newEdges: Edge[] = [];

    // Layout constants
    const learnerX = 100;
    const domainsStartX = 400;
    const conceptsStartX = 800;
    const bridgeX = 600;
    const ySpacing = 30;

    // 1. Add Learner Node (center-left)
    const domainCount = Object.keys(selectedLearnerData.psychometricScores || {}).length;
    newNodes.push({
      id: 'learner',
      type: 'learner',
      position: { x: learnerX, y: 300 },
      data: {
        label: selectedLearnerData.name,
        domainCount,
      },
    });

    // 2. Add Domain Nodes (Graph A)
    if (showDomains && selectedLearnerData.psychometricScores) {
      const scores = selectedLearnerData.psychometricScores;
      const assessedDomains = Object.keys(scores);

      assessedDomains.forEach((domainId, i) => {
        const metadata = DOMAIN_METADATA[domainId as keyof typeof DOMAIN_METADATA];
        if (!metadata) return;

        const canonicalCategory = getCanonicalCategory(metadata.category);
        const score = scores[domainId]?.score;

        newNodes.push({
          id: `domain-${domainId}`,
          type: 'domain',
          position: {
            x: domainsStartX + (i % 3) * 120,
            y: 50 + Math.floor(i / 3) * 60,
          },
          data: {
            label: metadata.name.substring(0, 15) + (metadata.name.length > 15 ? '...' : ''),
            canonicalCategory,
            score,
          },
        });

        // Edge from learner to domain
        newEdges.push({
          id: `learner-to-${domainId}`,
          source: 'learner',
          target: `domain-${domainId}`,
          type: 'smoothstep',
          style: { stroke: '#a855f7', strokeWidth: 1, opacity: 0.4 },
          animated: true,
        });
      });
    }

    // 3. Add Concept Nodes (Graph B)
    if (showConcepts && concepts.length > 0) {
      const masteryMap = new Map(knowledgeStates.map(ks => [ks.conceptId, ks.mastery]));

      concepts.slice(0, 20).forEach((concept, i) => { // Limit to 20 for visibility
        const mastery = masteryMap.get(concept.conceptId);

        newNodes.push({
          id: `concept-${concept.conceptId}`,
          type: 'concept',
          position: {
            x: conceptsStartX + (i % 4) * 150,
            y: 50 + Math.floor(i / 4) * 100,
          },
          data: {
            label: concept.name,
            domain: concept.domain,
            mastery,
          },
        });
      });
    }

    // 4. Add Knowledge State Bridges
    if (showBridges && knowledgeStates.length > 0) {
      knowledgeStates.slice(0, 10).forEach((ks, i) => { // Limit to 10 for visibility
        const concept = concepts.find(c => c.conceptId === ks.conceptId);
        if (!concept) return;

        const bridgeId = `bridge-${ks.conceptId}`;

        newNodes.push({
          id: bridgeId,
          type: 'bridge',
          position: {
            x: bridgeX,
            y: 500 + i * 70,
          },
          data: {
            label: concept.name,
            mastery: ks.mastery,
          },
        });

        // Edge from learner to bridge
        newEdges.push({
          id: `learner-to-bridge-${ks.conceptId}`,
          source: 'learner',
          target: bridgeId,
          type: 'smoothstep',
          style: { stroke: '#ec4899', strokeWidth: 2 },
          markerEnd: { type: MarkerType.ArrowClosed, color: '#ec4899' },
        });

        // Edge from bridge to concept
        if (showConcepts) {
          newEdges.push({
            id: `bridge-to-concept-${ks.conceptId}`,
            source: bridgeId,
            target: `concept-${ks.conceptId}`,
            type: 'smoothstep',
            style: { stroke: '#ec4899', strokeWidth: 2 },
            markerEnd: { type: MarkerType.ArrowClosed, color: '#ec4899' },
          });
        }
      });
    }

    setNodes(newNodes);
    setEdges(newEdges);
    setLoading(false);
  }, [selectedLearnerData, knowledgeStates, showDomains, showConcepts, showBridges, concepts, setNodes, setEdges]);

  const stats = useMemo(() => ({
    learners: learners.length,
    concepts: concepts.length,
    domains: ALL_DOMAIN_IDS.length,
    knowledgeStates: knowledgeStates.length,
  }), [learners, concepts, knowledgeStates]);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <main className="flex-1 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 pointer-events-none">
          <EtherealShadow
            color="rgba(168, 85, 247, 0.12)"
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
                className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg shadow-purple-500/25"
              >
                <Layers className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                  Combined Graph View
                </h1>
                <p className="text-muted-foreground">
                  Graph A (Domains) + Graph B (Concepts) + Knowledge State Bridge
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
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium shadow-lg shadow-primary/25"
              >
                <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                Refresh
              </motion.button>

              {/* Learner Selector */}
              <div className="flex items-center gap-3 flex-1">
                <User size={18} className="text-muted-foreground" />
                <label className="text-sm text-muted-foreground">Select Learner:</label>
                <select
                  value={selectedLearner}
                  onChange={(e) => setSelectedLearner(e.target.value)}
                  className="flex-1 max-w-xs px-4 py-2.5 bg-secondary/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-foreground"
                >
                  <option value="">Choose a learner...</option>
                  {learners.map((l) => (
                    <option key={l.userId} value={l.userId}>
                      {l.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* View Toggles */}
            <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-border">
              <span className="text-sm text-muted-foreground">Show:</span>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowDomains(!showDomains)}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all',
                  showDomains
                    ? 'bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-500/50'
                    : 'bg-secondary text-muted-foreground border border-transparent'
                )}
              >
                {showDomains ? <Eye size={16} /> : <EyeOff size={16} />}
                <Brain size={14} />
                Domains (Graph A)
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowConcepts(!showConcepts)}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all',
                  showConcepts
                    ? 'bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-500/50'
                    : 'bg-secondary text-muted-foreground border border-transparent'
                )}
              >
                {showConcepts ? <Eye size={16} /> : <EyeOff size={16} />}
                <Network size={14} />
                Concepts (Graph B)
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowBridges(!showBridges)}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all',
                  showBridges
                    ? 'bg-pink-500/20 text-pink-700 dark:text-pink-300 border border-pink-500/50'
                    : 'bg-secondary text-muted-foreground border border-transparent'
                )}
              >
                {showBridges ? <Eye size={16} /> : <EyeOff size={16} />}
                <ArrowRight size={14} />
                Knowledge States (Bridge)
              </motion.button>
            </div>
          </motion.div>

          {/* No Learner Selected Message */}
          {!selectedLearner ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-card p-12 text-center"
            >
              <User className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Select a Learner</h3>
              <p className="text-muted-foreground">
                Choose a learner from the dropdown above to visualize their complete profile across both graphs.
              </p>
            </motion.div>
          ) : loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-card p-12 text-center"
            >
              <RefreshCw className="w-8 h-8 text-muted-foreground animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Loading combined graph...</p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {/* Graph Container */}
              <div
                className="glass-card overflow-hidden"
                style={{ height: '600px' }}
              >
                <ReactFlow
                  nodes={nodes}
                  edges={edges}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
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
                      if (node.type === 'learner') return '#6366f1';
                      if (node.type === 'domain') {
                        const cat = node.data?.canonicalCategory as string;
                        return DOMAIN_CATEGORY_COLORS[cat] || '#9ca3af';
                      }
                      if (node.type === 'concept') {
                        const domain = (node.data?.domain as string || '').toLowerCase();
                        return CONCEPT_DOMAIN_COLORS[domain] || '#9ca3af';
                      }
                      if (node.type === 'bridge') return '#ec4899';
                      return '#9ca3af';
                    }}
                  />
                </ReactFlow>
              </div>

              {/* Legend */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="glass-card p-5 mt-6"
              >
                <h4 className="text-sm font-semibold text-foreground mb-4">Architecture Legend</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Graph A */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-purple-600 dark:text-purple-400">
                      <Brain size={16} />
                      Graph A: Learner Model
                    </div>
                    <div className="text-xs text-muted-foreground">
                      39 psychometric domains embedded in learner profile. Domains show scores (0-100) with confidence levels.
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="w-3 h-3 rounded bg-indigo-500" />
                      <span className="text-xs text-muted-foreground">Learner node</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded border-2 border-purple-400" />
                      <span className="text-xs text-muted-foreground">Domain nodes</span>
                    </div>
                  </div>

                  {/* Graph B */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400">
                      <Network size={16} />
                      Graph B: Knowledge Model
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Concepts with prerequisite edges. Each concept has difficulty and domain classification.
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="w-3 h-3 rounded border-2 border-blue-400" />
                      <span className="text-xs text-muted-foreground">Concept nodes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-0.5 bg-gray-400" />
                      <span className="text-xs text-muted-foreground">Prerequisite edges</span>
                    </div>
                  </div>

                  {/* Bridge */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-pink-600 dark:text-pink-400">
                      <ArrowRight size={16} />
                      Knowledge State Bridge
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Links learners to concepts with mastery levels. Enables ZPD computation and gap analysis.
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="w-3 h-3 rounded bg-pink-500" />
                      <span className="text-xs text-muted-foreground">Bridge node</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-0.5 bg-pink-500" />
                      <span className="text-xs text-muted-foreground">State edges</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}
