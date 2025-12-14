/**
 * Psychometric Domain Definitions
 * 39 psychological domains for learner profiling
 * Based on research-backed psychometric instruments
 */

// =============================================================================
// DOMAIN IDS - The 39 psychometric domains
// =============================================================================

export const PSYCHOMETRIC_DOMAINS = {
  // Big Five Personality (5 domains)
  BIG_FIVE_OPENNESS: 'big_five_openness',
  BIG_FIVE_CONSCIENTIOUSNESS: 'big_five_conscientiousness',
  BIG_FIVE_EXTRAVERSION: 'big_five_extraversion',
  BIG_FIVE_AGREEABLENESS: 'big_five_agreeableness',
  BIG_FIVE_NEUROTICISM: 'big_five_neuroticism',

  // Dark Triad (3 domains)
  DARK_TRIAD_NARCISSISM: 'dark_triad_narcissism',
  DARK_TRIAD_MACHIAVELLIANISM: 'dark_triad_machiavellianism',
  DARK_TRIAD_PSYCHOPATHY: 'dark_triad_psychopathy',

  // Emotional Intelligence (4 domains)
  EMOTIONAL_EMPATHY: 'emotional_empathy',
  EMOTIONAL_INTELLIGENCE: 'emotional_intelligence',
  ATTACHMENT_STYLE: 'attachment_style',
  LOVE_LANGUAGES: 'love_languages',

  // Communication & Social (2 domains)
  COMMUNICATION_STYLE: 'communication_style',
  SOCIAL_SUPPORT: 'social_support',

  // Decision Making & Risk (4 domains)
  RISK_TOLERANCE: 'risk_tolerance',
  DECISION_STYLE: 'decision_style',
  TIME_ORIENTATION: 'time_orientation',
  LOCUS_OF_CONTROL: 'locus_of_control',

  // Motivation & Achievement (4 domains)
  ACHIEVEMENT_MOTIVATION: 'achievement_motivation',
  SELF_EFFICACY: 'self_efficacy',
  GROWTH_MINDSET: 'growth_mindset',
  AUTHENTICITY: 'authenticity',

  // Values & Interests (3 domains)
  PERSONAL_VALUES: 'personal_values',
  INTERESTS: 'interests',
  LIFE_SATISFACTION: 'life_satisfaction',

  // Coping & Wellbeing (1 domain)
  STRESS_COPING: 'stress_coping',

  // Cognitive (6 domains)
  COGNITIVE_ABILITIES: 'cognitive_abilities',
  CREATIVITY: 'creativity',
  LEARNING_STYLES: 'learning_styles',
  INFORMATION_PROCESSING: 'information_processing',
  METACOGNITION: 'metacognition',
  EXECUTIVE_FUNCTIONS: 'executive_functions',

  // Social Cognition (1 domain)
  SOCIAL_COGNITION: 'social_cognition',

  // Worldview (3 domains)
  POLITICAL_IDEOLOGY: 'political_ideology',
  CULTURAL_VALUES: 'cultural_values',
  MORAL_REASONING: 'moral_reasoning',

  // Work & Lifestyle (3 domains)
  WORK_CAREER_STYLE: 'work_career_style',
  SENSORY_PROCESSING: 'sensory_processing',
  AESTHETIC_PREFERENCES: 'aesthetic_preferences',
} as const;

export type PsychometricDomainId = typeof PSYCHOMETRIC_DOMAINS[keyof typeof PSYCHOMETRIC_DOMAINS];

// Array of all domain IDs for iteration
export const ALL_DOMAIN_IDS: PsychometricDomainId[] = Object.values(PSYCHOMETRIC_DOMAINS);

// =============================================================================
// DOMAIN METADATA
// =============================================================================

export interface DomainMetadata {
  id: PsychometricDomainId;
  name: string;
  category: string;
  description: string;
  scoreInterpretation: {
    low: string;   // What low score (0-33) means
    mid: string;   // What mid score (34-66) means
    high: string;  // What high score (67-100) means
  };
  educationalRelevance: string;
}

