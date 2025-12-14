import { NextResponse } from 'next/server';
import { getDB } from '@/lib/db';
import { deriveLearningStyle } from '@/src/models/psychometrics';

// Domain IDs from domain-reference.md (source of truth)
const DOMAIN_IDS = [
  'big_five_openness',
  'big_five_conscientiousness',
  'big_five_extraversion',
  'big_five_agreeableness',
  'big_five_neuroticism',
  'dark_triad_narcissism',
  'dark_triad_machiavellianism',
  'dark_triad_psychopathy',
  'emotional_empathy',
  'emotional_intelligence',
  'attachment_style',
  'love_languages',
  'communication_style',
  'risk_tolerance',
  'decision_style',
  'time_orientation',
  'achievement_motivation',
  'self_efficacy',
  'locus_of_control',
  'growth_mindset',
  'personal_values',
  'interests',
  'life_satisfaction',
  'stress_coping',
  'social_support',
  'authenticity',
  'cognitive_abilities',
  'creativity',
  'learning_styles',
  'information_processing',
  'metacognition',
  'executive_functions',
  'social_cognition',
  'political_ideology',
  'cultural_values',
  'moral_reasoning',
  'work_career_style',
  'sensory_processing',
  'aesthetic_preferences',
];

// Personality archetypes for realistic sample users
const USER_ARCHETYPES = [
  {
    name: 'Alex Rivera',
    email: 'alex.rivera@example.com',
    archetype: 'Creative Explorer',
    traits: {
      big_five_openness: 92,
      big_five_conscientiousness: 45,
      big_five_extraversion: 78,
      creativity: 95,
      risk_tolerance: 80,
      growth_mindset: 85,
    },
  },
  {
    name: 'Jordan Chen',
    email: 'jordan.chen@example.com',
    archetype: 'Analytical Achiever',
    traits: {
      big_five_openness: 65,
      big_five_conscientiousness: 95,
      big_five_extraversion: 40,
      cognitive_abilities: 90,
      achievement_motivation: 92,
      self_efficacy: 85,
    },
  },
  {
    name: 'Sam Williams',
    email: 'sam.williams@example.com',
    archetype: 'Empathic Leader',
    traits: {
      big_five_agreeableness: 90,
      big_five_extraversion: 85,
      emotional_empathy: 95,
      emotional_intelligence: 90,
      social_support: 88,
      authenticity: 82,
    },
  },
  {
    name: 'Morgan Taylor',
    email: 'morgan.taylor@example.com',
    archetype: 'Cautious Planner',
    traits: {
      big_five_neuroticism: 72,
      big_five_conscientiousness: 88,
      risk_tolerance: 25,
      decision_style: 35, // Deliberate
      metacognition: 80,
      executive_functions: 85,
    },
  },
  {
    name: 'Casey Johnson',
    email: 'casey.johnson@example.com',
    archetype: 'Social Butterfly',
    traits: {
      big_five_extraversion: 95,
      big_five_agreeableness: 80,
      communication_style: 85,
      social_cognition: 88,
      life_satisfaction: 82,
      emotional_intelligence: 75,
    },
  },
  {
    name: 'Riley Martinez',
    email: 'riley.martinez@example.com',
    archetype: 'Independent Thinker',
    traits: {
      big_five_openness: 85,
      big_five_agreeableness: 35,
      locus_of_control: 90, // Internal
      authenticity: 92,
      personal_values: 88,
      moral_reasoning: 85,
    },
  },
  {
    name: 'Quinn Anderson',
    email: 'quinn.anderson@example.com',
    archetype: 'Balanced Learner',
    traits: {
      big_five_openness: 60,
      big_five_conscientiousness: 65,
      big_five_extraversion: 55,
      big_five_agreeableness: 60,
      big_five_neuroticism: 45,
      learning_styles: 70,
    },
  },
  {
    name: 'Avery Thompson',
    email: 'avery.thompson@example.com',
    archetype: 'Ambitious Innovator',
    traits: {
      achievement_motivation: 95,
      creativity: 85,
      risk_tolerance: 75,
      growth_mindset: 90,
      self_efficacy: 88,
      work_career_style: 82,
    },
  },
  {
    name: 'Harper Lee',
    email: 'harper.lee@example.com',
    archetype: 'Sensitive Artist',
    traits: {
      big_five_openness: 95,
      big_five_neuroticism: 65,
      sensory_processing: 90,
      aesthetic_preferences: 95,
      creativity: 88,
      emotional_empathy: 85,
    },
  },
  {
    name: 'Drew Kim',
    email: 'drew.kim@example.com',
    archetype: 'Pragmatic Problem-Solver',
    traits: {
      big_five_conscientiousness: 80,
      cognitive_abilities: 85,
      decision_style: 75, // Rational
      information_processing: 88,
      stress_coping: 78,
      executive_functions: 82,
    },
  },
];

