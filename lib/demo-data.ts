/**
 * Demo data for serverless environments where LevelDB is unavailable
 * This provides a working demonstration of the LearnGraph system
 *
 * Note: This data uses a simplified format for demonstration purposes.
 * The DBContext handles conversion to the actual database types.
 */

// =============================================================================
// Demo Learners (simplified format - converted in DBContext)
// =============================================================================
export const demoLearners = [
  {
    id: 'learner:demo-alice',
    userId: 'demo-alice',
    name: 'Alice Chen',
    email: 'alice@demo.learngraph.dev',
    createdAt: new Date('2024-01-15').toISOString(),
    updatedAt: new Date('2024-12-10').toISOString(),
    learningStyle: 'visual',
    cognitiveProfile: {
      processingSpeed: 0.75,
      workingMemory: 0.82,
      attentionSpan: 0.68,
      preferredModality: 'visual',
    },
    psychometricScores: {
      openness: 0.85,
      conscientiousness: 0.72,
      extraversion: 0.45,
      agreeableness: 0.78,
      neuroticism: 0.35,
      visualSpatialAbility: 0.88,
      verbalReasoning: 0.76,
      mathematicalReasoning: 0.82,
      metacognition: 0.70,
      selfEfficacy: 0.75,
      intrinsicMotivation: 0.80,
      growthMindset: 0.85,
    },
    tags: ['honors', 'visual-learner'],
    notes: 'Excels with diagrams and visual representations',
  },
  {
    id: 'learner:demo-bob',
    userId: 'demo-bob',
    name: 'Bob Martinez',
    email: 'bob@demo.learngraph.dev',
    createdAt: new Date('2024-02-20').toISOString(),
    updatedAt: new Date('2024-12-08').toISOString(),
    learningStyle: 'kinesthetic',
    cognitiveProfile: {
      processingSpeed: 0.65,
      workingMemory: 0.70,
      attentionSpan: 0.55,
      preferredModality: 'kinesthetic',
    },
    psychometricScores: {
      openness: 0.70,
      conscientiousness: 0.60,
      extraversion: 0.82,
      agreeableness: 0.85,
      neuroticism: 0.48,
      visualSpatialAbility: 0.65,
      verbalReasoning: 0.70,
      mathematicalReasoning: 0.58,
      metacognition: 0.55,
      selfEfficacy: 0.62,
      intrinsicMotivation: 0.68,
      growthMindset: 0.72,
    },
    tags: ['hands-on', 'group-work'],
    notes: 'Learns best through practice and experimentation',
  },
  {
    id: 'learner:demo-carol',
    userId: 'demo-carol',
    name: 'Carol Kim',
    email: 'carol@demo.learngraph.dev',
    createdAt: new Date('2024-03-10').toISOString(),
    updatedAt: new Date('2024-12-12').toISOString(),
    learningStyle: 'reading-writing',
    cognitiveProfile: {
      processingSpeed: 0.80,
      workingMemory: 0.88,
      attentionSpan: 0.85,
      preferredModality: 'verbal',
    },
    psychometricScores: {
      openness: 0.78,
      conscientiousness: 0.90,
      extraversion: 0.35,
      agreeableness: 0.72,
      neuroticism: 0.28,
      visualSpatialAbility: 0.70,
      verbalReasoning: 0.92,
      mathematicalReasoning: 0.85,
      metacognition: 0.88,
      selfEfficacy: 0.82,
      intrinsicMotivation: 0.85,
      growthMindset: 0.90,
    },
    tags: ['advanced', 'self-directed'],
    notes: 'Strong analytical skills, prefers detailed documentation',
  },
];

