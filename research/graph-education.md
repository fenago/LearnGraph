# Graph-Based Adaptive Education System

## Product Requirements Document (PRD)

### Executive Summary

This document defines a Graph RAG (Retrieval-Augmented Generation) knowledge base using LevelDB that creates personalized learning experiences by combining psychometric profiling with educational psychology frameworks. The system continuously learns from user interactions to identify knowledge gaps and deliver content optimized for each individual's cognitive style, emotional state, and learning preferences.

---

## 1. System Architecture

### 1.1 Single Database, Dual-Graph Model

The system uses **one LevelDB instance** containing **two logical graphs**:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           LevelDB Instance                               │
│                                                                          │
│  ┌─────────────────────────────┐    ┌─────────────────────────────────┐ │
│  │     LEARNER MODEL          │    │      KNOWLEDGE MODEL            │ │
│  │     (Graph A)              │    │      (Graph B)                  │ │
│  │                            │    │                                 │ │
│  │  • User Profiles           │    │  • Concept Nodes                │ │
│  │  • Psychometric Scores     │◄──►│  • Prerequisite Edges           │ │
│  │  • Knowledge State         │    │  • Bloom's Taxonomy Tags        │ │
│  │  • Learning History        │    │  • Difficulty Ratings           │ │
│  │  • Misconceptions          │    │  • Learning Objectives          │ │
│  │  • Preferences             │    │  • Assessment Criteria          │ │
│  │                            │    │                                 │ │
│  └─────────────────────────────┘    └─────────────────────────────────┘ │
│                           │                    │                        │
│                           └────────┬───────────┘                        │
│                                    │                                    │
│                          ┌─────────▼─────────┐                          │
│                          │   ZPD BRIDGE      │                          │
│                          │   (Computed)      │                          │
│                          └───────────────────┘                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### 1.2 Key Prefix Schema

```typescript
// Learner Model Keys (Graph A)
learner:{userId}:profile                    // Core psychometric profile
learner:{userId}:domain:{domainName}        // Individual domain scores
learner:{userId}:knowledge:{conceptId}      // Mastery level per concept
learner:{userId}:history:{timestamp}        // Learning session history
learner:{userId}:misconception:{conceptId}  // Tracked misconceptions
learner:{userId}:preference:{type}          // Learning preferences
learner:{userId}:zpd:current                // Current ZPD snapshot

// Knowledge Model Keys (Graph B)
knowledge:concept:{conceptId}               // Concept node data
knowledge:edge:prerequisite:{from}:{to}     // Prerequisite relationships
knowledge:edge:related:{from}:{to}          // Related concept edges
knowledge:bloom:{conceptId}:{level}         // Bloom's taxonomy mapping
knowledge:difficulty:{conceptId}            // Difficulty rating
knowledge:objective:{objectiveId}           // Learning objectives
knowledge:assessment:{conceptId}            // Assessment criteria
knowledge:scaffold:{conceptId}              // Scaffolding strategies

// Index Keys (for fast lookups)
index:concept:by-difficulty:{level}:{conceptId}
index:concept:by-bloom:{level}:{conceptId}
index:concept:by-domain:{domain}:{conceptId}
index:user:by-gap:{conceptId}:{userId}
```

---

## 2. Graph A: Learner Model

### 2.1 Psychometric Integration

The Learner Model ingests scores from all **39 psychological domains** defined in `Fine-Tuned-Psychometrics.md`:

#### Personality & Temperament
| Domain | Graph Key | Educational Relevance |
|--------|-----------|----------------------|
| Big Five: Openness | `learner:{id}:domain:openness` | Receptivity to novel concepts, abstract thinking |
| Big Five: Conscientiousness | `learner:{id}:domain:conscientiousness` | Self-discipline, goal persistence |
| Big Five: Extraversion | `learner:{id}:domain:extraversion` | Preference for collaborative vs. solo learning |
| Big Five: Agreeableness | `learner:{id}:domain:agreeableness` | Response to feedback, peer learning |
| Big Five: Neuroticism | `learner:{id}:domain:neuroticism` | Stress response, anxiety management needs |

#### Cognitive Style
| Domain | Graph Key | Educational Relevance |
|--------|-----------|----------------------|
| Cognitive Complexity | `learner:{id}:domain:cognitive_complexity` | Capacity for nuanced understanding |
| Analytical Thinking | `learner:{id}:domain:analytical_thinking` | Logical reasoning preference |
| Temporal Orientation | `learner:{id}:domain:temporal_orientation` | Planning vs. present focus |
| Certainty Orientation | `learner:{id}:domain:certainty` | Tolerance for ambiguity |
| Achievement Drive | `learner:{id}:domain:achievement` | Motivation patterns |

#### Emotional Intelligence
| Domain | Graph Key | Educational Relevance |
|--------|-----------|----------------------|
| Emotional Awareness | `learner:{id}:domain:emotional_awareness` | Self-regulation capacity |
| Empathy | `learner:{id}:domain:empathy` | Perspective-taking ability |
| Emotional Expressivity | `learner:{id}:domain:emotional_expressivity` | Communication style |
| Anxiety Indicators | `learner:{id}:domain:anxiety` | Need for scaffolding |

#### Social & Relational
| Domain | Graph Key | Educational Relevance |
|--------|-----------|----------------------|
| Attachment Style | `learner:{id}:domain:attachment_style` | Trust in learning relationships |
| Social Dominance | `learner:{id}:domain:social_dominance` | Leadership in group learning |
| Affiliation Need | `learner:{id}:domain:affiliation` | Community learning preference |
| Love Languages | `learner:{id}:domain:love_languages` | Feedback/recognition preferences |
| Social Support | `learner:{id}:domain:social_support` | Support network awareness |

#### Motivation & Values
| Domain | Graph Key | Educational Relevance |
|--------|-----------|----------------------|
| Intrinsic Motivation | `learner:{id}:domain:intrinsic_motivation` | Self-directed learning capacity |
| Power Motivation | `learner:{id}:domain:power_motivation` | Mastery vs. performance goals |
| Values Orientation | `learner:{id}:domain:values` | What content resonates |
| Life Satisfaction | `learner:{id}:domain:life_satisfaction` | Overall engagement capacity |

#### Self-Perception
| Domain | Graph Key | Educational Relevance |
|--------|-----------|----------------------|
| Self-Esteem | `learner:{id}:domain:self_esteem` | Challenge tolerance |
| Authenticity | `learner:{id}:domain:authenticity` | Genuine engagement |
| Identity Clarity | `learner:{id}:domain:identity_clarity` | Goal alignment |
| Locus of Control | `learner:{id}:domain:locus_of_control` | Agency beliefs |

#### Communication & Processing
| Domain | Graph Key | Educational Relevance |
|--------|-----------|----------------------|
| Narrative Style | `learner:{id}:domain:narrative_style` | Story-based learning preference |
| Formality Level | `learner:{id}:domain:formality` | Communication style preference |
| Clout | `learner:{id}:domain:clout` | Confidence in assertions |

#### Risk & Behavioral
| Domain | Graph Key | Educational Relevance |
|--------|-----------|----------------------|
| Risk Tolerance | `learner:{id}:domain:risk_tolerance` | Willingness to try new approaches |
| Dark Triad | `learner:{id}:domain:dark_triad` | Competitive/manipulative tendencies |

### 2.2 Learner Node Schema

```typescript
interface LearnerProfile {
  userId: string;
  createdAt: number;
  updatedAt: number;

  // Aggregated from 39 domains
  psychometricProfile: {
    [domainName: string]: {
      score: number;           // 0-100 normalized
      confidence: number;      // Statistical confidence
      sampleSize: number;      // Number of data points
      trend: 'improving' | 'stable' | 'declining';
      lastUpdated: number;
    }
  };

  // Derived learning style
  learningStyle: {
    primary: LearningModality;      // visual, auditory, kinesthetic, reading
    secondary: LearningModality;
    socialPreference: 'solo' | 'collaborative' | 'mixed';
    pacePreference: 'self-paced' | 'structured' | 'intensive';
    feedbackPreference: 'immediate' | 'delayed' | 'summary';
  };

  // Cognitive load capacity
  cognitiveProfile: {
    workingMemoryEstimate: number;  // Estimated capacity
    attentionSpan: number;          // Minutes before fatigue
    optimalSessionLength: number;   // Recommended session duration
    complexityTolerance: number;    // Max concept density
  };
}

interface KnowledgeState {
  conceptId: string;
  userId: string;

  mastery: number;              // 0-100, computed from assessments
  exposure: number;             // Number of encounters
  lastAccessed: number;         // Timestamp

  bloomLevel: BloomLevel;       // Current demonstrated level
  confidence: number;           // Self-reported + assessed

  misconceptions: string[];     // Tracked wrong mental models
  strengthAreas: string[];      // What they get right

  timeToMastery: number;        // Predicted time needed
  decayRate: number;            // Forgetting curve coefficient
}

interface LearningSession {
  sessionId: string;
  userId: string;
  timestamp: number;

  conceptsCovered: string[];
  assessmentResults: AssessmentResult[];

  emotionalState: {
    start: EmotionalSnapshot;
    end: EmotionalSnapshot;
  };

  engagementMetrics: {
    timeOnTask: number;
    interactionCount: number;
    helpRequests: number;
    frustrationIndicators: number;
  };

  zpd: {
    targetLevel: number;
    achievedLevel: number;
    scaffoldingUsed: string[];
  };
}
```

