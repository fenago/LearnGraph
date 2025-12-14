# Graph-Education Build Phases

## Overview

This document outlines the phased implementation plan for the Graph-Based Adaptive Education System. Each phase includes:
- **Description**: What we're building
- **Technical Tests**: Code-level validation
- **Functional Tests**: End-user perspective validation
- **Target Metrics**: Success criteria

---

## Phase 1: Core Database Foundation

### Description
Set up LevelDB with the dual-graph schema. This is the storage layer that powers everything else.

### What Gets Built
- LevelDB instance with JSON value encoding
- Key prefix schema (`learner:*`, `knowledge:*`, `index:*`)
- `EducationGraphDB` class with basic CRUD operations
- TypeScript interfaces for all data types

### Technical Tests

```typescript
// Verify write/read latency
console.time('write');
await db.put('test:key', { value: 42 });
console.timeEnd('write'); // Should be < 5ms

// Verify batch operations
const batch = db.batch();
for (let i = 0; i < 100; i++) {
  batch.put(`learner:user${i}:profile`, { userId: `user${i}` });
}
await batch.write(); // Should be < 50ms for 100 writes

// Verify range queries work
for await (const [key, value] of db.iterator({ gte: 'learner:', lte: 'learner:\xFF' })) {
  // Should iterate all learner keys
}
```

### Functional Tests (End-User Perspective)

| Test | What You Do | What You Should See |
|------|-------------|---------------------|
| **Create a learner** | Run the CLI command or API call to create a new learner with a name and email | Success message with a generated `userId`. The learner should persist across app restarts. |
| **Retrieve a learner** | Query for the learner you just created by their `userId` | Returns the exact data you entered, plus auto-generated fields like `createdAt` |
| **Delete and verify** | Delete the learner, then try to retrieve them again | First call succeeds, second call returns "not found" or empty result |
| **Restart persistence** | Create a learner, stop the application, restart it, query for the learner | Learner data survives restart - database is persistent |
| **Concurrent access** | Open two terminal windows, create learners from both simultaneously | Both learners are created without errors or data corruption |

### Target Metrics

| Metric | Target | How to Verify |
|--------|--------|---------------|
| Single write latency | < 5ms | Timing in logs |
| Single read latency | < 2ms | Timing in logs |
| Batch throughput | > 2,000 ops/sec | Bulk insert timing |
| Data persistence | 100% survival across restarts | Manual restart test |
| Key collision rate | 0% | No duplicate key errors |

---

## Phase 2: Learner Model (Graph A)

### Description
Build the complete learner profile system that stores psychometric scores across all 39 domains, learning preferences, and cognitive profiles.

### What Gets Built
- `LearnerProfile` storage with all 39 psychometric domains
- Domain score update functions with confidence tracking
- Learning style derivation from psychometrics
- Cognitive profile estimation

### Technical Tests

```typescript
// Create profile with all 39 domains
const profile = createLearnerProfile('user-001');
for (const domain of ALL_39_DOMAINS) {
  profile.psychometricProfile[domain] = { score: 50, confidence: 0.7, ... };
}
await db.setLearnerProfile('user-001', profile);

// Verify all domains stored
const retrieved = await db.getLearnerProfile('user-001');
assert(Object.keys(retrieved.psychometricProfile).length === 39);

// Update single domain
await db.updateDomainScore('user-001', 'openness', { score: 75, confidence: 0.9 });
```

### Functional Tests (End-User Perspective)

| Test | What You Do | What You Should See |
|------|-------------|---------------------|
| **Onboarding quiz** | Complete the initial psychometric questionnaire (or have scores imported) | System confirms "Profile created" with a summary of your dominant traits (e.g., "High openness, moderate conscientiousness") |
| **View your profile** | Access "My Profile" or "My Learning Style" page/command | See a dashboard showing: your Big Five scores, learning style (visual/auditory/etc.), cognitive capacity estimates, and derived preferences |
| **Update after assessment** | Complete an additional assessment or answer more questions | Relevant domain scores update, confidence increases, you may see "Your openness score updated from 65 to 72" |
| **Learning style accuracy** | Compare the system's "You are a visual learner who prefers solo study" with your actual preferences | Should match your real preferences at least 70% of the time |
| **Profile persistence** | Log out and log back in | All your psychometric data and preferences are retained |
| **Multi-domain view** | Request to see all 39 domains | See organized categories: Big Five, Dark Triad, Emotional Intelligence, etc. with scores and trends |

### Target Metrics

| Metric | Target | How to Verify |
|--------|--------|---------------|
| Profile creation time | < 20ms | Timing logs |
| Domain coverage | 39/39 domains | Count in profile view |
| Learning style accuracy | 70% user agreement | Post-setup survey |
| Profile retrieval time | < 10ms | Timing logs |
| Derived preferences accuracy | 75% match self-report | Comparison survey |

---

## Phase 3: Knowledge Model (Graph B)

### Description
Build the concept graph that represents what can be learned, including prerequisites, difficulty ratings, and Bloom's taxonomy levels.

### What Gets Built
- `ConceptNode` schema with Bloom's levels
- Prerequisite and related edges
- Graph traversal algorithms
- Difficulty and domain indexing

### Technical Tests

```typescript
// Add concept with full Bloom's taxonomy
await db.addConcept({
  conceptId: 'linear-equations',
  bloomLevels: {
    remember: [{ id: 'r1', description: 'Define linear equation' }],
    understand: [{ id: 'u1', description: 'Explain why graph is a line' }],
    apply: [{ id: 'a1', description: 'Solve 2x + 5 = 15' }],
    // ...
  },
  difficulty: { absolute: 4, cognitiveLoad: 0.5 }
});

// Add prerequisite edge
await db.addEdge({ from: 'arithmetic', to: 'linear-equations', strength: 'required' });

// Traverse prerequisites
const prereqs = await db.getPrerequisites('quadratic-formula', 5);
// Should return: quadratic-equations, linear-equations, expressions, variables, arithmetic
```