export const DOMAIN_METADATA: Record<PsychometricDomainId, DomainMetadata> = {
  // Big Five
  [PSYCHOMETRIC_DOMAINS.BIG_FIVE_OPENNESS]: {
    id: PSYCHOMETRIC_DOMAINS.BIG_FIVE_OPENNESS,
    name: 'Openness to Experience',
    category: 'Big Five Personality',
    description: 'Curiosity, creativity, and preference for novelty and variety',
    scoreInterpretation: {
      low: 'Prefers routine, practical, conventional approaches',
      mid: 'Balanced between tradition and novelty',
      high: 'Curious, creative, enjoys abstract thinking and new ideas',
    },
    educationalRelevance: 'High openness → enjoys theoretical content, interdisciplinary connections, creative assignments',
  },
  [PSYCHOMETRIC_DOMAINS.BIG_FIVE_CONSCIENTIOUSNESS]: {
    id: PSYCHOMETRIC_DOMAINS.BIG_FIVE_CONSCIENTIOUSNESS,
    name: 'Conscientiousness',
    category: 'Big Five Personality',
    description: 'Organization, dependability, self-discipline, and goal-directed behavior',
    scoreInterpretation: {
      low: 'Flexible, spontaneous, may struggle with structure',
      mid: 'Moderate organization and planning',
      high: 'Organized, disciplined, achievement-oriented',
    },
    educationalRelevance: 'High conscientiousness → benefits from structured curricula, checklists, clear deadlines',
  },
  [PSYCHOMETRIC_DOMAINS.BIG_FIVE_EXTRAVERSION]: {
    id: PSYCHOMETRIC_DOMAINS.BIG_FIVE_EXTRAVERSION,
    name: 'Extraversion',
    category: 'Big Five Personality',
    description: 'Sociability, assertiveness, and tendency to seek stimulation',
    scoreInterpretation: {
      low: 'Reserved, prefers solitary activities, reflective',
      mid: 'Flexible between social and solo activities',
      high: 'Outgoing, energetic, seeks social interaction',
    },
    educationalRelevance: 'High extraversion → thrives in group work, discussions; Low → prefers independent study',
  },
  [PSYCHOMETRIC_DOMAINS.BIG_FIVE_AGREEABLENESS]: {
    id: PSYCHOMETRIC_DOMAINS.BIG_FIVE_AGREEABLENESS,
    name: 'Agreeableness',
    category: 'Big Five Personality',
    description: 'Cooperation, trust, and consideration for others',
    scoreInterpretation: {
      low: 'Competitive, skeptical, prioritizes self-interest',
      mid: 'Balanced cooperation and assertiveness',
      high: 'Cooperative, trusting, helpful, harmonious',
    },
    educationalRelevance: 'High agreeableness → collaborative learning, peer tutoring; Low → competitive challenges',
  },
  [PSYCHOMETRIC_DOMAINS.BIG_FIVE_NEUROTICISM]: {
    id: PSYCHOMETRIC_DOMAINS.BIG_FIVE_NEUROTICISM,
    name: 'Neuroticism',
    category: 'Big Five Personality',
    description: 'Emotional instability, anxiety, and negative affect tendency',
    scoreInterpretation: {
      low: 'Emotionally stable, calm, resilient',
      mid: 'Moderate emotional reactivity',
      high: 'Prone to anxiety, stress, and negative emotions',
    },
    educationalRelevance: 'High neuroticism → needs supportive feedback, lower-stakes practice, anxiety management',
  },

  // Dark Triad
  [PSYCHOMETRIC_DOMAINS.DARK_TRIAD_NARCISSISM]: {
    id: PSYCHOMETRIC_DOMAINS.DARK_TRIAD_NARCISSISM,
    name: 'Narcissism',
    category: 'Dark Triad',
    description: 'Self-importance, need for admiration, and sense of entitlement',
    scoreInterpretation: {
      low: 'Modest, collaborative, low need for recognition',
      mid: 'Healthy self-esteem',
      high: 'Strong need for recognition and admiration',
    },
    educationalRelevance: 'High narcissism → motivated by recognition, leaderboards, visible achievements',
  },
  [PSYCHOMETRIC_DOMAINS.DARK_TRIAD_MACHIAVELLIANISM]: {
    id: PSYCHOMETRIC_DOMAINS.DARK_TRIAD_MACHIAVELLIANISM,
    name: 'Machiavellianism',
    category: 'Dark Triad',
    description: 'Strategic thinking, pragmatism, and focus on self-interest',
    scoreInterpretation: {
      low: 'Trusting, straightforward, values fairness',
      mid: 'Balanced pragmatism',
      high: 'Strategic, calculating, outcome-focused',
    },
    educationalRelevance: 'High Mach → motivated by clear ROI, practical applications, strategic value',
  },
  [PSYCHOMETRIC_DOMAINS.DARK_TRIAD_PSYCHOPATHY]: {
    id: PSYCHOMETRIC_DOMAINS.DARK_TRIAD_PSYCHOPATHY,
    name: 'Psychopathy',
    category: 'Dark Triad',
    description: 'Boldness, fearlessness, and reduced emotional reactivity',
    scoreInterpretation: {
      low: 'Empathetic, risk-averse, emotionally responsive',
      mid: 'Moderate fearlessness',
      high: 'Bold, fearless, emotionally detached',
    },
    educationalRelevance: 'High psychopathy → unfazed by failure, may need explicit ethical frameworks',
  },

  // Emotional Intelligence
  [PSYCHOMETRIC_DOMAINS.EMOTIONAL_EMPATHY]: {
    id: PSYCHOMETRIC_DOMAINS.EMOTIONAL_EMPATHY,
    name: 'Empathy',
    category: 'Emotional Intelligence',
    description: 'Ability to understand and share the feelings of others',
    scoreInterpretation: {
      low: 'Difficulty reading emotional cues',
      mid: 'Moderate emotional attunement',
      high: 'Highly attuned to others\' emotions',
    },
    educationalRelevance: 'High empathy → benefits from case studies, human stories; Low → prefers data-driven content',
  },
  [PSYCHOMETRIC_DOMAINS.EMOTIONAL_INTELLIGENCE]: {
    id: PSYCHOMETRIC_DOMAINS.EMOTIONAL_INTELLIGENCE,
    name: 'Emotional Intelligence',
    category: 'Emotional Intelligence',
    description: 'Ability to perceive, use, understand, and manage emotions',
    scoreInterpretation: {
      low: 'May struggle with emotional self-regulation',
      mid: 'Developing emotional awareness',
      high: 'Strong emotional awareness and regulation',
    },
    educationalRelevance: 'High EI → self-directed learning; Low EI → may need more emotional scaffolding',
  },
  [PSYCHOMETRIC_DOMAINS.ATTACHMENT_STYLE]: {
    id: PSYCHOMETRIC_DOMAINS.ATTACHMENT_STYLE,
    name: 'Attachment Style',
    category: 'Emotional Intelligence',
    description: 'Pattern of relating to others in close relationships',
    scoreInterpretation: {
      low: 'Avoidant - prefers independence, discomfort with closeness',
      mid: 'Secure - comfortable with intimacy and autonomy',
      high: 'Anxious - seeks closeness, worries about rejection',
    },
    educationalRelevance: 'Affects mentor relationships, group dynamics, help-seeking behavior',
  },
  [PSYCHOMETRIC_DOMAINS.LOVE_LANGUAGES]: {
    id: PSYCHOMETRIC_DOMAINS.LOVE_LANGUAGES,
    name: 'Love Languages',
    category: 'Emotional Intelligence',
    description: 'Preferred ways of expressing and receiving appreciation',
    scoreInterpretation: {
      low: 'Less responsive to verbal/expressed appreciation',
      mid: 'Mixed appreciation preferences',
      high: 'Highly responsive to expressed appreciation',
    },
    educationalRelevance: 'Informs feedback style - words of affirmation, quality time, acts of service',
  },

  // Communication & Social
  [PSYCHOMETRIC_DOMAINS.COMMUNICATION_STYLE]: {
    id: PSYCHOMETRIC_DOMAINS.COMMUNICATION_STYLE,
    name: 'Communication Style',
    category: 'Communication & Social',
    description: 'Preferred mode and style of communication',
    scoreInterpretation: {
      low: 'Reserved, indirect communication',
      mid: 'Adaptable communication style',
      high: 'Direct, assertive communication',
    },
    educationalRelevance: 'Affects preference for written vs verbal, direct vs exploratory instruction',
  },
  [PSYCHOMETRIC_DOMAINS.SOCIAL_SUPPORT]: {
    id: PSYCHOMETRIC_DOMAINS.SOCIAL_SUPPORT,
    name: 'Social Support',
    category: 'Communication & Social',
    description: 'Perception of available support from social networks',
    scoreInterpretation: {
      low: 'Limited perceived support network',
      mid: 'Moderate support availability',
      high: 'Strong perceived support network',
    },
    educationalRelevance: 'Low support → may benefit from peer matching, community features',
  },

  // Decision Making & Risk
  [PSYCHOMETRIC_DOMAINS.RISK_TOLERANCE]: {
    id: PSYCHOMETRIC_DOMAINS.RISK_TOLERANCE,
    name: 'Risk Tolerance',
    category: 'Decision Making & Risk',
    description: 'Willingness to accept uncertainty and potential losses',
    scoreInterpretation: {
      low: 'Risk-averse, prefers certainty',
      mid: 'Moderate risk tolerance',
      high: 'Risk-seeking, comfortable with uncertainty',
    },
    educationalRelevance: 'High risk tolerance → open to challenging problems; Low → needs safe practice space',
  },
  [PSYCHOMETRIC_DOMAINS.DECISION_STYLE]: {
    id: PSYCHOMETRIC_DOMAINS.DECISION_STYLE,
    name: 'Decision Style',
    category: 'Decision Making & Risk',
    description: 'Approach to making decisions (intuitive vs analytical)',
    scoreInterpretation: {
      low: 'Intuitive, gut-feeling decisions',
      mid: 'Mixed decision approach',
      high: 'Analytical, data-driven decisions',
    },
    educationalRelevance: 'Analytical → appreciates data, evidence; Intuitive → benefits from examples, analogies',
  },
  [PSYCHOMETRIC_DOMAINS.TIME_ORIENTATION]: {
    id: PSYCHOMETRIC_DOMAINS.TIME_ORIENTATION,
    name: 'Time Orientation',
    category: 'Decision Making & Risk',
    description: 'Focus on past, present, or future',
    scoreInterpretation: {
      low: 'Past-focused, values tradition and experience',
      mid: 'Present-focused, lives in the moment',
      high: 'Future-focused, plans ahead',
    },
    educationalRelevance: 'Future-oriented → motivated by long-term goals; Present → needs immediate relevance',
  },
  [PSYCHOMETRIC_DOMAINS.LOCUS_OF_CONTROL]: {
    id: PSYCHOMETRIC_DOMAINS.LOCUS_OF_CONTROL,
    name: 'Locus of Control',
    category: 'Decision Making & Risk',
    description: 'Belief about control over life outcomes',
    scoreInterpretation: {
      low: 'External - believes outcomes controlled by outside forces',
      mid: 'Balanced attribution',
      high: 'Internal - believes in personal control over outcomes',
    },
    educationalRelevance: 'Internal → self-directed learning; External → may need more guidance and attribution retraining',
  },

  // Motivation & Achievement
  [PSYCHOMETRIC_DOMAINS.ACHIEVEMENT_MOTIVATION]: {
    id: PSYCHOMETRIC_DOMAINS.ACHIEVEMENT_MOTIVATION,
    name: 'Achievement Motivation',
    category: 'Motivation & Achievement',
    description: 'Drive to accomplish challenging goals and excel',
    scoreInterpretation: {
      low: 'Content with current abilities, less driven by achievement',
      mid: 'Moderate achievement drive',
      high: 'Strong drive to excel and achieve',
    },
    educationalRelevance: 'High achievement motivation → responds to challenges, mastery goals, progress tracking',
  },
  [PSYCHOMETRIC_DOMAINS.SELF_EFFICACY]: {
    id: PSYCHOMETRIC_DOMAINS.SELF_EFFICACY,
    name: 'Self-Efficacy',
    category: 'Motivation & Achievement',
    description: 'Belief in one\'s ability to succeed in specific situations',
    scoreInterpretation: {
      low: 'Low confidence in abilities, avoids challenges',
      mid: 'Moderate self-belief',
      high: 'Strong belief in ability to succeed',
    },
    educationalRelevance: 'Low self-efficacy → needs scaffolding, success experiences, encouragement',
  },
  [PSYCHOMETRIC_DOMAINS.GROWTH_MINDSET]: {
    id: PSYCHOMETRIC_DOMAINS.GROWTH_MINDSET,
    name: 'Growth Mindset',
    category: 'Motivation & Achievement',
    description: 'Belief that abilities can be developed through effort',
    scoreInterpretation: {
      low: 'Fixed mindset - abilities are static',
      mid: 'Mixed beliefs about ability',
      high: 'Growth mindset - abilities develop with effort',
    },
    educationalRelevance: 'Growth mindset → embraces challenges; Fixed → may avoid difficulty, needs mindset interventions',
  },
  [PSYCHOMETRIC_DOMAINS.AUTHENTICITY]: {
    id: PSYCHOMETRIC_DOMAINS.AUTHENTICITY,
    name: 'Authenticity',
    category: 'Motivation & Achievement',
    description: 'Degree of self-awareness and genuine self-expression',
    scoreInterpretation: {
      low: 'May suppress true self, conformist',
      mid: 'Moderate self-expression',
      high: 'Strong self-awareness and authentic expression',
    },
    educationalRelevance: 'High authenticity → self-directed goals; Low → may need help identifying genuine interests',
  },

  // Values & Interests
  [PSYCHOMETRIC_DOMAINS.PERSONAL_VALUES]: {
    id: PSYCHOMETRIC_DOMAINS.PERSONAL_VALUES,
    name: 'Personal Values',
    category: 'Values & Interests',
    description: 'Core beliefs and priorities guiding behavior',
    scoreInterpretation: {
      low: 'Practical, security-focused values',
      mid: 'Balanced value system',
      high: 'Idealistic, self-transcendent values',
    },
    educationalRelevance: 'Connects learning to personal values increases motivation and engagement',
  },
  [PSYCHOMETRIC_DOMAINS.INTERESTS]: {
    id: PSYCHOMETRIC_DOMAINS.INTERESTS,
    name: 'Interests',
    category: 'Values & Interests',
    description: 'Areas of curiosity and preferred activities',
    scoreInterpretation: {
      low: 'Narrow, specialized interests',
      mid: 'Moderate interest breadth',
      high: 'Broad, diverse interests',
    },
    educationalRelevance: 'Interest mapping enables personalized content recommendations and examples',
  },
  [PSYCHOMETRIC_DOMAINS.LIFE_SATISFACTION]: {
    id: PSYCHOMETRIC_DOMAINS.LIFE_SATISFACTION,
    name: 'Life Satisfaction',
    category: 'Values & Interests',
    description: 'Overall contentment with life circumstances',
    scoreInterpretation: {
      low: 'Dissatisfied, may be seeking change',
      mid: 'Moderately satisfied',
      high: 'High life satisfaction',
    },
    educationalRelevance: 'Low satisfaction → learning may be escape or improvement-seeking; affects motivation framing',
  },

  // Coping & Wellbeing
  [PSYCHOMETRIC_DOMAINS.STRESS_COPING]: {
    id: PSYCHOMETRIC_DOMAINS.STRESS_COPING,
    name: 'Stress Coping',
    category: 'Coping & Wellbeing',
    description: 'Strategies for managing stress and adversity',
    scoreInterpretation: {
      low: 'Avoidant or maladaptive coping',
      mid: 'Mixed coping strategies',
      high: 'Effective, adaptive coping strategies',
    },
    educationalRelevance: 'Poor coping → needs breaks, stress management, lower cognitive load during stress',
  },

  // Cognitive
  [PSYCHOMETRIC_DOMAINS.COGNITIVE_ABILITIES]: {
    id: PSYCHOMETRIC_DOMAINS.COGNITIVE_ABILITIES,
    name: 'Cognitive Abilities',
    category: 'Cognitive',
    description: 'General mental capabilities including reasoning and problem-solving',
    scoreInterpretation: {
      low: 'May need more scaffolding and concrete examples',
      mid: 'Average cognitive processing',
      high: 'Strong reasoning and problem-solving abilities',
    },
    educationalRelevance: 'Affects pace, complexity, and abstraction level of content',
  },
  [PSYCHOMETRIC_DOMAINS.CREATIVITY]: {
    id: PSYCHOMETRIC_DOMAINS.CREATIVITY,
    name: 'Creativity',
    category: 'Cognitive',
    description: 'Ability to generate novel and useful ideas',
    scoreInterpretation: {
      low: 'Prefers established approaches',
      mid: 'Moderate creative tendencies',
      high: 'Highly creative, divergent thinking',
    },
    educationalRelevance: 'High creativity → open-ended projects; Low → structured assignments with clear criteria',
  },
  [PSYCHOMETRIC_DOMAINS.LEARNING_STYLES]: {
    id: PSYCHOMETRIC_DOMAINS.LEARNING_STYLES,
    name: 'Learning Styles',
    category: 'Cognitive',
    description: 'Preferred modalities for acquiring information (VARK)',
    scoreInterpretation: {
      low: 'Reading/Writing preference',
      mid: 'Multimodal learner',
      high: 'Visual/Kinesthetic preference',
    },
    educationalRelevance: 'Direct content format selection - videos, text, hands-on activities',
  },
  [PSYCHOMETRIC_DOMAINS.INFORMATION_PROCESSING]: {
    id: PSYCHOMETRIC_DOMAINS.INFORMATION_PROCESSING,
    name: 'Information Processing',
    category: 'Cognitive',
    description: 'How information is encoded, stored, and retrieved',
    scoreInterpretation: {
      low: 'Sequential, step-by-step processing',
      mid: 'Mixed processing style',
      high: 'Holistic, big-picture processing',
    },
    educationalRelevance: 'Sequential → linear curricula; Holistic → concept maps, overviews first',
  },
  [PSYCHOMETRIC_DOMAINS.METACOGNITION]: {
    id: PSYCHOMETRIC_DOMAINS.METACOGNITION,
    name: 'Metacognition',
    category: 'Cognitive',
    description: 'Awareness and control of one\'s own thinking processes',
    scoreInterpretation: {
      low: 'Limited self-awareness of learning',
      mid: 'Developing metacognitive skills',
      high: 'Strong awareness of learning processes',
    },
    educationalRelevance: 'High metacognition → self-regulated learning; Low → needs explicit strategy instruction',
  },
  [PSYCHOMETRIC_DOMAINS.EXECUTIVE_FUNCTIONS]: {
    id: PSYCHOMETRIC_DOMAINS.EXECUTIVE_FUNCTIONS,
    name: 'Executive Functions',
    category: 'Cognitive',
    description: 'Mental skills for planning, focus, and task management',
    scoreInterpretation: {
      low: 'May struggle with planning and focus',
      mid: 'Adequate executive function',
      high: 'Strong planning, focus, and task management',
    },
    educationalRelevance: 'Low EF → needs external structure, reminders, chunked tasks',
  },

  // Social Cognition
  [PSYCHOMETRIC_DOMAINS.SOCIAL_COGNITION]: {
    id: PSYCHOMETRIC_DOMAINS.SOCIAL_COGNITION,
    name: 'Social Cognition',
    category: 'Social Cognition',
    description: 'Ability to understand social situations and others\' mental states',
    scoreInterpretation: {
      low: 'May miss social cues, prefer explicit communication',
      mid: 'Adequate social understanding',
      high: 'Strong social awareness and theory of mind',
    },
    educationalRelevance: 'Affects group work dynamics, interpretation of feedback, collaborative learning',
  },

  // Worldview
  [PSYCHOMETRIC_DOMAINS.POLITICAL_IDEOLOGY]: {
    id: PSYCHOMETRIC_DOMAINS.POLITICAL_IDEOLOGY,
    name: 'Political Ideology',
    category: 'Worldview',
    description: 'Political beliefs and values orientation',
    scoreInterpretation: {
      low: 'Conservative, tradition-preserving',
      mid: 'Moderate, centrist views',
      high: 'Progressive, change-oriented',
    },
    educationalRelevance: 'Affects framing of social topics, sensitivity to certain examples',
  },
  [PSYCHOMETRIC_DOMAINS.CULTURAL_VALUES]: {
    id: PSYCHOMETRIC_DOMAINS.CULTURAL_VALUES,
    name: 'Cultural Values',
    category: 'Worldview',
    description: 'Collectivism vs individualism and cultural orientations',
    scoreInterpretation: {
      low: 'Collectivist - group harmony, tradition',
      mid: 'Balanced orientation',
      high: 'Individualist - personal achievement, independence',
    },
    educationalRelevance: 'Collectivist → group work, social learning; Individualist → personal achievement focus',
  },
  [PSYCHOMETRIC_DOMAINS.MORAL_REASONING]: {
    id: PSYCHOMETRIC_DOMAINS.MORAL_REASONING,
    name: 'Moral Reasoning',
    category: 'Worldview',
    description: 'Ethical framework and moral development level',
    scoreInterpretation: {
      low: 'Pre-conventional - rule and punishment focused',
      mid: 'Conventional - social norms and duty',
      high: 'Post-conventional - principled reasoning',
    },
    educationalRelevance: 'Affects ethical discussions, case study interpretation, motivation framing',
  },

  // Work & Lifestyle
  [PSYCHOMETRIC_DOMAINS.WORK_CAREER_STYLE]: {
    id: PSYCHOMETRIC_DOMAINS.WORK_CAREER_STYLE,
    name: 'Work/Career Style',
    category: 'Work & Lifestyle',
    description: 'Work preferences and career orientations',
    scoreInterpretation: {
      low: 'Prefers stability, clear roles',
      mid: 'Balanced work preferences',
      high: 'Entrepreneurial, autonomy-seeking',
    },
    educationalRelevance: 'Affects learning goals - practical skills vs theoretical knowledge vs entrepreneurial skills',
  },
  [PSYCHOMETRIC_DOMAINS.SENSORY_PROCESSING]: {
    id: PSYCHOMETRIC_DOMAINS.SENSORY_PROCESSING,
    name: 'Sensory Processing',
    category: 'Work & Lifestyle',
    description: 'Sensitivity to sensory stimulation',
    scoreInterpretation: {
      low: 'Low sensitivity, seeks stimulation',
      mid: 'Moderate sensory processing',
      high: 'High sensitivity, easily overwhelmed',
    },
    educationalRelevance: 'High sensitivity → clean UI, calm colors, fewer distractions; Low → may need more stimulation',
  },
  [PSYCHOMETRIC_DOMAINS.AESTHETIC_PREFERENCES]: {
    id: PSYCHOMETRIC_DOMAINS.AESTHETIC_PREFERENCES,
    name: 'Aesthetic Preferences',
    category: 'Work & Lifestyle',
    description: 'Preferences for visual style and design',
    scoreInterpretation: {
      low: 'Functional, minimal aesthetic preference',
      mid: 'Moderate aesthetic awareness',
      high: 'Strong aesthetic preferences, values beauty',
    },
    educationalRelevance: 'High aesthetic → appreciates well-designed content; content presentation matters',
  },
};

