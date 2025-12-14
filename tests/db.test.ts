/**
 * Phase 1 Functional Tests: Core Database Foundation
 *
 * Pass Criteria:
 * - Write < 5ms
 * - Read < 2ms
 * - Data survives restart
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { EducationGraphDB } from '../src/db/EducationGraphDB.js';
import { LearnerProfile, ConceptNode, KnowledgeState } from '../src/models/types.js';
import * as fs from 'fs';
import * as path from 'path';

const TEST_DB_PATH = './data/test-db';

// Helper to clean up test database
function cleanTestDB() {
  if (fs.existsSync(TEST_DB_PATH)) {
    fs.rmSync(TEST_DB_PATH, { recursive: true, force: true });
  }
}

describe('Phase 1: Core Database Foundation', () => {
  let db: EducationGraphDB;

  beforeEach(async () => {
    cleanTestDB();
    db = new EducationGraphDB(TEST_DB_PATH);
    await db.open();
  });

  afterEach(async () => {
    await db.close();
    cleanTestDB();
  });

  // ===========================================================================
  // FUNCTIONAL TEST: Create learner → restart app → learner persists
  // ===========================================================================
  describe('Data Persistence', () => {
    it('should persist learner data across database restarts', async () => {
      // 1. Create a learner
      const learner = await db.setLearnerProfile('user-123', {
        name: 'Test User',
        email: 'test@example.com',
      });

      expect(learner.userId).toBe('user-123');
      expect(learner.name).toBe('Test User');

      // 2. Close the database (simulate app restart)
      await db.close();

      // 3. Reopen the database
      const db2 = new EducationGraphDB(TEST_DB_PATH);
      await db2.open();

      // 4. Verify learner persists
      const retrieved = await db2.getLearnerProfile('user-123');
      expect(retrieved).not.toBeNull();
      expect(retrieved?.userId).toBe('user-123');
      expect(retrieved?.name).toBe('Test User');
      expect(retrieved?.email).toBe('test@example.com');

      await db2.close();
    });

    it('should persist concepts across restarts', async () => {
      await db.addConcept({
        conceptId: 'algebra',
        name: 'Algebra',
        domain: 'mathematics',
        description: 'Basic algebra concepts',
        difficulty: { absolute: 4, cognitiveLoad: 0.5, abstractness: 0.6 },
      });

      await db.close();

      const db2 = new EducationGraphDB(TEST_DB_PATH);
      await db2.open();

      const concept = await db2.getConcept('algebra');
      expect(concept).not.toBeNull();
      expect(concept?.name).toBe('Algebra');
      expect(concept?.domain).toBe('mathematics');

      await db2.close();
    });

    it('should persist edges across restarts', async () => {
      await db.addConcept({ conceptId: 'arithmetic', name: 'Arithmetic', domain: 'math', description: 'Basic math' });
      await db.addConcept({ conceptId: 'algebra', name: 'Algebra', domain: 'math', description: 'Algebra' });
      await db.addEdge({ from: 'arithmetic', to: 'algebra', strength: 'required' });

      await db.close();

      const db2 = new EducationGraphDB(TEST_DB_PATH);
      await db2.open();

      const edge = await db2.getEdge('arithmetic', 'algebra');
      expect(edge).not.toBeNull();
      expect(edge?.from).toBe('arithmetic');
      expect(edge?.to).toBe('algebra');
      expect(edge?.strength).toBe('required');

      await db2.close();
    });

    it('should persist knowledge states across restarts', async () => {
      await db.setLearnerProfile('user-1', { name: 'Test' });
      await db.addConcept({ conceptId: 'calc', name: 'Calculus', domain: 'math', description: 'Calc' });
      await db.setKnowledgeState('user-1', 'calc', { mastery: 75, bloomLevel: 3 });

      await db.close();

      const db2 = new EducationGraphDB(TEST_DB_PATH);
      await db2.open();

      const state = await db2.getKnowledgeState('user-1', 'calc');
      expect(state).not.toBeNull();
      expect(state?.mastery).toBe(75);
      expect(state?.bloomLevel).toBe(3);

      await db2.close();
    });
  });

  // ===========================================================================
  // Performance Tests
  // ===========================================================================
  describe('Performance', () => {
    it('should write learner profile in < 5ms', async () => {
      const start = performance.now();
      await db.setLearnerProfile('perf-user', { name: 'Performance Test' });
      const elapsed = performance.now() - start;

      expect(elapsed).toBeLessThan(5);
      console.log(`Write time: ${elapsed.toFixed(2)}ms`);
    });

    it('should read learner profile in < 2ms', async () => {
      await db.setLearnerProfile('perf-user', { name: 'Performance Test' });

      const start = performance.now();
      const profile = await db.getLearnerProfile('perf-user');
      const elapsed = performance.now() - start;

      expect(profile).not.toBeNull();
      expect(elapsed).toBeLessThan(2);
      console.log(`Read time: ${elapsed.toFixed(2)}ms`);
    });

    it('should write concept in < 5ms', async () => {
      const start = performance.now();
      await db.addConcept({
        conceptId: 'perf-concept',
        name: 'Performance Concept',
        domain: 'test',
        description: 'Testing performance',
      });
      const elapsed = performance.now() - start;

      expect(elapsed).toBeLessThan(5);
      console.log(`Concept write time: ${elapsed.toFixed(2)}ms`);
    });

    it('should read concept in < 2ms', async () => {
      await db.addConcept({
        conceptId: 'perf-concept',
        name: 'Performance Concept',
        domain: 'test',
        description: 'Testing',
      });

      const start = performance.now();
      const concept = await db.getConcept('perf-concept');
      const elapsed = performance.now() - start;

      expect(concept).not.toBeNull();
      expect(elapsed).toBeLessThan(2);
      console.log(`Concept read time: ${elapsed.toFixed(2)}ms`);
    });
  });

  // ===========================================================================
  // Learner CRUD Tests
  // ===========================================================================
  describe('Learner CRUD', () => {
    it('should create a learner profile', async () => {
      const profile = await db.setLearnerProfile('new-user', {
        name: 'New User',
        email: 'new@example.com',
      });

      expect(profile.userId).toBe('new-user');
      expect(profile.name).toBe('New User');
      expect(profile.createdAt).toBeDefined();
      expect(profile.updatedAt).toBeDefined();
    });

    it('should update an existing learner profile', async () => {
      await db.setLearnerProfile('user-1', { name: 'Original Name' });
      const updated = await db.setLearnerProfile('user-1', { name: 'Updated Name' });

      expect(updated.name).toBe('Updated Name');
      expect(updated.userId).toBe('user-1');
    });

    it('should get a learner profile', async () => {
      await db.setLearnerProfile('user-1', { name: 'Test User' });
      const profile = await db.getLearnerProfile('user-1');

      expect(profile).not.toBeNull();
      expect(profile?.name).toBe('Test User');
    });

    it('should return null for non-existent learner', async () => {
      const profile = await db.getLearnerProfile('non-existent');
      expect(profile).toBeNull();
    });

    it('should delete a learner profile', async () => {
      await db.setLearnerProfile('to-delete', { name: 'Delete Me' });
      await db.deleteLearnerProfile('to-delete');
      const profile = await db.getLearnerProfile('to-delete');

      expect(profile).toBeNull();
    });

    it('should list all learner profiles', async () => {
      await db.setLearnerProfile('user-1', { name: 'User 1' });
      await db.setLearnerProfile('user-2', { name: 'User 2' });
      await db.setLearnerProfile('user-3', { name: 'User 3' });

      const profiles = await db.listLearnerProfiles();
      expect(profiles.length).toBe(3);
    });

    it('should update psychometric scores', async () => {
      await db.setLearnerProfile('user-1', { name: 'Test' });
      await db.updatePsychometricScore('user-1', 'openness', 75, 0.8, 'self-report');

      const profile = await db.getLearnerProfile('user-1');
      expect(profile?.psychometricScores['openness']).toBeDefined();
      expect(profile?.psychometricScores['openness'].score).toBe(75);
      expect(profile?.psychometricScores['openness'].confidence).toBe(0.8);
    });
  });

  // ===========================================================================
  // Concept CRUD Tests
  // ===========================================================================
  describe('Concept CRUD', () => {
    it('should add a concept', async () => {
      const concept = await db.addConcept({
        conceptId: 'algebra',
        name: 'Algebra',
        domain: 'mathematics',
        description: 'Algebraic concepts',
        difficulty: { absolute: 5, cognitiveLoad: 0.5, abstractness: 0.6 },
      });

      expect(concept.conceptId).toBe('algebra');
      expect(concept.name).toBe('Algebra');
      expect(concept.difficulty.absolute).toBe(5);
    });

    it('should get a concept', async () => {
      await db.addConcept({
        conceptId: 'calc',
        name: 'Calculus',
        domain: 'math',
        description: 'Calculus',
      });

      const concept = await db.getConcept('calc');
      expect(concept).not.toBeNull();
      expect(concept?.name).toBe('Calculus');
    });

    it('should return null for non-existent concept', async () => {
      const concept = await db.getConcept('non-existent');
      expect(concept).toBeNull();
    });

    it('should delete a concept', async () => {
      await db.addConcept({ conceptId: 'to-delete', name: 'Delete', domain: 'test', description: 'Test' });
      await db.deleteConcept('to-delete');
      const concept = await db.getConcept('to-delete');

      expect(concept).toBeNull();
    });

    it('should list all concepts', async () => {
      await db.addConcept({ conceptId: 'c1', name: 'C1', domain: 'test', description: 'Test' });
      await db.addConcept({ conceptId: 'c2', name: 'C2', domain: 'test', description: 'Test' });

      const concepts = await db.listConcepts();
      expect(concepts.length).toBe(2);
    });

    it('should list concepts by domain', async () => {
      await db.addConcept({ conceptId: 'math1', name: 'Math1', domain: 'math', description: 'Math' });
      await db.addConcept({ conceptId: 'math2', name: 'Math2', domain: 'math', description: 'Math' });
      await db.addConcept({ conceptId: 'prog1', name: 'Prog1', domain: 'programming', description: 'Prog' });

      const mathConcepts = await db.listConceptsByDomain('math');
      expect(mathConcepts.length).toBe(2);
    });
  });

  // ===========================================================================
  // Edge Tests
  // ===========================================================================
  describe('Edge Operations', () => {
    beforeEach(async () => {
      await db.addConcept({ conceptId: 'arithmetic', name: 'Arithmetic', domain: 'math', description: 'Basic math' });
      await db.addConcept({ conceptId: 'algebra', name: 'Algebra', domain: 'math', description: 'Algebra' });
      await db.addConcept({ conceptId: 'calculus', name: 'Calculus', domain: 'math', description: 'Calculus' });
    });

    it('should add a prerequisite edge', async () => {
      const edge = await db.addEdge({
        from: 'arithmetic',
        to: 'algebra',
        strength: 'required',
        reason: 'Need to understand basic math first',
      });

      expect(edge.from).toBe('arithmetic');
      expect(edge.to).toBe('algebra');
      expect(edge.strength).toBe('required');
    });

    it('should get a prerequisite edge', async () => {
      await db.addEdge({ from: 'arithmetic', to: 'algebra' });
      const edge = await db.getEdge('arithmetic', 'algebra');

      expect(edge).not.toBeNull();
      expect(edge?.from).toBe('arithmetic');
    });

    it('should delete a prerequisite edge', async () => {
      await db.addEdge({ from: 'arithmetic', to: 'algebra' });
      await db.deleteEdge('arithmetic', 'algebra');
      const edge = await db.getEdge('arithmetic', 'algebra');

      expect(edge).toBeNull();
    });

    it('should get prerequisites for a concept', async () => {
      await db.addEdge({ from: 'arithmetic', to: 'algebra', strength: 'required' });
      await db.addEdge({ from: 'algebra', to: 'calculus', strength: 'required' });

      const prereqs = await db.getPrerequisites('calculus');
      expect(prereqs.length).toBe(1);
      expect(prereqs[0].from).toBe('algebra');
    });

    it('should get dependents for a concept', async () => {
      await db.addEdge({ from: 'arithmetic', to: 'algebra' });
      await db.addEdge({ from: 'arithmetic', to: 'calculus' });

      const deps = await db.getDependents('arithmetic');
      expect(deps.length).toBe(2);
    });

    it('should list all edges', async () => {
      await db.addEdge({ from: 'arithmetic', to: 'algebra' });
      await db.addEdge({ from: 'algebra', to: 'calculus' });

      const edges = await db.listEdges();
      expect(edges.length).toBe(2);
    });
  });

  // ===========================================================================
  // Knowledge State Tests
  // ===========================================================================
  describe('Knowledge State Operations', () => {
    beforeEach(async () => {
      await db.setLearnerProfile('user-1', { name: 'Test User' });
      await db.addConcept({ conceptId: 'algebra', name: 'Algebra', domain: 'math', description: 'Algebra' });
    });

    it('should set knowledge state', async () => {
      const state = await db.setKnowledgeState('user-1', 'algebra', {
        mastery: 80,
        bloomLevel: 4,
      });

      expect(state.userId).toBe('user-1');
      expect(state.conceptId).toBe('algebra');
      expect(state.mastery).toBe(80);
      expect(state.bloomLevel).toBe(4);
      expect(state.firstSeen).toBeDefined();
    });

    it('should get knowledge state', async () => {
      await db.setKnowledgeState('user-1', 'algebra', { mastery: 50 });
      const state = await db.getKnowledgeState('user-1', 'algebra');

      expect(state).not.toBeNull();
      expect(state?.mastery).toBe(50);
    });

    it('should update existing knowledge state', async () => {
      await db.setKnowledgeState('user-1', 'algebra', { mastery: 50 });
      const updated = await db.setKnowledgeState('user-1', 'algebra', { mastery: 75 });

      expect(updated.mastery).toBe(75);
    });

    it('should delete knowledge state', async () => {
      await db.setKnowledgeState('user-1', 'algebra', { mastery: 50 });
      await db.deleteKnowledgeState('user-1', 'algebra');
      const state = await db.getKnowledgeState('user-1', 'algebra');

      expect(state).toBeNull();
    });

    it('should get all knowledge states for a learner', async () => {
      await db.addConcept({ conceptId: 'calc', name: 'Calculus', domain: 'math', description: 'Calc' });
      await db.setKnowledgeState('user-1', 'algebra', { mastery: 80 });
      await db.setKnowledgeState('user-1', 'calc', { mastery: 60 });

      const states = await db.getLearnerKnowledgeStates('user-1');
      expect(states.length).toBe(2);
    });

    it('should add misconceptions', async () => {
      await db.setKnowledgeState('user-1', 'algebra', { mastery: 50 });
      await db.addMisconception('user-1', 'algebra', 'Thinks x + x = x^2', 'major');

      const state = await db.getKnowledgeState('user-1', 'algebra');
      expect(state?.misconceptions.length).toBe(1);
      expect(state?.misconceptions[0].description).toBe('Thinks x + x = x^2');
      expect(state?.misconceptions[0].severity).toBe('major');
    });
  });

  // ===========================================================================
  // Batch Operations Tests
  // ===========================================================================
  describe('Batch Operations', () => {
    it('should execute batch operations atomically', async () => {
      await db.batch([
        { type: 'put', key: 'learner:batch-1', value: { userId: 'batch-1', name: 'Batch 1', psychometricScores: {}, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } },
        { type: 'put', key: 'learner:batch-2', value: { userId: 'batch-2', name: 'Batch 2', psychometricScores: {}, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } },
      ]);

      const p1 = await db.getLearnerProfile('batch-1');
      const p2 = await db.getLearnerProfile('batch-2');

      expect(p1).not.toBeNull();
      expect(p2).not.toBeNull();
    });

    it('should handle batch deletes', async () => {
      await db.setLearnerProfile('del-1', { name: 'Delete 1' });
      await db.setLearnerProfile('del-2', { name: 'Delete 2' });

      await db.batch([
        { type: 'del', key: 'learner:del-1' },
        { type: 'del', key: 'learner:del-2' },
      ]);

      const p1 = await db.getLearnerProfile('del-1');
      const p2 = await db.getLearnerProfile('del-2');

      expect(p1).toBeNull();
      expect(p2).toBeNull();
    });
  });

  // ===========================================================================
  // Statistics Tests
  // ===========================================================================
  describe('Statistics', () => {
    it('should return accurate stats', async () => {
      await db.setLearnerProfile('u1', { name: 'U1' });
      await db.setLearnerProfile('u2', { name: 'U2' });
      await db.addConcept({ conceptId: 'c1', name: 'C1', domain: 'test', description: 'Test' });
      await db.addConcept({ conceptId: 'c2', name: 'C2', domain: 'test', description: 'Test' });
      await db.addConcept({ conceptId: 'c3', name: 'C3', domain: 'test', description: 'Test' });
      await db.addEdge({ from: 'c1', to: 'c2' });
      await db.setKnowledgeState('u1', 'c1', { mastery: 50 });

      const stats = await db.getStats();

      expect(stats.learnerCount).toBe(2);
      expect(stats.conceptCount).toBe(3);
      expect(stats.edgeCount).toBe(1);
      expect(stats.stateCount).toBe(1);
    });
  });

  // ===========================================================================
  // Quick Start Example Test
  // ===========================================================================
  describe('Quick Start Example', () => {
    it('should work as documented in README', async () => {
      // 1. Store a learner
      await db.setLearnerProfile('user-123', { userId: 'user-123' });

      // 2. Store concepts with prerequisites
      await db.addConcept({ conceptId: 'arithmetic', name: 'Arithmetic', domain: 'math', description: 'Basic arithmetic', difficulty: { absolute: 1, cognitiveLoad: 0.3, abstractness: 0.2 } });
      await db.addConcept({ conceptId: 'algebra', name: 'Algebra', domain: 'math', description: 'Basic algebra', difficulty: { absolute: 3, cognitiveLoad: 0.5, abstractness: 0.5 } });
      await db.addEdge({ from: 'arithmetic', to: 'algebra' });

      // 3. Track what user knows
      await db.setKnowledgeState('user-123', 'arithmetic', { mastery: 90 });

      // Verify everything is stored correctly
      const learner = await db.getLearnerProfile('user-123');
      expect(learner).not.toBeNull();

      const arithmetic = await db.getConcept('arithmetic');
      expect(arithmetic?.difficulty.absolute).toBe(1);

      const algebra = await db.getConcept('algebra');
      expect(algebra?.difficulty.absolute).toBe(3);

      const edge = await db.getEdge('arithmetic', 'algebra');
      expect(edge).not.toBeNull();

      const state = await db.getKnowledgeState('user-123', 'arithmetic');
      expect(state?.mastery).toBe(90);
    });
  });
});