### Functional Tests (End-User Perspective)

| Test | What You Do | What You Should See |
|------|-------------|---------------------|
| **Browse topics** | Open the "Topics" or "Curriculum" view for a subject like Algebra | See a visual graph or list showing: concept names, difficulty indicators (easy/medium/hard), and connections between topics |
| **View prerequisites** | Click on "Quadratic Equations" and ask "What do I need to know first?" | See a clear list: "Before Quadratic Equations, you should know: Linear Equations → Algebraic Expressions → Variables → Basic Arithmetic" |
| **Difficulty filtering** | Filter topics by "Beginner" or "Advanced" | Only see concepts matching that difficulty level |
| **Bloom's level view** | Look at a concept's learning objectives | See objectives organized by level: "Remember: Define what X is", "Apply: Solve problems using X", "Create: Design your own X" |
| **Related concepts** | Ask "What's related to Linear Equations?" | See: "Systems of Equations (builds upon), Graphing (applies to), Inequalities (similar concept)" |
| **Concept search** | Search for "solve equations" | Find relevant concepts: Linear Equations, Quadratic Equations, Systems of Equations |

### Target Metrics

| Metric | Target | How to Verify |
|--------|--------|---------------|
| Concept insertion | < 10ms each | Timing logs |
| Prerequisite traversal (depth 5) | < 100ms | Performance test |
| All concepts have prerequisites defined | 95%+ | Audit query |
| Bloom level coverage | ≥ 3 levels per concept | Audit query |
| Search relevance | 80% relevant results in top 5 | Manual testing |

---

## Phase 4: ZPD Engine

### Description
Implement Vygotsky's Zone of Proximal Development to identify what each learner is ready to learn next, adjusted for their psychometric profile.

### What Gets Built
- `computeZPD()` algorithm
- Psychometric adjustment factors
- Scaffolding strategy selection
- Learning path generation

### Technical Tests

```typescript
// Compute ZPD for learner
const zpd = await db.computeAndStoreZPD('user-001');

// Verify zone partitioning
assert(zpd.zpd.lowerBound.length > 0);    // Easy stretch concepts
assert(zpd.zpd.optimalTarget.length > 0); // Ideal next concepts
assert(zpd.zpd.upperBound.length > 0);    // Hard stretch concepts
assert(zpd.tooHard.length > 0);           // Not ready yet

// Verify psychometric adjustments affect readiness
// High anxiety learner should have lower readiness for hard concepts
```

### Functional Tests (End-User Perspective)

| Test | What You Do | What You Should See |
|------|-------------|---------------------|
| **"What should I learn next?"** | Ask the system for recommendations after completing some topics | A prioritized list: "Based on your progress, we recommend: 1. Linear Equations (you're ready!), 2. Polynomials (slight stretch), 3. Factoring (challenging but achievable)" |
| **Personalized difficulty** | Compare recommendations with a friend who has different psychometrics | Different recommendations. If you have high anxiety, you see "easier" concepts first. If you have high openness, you see more abstract concepts. |
| **"Why this recommendation?"** | Ask why a specific concept is recommended | Explanation: "You've mastered Algebraic Expressions (85%) which is the main prerequisite. Your learning style matches well with the available content." |
| **Scaffolding suggestions** | Start learning a concept in your ZPD | System offers scaffolding matched to your profile: visual learner gets diagrams, high-conscientiousness gets checklists, low confidence gets worked examples first |
| **"I feel stuck"** | Tell the system you're struggling with a concept | It adjusts: offers more scaffolding, suggests reviewing prerequisites, or recommends an easier related concept |
| **Learning path view** | Ask "How do I get to Calculus?" | See a personalized path: "Your path: Linear Equations (2 weeks) → Quadratics (3 weeks) → Functions (2 weeks) → Limits (3 weeks) → Derivatives" with your estimated times |
| **Progress impact** | Complete a concept and check recommendations again | Recommendations update: completed concept moves to "mastered", new concepts become "ready" |

### Target Metrics

| Metric | Target | How to Verify |
|--------|--------|---------------|
| ZPD computation time | < 200ms | Timing logs |
| Recommendation accuracy | 75% of "optimal" concepts are actually learned next | Track over time |
| Psychometric adjustment impact | Visible difference between profiles | A/B comparison |
| Scaffolding satisfaction | 80% find scaffolds helpful | User survey |
| Learning path completion | 60% follow suggested paths | Track actual vs suggested |

---

## Phase 5: Knowledge Gap Analysis

### Description
Detect what learners are missing, have forgotten, or misunderstand, and create remediation plans.

### What Gets Built
- Gap detection (missing, partial, forgotten, misconception)
- Ebbinghaus forgetting curve predictions
- Spaced repetition scheduling
- Remediation plan generator

### Technical Tests

```typescript
// Detect gaps for target concept
const gaps = await analyzeKnowledgeGaps('user-001', ['quadratic-equations']);

// Should find different gap types
assert(gaps.some(g => g.gapType === 'missing'));      // Never learned
assert(gaps.some(g => g.gapType === 'partial'));      // Started, not mastered
assert(gaps.some(g => g.gapType === 'forgotten'));    // Decayed
assert(gaps.some(g => g.gapType === 'misconception')); // Wrong understanding

// Verify forgetting curve
const retention = predictDecay({ mastery: 80, lastAccessed: 30_days_ago });
assert(retention < 80); // Should have decayed
```

### Functional Tests (End-User Perspective)

