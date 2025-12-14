'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from '@/app/components/Sidebar';
import { EtherealShadow } from '@/components/ui/ethereal-shadow';
import { Plus, Trash2, X, Save, ArrowRight, GitBranch, AlertCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PrerequisiteEdge {
  from: string;
  to: string;
  strength: 'required' | 'recommended' | 'helpful';
  reason?: string;
}

interface ConceptNode {
  conceptId: string;
  name: string;
}

const STRENGTH_OPTIONS = [
  { value: 'required', label: 'Required', color: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20' },
  { value: 'recommended', label: 'Recommended', color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' },
  { value: 'helpful', label: 'Helpful', color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' as const },
  },
};

export default function PrerequisitesPage() {
  const [edges, setEdges] = useState<PrerequisiteEdge[]>([]);
  const [concepts, setConcepts] = useState<ConceptNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    from: '',
    to: '',
    strength: 'required' as 'required' | 'recommended' | 'helpful',
    reason: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([fetchEdges(), fetchConcepts()]).then(() => setLoading(false));
  }, []);

  async function fetchEdges() {
    try {
      const res = await fetch('/api/edges');
      const data = await res.json();
      setEdges(data);
    } catch (err) {
      setError('Failed to fetch prerequisites');
    }
  }

  async function fetchConcepts() {
    try {
      const res = await fetch('/api/concepts');
      const data = await res.json();
      setConcepts(data);
    } catch (err) {
      setError('Failed to fetch concepts');
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (formData.from === formData.to) {
      setError('A concept cannot be a prerequisite of itself');
      return;
    }

    try {
      const res = await fetch('/api/edges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create prerequisite');
      }

      setShowForm(false);
      setFormData({ from: '', to: '', strength: 'required', reason: '' });
      fetchEdges();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  }

  async function handleDelete(from: string, to: string) {
    if (!confirm('Are you sure you want to delete this prerequisite?')) return;

    try {
      const res = await fetch(`/api/edges?from=${from}&to=${to}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete prerequisite');
      fetchEdges();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  }

  function getConceptName(conceptId: string): string {
    const concept = concepts.find((c) => c.conceptId === conceptId);
    return concept?.name || conceptId;
  }

  function getStrengthStyle(strength: string): string {
    const option = STRENGTH_OPTIONS.find((o) => o.value === strength);
    return option?.color || 'bg-muted text-muted-foreground';
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <main className="flex-1 relative overflow-hidden">
        {/* Background Effect */}
        <div className="absolute inset-0 pointer-events-none">
          <EtherealShadow
            color="rgba(168, 85, 247, 0.12)"
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
              <div className="p-2.5 rounded-xl bg-purple-500/10">
                <GitBranch className="w-6 h-6 text-purple-500" />
              </div>
              <h1 className="text-3xl font-bold text-foreground">Prerequisites</h1>
            </div>
            <p className="text-muted-foreground ml-14">
              Define prerequisite relationships between concepts
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

          {/* Warning if not enough concepts */}
          {concepts.length < 2 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-3"
            >
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              <span className="text-amber-600 dark:text-amber-400">
                You need at least 2 concepts to create prerequisites. Go to the Concepts page to add more.
              </span>
            </motion.div>
          )}

          {/* Add Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-6"
          >
            <button
              onClick={() => setShowForm(true)}
              disabled={concepts.length < 2}
              className="btn btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4" />
              Add Prerequisite
            </button>
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
                  <h2 className="text-lg font-semibold text-foreground">New Prerequisite</h2>
                  <button
                    onClick={() => setShowForm(false)}
                    className="p-2 rounded-lg hover:bg-muted transition-colors"
                  >
                    <X className="w-5 h-5 text-muted-foreground" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="flex items-end gap-4">
                    <div className="flex-1">
                      <label className="form-label">
                        From (Prerequisite) <span className="text-destructive">*</span>
                      </label>
                      <select
                        value={formData.from}
                        onChange={(e) => setFormData({ ...formData, from: e.target.value })}
                        required
                        className="form-input"
                      >
                        <option value="">Select concept...</option>
                        {concepts.map((c) => (
                          <option key={c.conceptId} value={c.conceptId}>
                            {c.name} ({c.conceptId})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-center pb-3">
                      <div className="p-2 rounded-lg bg-muted">
                        <ArrowRight className="w-5 h-5 text-muted-foreground" />
                      </div>
                    </div>

                    <div className="flex-1">
                      <label className="form-label">
                        To (Dependent) <span className="text-destructive">*</span>
                      </label>
                      <select
                        value={formData.to}
                        onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                        required
                        className="form-input"
                      >
                        <option value="">Select concept...</option>
                        {concepts
                          .filter((c) => c.conceptId !== formData.from)
                          .map((c) => (
                            <option key={c.conceptId} value={c.conceptId}>
                              {c.name} ({c.conceptId})
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>

                  <div className="text-sm text-muted-foreground text-center py-2 px-4 rounded-lg bg-muted/50">
                    &quot;{formData.from ? getConceptName(formData.from) : '...'}&quot; must be learned
                    before &quot;{formData.to ? getConceptName(formData.to) : '...'}&quot;
                  </div>

                  <div>
                    <label className="form-label">
                      Strength <span className="text-destructive">*</span>
                    </label>
                    <div className="flex gap-4">
                      {STRENGTH_OPTIONS.map((option) => (
                        <label
                          key={option.value}
                          className={cn(
                            'flex items-center gap-2 px-4 py-2 rounded-xl border cursor-pointer transition-all',
                            formData.strength === option.value
                              ? option.color
                              : 'bg-transparent border-border hover:bg-muted/50'
                          )}
                        >
                          <input
                            type="radio"
                            name="strength"
                            value={option.value}
                            checked={formData.strength === option.value}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                strength: e.target.value as 'required' | 'recommended' | 'helpful',
                              })
                            }
                            className="sr-only"
                          />
                          <span className="text-sm font-medium">{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="form-label">Reason (optional)</label>
                    <input
                      type="text"
                      value={formData.reason}
                      onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                      className="form-input"
                      placeholder="e.g., Needed for understanding variable manipulation"
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button type="submit" className="btn btn-success flex items-center gap-2">
                      <Save className="w-4 h-4" />
                      Create
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
              <p className="text-muted-foreground">Loading prerequisites...</p>
            </motion.div>
          ) : edges.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16 glass-card"
            >
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                <GitBranch className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">No prerequisites defined</h3>
              <p className="text-muted-foreground mb-6">
                Click &quot;Add Prerequisite&quot; to define concept relationships
              </p>
              <button
                onClick={() => setShowForm(true)}
                disabled={concepts.length < 2}
                className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Prerequisite
              </button>
            </motion.div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="glass-card overflow-hidden"
            >
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/50">
                      <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Prerequisite
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Relationship
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Dependent
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Reason
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30">
                    {edges.map((edge, index) => (
                      <motion.tr
                        key={`${edge.from}-${edge.to}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                        className="hover:bg-muted/30 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="font-medium text-foreground">
                              {getConceptName(edge.from)}
                            </div>
                            <code className="text-xs text-muted-foreground">{edge.from}</code>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center justify-center gap-2">
                            <span
                              className={cn(
                                'px-2.5 py-1 rounded-lg text-xs font-medium',
                                getStrengthStyle(edge.strength)
                              )}
                            >
                              {edge.strength}
                            </span>
                            <ArrowRight className="w-4 h-4 text-muted-foreground" />
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="font-medium text-foreground">
                              {getConceptName(edge.to)}
                            </div>
                            <code className="text-xs text-muted-foreground">{edge.to}</code>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-foreground max-w-xs truncate">
                          {edge.reason || '—'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <button
                            onClick={() => handleDelete(edge.from, edge.to)}
                            className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}
