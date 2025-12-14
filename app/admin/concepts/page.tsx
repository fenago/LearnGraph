'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from '@/app/components/Sidebar';
import { EtherealShadow } from '@/components/ui/ethereal-shadow';
import { Plus, Edit, Trash2, X, Save, BookOpen, AlertCircle, Loader2, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useConcepts, useDB } from '@/lib/DBContext';
import type { ConceptNode } from '@/src/models/types';

const DOMAINS = [
  'mathematics',
  'science',
  'programming',
  'language',
  'history',
  'arts',
  'social-sciences',
  'engineering',
  'computer-science',
  'other',
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' as const },
  },
};

export default function ConceptsPage() {
  const { isLoading: dbLoading, error: dbError } = useDB();
  const { concepts, loading, createConcept, updateConcept, deleteConcept } = useConcepts();
  const [showForm, setShowForm] = useState(false);
  const [editingConcept, setEditingConcept] = useState<ConceptNode | null>(null);
  const [formData, setFormData] = useState({
    conceptId: '',
    name: '',
    domain: 'mathematics',
    subdomain: '',
    description: '',
    difficulty: 5,
    cognitiveLoad: 0.5,
    abstractness: 0.5,
    tags: '',
  });
  const [error, setError] = useState('');
  const [filterDomain, setFilterDomain] = useState('');

  // Filter concepts by domain
  const filteredConcepts = useMemo(() => {
    if (!filterDomain) return concepts;
    return concepts.filter(c => c.domain === filterDomain);
  }, [concepts, filterDomain]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    const conceptData = {
      conceptId: formData.conceptId,
      name: formData.name,
      domain: formData.domain,
      subdomain: formData.subdomain || undefined,
      description: formData.description || undefined,
      difficulty: {
        absolute: formData.difficulty,
        cognitiveLoad: formData.cognitiveLoad,
        abstractness: formData.abstractness,
      },
      tags: formData.tags ? formData.tags.split(',').map((t) => t.trim()) : undefined,
    };

    try {
      if (editingConcept) {
        await updateConcept(conceptData);
      } else {
        await createConcept(conceptData);
      }

      setShowForm(false);
      setEditingConcept(null);
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  }

  async function handleDelete(conceptId: string) {
    if (!confirm('Are you sure you want to delete this concept?')) return;

    try {
      await deleteConcept(conceptId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  }

  // Show DB loading state
  if (dbLoading) {
    return (
      <div className="flex min-h-screen bg-background items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">Initializing database...</p>
        </div>
      </div>
    );
  }

  if (dbError) {
    return (
      <div className="flex min-h-screen bg-background items-center justify-center">
        <div className="text-center text-destructive">
          <AlertCircle className="w-8 h-8 mx-auto mb-3" />
          <p>Database error: {dbError.message}</p>
        </div>
      </div>
    );
  }

  function resetForm() {
    setFormData({
      conceptId: '',
      name: '',
      domain: 'mathematics',
      subdomain: '',
      description: '',
      difficulty: 5,
      cognitiveLoad: 0.5,
      abstractness: 0.5,
      tags: '',
    });
  }

  function openEditForm(concept: ConceptNode) {
    setEditingConcept(concept);
    setFormData({
      conceptId: concept.conceptId,
      name: concept.name,
      domain: concept.domain,
      subdomain: concept.subdomain || '',
      description: concept.description || '',
      difficulty: concept.difficulty.absolute,
      cognitiveLoad: concept.difficulty.cognitiveLoad || 0.5,
      abstractness: concept.difficulty.abstractness || 0.5,
      tags: concept.tags?.join(', ') || '',
    });
    setShowForm(true);
  }

  function openNewForm() {
    setEditingConcept(null);
    resetForm();
    setShowForm(true);
  }

  function getDifficultyColor(difficulty: number): string {
    if (difficulty <= 3) return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400';
    if (difficulty <= 6) return 'bg-amber-500/10 text-amber-600 dark:text-amber-400';
    return 'bg-red-500/10 text-red-600 dark:text-red-400';
  }

  function getDomainColor(domain: string): string {
    const colors: Record<string, string> = {
      mathematics: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
      science: 'bg-green-500/10 text-green-600 dark:text-green-400',
      programming: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
      language: 'bg-pink-500/10 text-pink-600 dark:text-pink-400',
      history: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
      arts: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
      'social-sciences': 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400',
      engineering: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
      other: 'bg-gray-500/10 text-gray-600 dark:text-gray-400',
    };
    return colors[domain] || colors.other;
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <main className="flex-1 relative overflow-hidden">
        {/* Background Effect */}
        <div className="absolute inset-0 pointer-events-none">
          <EtherealShadow
            color="rgba(16, 185, 129, 0.12)"
            animation={{ scale: 30, speed: 40 }}
            noise={{ opacity: 0.3, scale: 0.8 }}
          />
        </div>

        <div className="relative z-10 px-8 py-10 max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 rounded-xl bg-emerald-500/10">
                <BookOpen className="w-6 h-6 text-emerald-500" />
              </div>
              <h1 className="text-3xl font-bold text-foreground">Concepts</h1>
            </div>
            <p className="text-muted-foreground ml-14">
              Build your knowledge graph with concept nodes
            </p>
          </motion.div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive/20 flex items-center gap-3"
              >
                <AlertCircle className="w-5 h-5 text-destructive" />
                <span className="text-destructive">{error}</span>
                <button
                  onClick={() => setError('')}
                  className="ml-auto text-destructive/70 hover:text-destructive"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Actions Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex justify-between items-center mb-6"
          >
            <button onClick={openNewForm} className="btn btn-primary flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Concept
            </button>

            <div className="flex items-center gap-3">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <select
                value={filterDomain}
                onChange={(e) => setFilterDomain(e.target.value)}
                className="form-input py-2 min-w-[180px]"
              >
                <option value="">All Domains</option>
                {DOMAINS.map((d) => (
                  <option key={d} value={d}>
                    {d.charAt(0).toUpperCase() + d.slice(1).replace('-', ' ')}
                  </option>
                ))}
              </select>
            </div>
          </motion.div>

          {/* Form */}
          <AnimatePresence>
            {showForm && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="glass-card p-6 mb-6"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold text-foreground">
                    {editingConcept ? 'Edit Concept' : 'New Concept'}
                  </h2>
                  <button
                    onClick={() => setShowForm(false)}
                    className="p-2 rounded-lg hover:bg-muted transition-colors"
                  >
                    <X className="w-5 h-5 text-muted-foreground" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="form-label">
                        Concept ID <span className="text-destructive">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.conceptId}
                        onChange={(e) => setFormData({ ...formData, conceptId: e.target.value })}
                        disabled={!!editingConcept}
                        required
                        className="form-input disabled:opacity-50"
                        placeholder="e.g., linear-equations"
                      />
                    </div>

                    <div>
                      <label className="form-label">
                        Name <span className="text-destructive">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="form-input"
                        placeholder="e.g., Linear Equations"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="form-label">
                        Domain <span className="text-destructive">*</span>
                      </label>
                      <select
                        value={formData.domain}
                        onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                        required
                        className="form-input"
                      >
                        {DOMAINS.map((d) => (
                          <option key={d} value={d}>
                            {d.charAt(0).toUpperCase() + d.slice(1).replace('-', ' ')}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="form-label">Subdomain</label>
                      <input
                        type="text"
                        value={formData.subdomain}
                        onChange={(e) => setFormData({ ...formData, subdomain: e.target.value })}
                        className="form-input"
                        placeholder="e.g., Algebra"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="form-label">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="form-input min-h-[80px] resize-none"
                      placeholder="Describe what this concept covers..."
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="form-label">
                        Difficulty (1-10):{' '}
                        <span className="font-semibold text-foreground">{formData.difficulty}</span>
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={formData.difficulty}
                        onChange={(e) =>
                          setFormData({ ...formData, difficulty: parseInt(e.target.value) })
                        }
                        className="w-full accent-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="form-label">
                        Cognitive Load:{' '}
                        <span className="font-semibold text-foreground">
                          {formData.cognitiveLoad.toFixed(2)}
                        </span>
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={formData.cognitiveLoad * 100}
                        onChange={(e) =>
                          setFormData({ ...formData, cognitiveLoad: parseInt(e.target.value) / 100 })
                        }
                        className="w-full accent-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="form-label">
                        Abstractness:{' '}
                        <span className="font-semibold text-foreground">
                          {formData.abstractness.toFixed(2)}
                        </span>
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={formData.abstractness * 100}
                        onChange={(e) =>
                          setFormData({ ...formData, abstractness: parseInt(e.target.value) / 100 })
                        }
                        className="w-full accent-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="form-label">Tags (comma-separated)</label>
                    <input
                      type="text"
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      className="form-input"
                      placeholder="e.g., algebra, equations, foundational"
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button type="submit" className="btn btn-success flex items-center gap-2">
                      <Save className="w-4 h-4" />
                      {editingConcept ? 'Update' : 'Create'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="btn btn-secondary"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Content */}
          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">Loading concepts...</p>
            </motion.div>
          ) : filteredConcepts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16 glass-card"
            >
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">No concepts yet</h3>
              <p className="text-muted-foreground mb-6">
                Click &quot;Add Concept&quot; to create your first concept node
              </p>
              <button onClick={openNewForm} className="btn btn-primary">
                <Plus className="w-4 h-4 mr-2" />
                Add Concept
              </button>
            </motion.div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid gap-4"
            >
              {filteredConcepts.map((concept, index) => (
                <motion.div
                  key={concept.conceptId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="glass-card p-5 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 flex-shrink-0">
                        <BookOpen className="w-6 h-6 text-white" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-lg text-foreground">{concept.name}</h3>
                        <code className="text-sm text-muted-foreground">{concept.conceptId}</code>
                        {concept.description && (
                          <p className="text-muted-foreground mt-2 text-sm">{concept.description}</p>
                        )}
                        <div className="flex flex-wrap gap-2 mt-3">
                          <span className={cn('px-2.5 py-1 rounded-lg text-xs font-medium', getDomainColor(concept.domain))}>
                            {concept.domain}
                          </span>
                          {concept.subdomain && (
                            <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-muted text-muted-foreground">
                              {concept.subdomain}
                            </span>
                          )}
                          <span className={cn('px-2.5 py-1 rounded-lg text-xs font-medium', getDifficultyColor(concept.difficulty.absolute))}>
                            Difficulty: {concept.difficulty.absolute}/10
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => openEditForm(concept)}
                        className="p-2 rounded-lg hover:bg-blue-500/10 text-blue-500 transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(concept.conceptId)}
                        className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}
