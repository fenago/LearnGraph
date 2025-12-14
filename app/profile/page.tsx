'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Brain,
  Wand2,
  Edit3,
  RefreshCw,
  ClipboardCheck,
  ChevronRight,
  Save,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Settings2,
  Eye,
  Shield,
  Heart,
  Compass,
  Lightbulb,
  Users,
  Palette,
  Shuffle,
  Lock,
  Info,
  Play,
  CheckCircle,
  Circle,
  Zap,
  FileText,
  LayoutGrid,
  List,
  Send,
  Loader2,
} from 'lucide-react';
import { Sidebar } from '../components/Sidebar';
import { cn } from '@/lib/utils';
import {
  ALL_ASSESSMENTS,
  ASSESSMENT_CATEGORIES,
  Assessment,
  getAssessment,
} from '@/lib/assessments';
import { useDB, useLearners } from '@/lib/DBContext';
import { demoLearners } from '@/lib/demo-data';

// =============================================================================
// DOMAIN DEFINITIONS - Aligned with domain-reference.md (Source of Truth)
// =============================================================================

interface DomainDefinition {
  id: string;
  name: string;
  description: string;
  assessmentInstrument: string;
  scoreType: 'continuous' | 'categorical';
  categories?: string[];
}

interface CategoryDefinition {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
  domains: DomainDefinition[];
}

// From domain-reference.md - the canonical 39 domains in 8 categories
const PSYCHOMETRIC_CATEGORIES: CategoryDefinition[] = [
  {
    id: 'core_personality',
    name: 'A. Core Personality (Big Five)',
    icon: User,
    color: 'from-blue-500 to-cyan-500',
    domains: [
      { id: 'big_five_openness', name: 'Openness to Experience', description: 'Intellectual curiosity, creativity, preference for novelty', assessmentInstrument: 'NEO-PI-R', scoreType: 'continuous' },
      { id: 'big_five_conscientiousness', name: 'Conscientiousness', description: 'Self-discipline, organization, goal-directed behavior', assessmentInstrument: 'NEO-PI-R', scoreType: 'continuous' },
      { id: 'big_five_extraversion', name: 'Extraversion', description: 'Sociability, assertiveness, positive emotionality', assessmentInstrument: 'NEO-PI-R', scoreType: 'continuous' },
      { id: 'big_five_agreeableness', name: 'Agreeableness', description: 'Cooperativeness, trust, concern for social harmony', assessmentInstrument: 'NEO-PI-R', scoreType: 'continuous' },
      { id: 'big_five_neuroticism', name: 'Neuroticism', description: 'Emotional instability, tendency to negative emotions', assessmentInstrument: 'NEO-PI-R', scoreType: 'continuous' },
    ],
  },
  {
    id: 'dark_personality',
    name: 'B. Dark Personality',
    icon: Shield,
    color: 'from-slate-600 to-slate-800',
    domains: [
      { id: 'dark_triad_narcissism', name: 'Narcissism', description: 'Grandiosity, entitlement, need for admiration', assessmentInstrument: 'NPI', scoreType: 'continuous' },
      { id: 'dark_triad_machiavellianism', name: 'Machiavellianism', description: 'Strategic manipulation, cynical worldview', assessmentInstrument: 'MACH-IV', scoreType: 'continuous' },
      { id: 'dark_triad_psychopathy', name: 'Psychopathy', description: 'Callousness, impulsivity, lack of remorse', assessmentInstrument: 'Levenson Scale', scoreType: 'continuous' },
    ],
  },
  {
    id: 'emotional_social',
    name: 'C. Emotional/Social Intelligence',
    icon: Heart,
    color: 'from-pink-500 to-rose-500',
    domains: [
      { id: 'emotional_empathy', name: 'Empathy', description: 'Ability to share and understand others\' emotional states', assessmentInstrument: 'Empathy Quotient (EQ)', scoreType: 'continuous' },
      { id: 'emotional_intelligence', name: 'Emotional Intelligence', description: 'Perceive, understand, manage, and use emotions', assessmentInstrument: 'MSCEIT', scoreType: 'continuous' },
      { id: 'attachment_style', name: 'Attachment Style', description: 'Patterns of relating based on early bonding', assessmentInstrument: 'ECR-R', scoreType: 'categorical', categories: ['secure', 'anxious', 'avoidant', 'fearful'] },
      { id: 'love_languages', name: 'Love Languages', description: 'Preferred ways of expressing/receiving love', assessmentInstrument: '5 Love Languages', scoreType: 'categorical', categories: ['words_of_affirmation', 'quality_time', 'acts_of_service', 'physical_touch', 'receiving_gifts'] },
      { id: 'communication_style', name: 'Communication Style', description: 'Patterns of verbal and written expression', assessmentInstrument: 'DISC Assessment', scoreType: 'categorical', categories: ['dominant', 'influential', 'steady', 'conscientious'] },
    ],
  },
  {
    id: 'decision_motivation',
    name: 'D. Decision Making & Motivation',
    icon: Compass,
    color: 'from-amber-500 to-orange-500',
    domains: [
      { id: 'risk_tolerance', name: 'Risk Tolerance', description: 'Willingness to accept uncertainty for potential gains', assessmentInstrument: 'DOSPERT', scoreType: 'continuous' },
      { id: 'decision_style', name: 'Decision Style', description: 'How you approach choices and decisions', assessmentInstrument: 'GDMS', scoreType: 'categorical', categories: ['rational', 'intuitive', 'dependent', 'avoidant', 'spontaneous'] },
      { id: 'time_orientation', name: 'Time Orientation', description: 'Mental framing of time and its influence', assessmentInstrument: 'ZTPI', scoreType: 'categorical', categories: ['past_negative', 'past_positive', 'present_hedonistic', 'present_fatalistic', 'future'] },
      { id: 'achievement_motivation', name: 'Achievement Motivation', description: 'Drive to accomplish challenging goals', assessmentInstrument: 'nAch Scale', scoreType: 'continuous' },
      { id: 'self_efficacy', name: 'Self-Efficacy', description: 'Belief in ability to succeed in specific situations', assessmentInstrument: 'GSE', scoreType: 'continuous' },
      { id: 'locus_of_control', name: 'Locus of Control', description: 'Beliefs about what controls outcomes in life', assessmentInstrument: 'Rotter I-E Scale', scoreType: 'continuous' },
      { id: 'growth_mindset', name: 'Growth Mindset', description: 'Belief that abilities can be developed', assessmentInstrument: 'Dweck Scale', scoreType: 'continuous' },
    ],
  },
  {
    id: 'values_wellbeing',
    name: 'E. Values & Wellbeing',
    icon: Sparkles,
    color: 'from-emerald-500 to-teal-500',
    domains: [
      { id: 'personal_values', name: 'Personal Values', description: 'Core values that guide behavior', assessmentInstrument: 'Schwartz PVQ', scoreType: 'categorical', categories: ['self_direction', 'stimulation', 'hedonism', 'achievement', 'power', 'security', 'conformity', 'tradition', 'benevolence', 'universalism'] },
      { id: 'interests', name: 'Interests (RIASEC)', description: 'Vocational interests and preferred activities', assessmentInstrument: 'Holland RIASEC', scoreType: 'categorical', categories: ['realistic', 'investigative', 'artistic', 'social', 'enterprising', 'conventional'] },
      { id: 'life_satisfaction', name: 'Life Satisfaction', description: 'Overall evaluation of one\'s life', assessmentInstrument: 'SWLS', scoreType: 'continuous' },
      { id: 'stress_coping', name: 'Stress Coping', description: 'Strategies used to manage stress', assessmentInstrument: 'Brief COPE', scoreType: 'categorical', categories: ['problem_focused', 'emotion_focused', 'avoidant', 'support_seeking'] },
      { id: 'social_support', name: 'Social Support', description: 'Perceived availability of support', assessmentInstrument: 'MSPSS', scoreType: 'continuous' },
      { id: 'authenticity', name: 'Authenticity', description: 'Alignment between inner experience and expression', assessmentInstrument: 'Authenticity Scale', scoreType: 'continuous' },
    ],
  },
  {
    id: 'cognitive_learning',
    name: 'F. Cognitive/Learning',
    icon: Lightbulb,
    color: 'from-purple-500 to-violet-500',
    domains: [
      { id: 'cognitive_abilities', name: 'Cognitive Abilities', description: 'Verbal intelligence, reasoning, cognitive complexity', assessmentInstrument: 'LIWC + Verbal IQ', scoreType: 'continuous' },
      { id: 'creativity', name: 'Creativity', description: 'Novel idea generation, divergent thinking', assessmentInstrument: 'CAQ', scoreType: 'continuous' },
      { id: 'learning_styles', name: 'Learning Styles', description: 'Preferred modes of acquiring information', assessmentInstrument: 'VARK', scoreType: 'categorical', categories: ['visual', 'auditory', 'reading_writing', 'kinesthetic'] },
      { id: 'information_processing', name: 'Information Processing', description: 'How information is encoded and retrieved', assessmentInstrument: 'Craik & Lockhart', scoreType: 'continuous' },
      { id: 'metacognition', name: 'Metacognition', description: 'Awareness and control of thinking processes', assessmentInstrument: 'MAI', scoreType: 'continuous' },
      { id: 'executive_functions', name: 'Executive Functions', description: 'Planning, inhibition, cognitive flexibility', assessmentInstrument: 'BRIEF', scoreType: 'continuous' },
    ],
  },
  {
    id: 'social_cultural',
    name: 'G. Social/Cultural/Values',
    icon: Users,
    color: 'from-indigo-500 to-blue-500',
    domains: [
      { id: 'social_cognition', name: 'Social Cognition', description: 'Understanding and predicting others\' mental states', assessmentInstrument: 'RMET', scoreType: 'continuous' },
      { id: 'political_ideology', name: 'Political Ideology', description: 'Political orientation and moral foundations', assessmentInstrument: 'MFQ', scoreType: 'continuous' },
      { id: 'cultural_values', name: 'Cultural Values', description: 'Cultural dimensions influencing behavior', assessmentInstrument: 'Hofstede', scoreType: 'continuous' },
      { id: 'moral_reasoning', name: 'Moral Reasoning', description: 'How you think about ethical issues', assessmentInstrument: 'DIT-2', scoreType: 'continuous' },
      { id: 'work_career_style', name: 'Work & Career Style', description: 'Orientation toward work and career', assessmentInstrument: 'Career Anchors', scoreType: 'categorical', categories: ['technical', 'managerial', 'autonomy', 'security', 'entrepreneurial', 'service', 'challenge', 'lifestyle'] },
    ],
  },
  {
    id: 'sensory_aesthetic',
    name: 'H. Sensory/Aesthetic',
    icon: Palette,
    color: 'from-fuchsia-500 to-pink-500',
    domains: [
      { id: 'sensory_processing', name: 'Sensory Processing', description: 'How sensory information is processed', assessmentInstrument: 'HSP Scale', scoreType: 'continuous' },
      { id: 'aesthetic_preferences', name: 'Aesthetic Preferences', description: 'Preferences for beauty, art, design', assessmentInstrument: 'AESTHEMOS', scoreType: 'continuous' },
    ],
  },
];

