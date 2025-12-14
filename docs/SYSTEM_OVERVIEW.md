# LearnGraph
## Psychometric-Adaptive Learning Intelligence

A personalized tutoring database that makes any LLM smarter about each specific user. LearnGraph combines psychometric profiling with educational psychology to deliver truly personalized learning experiences.

---

## Complete System Overview
Everything you need to understand how LearnGraph builds personalized learning paths automatically.

---

## What Is LearnGraph?

LearnGraph is a **Graph RAG (Retrieval-Augmented Generation) system** that transforms generic AI tutoring into deeply personalized education. Instead of giving everyone the same explanation, LearnGraph provides AI tutors with comprehensive context about each learner.

```
WITHOUT LearnGraph:
  User: "Explain linear equations"
  LLM: [Generic explanation, same for everyone]

WITH LearnGraph:
  User: "Explain linear equations"
  System retrieves: visual learner, struggles with "moving terms", high anxiety,
                    mastered arithmetic, partial algebra knowledge
  LLM: [Personalized explanation with diagrams, addresses their specific
        confusion, gentle encouraging tone, builds on what they already know]
```

### Key Value Propositions

| Feature | Description |
|---------|-------------|
| **"What should I learn next?"** | Compares your mastery against prerequisites to find optimal concepts |
| **Personalized explanations** | Gives LLMs your learning style, misconceptions, and preferences |
| **Gap detection** | Finds missing, forgotten, or misunderstood knowledge |
| **Spaced repetition** | Schedules reviews based on your personal forgetting curve |
| **Smart scaffolding** | Selects teaching strategies based on your psychometric profile |
| **Learning paths** | Generates custom roadmaps to any learning goal |

---

## The Dual-Graph Architecture

LearnGraph uses a single database with two interconnected graphs:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           LevelDB Instance                               │
│                                                                          │
│  ┌─────────────────────────────┐    ┌─────────────────────────────────┐ │
│  │     LEARNER MODEL          │    │      KNOWLEDGE MODEL            │ │
│  │     (Graph A)              │    │      (Graph B)                  │ │
│  │                            │    │                                 │ │
│  │  • User Profiles           │    │  • Concept Nodes                │ │
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
│                          │   (Computed)      │                          │
│                          │                   │                          │
│                          │ Zone of Proximal  │                          │
│                          │ Development Engine│                          │
│                          └───────────────────┘                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## How It Works: The Learning Pipeline

When you interact with LearnGraph, multiple systems work together automatically:

```
┌───────────────────────────────────────────────────────────────────────────┐
│                          USER INTERACTION                                  │
│                                                                           │
│   "What should I learn next?"   "Explain this concept"   "I'm stuck"     │
│                    │                    │                     │           │
└────────────────────┼────────────────────┼─────────────────────┼───────────┘
                     │                    │                     │
                     ▼                    ▼                     ▼
┌───────────────────────────────────────────────────────────────────────────┐
│                       CONTEXT RETRIEVAL                                    │
│                                                                           │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────────┐   │
│  │ Learner Profile │  │ Knowledge State │  │   ZPD Computation       │   │
│  │                 │  │                 │  │                         │   │
│  │ • Big Five      │  │ • Mastery %     │  │ • Ready concepts        │   │
│  │ • Learning      │  │ • Bloom Level   │  │ • Gap analysis          │   │
│  │   Style         │  │ • Last Access   │  │ • Prerequisites met     │   │
│  │ • Cognitive     │  │ • Decay Rate    │  │ • Scaffolding needed    │   │
│  │   Profile       │  │ • Misconceptions│  │                         │   │
│  └────────┬────────┘  └────────┬────────┘  └───────────┬─────────────┘   │
│           │                    │                       │                  │
│           └────────────────────┼───────────────────────┘                  │
│                                │                                          │
│                                ▼                                          │
│                    ┌───────────────────────┐                              │
│                    │   RAG CONTEXT         │                              │
│                    │   AGGREGATOR          │                              │
│                    │                       │                              │
│                    │   Combines learner    │                              │
│                    │   data + knowledge    │                              │
│                    │   graph + ZPD into    │                              │
│                    │   < 2000 tokens       │                              │
│                    └───────────┬───────────┘                              │
│                                │                                          │
└────────────────────────────────┼──────────────────────────────────────────┘
                                 │
                                 ▼
┌───────────────────────────────────────────────────────────────────────────┐
│                       LLM AUGMENTED RESPONSE                               │
│                                                                           │
│   The AI tutor now knows:                                                 │
│   • Your learning style (visual/auditory/kinesthetic)                     │
│   • Your current mastery of relevant concepts                             │
│   • Your specific misconceptions to address                               │
│   • What scaffolding strategies work for you                              │
│   • What you should learn next                                            │
│                                                                           │
│   → Delivers personalized, context-aware response                         │
│                                                                           │
└───────────────────────────────────────────────────────────────────────────┘
```