### 2.3 Misconception Tracking

```typescript
interface Misconception {
  id: string;
  userId: string;
  conceptId: string;

  description: string;          // What the user believes incorrectly
  evidence: string[];           // Statements/answers showing misconception

  severity: 'minor' | 'moderate' | 'blocking';
  relatedConcepts: string[];    // Other concepts affected

  interventions: {
    attempted: string[];
    successful: string[];
    failed: string[];
  };

  resolved: boolean;
  resolvedAt?: number;
  resolutionMethod?: string;
}
```

---

## 3. Graph B: Knowledge Model

### 3.1 Concept Node Schema

```typescript
interface ConceptNode {
  conceptId: string;
  name: string;
  domain: string;               // e.g., "mathematics", "programming"
  subdomain: string;            // e.g., "algebra", "data structures"

  description: string;

  // Bloom's Taxonomy Mapping
  bloomLevels: {
    remember: LearningObjective[];
    understand: LearningObjective[];
    apply: LearningObjective[];
    analyze: LearningObjective[];
    evaluate: LearningObjective[];
    create: LearningObjective[];
  };

  // Difficulty & Complexity
  difficulty: {
    absolute: number;           // 1-10 universal scale
    cognitiveLoad: number;      // Working memory demand
    abstractness: number;       // Concrete to abstract scale
    prerequisiteDepth: number;  // How many prereqs deep
  };

  // Time Estimates
  timeEstimates: {
    introduction: number;       // Minutes for first exposure
    basicMastery: number;       // Time to basic understanding
    deepMastery: number;        // Time to full competence
  };

  // Content References (external)
  contentRefs: {
    explanations: ContentRef[];
    examples: ContentRef[];
    exercises: ContentRef[];
    assessments: ContentRef[];
  };

  // Metadata
  tags: string[];
  createdAt: number;
  updatedAt: number;
}

interface LearningObjective {
  id: string;
  description: string;          // "Student can solve linear equations"
  assessmentCriteria: string[]; // How to measure achievement
  commonMisconceptions: string[];
}

interface ContentRef {
  id: string;
  type: 'video' | 'text' | 'interactive' | 'exercise' | 'assessment';
  uri: string;                  // External reference
  difficulty: number;
  estimatedTime: number;
  modalityTags: LearningModality[];
}
```

### 3.2 Edge Types

```typescript
// Prerequisite Edge: A must be learned before B
interface PrerequisiteEdge {
  from: string;                 // Prerequisite concept
  to: string;                   // Target concept
  strength: 'required' | 'recommended' | 'helpful';
  reason: string;               // Why this prerequisite matters
}

// Related Edge: A and B share conceptual overlap
interface RelatedEdge {
  concept1: string;
  concept2: string;
  relationshipType: 'analogous' | 'contrasting' | 'builds-upon' | 'applies-to';
  strength: number;             // 0-1, how related
  transferPotential: number;    // How much learning one helps the other
}

// Scaffold Edge: How to bridge from current to target
interface ScaffoldEdge {
  from: string;                 // Current knowledge
  to: string;                   // Target knowledge
  scaffoldingStrategy: ScaffoldingStrategy;
  intermediateSteps: string[];  // Concept IDs for stepping stones
}
```

### 3.3 Bloom's Taxonomy Integration

```typescript
enum BloomLevel {
  REMEMBER = 1,      // Recall facts and basic concepts
  UNDERSTAND = 2,    // Explain ideas or concepts
  APPLY = 3,         // Use information in new situations
  ANALYZE = 4,       // Draw connections among ideas
  EVALUATE = 5,      // Justify a decision or course of action
  CREATE = 6         // Produce new or original work
}

interface BloomMapping {
  conceptId: string;
  level: BloomLevel;

  verbs: string[];              // Action verbs for this level
  activities: string[];         // Suggested learning activities
  assessmentTypes: string[];    // How to assess this level

  prerequisites: {
    sameConceptLowerLevel?: BloomLevel;  // Must master UNDERSTAND before APPLY
    otherConcepts?: string[];            // Other concepts needed at this level
  };
}

// Bloom's Taxonomy Verb Bank (for generating objectives)
const BLOOM_VERBS = {
  [BloomLevel.REMEMBER]: [
    'define', 'list', 'recall', 'identify', 'name', 'recognize', 'reproduce'
  ],
  [BloomLevel.UNDERSTAND]: [
    'explain', 'describe', 'interpret', 'summarize', 'classify', 'compare'
  ],
  [BloomLevel.APPLY]: [
    'apply', 'demonstrate', 'solve', 'use', 'implement', 'execute'
  ],
  [BloomLevel.ANALYZE]: [
    'analyze', 'differentiate', 'organize', 'deconstruct', 'attribute'
  ],
  [BloomLevel.EVALUATE]: [
    'evaluate', 'critique', 'justify', 'assess', 'defend', 'judge'
  ],
  [BloomLevel.CREATE]: [
    'create', 'design', 'construct', 'develop', 'formulate', 'synthesize'
  ]
};
```

---

## 4. Zone of Proximal Development (ZPD) Engine

### 4.1 Vygotsky's Framework Implementation

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│    ┌─────────────────────────────────────────────────────────────┐      │
│    │                                                             │      │
│    │    ┌───────────────────────────────────────────────────┐   │      │
│    │    │                                                   │   │      │
│    │    │    ┌─────────────────────────────────────────┐   │   │      │
│    │    │    │                                         │   │   │      │
│    │    │    │     CURRENT KNOWLEDGE                   │   │   │      │
│    │    │    │     (Can do independently)              │   │   │      │
│    │    │    │                                         │   │   │      │
│    │    │    └─────────────────────────────────────────┘   │   │      │
│    │    │                                                   │   │      │
│    │    │         ZONE OF PROXIMAL DEVELOPMENT             │   │      │
│    │    │         (Can do with scaffolding)                │   │      │
│    │    │                                                   │   │      │
│    │    └───────────────────────────────────────────────────┘   │      │
│    │                                                             │      │
│    │              POTENTIAL DEVELOPMENT                          │      │
│    │              (Cannot do yet)                                │      │
│    │                                                             │      │
│    └─────────────────────────────────────────────────────────────┘      │
│                                                                          │
│                    BEYOND REACH (Too advanced)                           │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### 4.2 ZPD Computation Algorithm