| Test | What You Do | What You Should See |
|------|-------------|---------------------|
| **Gap report** | Ask "What are my knowledge gaps?" or view a "Gaps" dashboard | Clear report: "You have 3 gaps blocking Calculus: 1. Functions (never learned), 2. Graphing (50% complete), 3. Algebra (may have forgotten - last practiced 45 days ago)" |
| **Forgotten concept alert** | Don't practice a topic for 30+ days, then check your dashboard | Warning: "Your Linear Equations knowledge may have faded (estimated 60% retention). Consider a quick review." |
| **Misconception feedback** | Get a problem wrong in a specific way | System identifies: "It looks like you might be confusing terms and factors. Let's clarify the difference." |
| **Review reminders** | Use the system normally for a week | Get timely reminders: "Time to review: Fractions (due today), Decimals (due tomorrow)" based on spaced repetition |
| **Remediation plan** | Click "Fix this gap" on a knowledge gap | See a personalized plan: "To fix your Graphing gap: 1. Review coordinate planes (10 min), 2. Practice plotting points (15 min), 3. Take mini-quiz (5 min)" |
| **Post-remediation check** | Complete a remediation plan | Gap status updates: "Graphing gap resolved! Mastery now at 78%." |
| **Spaced repetition in action** | Complete a review when prompted | See interval grow: "Great! You remembered Functions well. Next review in 7 days (was 3 days)." |

### Target Metrics

| Metric | Target | How to Verify |
|--------|--------|---------------|
| Gap detection recall | > 90% of real gaps found | Known gaps vs detected |
| Forgetting prediction | ±15% of actual retention | Quiz after N days |
| Spaced repetition retention | 85% at review time | Track quiz scores |
| Misconception identification | 70% accuracy | Expert review |
| Remediation success rate | 70% gaps resolved | Track gap resolution |

---

## Phase 6: Adaptive Content Delivery & AI Curriculum Ingestion

### Description
Two major capabilities:
1. **Content Delivery**: Match content (videos, readings, exercises) to each learner's profile and build personalized learning sessions
2. **AI Curriculum Ingestion**: Enable teachers to quickly add courses by describing them in natural language, with AI generating the knowledge graph

### What Gets Built

#### Part A: Content Delivery
- Content scoring algorithm (modality match, difficulty match)
- Session planning (warmup → core → practice → assessment)
- Presentation strategy selection (pace, depth, interactivity)
- Adaptive pacing with real-time adjustments

#### Part B: AI Curriculum Ingestion
- `parseCurriculumInput()` - Extract topics from syllabus, text description, or uploaded documents
- `inferPrerequisites()` - AI determines concept dependencies based on domain knowledge
- `estimateDifficulty()` - Rate concepts 1-10 based on complexity and grade level
- `generateBloomLevels()` - Map learning objectives to Bloom's taxonomy
- `presentForReview()` - Show draft graph in visual UI for teacher approval
- `applyTeacherCorrections()` - Process teacher edits to the generated graph
- `learnFromCorrections()` - Improve future suggestions based on teacher feedback
- Curriculum Import UI (`/admin/import-curriculum`)
- API endpoint (`/api/curriculum/generate`)

### Technical Tests

```typescript
// === Part A: Content Delivery ===

// Score content for different learners
const visualLearner = { learningStyle: { primary: 'visual' } };
const videoContent = { modalityTags: ['visual', 'auditory'] };
const textContent = { modalityTags: ['reading'] };

const videoScore = scoreContentMatch(videoContent, visualLearner);
const textScore = scoreContentMatch(textContent, visualLearner);
assert(videoScore > textScore); // Visual learner prefers video

// Build session plan
const plan = buildSessionPlan(contentLibrary, learnerProfile, 45); // 45 min
assert(plan.totalTime <= 45);
assert(plan.core.length > 0);

// === Part B: AI Curriculum Ingestion ===

// Parse curriculum from text description
const input = `
  I'm teaching Algebra 1 to 9th graders. We cover:
  - Solving one-step equations
  - Solving two-step equations
  - Graphing linear equations
  - Systems of equations
`;
const draftGraph = await parseCurriculumInput(input);
assert(draftGraph.concepts.length >= 4);
assert(draftGraph.edges.length >= 3); // At least some prerequisites inferred

// Verify prerequisite inference
const twoStepEq = draftGraph.concepts.find(c => c.name.includes('two-step'));
const prerequisites = draftGraph.edges.filter(e => e.to === twoStepEq.id);
assert(prerequisites.length > 0); // Should require one-step equations

// Verify difficulty estimation
assert(draftGraph.concepts.every(c => c.difficulty >= 1 && c.difficulty <= 10));

// Verify Bloom level generation
assert(draftGraph.concepts.every(c => c.bloomLevel !== undefined));

// Test teacher correction workflow
const corrected = await applyTeacherCorrections(draftGraph, {
  addEdge: { from: 'coordinate_plane', to: 'graphing_linear_equations' },
  updateDifficulty: { conceptId: 'systems_of_equations', newDifficulty: 8 }
});
assert(corrected.edges.some(e => e.from === 'coordinate_plane'));

// Test learning from corrections
await learnFromCorrections(draftGraph, corrected);
// Future generations should be more accurate
```

### Functional Tests (End-User Perspective)

#### Part A: Content Delivery Tests

| Test | What You Do | What You Should See |
|------|-------------|---------------------|
| **Content matches your style** | Start learning a new topic | Content matches your profile: visual learner sees videos/diagrams first, reading learner sees articles first, kinesthetic learner gets interactive exercises |
| **Session planning** | Start a "30-minute study session" | Structured session: "Today's plan: 1. Quick review (5 min), 2. New concept video (10 min), 3. Practice problems (10 min), 4. Quick quiz (5 min)" |
| **Pace adjustment** | Struggle with several problems in a row | System responds: "Let's slow down a bit. Here's a simpler example..." or "Would you like to review the prerequisites first?" |
| **Pace acceleration** | Ace several problems quickly | System responds: "You're doing great! Let's try something more challenging..." or "Ready to skip to the next section?" |
| **Break recommendations** | Study for 45+ minutes | Prompt: "You've been focused for 45 minutes. A 5-minute break can help retention. Ready to pause?" |
| **Content alternatives** | Say "I don't like this video" or "Show me something else" | Alternative content in same topic but different format: "Here's an article explaining the same concept" or "Try this interactive demo instead" |
| **Difficulty mismatch alert** | Content is too easy or too hard | System detects: "This seems too easy for you - want to skip ahead?" or "This is quite challenging - want some extra support?" |