---

## Step-by-Step: What Happens When You Ask "What Should I Learn Next?"

1. **Profile Retrieval** → System loads your 39 psychometric domain scores and learning preferences

2. **Knowledge State Scan** → Checks mastery level for all concepts you've studied

3. **Prerequisite Analysis** → For each concept you haven't mastered:
   - Counts how many prerequisites you've completed
   - Calculates "readiness score" (0-1)

4. **Psychometric Adjustment** → Modifies readiness based on your profile:

   | Your Profile | Effect on Recommendations |
   |--------------|---------------------------|
   | High anxiety | Lower readiness for difficult concepts |
   | High openness | Higher readiness for abstract concepts |
   | High conscientiousness | Ready for longer learning paths |
   | Low risk tolerance | Prefer well-structured concepts |

5. **Zone Partitioning** → Concepts are sorted into zones:

   ```
   ┌─────────────────────────────────────────────────────────────────────────┐
   │                                                                          │
   │    ┌───────────────────────────────────────────────────────────────┐    │
   │    │                                                               │    │
   │    │    ┌─────────────────────────────────────────────────────┐   │    │
   │    │    │                                                     │   │    │
   │    │    │    ┌───────────────────────────────────────────┐   │   │    │
   │    │    │    │                                           │   │   │    │
   │    │    │    │     MASTERED CONCEPTS                     │   │   │    │
   │    │    │    │     (Can do independently)                │   │   │    │
   │    │    │    │     Readiness > 0.8                       │   │   │    │
   │    │    │    │                                           │   │   │    │
   │    │    │    └───────────────────────────────────────────┘   │   │    │
   │    │    │                                                     │   │    │
   │    │    │         ZONE OF PROXIMAL DEVELOPMENT               │   │    │
   │    │    │         (Can learn with support)                   │   │    │
   │    │    │         Readiness 0.5 - 0.8  ← OPTIMAL TARGET      │   │    │
   │    │    │                                                     │   │    │
   │    │    └─────────────────────────────────────────────────────┘   │    │
   │    │                                                               │    │
   │    │              STRETCH ZONE                                     │    │
   │    │              (Challenging but achievable)                     │    │
   │    │              Readiness 0.3 - 0.5                              │    │
   │    │                                                               │    │
   │    └───────────────────────────────────────────────────────────────┘    │
   │                                                                          │
   │                    TOO HARD (Missing prerequisites)                      │
   │                    Readiness < 0.3                                       │
   │                                                                          │
   └─────────────────────────────────────────────────────────────────────────┘
   ```

6. **Scaffolding Selection** → Based on your profile, selects support strategies:

   | If You Are... | Scaffolding Strategy |
   |---------------|---------------------|
   | Visual learner | `VISUAL_REPRESENTATION` - diagrams, charts |
   | High cognitive complexity | `ANALOGY` - connect to known concepts |
   | Low working memory | `CHUNKING` - break into smaller pieces |
   | High extraversion | `PEER_DISCUSSION`, `COLLABORATIVE` |
   | High conscientiousness | `CHECKLIST`, `TEMPLATE` |
   | Low self-esteem | `WORKED_EXAMPLES`, `HINTS` |

7. **Path Generation** → Creates personalized learning path to your goals

---

## The 39 Psychological Domains

LearnGraph tracks 39 research-backed psychological dimensions organized into 8 categories:

### Category A: Core Personality (Big Five) - NEO-PI-R Based

| Domain ID | Trait | Educational Relevance |
|-----------|-------|----------------------|
| `big_five_openness` | Openness | Receptivity to novel concepts, abstract thinking |
| `big_five_conscientiousness` | Conscientiousness | Self-discipline, goal persistence |
| `big_five_extraversion` | Extraversion | Preference for collaborative vs. solo learning |
| `big_five_agreeableness` | Agreeableness | Response to feedback, peer learning |
| `big_five_neuroticism` | Neuroticism | Stress response, anxiety management needs |

### Category B: Dark Personality - SD3 Based