```typescript
interface ZPDAnalysis {
  userId: string;
  computedAt: number;

  // Current state
  currentKnowledge: {
    conceptId: string;
    masteryLevel: number;
    bloomLevel: BloomLevel;
  }[];

  // ZPD boundaries
  zpd: {
    lowerBound: ZPDConcept[];   // Easy stretch
    optimalTarget: ZPDConcept[]; // Ideal next concepts
    upperBound: ZPDConcept[];   // Hard stretch
  };

  // Beyond current ZPD
  tooEasy: string[];            // Already mastered
  tooHard: string[];            // Missing prerequisites

  // Recommended path
  learningPath: LearningPathStep[];
}

interface ZPDConcept {
  conceptId: string;
  readinessScore: number;       // 0-1, how ready for this
  gapAnalysis: {
    missingPrerequisites: string[];
    partialPrerequisites: string[];
    strengthPrerequisites: string[];
  };
  scaffoldingRequired: ScaffoldingStrategy[];
  estimatedEffort: number;      // Hours to mastery
}

// ZPD Computation
function computeZPD(
  userId: string,
  learnerProfile: LearnerProfile,
  knowledgeStates: KnowledgeState[],
  knowledgeGraph: KnowledgeGraph
): ZPDAnalysis {

  // Step 1: Map current knowledge state
  const masteredConcepts = knowledgeStates
    .filter(ks => ks.mastery >= 80)
    .map(ks => ks.conceptId);

  const partialConcepts = knowledgeStates
    .filter(ks => ks.mastery >= 40 && ks.mastery < 80)
    .map(ks => ks.conceptId);

  // Step 2: Find candidate concepts (have most prerequisites met)
  const candidates = knowledgeGraph.concepts
    .filter(concept => !masteredConcepts.includes(concept.id))
    .map(concept => ({
      concept,
      readiness: computeReadiness(concept, masteredConcepts, partialConcepts)
    }))
    .sort((a, b) => b.readiness - a.readiness);

  // Step 3: Apply psychometric adjustments
  const adjustedCandidates = candidates.map(c => ({
    ...c,
    readiness: adjustForPsychometrics(c.readiness, c.concept, learnerProfile)
  }));

  // Step 4: Partition into ZPD zones
  const lowerBound = adjustedCandidates.filter(c => c.readiness >= 0.8);
  const optimalTarget = adjustedCandidates.filter(c => c.readiness >= 0.5 && c.readiness < 0.8);
  const upperBound = adjustedCandidates.filter(c => c.readiness >= 0.3 && c.readiness < 0.5);
  const tooHard = adjustedCandidates.filter(c => c.readiness < 0.3);

  return {
    userId,
    computedAt: Date.now(),
    currentKnowledge: knowledgeStates.map(ks => ({
      conceptId: ks.conceptId,
      masteryLevel: ks.mastery,
      bloomLevel: ks.bloomLevel
    })),
    zpd: {
      lowerBound: lowerBound.map(formatZPDConcept),
      optimalTarget: optimalTarget.map(formatZPDConcept),
      upperBound: upperBound.map(formatZPDConcept)
    },
    tooEasy: masteredConcepts,
    tooHard: tooHard.map(c => c.concept.id),
    learningPath: generateLearningPath(optimalTarget, learnerProfile)
  };
}

// Psychometric adjustment factors
function adjustForPsychometrics(
  baseReadiness: number,
  concept: ConceptNode,
  profile: LearnerProfile
): number {
  let adjusted = baseReadiness;

  // High openness → more ready for abstract concepts
  if (concept.difficulty.abstractness > 0.7) {
    adjusted *= (0.8 + 0.4 * (profile.psychometricProfile.openness?.score ?? 50) / 100);
  }

  // High anxiety → reduce readiness for high-difficulty
  if (concept.difficulty.absolute > 7) {
    adjusted *= (1.2 - 0.4 * (profile.psychometricProfile.anxiety?.score ?? 50) / 100);
  }

  // High conscientiousness → ready for longer learning paths
  if (concept.difficulty.prerequisiteDepth > 3) {
    adjusted *= (0.7 + 0.6 * (profile.psychometricProfile.conscientiousness?.score ?? 50) / 100);
  }

  // Low risk tolerance → prefer well-structured concepts
  if (concept.difficulty.cognitiveLoad > 0.7) {
    const riskTolerance = profile.psychometricProfile.risk_tolerance?.score ?? 50;
    adjusted *= (0.6 + 0.8 * riskTolerance / 100);
  }

  return Math.min(1, Math.max(0, adjusted));
}
```

### 4.3 Scaffolding Strategies

```typescript
enum ScaffoldingStrategy {
  // Cognitive scaffolds
  CHUNKING = 'chunking',                    // Break into smaller pieces
  ANALOGY = 'analogy',                      // Connect to known concepts
  WORKED_EXAMPLES = 'worked_examples',      // Step-by-step demonstrations
  VISUAL_REPRESENTATION = 'visual',         // Diagrams, charts, maps

  // Metacognitive scaffolds
  SELF_EXPLANATION = 'self_explanation',    // Prompt to explain thinking
  PREDICTION = 'prediction',                // What do you think happens?
  REFLECTION = 'reflection',                // What did you learn?

  // Procedural scaffolds
  CHECKLIST = 'checklist',                  // Step-by-step guide
  TEMPLATE = 'template',                    // Fill-in-the-blank structure
  HINTS = 'hints',                          // Progressive hints

  // Social scaffolds
  PEER_DISCUSSION = 'peer_discussion',      // Discuss with others
  EXPERT_MODELING = 'expert_modeling',      // Watch expert do it
  COLLABORATIVE = 'collaborative'           // Work together
}

interface ScaffoldApplication {
  strategy: ScaffoldingStrategy;
  conceptId: string;
  userId: string;

  // When to apply
  trigger: {
    masteryThreshold: number;   // Apply when mastery below this
    frustrationLevel: number;   // Apply when frustration above this
    timeStuck: number;          // Apply after this many minutes
  };

  // How to apply
  implementation: {
    prompt: string;             // What to say/show
    resources: ContentRef[];    // Supporting materials
    duration: number;           // Expected time
  };

  // Effectiveness tracking
  outcomes: {
    timesUsed: number;
    successRate: number;
    avgMasteryGain: number;
  };
}

// Select scaffolding based on psychometrics
function selectScaffoldingStrategies(
  concept: ConceptNode,
  profile: LearnerProfile,
  currentMastery: number
): ScaffoldingStrategy[] {
  const strategies: ScaffoldingStrategy[] = [];

  // Visual learners
  if (profile.learningStyle.primary === 'visual') {
    strategies.push(ScaffoldingStrategy.VISUAL_REPRESENTATION);
  }

  // High cognitive complexity → can handle analogy
  if ((profile.psychometricProfile.cognitive_complexity?.score ?? 50) > 60) {
    strategies.push(ScaffoldingStrategy.ANALOGY);
  }

  // Low working memory → needs chunking
  if (profile.cognitiveProfile.workingMemoryEstimate < 5) {
    strategies.push(ScaffoldingStrategy.CHUNKING);
  }

  // High extraversion → benefits from social scaffolds
  if ((profile.psychometricProfile.extraversion?.score ?? 50) > 65) {
    strategies.push(ScaffoldingStrategy.PEER_DISCUSSION);
    strategies.push(ScaffoldingStrategy.COLLABORATIVE);
  }

  // High conscientiousness → likes structure
  if ((profile.psychometricProfile.conscientiousness?.score ?? 50) > 65) {
    strategies.push(ScaffoldingStrategy.CHECKLIST);
    strategies.push(ScaffoldingStrategy.TEMPLATE);
  }

  // Low self-esteem → needs worked examples first
  if ((profile.psychometricProfile.self_esteem?.score ?? 50) < 40) {
    strategies.push(ScaffoldingStrategy.WORKED_EXAMPLES);
    strategies.push(ScaffoldingStrategy.HINTS);
  }

  // High analytical thinking → benefits from self-explanation
  if ((profile.psychometricProfile.analytical_thinking?.score ?? 50) > 60) {
    strategies.push(ScaffoldingStrategy.SELF_EXPLANATION);
  }

  return strategies;
}
```

---

## 5. Adaptive Content Delivery

### 5.1 Content Selection Algorithm

```typescript
interface ContentRecommendation {
  userId: string;
  conceptId: string;

  recommendedContent: {
    contentRef: ContentRef;
    score: number;              // 0-1 match score
    reasons: string[];          // Why recommended
  }[];

  presentationStrategy: {
    modality: LearningModality;
    pace: 'slow' | 'moderate' | 'fast';
    depth: 'overview' | 'standard' | 'deep';
    interactivity: 'passive' | 'guided' | 'exploratory';
  };

  sessionPlan: {
    warmup: ContentRef[];       // Activate prior knowledge
    core: ContentRef[];         // Main content
    practice: ContentRef[];     // Apply learning
    assessment: ContentRef[];   // Check understanding
    extension: ContentRef[];    // For fast learners
  };
}

function selectContent(
  concept: ConceptNode,
  profile: LearnerProfile,
  knowledgeState: KnowledgeState,
  zpd: ZPDAnalysis
): ContentRecommendation {

  // Score each piece of content
  const scoredContent = concept.contentRefs.flatMap(category =>
    category.map(content => ({
      content,
      score: scoreContentMatch(content, profile, knowledgeState)
    }))
  ).sort((a, b) => b.score - a.score);

  // Determine presentation strategy
  const strategy = determinePresentationStrategy(profile, knowledgeState);

  // Build session plan
  const sessionPlan = buildSessionPlan(scoredContent, strategy, profile);

  return {
    userId: profile.userId,
    conceptId: concept.conceptId,
    recommendedContent: scoredContent.slice(0, 5),
    presentationStrategy: strategy,
    sessionPlan
  };
}

function scoreContentMatch(
  content: ContentRef,
  profile: LearnerProfile,
  knowledgeState: KnowledgeState
): number {
  let score = 0.5; // Base score

  // Modality match
  if (content.modalityTags.includes(profile.learningStyle.primary)) {
    score += 0.2;
  }
  if (content.modalityTags.includes(profile.learningStyle.secondary)) {
    score += 0.1;
  }

  // Difficulty match to current state
  const difficultyGap = Math.abs(content.difficulty - (knowledgeState.mastery / 10));
  score -= difficultyGap * 0.05;

  // Time match to attention span
  const timeRatio = content.estimatedTime / profile.cognitiveProfile.attentionSpan;
  if (timeRatio > 0.5 && timeRatio < 1.2) {
    score += 0.1; // Good fit
  } else if (timeRatio > 1.5) {
    score -= 0.2; // Too long
  }

  // Interactive content for kinesthetic learners
  if (content.type === 'interactive' && profile.learningStyle.primary === 'kinesthetic') {
    score += 0.15;
  }

  return Math.min(1, Math.max(0, score));
}
```

