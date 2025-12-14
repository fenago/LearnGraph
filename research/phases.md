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

## Phase 6: Adaptive Content Delivery

### Description
Match content (videos, readings, exercises) to each learner's profile and build personalized learning sessions.

### What Gets Built
- Content scoring algorithm (modality match, difficulty match)
- Session planning (warmup → core → practice → assessment)
- Presentation strategy selection (pace, depth, interactivity)
- Adaptive pacing with real-time adjustments

### Technical Tests

```typescript
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
```

### Functional Tests (End-User Perspective)

| Test | What You Do | What You Should See |
|------|-------------|---------------------|
| **Content matches your style** | Start learning a new topic | Content matches your profile: visual learner sees videos/diagrams first, reading learner sees articles first, kinesthetic learner gets interactive exercises |
| **Session planning** | Start a "30-minute study session" | Structured session: "Today's plan: 1. Quick review (5 min), 2. New concept video (10 min), 3. Practice problems (10 min), 4. Quick quiz (5 min)" |
| **Pace adjustment** | Struggle with several problems in a row | System responds: "Let's slow down a bit. Here's a simpler example..." or "Would you like to review the prerequisites first?" |
| **Pace acceleration** | Ace several problems quickly | System responds: "You're doing great! Let's try something more challenging..." or "Ready to skip to the next section?" |
| **Break recommendations** | Study for 45+ minutes | Prompt: "You've been focused for 45 minutes. A 5-minute break can help retention. Ready to pause?" |
| **Content alternatives** | Say "I don't like this video" or "Show me something else" | Alternative content in same topic but different format: "Here's an article explaining the same concept" or "Try this interactive demo instead" |
| **Difficulty mismatch alert** | Content is too easy or too hard | System detects: "This seems too easy for you - want to skip ahead?" or "This is quite challenging - want some extra support?" |

### Target Metrics

| Metric | Target | How to Verify |
|--------|--------|---------------|
| Content preference match | 70% user satisfaction | Post-content survey |
| Session completion rate | 80% finish planned session | Track dropoffs |
| Pacing adjustment effectiveness | 25% improvement in success rate | Before/after comparison |
| Time budget accuracy | ±10% of plan | Actual vs planned |
| Alternative content satisfaction | 75% prefer alternative when offered | Track switches |

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
| 6 | Does content match my learning style? |
| 7 | Does the AI tutor know my history and struggles? |
| 8 | Can I export my data for analysis? |
| 9 | Can I add learners/concepts via forms and see them in the graph? |
