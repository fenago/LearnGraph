'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from '../components/Sidebar';
import { EtherealShadow } from '@/components/ui/ethereal-shadow';
import { cn } from '@/lib/utils';
import {
  Play,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  FlaskConical,
  Layers,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';

interface TestResult {
  name: string;
  status: 'pending' | 'running' | 'passed' | 'failed';
  duration?: number;
  error?: string;
}

interface TestGroup {
  name: string;
  description: string;
  tests: TestResult[];
}

const initialTests: TestGroup[] = [
  {
    name: 'Phase 1: Database Foundation',
    description: 'Core database operations and persistence',
    tests: [
      { name: 'Create learner profile', status: 'pending' },
      { name: 'Read learner profile', status: 'pending' },
      { name: 'Update learner profile', status: 'pending' },
      { name: 'Delete learner profile', status: 'pending' },
      { name: 'Create concept', status: 'pending' },
      { name: 'Read concept', status: 'pending' },
      { name: 'Update concept', status: 'pending' },
      { name: 'Delete concept', status: 'pending' },
      { name: 'Create prerequisite edge', status: 'pending' },
      { name: 'Read prerequisite edge', status: 'pending' },
      { name: 'Delete prerequisite edge', status: 'pending' },
      { name: 'Create knowledge state', status: 'pending' },
      { name: 'Read knowledge state', status: 'pending' },
      { name: 'Update knowledge state', status: 'pending' },
      { name: 'Delete knowledge state', status: 'pending' },
    ],
  },
  {
    name: 'Phase 1.5: Admin UI',
    description: 'Form submissions and data retrieval',
    tests: [
      { name: 'List learners via API', status: 'pending' },
      { name: 'List concepts via API', status: 'pending' },
      { name: 'List edges via API', status: 'pending' },
      { name: 'List knowledge states via API', status: 'pending' },
      { name: 'Get graph data via API', status: 'pending' },
      { name: 'Graph includes learner overlay', status: 'pending' },
    ],
  },
  {
    name: 'Phase 2: Learner Model (Psychometrics)',
    description: '39 psychometric domains, learning style, cognitive profile',
    tests: [
      { name: 'Get psychometric scores (empty)', status: 'pending' },
      { name: 'Update single psychometric score', status: 'pending' },
      { name: 'Bulk update psychometric scores', status: 'pending' },
      { name: 'Compute learning style', status: 'pending' },
      { name: 'Compute cognitive profile', status: 'pending' },
      { name: 'Verify learning style derived', status: 'pending' },
      { name: 'Verify cognitive profile derived', status: 'pending' },
      { name: 'Cleanup test learner', status: 'pending' },
    ],
  },
  {
    name: 'Phase 3: Knowledge Model (Graph B)',
    description: 'Concept graph traversal, search, and prerequisite chains',
    tests: [
      { name: 'Setup test concepts', status: 'pending' },
      { name: 'Search concepts by name', status: 'pending' },
      { name: 'Filter concepts by difficulty', status: 'pending' },
      { name: 'Filter concepts by Bloom level', status: 'pending' },
      { name: 'Get prerequisite chain', status: 'pending' },
      { name: 'Get dependent chain', status: 'pending' },
      { name: 'Verify chain depth traversal', status: 'pending' },
      { name: 'Cleanup test concepts', status: 'pending' },
    ],
  },
  {
    name: 'Phase 3.5: Data Entry Documentation',
    description: 'Data entry forms and documentation page functional tests',
    tests: [
      { name: 'Add learner via API (form simulation)', status: 'pending' },
      { name: 'Add concept via API (form simulation)', status: 'pending' },
      { name: 'Add prerequisite edge via API', status: 'pending' },
      { name: 'Add knowledge state via API', status: 'pending' },
      { name: 'Verify learner appears in list', status: 'pending' },
      { name: 'Verify concept appears in list', status: 'pending' },
      { name: 'Verify edge connects concepts', status: 'pending' },
      { name: 'Verify knowledge state links learner to concept', status: 'pending' },
      { name: 'Cleanup Phase 3.5 test data', status: 'pending' },
    ],
  },
  {
    name: 'Phase 4: ZPD Engine',
    description: 'Zone of Proximal Development computation, recommendations, and learning paths',
    tests: [
      { name: 'Setup test learner with psychometrics', status: 'pending' },
      { name: 'Setup test concepts with prerequisites', status: 'pending' },
      { name: 'Setup learner knowledge states', status: 'pending' },
      { name: 'Compute ZPD for learner', status: 'pending' },
      { name: 'Verify zone partitioning', status: 'pending' },
      { name: 'Verify psychometric adjustments', status: 'pending' },
      { name: 'Verify scaffolding strategies', status: 'pending' },
      { name: 'Generate learning path', status: 'pending' },
      { name: 'Verify learning path order', status: 'pending' },
      { name: 'Cleanup Phase 4 test data', status: 'pending' },
    ],
  },
  {
    name: 'Phase 5: Knowledge Gap Analysis',
    description: 'Gap detection, forgetting curve, spaced repetition, and review scheduling',
    tests: [
      { name: 'Setup test learner with knowledge history', status: 'pending' },
      { name: 'Setup test concepts with decay data', status: 'pending' },
      { name: 'Detect missing knowledge gaps', status: 'pending' },
      { name: 'Detect partial mastery gaps', status: 'pending' },
      { name: 'Detect forgotten knowledge (decay)', status: 'pending' },
      { name: 'Detect misconceptions', status: 'pending' },
      { name: 'Predict decay with forgetting curve', status: 'pending' },
      { name: 'Schedule next review (spaced repetition)', status: 'pending' },
      { name: 'Get review queue API', status: 'pending' },
      { name: 'Generate remediation plan', status: 'pending' },
      { name: 'Cleanup Phase 5 test data', status: 'pending' },
    ],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: 'easeOut' as const },
  },
};