| Domain ID | Trait | Educational Relevance |
|-----------|-------|----------------------|
| `dark_triad_narcissism` | Narcissism | Competitive learning, recognition needs |
| `dark_triad_machiavellianism` | Machiavellianism | Strategic approach to goals |
| `dark_triad_psychopathy` | Psychopathy | Risk-taking in learning challenges |

### Category C: Emotional/Social Intelligence

| Domain ID | Trait | Educational Relevance |
|-----------|-------|----------------------|
| `emotional_empathy` | Empathy | Peer learning, perspective-taking |
| `emotional_intelligence` | EQ | Self-regulation, emotional awareness |
| `attachment_style` | Attachment | Trust in learning relationships |
| `love_languages` | Love Languages | Preferred feedback/recognition style |
| `communication_style` | Communication (DISC) | Interaction pattern preferences |

### Category D: Decision Making & Motivation

| Domain ID | Trait | Educational Relevance |
|-----------|-------|----------------------|
| `risk_tolerance` | Risk Tolerance | Willingness to try new approaches |
| `decision_style` | Decision Style | Rational vs. intuitive learning |
| `time_orientation` | Time Orientation | Past, present, or future focus |
| `achievement_motivation` | Achievement | Need for accomplishment, goal-setting |
| `self_efficacy` | Self-Efficacy | Belief in own capabilities |
| `locus_of_control` | Locus of Control | Internal vs. external attribution |
| `growth_mindset` | Growth Mindset | Fixed vs. growth beliefs about ability |

### Category E: Values & Wellbeing

| Domain ID | Trait | Educational Relevance |
|-----------|-------|----------------------|
| `personal_values` | Values (Schwartz PVQ) | What content resonates |
| `interests` | Interests (RIASEC) | Career/interest alignment |
| `life_satisfaction` | Life Satisfaction | Overall engagement capacity |
| `stress_coping` | Stress Coping | Response to learning challenges |
| `social_support` | Social Support | Support network awareness |
| `authenticity` | Authenticity | Alignment with true self |

### Category F: Cognitive/Learning Styles

| Domain ID | Trait | Educational Relevance |
|-----------|-------|----------------------|
| `cognitive_abilities` | Cognitive Style | Verbal, numerical, spatial preferences |
| `creativity` | Creativity | Divergent thinking, originality |
| `learning_styles` | Learning Styles (VARK) | Visual, auditory, reading, kinesthetic |
| `information_processing` | Info Processing | Deep vs. shallow processing |
| `metacognition` | Metacognition | Awareness of own thinking |
| `executive_functions` | Executive Functions | Planning, inhibition, flexibility |

### Category G: Social/Cultural Values

| Domain ID | Trait | Educational Relevance |
|-----------|-------|----------------------|
| `social_cognition` | Social Cognition | Theory of mind, perspective-taking |
| `political_ideology` | Political Values | Worldview influence on learning |
| `cultural_values` | Cultural Values (Hofstede) | Individualism, power distance |
| `moral_reasoning` | Moral Reasoning (MFQ) | Ethical framework preferences |
| `work_career_style` | Career Style | Work values, career anchors |

### Category H: Sensory/Aesthetic

| Domain ID | Trait | Educational Relevance |
|-----------|-------|----------------------|
| `sensory_processing` | Sensory Sensitivity (HSP) | Stimulation tolerance |
| `aesthetic_preferences` | Aesthetic Preferences | Design/presentation preferences |

---

## Knowledge Gap Detection

LearnGraph continuously monitors for four types of knowledge gaps:

```
┌───────────────────────────────────────────────────────────────────────────┐
│                        GAP DETECTION ENGINE                                │
│                                                                           │
│   ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────────┐  │
│   │    MISSING      │  │    PARTIAL      │  │      FORGOTTEN          │  │
│   │                 │  │                 │  │                         │  │
│   │  Never learned  │  │  Started but    │  │  Was mastered but       │  │
│   │  this concept   │  │  not mastered   │  │  memory has decayed     │  │
│   │                 │  │  (< 70%)        │  │                         │  │
│   │  Action:        │  │  Action:        │  │  Action:                │  │
│   │  Full teaching  │  │  Reinforcement  │  │  Quick refresh          │  │
│   └─────────────────┘  └─────────────────┘  └─────────────────────────┘  │
│                                                                           │
│                        ┌─────────────────────────┐                        │
│                        │     MISCONCEPTION       │                        │
│                        │                         │                        │
│                        │  Wrong mental model     │                        │
│                        │  needs correction       │                        │
│                        │                         │                        │
│                        │  Action:                │                        │
│                        │  Targeted correction    │                        │
│                        │  with counterexamples   │                        │
│                        └─────────────────────────┘                        │
│                                                                           │
└───────────────────────────────────────────────────────────────────────────┘
```