#### Part B: AI Curriculum Ingestion Tests

| Test | What You Do | What You Should See |
|------|-------------|---------------------|
| **Quick course creation** | Type "I'm teaching intro Machine Learning covering linear regression, logistic regression, decision trees, and neural networks" | AI generates draft graph with ~10-15 nodes including inferred prerequisites (linear algebra, statistics), connected with edges, each with difficulty ratings |
| **Syllabus upload** | Upload a PDF syllabus for a Data Analytics course | System extracts topics from document, identifies weekly progression, generates concept graph matching syllabus structure |
| **Review draft graph** | Look at the AI-generated graph in visualization | See nodes (concepts) and arrows (prerequisites) with AI's suggestions. Concepts have proposed difficulty ratings and Bloom levels. |
| **Edit generated graph** | Click a concept node and change its difficulty from 5 to 7 | Node updates, change is tracked as teacher correction |
| **Add missing prerequisite** | Notice AI missed that "Graphing" requires "Slope", add the edge | Edge appears in graph, system notes the correction for future learning |
| **Remove incorrect edge** | AI incorrectly linked two unrelated concepts, delete the edge | Edge removed, system learns this pattern shouldn't be suggested |
| **Approve and save** | Click "Approve Graph" after reviewing | All concepts and edges are saved to the knowledge graph, available for student use |
| **Generate for different subjects** | Create courses for Math, History, Programming | AI adapts to different domains, uses appropriate terminology and relationships for each subject |
| **Partial approval** | Approve some concepts but mark others for revision | Approved concepts saved, others stay in draft state for further editing |
| **Template reuse** | Start a new "Algebra 1" course when one already exists | System offers to clone existing template or generate fresh, shows diff if generating new |

### Target Metrics

#### Part A: Content Delivery Metrics

| Metric | Target | How to Verify |
|--------|--------|---------------|
| Content preference match | 70% user satisfaction | Post-content survey |
| Session completion rate | 80% finish planned session | Track dropoffs |
| Pacing adjustment effectiveness | 25% improvement in success rate | Before/after comparison |
| Time budget accuracy | ±10% of plan | Actual vs planned |
| Alternative content satisfaction | 75% prefer alternative when offered | Track switches |

#### Part B: AI Curriculum Ingestion Metrics

| Metric | Target | How to Verify |
|--------|--------|---------------|
| Concept extraction accuracy | 90% of mentioned topics captured | Compare input vs output |
| Prerequisite inference accuracy | 80% of AI-suggested edges approved by teacher | Track approval rate |
| Difficulty estimation accuracy | ±1.5 points of teacher's rating | Compare AI vs teacher |
| Time to full course graph | < 5 minutes from input to approved graph | Time tracking |
| Teacher correction rate | < 20% of edges need modification | Track edit frequency |
| Cross-domain accuracy | Works for STEM, humanities, arts | Test diverse subjects |
| Learning improvement | 10% better suggestions after corrections | A/B test over time |

### Implementation Notes