// Get all domain IDs for iteration
const ALL_DOMAIN_IDS = PSYCHOMETRIC_CATEGORIES.flatMap((cat) => cat.domains.map((d) => d.id));

// =============================================================================
// TYPES
// =============================================================================

interface PsychometricScore {
  score: number;
  confidence: number;
  lastUpdated: string;
  source?: string;
  interpretation?: string; // Full interpretation text with subscales
  answers?: Record<string, number>; // Store answers for subscale calculations
  subscales?: Record<string, number>; // Individual subscale values (0-100)
}

// Subscale definitions for domains that have them
const DOMAIN_SUBSCALES: Record<string, { id: string; label: string; description?: string }[]> = {
  learning_styles: [
    { id: 'V', label: 'Visual', description: 'Learn through seeing' },
    { id: 'A', label: 'Auditory', description: 'Learn through hearing' },
    { id: 'R', label: 'Read/Write', description: 'Learn through reading and writing' },
    { id: 'K', label: 'Kinesthetic', description: 'Learn through doing' },
  ],
  emotional_intelligence: [
    { id: 'SEA', label: 'Self-Emotion Awareness', description: 'Understanding your own emotions' },
    { id: 'OEA', label: 'Others-Emotion Awareness', description: 'Reading others\' emotions' },
    { id: 'UOE', label: 'Use of Emotion', description: 'Using emotions for motivation' },
    { id: 'ROE', label: 'Regulation of Emotion', description: 'Managing emotional states' },
  ],
  attachment_style: [
    { id: 'anxiety', label: 'Attachment Anxiety', description: 'Fear of abandonment/rejection' },
    { id: 'avoidance', label: 'Attachment Avoidance', description: 'Discomfort with closeness' },
  ],
  love_languages: [
    { id: 'words', label: 'Words of Affirmation' },
    { id: 'quality', label: 'Quality Time' },
    { id: 'acts', label: 'Acts of Service' },
    { id: 'touch', label: 'Physical Touch' },
    { id: 'gifts', label: 'Receiving Gifts' },
  ],
  communication_style: [
    { id: 'D', label: 'Dominant', description: 'Direct and decisive' },
    { id: 'I', label: 'Influential', description: 'Enthusiastic and collaborative' },
    { id: 'S', label: 'Steady', description: 'Patient and consistent' },
    { id: 'C', label: 'Conscientious', description: 'Analytical and accurate' },
  ],
  risk_tolerance: [
    { id: 'ethical', label: 'Ethical Risk' },
    { id: 'financial', label: 'Financial Risk' },
    { id: 'health', label: 'Health/Safety Risk' },
    { id: 'recreational', label: 'Recreational Risk' },
    { id: 'social', label: 'Social Risk' },
  ],
  interests: [
    { id: 'R', label: 'Realistic', description: 'Hands-on, practical' },
    { id: 'I', label: 'Investigative', description: 'Analytical, intellectual' },
    { id: 'A', label: 'Artistic', description: 'Creative, expressive' },
    { id: 'S', label: 'Social', description: 'Helping, teaching' },
    { id: 'E', label: 'Enterprising', description: 'Leading, persuading' },
    { id: 'C', label: 'Conventional', description: 'Organizing, detail-oriented' },
  ],
  social_support: [
    { id: 'SO', label: 'Significant Other' },
    { id: 'family', label: 'Family Support' },
    { id: 'friends', label: 'Friend Support' },
  ],
  stress_coping: [
    { id: 'active', label: 'Active Coping' },
    { id: 'planning', label: 'Planning' },
    { id: 'reframing', label: 'Positive Reframing' },
    { id: 'acceptance', label: 'Acceptance' },
    { id: 'emotional_support', label: 'Emotional Support' },
  ],
};

interface LearnerProfile {
  userId: string;
  name?: string;
  email?: string;
  psychometricScores: Record<string, PsychometricScore>;
  profileMode?: 'auto' | 'manual' | 'adaptive' | 'assessment';
  learningStyle?: {
    primary: string;
    secondary?: string;
    socialPreference: string;
    pacePreference: string;
    feedbackPreference: string;
  };
}

type ProfileMode = 'view' | 'auto' | 'manual' | 'adaptive' | 'assessment';

// Assessment type selection (quick vs full)
type AssessmentType = 'quick' | 'full';

// Assessment view mode (cards = individual click, all = batch all questions)
type AssessmentViewMode = 'cards' | 'all';

// =============================================================================
// COMPONENT
// =============================================================================

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