### Forgetting Curve (Ebbinghaus)

LearnGraph predicts memory decay using the Ebbinghaus forgetting curve:

```
Retention = e^(-t/S) × 100%

Where:
  t = days since last access
  S = stability (increases with repetitions and mastery)
```

```
100% ┤████████████████████████████████████████████████████████████
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

     ↑ Review here maintains 90% retention
```

### Spaced Repetition (SM-2 Algorithm)

Reviews are scheduled to catch concepts just before they decay below 90% retention:

```
┌────────────────────────────────────────────────────────────────────────┐
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
│   Interval grows exponentially with successful reviews                 │
│   Resets to shorter interval if forgotten                              │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

---

## Bloom's Taxonomy Integration

Each concept is mapped across six cognitive levels:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        BLOOM'S TAXONOMY                                  │
│                                                                          │
│     Level 6: CREATE                                                      │
│     ┌─────────────────────────────────────────────────────────────────┐ │
│     │ Design, construct, develop, formulate, synthesize                │ │
│     │ Example: "Model a real-world situation with linear equations"    │ │
│     └─────────────────────────────────────────────────────────────────┘ │
│                                    ▲                                     │
│     Level 5: EVALUATE                                                    │
│     ┌─────────────────────────────────────────────────────────────────┐ │
│     │ Evaluate, critique, justify, assess, defend, judge               │ │
│     │ Example: "Choose the best method for solving this system"        │ │
│     └─────────────────────────────────────────────────────────────────┘ │
│                                    ▲                                     │
│     Level 4: ANALYZE                                                     │
│     ┌─────────────────────────────────────────────────────────────────┐ │
│     │ Analyze, differentiate, organize, deconstruct, attribute         │ │
│     │ Example: "Determine if this equation is linear"                  │ │
│     └─────────────────────────────────────────────────────────────────┘ │
│                                    ▲                                     │
│     Level 3: APPLY                                                       │
│     ┌─────────────────────────────────────────────────────────────────┐ │
│     │ Apply, demonstrate, solve, use, implement, execute               │ │
│     │ Example: "Solve 3x + 5 = 20"                                     │ │
│     └─────────────────────────────────────────────────────────────────┘ │
│                                    ▲                                     │
│     Level 2: UNDERSTAND                                                  │
│     ┌─────────────────────────────────────────────────────────────────┐ │
│     │ Explain, describe, interpret, summarize, classify, compare       │ │
│     │ Example: "Explain why the graph is a straight line"              │ │
│     └─────────────────────────────────────────────────────────────────┘ │
│                                    ▲                                     │
│     Level 1: REMEMBER                                                    │
│     ┌─────────────────────────────────────────────────────────────────┐ │
│     │ Define, list, recall, identify, name, recognize, reproduce       │ │
│     │ Example: "Define what a linear equation is"                      │ │
│     └─────────────────────────────────────────────────────────────────┘ │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

LearnGraph tracks which Bloom level you've achieved for each concept:
- **Current Level**: What you can do now
- **Target Level**: What you're working toward
- **Progression**: Moving up the hierarchy requires mastering lower levels first

---

## Scaffolding Strategies

Based on your psychometric profile, LearnGraph selects appropriate scaffolding:

### Cognitive Scaffolds

| Strategy | When Used | Implementation |
|----------|-----------|----------------|
| `CHUNKING` | Low working memory | Break content into smaller pieces |
| `ANALOGY` | High cognitive complexity | Connect to familiar concepts |
| `WORKED_EXAMPLES` | Low confidence, beginners | Step-by-step demonstrations |
| `VISUAL_REPRESENTATION` | Visual learners | Diagrams, charts, concept maps |

### Metacognitive Scaffolds

| Strategy | When Used | Implementation |
|----------|-----------|----------------|
| `SELF_EXPLANATION` | High analytical thinking | Prompt to explain reasoning |
| `PREDICTION` | Engagement building | "What do you think happens?" |
| `REFLECTION` | Consolidation | "What did you learn?" |

### Procedural Scaffolds

| Strategy | When Used | Implementation |
|----------|-----------|----------------|
| `CHECKLIST` | High conscientiousness | Step-by-step guides |
| `TEMPLATE` | Structure-seekers | Fill-in-the-blank frameworks |
| `HINTS` | Progressive support | Reveal hints one at a time |

### Social Scaffolds

| Strategy | When Used | Implementation |
|----------|-----------|----------------|
| `PEER_DISCUSSION` | High extraversion | Discussion prompts |
| `EXPERT_MODELING` | Visual/auditory learners | Watch expert demonstrations |
| `COLLABORATIVE` | Group-oriented learners | Pair/group activities |

---

## Data Architecture

LearnGraph uses LevelDB with a key-prefix schema for fast, typed access:

```
┌──────────────────────────────────────────────────────────────────────────┐
│                          LEVELDB STORAGE                                  │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │                    LEARNER MODEL KEYS                               │ │
│  │                                                                     │ │
│  │  learner:{userId}:profile              → Core psychometric profile  │ │
│  │  learner:{userId}:domain:{domainName}  → Individual domain scores   │ │
│  │  learner:{userId}:knowledge:{conceptId}→ Mastery level per concept  │ │
│  │  learner:{userId}:history:{timestamp}  → Learning session history   │ │
│  │  learner:{userId}:misconception:{id}   → Tracked misconceptions     │ │
│  │  learner:{userId}:zpd:current          → Current ZPD snapshot       │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │                    KNOWLEDGE MODEL KEYS                             │ │
│  │                                                                     │ │
│  │  knowledge:concept:{conceptId}         → Concept node data          │ │
│  │  knowledge:edge:prerequisite:{from}:{to} → Prerequisite edges       │ │
│  │  knowledge:edge:related:{from}:{to}    → Related concept edges      │ │
│  │  knowledge:bloom:{conceptId}:{level}   → Bloom's taxonomy mapping   │ │
│  │  knowledge:difficulty:{conceptId}      → Difficulty rating          │ │
│  │  knowledge:scaffold:{conceptId}        → Scaffolding strategies     │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │                    INDEX KEYS (Fast Lookups)                        │ │
│  │                                                                     │ │
│  │  index:concept:by-difficulty:{level}:{id}                           │ │
│  │  index:concept:by-bloom:{level}:{id}                                │ │
│  │  index:concept:by-domain:{domain}:{id}                              │ │
│  │  index:user:by-gap:{conceptId}:{userId}                             │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  Performance:                                                            │
│  • Single write: < 5ms                                                   │
│  • Single read: < 2ms                                                    │
│  • Batch throughput: > 2,000 ops/sec                                     │
│  • Data persistence: 100% across restarts                                │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## RAG Context Generation