#### AI Curriculum Ingestion Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    CURRICULUM INGESTION PIPELINE                         │
│                                                                          │
│  INPUT LAYER                                                             │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │  Text description │ PDF upload │ Word doc │ Existing standards   │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                              │                                           │
│                              ▼                                           │
│  EXTRACTION LAYER                                                        │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │  • Topic identification (NER for educational concepts)           │    │
│  │  • Learning objective parsing                                    │    │
│  │  • Grade level / difficulty inference                            │    │
│  │  • Domain classification (Math, Science, Language, etc.)         │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                              │                                           │
│                              ▼                                           │
│  INFERENCE LAYER (LLM-Powered)                                           │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │  • Prerequisite inference using domain knowledge                 │    │
│  │  • Difficulty estimation based on cognitive complexity           │    │
│  │  • Bloom's taxonomy mapping                                      │    │
│  │  • Related concept suggestion                                    │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                              │                                           │
│                              ▼                                           │
│  GRAPH GENERATION                                                        │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │  • Create ConceptNode objects                                    │    │
│  │  • Create PrerequisiteEdge objects                               │    │
│  │  • Validate graph connectivity (no orphans)                      │    │
│  │  • Check for cycles (prerequisites can't be circular)            │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                              │                                           │
│                              ▼                                           │
│  REVIEW UI                                                               │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │  • Visual graph editor (React Flow)                              │    │
│  │  • Inline editing of concept properties                          │    │
│  │  • Drag-and-drop edge creation                                   │    │
│  │  • Approve/reject/modify workflow                                │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                              │                                           │
│                              ▼                                           │
│  LEARNING LAYER                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │  • Store teacher corrections as training signal                  │    │
│  │  • Build domain-specific patterns                                │    │
│  │  • Improve future inference accuracy                             │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

#### Supported Input Formats

| Format | Extraction Method | Notes |
|--------|-------------------|-------|
| Plain text | Direct LLM parsing | Fastest, most flexible |
| PDF syllabus | PDF parsing + LLM | Preserves document structure |
| Word document | DOCX parsing + LLM | Handles formatting |
| Markdown | Direct parsing | Great for developers |
| JSON curriculum | Schema validation | For programmatic import |
| Common Core standards | Pre-mapped templates | US education standards |
| AP/IB frameworks | Pre-mapped templates | Advanced placement courses |

#### Example: Teacher Workflow

```
1. Teacher navigates to /admin/import-curriculum

2. Teacher types or uploads:
   "Data Analytics 101 for business students:
    - Spreadsheet basics (Excel/Sheets)
    - Data cleaning techniques
    - Pivot tables
    - Basic SQL queries
    - Python pandas introduction
    - Data visualization with charts
    - Dashboard creation"

3. System generates draft graph (3-5 seconds):
   - 12 concept nodes (7 from input + 5 inferred prerequisites)
   - 15 prerequisite edges
   - Difficulty ratings 2-7
   - All tagged as domain: "Data Analytics"

4. Teacher reviews in graph UI:
   - Approves 13/15 edges
   - Deletes 1 incorrect edge (AI thought SQL requires pivot tables)
   - Adds 1 missing edge (visualization requires spreadsheet basics)
   - Adjusts 2 difficulty ratings

5. Teacher clicks "Save to Knowledge Graph"
   - All concepts and edges saved
   - Course ready for student enrollment
   - Total time: ~4 minutes
```

### Part C: AI Assessment Generation

#### Description
Automatically generate assessments when concepts are created (or imported via curriculum ingestion). Assessments provide the feedback loop needed to accurately measure mastery rather than relying solely on self-reported progress. **This feature includes a toggle switch to enable/disable assessment generation.**

#### What Gets Built
- `generateAssessments()` - Create assessment questions for a concept based on Bloom levels
- `generateMisconceptionProbes()` - Create questions that detect common misconceptions
- `generateQuickCheck()` - 2-3 questions that gate progression (must pass to proceed)
- `generateMasteryTest()` - 5-10 questions that determine mastery percentage
- Assessment toggle configuration (`assessmentsEnabled: boolean`)
- Assessment Settings UI (`/admin/settings/assessments`)
- Assessment Review UI (`/admin/assessments`)
- API endpoints (`/api/assessments/generate`, `/api/assessments/settings`)

#### Assessment Types

| Type | Purpose | Question Count | When Used |
|------|---------|----------------|-----------|
| **Quick Check** | Gate progression | 2-3 | Before marking concept "complete" |
| **Mastery Test** | Determine mastery % | 5-10 | After studying concept content |
| **Misconception Probe** | Detect wrong mental models | 3-5 | When errors indicate confusion |
| **Spaced Review** | Verify retention | 2-3 | During spaced repetition reviews |

#### Question Types

| Type | Format | Example |
|------|--------|---------|
| `multiple_choice` | 4 options, 1 correct | "What is 2x when x=3?" A) 5 B) 6 C) 8 D) 9 |
| `numeric` | Free-form number entry | "Solve: 3x + 5 = 14. x = ___" |
| `short_answer` | Text response | "Define what a linear equation is." |
| `worked_problem` | Multi-step with shown work | "Solve step by step: 2x + 3 = 7" |
| `classification` | Sort items into categories | "Drag each expression to: Linear / Non-linear" |
| `ordering` | Arrange in sequence | "Order the steps for solving this equation" |

#### Assessment Configuration Schema

```typescript
interface AssessmentConfig {
  enabled: boolean;                    // Master toggle for all assessments
  generateOnCurriculumImport: boolean; // Auto-generate when importing curriculum
  generateOnConceptCreate: boolean;    // Auto-generate when adding single concepts
  quickCheckRequired: boolean;         // Require Quick Check before progression
  masteryThreshold: number;            // % needed to pass (default: 70)
  questionTypes: string[];             // Allowed types (default: all)
  customPrompts?: {                    // Override AI generation prompts
    quickCheck?: string;
    masteryTest?: string;
    misconceptionProbe?: string;
  };
}

interface Assessment {
  id: string;
  conceptId: string;
  type: 'quick_check' | 'mastery_test' | 'misconception_probe' | 'spaced_review';
  questions: Question[];
  generatedAt: string;
  generatedBy: 'ai' | 'teacher';
  approved: boolean;
}

interface Question {
  id: string;
  type: 'multiple_choice' | 'numeric' | 'short_answer' | 'worked_problem' | 'classification' | 'ordering';
  bloomLevel: 'remember' | 'understand' | 'apply' | 'analyze' | 'evaluate' | 'create';
  prompt: string;
  options?: string[];           // For multiple_choice
  correctAnswer: string | string[];
  explanation: string;          // Shown after answering
  misconceptionTarget?: string; // What misconception this tests for
  difficulty: number;           // 1-10
}
```

#### Technical Tests

```typescript
// === Part C: AI Assessment Generation ===

// Verify assessment toggle works
const settings = await getAssessmentSettings();
assert(typeof settings.enabled === 'boolean');

// Toggle assessments off
await updateAssessmentSettings({ enabled: false });
const concept = await createConcept({ id: 'test-concept' });
const assessments = await getAssessmentsForConcept('test-concept');
assert(assessments.length === 0); // No assessments generated when disabled

// Toggle assessments on
await updateAssessmentSettings({ enabled: true });
const concept2 = await createConcept({ id: 'test-concept-2' });
const assessments2 = await getAssessmentsForConcept('test-concept-2');
assert(assessments2.length > 0); // Assessments auto-generated when enabled

// Generate assessments for a concept
const linearEquations = { id: 'linear-equations', bloomLevels: {...} };
const assessments = await generateAssessments(linearEquations);

// Verify assessment types generated
assert(assessments.some(a => a.type === 'quick_check'));
assert(assessments.some(a => a.type === 'mastery_test'));

// Verify question counts
const quickCheck = assessments.find(a => a.type === 'quick_check');
assert(quickCheck.questions.length >= 2 && quickCheck.questions.length <= 3);

const masteryTest = assessments.find(a => a.type === 'mastery_test');
assert(masteryTest.questions.length >= 5 && masteryTest.questions.length <= 10);

// Verify question types match concept Bloom levels
const bloomLevels = Object.keys(linearEquations.bloomLevels);
const questionBlooms = masteryTest.questions.map(q => q.bloomLevel);
assert(questionBlooms.some(b => bloomLevels.includes(b)));

// Verify misconception probes target known issues
const misconceptionProbes = await generateMisconceptionProbes('linear-equations');
assert(misconceptionProbes.every(q => q.misconceptionTarget));

// Test Quick Check gating
const quickCheckResult = await submitQuickCheck('user-001', 'linear-equations', answers);
if (quickCheckResult.passed) {
  assert(quickCheckResult.canProceed === true);
} else {
  assert(quickCheckResult.canProceed === false);
  assert(quickCheckResult.retryAllowed === true);
}

// Test mastery calculation from assessment
const masteryResult = await submitMasteryTest('user-001', 'linear-equations', answers);
assert(masteryResult.masteryPercentage >= 0 && masteryResult.masteryPercentage <= 100);
assert(typeof masteryResult.updatedKnowledgeState === 'object');
```