function generatePsychometricScores(archetype: typeof USER_ARCHETYPES[0]) {
  const scores: Record<string, { score: number; confidence: number; lastUpdated: string; source: string }> = {};
  const now = new Date().toISOString();

  for (const domainId of DOMAIN_IDS) {
    // If this domain is specified in the archetype traits, use that value
    if (archetype.traits[domainId as keyof typeof archetype.traits] !== undefined) {
      scores[domainId] = {
        score: archetype.traits[domainId as keyof typeof archetype.traits] as number,
        confidence: 0.85 + Math.random() * 0.15, // High confidence for archetype-defining traits
        lastUpdated: now,
        source: 'archetype_seed',
      };
    } else {
      // Generate random but realistic values based on normal distribution
      // Using Box-Muller transform for normal distribution
      const u1 = Math.random();
      const u2 = Math.random();
      const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
      const mean = 50;
      const stdDev = 15;
      let value = Math.round(mean + z * stdDev);
      value = Math.max(5, Math.min(95, value)); // Clamp to 5-95

      scores[domainId] = {
        score: value,
        confidence: 0.4 + Math.random() * 0.4, // Medium confidence for generated values
        lastUpdated: now,
        source: 'seed_generated',
      };
    }
  }

  return scores;
}

// Using deriveLearningStyle from @/src/models/psychometrics

export async function POST() {
  try {
    const db = await getDB();
    const createdUsers = [];

    for (const archetype of USER_ARCHETYPES) {
      const userId = archetype.email.split('@')[0].replace('.', '-');
      const psychometricScores = generatePsychometricScores(archetype);
      const learningStyle = deriveLearningStyle(psychometricScores);

      const profile = await db.setLearnerProfile(userId, {
        name: archetype.name,
        email: archetype.email,
        psychometricScores,
        learningStyle,
        tags: [archetype.archetype],
        notes: `Sample user representing the "${archetype.archetype}" personality archetype.`,
      });

      createdUsers.push({
        userId,
        name: archetype.name,
        archetype: archetype.archetype,
        domainsConfigured: Object.keys(psychometricScores).length,
      });
    }

    return NextResponse.json({
      success: true,
      message: `Created ${createdUsers.length} sample users`,
      users: createdUsers,
    });
  } catch (error) {
    console.error('Error seeding users:', error);
    return NextResponse.json(
      { error: 'Failed to seed users', details: String(error) },
      { status: 500 }
    );
  }
}

// GET to check current sample users
export async function GET() {
  try {
    const db = await getDB();
    const learners = await db.listLearnerProfiles();

    return NextResponse.json({
      totalUsers: learners.length,
      users: learners.map((l) => ({
        userId: l.userId,
        name: l.name,
        email: l.email,
        domainsConfigured: Object.keys(l.psychometricScores || {}).length,
        hasLearningStyle: !!l.learningStyle,
      })),
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to list users' }, { status: 500 });
  }
}