### 5.2 Adaptive Pacing

```typescript
interface PacingModel {
  userId: string;

  // Real-time adjustments
  currentSession: {
    startTime: number;
    conceptsPresented: number;
    assessmentsPassed: number;
    assessmentsFailed: number;
    hintRequests: number;
    pauseDuration: number;      // Total pause time
  };

  // Computed pace
  recommendedPace: {
    conceptsPerHour: number;
    breakFrequency: number;     // Minutes between breaks
    breakDuration: number;      // Minutes per break
    reviewFrequency: number;    // How often to review
  };

  // Adjustment triggers
  triggers: {
    slowDown: string[];         // Reasons to slow down
    speedUp: string[];          // Reasons to speed up
    takeBreak: string[];        // Reasons to suggest break
  };
}

// Spaced Repetition Integration
interface SpacedRepetition {
  userId: string;
  conceptId: string;

  // SM-2 algorithm parameters
  easeFactor: number;           // Default 2.5
  interval: number;             // Days until next review
  repetitions: number;          // Successful reviews

  // Next review
  nextReviewDate: number;
  priority: number;             // Higher = more urgent

  // History
  reviews: {
    date: number;
    quality: number;            // 0-5 self-rating
    responseTime: number;       // How long to recall
  }[];
}
```

---

## 6. Knowledge Gap Analysis

### 6.1 Gap Detection

```typescript
interface KnowledgeGap {
  userId: string;
  gapId: string;

  // Gap identification
  concept: string;
  gapType: 'missing' | 'partial' | 'misconception' | 'forgotten';

  severity: number;             // 0-1, how critical
  impact: string[];             // Concepts blocked by this gap

  // Evidence
  evidence: {
    assessmentFailures: AssessmentResult[];
    misconceptionIndicators: string[];
    decayIndicators: {
      lastAccessed: number;
      predictedRetention: number;
    };
  };

  // Remediation plan
  remediationPlan: {
    approach: 'reteach' | 'reinforce' | 'correct' | 'refresh';
    steps: RemediationStep[];
    estimatedTime: number;
    priority: number;
  };
}

function analyzeKnowledgeGaps(
  userId: string,
  knowledgeStates: Map<string, KnowledgeState>,
  knowledgeGraph: KnowledgeGraph,
  targetConcepts: string[]
): KnowledgeGap[] {
  const gaps: KnowledgeGap[] = [];

  for (const targetId of targetConcepts) {
    const target = knowledgeGraph.getConcept(targetId);
    const prerequisites = knowledgeGraph.getPrerequisites(targetId);

    for (const prereq of prerequisites) {
      const state = knowledgeStates.get(prereq.conceptId);

      // Missing: Never learned
      if (!state || state.exposure === 0) {
        gaps.push({
          userId,
          gapId: `${userId}:${prereq.conceptId}:missing`,
          concept: prereq.conceptId,
          gapType: 'missing',
          severity: prereq.strength === 'required' ? 1.0 : 0.5,
          impact: [targetId],
          evidence: {
            assessmentFailures: [],
            misconceptionIndicators: [],
            decayIndicators: { lastAccessed: 0, predictedRetention: 0 }
          },
          remediationPlan: createRemediationPlan('reteach', prereq)
        });
      }

      // Partial: Started but not mastered
      else if (state.mastery < 70) {
        gaps.push({
          userId,
          gapId: `${userId}:${prereq.conceptId}:partial`,
          concept: prereq.conceptId,
          gapType: 'partial',
          severity: (70 - state.mastery) / 100,
          impact: [targetId],
          evidence: {
            assessmentFailures: [],
            misconceptionIndicators: [],
            decayIndicators: { lastAccessed: state.lastAccessed, predictedRetention: state.mastery }
          },
          remediationPlan: createRemediationPlan('reinforce', prereq)
        });
      }

      // Forgotten: Was mastered but decayed
      else if (predictDecay(state) < 50) {
        gaps.push({
          userId,
          gapId: `${userId}:${prereq.conceptId}:forgotten`,
          concept: prereq.conceptId,
          gapType: 'forgotten',
          severity: (50 - predictDecay(state)) / 100,
          impact: [targetId],
          evidence: {
            assessmentFailures: [],
            misconceptionIndicators: [],
            decayIndicators: { lastAccessed: state.lastAccessed, predictedRetention: predictDecay(state) }
          },
          remediationPlan: createRemediationPlan('refresh', prereq)
        });
      }

      // Misconception: Active but wrong
      if (state && state.misconceptions.length > 0) {
        gaps.push({
          userId,
          gapId: `${userId}:${prereq.conceptId}:misconception`,
          concept: prereq.conceptId,
          gapType: 'misconception',
          severity: 0.8, // Misconceptions are high priority
          impact: [targetId],
          evidence: {
            assessmentFailures: [],
            misconceptionIndicators: state.misconceptions,
            decayIndicators: { lastAccessed: state.lastAccessed, predictedRetention: state.mastery }
          },
          remediationPlan: createRemediationPlan('correct', prereq)
        });
      }
    }
  }

  return gaps.sort((a, b) => b.severity - a.severity);
}
```

### 6.2 Forgetting Curve (Ebbinghaus)

```typescript
// Predict retention based on time since last review
function predictDecay(state: KnowledgeState): number {
  const daysSinceAccess = (Date.now() - state.lastAccessed) / (1000 * 60 * 60 * 24);

  // Ebbinghaus forgetting curve: R = e^(-t/S)
  // S = stability (increases with repetitions and mastery)
  const stability = state.mastery * (1 + Math.log(state.exposure + 1));
  const retention = Math.exp(-daysSinceAccess / stability) * 100;

  return Math.max(0, Math.min(100, retention * (state.mastery / 100)));
}

// Optimal review scheduling
function scheduleNextReview(state: KnowledgeState): number {
  // Target 90% retention at next review
  const targetRetention = 0.9;
  const stability = state.mastery * (1 + Math.log(state.exposure + 1));

  // Solve for t: 0.9 = e^(-t/S) → t = -S * ln(0.9)
  const daysUntilReview = -stability * Math.log(targetRetention);

  return Date.now() + (daysUntilReview * 24 * 60 * 60 * 1000);
}
```

---

## 7. Graph RAG Integration

### 7.1 RAG Query Patterns