#### Functional Tests (End-User Perspective)

| Test | What You Do | What You Should See |
|------|-------------|---------------------|
| **Toggle assessments on** | Go to Settings → Assessments, flip "Enable Assessments" switch ON | Switch turns blue, confirmation "Assessments enabled" |
| **Toggle assessments off** | Flip "Enable Assessments" switch OFF | Switch turns gray, new concepts created without assessments |
| **Auto-generate on import** | With assessments enabled, import a curriculum via AI | Each generated concept includes Quick Check + Mastery Test questions |
| **Review generated questions** | Open a concept, click "Assessments" tab | See all questions organized by type (Quick Check, Mastery Test), each showing question, options, correct answer, explanation |
| **Edit a question** | Click edit on a multiple choice question, change an option | Question updates, marked as "Teacher Modified" |
| **Delete a question** | Click delete on a low-quality question | Question removed, system notes teacher preference |
| **Add custom question** | Click "Add Question", write your own | New question added to assessment, marked as "Teacher Created" |
| **Take Quick Check** | As a learner, finish studying a concept, click "Check Understanding" | 2-3 questions appear, must answer all, immediate feedback per question |
| **Pass Quick Check** | Answer all Quick Check questions correctly | "Nice! You can move on." Concept marked complete. |
| **Fail Quick Check** | Get 1+ questions wrong | "Let's review this." Shown explanation for missed questions, option to retry or review content |
| **Take Mastery Test** | Click "Test My Knowledge" on a concept | 5-10 questions, varied types, shown difficulty progression |
| **See mastery result** | Complete Mastery Test | "You scored 78%!" Updates knowledge state, shows areas to strengthen |
| **Misconception detection** | Get specific question wrong that targets a misconception | "It looks like you might think X, but actually Y. Here's why..." |
| **Spaced review assessment** | Return to review a concept from spaced repetition queue | 2-3 review questions, if passed → interval extends, if failed → more review |
| **Assessment analytics** | Teacher views dashboard for course assessments | See pass rates per concept, common wrong answers, question difficulty stats |

#### Target Metrics

| Metric | Target | How to Verify |
|--------|--------|---------------|
| Assessment generation time | < 10 seconds per concept | Timing logs |
| Question quality (teacher approval) | 80% of AI questions approved | Track approval rate |
| Quick Check accuracy | 85% correlation with actual mastery | Compare to longer assessments |
| Mastery Test reliability | 0.8+ Cronbach's alpha | Statistical analysis |
| Misconception detection rate | 70% of misconceptions caught | Compare to tutoring sessions |
| Toggle responsiveness | < 100ms | UI timing |
| Teacher time to review | < 2 min per concept's assessments | Time tracking |

#### Implementation Notes

##### Assessment Generation Pipeline

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    ASSESSMENT GENERATION PIPELINE                        │
│                                                                          │
│  CONFIG CHECK                                                            │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │  if (!assessmentConfig.enabled) return [];                       │    │
│  │  Check: generateOnCurriculumImport | generateOnConceptCreate     │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                              │                                           │
│                              ▼                                           │
│  CONCEPT ANALYSIS                                                        │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │  • Extract Bloom levels and learning objectives                  │    │
│  │  • Identify key terms and procedures                             │    │
│  │  • Map to prerequisite concepts                                  │    │
│  │  • Detect common misconceptions from domain knowledge            │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                              │                                           │
│                              ▼                                           │
│  QUESTION GENERATION (LLM-Powered)                                       │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │  For each Bloom level:                                           │    │
│  │    • Generate questions matching cognitive level                 │    │
│  │    • Create distractors that test understanding (not tricks)     │    │
│  │    • Write explanations for correct and incorrect answers        │    │
│  │    • Tag misconceptions each question might reveal               │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                              │                                           │
│                              ▼                                           │
│  ASSESSMENT ASSEMBLY                                                     │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │  Quick Check: 2-3 questions, 'understand' + 'apply' levels       │    │
│  │  Mastery Test: 5-10 questions, all Bloom levels, varied types    │    │
│  │  Misconception Probes: 3-5 targeted questions                    │    │
│  │  Spaced Review: 2-3 questions, random from mastery pool          │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                              │                                           │
│                              ▼                                           │
│  TEACHER REVIEW (Optional but Recommended)                               │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │  • Present questions in review UI                                │    │
│  │  • Allow edit/delete/add                                         │    │
│  │  • Track corrections for future improvement                      │    │
│  │  • Bulk approve or individual review                             │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                              │                                           │
│                              ▼                                           │
│  KNOWLEDGE STATE INTEGRATION                                             │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │  Assessment results → Update mastery percentage                  │    │
│  │  Quick Check fail → Flag for review, don't mark complete         │    │
│  │  Misconception detected → Add to learner profile                 │    │
│  │  Spaced review result → Adjust SM-2 interval                     │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

##### How Assessments Feed the System

| Assessment Event | System Update |
|------------------|---------------|
| Quick Check passed | Concept marked complete, unlock dependent concepts |
| Quick Check failed | Flag for review, suggest content re-engagement |
| Mastery Test completed | Update `knowledgeState.mastery` with exact % |
| Wrong answer on probe | Add misconception to `learnerProfile.misconceptions` |
| Spaced review passed | Increase SM-2 interval (e.g., 3 days → 7 days) |
| Spaced review failed | Reset SM-2 interval, add to priority review queue |