export default function TestsPage() {
  const [testGroups, setTestGroups] = useState<TestGroup[]>(initialTests);
  const [isRunning, setIsRunning] = useState(false);
  const [summary, setSummary] = useState({ total: 0, passed: 0, failed: 0 });
  const [expandedGroups, setExpandedGroups] = useState<Set<number>>(new Set([0, 1, 2, 3, 4, 5, 6]));

  const toggleGroup = (index: number) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  async function runTest(
    groupIndex: number,
    testIndex: number,
    testFn: () => Promise<void>
  ): Promise<boolean> {
    const startTime = Date.now();

    setTestGroups((prev) => {
      const next = [...prev];
      next[groupIndex] = {
        ...next[groupIndex],
        tests: next[groupIndex].tests.map((t, i) =>
          i === testIndex ? { ...t, status: 'running' as const } : t
        ),
      };
      return next;
    });

    try {
      await testFn();
      const duration = Date.now() - startTime;

      setTestGroups((prev) => {
        const next = [...prev];
        next[groupIndex] = {
          ...next[groupIndex],
          tests: next[groupIndex].tests.map((t, i) =>
            i === testIndex ? { ...t, status: 'passed' as const, duration } : t
          ),
        };
        return next;
      });
      return true;
    } catch (err) {
      const duration = Date.now() - startTime;

      setTestGroups((prev) => {
        const next = [...prev];
        next[groupIndex] = {
          ...next[groupIndex],
          tests: next[groupIndex].tests.map((t, i) =>
            i === testIndex
              ? {
                  ...t,
                  status: 'failed' as const,
                  duration,
                  error: err instanceof Error ? err.message : 'Unknown error',
                }
              : t
          ),
        };
        return next;
      });
      return false;
    }
  }

  async function runAllTests() {
    setIsRunning(true);
    setSummary({ total: 0, passed: 0, failed: 0 });

    // Reset all tests
    setTestGroups(initialTests);

    let passed = 0;
    let failed = 0;
    let testUserId = '';
    let testConceptId = '';
    let testConceptId2 = '';

    // Phase 1 Tests
    const phase1Index = 0;

    // Test: Create learner profile
    const createLearnerOk = await runTest(phase1Index, 0, async () => {
      const res = await fetch('/api/learners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Test User', email: 'test@example.com' }),
      });
      if (!res.ok) throw new Error('Failed to create learner');
      const data = await res.json();
      testUserId = data.userId;
    });
    createLearnerOk ? passed++ : failed++;

    // Test: Read learner profile
    const readLearnerOk = await runTest(phase1Index, 1, async () => {
      if (!testUserId) throw new Error('No user ID from previous test');
      const res = await fetch(`/api/learners/${testUserId}`);
      if (!res.ok) throw new Error('Failed to read learner');
      const data = await res.json();
      if (data.name !== 'Test User') throw new Error('Data mismatch');
    });
    readLearnerOk ? passed++ : failed++;

    // Test: Update learner profile
    const updateLearnerOk = await runTest(phase1Index, 2, async () => {
      if (!testUserId) throw new Error('No user ID');
      const res = await fetch(`/api/learners/${testUserId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Updated User' }),
      });
      if (!res.ok) throw new Error('Failed to update learner');
    });
    updateLearnerOk ? passed++ : failed++;

    // Test: Create concept
    const createConceptOk = await runTest(phase1Index, 4, async () => {
      const res = await fetch('/api/concepts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conceptId: 'test-concept-1',
          name: 'Test Concept 1',
          domain: 'mathematics',
          difficulty: { absolute: 5 },
        }),
      });
      if (!res.ok) throw new Error('Failed to create concept');
      testConceptId = 'test-concept-1';
    });
    createConceptOk ? passed++ : failed++;

    // Create second concept for edge testing
    await fetch('/api/concepts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        conceptId: 'test-concept-2',
        name: 'Test Concept 2',
        domain: 'mathematics',
        difficulty: { absolute: 7 },
      }),
    });
    testConceptId2 = 'test-concept-2';

    // Test: Read concept
    const readConceptOk = await runTest(phase1Index, 5, async () => {
      const res = await fetch(`/api/concepts/${testConceptId}`);
      if (!res.ok) throw new Error('Failed to read concept');
      const data = await res.json();
      if (data.name !== 'Test Concept 1') throw new Error('Data mismatch');
    });
    readConceptOk ? passed++ : failed++;

    // Test: Update concept
    const updateConceptOk = await runTest(phase1Index, 6, async () => {
      const res = await fetch(`/api/concepts/${testConceptId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Updated Test Concept',
          domain: 'mathematics',
          difficulty: { absolute: 6 },
        }),
      });
      if (!res.ok) throw new Error('Failed to update concept');
    });
    updateConceptOk ? passed++ : failed++;

    // Test: Create prerequisite edge
    const createEdgeOk = await runTest(phase1Index, 8, async () => {
      const res = await fetch('/api/edges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: testConceptId,
          to: testConceptId2,
          strength: 'required',
        }),
      });
      if (!res.ok) throw new Error('Failed to create edge');
    });
    createEdgeOk ? passed++ : failed++;

    // Test: Read prerequisite edge
    const readEdgeOk = await runTest(phase1Index, 9, async () => {
      const res = await fetch('/api/edges');
      if (!res.ok) throw new Error('Failed to read edges');
      const data = await res.json();
      const found = data.some(
        (e: { from: string; to: string }) =>
          e.from === testConceptId && e.to === testConceptId2
      );
      if (!found) throw new Error('Edge not found');
    });
    readEdgeOk ? passed++ : failed++;

    // Test: Create knowledge state
    const createStateOk = await runTest(phase1Index, 11, async () => {
      if (!testUserId || !testConceptId) throw new Error('Missing test data');
      const res = await fetch('/api/states', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: testUserId,
          conceptId: testConceptId,
          mastery: 75,
          bloomLevel: 'apply',
        }),
      });
      if (!res.ok) throw new Error('Failed to create knowledge state');
    });
    createStateOk ? passed++ : failed++;

    // Test: Read knowledge state
    const readStateOk = await runTest(phase1Index, 12, async () => {
      const res = await fetch(`/api/states?userId=${testUserId}&conceptId=${testConceptId}`);
      if (!res.ok) throw new Error('Failed to read knowledge state');
      const data = await res.json();
      if (!data) throw new Error('No state found');
      if (data.mastery !== 75) throw new Error('Data mismatch');
    });
    readStateOk ? passed++ : failed++;

    // Test: Update knowledge state
    const updateStateOk = await runTest(phase1Index, 13, async () => {
      const res = await fetch('/api/states', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: testUserId,
          conceptId: testConceptId,
          mastery: 90,
          bloomLevel: 'analyze',
        }),
      });
      if (!res.ok) throw new Error('Failed to update knowledge state');
    });
    updateStateOk ? passed++ : failed++;

    // Phase 1.5 Tests
    const phase15Index = 1;

    // Test: List learners via API
    const listLearnersOk = await runTest(phase15Index, 0, async () => {
      const res = await fetch('/api/learners');
      if (!res.ok) throw new Error('Failed to list learners');
      const data = await res.json();
      if (!Array.isArray(data)) throw new Error('Expected array');
    });
    listLearnersOk ? passed++ : failed++;

    // Test: List concepts via API
    const listConceptsOk = await runTest(phase15Index, 1, async () => {
      const res = await fetch('/api/concepts');
      if (!res.ok) throw new Error('Failed to list concepts');
      const data = await res.json();
      if (!Array.isArray(data)) throw new Error('Expected array');
    });
    listConceptsOk ? passed++ : failed++;

    // Test: List edges via API
    const listEdgesOk = await runTest(phase15Index, 2, async () => {
      const res = await fetch('/api/edges');
      if (!res.ok) throw new Error('Failed to list edges');
      const data = await res.json();
      if (!Array.isArray(data)) throw new Error('Expected array');
    });
    listEdgesOk ? passed++ : failed++;

    // Test: List knowledge states via API
    const listStatesOk = await runTest(phase15Index, 3, async () => {
      const res = await fetch('/api/states');
      if (!res.ok) throw new Error('Failed to list states');
      const data = await res.json();
      if (!Array.isArray(data)) throw new Error('Expected array');
    });
    listStatesOk ? passed++ : failed++;

    // Test: Get graph data via API
    const getGraphOk = await runTest(phase15Index, 4, async () => {
      const res = await fetch('/api/graph');
      if (!res.ok) throw new Error('Failed to get graph');
      const data = await res.json();
      if (!data.nodes || !data.edges) throw new Error('Missing nodes or edges');
    });
    getGraphOk ? passed++ : failed++;

    // Test: Graph includes learner overlay
    const overlayOk = await runTest(phase15Index, 5, async () => {
      if (!testUserId) throw new Error('No user ID');
      const res = await fetch(`/api/graph?userId=${testUserId}`);
      if (!res.ok) throw new Error('Failed to get graph with overlay');
      const data = await res.json();
      if (!data.overlay) throw new Error('Missing overlay');
      if (data.overlay.userId !== testUserId) throw new Error('Wrong user in overlay');
    });
    overlayOk ? passed++ : failed++;

    // Cleanup: Delete test data
    await runTest(phase1Index, 14, async () => {
      await fetch(`/api/states?userId=${testUserId}&conceptId=${testConceptId}`, {
        method: 'DELETE',
      });
    });
    passed++;

    await runTest(phase1Index, 10, async () => {
      await fetch(`/api/edges?from=${testConceptId}&to=${testConceptId2}`, {
        method: 'DELETE',
      });
    });
    passed++;

    await runTest(phase1Index, 7, async () => {
      await fetch(`/api/concepts/${testConceptId}`, { method: 'DELETE' });
      await fetch(`/api/concepts/${testConceptId2}`, { method: 'DELETE' });
    });
    passed++;

    await runTest(phase1Index, 3, async () => {
      await fetch(`/api/learners/${testUserId}`, { method: 'DELETE' });
    });
    passed++;

    // =====================================================================
    // Phase 2 Tests: Learner Model (Psychometrics)
    // =====================================================================
    const phase2Index = 2;
    let phase2UserId = '';

    const createPhase2Learner = await fetch('/api/learners', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Phase2 Test User' }),
    });
    if (createPhase2Learner.ok) {
      const data = await createPhase2Learner.json();
      phase2UserId = data.userId;
    }

    const getEmptyScoresOk = await runTest(phase2Index, 0, async () => {
      if (!phase2UserId) throw new Error('No user ID');
      const res = await fetch(`/api/learners/${phase2UserId}/psychometrics`);
      if (!res.ok) throw new Error('Failed to get psychometric scores');
      const data = await res.json();
      if (data.scoreCount !== 0) throw new Error('Expected 0 scores for new user');
      if (data.totalDomains !== 39) throw new Error('Expected 39 total domains');
    });
    getEmptyScoresOk ? passed++ : failed++;

    const updateSingleScoreOk = await runTest(phase2Index, 1, async () => {
      if (!phase2UserId) throw new Error('No user ID');
      const res = await fetch(`/api/learners/${phase2UserId}/psychometrics`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scores: {
            big_five_openness: { score: 75, confidence: 0.8 },
          },
          computeDerived: false,
        }),
      });
      if (!res.ok) throw new Error('Failed to update score');
      const data = await res.json();
      if (!data.updatedDomains.includes('big_five_openness')) {
        throw new Error('Domain not updated');
      }
    });
    updateSingleScoreOk ? passed++ : failed++;

    const bulkUpdateOk = await runTest(phase2Index, 2, async () => {
      if (!phase2UserId) throw new Error('No user ID');
      const res = await fetch(`/api/learners/${phase2UserId}/psychometrics`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scores: {
            big_five_conscientiousness: { score: 80, confidence: 0.9 },
            big_five_extraversion: { score: 60, confidence: 0.7 },
            big_five_agreeableness: { score: 70, confidence: 0.8 },
            big_five_neuroticism: { score: 40, confidence: 0.7 },
            cognitive_abilities: { score: 85, confidence: 0.9 },
            learning_styles: { score: 65, confidence: 0.8 },
            information_processing: { score: 70, confidence: 0.8 },
            executive_functions: { score: 75, confidence: 0.8 },
          },
          computeDerived: false,
        }),
      });
      if (!res.ok) throw new Error('Failed to bulk update scores');
      const data = await res.json();
      if (data.updatedDomains.length !== 8) {
        throw new Error(`Expected 8 domains updated, got ${data.updatedDomains.length}`);
      }
    });
    bulkUpdateOk ? passed++ : failed++;

    const computeStyleOk = await runTest(phase2Index, 3, async () => {
      if (!phase2UserId) throw new Error('No user ID');
      const res = await fetch(`/api/learners/${phase2UserId}/psychometrics`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'learning-style' }),
      });
      if (!res.ok) throw new Error('Failed to compute learning style');
      const data = await res.json();
      if (!data.learningStyle) throw new Error('No learning style returned');
    });
    computeStyleOk ? passed++ : failed++;

    const computeCogOk = await runTest(phase2Index, 4, async () => {
      if (!phase2UserId) throw new Error('No user ID');
      const res = await fetch(`/api/learners/${phase2UserId}/psychometrics`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'cognitive-profile' }),
      });
      if (!res.ok) throw new Error('Failed to compute cognitive profile');
      const data = await res.json();
      if (!data.cognitiveProfile) throw new Error('No cognitive profile returned');
    });
    computeCogOk ? passed++ : failed++;

    const verifyStyleOk = await runTest(phase2Index, 5, async () => {
      if (!phase2UserId) throw new Error('No user ID');
      const res = await fetch(`/api/learners/${phase2UserId}/psychometrics`);
      if (!res.ok) throw new Error('Failed to get profile');
      const data = await res.json();
      if (!data.learningStyle) throw new Error('Learning style not found');
      if (!data.learningStyle.primary) throw new Error('Missing primary learning modality');
      if (!data.learningStyleDescription) throw new Error('Missing style description');
    });
    verifyStyleOk ? passed++ : failed++;

    const verifyCogOk = await runTest(phase2Index, 6, async () => {
      if (!phase2UserId) throw new Error('No user ID');
      const res = await fetch(`/api/learners/${phase2UserId}/psychometrics`);
      if (!res.ok) throw new Error('Failed to get profile');
      const data = await res.json();
      if (!data.cognitiveProfile) throw new Error('Cognitive profile not found');
      if (!data.cognitiveProfile.workingMemoryCapacity) throw new Error('Missing working memory');
      if (!data.cognitiveProfile.attentionSpan) throw new Error('Missing attention span');
      if (!data.cognitiveProfile.processingSpeed) throw new Error('Missing processing speed');
      if (!data.cognitiveProfile.abstractThinking) throw new Error('Missing abstract thinking');
    });
    verifyCogOk ? passed++ : failed++;

    await runTest(phase2Index, 7, async () => {
      if (phase2UserId) {
        await fetch(`/api/learners/${phase2UserId}`, { method: 'DELETE' });
      }
    });
    passed++;

    // =====================================================================
    // Phase 3 Tests: Knowledge Model (Graph B)
    // =====================================================================
    const phase3Index = 3;

    const setupPhase3Ok = await runTest(phase3Index, 0, async () => {
      const resA = await fetch('/api/concepts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conceptId: 'phase3-concept-a',
          name: 'Algebra Basics',
          domain: 'mathematics',
          description: 'Basic algebraic operations',
          difficulty: { absolute: 3, cognitiveLoad: 0.3, abstractness: 0.3 },
          bloomObjectives: { remember: 'Define variables', understand: 'Explain equations' },
        }),
      });
      if (!resA.ok) throw new Error('Failed to create concept A');

      const resB = await fetch('/api/concepts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conceptId: 'phase3-concept-b',
          name: 'Linear Equations',
          domain: 'mathematics',
          description: 'Solving linear equations',
          difficulty: { absolute: 5, cognitiveLoad: 0.5, abstractness: 0.5 },
          bloomObjectives: { apply: 'Solve linear equations', analyze: 'Identify equation types' },
        }),
      });
      if (!resB.ok) throw new Error('Failed to create concept B');

      const resC = await fetch('/api/concepts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conceptId: 'phase3-concept-c',
          name: 'Quadratic Equations',
          domain: 'mathematics',
          description: 'Solving quadratic equations',
          difficulty: { absolute: 7, cognitiveLoad: 0.7, abstractness: 0.7 },
          bloomObjectives: { evaluate: 'Evaluate solution methods', create: 'Derive quadratic formula' },
        }),
      });
      if (!resC.ok) throw new Error('Failed to create concept C');

      const edge1 = await fetch('/api/edges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: 'phase3-concept-a',
          to: 'phase3-concept-b',
          strength: 'required',
          reason: 'Must know basics before linear equations',
        }),
      });
      if (!edge1.ok) throw new Error('Failed to create edge A->B');

      const edge2 = await fetch('/api/edges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: 'phase3-concept-b',
          to: 'phase3-concept-c',
          strength: 'required',
          reason: 'Must know linear before quadratic',
        }),
      });
      if (!edge2.ok) throw new Error('Failed to create edge B->C');
    });
    setupPhase3Ok ? passed++ : failed++;

    const searchConceptsOk = await runTest(phase3Index, 1, async () => {
      const res = await fetch('/api/concepts?search=Algebra');
      if (!res.ok) throw new Error('Failed to search concepts');
      const data = await res.json();
      if (!Array.isArray(data)) throw new Error('Expected array');
      const found = data.some((c: { conceptId: string }) => c.conceptId === 'phase3-concept-a');
      if (!found) throw new Error('Search did not find "Algebra Basics"');
    });
    searchConceptsOk ? passed++ : failed++;

    const filterDifficultyOk = await runTest(phase3Index, 2, async () => {
      const res = await fetch('/api/concepts?minDifficulty=6&maxDifficulty=10');
      if (!res.ok) throw new Error('Failed to filter by difficulty');
      const data = await res.json();
      if (!Array.isArray(data)) throw new Error('Expected array');
      const found = data.some((c: { conceptId: string }) => c.conceptId === 'phase3-concept-c');
      if (!found) throw new Error('Did not find concept with difficulty 7');
      const foundA = data.some((c: { conceptId: string }) => c.conceptId === 'phase3-concept-a');
      if (foundA) throw new Error('Incorrectly included concept with difficulty 3');
    });
    filterDifficultyOk ? passed++ : failed++;

    const filterBloomOk = await runTest(phase3Index, 3, async () => {
      const res = await fetch('/api/concepts?bloomLevel=apply');
      if (!res.ok) throw new Error('Failed to filter by Bloom level');
      const data = await res.json();
      if (!Array.isArray(data)) throw new Error('Expected array');
      const found = data.some((c: { conceptId: string }) => c.conceptId === 'phase3-concept-b');
      if (!found) throw new Error('Did not find concept with apply bloom level');
    });
    filterBloomOk ? passed++ : failed++;

    const getPrereqsOk = await runTest(phase3Index, 4, async () => {
      const res = await fetch('/api/concepts/phase3-concept-c/prerequisites');
      if (!res.ok) throw new Error('Failed to get prerequisites');
      const data = await res.json();
      if (!data.chain || !Array.isArray(data.chain)) throw new Error('No chain returned');
      if (data.totalPrerequisites < 2) throw new Error('Expected at least 2 prerequisites');
      const hasB = data.chain.some((c: { conceptId: string; depth: number }) =>
        c.conceptId === 'phase3-concept-b' && c.depth === 1
      );
      if (!hasB) throw new Error('Missing concept-b at depth 1');
    });
    getPrereqsOk ? passed++ : failed++;

    const getDependentsOk = await runTest(phase3Index, 5, async () => {
      const res = await fetch('/api/concepts/phase3-concept-a/dependents');
      if (!res.ok) throw new Error('Failed to get dependents');
      const data = await res.json();
      if (!data.chain || !Array.isArray(data.chain)) throw new Error('No chain returned');
      if (data.totalDependents < 2) throw new Error('Expected at least 2 dependents');
      const hasB = data.chain.some((c: { conceptId: string; depth: number }) =>
        c.conceptId === 'phase3-concept-b' && c.depth === 1
      );
      if (!hasB) throw new Error('Missing concept-b at depth 1');
    });
    getDependentsOk ? passed++ : failed++;

    const verifyDepthOk = await runTest(phase3Index, 6, async () => {
      const res = await fetch('/api/concepts/phase3-concept-c/prerequisites?depth=1');
      if (!res.ok) throw new Error('Failed to get prerequisites with depth=1');
      const data = await res.json();
      if (data.totalPrerequisites !== 1) throw new Error(`Expected 1 prereq with depth=1, got ${data.totalPrerequisites}`);

      const res2 = await fetch('/api/concepts/phase3-concept-c/prerequisites?direct=true');
      if (!res2.ok) throw new Error('Failed to get direct prerequisites');
      const data2 = await res2.json();
      if (data2.totalPrerequisites !== 1) throw new Error('direct=true should return only 1 prereq');
    });
    verifyDepthOk ? passed++ : failed++;

    await runTest(phase3Index, 7, async () => {
      await fetch('/api/edges?from=phase3-concept-a&to=phase3-concept-b', { method: 'DELETE' });
      await fetch('/api/edges?from=phase3-concept-b&to=phase3-concept-c', { method: 'DELETE' });
      await fetch('/api/concepts/phase3-concept-a', { method: 'DELETE' });
      await fetch('/api/concepts/phase3-concept-b', { method: 'DELETE' });
      await fetch('/api/concepts/phase3-concept-c', { method: 'DELETE' });
    });
    passed++;

    // =====================================================================
    // Phase 3.5 Tests: Data Entry Documentation
    // =====================================================================
    const phase35Index = 4;
    let phase35UserId = '';
    const phase35ConceptIdA = 'phase35-form-concept-a';
    const phase35ConceptIdB = 'phase35-form-concept-b';

    const addLearnerFormOk = await runTest(phase35Index, 0, async () => {
      const res = await fetch('/api/learners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Form Test User',
          email: 'formtest@example.com',
        }),
      });
      if (!res.ok) throw new Error('Failed to add learner via form');
      const data = await res.json();
      if (!data.userId) throw new Error('No userId returned');
      phase35UserId = data.userId;
    });
    addLearnerFormOk ? passed++ : failed++;

    const addConceptFormOk = await runTest(phase35Index, 1, async () => {
      const res1 = await fetch('/api/concepts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conceptId: phase35ConceptIdA,
          name: 'Form Test Introduction',
          domain: 'computer_science',
          description: 'Test concept added via form simulation',
          difficulty: { absolute: 2, cognitiveLoad: 0.2, abstractness: 0.2 },
          bloomObjectives: { remember: 'Recall basic concepts' },
        }),
      });
      if (!res1.ok) throw new Error('Failed to add concept A via form');

      const res2 = await fetch('/api/concepts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conceptId: phase35ConceptIdB,
          name: 'Form Test Advanced',
          domain: 'computer_science',
          description: 'Advanced test concept for prerequisites',
          difficulty: { absolute: 5, cognitiveLoad: 0.5, abstractness: 0.5 },
          bloomObjectives: { apply: 'Apply learned concepts' },
        }),
      });
      if (!res2.ok) throw new Error('Failed to add concept B via form');
    });
    addConceptFormOk ? passed++ : failed++;

    const addEdgeFormOk = await runTest(phase35Index, 2, async () => {
      const res = await fetch('/api/edges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: phase35ConceptIdA,
          to: phase35ConceptIdB,
          strength: 'required',
          reason: 'Introduction must be learned before Advanced',
        }),
      });
      if (!res.ok) throw new Error('Failed to add prerequisite edge');
    });
    addEdgeFormOk ? passed++ : failed++;

    const addStateFormOk = await runTest(phase35Index, 3, async () => {
      if (!phase35UserId) throw new Error('No user ID from previous test');
      const res = await fetch('/api/states', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: phase35UserId,
          conceptId: phase35ConceptIdA,
          mastery: 85,
          bloomLevel: 3,
          misconceptions: ['Common misunderstanding about form data'],
        }),
      });
      if (!res.ok) throw new Error('Failed to add knowledge state');
    });
    addStateFormOk ? passed++ : failed++;

    const verifyLearnerListOk = await runTest(phase35Index, 4, async () => {
      if (!phase35UserId) throw new Error('No user ID');
      const res = await fetch('/api/learners');
      if (!res.ok) throw new Error('Failed to list learners');
      const data = await res.json();
      const found = data.some((l: { userId: string }) => l.userId === phase35UserId);
      if (!found) throw new Error('Learner not found in list');
    });
    verifyLearnerListOk ? passed++ : failed++;

    const verifyConceptListOk = await runTest(phase35Index, 5, async () => {
      const res = await fetch('/api/concepts');
      if (!res.ok) throw new Error('Failed to list concepts');
      const data = await res.json();
      const foundA = data.some((c: { conceptId: string }) => c.conceptId === phase35ConceptIdA);
      const foundB = data.some((c: { conceptId: string }) => c.conceptId === phase35ConceptIdB);
      if (!foundA || !foundB) throw new Error('Concepts not found in list');
    });
    verifyConceptListOk ? passed++ : failed++;

    const verifyEdgeOk = await runTest(phase35Index, 6, async () => {
      const res = await fetch('/api/edges');
      if (!res.ok) throw new Error('Failed to list edges');
      const data = await res.json();
      const found = data.some(
        (e: { from: string; to: string }) =>
          e.from === phase35ConceptIdA && e.to === phase35ConceptIdB
      );
      if (!found) throw new Error('Edge not found connecting concepts');
    });
    verifyEdgeOk ? passed++ : failed++;

    const verifyStateOk = await runTest(phase35Index, 7, async () => {
      if (!phase35UserId) throw new Error('No user ID');
      const res = await fetch(`/api/states?userId=${phase35UserId}&conceptId=${phase35ConceptIdA}`);
      if (!res.ok) throw new Error('Failed to get knowledge state');
      const data = await res.json();
      if (!data) throw new Error('No knowledge state found');
      if (data.mastery !== 85) throw new Error('Mastery value mismatch');
      if (!data.misconceptions || data.misconceptions.length === 0) {
        throw new Error('Misconceptions not saved');
      }
    });
    verifyStateOk ? passed++ : failed++;

    await runTest(phase35Index, 8, async () => {
      if (phase35UserId) {
        await fetch(`/api/states?userId=${phase35UserId}&conceptId=${phase35ConceptIdA}`, {
          method: 'DELETE',
        });
      }
      await fetch(`/api/edges?from=${phase35ConceptIdA}&to=${phase35ConceptIdB}`, {
        method: 'DELETE',
      });
      await fetch(`/api/concepts/${phase35ConceptIdA}`, { method: 'DELETE' });
      await fetch(`/api/concepts/${phase35ConceptIdB}`, { method: 'DELETE' });
      if (phase35UserId) {
        await fetch(`/api/learners/${phase35UserId}`, { method: 'DELETE' });
      }
    });
    passed++;

    // =====================================================================
    // Phase 4 Tests: ZPD Engine
    // =====================================================================
    const phase4Index = 5;
    let phase4UserId = '';
    const phase4Concepts = ['phase4-basics', 'phase4-intermediate', 'phase4-advanced', 'phase4-expert'];
    let zpdResult: {
      tooEasy?: { concept: { conceptId: string } }[];
      zpd?: { concept: { conceptId: string } }[];
      tooHard?: { concept: { conceptId: string } }[];
      recommendations?: { concept: { conceptId: string }; scaffoldingStrategies?: { type: string }[] }[];
      psychometricAdjustments?: {
        difficultyModifier?: number;
        paceRecommendation?: string;
        scaffoldingStrategies?: { type: string }[];
        presentationStyle?: string;
      };
    } | null = null;

    const setupPhase4LearnerOk = await runTest(phase4Index, 0, async () => {
      const res = await fetch('/api/learners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'ZPD Test User' }),
      });
      if (!res.ok) throw new Error('Failed to create learner');
      const data = await res.json();
      phase4UserId = data.userId;

      const psyRes = await fetch(`/api/learners/${phase4UserId}/psychometrics`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scores: {
            big_five_openness: { score: 75, confidence: 0.9 },
            big_five_conscientiousness: { score: 70, confidence: 0.85 },
            big_five_extraversion: { score: 40, confidence: 0.8 },
            big_five_agreeableness: { score: 65, confidence: 0.8 },
            big_five_neuroticism: { score: 55, confidence: 0.75 },
            cognitive_abilities: { score: 80, confidence: 0.9 },
            learning_styles: { score: 70, confidence: 0.85 },
            information_processing: { score: 75, confidence: 0.8 },
          },
          computeDerived: true,
        }),
      });
      if (!psyRes.ok) throw new Error('Failed to set psychometrics');
    });
    setupPhase4LearnerOk ? passed++ : failed++;

    const setupPhase4ConceptsOk = await runTest(phase4Index, 1, async () => {
      const concepts = [
        { conceptId: 'phase4-basics', name: 'ZPD Basics', difficulty: { absolute: 2, cognitiveLoad: 0.2, abstractness: 0.2 } },
        { conceptId: 'phase4-intermediate', name: 'ZPD Intermediate', difficulty: { absolute: 4, cognitiveLoad: 0.4, abstractness: 0.4 } },
        { conceptId: 'phase4-advanced', name: 'ZPD Advanced', difficulty: { absolute: 6, cognitiveLoad: 0.6, abstractness: 0.6 } },
        { conceptId: 'phase4-expert', name: 'ZPD Expert', difficulty: { absolute: 9, cognitiveLoad: 0.9, abstractness: 0.9 } },
      ];

      for (const concept of concepts) {
        const res = await fetch('/api/concepts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...concept, domain: 'testing', description: `Test concept: ${concept.name}` }),
        });
        if (!res.ok) throw new Error(`Failed to create concept: ${concept.conceptId}`);
      }

      const edges = [
        { from: 'phase4-basics', to: 'phase4-intermediate' },
        { from: 'phase4-intermediate', to: 'phase4-advanced' },
        { from: 'phase4-advanced', to: 'phase4-expert' },
      ];

      for (const edge of edges) {
        const res = await fetch('/api/edges', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...edge, strength: 'required' }),
        });
        if (!res.ok) throw new Error(`Failed to create edge: ${edge.from} -> ${edge.to}`);
      }
    });
    setupPhase4ConceptsOk ? passed++ : failed++;

    const setupPhase4StatesOk = await runTest(phase4Index, 2, async () => {
      if (!phase4UserId) throw new Error('No user ID');

      const states = [
        { conceptId: 'phase4-basics', mastery: 95, bloomLevel: 4 },
        { conceptId: 'phase4-intermediate', mastery: 45, bloomLevel: 2 },
      ];

      for (const state of states) {
        const res = await fetch('/api/states', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: phase4UserId, ...state }),
        });
        if (!res.ok) throw new Error(`Failed to create state for: ${state.conceptId}`);
      }
    });
    setupPhase4StatesOk ? passed++ : failed++;

    const computeZpdOk = await runTest(phase4Index, 3, async () => {
      if (!phase4UserId) throw new Error('No user ID');

      const res = await fetch(`/api/zpd?userId=${phase4UserId}`);
      if (!res.ok) throw new Error('Failed to compute ZPD');
      zpdResult = await res.json();

      if (!zpdResult) throw new Error('No ZPD result returned');
      if (!zpdResult.tooEasy) throw new Error('Missing tooEasy partition');
      if (!zpdResult.zpd) throw new Error('Missing zpd partition');
      if (!zpdResult.tooHard) throw new Error('Missing tooHard partition');
      if (!zpdResult.recommendations) throw new Error('Missing recommendations');
    });
    computeZpdOk ? passed++ : failed++;

    const verifyZonesOk = await runTest(phase4Index, 4, async () => {
      if (!zpdResult) throw new Error('No ZPD result');

      const basicsInTooEasy = zpdResult.tooEasy?.some(
        (z) => z.concept.conceptId === 'phase4-basics'
      );
      if (!basicsInTooEasy) throw new Error('phase4-basics should be in too_easy zone');

      const expertInTooHard = zpdResult.tooHard?.some(
        (z) => z.concept.conceptId === 'phase4-expert'
      );
      if (!expertInTooHard) throw new Error('phase4-expert should be in too_hard zone');
    });
    verifyZonesOk ? passed++ : failed++;

    const verifyAdjustmentsOk = await runTest(phase4Index, 5, async () => {
      if (!zpdResult) throw new Error('No ZPD result');
      if (!zpdResult.psychometricAdjustments) throw new Error('Missing psychometric adjustments');

      const adj = zpdResult.psychometricAdjustments;

      if (adj.difficultyModifier === undefined) throw new Error('Missing difficultyModifier');
      if (adj.difficultyModifier < -0.5 || adj.difficultyModifier > 0.5) {
        throw new Error('difficultyModifier out of range');
      }

      if (!adj.paceRecommendation) throw new Error('Missing paceRecommendation');
      if (!['slower', 'normal', 'faster'].includes(adj.paceRecommendation)) {
        throw new Error('Invalid paceRecommendation');
      }

      if (!adj.presentationStyle) throw new Error('Missing presentationStyle');
    });
    verifyAdjustmentsOk ? passed++ : failed++;

    const verifyScaffoldingOk = await runTest(phase4Index, 6, async () => {
      if (!zpdResult) throw new Error('No ZPD result');
      if (!zpdResult.psychometricAdjustments?.scaffoldingStrategies) {
        throw new Error('Missing scaffolding strategies');
      }

      const strategies = zpdResult.psychometricAdjustments.scaffoldingStrategies;
      if (!Array.isArray(strategies) || strategies.length === 0) {
        throw new Error('No scaffolding strategies returned');
      }

      for (const s of strategies) {
        if (!s.type) throw new Error('Strategy missing type');
      }
    });
    verifyScaffoldingOk ? passed++ : failed++;

    let pathResult: { path?: { conceptId: string }[] } | null = null;
    const generatePathOk = await runTest(phase4Index, 7, async () => {
      if (!phase4UserId) throw new Error('No user ID');

      const res = await fetch(`/api/learning-path?userId=${phase4UserId}`);
      if (!res.ok) throw new Error('Failed to generate learning path');
      pathResult = await res.json();

      if (!pathResult) throw new Error('No path result returned');
      if (!pathResult.path || !Array.isArray(pathResult.path)) {
        throw new Error('Missing or invalid path array');
      }
    });
    generatePathOk ? passed++ : failed++;

    const verifyPathOrderOk = await runTest(phase4Index, 8, async () => {
      if (!pathResult?.path) throw new Error('No path result');

      const pathIds = pathResult.path.map((p) => p.conceptId);

      const basicsIdx = pathIds.indexOf('phase4-basics');
      const intermediateIdx = pathIds.indexOf('phase4-intermediate');
      const advancedIdx = pathIds.indexOf('phase4-advanced');

      if (basicsIdx >= 0 && intermediateIdx >= 0) {
        if (basicsIdx > intermediateIdx) {
          throw new Error('Basics should come before intermediate in path');
        }
      }
      if (intermediateIdx >= 0 && advancedIdx >= 0) {
        if (intermediateIdx > advancedIdx) {
          throw new Error('Intermediate should come before advanced in path');
        }
      }
    });
    verifyPathOrderOk ? passed++ : failed++;

    await runTest(phase4Index, 9, async () => {
      if (phase4UserId) {
        for (const conceptId of phase4Concepts) {
          await fetch(`/api/states?userId=${phase4UserId}&conceptId=${conceptId}`, { method: 'DELETE' });
        }
      }

      await fetch('/api/edges?from=phase4-basics&to=phase4-intermediate', { method: 'DELETE' });
      await fetch('/api/edges?from=phase4-intermediate&to=phase4-advanced', { method: 'DELETE' });
      await fetch('/api/edges?from=phase4-advanced&to=phase4-expert', { method: 'DELETE' });

      for (const conceptId of phase4Concepts) {
        await fetch(`/api/concepts/${conceptId}`, { method: 'DELETE' });
      }

      if (phase4UserId) {
        await fetch(`/api/learners/${phase4UserId}`, { method: 'DELETE' });
      }
    });
    passed++;

    // =====================================================================
    // Phase 5 Tests: Knowledge Gap Analysis
    // =====================================================================
    const phase5Index = 6;
    let phase5UserId = '';
    const phase5Concepts = ['phase5-known', 'phase5-partial', 'phase5-forgotten', 'phase5-misconception'];

    const setupPhase5LearnerOk = await runTest(phase5Index, 0, async () => {
      const res = await fetch('/api/learners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Gap Analysis Test User' }),
      });
      if (!res.ok) throw new Error('Failed to create learner');
      const data = await res.json();
      phase5UserId = data.userId;
    });
    setupPhase5LearnerOk ? passed++ : failed++;

    const setupPhase5ConceptsOk = await runTest(phase5Index, 1, async () => {
      const concepts = [
        { conceptId: 'phase5-known', name: 'Gap Test Known', difficulty: { absolute: 3 } },
        { conceptId: 'phase5-partial', name: 'Gap Test Partial', difficulty: { absolute: 4 } },
        { conceptId: 'phase5-forgotten', name: 'Gap Test Forgotten', difficulty: { absolute: 5 } },
        { conceptId: 'phase5-misconception', name: 'Gap Test Misconception', difficulty: { absolute: 4 } },
      ];

      for (const concept of concepts) {
        const res = await fetch('/api/concepts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...concept, domain: 'testing', description: `Test: ${concept.name}` }),
        });
        if (!res.ok) throw new Error(`Failed to create concept: ${concept.conceptId}`);
      }

      if (!phase5UserId) throw new Error('No user ID');

      await fetch('/api/states', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: phase5UserId,
          conceptId: 'phase5-known',
          mastery: 90,
          bloomLevel: 4,
          lastReviewed: new Date().toISOString(),
        }),
      });

      await fetch('/api/states', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: phase5UserId,
          conceptId: 'phase5-partial',
          mastery: 45,
          bloomLevel: 2,
          lastReviewed: new Date().toISOString(),
        }),
      });

      const oldDate = new Date();
      oldDate.setDate(oldDate.getDate() - 30);
      await fetch('/api/states', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: phase5UserId,
          conceptId: 'phase5-forgotten',
          mastery: 80,
          bloomLevel: 3,
          lastReviewed: oldDate.toISOString(),
        }),
      });

      await fetch('/api/states', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: phase5UserId,
          conceptId: 'phase5-misconception',
          mastery: 60,
          bloomLevel: 3,
          misconceptions: [
            {
              id: 'misconception-1',
              description: 'Confuses X with Y',
              severity: 'moderate',
              identified: new Date().toISOString(),
            },
            {
              id: 'misconception-2',
              description: 'Thinks A causes B',
              severity: 'minor',
              identified: new Date().toISOString(),
            },
          ],
        }),
      });
    });
    setupPhase5ConceptsOk ? passed++ : failed++;

    const detectMissingOk = await runTest(phase5Index, 2, async () => {
      if (!phase5UserId) throw new Error('No user ID');
      const res = await fetch(`/api/gaps?userId=${phase5UserId}&type=missing`);
      if (!res.ok) throw new Error('Gap detection API not implemented yet (Phase 5)');
      const data = await res.json();
      if (!data.gaps || !data.gaps.missing) throw new Error('No missing gaps returned');
    });
    detectMissingOk ? passed++ : failed++;

    const detectPartialOk = await runTest(phase5Index, 3, async () => {
      if (!phase5UserId) throw new Error('No user ID');
      const res = await fetch(`/api/gaps?userId=${phase5UserId}&type=partial`);
      if (!res.ok) throw new Error('Gap detection API not implemented yet (Phase 5)');
      const data = await res.json();
      if (!data.gaps || !data.gaps.partial) throw new Error('No partial gaps returned');
      const hasPartial = data.gaps.partial.some(
        (g: { conceptId: string }) => g.conceptId === 'phase5-partial'
      );
      if (!hasPartial) throw new Error('Partial mastery concept not detected');
    });
    detectPartialOk ? passed++ : failed++;

    const detectForgottenOk = await runTest(phase5Index, 4, async () => {
      if (!phase5UserId) throw new Error('No user ID');
      const res = await fetch(`/api/gaps?userId=${phase5UserId}&type=forgotten`);
      if (!res.ok) throw new Error('Gap detection API not implemented yet (Phase 5)');
      const data = await res.json();
      if (!data.gaps || !data.gaps.forgotten) throw new Error('No forgotten gaps returned');
      const hasForgotten = data.gaps.forgotten.some(
        (g: { conceptId: string }) => g.conceptId === 'phase5-forgotten'
      );
      if (!hasForgotten) throw new Error('Forgotten concept not detected');
    });
    detectForgottenOk ? passed++ : failed++;

    const detectMisconceptionsOk = await runTest(phase5Index, 5, async () => {
      if (!phase5UserId) throw new Error('No user ID');
      const res = await fetch(`/api/gaps?userId=${phase5UserId}&type=misconceptions`);
      if (!res.ok) throw new Error('Gap detection API not implemented yet (Phase 5)');
      const data = await res.json();
      if (!data.gaps || !data.gaps.misconceptions) throw new Error('No misconception gaps returned');
      const hasMisconception = data.gaps.misconceptions.some(
        (g: { conceptId: string; misconceptions: string[] }) =>
          g.conceptId === 'phase5-misconception' && g.misconceptions.length > 0
      );
      if (!hasMisconception) throw new Error('Misconception not detected');
    });
    detectMisconceptionsOk ? passed++ : failed++;

    const predictDecayOk = await runTest(phase5Index, 6, async () => {
      if (!phase5UserId) throw new Error('No user ID');
      const res = await fetch(`/api/decay?userId=${phase5UserId}&conceptId=phase5-forgotten`);
      if (!res.ok) throw new Error('Decay prediction API not implemented yet (Phase 5)');
      const data = await res.json();
      if (data.predictedRetention === undefined) throw new Error('No retention prediction');
      if (data.predictedRetention < 0 || data.predictedRetention > 100) {
        throw new Error('Retention should be 0-100%');
      }
      if (data.predictedRetention > 80) {
        throw new Error('30-day-old knowledge should have decayed more');
      }
    });
    predictDecayOk ? passed++ : failed++;

    const scheduleReviewOk = await runTest(phase5Index, 7, async () => {
      if (!phase5UserId) throw new Error('No user ID');
      const res = await fetch(`/api/review-schedule?userId=${phase5UserId}&conceptId=phase5-known`);
      if (!res.ok) throw new Error('Review scheduling API not implemented yet (Phase 5)');
      const data = await res.json();
      if (!data.nextReviewDate) throw new Error('No next review date returned');
      if (!data.interval) throw new Error('No review interval returned');
    });
    scheduleReviewOk ? passed++ : failed++;

    const reviewQueueOk = await runTest(phase5Index, 8, async () => {
      if (!phase5UserId) throw new Error('No user ID');
      const res = await fetch(`/api/review-queue?userId=${phase5UserId}`);
      if (!res.ok) throw new Error('Review queue API not implemented yet (Phase 5)');
      const data = await res.json();
      if (!data.queue || !Array.isArray(data.queue)) throw new Error('No queue array returned');
      if (data.queue.length > 0) {
        const first = data.queue[0];
        if (!first.conceptId) throw new Error('Queue item missing conceptId');
        if (!first.priority) throw new Error('Queue item missing priority');
      }
    });
    reviewQueueOk ? passed++ : failed++;

    const remediationPlanOk = await runTest(phase5Index, 9, async () => {
      if (!phase5UserId) throw new Error('No user ID');
      const res = await fetch(`/api/remediation?userId=${phase5UserId}`);
      if (!res.ok) throw new Error('Remediation plan API not implemented yet (Phase 5)');
      const data = await res.json();
      if (!data.plan) throw new Error('No remediation plan returned');
      if (!Array.isArray(data.plan.steps)) throw new Error('Plan should have steps array');
    });
    remediationPlanOk ? passed++ : failed++;

    await runTest(phase5Index, 10, async () => {
      if (phase5UserId) {
        for (const conceptId of phase5Concepts) {
          await fetch(`/api/states?userId=${phase5UserId}&conceptId=${conceptId}`, { method: 'DELETE' });
        }
      }

      for (const conceptId of phase5Concepts) {
        await fetch(`/api/concepts/${conceptId}`, { method: 'DELETE' });
      }

      if (phase5UserId) {
        await fetch(`/api/learners/${phase5UserId}`, { method: 'DELETE' });
      }
    });
    passed++;

    const total = passed + failed;
    setSummary({ total, passed, failed });
    setIsRunning(false);
  }

  function getStatusIcon(status: TestResult['status']) {
    switch (status) {
      case 'passed':
        return <CheckCircle size={16} className="text-emerald-500" />;
      case 'failed':
        return <XCircle size={16} className="text-red-500" />;
      case 'running':
        return <RefreshCw size={16} className="text-blue-500 animate-spin" />;
      default:
        return <Clock size={16} className="text-muted-foreground" />;
    }
  }

  const totalTests = testGroups.reduce((acc, g) => acc + g.tests.length, 0);

  const getGroupStats = (group: TestGroup) => {
    const passed = group.tests.filter((t) => t.status === 'passed').length;
    const failed = group.tests.filter((t) => t.status === 'failed').length;
    const running = group.tests.filter((t) => t.status === 'running').length;
    return { passed, failed, running, total: group.tests.length };
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <main className="flex-1 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 pointer-events-none">
          <EtherealShadow
            color="rgba(16, 185, 129, 0.1)"
            animation={{ scale: 30, speed: 40 }}
            noise={{ opacity: 0.3, scale: 0.8 }}
          />
        </div>

        <div className="relative z-10 px-8 py-10 max-w-5xl mx-auto">
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
                className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg shadow-emerald-500/25"
              >
                <FlaskConical className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                  Functional Tests
                </h1>
                <p className="text-muted-foreground">
                  Run and verify database operations across all phases
                </p>
              </div>
            </div>
          </motion.div>

          {/* Run Tests Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="mb-6"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={runAllTests}
              disabled={isRunning}
              className={cn(
                'flex items-center gap-2 px-6 py-3 rounded-xl font-medium shadow-lg transition-all',
                isRunning
                  ? 'bg-muted text-muted-foreground cursor-not-allowed'
                  : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-600/25 hover:shadow-xl hover:shadow-emerald-600/30'
              )}
            >
              <Play size={20} className={isRunning ? 'animate-pulse' : ''} />
              {isRunning ? 'Running Tests...' : 'Run All Tests'}
            </motion.button>
          </motion.div>

          {/* Summary Cards */}
          <AnimatePresence>
            {summary.total > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-3 gap-4 mb-8"
              >
                <motion.div
                  whileHover={{ scale: 1.02, y: -2 }}
                  className="glass-card p-4 text-center"
                >
                  <div className="text-3xl font-bold text-foreground">{summary.total}</div>
                  <div className="text-sm text-muted-foreground">Total Tests</div>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.02, y: -2 }}
                  className="glass-card p-4 text-center border-l-4 border-l-emerald-500"
                >
                  <div className="text-3xl font-bold text-emerald-500">{summary.passed}</div>
                  <div className="text-sm text-muted-foreground">Passed</div>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.02, y: -2 }}
                  className="glass-card p-4 text-center border-l-4 border-l-red-500"
                >
                  <div className="text-3xl font-bold text-red-500">{summary.failed}</div>
                  <div className="text-sm text-muted-foreground">Failed</div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Test Groups */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            {testGroups.map((group, groupIndex) => {
              const stats = getGroupStats(group);
              const isExpanded = expandedGroups.has(groupIndex);

              return (
                <motion.div
                  key={group.name}
                  variants={itemVariants}
                  className="glass-card overflow-hidden"
                >
                  {/* Group Header */}
                  <button
                    onClick={() => toggleGroup(groupIndex)}
                    className="w-full px-5 py-4 flex items-center justify-between hover:bg-secondary/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <motion.div
                        animate={{ rotate: isExpanded ? 90 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronRight size={18} className="text-muted-foreground" />
                      </motion.div>
                      <div className="text-left">
                        <h2 className="font-semibold text-foreground">{group.name}</h2>
                        <p className="text-xs text-muted-foreground">{group.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {stats.passed > 0 && (
                        <span className="text-xs px-2 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                          {stats.passed} passed
                        </span>
                      )}
                      {stats.failed > 0 && (
                        <span className="text-xs px-2 py-1 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400">
                          {stats.failed} failed
                        </span>
                      )}
                      {stats.running > 0 && (
                        <span className="text-xs px-2 py-1 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                          {stats.running} running
                        </span>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {stats.total} tests
                      </span>
                    </div>
                  </button>

                  {/* Group Tests */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="border-t border-border"
                      >
                        <div className="divide-y divide-border/50">
                          {group.tests.map((test, testIndex) => (
                            <div
                              key={test.name}
                              className={cn(
                                'px-5 py-2.5 flex items-center justify-between transition-colors',
                                test.status === 'failed' && 'bg-red-500/5'
                              )}
                            >
                              <div className="flex items-center gap-3">
                                {getStatusIcon(test.status)}
                                <span
                                  className={cn(
                                    'text-sm',
                                    test.status === 'failed'
                                      ? 'text-red-600 dark:text-red-400'
                                      : 'text-foreground'
                                  )}
                                >
                                  {test.name}
                                </span>
                              </div>
                              <div className="flex items-center gap-3">
                                {test.duration !== undefined && (
                                  <span className="text-xs text-muted-foreground font-mono">
                                    {test.duration}ms
                                  </span>
                                )}
                                {test.error && (
                                  <span
                                    className="text-xs text-red-600 dark:text-red-400 max-w-[200px] truncate"
                                    title={test.error}
                                  >
                                    {test.error}
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Test Coverage Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="glass-card p-6 mt-8"
          >
            <div className="flex items-start gap-3">
              <Layers className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div>
                <h3 className="font-semibold text-foreground mb-2">Test Coverage</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  These tests verify the Phase 1 database foundation, Phase 1.5 Admin UI API,
                  Phase 2 psychometric learner model, Phase 3 knowledge graph operations,
                  Phase 3.5 data entry documentation, Phase 4 ZPD engine, and Phase 5 gap analysis.
                  Tests run in sequence and clean up after themselves.
                </p>
                <div className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Phase Pass Criteria:</strong>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Phase 1: Write &lt; 5ms, Read &lt; 2ms, Data survives restart</li>
                    <li>Phase 1.5: Forms submit &lt; 500ms, Graph renders 100 nodes &lt; 1s</li>
                    <li>Phase 2: 39/39 domains stored, Profile retrieval &lt; 10ms, Learning style derived</li>
                    <li>Phase 3: Search &lt; 50ms, Chain traversal &lt; 100ms, Depth limiting works</li>
                    <li>Phase 3.5: Form data persists correctly, All entity types linked</li>
                    <li>Phase 4: ZPD computes &lt; 200ms, Zone partitioning correct, Learning path respects prerequisites</li>
                    <li>Phase 5: 90% gap detection, Forgetting curve accurate, Review queue prioritized</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