When an LLM needs context about a learner, LearnGraph generates optimized RAG context:

```typescript
interface RAGContext {
  // Who is this learner?
  learnerProfile: {
    learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'reading';
    socialPreference: 'solo' | 'collaborative' | 'mixed';
    cognitiveProfile: {
      workingMemoryEstimate: number;
      attentionSpan: number;
      complexityTolerance: number;
    };
  };

  // What do they know?
  relevantKnowledgeStates: {
    conceptId: string;
    mastery: number;
    bloomLevel: number;
    lastAccessed: Date;
  }[];

  // What should they learn?
  zpd: {
    optimalConcepts: string[];
    scaffoldingNeeded: string[];
  };

  // What are they getting wrong?
  misconceptions: {
    concept: string;
    description: string;
    severity: 'minor' | 'moderate' | 'blocking';
  }[];

  // How should we teach them?
  recommendedScaffolding: ScaffoldingStrategy[];
}
```

**Token Budget**: < 2000 tokens to leave room for the response

---

## Traditional Assessment vs. LearnGraph

| Aspect | Traditional LMS | LearnGraph |
|--------|-----------------|------------|
| **Personalization** | Same content for everyone | Adapts to 39 psychological dimensions |
| **Recommendations** | Fixed curriculum order | Dynamic ZPD-based paths |
| **Gap Detection** | Manual quizzes only | Continuous monitoring + decay prediction |
| **Scaffolding** | One-size-fits-all | Profile-matched strategies |
| **Review Scheduling** | Manual or none | Automated spaced repetition |
| **AI Integration** | Generic responses | Context-rich personalized tutoring |
| **Prerequisites** | Course sequences | Concept-level graph relationships |
| **Progress Tracking** | Completion % only | Bloom level + mastery + decay |

---

## Who Benefits?

### For Learners
- Get AI tutoring that actually knows you
- Never waste time on too-easy or too-hard content
- Automatically review at optimal times
- Receive explanations matched to your learning style

### For Educators
- Understand each student's psychometric profile
- See knowledge gaps across your class
- Get AI teaching assistant that adapts to students
- Focus human attention where it matters most