---

## Phase 7: RAG Integration

### Description
Power LLM tutoring responses with personalized context from the learner and knowledge graphs.

### What Gets Built
- RAG context retrieval combining learner profile + knowledge state + ZPD
- Query-specific context selection
- Prompt augmentation templates
- Context size optimization

### Technical Tests

```typescript
// Retrieve RAG context
const context = await getRAGContext('user-001', 'Why do I keep making mistakes?');

// Verify context includes relevant data
assert(context.learnerProfile);           // Learning style, psychometrics
assert(context.relevantKnowledgeStates);  // Current mastery levels
assert(context.misconceptions);           // Known wrong mental models
assert(context.recommendedScaffolding);   // Based on profile

// Verify context fits token budget
const tokens = estimateTokens(context);
assert(tokens < 2000); // Leave room for response
```

### Functional Tests (End-User Perspective)

| Test | What You Do | What You Should See |
|------|-------------|---------------------|
| **Personalized explanation** | Ask the AI tutor "Explain linear equations to me" | Explanation matches your style: visual learner gets "Picture a seesaw..." with diagram references; reading learner gets structured text; the complexity matches your cognitive profile |
| **Misconception-aware response** | Ask about a topic where you have a known misconception | Response directly addresses it: "I noticed you sometimes confuse X with Y. Let me clarify: [targeted explanation]" |
| **Progress-aware conversation** | Ask "What should I focus on?" | Response uses your actual data: "Based on your 65% mastery of Expressions and struggle with word problems last week, I'd suggest..." |
| **ZPD-aware recommendations** | Ask "Am I ready for Calculus?" | Honest, personalized assessment: "You're close! You've mastered the prerequisites except Functions (40% complete). Let's strengthen that first." |
| **Scaffolding in responses** | Struggle with a concept and ask for help | Response uses your preferred scaffolding: chunked explanations, analogies to things you know, checklists if you're high-conscientiousness |
| **Context continuity** | Have a multi-turn conversation about a topic | Tutor remembers: your profile, what you've discussed, your specific struggles, without you repeating yourself |
| **"How do you know that?"** | Ask the tutor why it gave a specific recommendation | Transparent response: "I suggested this because your profile shows you're a visual learner (openness: 75), and you mastered the prerequisites last week." |

### Target Metrics

| Metric | Target | How to Verify |
|--------|--------|---------------|
| Context retrieval time | < 150ms | Timing logs |
| Response personalization | 80% feel responses are "personalized to them" | User survey |
| Misconception addressing | 80% of known misconceptions addressed when relevant | Audit responses |
| Context relevance | 75% of context used in response | Analyze LLM outputs |
| User satisfaction | 4.0/5.0 average | Post-interaction rating |

---

## Phase 8: GNN Preparation (Future)

### Description
Export graph data for training Graph Neural Networks that can predict learning outcomes and optimize recommendations.

### What Gets Built
- Feature extraction pipelines (learner → vector, concept → vector)
- Training data export (nodes, edges, labels)
- PyTorch Geometric compatible format
- Embedding storage schema

### Technical Tests

```typescript
// Extract features
const learnerFeatures = extractLearnerFeatures(profile); // 16-dim vector
const conceptFeatures = extractConceptFeatures(concept); // 13-dim vector

// Verify dimensions and ranges
assert(learnerFeatures.length === 16);
assert(learnerFeatures.every(f => f >= 0 && f <= 1));

// Export training data
const gnnData = await exportForGNNTraining(db);
assert(gnnData.nodes.length > 0);
assert(gnnData.edges.length > 0);
assert(gnnData.labels.length > 0);

// Validate PyG compatibility
const pygFormat = convertToPyGFormat(gnnData);
assert(pygFormat.edge_index[0].length === pygFormat.edge_index[1].length);
```

### Functional Tests (End-User Perspective)

| Test | What You Do | What You Should See |
|------|-------------|---------------------|
| **Prediction accuracy** | Use the system for a month, then see GNN predictions vs actual outcomes | Report: "GNN predicted you'd master Linear Equations in 5 days - you did it in 6 days (92% accuracy)" |
| **Optimized recommendations** | Compare GNN-powered recommendations to rule-based | GNN recommendations feel "smarter" - better success rate, fewer dead ends |
| **Similar learner insights** | Ask "Who learns like me?" | See anonymized insights: "Learners with similar profiles to you typically master Algebra in 3 weeks and benefit from video content" |
| **Difficulty calibration** | See concept difficulty ratings | Ratings are personalized: "Linear Equations - Medium for you (vs. Hard average)" based on GNN prediction |
| **Engagement prediction** | Start a new topic | System predicts: "Based on your profile, you'll likely find this engaging. Estimated completion: 85%" |
| **Export your data** | Request a data export | Receive clean export of your learning data in standard format (for privacy/portability) |

### Target Metrics

| Metric | Target | How to Verify |
|--------|--------|---------------|
| Feature extraction time | < 1ms per node | Timing logs |
| Export completeness | 100% of interactions included | Audit |
| GNN mastery prediction | ±1 Bloom level | Compare predicted vs actual |
| Time-to-mastery prediction | ±20% accuracy | Compare predicted vs actual |
| Model training convergence | Loss decreases | Training logs |

---

## Phase 9: Admin UI & Graph Visualization

### Description
Build web-based forms for data entry and an interactive graph visualization to see the knowledge graph and learner progress.

### What Gets Built
- Web forms for adding/editing learners, concepts, prerequisites, and knowledge states
- Interactive graph visualization showing concepts and their relationships
- Learner progress overlay showing mastery levels on the graph
- ZPD and gap highlighting in the visualization

### Technical Tests

