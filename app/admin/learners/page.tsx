'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from '@/app/components/Sidebar';
import { EtherealShadow } from '@/components/ui/ethereal-shadow';
import { Plus, Edit, Trash2, X, Save, User, Users, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLearners, useDB } from '@/lib/DBContext';
import { v4 as uuidv4 } from 'uuid';

interface LearnerFormData {
  userId: string;
  name: string;
  email: string;
}

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

export default function LearnersPage() {
  const { isLoading: dbLoading, error: dbError } = useDB();
  const { learners, loading, createLearner, updateLearner, deleteLearner } = useLearners();
  const [showForm, setShowForm] = useState(false);
  const [editingLearner, setEditingLearner] = useState<LearnerFormData | null>(null);
  const [formData, setFormData] = useState<LearnerFormData>({ userId: '', name: '', email: '' });
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    try {
      const userId = formData.userId || uuidv4();
      if (editingLearner) {
        await updateLearner(editingLearner.userId, {
          name: formData.name,
          email: formData.email || undefined,
        });
      } else {
        await createLearner(userId, {
          name: formData.name,
          email: formData.email || undefined,
        });
      }

      setShowForm(false);
      setEditingLearner(null);
      setFormData({ userId: '', name: '', email: '' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  }

  async function handleDelete(userId: string) {
    if (!confirm('Are you sure you want to delete this learner?')) return;

    try {
      await deleteLearner(userId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  }

  function openEditForm(learner: { userId: string; name?: string; email?: string }) {
    setEditingLearner({
      userId: learner.userId,
      name: learner.name || '',
      email: learner.email || '',
    });
    setFormData({
      userId: learner.userId,
      name: learner.name || '',
      email: learner.email || '',
    });
    setShowForm(true);
  }

  function openNewForm() {
    setEditingLearner(null);
    setFormData({ userId: '', name: '', email: '' });
    setShowForm(true);
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

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <main className="flex-1 relative overflow-hidden">
        {/* Background Effect */}
        <div className="absolute inset-0 pointer-events-none">
          <EtherealShadow
            color="rgba(59, 130, 246, 0.12)"
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
              <div className="p-2.5 rounded-xl bg-blue-500/10">
                <Users className="w-6 h-6 text-blue-500" />
              </div>
              <h1 className="text-3xl font-bold text-foreground">Learners</h1>
            </div>
            <p className="text-muted-foreground ml-14">
              Manage learner profiles and psychometric data
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

          {/* Add Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-6"
          >
            <button
              onClick={openNewForm}
              className="btn btn-primary flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Learner
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
                  <h2 className="text-lg font-semibold text-foreground">
                    {editingLearner ? 'Edit Learner' : 'New Learner'}
                  </h2>
                  <button
                    onClick={() => setShowForm(false)}
                    className="p-2 rounded-lg hover:bg-muted transition-colors"
                  >
                    <X className="w-5 h-5 text-muted-foreground" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="form-label">
                      User ID{' '}
                      {!editingLearner && (
                        <span className="text-muted-foreground font-normal">(auto-generated if empty)</span>
                      )}
                    </label>
                    <input
                      type="text"
                      value={formData.userId}
                      onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                      disabled={!!editingLearner}
                      className="form-input disabled:opacity-50"
                      placeholder="e.g., user-123"
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
                      placeholder="e.g., John Doe"
                    />
                  </div>

                  <div>
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="form-input"
                      placeholder="e.g., john@example.com"
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button type="submit" className="btn btn-success flex items-center gap-2">
                      <Save className="w-4 h-4" />
                      {editingLearner ? 'Update' : 'Create'}
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
              <p className="text-muted-foreground">Loading learners...</p>
            </motion.div>
          ) : learners.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16 glass-card"
            >
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">No learners yet</h3>
              <p className="text-muted-foreground mb-6">
                Click &quot;Add Learner&quot; to create your first learner profile
              </p>
              <button onClick={openNewForm} className="btn btn-primary">
                <Plus className="w-4 h-4 mr-2" />
                Add Learner
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
                        Learner
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        User ID
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30">
                    {learners.map((learner, index) => (
                      <motion.tr
                        key={learner.userId}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                        className="hover:bg-muted/30 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
                              <User className="w-5 h-5 text-white" />
                            </div>
                            <span className="font-medium text-foreground">{learner.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <code className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded">
                            {learner.userId}
                          </code>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                          {learner.email || '—'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                          {learner.createdAt
                            ? new Date(learner.createdAt).toLocaleDateString()
                            : '—'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => openEditForm(learner)}
                              className="p-2 rounded-lg hover:bg-blue-500/10 text-blue-500 transition-colors"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(learner.userId)}
                              className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
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