// =============================================================================
// DOMAIN CATEGORIES
// =============================================================================

export const DOMAIN_CATEGORIES = [
  'Big Five Personality',
  'Dark Triad',
  'Emotional Intelligence',
  'Communication & Social',
  'Decision Making & Risk',
  'Motivation & Achievement',
  'Values & Interests',
  'Coping & Wellbeing',
  'Cognitive',
  'Social Cognition',
  'Worldview',
  'Work & Lifestyle',
] as const;

export type DomainCategory = typeof DOMAIN_CATEGORIES[number];

/**
 * Get all domains in a category
 */
export function getDomainsByCategory(category: DomainCategory): PsychometricDomainId[] {
  return ALL_DOMAIN_IDS.filter(id => DOMAIN_METADATA[id].category === category);
}

/**
 * Get domain metadata by ID
 */
export function getDomainMetadata(domainId: PsychometricDomainId): DomainMetadata {
  return DOMAIN_METADATA[domainId];
}

// =============================================================================
// LEARNING STYLE DERIVATION
// =============================================================================

import type { LearningStyle, LearningModality, CognitiveProfile, PsychometricScore } from './types';

/**
 * Derive learning style from psychometric scores
 */
export function deriveLearningStyle(
  scores: Record<string, PsychometricScore>
): LearningStyle {
  // Get relevant scores with defaults
  const getScore = (domain: string): number => scores[domain]?.score ?? 50;

  const openness = getScore(PSYCHOMETRIC_DOMAINS.BIG_FIVE_OPENNESS);
  const extraversion = getScore(PSYCHOMETRIC_DOMAINS.BIG_FIVE_EXTRAVERSION);
  const conscientiousness = getScore(PSYCHOMETRIC_DOMAINS.BIG_FIVE_CONSCIENTIOUSNESS);
  const learningStyles = getScore(PSYCHOMETRIC_DOMAINS.LEARNING_STYLES);
  const informationProcessing = getScore(PSYCHOMETRIC_DOMAINS.INFORMATION_PROCESSING);

  // Determine primary modality
  // High learning_styles score → visual/kinesthetic, Low → reading/writing
  let primary: LearningModality;
  let secondary: LearningModality | undefined;

  if (learningStyles >= 70) {
    // Visual/Kinesthetic preference
    primary = openness > 60 ? 'visual' : 'kinesthetic';
    secondary = primary === 'visual' ? 'kinesthetic' : 'visual';
  } else if (learningStyles <= 30) {
    // Reading/Writing preference
    primary = 'reading';
    secondary = conscientiousness > 60 ? 'visual' : 'auditory';
  } else {
    // Multimodal - derive from other traits
    if (openness > 60 && informationProcessing > 60) {
      primary = 'visual';
    } else if (extraversion > 60) {
      primary = 'auditory';
    } else {
      primary = 'reading';
    }
    secondary = primary === 'visual' ? 'kinesthetic' : 'visual';
  }

  // Determine social preference
  let socialPreference: LearningStyle['socialPreference'];
  if (extraversion >= 65) {
    socialPreference = 'collaborative';
  } else if (extraversion <= 35) {
    socialPreference = 'solo';
  } else {
    socialPreference = 'mixed';
  }

  // Determine pace preference
  let pacePreference: LearningStyle['pacePreference'];
  if (conscientiousness >= 65) {
    pacePreference = 'structured';
  } else if (openness >= 65 && conscientiousness <= 45) {
    pacePreference = 'self-paced';
  } else {
    pacePreference = 'self-paced';
  }

  // Determine feedback preference
  const neuroticism = getScore(PSYCHOMETRIC_DOMAINS.BIG_FIVE_NEUROTICISM);
  const selfEfficacy = getScore(PSYCHOMETRIC_DOMAINS.SELF_EFFICACY);

  let feedbackPreference: LearningStyle['feedbackPreference'];
  if (neuroticism >= 60 || selfEfficacy <= 40) {
    feedbackPreference = 'immediate';
  } else if (conscientiousness >= 65) {
    feedbackPreference = 'delayed';
  } else {
    feedbackPreference = 'on-request';
  }

  return {
    primary,
    secondary,
    socialPreference,
    pacePreference,
    feedbackPreference,
  };
}

