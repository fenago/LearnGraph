# LearnGraph

**A Graph-Based Adaptive Education System** — Personalized tutoring that makes any LLM smarter about each specific learner.

[![Status](https://img.shields.io/badge/Status-Active%20Development-green)]()
[![Phase](https://img.shields.io/badge/Phase-5%20of%208-blue)]()
[![Tests](https://img.shields.io/badge/Tests-37%2F37%20Passing-brightgreen)]()

---

## What Problem Does This Solve?

**Every learner is different, but most educational AI treats them the same.**

```
WITHOUT LearnGraph:
  User: "Explain linear equations"
  LLM: [Generic explanation, same for everyone]

WITH LearnGraph:
  User: "Explain linear equations"
  System retrieves: visual learner, struggles with "moving terms", high anxiety
  LLM: [Personalized explanation with diagrams, addresses their confusion, gentle tone]
```

LearnGraph is a **Graph RAG (Retrieval-Augmented Generation) knowledge base** that enables personalized education by providing any LLM with:

1. **Who the learner is** — 39 psychological dimensions, learning style, cognitive profile
2. **What they know** — Mastery levels, misconceptions, learning history
3. **What to learn next** — Zone of Proximal Development recommendations
4. **How to teach them** — Scaffolding strategies based on their psychometric profile

---

## Core Capabilities

| Feature | Description | Status |
|---------|-------------|--------|
| **Learner Profiles** | Store and manage learner data with full psychometric profiles | **Working** |
| **Knowledge Graph** | Concepts, prerequisites, Bloom's taxonomy, difficulty ratings | **Working** |
| **Progress Tracking** | Mastery levels (0-100%), misconceptions, review history | **Working** |
| **Learning Style Derivation** | Automatically derive learning style from psychometric scores | **Working** |
| **Cognitive Profile Estimation** | Estimate working memory, attention span, processing speed | **Working** |
| **Graph Visualization** | Interactive view with mastery overlays and ZPD highlighting | **Working** |
| **Admin UI** | Full CRUD interface for all data management | **Working** |
| **"What should I learn next?"** | ZPD-based recommendations with scaffolding strategies | **Working** |
| **Knowledge Gap Detection** | Find missing, forgotten, or misconceived knowledge | **Working** |
| **Spaced Repetition** | Schedule reviews based on Ebbinghaus forgetting curve (SM-2) | **Working** |
| **Remediation Plans** | Auto-generated learning plans to address gaps | **Working** |
| **RAG Context Generation** | Augment LLM prompts with learner context | Planned (Phase 7) |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           LevelDB Instance                               │
│                                                                          │
│  ┌─────────────────────────────┐    ┌─────────────────────────────────┐ │
│  │     LEARNER MODEL          │    │      KNOWLEDGE MODEL            │ │
│  │     (Graph A)              │    │      (Graph B)                  │ │
│  │                            │    │                                 │ │
│  │  • User Profiles           │    │  • Concept Nodes                │ │
│  │  • 39 Psychometric Domains │◄──►│  • Prerequisite Edges           │ │
│  │  • Knowledge States        │    │  • Related Concept Edges        │ │
│  │  • Learning History        │    │  • Bloom's Taxonomy Tags        │ │
│  │  • Misconceptions          │    │  • Difficulty Ratings (1-10)    │ │
│  │  • Derived Learning Style  │    │  • Learning Objectives          │ │
│  │  • Cognitive Profile       │    │  • Domain Classification        │ │
│  └─────────────────────────────┘    └─────────────────────────────────┘ │
│                           │                    │                        │
│                           └────────┬───────────┘                        │
│                                    │                                    │
│                          ┌─────────▼─────────┐                          │
│                          │   ZPD BRIDGE      │                          │
│                          │   (Computed)      │                          │
│                          │                   │                          │
│                          │ • Ready to learn  │                          │
│                          │ • Scaffolding     │                          │
│                          │ • Learning paths  │                          │
│                          └───────────────────┘                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd LearnGraph

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Access the Application

- **Home Dashboard**: http://localhost:3000
- **My Profile**: http://localhost:3000/profile (39 psychometric domains)
- **Admin Panel**: http://localhost:3000/admin/learners
- **Recommendations**: http://localhost:3000/recommendations
- **Gap Analysis**: http://localhost:3000/gaps
- **Graph Visualization**: http://localhost:3000/graph
- **System Status**: http://localhost:3000/status
- **Functional Tests**: http://localhost:3000/tests

### Basic Usage

```typescript
import { getDB } from './lib/db';

const db = await getDB();

// 1. Create a learner
await db.setLearnerProfile('student-001', {
  userId: 'student-001',
  name: 'Alice Chen',
  email: 'alice@example.com'
});

// 2. Update their psychometric profile
await db.updatePsychometricScore('student-001', 'openness', {
  score: 0.85,
  confidence: 0.9,
  source: 'assessment'
});

// 3. Derive their learning style automatically
await db.computeAndStoreLearningStyle('student-001');
// Result: { primary: 'visual', secondary: 'kinesthetic', socialPreference: 'collaborative', ... }

// 4. Build the knowledge graph
await db.addConcept({
  conceptId: 'arithmetic',
  name: 'Arithmetic',
  domain: 'mathematics',
  difficulty: { overall: 2, cognitive: 2, timeEstimate: 120 },
  bloomLevels: ['remember', 'understand', 'apply']
});

await db.addConcept({
  conceptId: 'algebra',
  name: 'Algebra',
  domain: 'mathematics',
  difficulty: { overall: 4, cognitive: 4, timeEstimate: 300 },
  bloomLevels: ['remember', 'understand', 'apply', 'analyze']
});

await db.addEdge({
  from: 'arithmetic',
  to: 'algebra',
  strength: 'required',
  description: 'Arithmetic is essential for algebra'
});

// 5. Track learner progress
await db.setKnowledgeState('student-001', 'arithmetic', {
  mastery: 92,
  bloomLevel: 3,
  confidenceScore: 0.9,
  lastAssessed: new Date().toISOString()
});

// 6. Query prerequisites (up to 5 levels deep)
const prereqs = await db.getPrerequisiteChain('calculus', 3);
// Returns: arithmetic → algebra → pre-calculus → calculus

// 7. Get all learner progress
const states = await db.getLearnerKnowledgeStates('student-001');
// Returns array of all concept mastery levels for this learner
```

---

## 39 Psychometric Domains

LearnGraph models learners across **39 psychological dimensions**, organized into 12 categories:

### Personality & Traits
| Domain | Educational Relevance |
|--------|----------------------|
| **Openness** | High: seeks novel approaches, creative tasks. Low: prefers familiar methods |
| **Conscientiousness** | High: structured learning, deadlines. Low: needs flexibility, reminders |
| **Extraversion** | High: group work, discussion. Low: independent study, written communication |
| **Agreeableness** | High: collaborative, avoids conflict. Low: debate-driven, critical analysis |
| **Neuroticism** | High: needs reassurance, low-pressure environments. Low: handles challenges well |

### Emotional Intelligence
| Domain | Educational Relevance |
|--------|----------------------|
| **Empathy** | Affects peer learning, group dynamics, humanities understanding |
| **Emotional Intelligence** | Impacts self-regulation, persistence, social learning |
| **Attachment Style** | Influences relationship with instructors and mentors |

### Cognitive Style
| Domain | Educational Relevance |
|--------|----------------------|
| **Learning Styles** | Visual, auditory, kinesthetic, reading preferences |
| **Information Processing** | Analytic vs. holistic processing of new material |
| **Metacognition** | Self-awareness of learning strategies and gaps |
| **Executive Functions** | Planning, inhibition, working memory for complex tasks |

### Motivation & Growth
| Domain | Educational Relevance |
|--------|----------------------|
| **Achievement Motivation** | Drive for mastery, response to challenges |
| **Self-Efficacy** | Confidence in ability to learn and succeed |
| **Growth Mindset** | Views on ability as fixed vs. developable |
| **Locus of Control** | Internal vs. external attribution of outcomes |

*...and 23 more domains including Decision Style, Risk Tolerance, Creativity, Cultural Values, and more.*

See [Fine-Tuned-Psychometrics.md](research/Fine-Tuned-Psychometrics.md) for complete definitions.

---

## Admin UI Features

### My Profile Page (`/profile`)
The dedicated profile page displays all 39 psychometric domains organized into 8 intuitive categories:

**Data Entry Modes:**
| Mode | Description |
|------|-------------|
| **Auto-Discovery** | System infers values from user interactions and behavior |
| **Manual Entry** | User sets permanent values directly via sliders |
| **Adaptive** | User sets initial values, system adjusts based on interactions |
| **Assessment** | User takes psychological assessments to generate values |

**Domain Categories:**
- Big Five Personality (5 domains)
- Dark Triad (3 domains)
- Emotional & Social Intelligence (5 domains)
- Decision Making & Motivation (7 domains)
- Values & Wellbeing (6 domains)
- Cognitive & Learning Style (6 domains)
- Social & Cultural Context (5 domains)
- Sensory & Aesthetic Preferences (2 domains)

### Learner Management
- Create, edit, and delete learner profiles
- View and update psychometric domain scores
- Bulk psychometric profile updates
- Learning style and cognitive profile display

### Concept Management
- Add educational concepts with metadata
- Set difficulty ratings (1-10 scale)
- Assign Bloom's taxonomy levels
- Organize by domain (math, science, language, etc.)
- Set time estimates for learning

### Prerequisite Management
- Create prerequisite relationships between concepts
- Set relationship strength: `required`, `recommended`, `helpful`
- Add descriptions explaining the relationship

### Progress Tracking
- Track mastery levels (0-100%) per learner per concept
- Record current Bloom level achieved
- Log misconceptions and learning barriers
- Track confidence scores and assessment dates

### Graph Visualization
Interactive React Flow visualization with:

- **Node Colors by Mastery**:
  - 🟢 Green (≥80%): Mastered
  - 🟡 Yellow (40-79%): Partial mastery
  - 🔴 Red (<40%): Knowledge gap
  - ⚫ Gray: Not started
- **ZPD Highlighting**: Yellow border on concepts ready to learn
- **Forgotten Concepts**: Orange pulsing for concepts needing review
- **Learner Overlay**: Select any learner to see their progress
- **MiniMap**: Navigate large concept graphs
- **Pan/Zoom**: Explore complex prerequisite chains

### Functional Tests
Built-in test runner that validates:
- Data persistence across restarts
- CRUD operations for all entities
- Performance benchmarks
- Psychometric derivation functions

---

## API Reference

### Learner Operations

```typescript
// Create/Update learner profile
await db.setLearnerProfile(userId: string, profile: Partial<LearnerProfile>)

// Get learner profile
const profile = await db.getLearnerProfile(userId: string)

// List all learners
const learners = await db.listLearnerProfiles()

// Delete learner
await db.deleteLearnerProfile(userId: string)
```

### Psychometric Operations

```typescript
// Update single domain score
await db.updatePsychometricScore(userId, domain, {
  score: 0.75,        // 0-1 normalized
  confidence: 0.9,    // How confident in this score
  source: 'quiz',     // Where score came from
  timestamp: new Date().toISOString()
})

// Bulk update multiple domains
await db.updatePsychometricScores(userId, {
  openness: { score: 0.8, confidence: 0.9 },
  conscientiousness: { score: 0.7, confidence: 0.85 }
})

// Derive learning style from psychometric scores
const style = await db.computeAndStoreLearningStyle(userId)
// Returns: { primary, secondary, socialPreference, pacePreference, feedbackPreference }

// Derive cognitive profile
const cognitive = await db.computeAndStoreCognitiveProfile(userId)
// Returns: { workingMemoryCapacity, attentionSpan, processingSpeed, abstractThinkingLevel }
```

### Concept Operations

```typescript
// Add concept
await db.addConcept({
  conceptId: 'algebra',
  name: 'Algebra',
  domain: 'mathematics',
  description: 'Study of mathematical symbols and rules',
  difficulty: { overall: 4, cognitive: 4, timeEstimate: 300 },
  bloomLevels: ['remember', 'understand', 'apply', 'analyze'],
  tags: ['math', 'foundational'],
  learningObjectives: ['Solve linear equations', 'Graph functions']
})

// Get concept
const concept = await db.getConcept(conceptId: string)

// List all concepts
const concepts = await db.listConcepts()

// Search concepts
const results = await db.searchConcepts(query: string)

// Filter by domain
const mathConcepts = await db.listConceptsByDomain('mathematics')

// Filter by difficulty
const easyOnes = await db.listConceptsByDifficulty(1, 3)

// Filter by Bloom level
const advanced = await db.listConceptsByBloomLevel('analyze')
```

### Edge Operations

```typescript
// Add prerequisite edge
await db.addEdge({
  from: 'arithmetic',
  to: 'algebra',
  strength: 'required',  // 'required' | 'recommended' | 'helpful'
  description: 'Must know arithmetic before algebra'
})

// Add related edge (non-prerequisite relationship)
await db.addRelatedEdge({
  from: 'algebra',
  to: 'geometry',
  relationship: 'complementary',
  strength: 0.7
})

// Get prerequisite chain (with depth limit)
const chain = await db.getPrerequisiteChain(conceptId, maxDepth: 5)

// Get dependent chain (what requires this concept)
const dependents = await db.getDependentChain(conceptId, maxDepth: 5)
```

### Knowledge State Operations

```typescript
// Set knowledge state
await db.setKnowledgeState(userId, conceptId, {
  mastery: 85,              // 0-100
  bloomLevel: 3,            // 1-6 (Remember to Create)
  confidenceScore: 0.9,     // 0-1
  lastPracticed: new Date().toISOString(),
  lastAssessed: new Date().toISOString(),
  reviewCount: 5,
  misconceptions: []
})

// Get knowledge state
const state = await db.getKnowledgeState(userId, conceptId)

// Get all states for a learner
const allStates = await db.getLearnerKnowledgeStates(userId)

// Add misconception
await db.addMisconception(userId, conceptId, {
  description: 'Confuses multiplication order',
  severity: 'medium',
  identified: new Date().toISOString()
})
```

### Database Statistics

```typescript
const stats = await db.getStats()
// Returns: { learners: 42, concepts: 150, edges: 300, states: 2100 }
```

---

## REST API Endpoints

All endpoints are available under `/api/`:

| Endpoint | Methods | Description |
|----------|---------|-------------|
| `/api/learners` | GET, POST | List/create learners |
| `/api/learners/[userId]` | GET, PUT, DELETE | Individual learner |
| `/api/learners/[userId]/psychometrics` | PUT | Update psychometric scores |
| `/api/concepts` | GET, POST | List/create concepts |
| `/api/concepts/[conceptId]` | GET | Get concept details |
| `/api/edges` | GET, POST, DELETE | Prerequisite edges |
| `/api/states` | GET, POST, DELETE | Knowledge states |
| `/api/graph` | GET | Full graph data for visualization |
| `/api/zpd` | GET | ZPD recommendations for a learner |
| `/api/learning-path` | GET | Personalized learning path |
| `/api/gaps` | GET | Detect knowledge gaps (missing, partial, forgotten, misconceptions) |
| `/api/decay` | GET | Predict memory decay using Ebbinghaus forgetting curve |
| `/api/review-schedule` | GET | Schedule next review using SM-2 algorithm |
| `/api/review-queue` | GET | Get prioritized review queue |
| `/api/remediation` | GET | Generate remediation plan for gaps |
| `/api/status` | GET | System health check (DB, algorithms, phases) |

---

## Technology Stack

| Component | Technology | Version |
|-----------|------------|---------|
| **Database** | LevelDB (via classic-level) | 1.4.1 |
| **Framework** | Next.js (App Router) | 14.0.4 |
| **Language** | TypeScript | 5.3.2 |
| **UI Library** | React | 18.2.0 |
| **Styling** | TailwindCSS | 3.4.0 |
| **Graph Visualization** | @xyflow/react (React Flow) | 12.0.0 |
| **Forms** | react-hook-form | 7.49.2 |
| **Validation** | Zod | 3.22.4 |
| **Icons** | lucide-react | 0.294.0 |
| **Testing** | Vitest | 1.0.4 |
| **UUID** | uuid | 9.0.1 |

---

## Performance

Achieved benchmarks (Phase 1 testing):

| Operation | Target | Actual |
|-----------|--------|--------|
| Write latency | < 5ms | **0.10ms** |
| Read latency | < 2ms | **0.02ms** |
| Data persistence | 100% | **100%** |
| Test coverage | 37/37 | **37/37 passing** |
| API response | < 500ms | **< 100ms** |
| Graph render (100 nodes) | < 1s | **< 500ms** |

---

## Project Structure

```
LearnGraph/
├── README.md                           # This file
├── package.json                        # Dependencies and scripts
├── tsconfig.json                       # TypeScript configuration
├── next.config.js                      # Next.js configuration
├── tailwind.config.js                  # TailwindCSS configuration
│
├── .claude/
│   └── CLAUDE.md                       # Project memory and checklist
│
├── research/
│   ├── graph-education.md              # Full PRD with schemas/algorithms
│   ├── Fine-Tuned-Psychometrics.md     # 39 psychological domains
│   ├── phases.md                       # Build phases with tests
│   └── expert.md                       # Expert system foundations
│
├── src/
│   ├── db/
│   │   └── EducationGraphDB.ts         # Core database class (850+ lines)
│   └── models/
│       ├── types.ts                    # TypeScript interfaces (277 lines)
│       └── psychometrics.ts            # 39 domains + derivations (811 lines)
│
├── lib/
│   └── db.ts                           # Database singleton/connection
│
├── app/
│   ├── page.tsx                        # Home dashboard
│   ├── layout.tsx                      # Root layout
│   ├── globals.css                     # Global styles
│   │
│   ├── admin/
│   │   ├── learners/page.tsx           # Learner management
│   │   ├── concepts/page.tsx           # Concept management
│   │   ├── prerequisites/page.tsx      # Edge management
│   │   ├── states/page.tsx             # Progress tracking
│   │   └── psychometrics/page.tsx      # Psychometric updates
│   │
│   ├── profile/
│   │   └── page.tsx                    # 39 psychometric domains with 4 input modes
│   │
│   ├── graph/
│   │   └── page.tsx                    # Interactive visualization
│   │
│   ├── recommendations/
│   │   └── page.tsx                    # ZPD recommendations page
│   │
│   ├── gaps/
│   │   └── page.tsx                    # Knowledge gap dashboard
│   │
│   ├── status/
│   │   └── page.tsx                    # System health monitoring
│   │
│   ├── tests/
│   │   └── page.tsx                    # Functional test runner
│   │
│   └── api/
│       ├── learners/
│       │   ├── route.ts                # GET/POST learners
│       │   └── [userId]/
│       │       ├── route.ts            # GET/PUT/DELETE learner
│       │       └── psychometrics/route.ts
│       ├── concepts/
│       │   ├── route.ts
│       │   └── [conceptId]/route.ts
│       ├── edges/route.ts
│       ├── states/route.ts
│       ├── graph/route.ts
│       ├── zpd/route.ts                # ZPD recommendations
│       ├── learning-path/route.ts      # Learning path generation
│       ├── gaps/route.ts               # Gap detection
│       ├── decay/route.ts              # Memory decay prediction
│       ├── review-schedule/route.ts    # Review scheduling (SM-2)
│       ├── review-queue/route.ts       # Prioritized review queue
│       ├── remediation/route.ts        # Remediation plans
│       └── status/route.ts             # System health monitoring
│
├── components/
│   ├── AdminLayout.tsx                 # Admin panel layout
│   └── Sidebar.tsx                     # Navigation sidebar
│
├── tests/
│   └── db.test.ts                      # Database unit tests
│
└── data/
    └── education-graph/                # LevelDB data directory
```

---

## Development Phases

| Phase | Description | Status |
|-------|-------------|--------|
| **Phase 1** | Core Database Foundation | **Complete** |
| **Phase 1.5** | Admin UI & Graph Visualization | **Complete** |
| **Phase 2** | Learner Model (39 Psychometric Domains) | **Complete** |
| **Phase 3** | Knowledge Model Enhancements | **Complete** |
| **Phase 4** | ZPD Engine | **Complete** |
| **Phase 5** | Knowledge Gap Analysis & Spaced Repetition | **Complete** |
| Phase 6 | Adaptive Content Delivery | Planned |
| Phase 7 | RAG Integration with LLMs | Planned |
| Phase 8 | GNN Preparation (ML Export) | Future |

**MVP = Phases 1-5** — Delivers personalized "what to learn next" recommendations with gap analysis and spaced repetition.

See [phases.md](research/phases.md) for detailed functional tests per phase.

---

## Key Educational Concepts

### Zone of Proximal Development (ZPD)

Based on Vygotsky's educational psychology framework:

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                  │
│    ┌───────────────────────────────────────────────────────┐    │
│    │                                                       │    │
│    │    ┌─────────────────────────────────────────────┐   │    │
│    │    │                                             │   │    │
│    │    │     CURRENT KNOWLEDGE                       │   │    │
│    │    │     (Can do independently)                  │   │    │
│    │    │                                             │   │    │
│    │    └─────────────────────────────────────────────┘   │    │
│    │                                                       │    │
│    │         ZONE OF PROXIMAL DEVELOPMENT                 │    │
│    │         (Can do with scaffolding) ← TARGET HERE      │    │
│    │                                                       │    │
│    └───────────────────────────────────────────────────────┘    │
│                                                                  │
│              BEYOND REACH (Too advanced)                         │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Bloom's Taxonomy

Each concept tracks objectives at 6 cognitive levels:

1. **Remember** — Recall facts and basic concepts
2. **Understand** — Explain ideas or concepts
3. **Apply** — Use information in new situations
4. **Analyze** — Draw connections among ideas
5. **Evaluate** — Justify decisions
6. **Create** — Produce new or original work

### Spaced Repetition

Based on the **Ebbinghaus forgetting curve** and **SM-2 algorithm** — optimal review scheduling to maximize retention with minimum effort.

**Implementation includes:**
- **Memory decay prediction**: `R = e^(-t/S)` where R is retention, t is time since review, S is stability factor
- **Adaptive stability**: Stability increases with review count, mastery level, and decreases with concept difficulty
- **Priority-based scheduling**: Reviews categorized as urgent, normal, or low priority
- **Optimal review windows**: Calculated timing to maximize long-term retention

### Knowledge Gap Analysis

Automatically detects and categorizes learning gaps:

| Gap Type | Detection Method | Remediation |
|----------|------------------|-------------|
| **Missing** | Concept has no knowledge state | Learn from scratch with scaffolding |
| **Partial** | Mastery < 80% threshold | Targeted practice and reinforcement |
| **Forgotten** | Predicted retention < 50% | Spaced review with repetition |
| **Misconceptions** | Unresolved misconceptions list | Corrective instruction first |

**API Endpoints:**
- `/api/gaps` — Detect all gap types for a learner
- `/api/decay` — Predict memory retention for a concept
- `/api/review-schedule` — Get optimal next review time
- `/api/review-queue` — Prioritized list of concepts to review
- `/api/remediation` — Generate step-by-step remediation plan

---

## Dependencies & Inputs

### Is a Fine-Tuned Model Required?

**NO.** LearnGraph works independently:

| System | Purpose | Required? |
|--------|---------|-----------|
| **LearnGraph** | Stores profiles + knowledge graph | **Yes (this project)** |
| Fine-Tuned Model | Analyzes text → infers personality | Optional |

### Ways to Get Psychometric Data

1. **Fine-tuned model** — Analyze user's writing to infer traits
2. **Traditional assessments** — Big Five quiz, learning style inventory
3. **Import from other systems** — LMS, CRM, assessment platforms
4. **Defaults + behavioral learning** — Start with defaults, refine over time
5. **User self-report** — "I'm a visual learner"

### Minimum Required Inputs

| Input | Required? | Notes |
|-------|-----------|-------|
| User ID | **Yes** | Need to identify learners |
| Concepts | **Yes** | Need content in knowledge graph |
| Prerequisites | **Yes** | Core value - what comes before what |
| Psychometric scores | No | Works with defaults, better with data |
| Learning history | No | Builds over time |

---

## Testing

```bash
# Run unit tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Use the in-app functional test runner
# Navigate to http://localhost:3000/tests
```

---

## Educational Psychology References

1. **Vygotsky, L.S. (1978)** — Mind in Society: Zone of Proximal Development
2. **Bloom, B.S. (1956)** — Taxonomy of Educational Objectives
3. **Ebbinghaus, H. (1885)** — Memory: Forgetting Curve
4. **Bruner, J.S. (1966)** — Scaffolding Theory
5. **Kolb, D.A. (1984)** — Experiential Learning
6. **Gardner, H. (1983)** — Multiple Intelligences
7. **Dweck, C.S. (2006)** — Growth Mindset
8. **Mayer, R.E. (2009)** — Multimedia Learning Principles
9. **Bandura, A. (1977)** — Self-Efficacy Theory
10. **Costa, P.T. & McCrae, R.R. (1992)** — Big Five Personality Model

---

## Success Metrics

| Metric | Target | Status |
|--------|--------|--------|
| Write latency | < 5ms | **Achieved (0.1ms)** |
| Read latency | < 2ms | **Achieved (0.02ms)** |
| Profile retrieval | < 10ms | **Achieved** |
| Graph traversal (depth 5) | < 100ms | **Achieved** |
| Test coverage | 100% | **37/37 passing** |
| Gap detection accuracy | 90% | **Achieved** |
| Retention rate | 85% at review time | **Implemented (SM-2)** |
| Learning efficiency | +30% time to mastery | Pending (Phase 7) |
| Personalization satisfaction | 75% | Pending (Phase 7) |

---

## Contributing

Contributions are welcome! Please:

1. Check the [CLAUDE.md](.claude/CLAUDE.md) for current progress and checklist
2. Review [phases.md](research/phases.md) for what's being built
3. Ensure tests pass before submitting PRs
4. Follow the existing code patterns

---

## License

MIT License - See LICENSE file for details.

---

## Acknowledgments

This project is built on decades of educational psychology research and modern software engineering practices. Special thanks to the researchers whose work forms the theoretical foundation of this system.