export default function ProfilePage() {
  // Database hooks
  const { isLoading: dbLoading, error: dbError } = useDB();
  const { learners: learnersData, loading: learnersLoading, getLearner, updateLearner, createLearner } = useLearners();

  // Basic state
  const [selectedLearnerId, setSelectedLearnerId] = useState<string>('');
  const [profile, setProfile] = useState<LearnerProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Derived learners list - cast to any to allow partial profile data
  const learners = learnersData as LearnerProfile[];

  const loading = dbLoading || learnersLoading || profileLoading;

  // Mode selection
  const [activeMode, setActiveMode] = useState<ProfileMode>('view');
  const [modeConfirmed, setModeConfirmed] = useState(false);

  // For editing scores
  const [editedScores, setEditedScores] = useState<Record<string, PsychometricScore>>({});

  // Expanded categories
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['core_personality']));

  // Assessment state
  const [activeAssessment, setActiveAssessment] = useState<Assessment | null>(null);
  const [assessmentAnswers, setAssessmentAnswers] = useState<Record<string, number>>({});
  const [completedAssessments, setCompletedAssessments] = useState<Set<string>>(new Set());
  const [assessmentType, setAssessmentType] = useState<AssessmentType>('quick');
  const [assessmentViewMode, setAssessmentViewMode] = useState<AssessmentViewMode>('cards');
  // Batch answers for "all questions" view: domainId -> questionId -> answer
  const [batchAnswers, setBatchAnswers] = useState<Record<string, Record<string, number>>>({});

  // Select first learner when data loads
  useEffect(() => {
    if (learners.length > 0 && !selectedLearnerId) {
      setSelectedLearnerId(learners[0].userId);
    }
  }, [learners, selectedLearnerId]);

  // Load selected learner's profile
  useEffect(() => {
    if (!selectedLearnerId) return;

    const loadProfile = async () => {
      setProfileLoading(true);
      try {
        const data = await getLearner(selectedLearnerId);
        if (data) {
          setProfile(data);

          // Generate interpretations for scores that don't have them
          const scoresWithInterpretations: Record<string, PsychometricScore> = {};
          const existingScores = data.psychometricScores || {};

          for (const [domainId, scoreData] of Object.entries(existingScores)) {
            const score = scoreData as PsychometricScore;
            if (score.interpretation) {
              // Already has interpretation
              scoresWithInterpretations[domainId] = score;
            } else {
              // Generate interpretation from score
              const assessmentData = ALL_ASSESSMENTS[domainId];
              const assessment = assessmentData?.full || assessmentData?.quick;
              const interpretation = assessment?.interpretation?.(score.score, score.answers) || undefined;
              scoresWithInterpretations[domainId] = { ...score, interpretation };
            }
          }

          setEditedScores(scoresWithInterpretations);
          // Set default profile mode
          setActiveMode('view');
          setModeConfirmed(false);
        }
      } catch (err) {
        console.error('Failed to load profile:', err);
        setError('Failed to load profile');
      } finally {
        setProfileLoading(false);
      }
    };

    loadProfile();
  }, [selectedLearnerId, getLearner]);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  };

  // Helper to get interpretation for any score (with or without answers)
  const getInterpretation = (domainId: string, score: number, answers?: Record<string, number>): string | undefined => {
    const assessmentData = ALL_ASSESSMENTS[domainId];
    if (!assessmentData) return undefined;
    // Use full assessment's interpretation if available, otherwise quick
    const assessment = assessmentData.full || assessmentData.quick;
    if (!assessment?.interpretation) return undefined;
    return assessment.interpretation(score, answers);
  };

  const handleScoreChange = (domainId: string, value: number) => {
    const interpretation = getInterpretation(domainId, value);
    setEditedScores((prev) => ({
      ...prev,
      [domainId]: {
        score: value,
        confidence: prev[domainId]?.confidence || 0.5,
        lastUpdated: new Date().toISOString(),
        source: activeMode === 'manual' ? 'manual_entry' : activeMode === 'adaptive' ? 'adaptive_initial' : 'auto_discovery',
        interpretation, // Always generate interpretation from score
      },
    }));
  };

  const handleConfidenceChange = (domainId: string, value: number) => {
    setEditedScores((prev) => ({
      ...prev,
      [domainId]: {
        ...prev[domainId],
        confidence: value,
        lastUpdated: new Date().toISOString(),
      },
    }));
  };

  // Surprise Me - Generate random but realistic values
  const handleSurpriseMe = useCallback(() => {
    const newScores: Record<string, PsychometricScore> = {};
    const now = new Date().toISOString();

    for (const domainId of ALL_DOMAIN_IDS) {
      // Use Box-Muller for normal distribution
      const u1 = Math.random();
      const u2 = Math.random();
      const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
      const mean = 50;
      const stdDev = 20;
      let value = Math.round(mean + z * stdDev);
      value = Math.max(5, Math.min(95, value));

      // Generate interpretation for the random score
      const assessmentData = ALL_ASSESSMENTS[domainId];
      const assessment = assessmentData?.full || assessmentData?.quick;
      const interpretation = assessment?.interpretation?.(value) || undefined;

      newScores[domainId] = {
        score: value,
        confidence: 0.3 + Math.random() * 0.4,
        lastUpdated: now,
        source: 'surprise_me',
        interpretation, // Include interpretation for random scores too
      };
    }

    setEditedScores(newScores);
    setSuccess('Generated random profile values! Adjust any you\'d like, then save.');
    setTimeout(() => setSuccess(null), 3000);
  }, []);

  // Confirm mode selection (exclusive - only one can be active)
  const handleConfirmMode = async () => {
    if (activeMode === 'view') return;

    setModeConfirmed(true);
    setSuccess(`Profile mode set to "${activeMode}". This will determine how your psychometric profile is built.`);
    setTimeout(() => setSuccess(null), 4000);
  };

  const saveProfile = async () => {
    if (!profile) return;

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const updatedData = {
        psychometricScores: editedScores,
        profileMode: activeMode !== 'view' ? activeMode : profile.profileMode,
      };

      const saved = await updateLearner(profile.userId, updatedData as any);
      setProfile(saved);
      setSuccess('Profile saved successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  // Assessment functions
  const startAssessment = (domainId: string) => {
    const assessmentData = ALL_ASSESSMENTS[domainId];
    if (!assessmentData) return;

    const assessment = assessmentType === 'quick' ? assessmentData.quick : assessmentData.full;
    setActiveAssessment(assessment);
    setAssessmentAnswers({});
  };

  const submitAssessment = () => {
    if (!activeAssessment) return;

    const score = activeAssessment.calculateScore(assessmentAnswers);
    const now = new Date().toISOString();
    const isFullAssessment = activeAssessment.questions.length > 1;

    // Pass answers to interpretation for subscale calculations
    const interpretation = activeAssessment.interpretation(score, assessmentAnswers);

    setEditedScores((prev) => ({
      ...prev,
      [activeAssessment.domainId]: {
        score,
        confidence: isFullAssessment ? 0.9 : 0.7, // Full assessments have higher confidence
        lastUpdated: now,
        source: isFullAssessment ? 'assessment_full' : 'assessment_quick',
        interpretation, // Store the full interpretation with subscales
        answers: { ...assessmentAnswers }, // Store answers for later re-calculation
      },
    }));

    setCompletedAssessments((prev) => new Set(prev).add(activeAssessment.domainId));
    setActiveAssessment(null);

    setSuccess(`${activeAssessment.shortName} complete! ${interpretation}`);
    setTimeout(() => setSuccess(null), 5000);
  };

  // Batch mode functions
  const handleBatchAnswer = (domainId: string, questionId: string, value: number) => {
    setBatchAnswers((prev) => ({
      ...prev,
      [domainId]: {
        ...(prev[domainId] || {}),
        [questionId]: value,
      },
    }));
  };

  const getBatchProgress = () => {
    let answered = 0;
    let total = 0;
    for (const domainId of ALL_DOMAIN_IDS) {
      const assessmentData = ALL_ASSESSMENTS[domainId];
      if (!assessmentData) continue;
      const assessment = assessmentType === 'quick' ? assessmentData.quick : assessmentData.full;
      total += assessment.questions.length;
      const domainAnswers = batchAnswers[domainId] || {};
      answered += Object.keys(domainAnswers).length;
    }
    return { answered, total };
  };

  const submitBatchAssessments = () => {
    const now = new Date().toISOString();
    const newScores: Record<string, PsychometricScore> = { ...editedScores };
    const newCompleted = new Set(completedAssessments);
    let submittedCount = 0;

    for (const domainId of ALL_DOMAIN_IDS) {
      const assessmentData = ALL_ASSESSMENTS[domainId];
      if (!assessmentData) continue;

      const assessment = assessmentType === 'quick' ? assessmentData.quick : assessmentData.full;
      const domainAnswers = batchAnswers[domainId] || {};

      // Check if all questions for this domain are answered
      const allAnswered = assessment.questions.every((q) => domainAnswers[q.id] !== undefined);
      if (!allAnswered) continue;

      const score = assessment.calculateScore(domainAnswers);
      const isFullAssessment = assessment.questions.length > 1;
      // Pass answers to interpretation for subscale calculations
      const interpretation = assessment.interpretation(score, domainAnswers);

      newScores[domainId] = {
        score,
        confidence: isFullAssessment ? 0.9 : 0.7,
        lastUpdated: now,
        source: isFullAssessment ? 'assessment_full' : 'assessment_quick',
        interpretation, // Store the full interpretation with subscales
        answers: { ...domainAnswers }, // Store answers for later re-calculation
      };
      newCompleted.add(domainId);
      submittedCount++;
    }

    setEditedScores(newScores);
    setCompletedAssessments(newCompleted);
    setBatchAnswers({});
    setSuccess(`Submitted ${submittedCount} assessments! Your profile has been updated.`);
    setTimeout(() => setSuccess(null), 5000);
  };

  const getScoreColor = (score: number | undefined) => {
    if (score === undefined) return 'bg-muted';
    if (score >= 70) return 'bg-emerald-500';
    if (score >= 40) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const getConfidenceLabel = (confidence: number | undefined) => {
    if (confidence === undefined) return 'Unknown';
    if (confidence >= 0.8) return 'High';
    if (confidence >= 0.5) return 'Medium';
    return 'Low';
  };

  const getModeConfig = (mode: ProfileMode) => {
    switch (mode) {
      case 'auto':
        return {
          icon: Wand2,
          title: 'Option A: Auto-Discovery',
          description: 'System automatically infers your psychometric profile from your interactions. Values are updated continuously based on your behavior and responses.',
          color: 'from-purple-500 to-indigo-500',
        };
      case 'manual':
        return {
          icon: Edit3,
          title: 'Option B: Manual Entry',
          description: 'You set all values manually. These remain PERMANENT unless you change them. The system will NOT adjust these values.',
          color: 'from-blue-500 to-cyan-500',
        };
      case 'adaptive':
        return {
          icon: RefreshCw,
          title: 'Option C: Adaptive Entry',
          description: 'You set initial values, then the system adjusts them over time based on your interactions. Best of both worlds.',
          color: 'from-emerald-500 to-teal-500',
        };
      case 'assessment':
        return {
          icon: ClipboardCheck,
          title: 'Option D: Take Assessments',
          description: 'Complete validated psychological assessments to generate accurate values. Most scientifically rigorous option.',
          color: 'from-amber-500 to-orange-500',
        };
      default:
        return {
          icon: Eye,
          title: 'View Profile',
          description: 'View your current psychometric profile. Select a mode above to configure how your profile is built.',
          color: 'from-slate-500 to-slate-600',
        };
    }
  };

  const modeOptions: ProfileMode[] = ['view', 'auto', 'manual', 'adaptive', 'assessment'];

  // Check if we have sample users
  const hasNoUsers = !loading && learners.length === 0;

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

  // Show DB error state
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

      <main className="flex-1 px-8 py-10 max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg shadow-purple-500/25">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">
              Psychometric Profile
            </h1>
          </div>
          <p className="text-muted-foreground ml-14">
            Your psychological profile across 39 domains in 8 categories
          </p>
        </motion.div>

        {/* No Users Warning */}
        {hasNoUsers && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-6 glass-card bg-amber-500/10 border-amber-500/30"
          >
            <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-500" />
              No Users Found
            </h3>
            <p className="text-muted-foreground text-sm mb-4">
              No learner profiles exist yet. Create sample users with full psychometric profiles to test the system.
            </p>
            <button
              onClick={async () => {
                setProfileLoading(true);
                try {
                  // Seed demo learners directly using the hook
                  for (const learner of demoLearners) {
                    await createLearner(learner.userId, {
                      name: learner.name,
                      email: learner.email,
                      learningStyle: learner.learningStyle as any,
                      cognitiveProfile: learner.cognitiveProfile as any,
                      psychometricScores: learner.psychometricScores as any,
                      tags: learner.tags,
                      notes: learner.notes,
                    });
                  }
                  setSuccess('Sample users created successfully!');
                  setTimeout(() => setSuccess(null), 3000);
                } catch (err) {
                  setError('Failed to create sample users');
                }
                setProfileLoading(false);
              }}
              className="px-4 py-2 rounded-lg bg-amber-500 text-white font-medium hover:bg-amber-600 transition-colors"
            >
              Create Sample Users
            </button>
          </motion.div>
        )}

        {/* Learner Selector */}
        {!hasNoUsers && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="glass-card p-5 mb-6"
          >
            <div className="flex items-center gap-4 flex-wrap">
              <label className="font-medium text-foreground">Select Learner:</label>
              <select
                value={selectedLearnerId}
                onChange={(e) => setSelectedLearnerId(e.target.value)}
                className="form-input flex-1 max-w-xs"
              >
                {learners.map((learner) => (
                  <option key={learner.userId} value={learner.userId}>
                    {learner.name || learner.userId}
                  </option>
                ))}
              </select>
              {profile && (
                <span className="text-sm text-muted-foreground">
                  {Object.keys(profile.psychometricScores || {}).length} / 39 domains configured
                  {profile.profileMode && (
                    <span className="ml-2 px-2 py-0.5 rounded bg-primary/20 text-primary text-xs">
                      Mode: {profile.profileMode}
                    </span>
                  )}
                </span>
              )}
            </div>
          </motion.div>
        )}

        {/* Mode Selection - THIS IS THE KEY SELECTOR */}
        {!hasNoUsers && profile && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2 text-foreground">
                <Settings2 className="w-5 h-5 text-muted-foreground" />
                Profile Configuration Mode
                <span className="text-xs font-normal text-muted-foreground ml-2">
                  (Select ONE - this determines how your profile is built)
                </span>
              </h2>
              {modeConfirmed && activeMode !== 'view' && (
                <span className="flex items-center gap-1 text-sm text-emerald-500">
                  <Lock className="w-4 h-4" />
                  Mode Locked: {activeMode}
                </span>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {modeOptions.map((mode) => {
                const config = getModeConfig(mode);
                const Icon = config.icon;
                const isActive = activeMode === mode;
                const isLocked = modeConfirmed && profile.profileMode && profile.profileMode !== mode && mode !== 'view';

                return (
                  <motion.button
                    key={mode}
                    whileHover={!isLocked ? { scale: 1.02 } : {}}
                    whileTap={!isLocked ? { scale: 0.98 } : {}}
                    onClick={() => !isLocked && setActiveMode(mode)}
                    disabled={isLocked}
                    className={cn(
                      'p-4 rounded-xl border transition-all duration-200 text-left relative',
                      isActive
                        ? `bg-gradient-to-br ${config.color} text-white border-transparent shadow-lg`
                        : isLocked
                        ? 'bg-muted/50 border-border opacity-50 cursor-not-allowed'
                        : 'bg-secondary/50 hover:bg-secondary border-border'
                    )}
                  >
                    {isLocked && (
                      <div className="absolute top-2 right-2">
                        <Lock className="w-3 h-3 text-muted-foreground" />
                      </div>
                    )}
                    <Icon className={cn('w-6 h-6 mb-2', isActive ? 'text-white' : 'text-muted-foreground')} />
                    <div className={cn('text-sm font-medium', isActive ? 'text-white' : 'text-foreground')}>
                      {mode === 'view' ? 'View' : mode === 'auto' ? 'A: Auto' : mode === 'manual' ? 'B: Manual' : mode === 'adaptive' ? 'C: Adaptive' : 'D: Assess'}
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Mode Description */}
            <motion.div
              key={activeMode}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 rounded-xl bg-secondary/50 border border-border"
            >
              <div className="flex items-start gap-3">
                {(() => {
                  const Icon = getModeConfig(activeMode).icon;
                  return <Icon className="w-5 h-5 text-primary mt-0.5" />;
                })()}
                <div className="flex-1">
                  <h3 className="font-medium text-foreground">{getModeConfig(activeMode).title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{getModeConfig(activeMode).description}</p>
                </div>
                {activeMode !== 'view' && !modeConfirmed && (
                  <button
                    onClick={handleConfirmMode}
                    className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
                  >
                    <Lock className="w-4 h-4" />
                    Lock This Mode
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Status Messages */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-4 p-4 rounded-xl bg-destructive/10 border border-destructive/20 flex items-center gap-3"
            >
              <AlertCircle className="w-5 h-5 text-destructive" />
              <span className="text-destructive">{error}</span>
            </motion.div>
          )}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3"
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <span className="text-emerald-600 dark:text-emerald-400">{success}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Active Assessment Modal */}
        <AnimatePresence>
          {activeAssessment && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
              onClick={() => setActiveAssessment(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-background rounded-2xl p-6 max-w-2xl w-full max-h-[85vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-2">{activeAssessment.name}</h3>
                  <p className="text-sm text-muted-foreground">{activeAssessment.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Source: {activeAssessment.source}
                  </p>
                </div>

                {/* Scale Legend */}
                <div className="mb-6 p-3 rounded-xl bg-secondary/30 border border-border">
                  <div className="text-xs text-muted-foreground mb-2">Response Scale:</div>
                  <div className="flex flex-wrap gap-2">
                    {activeAssessment.scale.labels.map((label, idx) => (
                      <div key={idx} className="flex items-center gap-1 text-xs">
                        <span className="w-5 h-5 rounded bg-secondary flex items-center justify-center font-medium text-foreground">
                          {activeAssessment.scale.min + idx}
                        </span>
                        <span className="text-muted-foreground">{label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  {activeAssessment.questions.map((q, qIndex) => {
                    const scaleRange = Array.from(
                      { length: activeAssessment.scale.max - activeAssessment.scale.min + 1 },
                      (_, i) => activeAssessment.scale.min + i
                    );

                    return (
                      <div key={q.id} className="space-y-3">
                        <div className="flex gap-2">
                          <span className="text-xs text-muted-foreground w-6 pt-0.5">
                            {qIndex + 1}.
                          </span>
                          <p className="text-sm text-foreground flex-1">
                            {q.text}
                            {q.reverseScored && (
                              <span className="ml-1 text-xs text-amber-500">(R)</span>
                            )}
                          </p>
                        </div>
                        <div className="flex gap-2 ml-6">
                          {scaleRange.map((val) => (
                            <button
                              key={val}
                              onClick={() => setAssessmentAnswers((prev) => ({ ...prev, [q.id]: val }))}
                              className={cn(
                                'w-10 h-10 rounded-lg border transition-all text-sm font-medium',
                                assessmentAnswers[q.id] === val
                                  ? 'bg-primary text-white border-primary shadow-lg shadow-primary/25'
                                  : 'bg-secondary/50 hover:bg-secondary border-border'
                              )}
                            >
                              {val}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Progress */}
                <div className="mt-6 mb-4">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                    <span>Progress</span>
                    <span>{Object.keys(assessmentAnswers).length} / {activeAssessment.questions.length} answered</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${(Object.keys(assessmentAnswers).length / activeAssessment.questions.length) * 100}%`
                      }}
                      className="h-full bg-primary"
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setActiveAssessment(null)}
                    className="flex-1 px-4 py-2 rounded-lg border border-border hover:bg-secondary transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={submitAssessment}
                    disabled={Object.keys(assessmentAnswers).length < activeAssessment.questions.length}
                    className="flex-1 px-4 py-2 rounded-lg bg-primary text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Submit Assessment
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Assessment Mode - Show Available Assessments */}
        {activeMode === 'assessment' && !loading && profile && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 space-y-4"
          >
            {/* Assessment Type Toggle */}
            <div className="glass-card p-5">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h3 className="font-semibold text-foreground flex items-center gap-2">
                    <ClipboardCheck className="w-5 h-5 text-amber-500" />
                    Psychological Assessments
                  </h3>
                  <p className="text-muted-foreground text-sm mt-1">
                    Complete validated assessments for all 39 psychometric domains
                  </p>
                </div>
                <div className="flex items-center gap-4 flex-wrap">
                  {/* Assessment Type Toggle */}
                  <div className="flex items-center gap-2 bg-secondary/50 p-1 rounded-xl">
                    <button
                      onClick={() => setAssessmentType('quick')}
                      className={cn(
                        'px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2',
                        assessmentType === 'quick'
                          ? 'bg-primary text-white shadow-lg'
                          : 'hover:bg-secondary text-muted-foreground'
                      )}
                    >
                      <Zap className="w-4 h-4" />
                      Quick (1 Q)
                    </button>
                    <button
                      onClick={() => setAssessmentType('full')}
                      className={cn(
                        'px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2',
                        assessmentType === 'full'
                          ? 'bg-primary text-white shadow-lg'
                          : 'hover:bg-secondary text-muted-foreground'
                      )}
                    >
                      <FileText className="w-4 h-4" />
                      Full Test
                    </button>
                  </div>

                  {/* View Mode Toggle */}
                  <div className="flex items-center gap-2 bg-secondary/50 p-1 rounded-xl">
                    <button
                      onClick={() => setAssessmentViewMode('cards')}
                      className={cn(
                        'px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2',
                        assessmentViewMode === 'cards'
                          ? 'bg-amber-500 text-white shadow-lg'
                          : 'hover:bg-secondary text-muted-foreground'
                      )}
                    >
                      <LayoutGrid className="w-4 h-4" />
                      Cards
                    </button>
                    <button
                      onClick={() => setAssessmentViewMode('all')}
                      className={cn(
                        'px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2',
                        assessmentViewMode === 'all'
                          ? 'bg-amber-500 text-white shadow-lg'
                          : 'hover:bg-secondary text-muted-foreground'
                      )}
                    >
                      <List className="w-4 h-4" />
                      All Questions
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-3 rounded-xl bg-secondary/30 border border-border">
                <p className="text-xs text-muted-foreground">
                  {assessmentType === 'quick' ? (
                    <>
                      <strong className="text-foreground">Quick Mode:</strong> Single screening question per domain. Fast but lower confidence (~70%).
                    </>
                  ) : (
                    <>
                      <strong className="text-foreground">Full Test Mode:</strong> Complete validated instruments (TIPI, NEO-PI-R, GSE, SWLS, etc.). Takes longer but provides high confidence (~90%) results.
                    </>
                  )}
                </p>
              </div>

              {/* Progress Summary */}
              <div className="mt-4 flex items-center gap-4 text-sm">
                <span className="text-muted-foreground">Progress:</span>
                <span className="font-medium text-foreground">{completedAssessments.size} / 39 completed</span>
                <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(completedAssessments.size / 39) * 100}%` }}
                    className="h-full bg-gradient-to-r from-amber-500 to-orange-500"
                  />
                </div>
              </div>
            </div>

            {/* Cards View - Individual assessment cards */}
            {assessmentViewMode === 'cards' && ASSESSMENT_CATEGORIES.map((category) => {
              const categoryAssessments = category.domains
                .map((domainId) => ALL_ASSESSMENTS[domainId])
                .filter(Boolean);

              if (categoryAssessments.length === 0) return null;

              const completedInCategory = category.domains.filter((d) => completedAssessments.has(d)).length;

              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card p-5"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-foreground">{category.name}</h4>
                    <span className="text-xs text-muted-foreground">
                      {completedInCategory} / {category.domains.length} completed
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {category.domains.map((domainId) => {
                      const assessmentData = ALL_ASSESSMENTS[domainId];
                      if (!assessmentData) return null;

                      const assessment = assessmentType === 'quick' ? assessmentData.quick : assessmentData.full;
                      const isCompleted = completedAssessments.has(domainId);

                      return (
                        <button
                          key={domainId}
                          onClick={() => startAssessment(domainId)}
                          className={cn(
                            'p-4 rounded-xl border text-left transition-all hover:scale-[1.02]',
                            isCompleted
                              ? 'bg-emerald-500/10 border-emerald-500/30 hover:bg-emerald-500/15'
                              : 'bg-secondary/50 hover:bg-secondary border-border'
                          )}
                        >
                          <div className="flex items-start gap-3">
                            {isCompleted ? (
                              <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                            ) : (
                              <Circle className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-foreground text-sm truncate">
                                {assessment.shortName}
                              </div>
                              {isCompleted && editedScores[domainId] ? (
                                <div className="text-xs mt-1.5 space-y-1">
                                  {editedScores[domainId].interpretation ? (
                                    <div className="text-emerald-600 dark:text-emerald-400 leading-relaxed">
                                      {editedScores[domainId].interpretation}
                                    </div>
                                  ) : (
                                    <span className="text-emerald-500 font-medium">
                                      Score: {editedScores[domainId].score}
                                    </span>
                                  )}
                                  <div className="text-muted-foreground/70">
                                    Click to retake assessment
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <div className="text-xs text-muted-foreground mt-1">
                                    {assessment.questions.length} question{assessment.questions.length > 1 ? 's' : ''}
                                  </div>
                                  <div className="text-xs text-muted-foreground/70 mt-0.5 truncate">
                                    {assessment.source.split('(')[0].trim()}
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              );
            })}

            {/* All Questions View - Batch mode */}
            {assessmentViewMode === 'all' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-5"
              >
                {/* Batch Progress Header */}
                <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                      <h4 className="font-semibold text-foreground flex items-center gap-2">
                        <List className="w-5 h-5 text-amber-500" />
                        Answer All Questions
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Scroll through and answer as many questions as you like, then submit all at once
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-2xl font-bold text-foreground">
                          {getBatchProgress().answered} / {getBatchProgress().total}
                        </div>
                        <div className="text-xs text-muted-foreground">questions answered</div>
                      </div>
                      <button
                        onClick={submitBatchAssessments}
                        disabled={getBatchProgress().answered === 0}
                        className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium shadow-lg shadow-amber-500/25 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl transition-all"
                      >
                        <Send className="w-5 h-5" />
                        Submit All
                      </button>
                    </div>
                  </div>
                  <div className="mt-3 h-2 bg-secondary rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(getBatchProgress().answered / getBatchProgress().total) * 100}%` }}
                      className="h-full bg-gradient-to-r from-amber-500 to-orange-500"
                    />
                  </div>
                </div>

                {/* All Questions by Category */}
                <div className="space-y-8">
                  {ASSESSMENT_CATEGORIES.map((category) => {
                    const categoryDomains = category.domains.filter((d) => ALL_ASSESSMENTS[d]);
                    if (categoryDomains.length === 0) return null;

                    return (
                      <div key={category.id}>
                        <h4 className="font-semibold text-foreground mb-4 pb-2 border-b border-border">
                          {category.name}
                        </h4>
                        <div className="space-y-6">
                          {categoryDomains.map((domainId, domainIndex) => {
                            const assessmentData = ALL_ASSESSMENTS[domainId];
                            if (!assessmentData) return null;

                            const assessment = assessmentType === 'quick' ? assessmentData.quick : assessmentData.full;
                            const domainAnswers = batchAnswers[domainId] || {};
                            const isCompleted = completedAssessments.has(domainId);
                            const allAnswered = assessment.questions.every((q) => domainAnswers[q.id] !== undefined);

                            return (
                              <motion.div
                                key={domainId}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: domainIndex * 0.02 }}
                                className={cn(
                                  'p-4 rounded-xl border transition-all',
                                  isCompleted
                                    ? 'bg-emerald-500/5 border-emerald-500/20'
                                    : allAnswered
                                    ? 'bg-amber-500/5 border-amber-500/20'
                                    : 'bg-secondary/30 border-border'
                                )}
                              >
                                <div className="flex items-start justify-between gap-4 mb-3">
                                  <div className="flex items-center gap-2">
                                    {isCompleted ? (
                                      <CheckCircle className="w-5 h-5 text-emerald-500" />
                                    ) : allAnswered ? (
                                      <CheckCircle className="w-5 h-5 text-amber-500" />
                                    ) : (
                                      <Circle className="w-5 h-5 text-muted-foreground" />
                                    )}
                                    <div>
                                      <h5 className="font-medium text-foreground">{assessment.shortName}</h5>
                                      <p className="text-xs text-muted-foreground">{assessment.source.split('(')[0].trim()}</p>
                                    </div>
                                  </div>
                                  {isCompleted && editedScores[domainId] && (
                                    <div className="text-right">
                                      {editedScores[domainId].interpretation ? (
                                        <div className="px-3 py-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs max-w-xs text-left">
                                          {editedScores[domainId].interpretation}
                                        </div>
                                      ) : (
                                        <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm font-medium">
                                          Score: {editedScores[domainId].score}
                                        </span>
                                      )}
                                    </div>
                                  )}
                                </div>

                                {/* Questions */}
                                <div className="space-y-4">
                                  {assessment.questions.map((q, qIndex) => {
                                    const scaleRange = Array.from(
                                      { length: assessment.scale.max - assessment.scale.min + 1 },
                                      (_, i) => assessment.scale.min + i
                                    );
                                    const currentAnswer = domainAnswers[q.id];

                                    return (
                                      <div key={q.id} className="pl-7">
                                        <p className="text-sm text-foreground mb-2">
                                          <span className="text-muted-foreground mr-2">{qIndex + 1}.</span>
                                          {q.text}
                                          {q.reverseScored && (
                                            <span className="ml-1 text-xs text-amber-500">(R)</span>
                                          )}
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                          {scaleRange.map((val) => (
                                            <button
                                              key={val}
                                              onClick={() => handleBatchAnswer(domainId, q.id, val)}
                                              className={cn(
                                                'w-10 h-10 rounded-lg border transition-all text-sm font-medium',
                                                currentAnswer === val
                                                  ? 'bg-primary text-white border-primary shadow-lg shadow-primary/25'
                                                  : 'bg-secondary/50 hover:bg-secondary border-border hover:border-primary/50'
                                              )}
                                            >
                                              {val}
                                            </button>
                                          ))}
                                          {/* Scale labels hint */}
                                          <div className="flex items-center gap-2 ml-2 text-xs text-muted-foreground">
                                            <span>{assessment.scale.min} = {assessment.scale.labels[0]}</span>
                                            <span>•</span>
                                            <span>{assessment.scale.max} = {assessment.scale.labels[assessment.scale.labels.length - 1]}</span>
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </motion.div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Floating Submit Button */}
                {getBatchProgress().answered > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="sticky bottom-4 mt-6 p-4 rounded-xl bg-background/95 backdrop-blur border border-border shadow-xl"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <span className="font-medium text-foreground">{getBatchProgress().answered} questions answered</span>
                        <span className="text-muted-foreground text-sm ml-2">
                          ({Object.keys(batchAnswers).filter((d) => {
                            const assessment = assessmentType === 'quick' ? ALL_ASSESSMENTS[d]?.quick : ALL_ASSESSMENTS[d]?.full;
                            if (!assessment) return false;
                            const answers = batchAnswers[d] || {};
                            return assessment.questions.every((q) => answers[q.id] !== undefined);
                          }).length} domains complete)
                        </span>
                      </div>
                      <button
                        onClick={submitBatchAssessments}
                        className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium shadow-lg shadow-amber-500/25 flex items-center gap-2 hover:shadow-xl transition-all"
                      >
                        <Send className="w-5 h-5" />
                        Submit All Answers
                      </button>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Auto Discovery Notice */}
        {activeMode === 'auto' && !loading && profile && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-6 glass-card bg-purple-500/5 border-purple-500/20"
          >
            <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
              <Wand2 className="w-5 h-5 text-purple-500" />
              Auto-Discovery Mode Active
            </h3>
            <p className="text-muted-foreground text-sm">
              The system will analyze your interactions, writing patterns, and behavior to automatically infer and update your psychometric profile. Your current values are shown below.
            </p>
          </motion.div>
        )}

        {/* Save Button & Surprise Me (for editable modes) */}
        {(activeMode === 'manual' || activeMode === 'adaptive') && !loading && profile && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex justify-between items-center gap-4 flex-wrap"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSurpriseMe}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-medium shadow-lg shadow-pink-500/25 flex items-center gap-2"
            >
              <Shuffle className="w-5 h-5" />
              Surprise Me!
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={saveProfile}
              disabled={saving}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-purple-500 text-white font-medium shadow-lg shadow-primary/25 flex items-center gap-2 disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              {saving ? 'Saving...' : 'Save Profile'}
            </motion.button>
          </motion.div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="glass-card text-center py-16">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full mx-auto mb-4"
            />
            <p className="text-muted-foreground">Loading profile...</p>
          </div>
        )}

        {/* Legend / How to Read This Panel */}
        {!loading && profile && (activeMode === 'manual' || activeMode === 'adaptive' || activeMode === 'auto') && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 glass-card p-5"
          >
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-500" />
              How to Read Your Profile
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              {/* Score Explanation - Blue themed */}
              <div className="p-3 rounded-xl bg-blue-500/5 border border-blue-500/20">
                <div className="font-medium text-blue-600 dark:text-blue-400 mb-2 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  TRAIT SCORE (0-100)
                </div>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  Where you fall on each psychological trait. <strong>50 is average</strong>.
                  Drag the <span className="text-blue-500 font-medium">blue slider</span> to set your score.
                </p>
                <div className="flex items-center gap-2 mt-2 text-xs">
                  <span className="px-2 py-0.5 rounded bg-secondary text-muted-foreground">0-39: Low</span>
                  <span className="px-2 py-0.5 rounded bg-secondary text-muted-foreground">40-69: Mid</span>
                  <span className="px-2 py-0.5 rounded bg-secondary text-muted-foreground">70-100: High</span>
                </div>
              </div>

              {/* Data Quality / Confidence Explanation - Amber themed */}
              <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20">
                <div className="font-medium text-amber-600 dark:text-amber-400 mb-2 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  DATA QUALITY / CONFIDENCE (0-100)
                </div>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  How confident you are in your score. Drag the <span className="text-amber-500 font-medium">amber slider</span> to set confidence level. The more data points reinforcing a score, the higher the confidence.
                </p>
                <div className="flex items-center gap-2 mt-2 text-xs">
                  <span className="px-2 py-0.5 rounded bg-secondary text-muted-foreground">0-39: Low</span>
                  <span className="px-2 py-0.5 rounded bg-secondary text-muted-foreground">40-69: Mid</span>
                  <span className="px-2 py-0.5 rounded bg-secondary text-muted-foreground">70-100: High</span>
                </div>
              </div>

              {/* Subscales Explanation - Purple themed */}
              <div className="p-3 rounded-xl bg-purple-500/5 border border-purple-500/20">
                <div className="font-medium text-purple-600 dark:text-purple-400 mb-2 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-500" />
                  SUBSCALES
                </div>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  Some traits have multiple dimensions. Use the <span className="text-purple-500 font-medium">purple sliders</span> to set each subscale independently.
                </p>
                <div className="mt-2 text-xs text-muted-foreground">
                  <span className="font-medium">Domains with subscales:</span> Learning Styles (VARK), Emotional Intelligence, Attachment Style, Love Languages, Communication Style (DISC), Risk Tolerance, Interests (RIASEC), Social Support, Stress Coping
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Domain Categories */}
        {!loading && profile && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            {PSYCHOMETRIC_CATEGORIES.map((category) => {
              const isExpanded = expandedCategories.has(category.id);
              const Icon = category.icon;
              const categoryScores = category.domains.map((d) => editedScores[d.id]?.score).filter((s) => s !== undefined);
              const avgScore = categoryScores.length > 0
                ? Math.round(categoryScores.reduce((a, b) => a + b, 0) / categoryScores.length)
                : null;

              return (
                <motion.div
                  key={category.id}
                  variants={itemVariants}
                  className="glass-card overflow-hidden"
                >
                  {/* Category Header */}
                  <motion.button
                    whileHover={{ backgroundColor: 'rgba(0,0,0,0.02)' }}
                    onClick={() => toggleCategory(category.id)}
                    className="w-full p-5 flex items-center gap-4 text-left"
                  >
                    <div className={cn('p-2 rounded-xl bg-gradient-to-br', category.color)}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{category.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {categoryScores.length} / {category.domains.length} domains configured
                        {avgScore !== null && ` • Avg: ${avgScore}`}
                      </p>
                    </div>
                    <motion.div
                      animate={{ rotate: isExpanded ? 90 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    </motion.div>
                  </motion.button>

                  {/* Category Content */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 space-y-3">
                          {category.domains.map((domain) => {
                            const score = editedScores[domain.id];
                            const isEditable = activeMode === 'manual' || activeMode === 'adaptive' || activeMode === 'auto';
                            const hasAssessment = !!ALL_ASSESSMENTS[domain.id];

                            return (
                              <div
                                key={domain.id}
                                className="p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors"
                              >
                                <div className="flex items-start justify-between gap-4 mb-3">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                      <h4 className="font-medium text-foreground">{domain.name}</h4>
                                      {activeMode === 'assessment' && hasAssessment && (
                                        <button
                                          onClick={() => startAssessment(domain.id)}
                                          className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-600 dark:text-amber-400 text-xs flex items-center gap-1 hover:bg-amber-500/30 transition-colors"
                                        >
                                          <Play className="w-3 h-3" />
                                          {assessmentType === 'quick' ? 'Quick Test' : 'Full Test'}
                                        </button>
                                      )}
                                    </div>
                                    <p className="text-sm text-muted-foreground">{domain.description}</p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                      Assessment: {domain.assessmentInstrument}
                                    </p>
                                  </div>
                                  {score && (
                                    <div className="text-right flex items-center gap-4">
                                      {/* Score display - Blue themed */}
                                      <div className="text-center">
                                        <div className="text-xs text-blue-600 dark:text-blue-400 font-medium mb-0.5">
                                          {DOMAIN_SUBSCALES[domain.id] ? 'Avg' : 'Score'}
                                        </div>
                                        <div className={cn(
                                          'text-2xl font-bold',
                                          score.score >= 70 ? 'text-emerald-500' :
                                          score.score >= 40 ? 'text-amber-500' : 'text-red-500'
                                        )}>
                                          {score.score}
                                        </div>
                                        {DOMAIN_SUBSCALES[domain.id] && (
                                          <div className="text-[9px] text-muted-foreground -mt-0.5">from subscales</div>
                                        )}
                                      </div>
                                      {/* Confidence display - Amber themed, SEPARATE */}
                                      <div className="text-center border-l border-border pl-4">
                                        <div className="text-xs text-amber-600 dark:text-amber-400 font-medium mb-0.5">Confidence</div>
                                        <div className="text-2xl font-bold text-amber-500">
                                          {Math.round((score.confidence ?? 0.5) * 100)}
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>

                                {/* Score Bar / Editor */}
                                <div className="space-y-3">
                                  {/* ===== SCORE SECTION ===== */}
                                  {/* For domains WITH subscales: subscales ARE the data, no main score slider */}
                                  {/* For domains WITHOUT subscales: show editable score slider */}
                                  {!DOMAIN_SUBSCALES[domain.id] && (
                                  <div className={cn(
                                    'rounded-lg p-3',
                                    isEditable ? 'bg-blue-500/5 border border-blue-500/20' : ''
                                  )}>
                                    <div className="flex items-center gap-2 mb-2">
                                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                                      <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                                        TRAIT SCORE
                                      </span>
                                      <span className="text-xs text-muted-foreground ml-auto">
                                        Where you fall on this trait (0-100)
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                      <div className="flex-1 relative">
                                        {isEditable ? (
                                          // Visible styled slider with handle for editable modes
                                          <input
                                            type="range"
                                            min="0"
                                            max="100"
                                            value={score?.score || 50}
                                            onChange={(e) => handleScoreChange(domain.id, parseInt(e.target.value))}
                                            className="w-full h-3 rounded-full cursor-pointer appearance-none bg-secondary
                                              [&::-webkit-slider-thumb]:appearance-none
                                              [&::-webkit-slider-thumb]:w-5
                                              [&::-webkit-slider-thumb]:h-5
                                              [&::-webkit-slider-thumb]:rounded-full
                                              [&::-webkit-slider-thumb]:bg-blue-500
                                              [&::-webkit-slider-thumb]:border-2
                                              [&::-webkit-slider-thumb]:border-white
                                              [&::-webkit-slider-thumb]:shadow-lg
                                              [&::-webkit-slider-thumb]:cursor-grab
                                              [&::-webkit-slider-thumb]:active:cursor-grabbing
                                              [&::-webkit-slider-thumb]:hover:scale-110
                                              [&::-webkit-slider-thumb]:transition-transform
                                              [&::-moz-range-thumb]:w-5
                                              [&::-moz-range-thumb]:h-5
                                              [&::-moz-range-thumb]:rounded-full
                                              [&::-moz-range-thumb]:bg-blue-500
                                              [&::-moz-range-thumb]:border-2
                                              [&::-moz-range-thumb]:border-white
                                              [&::-moz-range-thumb]:shadow-lg
                                              [&::-moz-range-thumb]:cursor-grab"
                                            style={{
                                              background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${score?.score || 50}%, hsl(var(--secondary)) ${score?.score || 50}%, hsl(var(--secondary)) 100%)`
                                            }}
                                          />
                                        ) : (
                                          // Read-only progress bar for view mode
                                          <div className="h-3 bg-secondary rounded-full overflow-hidden">
                                            <motion.div
                                              initial={{ width: 0 }}
                                              animate={{ width: `${score?.score || 0}%` }}
                                              className={cn('h-full', getScoreColor(score?.score))}
                                            />
                                          </div>
                                        )}
                                      </div>
                                      <span className="text-lg font-bold w-14 text-right text-blue-600 dark:text-blue-400">
                                        {score?.score ?? 50}
                                      </span>
                                    </div>
                                    {/* Scale labels */}
                                    <div className="flex justify-between text-[10px] text-muted-foreground/60 px-1 mt-1">
                                      <span>Low (0)</span>
                                      <span>Average (50)</span>
                                      <span>High (100)</span>
                                    </div>
                                  </div>
                                  )}

                                  {/* ===== DATA QUALITY / CONFIDENCE SECTION (SEPARATE from score) ===== */}
                                  {isEditable && (
                                    <div className="rounded-lg p-3 bg-amber-500/5 border border-amber-500/20">
                                      <div className="flex items-center gap-2 mb-2">
                                        <div className="w-2 h-2 rounded-full bg-amber-500" />
                                        <span className="text-xs font-medium text-amber-600 dark:text-amber-400">
                                          DATA QUALITY / CONFIDENCE
                                        </span>
                                        <span className="text-xs text-muted-foreground ml-auto">
                                          How confident are you in this score? (0-100)
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-3">
                                        <div className="flex-1 relative">
                                          <input
                                            type="range"
                                            min="0"
                                            max="100"
                                            value={Math.round((score?.confidence ?? 0.5) * 100)}
                                            onChange={(e) => handleConfidenceChange(domain.id, parseInt(e.target.value) / 100)}
                                            className="w-full h-3 rounded-full cursor-pointer appearance-none bg-secondary
                                              [&::-webkit-slider-thumb]:appearance-none
                                              [&::-webkit-slider-thumb]:w-5
                                              [&::-webkit-slider-thumb]:h-5
                                              [&::-webkit-slider-thumb]:rounded-full
                                              [&::-webkit-slider-thumb]:bg-amber-500
                                              [&::-webkit-slider-thumb]:border-2
                                              [&::-webkit-slider-thumb]:border-white
                                              [&::-webkit-slider-thumb]:shadow-lg
                                              [&::-webkit-slider-thumb]:cursor-grab
                                              [&::-webkit-slider-thumb]:active:cursor-grabbing
                                              [&::-webkit-slider-thumb]:hover:scale-110
                                              [&::-webkit-slider-thumb]:transition-transform
                                              [&::-moz-range-thumb]:w-5
                                              [&::-moz-range-thumb]:h-5
                                              [&::-moz-range-thumb]:rounded-full
                                              [&::-moz-range-thumb]:bg-amber-500
                                              [&::-moz-range-thumb]:border-2
                                              [&::-moz-range-thumb]:border-white
                                              [&::-moz-range-thumb]:shadow-lg
                                              [&::-moz-range-thumb]:cursor-grab"
                                            style={{
                                              background: `linear-gradient(to right, #f59e0b 0%, #f59e0b ${(score?.confidence ?? 0.5) * 100}%, hsl(var(--secondary)) ${(score?.confidence ?? 0.5) * 100}%, hsl(var(--secondary)) 100%)`
                                            }}
                                          />
                                        </div>
                                        <span className="text-lg font-bold w-14 text-right text-amber-600 dark:text-amber-400">
                                          {Math.round((score?.confidence ?? 0.5) * 100)}
                                        </span>
                                      </div>
                                      {/* Scale labels */}
                                      <div className="flex justify-between text-[10px] text-muted-foreground/60 px-1 mt-1">
                                        <span>Low (0)</span>
                                        <span>Medium (50)</span>
                                        <span>High (100)</span>
                                      </div>
                                    </div>
                                  )}

                                  {/* ===== SUBSCALE SLIDERS (for domains that have them) ===== */}
                                  {isEditable && DOMAIN_SUBSCALES[domain.id] && (
                                    <div className="rounded-lg p-3 bg-purple-500/5 border border-purple-500/20">
                                      <div className="flex items-center gap-2 mb-3">
                                        <div className="w-2 h-2 rounded-full bg-purple-500" />
                                        <span className="text-xs font-medium text-purple-600 dark:text-purple-400">
                                          SUBSCALES
                                        </span>
                                        <span className="text-xs text-muted-foreground ml-auto">
                                          Breakdown by dimension
                                        </span>
                                      </div>
                                      <div className="space-y-3">
                                        {DOMAIN_SUBSCALES[domain.id].map((subscale) => {
                                          const subscaleValue = score?.subscales?.[subscale.id] ?? 50;
                                          return (
                                            <div key={subscale.id} className="space-y-1">
                                              <div className="flex items-center justify-between">
                                                <span className="text-xs font-medium text-foreground">{subscale.label}</span>
                                                <span className="text-xs font-bold text-purple-600 dark:text-purple-400">{subscaleValue}</span>
                                              </div>
                                              {subscale.description && (
                                                <p className="text-[10px] text-muted-foreground -mt-0.5">{subscale.description}</p>
                                              )}
                                              <input
                                                type="range"
                                                min="0"
                                                max="100"
                                                value={subscaleValue}
                                                onChange={(e) => {
                                                  const newValue = parseInt(e.target.value);
                                                  setEditedScores((prev) => {
                                                    // Build updated subscales object
                                                    const updatedSubscales = {
                                                      ...(prev[domain.id]?.subscales || {}),
                                                      [subscale.id]: newValue,
                                                    };

                                                    // Auto-calculate main score from subscales (average)
                                                    const domainSubscales = DOMAIN_SUBSCALES[domain.id];
                                                    const subscaleValues = domainSubscales.map(
                                                      (s) => updatedSubscales[s.id] ?? 50
                                                    );
                                                    const computedScore = Math.round(
                                                      subscaleValues.reduce((sum, v) => sum + v, 0) / subscaleValues.length
                                                    );

                                                    return {
                                                      ...prev,
                                                      [domain.id]: {
                                                        ...prev[domain.id],
                                                        score: computedScore, // Auto-computed from subscales
                                                        confidence: prev[domain.id]?.confidence ?? 0.5,
                                                        lastUpdated: new Date().toISOString(),
                                                        subscales: updatedSubscales,
                                                      },
                                                    };
                                                  });
                                                }}
                                                className="w-full h-2 rounded-full cursor-pointer appearance-none bg-secondary
                                                  [&::-webkit-slider-thumb]:appearance-none
                                                  [&::-webkit-slider-thumb]:w-4
                                                  [&::-webkit-slider-thumb]:h-4
                                                  [&::-webkit-slider-thumb]:rounded-full
                                                  [&::-webkit-slider-thumb]:bg-purple-500
                                                  [&::-webkit-slider-thumb]:border-2
                                                  [&::-webkit-slider-thumb]:border-white
                                                  [&::-webkit-slider-thumb]:shadow-md
                                                  [&::-webkit-slider-thumb]:cursor-grab
                                                  [&::-moz-range-thumb]:w-4
                                                  [&::-moz-range-thumb]:h-4
                                                  [&::-moz-range-thumb]:rounded-full
                                                  [&::-moz-range-thumb]:bg-purple-500
                                                  [&::-moz-range-thumb]:border-2
                                                  [&::-moz-range-thumb]:border-white
                                                  [&::-moz-range-thumb]:shadow-md
                                                  [&::-moz-range-thumb]:cursor-grab"
                                                style={{
                                                  background: `linear-gradient(to right, #a855f7 0%, #a855f7 ${subscaleValue}%, hsl(var(--secondary)) ${subscaleValue}%, hsl(var(--secondary)) 100%)`
                                                }}
                                              />
                                            </div>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  )}

                                  {/* Categorical options */}
                                  {domain.scoreType === 'categorical' && domain.categories && (
                                    <div className="mt-2">
                                      <span className="text-xs text-muted-foreground">Categories:</span>
                                      <div className="flex flex-wrap gap-1.5 mt-1">
                                        {domain.categories.map((cat) => (
                                          <span
                                            key={cat}
                                            className="px-2 py-0.5 rounded-lg bg-muted/50 text-xs text-muted-foreground capitalize"
                                          >
                                            {cat.replace(/_/g, ' ')}
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  {/* Interpretation (from assessment) */}
                                  {score?.interpretation && (
                                    <div className="mt-3 p-3 rounded-lg bg-primary/5 border border-primary/10">
                                      <div className="text-xs font-medium text-primary mb-1">Assessment Result:</div>
                                      <p className="text-sm text-foreground/90 leading-relaxed">
                                        {score.interpretation}
                                      </p>
                                    </div>
                                  )}

                                  {/* Source & Last Updated */}
                                  {score && (
                                    <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                                      {score.source && (
                                        <span>Source: {score.source.replace(/_/g, ' ')}</span>
                                      )}
                                      <span>
                                        Updated: {new Date(score.lastUpdated).toLocaleDateString()}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Summary Stats */}
        {!loading && profile && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 glass-card p-6"
          >
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-500" />
              Profile Summary
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-secondary/50">
                <div className="text-3xl font-bold text-foreground">
                  {Object.keys(editedScores).length}
                </div>
                <div className="text-sm text-muted-foreground">Domains Configured</div>
              </div>
              <div className="p-4 rounded-xl bg-secondary/50">
                <div className="text-3xl font-bold text-foreground">
                  {39 - Object.keys(editedScores).length}
                </div>
                <div className="text-sm text-muted-foreground">Remaining</div>
              </div>
              <div className="p-4 rounded-xl bg-secondary/50">
                <div className="text-3xl font-bold text-foreground">
                  {Object.values(editedScores).filter((s) => s.confidence >= 0.8).length}
                </div>
                <div className="text-sm text-muted-foreground">High Confidence</div>
              </div>
              <div className="p-4 rounded-xl bg-secondary/50">
                <div className="text-3xl font-bold text-foreground">
                  {Math.round((Object.keys(editedScores).length / 39) * 100)}%
                </div>
                <div className="text-sm text-muted-foreground">Complete</div>
              </div>
            </div>

            {/* Learning Style Derived */}
            {profile.learningStyle && (
              <div className="mt-6 p-4 rounded-xl bg-purple-500/10">
                <h4 className="font-medium text-foreground mb-2">Derived Learning Style</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Primary:</span>{' '}
                    <span className="font-medium text-foreground capitalize">{profile.learningStyle.primary}</span>
                  </div>
                  {profile.learningStyle.secondary && (
                    <div>
                      <span className="text-muted-foreground">Secondary:</span>{' '}
                      <span className="font-medium text-foreground capitalize">{profile.learningStyle.secondary}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-muted-foreground">Social:</span>{' '}
                    <span className="font-medium text-foreground capitalize">{profile.learningStyle.socialPreference}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Pace:</span>{' '}
                    <span className="font-medium text-foreground capitalize">{profile.learningStyle.pacePreference}</span>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </main>
    </div>
  );
}