// =============================================================================
// COGNITIVE PROFILE ESTIMATION
// =============================================================================

/**
 * Estimate cognitive profile from psychometric scores
 */
export function estimateCognitiveProfile(
  scores: Record<string, PsychometricScore>
): CognitiveProfile {
  const getScore = (domain: string): number => scores[domain]?.score ?? 50;

  const cognitiveAbilities = getScore(PSYCHOMETRIC_DOMAINS.COGNITIVE_ABILITIES);
  const executiveFunctions = getScore(PSYCHOMETRIC_DOMAINS.EXECUTIVE_FUNCTIONS);
  const metacognition = getScore(PSYCHOMETRIC_DOMAINS.METACOGNITION);
  const openness = getScore(PSYCHOMETRIC_DOMAINS.BIG_FIVE_OPENNESS);
  const informationProcessing = getScore(PSYCHOMETRIC_DOMAINS.INFORMATION_PROCESSING);

  // Working memory capacity (derived from executive functions and cognitive abilities)
  const wmScore = (executiveFunctions + cognitiveAbilities) / 2;
  let workingMemoryCapacity: CognitiveProfile['workingMemoryCapacity'];
  if (wmScore >= 65) {
    workingMemoryCapacity = 'high';
  } else if (wmScore <= 35) {
    workingMemoryCapacity = 'low';
  } else {
    workingMemoryCapacity = 'medium';
  }

  // Attention span (derived from executive functions and conscientiousness)
  const conscientiousness = getScore(PSYCHOMETRIC_DOMAINS.BIG_FIVE_CONSCIENTIOUSNESS);
  const attentionScore = (executiveFunctions + conscientiousness) / 2;
  let attentionSpan: CognitiveProfile['attentionSpan'];
  if (attentionScore >= 65) {
    attentionSpan = 'long';
  } else if (attentionScore <= 35) {
    attentionSpan = 'short';
  } else {
    attentionSpan = 'medium';
  }

  // Processing speed (derived from cognitive abilities and metacognition)
  const speedScore = (cognitiveAbilities + metacognition) / 2;
  let processingSpeed: CognitiveProfile['processingSpeed'];
  if (speedScore >= 65) {
    processingSpeed = 'fast';
  } else if (speedScore <= 35) {
    processingSpeed = 'slow';
  } else {
    processingSpeed = 'medium';
  }

  // Abstract thinking (derived from openness and information processing)
  const abstractScore = (openness + informationProcessing) / 2;
  let abstractThinking: CognitiveProfile['abstractThinking'];
  if (abstractScore >= 65) {
    abstractThinking = 'abstract';
  } else if (abstractScore <= 35) {
    abstractThinking = 'concrete';
  } else {
    abstractThinking = 'mixed';
  }

  return {
    workingMemoryCapacity,
    attentionSpan,
    processingSpeed,
    abstractThinking,
  };
}

/**
 * Get learning style description for display
 */
export function getLearningStyleDescription(style: LearningStyle): string {
  const modalityDescriptions: Record<LearningModality, string> = {
    visual: 'visual learner who prefers diagrams, charts, and videos',
    auditory: 'auditory learner who benefits from lectures and discussions',
    kinesthetic: 'hands-on learner who learns by doing and experimenting',
    reading: 'reading/writing learner who prefers text-based materials',
  };

  const socialDescriptions = {
    solo: 'prefers independent study',
    collaborative: 'thrives in group settings',
    mixed: 'flexible between solo and group work',
  };

  const paceDescriptions = {
    'self-paced': 'at your own pace',
    structured: 'with clear schedules and deadlines',
    intensive: 'in focused, intensive sessions',
  };

  return `You're a ${modalityDescriptions[style.primary]} who ${socialDescriptions[style.socialPreference]} and learns best ${paceDescriptions[style.pacePreference]}.`;
}