### For Developers
- Plug any LLM into a rich context layer
- Graph database for educational content
- RESTful APIs for all operations
- Extensible psychometric framework

### For Researchers
- Track learning effectiveness over time
- Correlate psychometrics with outcomes
- Export data for analysis
- Future GNN training support

---

## Quick Start

### 1. Store a Learner
```typescript
await db.setLearnerProfile('user-123', {
  userId: 'user-123',
  psychometricProfile: {
    big_five_openness: { score: 75, confidence: 0.8 },
    learning_styles: { score: 80, confidence: 0.9 },  // Visual
    // ... 37 more domains
  },
  learningStyle: {
    primary: 'visual',
    secondary: 'reading',
    socialPreference: 'solo',
    pacePreference: 'self-paced',
    feedbackPreference: 'immediate'
  }
});
```

### 2. Store Concepts with Prerequisites
```typescript
await db.addConcept({
  id: 'arithmetic',
  name: 'Basic Arithmetic',
  difficulty: 1
});

await db.addConcept({
  id: 'algebra',
  name: 'Algebraic Expressions',
  difficulty: 3
});

await db.addEdge({
  from: 'arithmetic',
  to: 'algebra',
  strength: 'required'
});
```

### 3. Track Progress
```typescript
await db.setKnowledgeState('user-123', 'arithmetic', {
  mastery: 90,
  bloomLevel: 4,
  lastAccessed: new Date()
});
```

### 4. Get Recommendations
```typescript
const zpd = await db.computeZPD('user-123');

// Returns:
// {
//   optimalTarget: ['algebra'],  // Ready to learn!
//   scaffolding: ['VISUAL_REPRESENTATION', 'WORKED_EXAMPLES'],
//   estimatedTime: '2 hours'
// }
```

### 5. Get RAG Context for AI Tutor
```typescript
const context = await db.getRAGContext('user-123', 'explain algebra');

// Pass to LLM:
// "User is a visual learner with high anxiety. They've mastered
// arithmetic (90%) but struggle with word problems. Use diagrams
// and gentle tone. Address their confusion about 'moving terms'..."
```

---

## System Requirements

- **Runtime**: Node.js 18+ or Bun
- **Database**: LevelDB (embedded, no separate server)
- **Framework**: Next.js 14+ with App Router
- **Storage**: ~50MB for database + indexes

---

## Implementation Status

| Phase | Status | Description |
|-------|--------|-------------|
| 1 - Core Database | **DONE** | LevelDB setup, CRUD operations |
| 2 - Learner Model | **DONE** | 39 psychometric domains, profile management |
| 3 - Knowledge Model | **DONE** | Concept graph, prerequisites, Bloom's taxonomy |
| 4 - ZPD Engine | **DONE** | Zone computation, scaffolding selection |
| 5 - Gap Analysis | **DONE** | Gap detection, forgetting curve, spaced repetition |
| 6 - Content Delivery | Planned | Adaptive content matching |
| 7 - RAG Integration | Planned | LLM context generation |
| 8 - GNN Preparation | Future | Neural network training export |

**MVP Complete**: Phases 1-5 deliver personalized "what to learn next" with gap analysis.

---

## Educational Psychology References

1. **Vygotsky, L.S. (1978)** - Mind in Society: Zone of Proximal Development
2. **Bloom, B.S. (1956)** - Taxonomy of Educational Objectives
3. **Ebbinghaus, H. (1885)** - Memory: Forgetting Curve
4. **Bruner, J.S. (1966)** - Scaffolding Theory
5. **Costa & McCrae (1992)** - NEO-PI-R Big Five Personality Inventory
6. **Dweck, C.S. (2006)** - Growth Mindset
7. **Mayer, R.E. (2009)** - Multimedia Learning Principles
8. **SM-2 Algorithm** - SuperMemo Spaced Repetition

---

## API Reference

See the full API documentation at `/docs/api.md`

Core endpoints:
- `POST /api/learners` - Create/update learner profiles
- `GET /api/learners/:id` - Get learner with full profile
- `POST /api/concepts` - Add concepts to knowledge graph
- `POST /api/edges` - Connect concepts with prerequisites
- `GET /api/zpd/:userId` - Compute Zone of Proximal Development
- `GET /api/gaps/:userId` - Analyze knowledge gaps
- `GET /api/review-queue/:userId` - Get spaced repetition schedule
- `GET /api/learning-path/:userId/:targetConceptId` - Generate learning path

---

*LearnGraph - Making AI tutoring truly personal.*