```typescript
// Common query patterns for the Graph RAG system

interface GraphRAGQuery {
  queryType: QueryType;
  context: QueryContext;
  retrievalStrategy: RetrievalStrategy;
}

enum QueryType {
  // Learner queries
  LEARNER_PROFILE = 'learner_profile',
  LEARNING_HISTORY = 'learning_history',
  CURRENT_GAPS = 'current_gaps',
  RECOMMENDED_NEXT = 'recommended_next',

  // Knowledge queries
  CONCEPT_DETAILS = 'concept_details',
  PREREQUISITES_CHAIN = 'prerequisites_chain',
  RELATED_CONCEPTS = 'related_concepts',
  BLOOM_PROGRESSION = 'bloom_progression',

  // Bridge queries (ZPD)
  ZPD_ANALYSIS = 'zpd_analysis',
  PERSONALIZED_PATH = 'personalized_path',
  SCAFFOLD_SELECTION = 'scaffold_selection',
  CONTENT_MATCH = 'content_match'
}

// Example RAG retrievals for LLM augmentation
const ragExamples = {
  // "What should I learn next?"
  recommendedNext: async (userId: string, db: LevelDB) => {
    const profile = await db.get(`learner:${userId}:profile`);
    const zpd = await db.get(`learner:${userId}:zpd:current`);
    const optimalConcepts = zpd.optimalTarget.slice(0, 3);

    return {
      learnerContext: {
        strengths: profile.learningStyle,
        cognitiveLoad: profile.cognitiveProfile,
        recentProgress: await getRecentSessions(userId, db)
      },
      recommendedConcepts: await Promise.all(
        optimalConcepts.map(c => db.get(`knowledge:concept:${c.conceptId}`))
      ),
      scaffolding: optimalConcepts.map(c => c.scaffoldingRequired)
    };
  },

  // "Explain [concept] to me"
  conceptExplanation: async (userId: string, conceptId: string, db: LevelDB) => {
    const profile = await db.get(`learner:${userId}:profile`);
    const knowledgeState = await db.get(`learner:${userId}:knowledge:${conceptId}`);
    const concept = await db.get(`knowledge:concept:${conceptId}`);
    const prerequisites = await getPrerequisiteChain(conceptId, db);

    return {
      conceptData: concept,
      userState: {
        currentMastery: knowledgeState?.mastery ?? 0,
        bloomLevel: knowledgeState?.bloomLevel ?? BloomLevel.REMEMBER,
        misconceptions: knowledgeState?.misconceptions ?? []
      },
      adaptations: {
        preferredModality: profile.learningStyle.primary,
        complexityLevel: profile.psychometricProfile.cognitive_complexity?.score ?? 50,
        analogyPreference: profile.psychometricProfile.openness?.score > 60
      },
      prerequisites: prerequisites.map(p => ({
        concept: p,
        userMastery: p.userMastery
      }))
    };
  },

  // "I don't understand [concept]"
  misconceptionHelp: async (userId: string, conceptId: string, db: LevelDB) => {
    const profile = await db.get(`learner:${userId}:profile`);
    const misconceptions = await db.get(`learner:${userId}:misconception:${conceptId}`);
    const concept = await db.get(`knowledge:concept:${conceptId}`);

    return {
      knownMisconceptions: misconceptions,
      commonMisconceptions: concept.bloomLevels.understand
        .flatMap(obj => obj.commonMisconceptions),
      scaffoldingHistory: misconceptions?.interventions ?? { attempted: [], successful: [], failed: [] },
      learnerProfile: {
        anxietyLevel: profile.psychometricProfile.anxiety?.score ?? 50,
        selfEsteem: profile.psychometricProfile.self_esteem?.score ?? 50,
        preferredFeedback: profile.learningStyle.feedbackPreference
      }
    };
  }
};
```

### 7.2 LevelDB Operations

```typescript
import { Level } from 'level';

interface GraphDatabase {
  db: Level<string, any>;

  // Learner operations
  setLearnerProfile(userId: string, profile: LearnerProfile): Promise<void>;
  getLearnerProfile(userId: string): Promise<LearnerProfile | null>;
  updateDomainScore(userId: string, domain: string, score: DomainScore): Promise<void>;

  // Knowledge operations
  addConcept(concept: ConceptNode): Promise<void>;
  getConcept(conceptId: string): Promise<ConceptNode | null>;
  addEdge(edge: PrerequisiteEdge | RelatedEdge): Promise<void>;

  // Graph traversals
  getPrerequisites(conceptId: string, depth?: number): Promise<ConceptNode[]>;
  getRelated(conceptId: string, maxDistance?: number): Promise<ConceptNode[]>;
  getConceptsByDifficulty(minDiff: number, maxDiff: number): Promise<ConceptNode[]>;

  // ZPD operations
  computeAndStoreZPD(userId: string): Promise<ZPDAnalysis>;
  getZPD(userId: string): Promise<ZPDAnalysis | null>;

  // Search & retrieval
  searchConcepts(query: string): Promise<ConceptNode[]>;
  getConceptsForRAG(userId: string, query: string, limit: number): Promise<RAGContext>;
}

// Implementation
class EducationGraphDB implements GraphDatabase {
  db: Level<string, any>;

  constructor(dbPath: string) {
    this.db = new Level(dbPath, { valueEncoding: 'json' });
  }

  // Key generation helpers
  private learnerKey(userId: string, ...parts: string[]): string {
    return ['learner', userId, ...parts].join(':');
  }

  private knowledgeKey(...parts: string[]): string {
    return ['knowledge', ...parts].join(':');
  }

  private indexKey(...parts: string[]): string {
    return ['index', ...parts].join(':');
  }

  // Learner operations
  async setLearnerProfile(userId: string, profile: LearnerProfile): Promise<void> {
    await this.db.put(this.learnerKey(userId, 'profile'), profile);
  }

  async getLearnerProfile(userId: string): Promise<LearnerProfile | null> {
    try {
      return await this.db.get(this.learnerKey(userId, 'profile'));
    } catch (e) {
      if (e.code === 'LEVEL_NOT_FOUND') return null;
      throw e;
    }
  }

  async updateDomainScore(userId: string, domain: string, score: DomainScore): Promise<void> {
    const profile = await this.getLearnerProfile(userId);
    if (!profile) throw new Error(`User ${userId} not found`);

    profile.psychometricProfile[domain] = {
      ...profile.psychometricProfile[domain],
      ...score,
      lastUpdated: Date.now()
    };

    await this.setLearnerProfile(userId, profile);
  }

  // Knowledge operations
  async addConcept(concept: ConceptNode): Promise<void> {
    const batch = this.db.batch();

    // Store concept
    batch.put(this.knowledgeKey('concept', concept.conceptId), concept);

    // Index by difficulty
    batch.put(
      this.indexKey('concept', 'by-difficulty',
        String(concept.difficulty.absolute).padStart(2, '0'),
        concept.conceptId),
      true
    );

    // Index by domain
    batch.put(
      this.indexKey('concept', 'by-domain', concept.domain, concept.conceptId),
      true
    );

    // Index by Bloom levels
    for (const [level, objectives] of Object.entries(concept.bloomLevels)) {
      if (objectives.length > 0) {
        batch.put(
          this.indexKey('concept', 'by-bloom', level, concept.conceptId),
          true
        );
      }
    }

    await batch.write();
  }

  async getConcept(conceptId: string): Promise<ConceptNode | null> {
    try {
      return await this.db.get(this.knowledgeKey('concept', conceptId));
    } catch (e) {
      if (e.code === 'LEVEL_NOT_FOUND') return null;
      throw e;
    }
  }

  async addEdge(edge: PrerequisiteEdge | RelatedEdge): Promise<void> {
    if ('from' in edge && 'to' in edge && 'strength' in edge) {
      // Prerequisite edge
      await this.db.put(
        this.knowledgeKey('edge', 'prerequisite', edge.from, edge.to),
        edge
      );
    } else {
      // Related edge
      const related = edge as RelatedEdge;
      await this.db.put(
        this.knowledgeKey('edge', 'related', related.concept1, related.concept2),
        edge
      );
      // Bidirectional
      await this.db.put(
        this.knowledgeKey('edge', 'related', related.concept2, related.concept1),
        edge
      );
    }
  }

  // Graph traversals
  async getPrerequisites(conceptId: string, depth: number = 3): Promise<ConceptNode[]> {
    const visited = new Set<string>();
    const result: ConceptNode[] = [];

    const traverse = async (id: string, currentDepth: number) => {
      if (currentDepth > depth || visited.has(id)) return;
      visited.add(id);

      // Find all prerequisite edges for this concept
      const prefix = this.knowledgeKey('edge', 'prerequisite');
      for await (const [key, edge] of this.db.iterator({
        gte: prefix,
        lte: prefix + '\xFF'
      })) {
        if ((edge as PrerequisiteEdge).to === id) {
          const prereqConcept = await this.getConcept((edge as PrerequisiteEdge).from);
          if (prereqConcept) {
            result.push(prereqConcept);
            await traverse(prereqConcept.conceptId, currentDepth + 1);
          }
        }
      }
    };

    await traverse(conceptId, 0);
    return result;
  }

  // ZPD operations
  async computeAndStoreZPD(userId: string): Promise<ZPDAnalysis> {
    const profile = await this.getLearnerProfile(userId);
    if (!profile) throw new Error(`User ${userId} not found`);

    // Get all knowledge states
    const knowledgeStates: KnowledgeState[] = [];
    const prefix = this.learnerKey(userId, 'knowledge');
    for await (const [key, state] of this.db.iterator({
      gte: prefix,
      lte: prefix + '\xFF'
    })) {
      knowledgeStates.push(state);
    }

    // Get all concepts
    const concepts: ConceptNode[] = [];
    const conceptPrefix = this.knowledgeKey('concept');
    for await (const [key, concept] of this.db.iterator({
      gte: conceptPrefix,
      lte: conceptPrefix + '\xFF'
    })) {
      concepts.push(concept);
    }

    // Build knowledge graph
    const knowledgeGraph = { concepts, getPrerequisites: this.getPrerequisites.bind(this) };

    // Compute ZPD
    const zpd = computeZPD(userId, profile, knowledgeStates, knowledgeGraph);

    // Store ZPD
    await this.db.put(this.learnerKey(userId, 'zpd', 'current'), zpd);

    return zpd;
  }
}

// Usage example
async function initializeEducationGraph() {
  const db = new EducationGraphDB('./data/education-graph');

  // Add a concept
  await db.addConcept({
    conceptId: 'algebra-linear-equations',
    name: 'Linear Equations',
    domain: 'mathematics',
    subdomain: 'algebra',
    description: 'Equations of the first degree with one or more variables',
    bloomLevels: {
      remember: [{ id: 'le-r1', description: 'Define what a linear equation is', assessmentCriteria: ['Can state definition'], commonMisconceptions: ['Confusing with quadratic'] }],
      understand: [{ id: 'le-u1', description: 'Explain why the graph is a line', assessmentCriteria: ['Can explain slope-intercept'], commonMisconceptions: ['Thinking all equations are lines'] }],
      apply: [{ id: 'le-a1', description: 'Solve linear equations with one variable', assessmentCriteria: ['Correctly solves 3x + 5 = 20'], commonMisconceptions: ['Sign errors when moving terms'] }],
      analyze: [{ id: 'le-an1', description: 'Determine if an equation is linear', assessmentCriteria: ['Correctly classifies equations'], commonMisconceptions: [] }],
      evaluate: [{ id: 'le-e1', description: 'Choose appropriate method for system of equations', assessmentCriteria: ['Selects substitution vs elimination appropriately'], commonMisconceptions: [] }],
      create: [{ id: 'le-c1', description: 'Model real-world situations with linear equations', assessmentCriteria: ['Creates valid equation from word problem'], commonMisconceptions: ['Incorrect variable assignment'] }]
    },
    difficulty: {
      absolute: 4,
      cognitiveLoad: 0.5,
      abstractness: 0.6,
      prerequisiteDepth: 2
    },
    timeEstimates: {
      introduction: 15,
      basicMastery: 120,
      deepMastery: 480
    },
    contentRefs: {
      explanations: [],
      examples: [],
      exercises: [],
      assessments: []
    },
    tags: ['algebra', 'equations', 'foundational'],
    createdAt: Date.now(),
    updatedAt: Date.now()
  });

  // Add prerequisite
  await db.addEdge({
    from: 'arithmetic-operations',
    to: 'algebra-linear-equations',
    strength: 'required',
    reason: 'Must understand addition, subtraction, multiplication, division'
  });

  return db;
}
```

