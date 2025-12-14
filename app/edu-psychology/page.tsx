'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from '../components/Sidebar';
import { EtherealShadow } from '@/components/ui/ethereal-shadow';
import {
  Brain,
  Layers,
  ArrowRight,
  Clock,
  Code,
  BookOpen,
  Target,
  TrendingDown,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  ExternalLink
} from 'lucide-react';

// ZPD Diagram Component
function ZPDDiagram() {
  return (
    <div className="relative w-full max-w-lg mx-auto">
      <svg viewBox="0 0 400 400" className="w-full h-auto">
        {/* Outer circle - Too Hard Zone */}
        <circle cx="200" cy="200" r="180" fill="#fee2e2" stroke="#ef4444" strokeWidth="2" />
        <text x="200" y="40" textAnchor="middle" className="fill-red-600 text-sm font-medium">
          Too Hard Zone
        </text>
        <text x="200" y="58" textAnchor="middle" className="fill-red-500 text-xs">
          (Frustration)
        </text>

        {/* Middle circle - ZPD */}
        <circle cx="200" cy="200" r="120" fill="#dcfce7" stroke="#22c55e" strokeWidth="3" />
        <text x="200" y="100" textAnchor="middle" className="fill-green-700 text-sm font-bold">
          Zone of Proximal Development
        </text>
        <text x="200" y="118" textAnchor="middle" className="fill-green-600 text-xs">
          (Optimal Learning)
        </text>

        {/* Inner circle - Already Mastered */}
        <circle cx="200" cy="200" r="60" fill="#dbeafe" stroke="#3b82f6" strokeWidth="2" />
        <text x="200" y="195" textAnchor="middle" className="fill-blue-700 text-sm font-medium">
          Mastered
        </text>
        <text x="200" y="213" textAnchor="middle" className="fill-blue-500 text-xs">
          (Too Easy)
        </text>

        {/* Arrows showing progression */}
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#6b7280" />
          </marker>
        </defs>
        <line x1="200" y1="260" x2="200" y2="310" stroke="#6b7280" strokeWidth="2" markerEnd="url(#arrowhead)" strokeDasharray="5,5" />
        <text x="240" y="290" className="fill-gray-600 text-xs">Learn here!</text>
      </svg>
    </div>
  );
}

// Bloom's Taxonomy Pyramid
function BloomsPyramid() {
  const levels = [
    { name: 'Create', color: '#7c3aed', desc: 'Design, construct, produce', width: 60 },
    { name: 'Evaluate', color: '#8b5cf6', desc: 'Judge, critique, justify', width: 100 },
    { name: 'Analyze', color: '#a78bfa', desc: 'Compare, organize, deconstruct', width: 140 },
    { name: 'Apply', color: '#c4b5fd', desc: 'Use, implement, solve', width: 180 },
    { name: 'Understand', color: '#ddd6fe', desc: 'Explain, summarize, classify', width: 220 },
    { name: 'Remember', color: '#ede9fe', desc: 'Recall, recognize, list', width: 260 },
  ];

  return (
    <div className="flex flex-col items-center space-y-1">
      {levels.map((level, idx) => (
        <div key={level.name} className="flex items-center gap-4">
          <div
            className="py-2 px-4 text-center rounded-sm text-white font-medium shadow-md transition-transform hover:scale-105"
            style={{
              backgroundColor: level.color,
              width: `${level.width}px`,
              color: idx > 3 ? '#4c1d95' : 'white'
            }}
          >
            {level.name}
          </div>
          <span className="text-xs text-muted-foreground w-40">{level.desc}</span>
        </div>
      ))}
      <div className="mt-4 text-center">
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <ArrowRight className="rotate-[-90deg]" size={16} />
          <span>Higher-order thinking</span>
        </div>
      </div>
    </div>
  );
}