```typescript
// Test form submission creates database entries
const learnerForm = { name: 'John Doe', email: 'john@example.com' };
const response = await api.post('/learners', learnerForm);
assert(response.status === 201);
const learner = await db.getLearnerProfile(response.data.userId);
assert(learner.name === 'John Doe');

// Test graph data endpoint
const graphData = await api.get('/graph/concepts');
assert(graphData.nodes.length > 0);
assert(graphData.edges.length > 0);

// Test learner overlay endpoint
const overlay = await api.get(`/graph/overlay/${userId}`);
assert(overlay.masteryLevels instanceof Map);
assert(Array.isArray(overlay.zpdConcepts));

// Test visualization renders without errors
render(<KnowledgeGraph data={graphData} />);
expect(screen.getByTestId('graph-canvas')).toBeInTheDocument();
```

### Functional Tests (End-User Perspective)

| Test | What You Do | What You Should See |
|------|-------------|---------------------|
| **Add a learner** | Open the "Add Learner" form, fill in name and email, click Submit | Success toast "Learner created", new learner appears in learner list |
| **Add a concept** | Open "Add Concept" form, fill in ID, name, domain, description, set difficulty slider, click Submit | Success toast "Concept created", new concept appears in graph visualization |
| **Connect concepts** | Open "Add Prerequisite" form, select "Algebra" as From, "Calculus" as To, select "Required" strength, click Submit | Success toast, arrow appears in graph from Algebra to Calculus |
| **View the graph** | Navigate to Graph Visualization page | See an interactive graph with nodes (concepts) and arrows (prerequisites). Nodes are color-coded by domain. |
| **Interact with graph** | Click on a concept node, drag to rearrange, scroll to zoom | Side panel shows concept details, nodes can be dragged, zoom works smoothly |
| **Search in graph** | Type "algebra" in the search box | Algebra node highlights, other nodes dim, view centers on Algebra |
| **Filter by domain** | Select "Mathematics" from domain filter | Only math concepts visible, other domains hidden |
| **View learner progress** | Select a learner from dropdown on graph page | Nodes change color based on mastery: green (≥80%), yellow (40-79%), red (<40%), gray (not started) |
| **See ZPD** | Toggle "Show ZPD" checkbox | Concepts in Zone of Proximal Development get yellow borders |
| **See gaps** | Toggle "Show Gaps" checkbox | Forgotten concepts pulse, blocking gaps show warning icon |
| **Edit from graph** | Click a concept node, click "Edit" in side panel | Edit form opens with current values pre-filled |
| **Track knowledge state** | Open "Add Knowledge State" form, select learner and concept, set mastery to 75%, submit | Success toast, graph updates to show yellow color for that concept |
| **Layout options** | Switch between Hierarchical / Force / Radial layouts | Graph rearranges to selected layout style |
| **Responsive design** | View on mobile device or resize browser window | Graph and forms remain usable, touch gestures work |

### Target Metrics

| Metric | Target | How to Verify |
|--------|--------|---------------|
| Form submission time | < 500ms | Network timing |
| Graph render time (100 nodes) | < 1s | Performance profiling |
| Graph render time (1000 nodes) | < 3s | Performance profiling |
| Interaction latency (pan/zoom) | < 16ms (60fps) | Browser DevTools |
| Form validation errors | Clear, helpful messages | Manual testing |
| Mobile usability | Fully functional | Manual testing on devices |
| Accessibility | WCAG 2.1 AA compliant | Automated + manual audit |
| User satisfaction | 80% find it intuitive | User testing |

### Implementation Notes

**Tech Stack Recommendation:**
- **Framework**: Next.js with App Router
- **Forms**: React Hook Form + Zod validation
- **Styling**: TailwindCSS + shadcn/ui components
- **Graph**: React Flow (for <500 nodes) or Cytoscape.js (for larger graphs)
- **State**: TanStack Query for server state

**Key Components:**
```
/app
  /admin
    /learners
      page.tsx          # Learner list + add form
      [id]/page.tsx     # Edit learner
    /concepts
      page.tsx          # Concept list + add form
      [id]/page.tsx     # Edit concept
    /prerequisites
      page.tsx          # Edge management
  /graph
    page.tsx            # Main visualization
    components/
      KnowledgeGraph.tsx
      LearnerOverlay.tsx
      ConceptNode.tsx
      PrerequisiteEdge.tsx
      GraphControls.tsx
```

---

## Implementation Priority

| Phase | Priority | Rationale |
|-------|----------|-----------|
| 1 | **Critical** | Foundation - nothing works without storage |
| 2 | **Critical** | Learner data drives all personalization |
| 3 | **Critical** | Knowledge graph enables prerequisites and paths |
| 4 | **High** | ZPD is the core value proposition |
| 5 | **High** | Gaps block learning progress |
| 7 | **High** | RAG powers the AI tutoring experience |
| 6 | **Medium** | Content delivery is enhancement |
| 9 | **Medium** | Admin UI & Visualization - data entry and visual understanding |
| 8 | **Low** | Future optimization layer (GNN) |

---

## MVP Definition

**Minimum Viable Product = Phases 1-4**

With Phases 1-4 complete, you have:
- Persistent storage for learners and concepts
- Full psychometric profiling
- Knowledge graph with prerequisites
- Personalized "what to learn next" recommendations

This delivers the core value: **personalized learning paths based on who you are and what you know**.

---

## Quick Reference: "Is This Phase Working?"

| Phase | Quick Smoke Test |
|-------|------------------|
| 1 | Can I create a learner and find them after restarting the app? |
| 2 | Does my profile show all 39 domains with scores? |
| 3 | Can I see prerequisites for any concept? |
| 4 | Does "What should I learn next?" give me a sensible answer? |
| 5 | Does it warn me about forgotten topics? |
| 6 | Does content match my learning style? Can I describe a course and have AI generate the graph in < 5 min? |
| 7 | Does the AI tutor know my history and struggles? |
| 8 | Can I export my data for analysis? |
| 9 | Can I add learners/concepts via forms and see them in the graph? |