---

## 8. Future: Graph Neural Network Integration

### 8.1 GNN Architecture Vision

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    Graph Neural Network Layer                            │
│                                                                          │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────────┐ │
│  │ Node Embeddings │    │ Message Passing │    │ Prediction Heads    │ │
│  │                 │    │                 │    │                     │ │
│  │ • Learner nodes │───►│ • Aggregate     │───►│ • Mastery prediction│ │
│  │ • Concept nodes │    │   neighbors     │    │ • Optimal path      │ │
│  │ • Session nodes │    │ • Update        │    │ • Engagement        │ │
│  │                 │    │   embeddings    │    │ • Difficulty adj.   │ │
│  └─────────────────┘    └─────────────────┘    └─────────────────────┘ │
│                                                                          │
│  Training Objectives:                                                    │
│  • Predict next concept mastered (link prediction)                       │
│  • Predict time to mastery (regression)                                  │
│  • Predict dropout risk (classification)                                 │
│  • Recommend content (ranking)                                           │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### 8.2 Node Embedding Schema

```typescript
interface GNNNodeEmbedding {
  nodeType: 'learner' | 'concept' | 'session' | 'content';
  nodeId: string;

  // Raw features (input to GNN)
  features: number[];

  // Learned embedding (output of GNN)
  embedding?: number[];
  embeddingVersion?: number;

  // Edges for message passing
  edges: {
    targetNode: string;
    edgeType: string;
    edgeFeatures: number[];
  }[];
}

// Feature extraction for GNN training
function extractLearnerFeatures(profile: LearnerProfile): number[] {
  return [
    // Big Five (normalized 0-1)
    (profile.psychometricProfile.openness?.score ?? 50) / 100,
    (profile.psychometricProfile.conscientiousness?.score ?? 50) / 100,
    (profile.psychometricProfile.extraversion?.score ?? 50) / 100,
    (profile.psychometricProfile.agreeableness?.score ?? 50) / 100,
    (profile.psychometricProfile.neuroticism?.score ?? 50) / 100,

    // Cognitive (normalized)
    (profile.psychometricProfile.cognitive_complexity?.score ?? 50) / 100,
    (profile.psychometricProfile.analytical_thinking?.score ?? 50) / 100,

    // Learning style (one-hot)
    profile.learningStyle.primary === 'visual' ? 1 : 0,
    profile.learningStyle.primary === 'auditory' ? 1 : 0,
    profile.learningStyle.primary === 'kinesthetic' ? 1 : 0,
    profile.learningStyle.primary === 'reading' ? 1 : 0,

    // Social preference (one-hot)
    profile.learningStyle.socialPreference === 'solo' ? 1 : 0,
    profile.learningStyle.socialPreference === 'collaborative' ? 1 : 0,
    profile.learningStyle.socialPreference === 'mixed' ? 1 : 0,

    // Cognitive load (normalized)
    profile.cognitiveProfile.workingMemoryEstimate / 10,
    profile.cognitiveProfile.attentionSpan / 120,
    profile.cognitiveProfile.complexityTolerance
  ];
}

function extractConceptFeatures(concept: ConceptNode): number[] {
  return [
    // Difficulty metrics
    concept.difficulty.absolute / 10,
    concept.difficulty.cognitiveLoad,
    concept.difficulty.abstractness,
    concept.difficulty.prerequisiteDepth / 10,

    // Time estimates (normalized)
    concept.timeEstimates.introduction / 60,
    concept.timeEstimates.basicMastery / 480,
    concept.timeEstimates.deepMastery / 1440,

    // Bloom levels available (binary)
    concept.bloomLevels.remember.length > 0 ? 1 : 0,
    concept.bloomLevels.understand.length > 0 ? 1 : 0,
    concept.bloomLevels.apply.length > 0 ? 1 : 0,
    concept.bloomLevels.analyze.length > 0 ? 1 : 0,
    concept.bloomLevels.evaluate.length > 0 ? 1 : 0,
    concept.bloomLevels.create.length > 0 ? 1 : 0
  ];
}
```

### 8.3 GNN Training Data Export