// Scaffolding Visual
function ScaffoldingVisual() {
  const strategies = [
    { name: 'Breaking Down', icon: '🧩', desc: 'Chunk complex tasks', psych: 'Working Memory Capacity' },
    { name: 'Visual Aids', icon: '🎨', desc: 'Diagrams & charts', psych: 'Visual Learning Style' },
    { name: 'Step-by-Step', icon: '📝', desc: 'Sequential guidance', psych: 'Need for Cognition' },
    { name: 'Examples First', icon: '💡', desc: 'Show before tell', psych: 'Concrete Sequential' },
    { name: 'Encouragement', icon: '🌟', desc: 'Positive reinforcement', psych: 'Self-Efficacy' },
    { name: 'Spaced Practice', icon: '⏰', desc: 'Distributed learning', psych: 'Memory Consolidation' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {strategies.map((s) => (
        <div key={s.name} className="bg-amber-500/10 dark:bg-amber-500/20 border border-amber-500/30 rounded-lg p-4 hover:shadow-md transition-shadow">
          <div className="text-3xl mb-2">{s.icon}</div>
          <h4 className="font-semibold text-amber-700 dark:text-amber-300">{s.name}</h4>
          <p className="text-sm text-amber-600 dark:text-amber-400">{s.desc}</p>
          <p className="text-xs text-amber-500 dark:text-amber-500 mt-2 italic">Based on: {s.psych}</p>
        </div>
      ))}
    </div>
  );
}

// Forgetting Curve Chart
function ForgettingCurve() {
  return (
    <div className="relative">
      <svg viewBox="0 0 500 250" className="w-full h-auto">
        {/* Grid */}
        <defs>
          <pattern id="grid" width="50" height="25" patternUnits="userSpaceOnUse">
            <path d="M 50 0 L 0 0 0 25" fill="none" stroke="#e5e7eb" strokeWidth="0.5"/>
          </pattern>
        </defs>
        <rect x="50" y="20" width="400" height="200" fill="url(#grid)" />

        {/* Axes */}
        <line x1="50" y1="220" x2="450" y2="220" stroke="#374151" strokeWidth="2" />
        <line x1="50" y1="20" x2="50" y2="220" stroke="#374151" strokeWidth="2" />

        {/* Y-axis label */}
        <text x="25" y="120" textAnchor="middle" transform="rotate(-90, 25, 120)" className="fill-gray-600 text-sm">
          Retention %
        </text>

        {/* X-axis label */}
        <text x="250" y="245" textAnchor="middle" className="fill-gray-600 text-sm">
          Time
        </text>

        {/* Forgetting curve (no reviews) */}
        <path
          d="M 50 30 Q 100 80, 150 150 Q 200 180, 300 200 Q 400 210, 450 215"
          fill="none"
          stroke="#ef4444"
          strokeWidth="3"
          strokeDasharray="8,4"
        />

        {/* With spaced repetition */}
        <path
          d="M 50 30 Q 80 60, 100 80 L 100 40 Q 140 70, 180 90 L 180 50 Q 240 80, 280 95 L 280 60 Q 360 85, 450 90"
          fill="none"
          stroke="#22c55e"
          strokeWidth="3"
        />

        {/* Review points */}
        <circle cx="100" cy="40" r="6" fill="#22c55e" />
        <circle cx="180" cy="50" r="6" fill="#22c55e" />
        <circle cx="280" cy="60" r="6" fill="#22c55e" />

        {/* Legend */}
        <line x1="280" y1="30" x2="310" y2="30" stroke="#ef4444" strokeWidth="3" strokeDasharray="8,4" />
        <text x="315" y="34" className="fill-gray-600 text-xs">Without review</text>

        <line x1="280" y1="50" x2="310" y2="50" stroke="#22c55e" strokeWidth="3" />
        <text x="315" y="54" className="fill-gray-600 text-xs">With spaced repetition</text>

        <circle cx="295" cy="70" r="4" fill="#22c55e" />
        <text x="315" y="74" className="fill-gray-600 text-xs">Review session</text>
      </svg>
    </div>
  );
}

// Complete 39 Psychometric Domains - organized by category
const ALL_PSYCHOMETRIC_DOMAINS = {
  'Big Five Personality': {
    color: '#8b5cf6',
    icon: '🎭',
    domains: [
      { id: 'big_five_openness', name: 'Openness to Experience', desc: 'Curiosity, creativity, preference for novelty', markers: ['Abstract language', 'Creative vocabulary', 'Philosophical questions'], eduRelevance: 'Enjoys theoretical content, interdisciplinary connections' },
      { id: 'big_five_conscientiousness', name: 'Conscientiousness', desc: 'Organization, dependability, self-discipline', markers: ['Structured writing', 'Goal-oriented language', 'Planning vocabulary'], eduRelevance: 'Benefits from structured curricula, checklists, clear deadlines' },
      { id: 'big_five_extraversion', name: 'Extraversion', desc: 'Sociability, assertiveness, stimulation-seeking', markers: ['Social references', 'Active voice', 'Enthusiastic tone'], eduRelevance: 'Thrives in group work, discussions vs solo study' },
      { id: 'big_five_agreeableness', name: 'Agreeableness', desc: 'Cooperation, trust, consideration for others', markers: ['Collaborative language', 'Empathetic statements', 'Conflict avoidance'], eduRelevance: 'Collaborative learning, peer tutoring effectiveness' },
      { id: 'big_five_neuroticism', name: 'Neuroticism', desc: 'Emotional instability, anxiety, negative affect', markers: ['Anxiety indicators', 'Hedging language', 'Self-doubt expressions'], eduRelevance: 'Needs supportive feedback, lower-stakes practice' },
    ]
  },
  'Dark Triad': {
    color: '#1f2937',
    icon: '🌑',
    domains: [
      { id: 'dark_triad_narcissism', name: 'Narcissism', desc: 'Self-importance, need for admiration', markers: ['Self-focused language', 'Achievement emphasis', 'Superiority claims'], eduRelevance: 'Motivated by recognition, leaderboards, visible achievements' },
      { id: 'dark_triad_machiavellianism', name: 'Machiavellianism', desc: 'Strategic thinking, pragmatism, self-interest', markers: ['Strategic vocabulary', 'Outcome focus', 'Pragmatic reasoning'], eduRelevance: 'Motivated by clear ROI, practical applications' },
      { id: 'dark_triad_psychopathy', name: 'Psychopathy', desc: 'Boldness, fearlessness, reduced emotional reactivity', markers: ['Risk-taking language', 'Emotional detachment', 'Impulsive statements'], eduRelevance: 'Unfazed by failure, may need explicit ethical frameworks' },
    ]
  },
  'Emotional Intelligence': {
    color: '#ec4899',
    icon: '💗',
    domains: [
      { id: 'emotional_empathy', name: 'Empathy', desc: 'Understanding and sharing others\' feelings', markers: ['Perspective-taking', 'Emotional vocabulary', 'Compassionate responses'], eduRelevance: 'Benefits from case studies, human stories vs data-driven' },
      { id: 'emotional_intelligence', name: 'Emotional Intelligence', desc: 'Perceiving, using, understanding emotions', markers: ['Emotional awareness', 'Self-regulation language', 'Social awareness'], eduRelevance: 'Self-directed learning capacity, emotional scaffolding needs' },
      { id: 'attachment_style', name: 'Attachment Style', desc: 'Pattern of relating to others in relationships', markers: ['Relationship references', 'Trust indicators', 'Independence/dependence'], eduRelevance: 'Affects mentor relationships, help-seeking behavior' },
      { id: 'love_languages', name: 'Love Languages', desc: 'Preferred ways of expressing/receiving appreciation', markers: ['Appreciation expressions', 'Recognition preferences', 'Service orientation'], eduRelevance: 'Informs feedback style - words, time, acts of service' },
    ]
  },
  'Communication & Social': {
    color: '#06b6d4',
    icon: '💬',
    domains: [
      { id: 'communication_style', name: 'Communication Style', desc: 'Preferred mode and style of communication', markers: ['Direct vs indirect', 'Formal vs casual', 'Verbal complexity'], eduRelevance: 'Written vs verbal, direct vs exploratory instruction' },
      { id: 'social_support', name: 'Social Support', desc: 'Perception of available support from networks', markers: ['Community references', 'Support-seeking', 'Isolation indicators'], eduRelevance: 'May benefit from peer matching, community features' },
    ]
  },
  'Decision Making & Risk': {
    color: '#f97316',
    icon: '🎯',
    domains: [
      { id: 'risk_tolerance', name: 'Risk Tolerance', desc: 'Willingness to accept uncertainty and losses', markers: ['Risk language', 'Certainty-seeking', 'Adventure vocabulary'], eduRelevance: 'Open to challenging problems vs needs safe practice space' },
      { id: 'decision_style', name: 'Decision Style', desc: 'Intuitive vs analytical decision approach', markers: ['Reasoning patterns', 'Data references', 'Gut feeling mentions'], eduRelevance: 'Appreciates data/evidence vs examples/analogies' },
      { id: 'time_orientation', name: 'Time Orientation', desc: 'Focus on past, present, or future', markers: ['Temporal references', 'Planning language', 'Nostalgia/anticipation'], eduRelevance: 'Long-term goals motivation vs needs immediate relevance' },
      { id: 'locus_of_control', name: 'Locus of Control', desc: 'Belief about control over life outcomes', markers: ['Agency language', 'Blame attribution', 'Self-efficacy statements'], eduRelevance: 'Self-directed vs needs more guidance and attribution' },
    ]
  },
  'Motivation & Achievement': {
    color: '#22c55e',
    icon: '🚀',
    domains: [
      { id: 'achievement_motivation', name: 'Achievement Motivation', desc: 'Drive to accomplish challenging goals', markers: ['Goal language', 'Competition references', 'Success orientation'], eduRelevance: 'Responds to challenges, mastery goals, progress tracking' },
      { id: 'self_efficacy', name: 'Self-Efficacy', desc: 'Belief in ability to succeed in situations', markers: ['Confidence expressions', 'Competence claims', 'Challenge approach'], eduRelevance: 'Needs scaffolding, success experiences, encouragement' },
      { id: 'growth_mindset', name: 'Growth Mindset', desc: 'Belief that abilities develop through effort', markers: ['Effort attribution', 'Learning orientation', 'Failure framing'], eduRelevance: 'Embraces challenges vs avoids difficulty' },
      { id: 'authenticity', name: 'Authenticity', desc: 'Self-awareness and genuine self-expression', markers: ['Self-reflection', 'Value statements', 'Identity language'], eduRelevance: 'Self-directed goals vs needs help identifying interests' },
    ]
  },
  'Values & Interests': {
    color: '#a855f7',
    icon: '⭐',
    domains: [
      { id: 'personal_values', name: 'Personal Values', desc: 'Core beliefs and priorities guiding behavior', markers: ['Value statements', 'Priority indicators', 'Moral language'], eduRelevance: 'Connect learning to personal values for motivation' },
      { id: 'interests', name: 'Interests', desc: 'Areas of curiosity and preferred activities', markers: ['Topic enthusiasm', 'Hobby references', 'Curiosity expressions'], eduRelevance: 'Enables personalized content recommendations' },
      { id: 'life_satisfaction', name: 'Life Satisfaction', desc: 'Overall contentment with life circumstances', markers: ['Satisfaction expressions', 'Gratitude language', 'Complaint patterns'], eduRelevance: 'Affects motivation framing - escape vs improvement' },
    ]
  },
  'Coping & Wellbeing': {
    color: '#14b8a6',
    icon: '🧘',
    domains: [
      { id: 'stress_coping', name: 'Stress Coping', desc: 'Strategies for managing stress and adversity', markers: ['Coping mechanisms', 'Stress language', 'Resilience indicators'], eduRelevance: 'Needs breaks, stress management, cognitive load management' },
    ]
  },
  'Cognitive': {
    color: '#3b82f6',
    icon: '🧠',
    domains: [
      { id: 'cognitive_abilities', name: 'Cognitive Abilities', desc: 'General mental capabilities, reasoning', markers: ['Reasoning complexity', 'Abstraction level', 'Problem-solving approach'], eduRelevance: 'Affects pace, complexity, abstraction level of content' },
      { id: 'creativity', name: 'Creativity', desc: 'Ability to generate novel and useful ideas', markers: ['Original ideas', 'Unusual connections', 'Divergent thinking'], eduRelevance: 'Open-ended projects vs structured assignments' },
      { id: 'learning_styles', name: 'Learning Styles', desc: 'Preferred modalities for acquiring information', markers: ['Visual references', 'Hands-on preferences', 'Reading habits'], eduRelevance: 'Content format - videos, text, hands-on activities' },
      { id: 'information_processing', name: 'Information Processing', desc: 'How information is encoded/stored/retrieved', markers: ['Sequential vs holistic', 'Detail focus', 'Big picture references'], eduRelevance: 'Linear curricula vs concept maps, overviews first' },
      { id: 'metacognition', name: 'Metacognition', desc: 'Awareness and control of thinking processes', markers: ['Self-monitoring', 'Strategy awareness', 'Reflection language'], eduRelevance: 'Self-regulated vs needs explicit strategy instruction' },
      { id: 'executive_functions', name: 'Executive Functions', desc: 'Planning, focus, and task management skills', markers: ['Organization language', 'Planning references', 'Focus indicators'], eduRelevance: 'Needs external structure, reminders, chunked tasks' },
    ]
  },
  'Social Cognition': {
    color: '#f59e0b',
    icon: '👥',
    domains: [
      { id: 'social_cognition', name: 'Social Cognition', desc: 'Understanding social situations and mental states', markers: ['Social awareness', 'Theory of mind', 'Perspective-taking'], eduRelevance: 'Affects group work dynamics, feedback interpretation' },
    ]
  },
  'Worldview': {
    color: '#64748b',
    icon: '🌍',
    domains: [
      { id: 'political_ideology', name: 'Political Ideology', desc: 'Political beliefs and values orientation', markers: ['Political vocabulary', 'Authority attitudes', 'Change orientation'], eduRelevance: 'Affects framing of social topics, example sensitivity' },
      { id: 'cultural_values', name: 'Cultural Values', desc: 'Collectivism vs individualism orientation', markers: ['Group vs individual', 'Tradition references', 'Cultural identity'], eduRelevance: 'Group work vs personal achievement focus' },
      { id: 'moral_reasoning', name: 'Moral Reasoning', desc: 'Ethical framework and moral development level', markers: ['Ethical language', 'Justice reasoning', 'Principle references'], eduRelevance: 'Affects ethical discussions, case study interpretation' },
    ]
  },
  'Work & Lifestyle': {
    color: '#84cc16',
    icon: '💼',
    domains: [
      { id: 'work_career_style', name: 'Work/Career Style', desc: 'Work preferences and career orientations', markers: ['Career references', 'Work-life balance', 'Autonomy preferences'], eduRelevance: 'Practical skills vs theoretical vs entrepreneurial focus' },
      { id: 'sensory_processing', name: 'Sensory Processing', desc: 'Sensitivity to sensory stimulation', markers: ['Sensory descriptions', 'Overwhelm indicators', 'Stimulation-seeking'], eduRelevance: 'Clean UI, calm colors vs more stimulating design' },
      { id: 'aesthetic_preferences', name: 'Aesthetic Preferences', desc: 'Preferences for visual style and design', markers: ['Aesthetic vocabulary', 'Design appreciation', 'Beauty references'], eduRelevance: 'Content presentation matters, values well-designed materials' },
    ]
  },
};

// Psychometric Domains - Full 39 Domain Display
function PsychometricWheel() {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const categories = Object.entries(ALL_PSYCHOMETRIC_DOMAINS);
  const totalDomains = categories.reduce((sum, [, cat]) => sum + cat.domains.length, 0);

  return (
    <div className="space-y-4">
      {/* Summary Stats */}
      <div className="flex items-center justify-between bg-pink-500/10 dark:bg-pink-500/20 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-pink-500 flex items-center justify-center text-white font-bold text-lg">
            {totalDomains}
          </div>
          <div>
            <p className="font-semibold text-foreground">Psychometric Domains</p>
            <p className="text-sm text-muted-foreground">{categories.length} categories tracked for personalization</p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground max-w-xs text-right">
          Click any category to see domains, linguistic markers, and educational applications
        </p>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {categories.map(([categoryName, category]) => (
          <button
            key={categoryName}
            onClick={() => setExpandedCategory(expandedCategory === categoryName ? null : categoryName)}
            className={`text-left p-4 rounded-xl border-2 transition-all duration-200 ${
              expandedCategory === categoryName
                ? 'border-pink-500 bg-pink-500/10 dark:bg-pink-500/20 shadow-lg scale-[1.02]'
                : 'border-border hover:border-muted-foreground/50 hover:bg-muted/50'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{category.icon}</span>
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: category.color }}
              />
            </div>
            <h4 className="font-semibold text-foreground text-sm">{categoryName}</h4>
            <p className="text-xs text-muted-foreground mt-1">
              {category.domains.length} domain{category.domains.length > 1 ? 's' : ''}
            </p>
          </button>
        ))}
      </div>

      {/* Expanded Category Details */}
      {expandedCategory && (
        <div className="mt-6 glass-card rounded-xl border border-border shadow-lg overflow-hidden">
          <div
            className="px-6 py-4 flex items-center gap-3"
            style={{ backgroundColor: ALL_PSYCHOMETRIC_DOMAINS[expandedCategory as keyof typeof ALL_PSYCHOMETRIC_DOMAINS].color + '15' }}
          >
            <span className="text-3xl">{ALL_PSYCHOMETRIC_DOMAINS[expandedCategory as keyof typeof ALL_PSYCHOMETRIC_DOMAINS].icon}</span>
            <div>
              <h3 className="text-lg font-bold text-foreground">{expandedCategory}</h3>
              <p className="text-sm text-muted-foreground">
                {ALL_PSYCHOMETRIC_DOMAINS[expandedCategory as keyof typeof ALL_PSYCHOMETRIC_DOMAINS].domains.length} domains
              </p>
            </div>
          </div>

          <div className="divide-y divide-border">
            {ALL_PSYCHOMETRIC_DOMAINS[expandedCategory as keyof typeof ALL_PSYCHOMETRIC_DOMAINS].domains.map((domain) => (
              <div key={domain.id} className="p-4 hover:bg-muted/50">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground">{domain.name}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{domain.desc}</p>

                    {/* Markers */}
                    <div className="mt-3">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Linguistic Markers</p>
                      <div className="flex flex-wrap gap-1">
                        {domain.markers.map((marker) => (
                          <span key={marker} className="px-2 py-0.5 bg-muted text-muted-foreground rounded text-xs">
                            {marker}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Educational Relevance */}
                  <div className="w-64 flex-shrink-0 bg-green-500/10 dark:bg-green-500/20 rounded-lg p-3">
                    <p className="text-xs font-medium text-green-700 dark:text-green-300 uppercase tracking-wide mb-1">📚 Educational Impact</p>
                    <p className="text-sm text-green-700 dark:text-green-300">{domain.eduRelevance}</p>
                  </div>
                </div>

                {/* Domain ID */}
                <div className="mt-2">
                  <code className="text-xs bg-gray-900 text-green-400 px-2 py-0.5 rounded">{domain.id}</code>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Domains Quick Reference */}
      {!expandedCategory && (
        <div className="mt-6 bg-muted/50 rounded-xl p-4">
          <h4 className="font-semibold text-foreground mb-3">All 39 Domains Quick Reference</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 text-xs">
            {categories.flatMap(([categoryName, category]) =>
              category.domains.map((domain) => (
                <div
                  key={domain.id}
                  className="flex items-center gap-2 p-2 bg-background rounded border border-border"
                >
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="text-muted-foreground truncate" title={domain.name}>{domain.name}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Code Location Component
function CodeLocation({ file, description, endpoint }: { file: string; description: string; endpoint?: string }) {
  return (
    <div className="bg-gray-900 rounded-lg p-4 mt-4">
      <div className="flex items-center gap-2 mb-2">
        <Code size={16} className="text-green-400" />
        <span className="text-green-400 font-mono text-sm">Where it lives in LearnGraph</span>
      </div>
      <div className="font-mono text-sm">
        <div className="text-blue-400">📁 {file}</div>
        <div className="text-gray-400 mt-1 ml-4">{description}</div>
        {endpoint && (
          <div className="text-purple-400 mt-2">
            🔗 API: <span className="text-yellow-300">{endpoint}</span>
          </div>
        )}
      </div>
    </div>
  );
}

// Expandable Section
function ExpandableSection({
  title,
  icon: Icon,
  color,
  children
}: {
  title: string;
  icon: React.ElementType;
  color: string;
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass-card overflow-hidden mb-8"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-xl ${color}`}>
            <Icon size={24} className="text-white" />
          </div>
          <h2 className="text-xl font-bold text-foreground">{title}</h2>
        </div>
        <ChevronDown size={24} className={`text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="px-6 pb-6"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function EduPsychologyPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <main className="flex-1 relative overflow-hidden">
        {/* Background Effect */}
        <div className="absolute inset-0 pointer-events-none">
          <EtherealShadow
            color="rgba(168, 85, 247, 0.12)"
            animation={{ scale: 30, speed: 40 }}
            noise={{ opacity: 0.3, scale: 0.8 }}
          />
        </div>

        <div className="relative z-10 px-8 py-10 max-w-6xl mx-auto overflow-auto h-screen">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 rounded-xl bg-purple-500/10">
                <Brain className="w-8 h-8 text-purple-500" />
              </div>
              <h1 className="text-3xl font-bold text-foreground">Educational Psychology</h1>
            </div>
            <p className="text-muted-foreground max-w-3xl ml-14">
              The science behind personalized learning. Each concept below is implemented in LearnGraph
              to create adaptive, effective educational experiences tailored to each learner.
            </p>
          </motion.div>

        {/* ZPD Section */}
        <ExpandableSection title="Zone of Proximal Development (ZPD)" icon={Target} color="bg-green-500">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-lg text-foreground mb-3">What is it?</h3>
              <p className="text-muted-foreground mb-4">
                Developed by psychologist <strong className="text-foreground">Lev Vygotsky</strong>, the ZPD is the sweet spot between
                what a learner can do independently and what they cannot do even with help.
              </p>

              <div className="bg-green-500/10 border-l-4 border-green-500 p-4 rounded-r-lg mb-4">
                <p className="text-green-700 dark:text-green-300">
                  <strong>Key Insight:</strong> Learning happens most effectively when content is
                  challenging enough to stretch the learner, but not so difficult that it causes frustration.
                </p>
              </div>

              <h3 className="font-semibold text-lg text-foreground mb-3">How LearnGraph uses it</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>Compares learner's mastery levels against concept prerequisites</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>Partitions concepts into "too easy", "ZPD", and "too hard" zones</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>Recommends concepts in the ZPD for optimal learning</span>
                </li>
              </ul>
            </div>
            <div>
              <ZPDDiagram />
            </div>
          </div>

          <CodeLocation
            file="src/db/EducationGraphDB.ts → computeZPD()"
            description="Calculates ZPD by checking prerequisite mastery and concept difficulty"
            endpoint="/api/zpd?learnerId=xxx"
          />
        </ExpandableSection>

        {/* Bloom's Taxonomy Section */}
        <ExpandableSection title="Bloom's Taxonomy" icon={Layers} color="bg-purple-500">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-lg text-foreground mb-3">What is it?</h3>
              <p className="text-muted-foreground mb-4">
                A hierarchical framework created by <strong className="text-foreground">Benjamin Bloom</strong> that classifies
                cognitive skills from basic recall to complex creation.
              </p>

              <div className="bg-purple-500/10 border-l-4 border-purple-500 p-4 rounded-r-lg mb-4">
                <p className="text-purple-700 dark:text-purple-300">
                  <strong>Key Insight:</strong> Learners must master lower levels before progressing
                  to higher-order thinking skills. You can&apos;t analyze what you don&apos;t understand.
                </p>
              </div>

              <h3 className="font-semibold text-lg text-foreground mb-3">How LearnGraph uses it</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 mt-1">✓</span>
                  <span>Each concept has a <code className="bg-muted px-1 rounded">bloomLevel</code> (1-6)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 mt-1">✓</span>
                  <span>Mastery tracking considers which cognitive level is being assessed</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 mt-1">✓</span>
                  <span>Learning paths progress through levels appropriately</span>
                </li>
              </ul>
            </div>
            <div className="flex items-center justify-center">
              <BloomsPyramid />
            </div>
          </div>

          <CodeLocation
            file="src/models/types.ts → ConceptNode.bloomLevel"
            description="Each concept stores its Bloom level (1=Remember, 6=Create)"
            endpoint="/api/concepts"
          />
        </ExpandableSection>

        {/* Scaffolding Section */}
        <ExpandableSection title="Scaffolding Strategies" icon={BookOpen} color="bg-amber-500">
          <div className="mb-6">
            <h3 className="font-semibold text-lg text-foreground mb-3">What is it?</h3>
            <p className="text-muted-foreground mb-4">
              <strong className="text-foreground">Instructional scaffolding</strong> provides temporary support structures that help
              learners achieve tasks they couldn't complete independently. The support is gradually
              removed as competence increases.
            </p>

            <div className="bg-amber-500/10 border-l-4 border-amber-500 p-4 rounded-r-lg mb-6">
              <p className="text-amber-700 dark:text-amber-300">
                <strong>Key Insight:</strong> Different learners need different types of scaffolding
                based on their cognitive profile, learning style, and emotional state.
              </p>
            </div>
          </div>

          <h3 className="font-semibold text-lg text-foreground mb-4">Scaffolding Types in LearnGraph</h3>
          <ScaffoldingVisual />

          <CodeLocation
            file="src/db/EducationGraphDB.ts → selectScaffoldingStrategies()"
            description="Selects scaffolding based on learner's psychometric profile (39 domains)"
            endpoint="/api/zpd?learnerId=xxx (returns scaffolding recommendations)"
          />
        </ExpandableSection>

        {/* Forgetting Curve Section */}
        <ExpandableSection title="Forgetting Curve & Spaced Repetition" icon={Clock} color="bg-red-500">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-lg text-foreground mb-3">What is it?</h3>
              <p className="text-muted-foreground mb-4">
                Discovered by <strong className="text-foreground">Hermann Ebbinghaus</strong>, the forgetting curve shows how
                memory retention decays exponentially over time without reinforcement.
              </p>

              <div className="bg-red-500/10 border-l-4 border-red-500 p-4 rounded-r-lg mb-4">
                <p className="text-red-700 dark:text-red-300">
                  <strong>Key Insight:</strong> Strategically timed reviews (spaced repetition) can
                  dramatically improve long-term retention while minimizing study time.
                </p>
              </div>

              <h3 className="font-semibold text-lg text-foreground mb-3">How LearnGraph will use it</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">○</span>
                  <span><code className="bg-muted px-1 rounded">predictDecay()</code> - Estimates current retention</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">○</span>
                  <span><code className="bg-muted px-1 rounded">scheduleNextReview()</code> - Optimal review timing</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">○</span>
                  <span>Review queue prioritizing concepts near decay threshold</span>
                </li>
              </ul>

              <div className="mt-4 bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
                  <RefreshCw size={16} />
                  <span className="font-medium">✓ Implemented in Phase 5</span>
                </div>
                <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                  Visit <a href="/gaps" className="underline font-medium hover:text-green-800 dark:hover:text-green-200">/gaps</a> to see the dashboard
                </p>
              </div>
            </div>
            <div>
              <ForgettingCurve />
            </div>
          </div>

          <CodeLocation
            file="src/db/EducationGraphDB.ts → predictDecay() [Phase 5]"
            description="Will calculate retention based on time since last review and difficulty"
            endpoint="/api/review-queue [Coming Soon]"
          />
        </ExpandableSection>

        {/* Psychometrics Section */}
        <ExpandableSection title="Psychometric Profiling (39 Domains)" icon={Brain} color="bg-pink-500">
          <div className="mb-6">
            <h3 className="font-semibold text-lg text-foreground mb-3">What is it?</h3>
            <p className="text-muted-foreground mb-4">
              LearnGraph tracks <strong className="text-foreground">39 psychological domains</strong> for each learner, covering
              cognitive abilities, personality traits, learning preferences, emotional factors, and
              motivational characteristics.
            </p>

            <div className="bg-pink-500/10 border-l-4 border-pink-500 p-4 rounded-r-lg mb-6">
              <p className="text-pink-700 dark:text-pink-300">
                <strong>Key Insight:</strong> Knowing a learner's cognitive capacity, emotional state,
                and learning preferences allows for truly personalized instruction—not one-size-fits-all.
              </p>
            </div>
          </div>

          <h3 className="font-semibold text-lg text-foreground mb-4">Domain Categories</h3>
          <PsychometricWheel />

          <div className="mt-6 grid md:grid-cols-2 gap-4">
            <div className="bg-muted/50 rounded-lg p-4">
              <h4 className="font-semibold text-foreground mb-2">Data Sources</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Fine-tuned AI analysis of writing</li>
                <li>• Traditional assessments (Big Five, etc.)</li>
                <li>• User self-report</li>
                <li>• Behavioral inference over time</li>
              </ul>
            </div>
            <div className="bg-muted/50 rounded-lg p-4">
              <h4 className="font-semibold text-foreground mb-2">How It's Used</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Adjusts ZPD boundaries</li>
                <li>• Selects scaffolding strategies</li>
                <li>• Personalizes content delivery</li>
                <li>• Informs RAG context for LLMs</li>
              </ul>
            </div>
          </div>

          <CodeLocation
            file="src/models/types.ts → LearnerProfile.psychometrics"
            description="Stores 39 domain scores with confidence levels for each learner"
            endpoint="/api/learners/:id"
          />
        </ExpandableSection>

        {/* Knowledge Graph Section */}
        <ExpandableSection title="Knowledge Graph & Prerequisites" icon={Target} color="bg-blue-500">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-lg text-foreground mb-3">What is it?</h3>
              <p className="text-muted-foreground mb-4">
                A <strong className="text-foreground">directed graph</strong> where nodes are concepts and edges represent
                prerequisite relationships. This enables understanding of learning dependencies
                and optimal sequencing.
              </p>

              <div className="bg-blue-500/10 border-l-4 border-blue-500 p-4 rounded-r-lg mb-4">
                <p className="text-blue-700 dark:text-blue-300">
                  <strong>Key Insight:</strong> Learning has structure. You can't understand calculus
                  without algebra, or algebra without arithmetic. The graph captures this structure.
                </p>
              </div>

              <h3 className="font-semibold text-lg text-foreground mb-3">Graph Operations</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">✓</span>
                  <span><code className="bg-muted px-1 rounded">getPrerequisites()</code> - What must come first</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">✓</span>
                  <span><code className="bg-muted px-1 rounded">getDependents()</code> - What this unlocks</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">✓</span>
                  <span><code className="bg-muted px-1 rounded">generateLearningPath()</code> - Optimal route to goal</span>
                </li>
              </ul>
            </div>
            <div className="flex items-center justify-center">
              {/* Simple graph visualization */}
              <svg viewBox="0 0 300 250" className="w-full max-w-sm">
                <defs>
                  <marker id="arrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="#3b82f6" />
                  </marker>
                </defs>

                {/* Nodes */}
                <circle cx="150" cy="40" r="30" fill="#dbeafe" stroke="#3b82f6" strokeWidth="2" />
                <text x="150" y="45" textAnchor="middle" className="fill-blue-800 text-sm font-medium">Algebra</text>

                <circle cx="80" cy="130" r="30" fill="#dcfce7" stroke="#22c55e" strokeWidth="2" />
                <text x="80" y="135" textAnchor="middle" className="fill-green-800 text-xs font-medium">Arithmetic</text>

                <circle cx="220" cy="130" r="30" fill="#dcfce7" stroke="#22c55e" strokeWidth="2" />
                <text x="220" y="135" textAnchor="middle" className="fill-green-800 text-xs font-medium">Variables</text>

                <circle cx="150" cy="210" r="30" fill="#fee2e2" stroke="#ef4444" strokeWidth="2" />
                <text x="150" y="215" textAnchor="middle" className="fill-red-800 text-xs font-medium">Numbers</text>

                {/* Edges */}
                <line x1="95" y1="105" x2="135" y2="65" stroke="#3b82f6" strokeWidth="2" markerEnd="url(#arrow)" />
                <line x1="205" y1="105" x2="165" y2="65" stroke="#3b82f6" strokeWidth="2" markerEnd="url(#arrow)" />
                <line x1="150" y1="180" x2="95" y2="155" stroke="#22c55e" strokeWidth="2" markerEnd="url(#arrow)" />
                <line x1="150" y1="180" x2="205" y2="155" stroke="#22c55e" strokeWidth="2" markerEnd="url(#arrow)" />

                {/* Legend */}
                <text x="10" y="245" className="fill-gray-500 text-xs">Arrow = "is prerequisite for"</text>
              </svg>
            </div>
          </div>

          <CodeLocation
            file="src/db/EducationGraphDB.ts → addEdge(), getPrerequisites()"
            description="Stores and traverses prerequisite relationships between concepts"
            endpoint="/api/prerequisites"
          />
        </ExpandableSection>

        {/* Summary Card */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl shadow-lg p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">How It All Works Together</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-3xl mb-2">1️⃣</div>
              <h3 className="font-semibold mb-2">Profile the Learner</h3>
              <p className="text-sm text-purple-100">
                Psychometric domains capture who they are: cognitive capacity, learning style,
                emotional state, motivation.
              </p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-3xl mb-2">2️⃣</div>
              <h3 className="font-semibold mb-2">Map the Knowledge</h3>
              <p className="text-sm text-purple-100">
                Knowledge graph defines what they need to learn: concepts, prerequisites,
                difficulty, Bloom levels.
              </p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-3xl mb-2">3️⃣</div>
              <h3 className="font-semibold mb-2">Find the ZPD</h3>
              <p className="text-sm text-purple-100">
                Combine both to find optimal learning targets, select scaffolding,
                and personalize the experience.
              </p>
            </div>
          </div>
        </div>
        </div>
      </main>
    </div>
  );
}
