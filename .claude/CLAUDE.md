# LearnGraph Project Memory

## What This System Actually Does

**In plain terms**: A **personalized tutoring database** that makes any LLM smarter about each specific user.

```
WITHOUT Graph RAG:
  User: "Explain linear equations"
  LLM: [Generic explanation, same for everyone]

WITH Graph RAG:
  User: "Explain linear equations"
  System retrieves: visual learner, struggles with "moving terms", high anxiety
  LLM: [Personalized explanation with diagrams, addresses their confusion, gentle tone]
```

### Core Capabilities
| What | How |
|------|-----|
| "What should I learn next?" | Compares mastery vs prerequisites |
| Personalized explanations | Gives LLM your style + misconceptions |
| Gap detection | Finds missing/forgotten knowledge |
| Spaced repetition | Schedules reviews based on forgetting curve |
| Scaffolding selection | Picks teaching strategies from psychometrics |

---

## Dependencies & Inputs

### Is the Fine-Tuned Model Required?
**NO.** The Fine-Tuned Psychometrics model and Graph RAG are SEPARATE systems:

| System | Purpose | Required? |
|--------|---------|-----------|
| Fine-Tuned Model | Analyzes text → infers personality | Optional (one data source) |
| Graph RAG | Stores profiles + knowledge graph | **Main system** |