```typescript
// Export graph data for GNN training
async function exportForGNNTraining(db: EducationGraphDB): Promise<GNNTrainingData> {
  const nodes: GNNNodeEmbedding[] = [];
  const edges: GNNEdge[] = [];
  const labels: GNNLabel[] = [];

  // Export learner nodes
  for await (const [key, profile] of db.db.iterator({
    gte: 'learner:',
    lte: 'learner:\xFF'
  })) {
    if (key.endsWith(':profile')) {
      const userId = key.split(':')[1];
      nodes.push({
        nodeType: 'learner',
        nodeId: `learner:${userId}`,
        features: extractLearnerFeatures(profile),
        edges: []
      });
    }
  }

  // Export concept nodes
  for await (const [key, concept] of db.db.iterator({
    gte: 'knowledge:concept:',
    lte: 'knowledge:concept:\xFF'
  })) {
    nodes.push({
      nodeType: 'concept',
      nodeId: `concept:${concept.conceptId}`,
      features: extractConceptFeatures(concept),
      edges: []
    });
  }

  // Export edges
  for await (const [key, edge] of db.db.iterator({
    gte: 'knowledge:edge:',
    lte: 'knowledge:edge:\xFF'
  })) {
    if (key.includes(':prerequisite:')) {
      edges.push({
        source: `concept:${edge.from}`,
        target: `concept:${edge.to}`,
        edgeType: 'prerequisite',
        features: [edge.strength === 'required' ? 1 : edge.strength === 'recommended' ? 0.5 : 0.25]
      });
    }
  }

  // Export learner-concept edges (knowledge states)
  for await (const [key, state] of db.db.iterator({
    gte: 'learner:',
    lte: 'learner:\xFF'
  })) {
    if (key.includes(':knowledge:')) {
      const parts = key.split(':');
      const userId = parts[1];
      const conceptId = parts[3];

      edges.push({
        source: `learner:${userId}`,
        target: `concept:${conceptId}`,
        edgeType: 'studied',
        features: [
          state.mastery / 100,
          state.bloomLevel / 6,
          state.exposure / 100,
          state.confidence / 100
        ]
      });

      // Labels for supervised learning
      labels.push({
        nodeId: `learner:${userId}`,
        targetConcept: conceptId,
        label: state.mastery / 100,
        labelType: 'mastery'
      });
    }
  }

  return { nodes, edges, labels };
}

interface GNNTrainingData {
  nodes: GNNNodeEmbedding[];
  edges: GNNEdge[];
  labels: GNNLabel[];
}

interface GNNEdge {
  source: string;
  target: string;
  edgeType: string;
  features: number[];
}

interface GNNLabel {
  nodeId: string;
  targetConcept?: string;
  label: number;
  labelType: 'mastery' | 'engagement' | 'dropout' | 'time_to_mastery';
}
```

---

## 9. API Design

### 9.1 Core Endpoints

```typescript
interface EducationGraphAPI {
  // Learner Management
  createLearner(profile: Partial<LearnerProfile>): Promise<LearnerProfile>;
  updateLearnerProfile(userId: string, updates: Partial<LearnerProfile>): Promise<LearnerProfile>;
  getLearnerProfile(userId: string): Promise<LearnerProfile>;

  // Psychometric Updates (from Fine-Tuned-Psychometrics)
  updatePsychometricDomain(userId: string, domain: string, score: number, confidence: number): Promise<void>;
  batchUpdatePsychometrics(userId: string, updates: Record<string, DomainScore>): Promise<void>;

  // Knowledge State
  recordLearningSession(session: LearningSession): Promise<void>;
  updateKnowledgeState(userId: string, conceptId: string, state: Partial<KnowledgeState>): Promise<void>;
  getKnowledgeState(userId: string, conceptId: string): Promise<KnowledgeState>;

  // ZPD & Recommendations
  getZPD(userId: string): Promise<ZPDAnalysis>;
  getRecommendedConcepts(userId: string, limit?: number): Promise<ConceptRecommendation[]>;
  getLearningPath(userId: string, targetConceptId: string): Promise<LearningPathStep[]>;

  // Knowledge Graph
  addConcept(concept: ConceptNode): Promise<void>;
  addPrerequisite(from: string, to: string, strength: string): Promise<void>;
  searchConcepts(query: string, filters?: ConceptFilters): Promise<ConceptNode[]>;

  // Gap Analysis
  analyzeGaps(userId: string, targetConcepts: string[]): Promise<KnowledgeGap[]>;
  getRemediationPlan(userId: string, gapId: string): Promise<RemediationPlan>;

  // RAG Context
  getRAGContext(userId: string, query: string): Promise<RAGContext>;

  // Spaced Repetition
  getReviewQueue(userId: string, limit?: number): Promise<ReviewItem[]>;
  recordReview(userId: string, conceptId: string, quality: number): Promise<void>;
}

interface RAGContext {
  learnerProfile: Partial<LearnerProfile>;
  relevantKnowledgeStates: KnowledgeState[];
  relevantConcepts: ConceptNode[];
  zpd: ZPDAnalysis;
  recommendedScaffolding: ScaffoldingStrategy[];
  misconceptions: Misconception[];
}
```

---

## 10. User Interface

### 10.1 Data Entry Forms

The system requires forms for administrators and content creators to populate the graph database.

#### Learner Form

```typescript
interface LearnerFormData {
  // Required fields
  userId?: string;                    // Auto-generated if not provided
  name: string;

  // Optional fields
  email?: string;

  // Psychometric scores (all 39 domains - optional)
  psychometricScores?: {
    [domainName: string]: {
      score: number;                  // 0-100
      confidence?: number;            // 0-1
    }
  };

  // Learning style preferences (optional - can be derived)
  learningStyleOverride?: {
    primary?: LearningModality;       // visual, auditory, kinesthetic, reading
    socialPreference?: 'solo' | 'collaborative' | 'mixed';
    pacePreference?: 'self-paced' | 'structured' | 'intensive';
  };
}
```

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| User ID | text | No | Auto-generated UUID if blank |
| Name | text | Yes | Display name for the learner |
| Email | email | No | For notifications/identification |
| Psychometric Scores | expandable | No | 39 domain sliders (0-100) |
| Learning Style | dropdown | No | Override auto-derived style |

#### Concept Form

```typescript
interface ConceptFormData {
  // Required fields
  conceptId: string;                  // URL-safe slug
  name: string;
  domain: string;                     // e.g., "mathematics", "programming"
  description: string;

  // Optional fields
  subdomain?: string;                 // e.g., "algebra", "data structures"

  difficulty: {
    absolute: number;                 // 1-10 slider
    cognitiveLoad?: number;           // 0-1, default 0.5
    abstractness?: number;            // 0-1, default 0.5
  };

  // Bloom's Taxonomy (expandable sections)
  bloomLevels?: {
    remember?: string[];              // Learning objectives
    understand?: string[];
    apply?: string[];
    analyze?: string[];
    evaluate?: string[];
    create?: string[];
  };

  // Time estimates (minutes)
  timeEstimates?: {
    introduction?: number;
    basicMastery?: number;
    deepMastery?: number;
  };

  tags?: string[];                    // Comma-separated
}
```

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Concept ID | text (slug) | Yes | URL-safe identifier |
| Name | text | Yes | Human-readable name |
| Domain | dropdown | Yes | Pre-defined list or custom |
| Subdomain | text | No | More specific categorization |
| Description | textarea | Yes | What this concept covers |
| Difficulty (1-10) | slider | Yes | Overall difficulty rating |
| Cognitive Load | slider | No | Working memory demand (0-1) |
| Abstractness | slider | No | Concrete to abstract (0-1) |
| Bloom Objectives | expandable | No | 6 levels with text lists |
| Time Estimates | number inputs | No | Minutes for each stage |
| Tags | tag input | No | For search and filtering |

#### Prerequisite Edge Form

```typescript
interface PrerequisiteEdgeFormData {
  from: string;                       // Prerequisite concept ID (dropdown)
  to: string;                         // Target concept ID (dropdown)
  strength: 'required' | 'recommended' | 'helpful';
  reason?: string;                    // Why this prerequisite matters
}
```

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| From Concept | searchable dropdown | Yes | The prerequisite |
| To Concept | searchable dropdown | Yes | The concept that requires it |
| Strength | radio | Yes | How essential is this prerequisite |
| Reason | textarea | No | Explanation for educators |

#### Knowledge State Form

```typescript
interface KnowledgeStateFormData {
  userId: string;                     // Learner dropdown
  conceptId: string;                  // Concept dropdown
  mastery: number;                    // 0-100 slider
  bloomLevel?: BloomLevel;            // 1-6 dropdown
  misconceptions?: string[];          // Text list
  notes?: string;                     // Educator notes
}
```

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Learner | searchable dropdown | Yes | Select learner |
| Concept | searchable dropdown | Yes | Select concept |
| Mastery Level | slider | Yes | 0-100% |
| Bloom Level | dropdown | No | Current demonstrated level |
| Misconceptions | tag input | No | Known wrong mental models |
| Notes | textarea | No | Educator observations |

---

### 10.2 Graph Visualization

Interactive visualization of the knowledge graph for understanding relationships and learner progress.

#### 10.2.1 Concept Graph View