// =============================================================================
// Demo Concepts (simplified format - converted in DBContext)
// =============================================================================
export const demoConcepts = [
  // Foundation Math
  {
    id: 'concept:arithmetic',
    name: 'Basic Arithmetic',
    domain: 'mathematics',
    difficulty: 1,
    bloomLevel: 'remember',
    description: 'Addition, subtraction, multiplication, division',
    estimatedMinutes: 120,
    createdAt: new Date('2024-01-01').toISOString(),
  },
  {
    id: 'concept:fractions',
    name: 'Fractions',
    domain: 'mathematics',
    difficulty: 2,
    bloomLevel: 'understand',
    description: 'Working with parts of whole numbers',
    estimatedMinutes: 180,
    createdAt: new Date('2024-01-01').toISOString(),
  },
  {
    id: 'concept:decimals',
    name: 'Decimals',
    domain: 'mathematics',
    difficulty: 2,
    bloomLevel: 'understand',
    description: 'Decimal number operations and conversions',
    estimatedMinutes: 150,
    createdAt: new Date('2024-01-01').toISOString(),
  },
  {
    id: 'concept:pre-algebra',
    name: 'Pre-Algebra',
    domain: 'mathematics',
    difficulty: 3,
    bloomLevel: 'apply',
    description: 'Variables, simple equations, order of operations',
    estimatedMinutes: 240,
    createdAt: new Date('2024-01-01').toISOString(),
  },
  {
    id: 'concept:linear-equations',
    name: 'Linear Equations',
    domain: 'mathematics',
    difficulty: 4,
    bloomLevel: 'apply',
    description: 'Solving and graphing linear equations',
    estimatedMinutes: 300,
    createdAt: new Date('2024-01-01').toISOString(),
  },
  {
    id: 'concept:quadratic-equations',
    name: 'Quadratic Equations',
    domain: 'mathematics',
    difficulty: 5,
    bloomLevel: 'analyze',
    description: 'Solving quadratic equations, factoring, quadratic formula',
    estimatedMinutes: 360,
    createdAt: new Date('2024-01-01').toISOString(),
  },
  // Programming
  {
    id: 'concept:programming-basics',
    name: 'Programming Basics',
    domain: 'computer-science',
    difficulty: 2,
    bloomLevel: 'remember',
    description: 'Variables, data types, basic syntax',
    estimatedMinutes: 180,
    createdAt: new Date('2024-01-01').toISOString(),
  },
  {
    id: 'concept:control-flow',
    name: 'Control Flow',
    domain: 'computer-science',
    difficulty: 3,
    bloomLevel: 'understand',
    description: 'If statements, loops, conditionals',
    estimatedMinutes: 240,
    createdAt: new Date('2024-01-01').toISOString(),
  },
  {
    id: 'concept:functions',
    name: 'Functions',
    domain: 'computer-science',
    difficulty: 4,
    bloomLevel: 'apply',
    description: 'Function definition, parameters, return values',
    estimatedMinutes: 300,
    createdAt: new Date('2024-01-01').toISOString(),
  },
  {
    id: 'concept:data-structures',
    name: 'Data Structures',
    domain: 'computer-science',
    difficulty: 5,
    bloomLevel: 'analyze',
    description: 'Arrays, lists, dictionaries, trees',
    estimatedMinutes: 480,
    createdAt: new Date('2024-01-01').toISOString(),
  },
  {
    id: 'concept:algorithms',
    name: 'Algorithms',
    domain: 'computer-science',
    difficulty: 6,
    bloomLevel: 'evaluate',
    description: 'Sorting, searching, algorithm analysis',
    estimatedMinutes: 600,
    createdAt: new Date('2024-01-01').toISOString(),
  },
];

// =============================================================================
// Demo Prerequisites (simplified format - converted in DBContext)
// =============================================================================
export const demoEdges = [
  // Math chain
  { id: 'edge:arith-frac', from: 'concept:arithmetic', to: 'concept:fractions', weight: 1.0, createdAt: new Date('2024-01-01').toISOString() },
  { id: 'edge:arith-dec', from: 'concept:arithmetic', to: 'concept:decimals', weight: 1.0, createdAt: new Date('2024-01-01').toISOString() },
  { id: 'edge:frac-prealg', from: 'concept:fractions', to: 'concept:pre-algebra', weight: 0.8, createdAt: new Date('2024-01-01').toISOString() },
  { id: 'edge:dec-prealg', from: 'concept:decimals', to: 'concept:pre-algebra', weight: 0.7, createdAt: new Date('2024-01-01').toISOString() },
  { id: 'edge:prealg-linear', from: 'concept:pre-algebra', to: 'concept:linear-equations', weight: 1.0, createdAt: new Date('2024-01-01').toISOString() },
  { id: 'edge:linear-quad', from: 'concept:linear-equations', to: 'concept:quadratic-equations', weight: 1.0, createdAt: new Date('2024-01-01').toISOString() },
  // Programming chain
  { id: 'edge:basics-control', from: 'concept:programming-basics', to: 'concept:control-flow', weight: 1.0, createdAt: new Date('2024-01-01').toISOString() },
  { id: 'edge:control-func', from: 'concept:control-flow', to: 'concept:functions', weight: 1.0, createdAt: new Date('2024-01-01').toISOString() },
  { id: 'edge:func-ds', from: 'concept:functions', to: 'concept:data-structures', weight: 0.9, createdAt: new Date('2024-01-01').toISOString() },
  { id: 'edge:ds-algo', from: 'concept:data-structures', to: 'concept:algorithms', weight: 1.0, createdAt: new Date('2024-01-01').toISOString() },
  // Cross-domain
  { id: 'edge:prealg-basics', from: 'concept:pre-algebra', to: 'concept:programming-basics', weight: 0.5, createdAt: new Date('2024-01-01').toISOString() },
];