### Ways to Get Psychometric Data (Pick Any)
1. Fine-tuned model (analyze user's writing)
2. Traditional quizzes (Big Five assessment, etc.)
3. Import from other systems
4. Defaults + learn from behavior
5. User self-report ("I'm a visual learner")

### Mandatory vs Optional Inputs
| Input | Required? | Notes |
|-------|-----------|-------|
| User ID | **Yes** | Need to identify learners |
| Concepts | **Yes** | Need content in knowledge graph |
| Prerequisites | **Yes** | Core value - what comes before what |
| Psychometric scores | No | Works with defaults, better with data |
| Fine-tuned model | No | Just one data source option |
| Learning history | No | Builds over time |
| Content library | No | Can recommend without specific content |

### Simplest Working Version
```typescript
// 1. Store a learner
await db.setLearnerProfile('user-123', { userId: 'user-123' });

// 2. Store concepts with prerequisites
await db.addConcept({ id: 'arithmetic', difficulty: 1 });
await db.addConcept({ id: 'algebra', difficulty: 3 });
await db.addEdge({ from: 'arithmetic', to: 'algebra' });

// 3. Track what user knows
await db.setKnowledgeState('user-123', 'arithmetic', { mastery: 90 });

// 4. Ask "What's next?"
const zpd = await db.computeZPD('user-123');
// Returns: "algebra" (arithmetic is mastered, algebra is ready)
```

---

## Architecture
- **Database**: LevelDB with dual-graph model
- **Graph A**: Learner Model (profiles, psychometrics, knowledge states, history)
- **Graph B**: Knowledge Model (concepts, prerequisites, Bloom levels, difficulty)
- **ZPD Bridge**: Computed from both graphs to determine optimal learning targets

---

## Build Phases Checklist

### Phase 1: Core Database Foundation [DONE]
- [x] LevelDB setup with JSON encoding
- [x] Key prefix schema (`learner:*`, `knowledge:*`, `index:*`)
- [x] `EducationGraphDB` class
- [x] Basic CRUD operations
- [x] Batch operations
- [x] **FUNCTIONAL TEST**: Create learner → restart app → learner persists

**Pass Criteria**: Write < 5ms, Read < 2ms, Data survives restart
**Actual Results**: Write: 0.10ms, Read: 0.02ms, 37/37 tests passing

---

### Phase 1.5: Admin UI & Graph Visualization [DONE]
- [x] Next.js App Router setup with API routes
- [x] Admin layout with navigation sidebar
- [x] Learner form (add/edit/delete learners)
- [x] Concept form (add/edit/delete concepts with difficulty)
- [x] Prerequisite edge form (connect concepts)
- [x] Knowledge state form (track learner progress)
- [x] Interactive graph visualization (React Flow)
- [x] Learner progress overlay (mastery colors)
- [x] Functional Tests page (run and verify all phase tests)
- [x] **FUNCTIONAL TEST**: Add learner via form → see in list; Add concept → appears in graph

**Pass Criteria**: Forms submit < 500ms, Graph renders 100 nodes < 1s, All CRUD via UI works
**Actual Results**: All APIs respond < 100ms, UI pages load 200 OK, CRUD tested via curl

---

### Phase 2: Learner Model - Graph A [DONE]
- [x] `LearnerProfile` TypeScript interface
- [x] Store/retrieve profiles
- [x] 39 psychometric domain keys
- [x] Domain score updates with confidence
- [x] Learning style derivation
- [x] Cognitive profile estimation
- [x] Profile page (`/profile`) with 4 data entry modes:
  - [x] Auto-discovery mode (system infers values)
  - [x] Manual entry mode (user sets permanent values)
  - [x] Adaptive mode (user sets initial, system adjusts)
  - [x] Assessment mode (take psychological tests)
- [x] All 39 domains displayed in 8 organized categories
- [x] **FUNCTIONAL TEST**: View profile → see all domains + "You're a visual learner"

**Pass Criteria**: 39/39 domains stored, Profile retrieval < 10ms
**Actual Results**: Full interface with 39 domains, profile CRUD via UI and API, dedicated profile page with 4 input modes

---

### Phase 3: Knowledge Model - Graph B [DONE]
- [x] `ConceptNode` schema with Bloom levels
- [x] `PrerequisiteEdge` storage
- [x] `RelatedEdge` storage
- [x] Graph traversal: `getPrerequisites(conceptId, depth)`
- [x] Difficulty indexing
- [x] Domain indexing
- [x] Seed sample concept data
- [x] **FUNCTIONAL TEST**: Click concept → see "First learn: A → B → C"

**Pass Criteria**: Traversal (depth 5) < 100ms, No orphan edges
**Actual Results**: Full graph with traversal, visible in interactive graph UI

---

### Phase 4: ZPD Engine [DONE]
- [x] `computeZPD()` algorithm
- [x] Zone partitioning (too easy → ZPD → too hard)
- [x] `adjustForPsychometrics()` function
- [x] `selectScaffoldingStrategies()` function
- [x] `generateLearningPath()` function
- [x] ZPD API endpoint (`/api/zpd`)
- [x] Learning path API endpoint (`/api/learning-path`)
- [x] Recommendations UI page (`/recommendations`)
- [x] **FUNCTIONAL TEST**: Ask "What next?" → get personalized list with reasons

**Pass Criteria**: ZPD computation < 200ms, 75% recommendation accuracy
**Actual Results**: Full ZPD engine with zone partitioning, psychometric adjustments, scaffolding strategies, and learning path generation

---

### Phase 5: Knowledge Gap Analysis [DONE]
- [x] Gap detection: missing, partial, forgotten, misconception
- [x] `predictDecay()` forgetting curve (Ebbinghaus: R = e^(-t/S))
- [x] `scheduleNextReview()` spaced repetition (SM-2 algorithm)
- [x] Review queue API with priority scheduling
- [x] Remediation plan generator with scaffolding
- [x] Gap Detection API (`/api/gaps`)
- [x] Memory Decay API (`/api/decay`)
- [x] Review Schedule API (`/api/review-schedule`)
- [x] Review Queue API (`/api/review-queue`)
- [x] Remediation API (`/api/remediation`)
- [x] Gaps Dashboard UI (`/gaps`)
- [x] **FUNCTIONAL TEST**: See "Gaps" dashboard → forgotten topics warned

**Pass Criteria**: 90% gap detection, 85% retention at review time
**Actual Results**: All 5 Phase 5 APIs working, gap detection identifies missing/partial/forgotten/misconception gaps, SM-2 scheduling implemented with priority levels

---

### Phase 6: Adaptive Content Delivery [MEDIUM]
- [ ] `scoreContentMatch()` algorithm
- [ ] `buildSessionPlan()` function
- [ ] `determinePresentationStrategy()` function
- [ ] Adaptive pacing model
- [ ] Break recommendations
- [ ] **FUNCTIONAL TEST**: Start session → content matches your style

**Pass Criteria**: 70% content match satisfaction, 80% session completion

---

### Phase 7: RAG Integration [HIGH]
- [ ] `getRAGContext()` function
- [ ] Query-type detection
- [ ] Prompt augmentation templates
- [ ] Context size optimization (< 2000 tokens)
- [ ] **FUNCTIONAL TEST**: Ask tutor → response knows your history/struggles

**Pass Criteria**: Context retrieval < 150ms, 80% feel personalized

---

### Phase 8: GNN Preparation [LOW - FUTURE]
- [ ] `extractLearnerFeatures()` → 16-dim vector
- [ ] `extractConceptFeatures()` → 13-dim vector
- [ ] `exportForGNNTraining()` function
- [ ] PyTorch Geometric format converter
- [ ] Validation checks
- [ ] **FUNCTIONAL TEST**: Export data → valid for model training

**Pass Criteria**: All features in [0,1], No NaN values

---

## MVP = Phases 1, 1.5, 2, 3, 4, 5

Delivers: **"What should I learn next?" personalized by who you are + what you know + gap analysis + spaced repetition**

---

## Key Files

| File | Purpose |
|------|---------|
| `research/graph-education.md` | Full PRD with schemas and algorithms |
| `research/domain-reference.md` | **Source of truth** for 39 psychometric domains |
| `research/Fine-Tuned-Psychometrics.md` | 39 psychological domains definition |
| `research/phases.md` | Detailed build phases with functional tests |

---

## Psychometric Domain Reference

**Source of Truth**: `research/domain-reference.md`

The system tracks 39 psychometric domains organized in 8 categories. Always use the exact domain IDs when working with learner profiles.

### Categories & Domain IDs

| Category | Domain IDs |
|----------|------------|
| **A. Core Personality (Big Five)** | `big_five_openness`, `big_five_conscientiousness`, `big_five_extraversion`, `big_five_agreeableness`, `big_five_neuroticism` |
| **B. Dark Personality** | `dark_triad_narcissism`, `dark_triad_machiavellianism`, `dark_triad_psychopathy` |
| **C. Emotional/Social Intelligence** | `emotional_empathy`, `emotional_intelligence`, `attachment_style`, `love_languages`, `communication_style` |
| **D. Decision Making & Motivation** | `risk_tolerance`, `decision_style`, `time_orientation`, `achievement_motivation`, `self_efficacy`, `locus_of_control`, `growth_mindset` |
| **E. Values & Wellbeing** | `personal_values`, `interests`, `life_satisfaction`, `stress_coping`, `social_support`, `authenticity` |
| **F. Cognitive/Learning** | `cognitive_abilities`, `creativity`, `learning_styles`, `information_processing`, `metacognition`, `executive_functions` |
| **G. Social/Cultural/Values** | `social_cognition`, `political_ideology`, `cultural_values`, `moral_reasoning`, `work_career_style` |
| **H. Sensory/Aesthetic** | `sensory_processing`, `aesthetic_preferences` |

### All 39 Domain IDs (Copy-Paste Ready)

```typescript
const DOMAIN_IDS = [
  // A. Core Personality
  'big_five_openness',
  'big_five_conscientiousness',
  'big_five_extraversion',
  'big_five_agreeableness',
  'big_five_neuroticism',
  // B. Dark Personality
  'dark_triad_narcissism',
  'dark_triad_machiavellianism',
  'dark_triad_psychopathy',
  // C. Emotional/Social
  'emotional_empathy',
  'emotional_intelligence',
  'attachment_style',
  'love_languages',
  'communication_style',
  // D. Decision/Motivation
  'risk_tolerance',
  'decision_style',
  'time_orientation',
  'achievement_motivation',
  'self_efficacy',
  'locus_of_control',
  'growth_mindset',
  // E. Values/Wellbeing
  'personal_values',
  'interests',
  'life_satisfaction',
  'stress_coping',
  'social_support',
  'authenticity',
  // F. Cognitive/Learning
  'cognitive_abilities',
  'creativity',
  'learning_styles',
  'information_processing',
  'metacognition',
  'executive_functions',
  // G. Social/Cultural
  'social_cognition',
  'political_ideology',
  'cultural_values',
  'moral_reasoning',
  'work_career_style',
  // H. Sensory/Aesthetic
  'sensory_processing',
  'aesthetic_preferences',
];
```

### Psychometric Score Schema

```typescript
interface PsychometricScore {
  score: number;       // 0-100, where 50 is average
  confidence: number;  // 0-1, data quality/reliability
  lastUpdated: string; // ISO timestamp
  source: string;      // 'assessment' | 'manual_entry' | 'auto_discovery' | 'adaptive_initial'
}
```

### Profile Configuration Modes

| Mode | Description | System Behavior |
|------|-------------|-----------------|
| **Auto-Discovery** | System infers values | Continuously updates based on user behavior |
| **Manual Entry** | User sets all values | Values are PERMANENT, system won't adjust |
| **Adaptive** | User sets initial values | System adjusts over time based on interactions |
| **Assessment** | User takes validated tests | Scores from psychological assessments (highest confidence) |

### Sample Users API

Create 10 sample users with varying psychometric profiles:
```bash
curl -X POST http://localhost:3000/api/seed-users
```

Returns users with archetypes: Creative Explorer, Analytical Achiever, Empathic Leader, Cautious Planner, Social Butterfly, Independent Thinker, Balanced Learner, Ambitious Innovator, Sensitive Artist, Pragmatic Problem-Solver.

---

## How to Update This Checklist

When completing items, change `- [ ]` to `- [x]`:

```markdown
Before:  - [ ] LevelDB setup with JSON encoding
After:   - [x] LevelDB setup with JSON encoding
```

When a phase is complete, add `[DONE]`:
```markdown
Before:  ### Phase 1: Core Database Foundation [CRITICAL]
After:   ### Phase 1: Core Database Foundation [DONE]
```

---

## Progress Summary

| Phase | Status | Blocker |
|-------|--------|---------|
| 1 - Database | **DONE** | - |
| 1.5 - Admin UI & Visualization | **DONE** | - |
| 2 - Learner Model | **DONE** | - |
| 3 - Knowledge Model | **DONE** | - |
| 4 - ZPD Engine | **DONE** | - |
| 5 - Gap Analysis | **DONE** | - |
| 6 - Content Delivery | Not Started | - |
| 7 - RAG Integration | Not Started | - |
| 8 - GNN Prep | Not Started | All above |

---

## Quick Smoke Tests

| Phase | Pass If... |
|-------|------------|
| 1 | Create learner → restart → learner exists |
| 1.5 | Add learner/concept via form → see in graph; Run functional tests page |
| 2 | View profile → see 39 domains + learning style |
| 3 | Click concept → see "First learn: A → B → C" |
| 4 | Ask "What next?" → personalized recommendations |
| 5 | View gaps → forgotten topics warned |
| 6 | Start session → content matches your style |
| 7 | Ask tutor → knows your history/struggles |
| 8 | Export → valid training data |

---

## Working on This Project

1. Check the **Progress Summary** above for current phase
2. Reference `research/graph-education.md` for schemas
3. Reference `research/phases.md` for detailed functional tests
4. **Update this checklist only at the end of each phase** - do not update item-by-item during development
5. When a phase is complete: mark all items `[x]`, add `[DONE]` to phase header, update Progress Summary