```
┌─────────────────────────────────────────────────────────────────────────┐
│  [Search: ________]  [Filter by Domain ▼]  [Difficulty: 1-10 slider]   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│                    ┌─────────────┐                                       │
│                    │  Calculus   │                                       │
│                    │  (Hard, 9)  │                                       │
│                    └──────▲──────┘                                       │
│                           │                                              │
│              ┌────────────┼────────────┐                                │
│              │            │            │                                │
│       ┌──────┴──────┐ ┌───┴───┐ ┌──────┴──────┐                        │
│       │  Functions  │ │Limits │ │   Trig     │                         │
│       │   (Med, 6)  │ │(Med,7)│ │  (Med, 5)  │                         │
│       └──────▲──────┘ └───▲───┘ └──────▲──────┘                        │
│              │            │            │                                │
│       ┌──────┴────────────┴────────────┴──────┐                        │
│       │          Algebra (Easy, 4)            │                         │
│       └──────────────────▲────────────────────┘                        │
│                          │                                              │
│       ┌──────────────────┴────────────────────┐                        │
│       │        Arithmetic (Easy, 1)           │                         │
│       └───────────────────────────────────────┘                        │
│                                                                          │
│  Legend: [●] = Node (concept)  [→] = Prerequisite edge                 │
│  Node size = Difficulty | Node color = Domain                          │
│                                                                          │
│  Click node for details | Drag to rearrange | Scroll to zoom           │
└─────────────────────────────────────────────────────────────────────────┘
```

**Features:**
- **Nodes**: Represent concepts
  - Size proportional to difficulty (larger = harder)
  - Color coded by domain (math = blue, programming = green, etc.)
  - Label shows concept name
- **Edges**: Represent prerequisite relationships
  - Directed arrows (from → to)
  - Line thickness by strength (required = thick, helpful = thin)
- **Layout Options**:
  - Hierarchical (top-down by difficulty)
  - Force-directed (clusters by domain)
  - Radial (selected concept at center)
- **Interactions**:
  - Click node → side panel with concept details
  - Click edge → show relationship details
  - Drag nodes to rearrange
  - Zoom and pan
  - Search highlights matching nodes

#### 10.2.2 Learner Progress Overlay

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Learner: [John Doe ▼]  [Show ZPD: ☑]  [Show Gaps: ☑]                  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│                    ┌─────────────┐                                       │
│                    │  Calculus   │  ← Gray (not started)                │
│                    │    (0%)     │                                       │
│                    └──────▲──────┘                                       │
│                           │                                              │
│              ┌────────────┼────────────┐                                │
│              │            │            │                                │
│       ┌──────┴──────┐ ┌───┴───┐ ┌──────┴──────┐                        │
│       │  Functions  │ │Limits │ │   Trig     │  ← Yellow border = ZPD  │
│       │    (45%)    │ │ (0%)  │ │   (60%)   │                          │
│       └──────▲──────┘ └───▲───┘ └──────▲──────┘                        │
│              │            │            │                                │
│       ┌──────┴────────────┴────────────┴──────┐                        │
│       │           Algebra (85%)               │  ← Green (mastered)     │
│       └──────────────────▲────────────────────┘                        │
│                          │                                              │
│       ┌──────────────────┴────────────────────┐                        │
│       │        Arithmetic (95%)               │  ← Green (mastered)     │
│       └───────────────────────────────────────┘                        │
│                                                                          │
│  Legend:                                                                │
│  🟢 Green = Mastered (≥80%)    🟡 Yellow = Partial (40-79%)             │
│  🔴 Red = Gap (<40%)           ⚫ Gray = Not started                    │
│  ⭐ Yellow border = In ZPD (ready to learn)                            │
│  ⚠️ Pulsing = Forgotten (needs review)                                  │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

**Features:**
- **Color Overlay**: Node fill color shows mastery level
  - Green (≥80%): Mastered
  - Yellow (40-79%): Partial understanding
  - Red (<40%): Gap/struggling
  - Gray: Not started
- **ZPD Highlighting**:
  - Yellow border around concepts in Zone of Proximal Development
  - These are "ready to learn" concepts
- **Gap Indicators**:
  - Pulsing animation for concepts that may be forgotten
  - Red exclamation for blocking prerequisites
- **Progress Panel** (on click):
  - Mastery percentage
  - Last accessed date
  - Time spent
  - Known misconceptions
  - Recommended actions

#### 10.2.3 Implementation Technologies

| Option | Best For | Pros | Cons |
|--------|----------|------|------|
| **React Flow** | Modern React apps | Great DX, built-in interactions, customizable nodes | React-only |
| **D3.js** | Maximum control | Most powerful, framework-agnostic | Steep learning curve |
| **Cytoscape.js** | Large graphs | Handles 10k+ nodes, many layouts | Heavier bundle |
| **Vis.js** | Quick setup | Easy to learn, good defaults | Less customizable |

**Recommended**: React Flow for React/Next.js apps, Cytoscape.js for large knowledge graphs.

#### 10.2.4 Visualization API

```typescript
interface GraphVisualizationAPI {
  // Data loading
  loadConceptGraph(filters?: ConceptFilters): Promise<GraphData>;
  loadLearnerOverlay(userId: string): Promise<OverlayData>;

  // Interactions
  onNodeClick(handler: (conceptId: string) => void): void;
  onEdgeClick(handler: (edge: Edge) => void): void;

  // View controls
  setLayout(layout: 'hierarchical' | 'force' | 'radial'): void;
  focusNode(conceptId: string): void;
  highlightPath(fromId: string, toId: string): void;

  // Overlays
  showZPD(userId: string): void;
  showGaps(userId: string): void;
  showLearningPath(path: string[]): void;
}

interface GraphData {
  nodes: {
    id: string;
    label: string;
    domain: string;
    difficulty: number;
    metadata: ConceptNode;
  }[];
  edges: {
    from: string;
    to: string;
    strength: string;
    metadata: PrerequisiteEdge;
  }[];
}

interface OverlayData {
  userId: string;
  masteryLevels: Map<string, number>;
  zpdConcepts: string[];
  forgottenConcepts: string[];
  gaps: KnowledgeGap[];
}
```

---

## 11. Implementation Roadmap

### Phase 1: Foundation (Weeks 1-2)
- [ ] Set up LevelDB with key prefix schema
- [ ] Implement Learner Model CRUD operations
- [ ] Integrate with Fine-Tuned-Psychometrics domain scores
- [ ] Basic knowledge state tracking

### Phase 2: Knowledge Graph (Weeks 3-4)
- [ ] Concept node schema implementation
- [ ] Prerequisite and related edge management
- [ ] Bloom's Taxonomy integration
- [ ] Graph traversal algorithms

### Phase 3: ZPD Engine (Weeks 5-6)
- [ ] ZPD computation algorithm
- [ ] Psychometric adjustment factors
- [ ] Scaffolding strategy selection
- [ ] Learning path generation

### Phase 4: RAG Integration (Weeks 7-8)
- [ ] RAG query patterns implementation
- [ ] Context retrieval optimization
- [ ] LLM prompt augmentation
- [ ] Response personalization

### Phase 5: Adaptive Features (Weeks 9-10)
- [ ] Knowledge gap analysis
- [ ] Spaced repetition scheduling
- [ ] Misconception tracking
- [ ] Adaptive pacing

### Phase 6: GNN Preparation (Weeks 11-12)
- [ ] Feature extraction pipelines
- [ ] Training data export
- [ ] Embedding storage schema
- [ ] Baseline model training

---

## 12. Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Learning Efficiency | 30% improvement | Time to concept mastery vs. baseline |
| Retention Rate | 85% @ 30 days | Spaced repetition success rate |
| ZPD Accuracy | 80% match | Recommended concepts vs. actual next mastered |
| Gap Detection | 90% recall | Identified gaps vs. assessment failures |
| Personalization Score | 75% satisfaction | User survey on content relevance |
| Engagement | 40% increase | Session duration and frequency |

---

## Appendix A: Psychometric Domain Reference

See [Fine-Tuned-Psychometrics.md](./Fine-Tuned-Psychometrics.md) for complete domain definitions.

## Appendix B: Educational Psychology References

1. **Vygotsky, L.S. (1978)** - Mind in Society: Zone of Proximal Development
2. **Bloom, B.S. (1956)** - Taxonomy of Educational Objectives
3. **Ebbinghaus, H. (1885)** - Memory: Forgetting Curve
4. **Bruner, J.S. (1966)** - Scaffolding Theory
5. **Kolb, D.A. (1984)** - Experiential Learning
6. **Gardner, H. (1983)** - Multiple Intelligences
7. **Dweck, C.S. (2006)** - Growth Mindset
8. **Mayer, R.E. (2009)** - Multimedia Learning Principles
