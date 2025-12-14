# LearnGraph Comprehensive Test Plan

This document defines all technical tests, user journey tests, and metrics for the LearnGraph adaptive education system.

---

## Table of Contents

1. [Quick Validation Tests](#quick-validation-tests) ⭐ **START HERE**
2. [Technical Tests](#technical-tests)
   - [API Endpoint Tests](#api-endpoint-tests)
   - [Database Tests](#database-tests)
   - [Algorithm Tests](#algorithm-tests)
3. [User Journey Tests](#user-journey-tests)
4. [Status Page Requirements](#status-page-requirements)
5. [Metrics & Success Criteria](#metrics--success-criteria)

---

## Quick Validation Tests

**Purpose**: These 5-minute tests prove the system actually works. Run these first to confirm core functionality before diving into comprehensive testing.

---

### QV-01: Profile Creation & Storage (2 min)

**Proves**: System can create and persist learner profiles with psychometric data.

| Step | Action | What to Check |
|------|--------|---------------|
| 1 | Go to `/admin/learners` | Page loads |
| 2 | Click "Add Learner", enter name "Test User" | Form works |
| 3 | Save the learner | Success message, learner appears in list |
| 4 | Go to `/admin/psychometrics` | Page loads |
| 5 | Select "Test User" from dropdown | Profile loads (may show defaults) |
| 6 | Change "Openness" slider to 85% | Slider moves |
| 7 | Change "Test Anxiety" slider to 30% | Slider moves |
| 8 | Click Save | Success message |
| 9 | Refresh the page, re-select "Test User" | Values still show 85% and 30% |

✅ **PASS**: Values persist after refresh
❌ **FAIL**: Values reset or don't save

---

### QV-02: Psychometric Impact on Recommendations (3 min)

**Proves**: System uses psychometric profile to personalize recommendations.

| Step | Action | What to Check |
|------|--------|---------------|
| 1 | Go to `/profile` (or `/admin/psychometrics`) | Page loads |
| 2 | Select your test learner | Profile loads |
| 3 | Set "Test Anxiety" to **90%** (high) | Saved |
| 4 | Set "Risk Tolerance" to **20%** (low) | Saved |
| 5 | Go to `/recommendations` | Page loads |
| 6 | Select same learner | ZPD computed |
| 7 | Note the recommended concepts | Record them |
| 8 | Go back to psychometrics | Change anxiety to **10%**, risk to **80%** |
| 9 | Return to `/recommendations` | Recompute ZPD |
| 10 | Compare recommendations | Should be DIFFERENT |

✅ **PASS**: High-anxiety learner gets easier/safer recommendations; low-anxiety gets more challenging
❌ **FAIL**: Recommendations are identical regardless of psychometrics

**Expected Behavior**:
- High anxiety → System recommends lower difficulty, smaller steps
- Low anxiety + high risk tolerance → System recommends more challenging concepts
- Scaffolding strategies should change based on profile

---

### QV-03: Learning Style Recognition (2 min)

**Proves**: System identifies and responds to learning style preferences.

| Step | Action | What to Check |
|------|--------|---------------|
| 1 | Go to `/admin/psychometrics` | Select your test learner |
| 2 | Set "Learning Styles" with visual preference high | Save |
| 3 | Go to `/recommendations` | Select learner |
| 4 | View "Scaffolding Strategies" section | Should recommend visual aids, diagrams |
| 5 | Go back, change to kinesthetic/hands-on preference | Save |
| 6 | Return to `/recommendations` | Scaffolding should now recommend activities, practice |

✅ **PASS**: Scaffolding strategies change based on learning style
❌ **FAIL**: Same strategies regardless of style

---

### QV-04: Knowledge Gap Detection (3 min)

**Proves**: System detects missing prerequisites and forgotten knowledge.

| Step | Action | What to Check |
|------|--------|---------------|
| 1 | Go to `/admin/states` | Page loads |
| 2 | Select your test learner | States list loads |
| 3 | Set "algebra" mastery to **90%** | Save |
| 4 | Set "arithmetic" mastery to **0%** (or don't set it) | This is a prerequisite! |
| 5 | Go to `/gaps` | Select learner |
| 6 | View "Missing Prerequisites" section | Should show "arithmetic" as a gap |
| 7 | Now set "arithmetic" to 90%, but set last review to 30 days ago | |
| 8 | Refresh `/gaps` | Should show "arithmetic" as "forgotten" |

✅ **PASS**: System identifies missing prereqs AND forgotten knowledge
❌ **FAIL**: No gaps detected despite obvious issues

---

### QV-05: Full Profile Round-Trip (5 min)

**Proves**: Complete psychometric profile with all 39 domains works end-to-end.

| Step | Action | What to Check |
|------|--------|---------------|
| 1 | Go to `/profile` | Page loads with 4 options |
| 2 | Select "Manual Entry" (Option B) | Form shows all 39 domains |
| 3 | Set values for at least 10 different domains across categories | Sliders work |
| 4 | Save profile | Success message |
| 5 | Go to `/recommendations` | Get personalized recommendations |
| 6 | Go to `/gaps` | Gap analysis uses your profile |
| 7 | Return to `/profile` | All 39 domains show your saved values |
| 8 | Export/view raw data | Should see all domain IDs with scores |

✅ **PASS**: All 39 domains stored, retrieved, and used in algorithms
❌ **FAIL**: Missing domains, values not persisted, or not used in recommendations

---

### QV-06: Personalization Proof (The "Different Users, Different Results" Test)

**Proves**: Two different psychometric profiles produce genuinely different outputs.

**Setup**: Create two learners with opposite profiles

| Learner A: "Anxious Visual Learner" | Learner B: "Confident Analytical Learner" |
|-------------------------------------|-------------------------------------------|
| Test Anxiety: 90% | Test Anxiety: 10% |
| Openness: 30% | Openness: 90% |
| Learning Style: Visual | Learning Style: Reading/Writing |
| Grit: 30% | Grit: 90% |
| Risk Tolerance: 20% | Risk Tolerance: 80% |
| Self-Efficacy: 25% | Self-Efficacy: 90% |

| Step | Action | Expected Difference |
|------|--------|---------------------|
| 1 | Set identical knowledge states for both | Same mastery levels |
| 2 | Get ZPD for Learner A | More concepts in "Too Hard", smaller ZPD |
| 3 | Get ZPD for Learner B | Larger ZPD, more challenging recommendations |
| 4 | View scaffolding for A | Visual aids, chunking, encouragement |
| 5 | View scaffolding for B | Complex explanations, independent study |
| 6 | Check learning path for A | Smaller steps, more reviews scheduled |
| 7 | Check learning path for B | Larger leaps, fewer reviews |

✅ **PASS**: Clear, measurable differences in all outputs
❌ **FAIL**: Both learners get identical recommendations

---

### Quick Validation Summary Checklist

Run these before any deployment or demo:

- [ ] **QV-01**: Profile persists after refresh
- [ ] **QV-02**: Psychometrics change recommendations
- [ ] **QV-03**: Learning style affects scaffolding
- [ ] **QV-04**: Gap detection finds missing/forgotten knowledge
- [ ] **QV-05**: All 39 domains work end-to-end
- [ ] **QV-06**: Different profiles = different results

**All 6 pass?** System is working. Proceed to comprehensive tests.
**Any fail?** Debug that specific area before continuing.

---

## Technical Tests

### API Endpoint Tests

All 17 API endpoints must be tested for proper functionality.

#### Learner Management APIs

| Test ID | Endpoint | Method | Test Description | Expected Result |
|---------|----------|--------|------------------|-----------------|
| API-L01 | `/api/learners` | GET | Fetch all learners | 200 OK, array of learners |
| API-L02 | `/api/learners` | POST | Create new learner | 201 Created, learner object |
| API-L03 | `/api/learners/[userId]` | GET | Get specific learner | 200 OK, learner object |
| API-L04 | `/api/learners/[userId]` | PUT | Update learner | 200 OK, updated object |
| API-L05 | `/api/learners/[userId]` | DELETE | Delete learner | 200 OK, success message |
| API-L06 | `/api/learners/[userId]/psychometrics` | GET | Get psychometrics | 200 OK, 39 domain scores |
| API-L07 | `/api/learners/[userId]/psychometrics` | PUT | Update psychometrics | 200 OK, updated scores |

#### Concept Management APIs

| Test ID | Endpoint | Method | Test Description | Expected Result |
|---------|----------|--------|------------------|-----------------|
| API-C01 | `/api/concepts` | GET | Fetch all concepts | 200 OK, array of concepts |
| API-C02 | `/api/concepts` | POST | Create new concept | 201 Created, concept object |
| API-C03 | `/api/concepts/[conceptId]` | GET | Get specific concept | 200 OK, concept object |
| API-C04 | `/api/concepts/[conceptId]` | PUT | Update concept | 200 OK, updated object |
| API-C05 | `/api/concepts/[conceptId]` | DELETE | Delete concept | 200 OK, success message |
| API-C06 | `/api/concepts/[conceptId]/prerequisites` | GET | Get prerequisites | 200 OK, array of concepts |
| API-C07 | `/api/concepts/[conceptId]/dependents` | GET | Get dependents | 200 OK, array of concepts |

#### Graph & Edge APIs

| Test ID | Endpoint | Method | Test Description | Expected Result |
|---------|----------|--------|------------------|-----------------|
| API-G01 | `/api/graph` | GET | Get full graph | 200 OK, nodes + edges |
| API-E01 | `/api/edges` | GET | Get all edges | 200 OK, array of edges |
| API-E02 | `/api/edges` | POST | Create edge | 201 Created, edge object |
| API-E03 | `/api/edges` | DELETE | Delete edge | 200 OK, success message |

#### Knowledge State APIs

| Test ID | Endpoint | Method | Test Description | Expected Result |
|---------|----------|--------|------------------|-----------------|
| API-S01 | `/api/states` | GET | Get states for learner | 200 OK, array of states |
| API-S02 | `/api/states` | POST | Create/update state | 200 OK, state object |
| API-S03 | `/api/states` | DELETE | Delete state | 200 OK, success message |

#### ZPD & Learning Path APIs

| Test ID | Endpoint | Method | Test Description | Expected Result |
|---------|----------|--------|------------------|-----------------|
| API-Z01 | `/api/zpd` | GET | Compute ZPD | 200 OK, zones object |
| API-Z02 | `/api/zpd` | GET | ZPD with psychometrics | 200 OK, adjusted zones |
| API-LP01 | `/api/learning-path` | GET | Generate learning path | 200 OK, path array |

#### Gap Analysis APIs (Phase 5)

| Test ID | Endpoint | Method | Test Description | Expected Result |
|---------|----------|--------|------------------|-----------------|
| API-GA01 | `/api/gaps` | GET | Detect knowledge gaps | 200 OK, gaps array |
| API-D01 | `/api/decay` | GET | Calculate memory decay | 200 OK, decay data |
| API-R01 | `/api/remediation` | GET | Get remediation plan | 200 OK, plan object |
| API-RQ01 | `/api/review-queue` | GET | Get review queue | 200 OK, prioritized queue |
| API-RS01 | `/api/review-schedule` | GET | Get review schedule | 200 OK, schedule object |

---

### Database Tests

Tests for the core `EducationGraphDB` class in `/lib/db/EducationGraphDB.ts`.

| Test ID | Operation | Test Description | Expected Result |
|---------|-----------|------------------|-----------------|
| DB-01 | Connection | Database initializes | Connection established |
| DB-02 | Write | Create record < 5ms | Performance pass |
| DB-03 | Read | Read record < 2ms | Performance pass |
| DB-04 | Persistence | Data survives restart | Data intact |
| DB-05 | Batch | Batch operations work | All operations complete |
| DB-06 | Index | Index lookups fast | < 10ms response |
| DB-07 | Transaction | Rollback on error | No partial writes |

#### Graph Operations

| Test ID | Operation | Test Description | Expected Result |
|---------|-----------|------------------|-----------------|
| DB-G01 | `addConcept()` | Add concept node | Node stored with ID |
| DB-G02 | `getConcept()` | Retrieve concept | Correct data returned |
| DB-G03 | `addEdge()` | Create prerequisite | Edge connects nodes |
| DB-G04 | `getPrerequisites()` | Traverse prerequisites | Returns ancestor chain |
| DB-G05 | `getDependents()` | Traverse dependents | Returns descendant chain |
| DB-G06 | `deleteConcept()` | Remove concept | Node + edges removed |
| DB-G07 | Orphan check | No orphan edges | All edges valid |

#### Learner Operations

| Test ID | Operation | Test Description | Expected Result |
|---------|-----------|------------------|-----------------|
| DB-L01 | `setLearnerProfile()` | Create learner | Profile stored |
| DB-L02 | `getLearnerProfile()` | Retrieve learner | Full profile returned |
| DB-L03 | `updatePsychometrics()` | Update domains | 39 domains updated |
| DB-L04 | `setKnowledgeState()` | Set mastery | State with timestamp |
| DB-L05 | `getKnowledgeStates()` | Get all states | Array of states |
| DB-L06 | `deleteLearner()` | Remove learner | Profile + states removed |

---

### Algorithm Tests

Tests for core educational algorithms.

#### ZPD Computation (`computeZPD()`)

| Test ID | Scenario | Test Description | Expected Result |
|---------|----------|------------------|-----------------|
| ALG-Z01 | Empty state | No knowledge | All concepts in "too_hard" |
| ALG-Z02 | Full mastery | All mastered | All concepts in "mastered" |
| ALG-Z03 | Partial | Some mastered | Correct zone partitioning |
| ALG-Z04 | Prerequisites | Unmet prereqs | Blocked from ZPD |
| ALG-Z05 | Performance | 100 concepts | < 200ms |

#### Psychometric Adjustments (`adjustForPsychometrics()`)

| Test ID | Scenario | Test Description | Expected Result |
|---------|----------|------------------|-----------------|
| ALG-P01 | High anxiety | Anxiety > 0.7 | Difficulty reduced |
| ALG-P02 | Visual learner | Visual = primary | Visual content preferred |
| ALG-P03 | Low confidence | Confidence < 0.3 | Easier starting point |
| ALG-P04 | Growth mindset | Growth > 0.7 | Challenge increased |

#### Scaffolding Selection (`selectScaffoldingStrategies()`)

| Test ID | Profile | Test Description | Expected Result |
|---------|---------|------------------|-----------------|
| ALG-S01 | Visual | Visual learner | Diagrams recommended |
| ALG-S02 | Kinesthetic | Hands-on | Activities recommended |
| ALG-S03 | High anxiety | Test anxiety | Chunking recommended |
| ALG-S04 | Low grit | Low persistence | Gamification recommended |

#### Forgetting Curve (`predictDecay()`)

| Test ID | Scenario | Test Description | Expected Result |
|---------|----------|------------------|-----------------|
| ALG-F01 | Fresh | Just learned | R > 0.9 |
| ALG-F02 | 1 day | After 24 hours | R ~ 0.5-0.7 |
| ALG-F03 | 7 days | After 1 week | R ~ 0.2-0.4 |
| ALG-F04 | Stability | High reviews | Slower decay |

#### Spaced Repetition (`scheduleNextReview()`)

| Test ID | Scenario | Test Description | Expected Result |
|---------|----------|------------------|-----------------|
| ALG-SR01 | First review | New item | Review in 1 day |
| ALG-SR02 | Success | Quality 5 | Interval increases |
| ALG-SR03 | Failure | Quality 0-2 | Interval resets |
| ALG-SR04 | SM-2 | Multiple reviews | Correct EF adjustment |

#### Gap Detection

| Test ID | Gap Type | Test Description | Expected Result |
|---------|----------|------------------|-----------------|
| ALG-GD01 | Missing | Prereq not started | Gap type = "missing" |
| ALG-GD02 | Partial | Mastery < 70% | Gap type = "partial" |
| ALG-GD03 | Forgotten | Low retention | Gap type = "forgotten" |
| ALG-GD04 | Misconception | Error patterns | Gap type = "misconception" |

---

## User Journey Tests

Step-by-step UI interaction tests for each page.

### UJ-01: Dashboard Overview (`/`)

**Objective**: Verify dashboard displays system overview.

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Navigate to `/` | Dashboard loads |
| 2 | View stats cards | Shows learner count, concept count |
| 3 | View recent activity | Shows recent changes |
| 4 | Click sidebar nav | Navigates to correct page |

---

### UJ-02: Learner Management (`/admin/learners`)

**Objective**: Complete CRUD operations on learners.

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Navigate to `/admin/learners` | Page loads with learner list |
| 2 | Click "Add Learner" | Form appears |
| 3 | Fill name and email | Inputs accept text |
| 4 | Click "Save" | New learner appears in list |
| 5 | Click learner row | Details panel shows |
| 6 | Edit learner name | Save updates the list |
| 7 | Click "Delete" | Confirmation dialog appears |
| 8 | Confirm delete | Learner removed from list |

---

### UJ-03: Psychometrics Management (`/admin/psychometrics`)

**Objective**: View and update learner psychometric profiles.

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Navigate to `/admin/psychometrics` | Page loads |
| 2 | Select learner | Psychometric profile loads |
| 3 | View 39 domains | All domains displayed |
| 4 | Adjust slider | Value updates |
| 5 | Click "Save" | Profile saved |
| 6 | Refresh page | Changes persisted |

---

### UJ-04: Concept Management (`/admin/concepts`)

**Objective**: Complete CRUD operations on concepts.

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Navigate to `/admin/concepts` | Page loads with concept list |
| 2 | Click "Add Concept" | Form appears |
| 3 | Fill ID, name, difficulty | Inputs accept values |
| 4 | Click "Save" | New concept in list |
| 5 | Click concept row | Details panel shows |
| 6 | Edit difficulty | Save updates list |
| 7 | Delete concept | Removed from list |

---

### UJ-05: Prerequisites Management (`/admin/prerequisites`)

**Objective**: Create and manage prerequisite relationships.

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Navigate to `/admin/prerequisites` | Page loads |
| 2 | Select "from" concept | Dropdown works |
| 3 | Select "to" concept | Dropdown works |
| 4 | Click "Add Edge" | Edge created |
| 5 | View edge list | New edge visible |
| 6 | Delete edge | Edge removed |

---

### UJ-06: Knowledge States (`/admin/states`)

**Objective**: Track learner progress on concepts.

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Navigate to `/admin/states` | Page loads |
| 2 | Select learner | State list loads |
| 3 | Select concept | Mastery form shows |
| 4 | Set mastery to 85% | Slider updates |
| 5 | Click "Save" | State saved |
| 6 | View state list | Shows 85% mastery |

---

### UJ-07: Graph Visualization (`/graph`)

**Objective**: Explore knowledge graph visually.

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Navigate to `/graph` | Graph renders |
| 2 | See nodes | All concepts visible |
| 3 | See edges | Prerequisites connected |
| 4 | Click node | Node info shows |
| 5 | Drag node | Node repositions |
| 6 | Zoom in/out | Graph scales |
| 7 | Select learner | Mastery overlay appears |
| 8 | Colors update | Mastered = green, Learning = yellow |

---

### UJ-08: Recommendations (`/recommendations`)

**Objective**: Get personalized learning recommendations.

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Navigate to `/recommendations` | Page loads |
| 2 | Select learner | Recommendations generate |
| 3 | View ZPD zones | Three zones displayed |
| 4 | View "Too Easy" | Mastered concepts listed |
| 5 | View "ZPD" | Ready-to-learn concepts |
| 6 | View "Too Hard" | Blocked concepts |
| 7 | Click "Start Learning" | Learning path shows |
| 8 | View scaffolding | Strategies listed |

---

### UJ-09: Gap Analysis (`/gaps`)

**Objective**: Identify and address knowledge gaps.

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Navigate to `/gaps` | Page loads |
| 2 | Select learner | Gap analysis runs |
| 3 | View gap cards | Gaps categorized by type |
| 4 | View "Missing" gaps | Unstarted prereqs listed |
| 5 | View "Forgotten" gaps | Decayed concepts listed |
| 6 | Click gap card | Remediation plan shows |
| 7 | View review queue | Prioritized list |
| 8 | View schedule | Next review dates |

---

### UJ-10: Educational Psychology Reference (`/edu-psychology`)

**Objective**: Learn about psychometric domains.

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Navigate to `/edu-psychology` | Page loads |
| 2 | View categories | 12 categories displayed |
| 3 | Expand category | Domains listed |
| 4 | View domain card | Name, description, markers |
| 5 | See 39 domains total | Count matches |
| 6 | View educational relevance | For each domain |

---

### UJ-11: Functional Tests (`/tests`)

**Objective**: Run and verify all system tests.

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Navigate to `/tests` | Page loads |
| 2 | View test phases | 7 phases listed |
| 3 | Click "Run All" | Tests execute |
| 4 | View progress | Progress bar updates |
| 5 | View results | Pass/fail for each test |
| 6 | All tests pass | Green checkmarks |
| 7 | View cleanup | Test data removed |

---

### UJ-12: Complete User Flow

**Objective**: End-to-end journey from setup to recommendations.

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Create new learner | Learner saved |
| 2 | Set psychometric profile | 39 domains set |
| 3 | View concepts | Graph displays |
| 4 | Set initial mastery | States saved |
| 5 | Get ZPD recommendations | Personalized list |
| 6 | Complete a concept | Mastery increases |
| 7 | Check gap analysis | Gaps updated |
| 8 | View review schedule | Schedule generated |

---

## Status Page Requirements

A new `/status` page should provide at-a-glance system health.

### Component Status Indicators

| Component | Status Check | Indicator |
|-----------|--------------|-----------|
| Database | Connection test | 🟢 Green / 🔴 Red |
| API Server | Health endpoint | 🟢 Green / 🔴 Red |
| Graph Data | Node count > 0 | 🟢 Green / 🟡 Yellow / 🔴 Red |
| Learners | Learner count | 🟢 Green / 🟡 Yellow |
| ZPD Engine | Test computation | 🟢 Green / 🔴 Red |
| Gap Analysis | Test detection | 🟢 Green / 🔴 Red |
| Spaced Repetition | SM-2 test | 🟢 Green / 🔴 Red |

### Status Page Sections

```
┌─────────────────────────────────────────┐
│           LearnGraph Status             │
├─────────────────────────────────────────┤
│ Overall Health: 🟢 All Systems Online   │
├─────────────────────────────────────────┤
│ Core Services                           │
│   Database:        🟢 Connected         │
│   API Server:      🟢 Running           │
│   Response Time:   12ms                 │
├─────────────────────────────────────────┤
│ Data Status                             │
│   Concepts:        47 nodes             │
│   Edges:           68 prerequisites     │
│   Learners:        12 profiles          │
│   Knowledge States: 234 records         │
├─────────────────────────────────────────┤
│ Algorithm Health                        │
│   ZPD Computation:   🟢 Operational     │
│   Gap Detection:     🟢 Operational     │
│   Memory Decay:      🟢 Operational     │
│   Spaced Repetition: 🟢 Operational     │
├─────────────────────────────────────────┤
│ Recent Activity                         │
│   Last API call:    2 seconds ago       │
│   Last test run:    Today 10:30 AM      │
│   Errors (24h):     0                   │
└─────────────────────────────────────────┘
```

### Status API Endpoint

New endpoint: `GET /api/status`

Response:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00Z",
  "services": {
    "database": { "status": "up", "latency": 2 },
    "api": { "status": "up", "latency": 12 }
  },
  "data": {
    "concepts": 47,
    "edges": 68,
    "learners": 12,
    "states": 234
  },
  "algorithms": {
    "zpd": { "status": "operational", "lastTest": "2024-01-15T10:00:00Z" },
    "gaps": { "status": "operational", "lastTest": "2024-01-15T10:00:00Z" },
    "decay": { "status": "operational", "lastTest": "2024-01-15T10:00:00Z" },
    "spacedRepetition": { "status": "operational", "lastTest": "2024-01-15T10:00:00Z" }
  },
  "errors": {
    "count24h": 0,
    "lastError": null
  }
}
```

---

## Metrics & Success Criteria

### Technical Test Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| API Success Rate | 100% | All endpoints return expected status |
| API Response Time | < 100ms | P95 latency |
| Database Read | < 2ms | Average read operation |
| Database Write | < 5ms | Average write operation |
| Graph Traversal | < 100ms | Depth-5 traversal |
| ZPD Computation | < 200ms | Full computation |
| Test Pass Rate | 100% | All tests pass |

### Algorithm Accuracy Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| ZPD Classification | 90% | Concepts in correct zone |
| Gap Detection | 90% | True positive rate |
| Forgotten Detection | 85% | Based on decay formula |
| Recommendation Relevance | 75% | User feedback score |
| Retention at Review | 85% | Post-review mastery |

### User Journey Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Page Load Time | < 2s | All pages |
| Form Submission | < 500ms | Create/update operations |
| Graph Render | < 1s | 100 nodes |
| Journey Completion | 100% | All steps completable |
| Error Rate | 0% | No unexpected errors |

### Data Integrity Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Orphan Edges | 0 | Edges without valid nodes |
| Missing Profiles | 0 | States without learners |
| Data Persistence | 100% | Survives restart |
| 39 Domains | 100% | All domains present |

### Phase Completion Criteria

| Phase | Pass Criteria |
|-------|---------------|
| Phase 1 | Write < 5ms, Read < 2ms, Data persists |
| Phase 1.5 | Forms < 500ms, Graph renders 100 nodes < 1s |
| Phase 2 | 39/39 domains, Profile retrieval < 10ms |
| Phase 3 | Traversal depth-5 < 100ms, No orphans |
| Phase 4 | ZPD < 200ms, 75% accuracy |
| Phase 5 | 90% gap detection, 85% retention |
| Overall | All phases pass, Status page green |

---

## Test Execution Checklist

### Pre-Test Setup

- [ ] Database initialized
- [ ] Test data seeded (or empty state confirmed)
- [ ] Dev server running
- [ ] All dependencies installed

### Technical Tests

- [ ] API-L01 through API-L07 (Learner APIs)
- [ ] API-C01 through API-C07 (Concept APIs)
- [ ] API-G01, API-E01 through API-E03 (Graph/Edge APIs)
- [ ] API-S01 through API-S03 (State APIs)
- [ ] API-Z01 through API-LP01 (ZPD/Learning Path APIs)
- [ ] API-GA01 through API-RS01 (Gap Analysis APIs)
- [ ] DB-01 through DB-07 (Database tests)
- [ ] DB-G01 through DB-G07 (Graph operations)
- [ ] DB-L01 through DB-L06 (Learner operations)
- [ ] ALG-Z01 through ALG-Z05 (ZPD algorithm)
- [ ] ALG-P01 through ALG-P04 (Psychometric adjustments)
- [ ] ALG-S01 through ALG-S04 (Scaffolding)
- [ ] ALG-F01 through ALG-F04 (Forgetting curve)
- [ ] ALG-SR01 through ALG-SR04 (Spaced repetition)
- [ ] ALG-GD01 through ALG-GD04 (Gap detection)

### User Journey Tests

- [ ] UJ-01: Dashboard
- [ ] UJ-02: Learner Management
- [ ] UJ-03: Psychometrics
- [ ] UJ-04: Concept Management
- [ ] UJ-05: Prerequisites
- [ ] UJ-06: Knowledge States
- [ ] UJ-07: Graph Visualization
- [ ] UJ-08: Recommendations
- [ ] UJ-09: Gap Analysis
- [ ] UJ-10: Educational Psychology
- [ ] UJ-11: Functional Tests
- [ ] UJ-12: Complete User Flow

### Post-Test Verification

- [ ] All technical tests pass
- [ ] All user journeys complete
- [ ] Status page shows all green
- [ ] Test data cleaned up
- [ ] Metrics within targets

---

## Appendix: Test Data Requirements

### Minimum Test Dataset

| Entity | Count | Purpose |
|--------|-------|---------|
| Learners | 3 | Different psychometric profiles |
| Concepts | 10 | Varied difficulty levels |
| Prerequisites | 15 | Complete dependency graph |
| Knowledge States | 20 | Various mastery levels |

### Test Learner Profiles

1. **Beginner Visual Learner**: Low mastery, visual preference, moderate anxiety
2. **Advanced Analytical Learner**: High mastery, reading preference, low anxiety
3. **Struggling Learner**: Mixed mastery, kinesthetic preference, high anxiety

### Test Concept Graph

```
arithmetic (1) ──► algebra (3) ──► calculus (5)
                      │
                      ├──► geometry (3)
                      │
                      └──► statistics (4)
```

---

*Document Version: 1.0*
*Last Updated: December 2024*
*Covers Phases 1-5 of LearnGraph Development*