// =============================================================================
// Demo Knowledge States (simplified format - converted in DBContext)
// =============================================================================
export const demoKnowledgeStates = [
  // Alice's progress (advanced)
  { id: 'state:alice-arith', learnerId: 'demo-alice', conceptId: 'concept:arithmetic', mastery: 95, confidence: 0.9, lastReviewed: new Date('2024-10-01').toISOString(), reviewCount: 12, createdAt: new Date('2024-02-01').toISOString() },
  { id: 'state:alice-frac', learnerId: 'demo-alice', conceptId: 'concept:fractions', mastery: 88, confidence: 0.85, lastReviewed: new Date('2024-11-15').toISOString(), reviewCount: 8, createdAt: new Date('2024-03-01').toISOString() },
  { id: 'state:alice-dec', learnerId: 'demo-alice', conceptId: 'concept:decimals', mastery: 92, confidence: 0.88, lastReviewed: new Date('2024-11-20').toISOString(), reviewCount: 7, createdAt: new Date('2024-03-15').toISOString() },
  { id: 'state:alice-prealg', learnerId: 'demo-alice', conceptId: 'concept:pre-algebra', mastery: 78, confidence: 0.75, lastReviewed: new Date('2024-12-01').toISOString(), reviewCount: 5, createdAt: new Date('2024-05-01').toISOString() },
  { id: 'state:alice-linear', learnerId: 'demo-alice', conceptId: 'concept:linear-equations', mastery: 45, confidence: 0.55, lastReviewed: new Date('2024-12-10').toISOString(), reviewCount: 2, createdAt: new Date('2024-10-01').toISOString() },
  { id: 'state:alice-prog', learnerId: 'demo-alice', conceptId: 'concept:programming-basics', mastery: 70, confidence: 0.72, lastReviewed: new Date('2024-11-25').toISOString(), reviewCount: 4, createdAt: new Date('2024-06-01').toISOString() },

  // Bob's progress (intermediate)
  { id: 'state:bob-arith', learnerId: 'demo-bob', conceptId: 'concept:arithmetic', mastery: 85, confidence: 0.8, lastReviewed: new Date('2024-09-15').toISOString(), reviewCount: 10, createdAt: new Date('2024-03-01').toISOString() },
  { id: 'state:bob-frac', learnerId: 'demo-bob', conceptId: 'concept:fractions', mastery: 65, confidence: 0.6, lastReviewed: new Date('2024-11-01').toISOString(), reviewCount: 5, createdAt: new Date('2024-05-01').toISOString() },
  { id: 'state:bob-prog', learnerId: 'demo-bob', conceptId: 'concept:programming-basics', mastery: 55, confidence: 0.5, lastReviewed: new Date('2024-12-05').toISOString(), reviewCount: 3, createdAt: new Date('2024-08-01').toISOString() },

  // Carol's progress (advanced across both domains)
  { id: 'state:carol-arith', learnerId: 'demo-carol', conceptId: 'concept:arithmetic', mastery: 98, confidence: 0.95, lastReviewed: new Date('2024-06-01').toISOString(), reviewCount: 15, createdAt: new Date('2024-01-01').toISOString() },
  { id: 'state:carol-frac', learnerId: 'demo-carol', conceptId: 'concept:fractions', mastery: 95, confidence: 0.92, lastReviewed: new Date('2024-08-01').toISOString(), reviewCount: 10, createdAt: new Date('2024-02-01').toISOString() },
  { id: 'state:carol-dec', learnerId: 'demo-carol', conceptId: 'concept:decimals', mastery: 96, confidence: 0.93, lastReviewed: new Date('2024-08-15').toISOString(), reviewCount: 9, createdAt: new Date('2024-02-15').toISOString() },
  { id: 'state:carol-prealg', learnerId: 'demo-carol', conceptId: 'concept:pre-algebra', mastery: 90, confidence: 0.88, lastReviewed: new Date('2024-10-01').toISOString(), reviewCount: 8, createdAt: new Date('2024-04-01').toISOString() },
  { id: 'state:carol-linear', learnerId: 'demo-carol', conceptId: 'concept:linear-equations', mastery: 85, confidence: 0.82, lastReviewed: new Date('2024-11-15').toISOString(), reviewCount: 6, createdAt: new Date('2024-06-01').toISOString() },
  { id: 'state:carol-quad', learnerId: 'demo-carol', conceptId: 'concept:quadratic-equations', mastery: 72, confidence: 0.7, lastReviewed: new Date('2024-12-10').toISOString(), reviewCount: 4, createdAt: new Date('2024-09-01').toISOString() },
  { id: 'state:carol-prog', learnerId: 'demo-carol', conceptId: 'concept:programming-basics', mastery: 88, confidence: 0.85, lastReviewed: new Date('2024-10-20').toISOString(), reviewCount: 7, createdAt: new Date('2024-05-01').toISOString() },
  { id: 'state:carol-ctrl', learnerId: 'demo-carol', conceptId: 'concept:control-flow', mastery: 80, confidence: 0.78, lastReviewed: new Date('2024-11-20').toISOString(), reviewCount: 5, createdAt: new Date('2024-07-01').toISOString() },
  { id: 'state:carol-func', learnerId: 'demo-carol', conceptId: 'concept:functions', mastery: 68, confidence: 0.65, lastReviewed: new Date('2024-12-08').toISOString(), reviewCount: 3, createdAt: new Date('2024-09-15').toISOString() },
];

// =============================================================================
// Demo Mode Detection
// =============================================================================
export function isServerlessEnvironment(): boolean {
  // Netlify
  if (process.env.NETLIFY === 'true') return true;
  // Vercel
  if (process.env.VERCEL === '1') return true;
  // AWS Lambda
  if (process.env.AWS_LAMBDA_FUNCTION_NAME) return true;
  // Check for read-only filesystem (common in serverless)
  if (process.env.DEMO_MODE === 'true') return true;

  return false;
}
