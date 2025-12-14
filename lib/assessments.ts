/**
 * Comprehensive Psychological Assessments Library
 *
 * Contains validated psychological assessments for all 39 domains.
 * Each domain has two versions:
 * - Quick: Single question (for rapid screening)
 * - Full: Based on actual validated instruments
 *
 * Sources and instruments are documented for each assessment.
 */

export interface AssessmentQuestion {
  id: string;
  text: string;
  reverseScored?: boolean;
  subscale?: string;
}

export interface Assessment {
  domainId: string;
  name: string;
  shortName: string;
  description: string;
  source: string; // Academic source/validated instrument
  questions: AssessmentQuestion[];
  scale: {
    min: number;
    max: number;
    labels: string[];
  };
  calculateScore: (answers: Record<string, number>) => number;
  interpretation: (score: number, answers?: Record<string, number>) => string;
}

export interface AssessmentCategory {
  id: string;
  name: string;
  assessments: {
    quick: Assessment;
    full: Assessment;
  }[];
}

// ============================================================================
// SCORING UTILITIES
// ============================================================================

function calculateMean(answers: Record<string, number>, questions: AssessmentQuestion[], scaleMax: number): number {
  const values = questions.map(q => {
    const answer = answers[q.id] || 3;
    return q.reverseScored ? (scaleMax + 1 - answer) : answer;
  });
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  // Convert to 0-100 scale
  return Math.round(((mean - 1) / (scaleMax - 1)) * 100);
}

function calculateSum(answers: Record<string, number>, questions: AssessmentQuestion[], scaleMax: number, maxPossible: number): number {
  const sum = questions.reduce((total, q) => {
    const answer = answers[q.id] || 0;
    return total + (q.reverseScored ? (scaleMax - answer) : answer);
  }, 0);
  return Math.round((sum / maxPossible) * 100);
}

// Generic subscale calculation - calculates scores for each unique subscale in questions
function calculateSubscales(
  answers: Record<string, number>,
  questions: AssessmentQuestion[],
  scaleMax: number
): Record<string, number> {
  const subscaleAnswers: Record<string, { values: number[]; reverses: boolean[] }> = {};

  // Group answers by subscale
  for (const q of questions) {
    if (!q.subscale) continue;
    if (!subscaleAnswers[q.subscale]) {
      subscaleAnswers[q.subscale] = { values: [], reverses: [] };
    }
    const answer = answers[q.id] ?? Math.ceil(scaleMax / 2);
    subscaleAnswers[q.subscale].values.push(answer);
    subscaleAnswers[q.subscale].reverses.push(q.reverseScored ?? false);
  }

  // Calculate mean for each subscale, normalized to 0-100
  const result: Record<string, number> = {};
  for (const [subscale, data] of Object.entries(subscaleAnswers)) {
    const adjusted = data.values.map((v, i) => data.reverses[i] ? (scaleMax + 1 - v) : v);
    const mean = adjusted.reduce((a, b) => a + b, 0) / adjusted.length;
    result[subscale] = Math.round(((mean - 1) / (scaleMax - 1)) * 100);
  }

  return result;
}

// Find dominant subscale(s) - returns subscales within threshold of max
function findDominant(subscales: Record<string, number>, threshold: number = 10): string[] {
  const max = Math.max(...Object.values(subscales));
  return Object.keys(subscales).filter(k => subscales[k] >= max - threshold);
}

// Format subscale scores for display
function formatSubscaleScores(subscales: Record<string, number>, labels: Record<string, string>): string {
  return Object.entries(subscales)
    .map(([k, v]) => `${labels[k] || k}=${v}`)
    .join(' ');
}

// ============================================================================
// A. CORE PERSONALITY (BIG FIVE)
// ============================================================================

// TIPI - Ten-Item Personality Inventory (Gosling, Rentfrow, & Swann, 2003)
const TIPI_SCALE = {
  min: 1,
  max: 7,
  labels: ['Disagree strongly', 'Disagree moderately', 'Disagree a little', 'Neither agree nor disagree', 'Agree a little', 'Agree moderately', 'Agree strongly']
};

export const bigFiveOpenness: { quick: Assessment; full: Assessment } = {
  quick: {
    domainId: 'big_five_openness',
    name: 'Openness Quick Assessment',
    shortName: 'Openness (Quick)',
    description: 'Single-item measure of openness to experience',
    source: 'Adapted from TIPI (Gosling, Rentfrow, & Swann, 2003)',
    questions: [
      { id: 'openness_q1', text: 'I see myself as open to new experiences, complex.' }
    ],
    scale: TIPI_SCALE,
    calculateScore: (answers) => Math.round(((answers['openness_q1'] || 4) - 1) / 6 * 100),
    interpretation: (score) => score >= 70 ? 'High openness - curious, creative, appreciates art and ideas' :
                              score >= 40 ? 'Moderate openness - balanced between traditional and novel' :
                              'Low openness - practical, conventional, prefers routine'
  },
  full: {
    domainId: 'big_five_openness',
    name: 'Openness to Experience Assessment',
    shortName: 'Openness (Full)',
    description: 'Comprehensive assessment based on NEO-PI-R facets',
    source: 'Based on NEO-PI-R (Costa & McCrae, 1992) and IPIP items',
    questions: [
      { id: 'open_1', text: 'I have a vivid imagination.' },
      { id: 'open_2', text: 'I am interested in abstract ideas.' },
      { id: 'open_3', text: 'I have difficulty understanding abstract ideas.', reverseScored: true },
      { id: 'open_4', text: 'I do not like art.', reverseScored: true },
      { id: 'open_5', text: 'I believe in the importance of art.' },
      { id: 'open_6', text: 'I avoid philosophical discussions.', reverseScored: true },
      { id: 'open_7', text: 'I tend to vote for liberal political candidates.' },
      { id: 'open_8', text: 'I carry the conversation to a higher level.' },
      { id: 'open_9', text: 'I enjoy hearing new ideas.' },
      { id: 'open_10', text: 'I am not interested in theoretical discussions.', reverseScored: true }
    ],
    scale: { min: 1, max: 5, labels: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'] },
    calculateScore: (answers) => calculateMean(answers, bigFiveOpenness.full.questions, 5),
    interpretation: (score) => score >= 70 ? 'High openness - intellectually curious, creative, open to new experiences' :
                              score >= 40 ? 'Moderate openness - balanced approach to novelty and tradition' :
                              'Low openness - practical, conventional, prefers familiar routines'
  }
};

export const bigFiveConscientiousness: { quick: Assessment; full: Assessment } = {
  quick: {
    domainId: 'big_five_conscientiousness',
    name: 'Conscientiousness Quick Assessment',
    shortName: 'Conscientiousness (Quick)',
    description: 'Single-item measure of conscientiousness',
    source: 'Adapted from TIPI (Gosling, Rentfrow, & Swann, 2003)',
    questions: [
      { id: 'consc_q1', text: 'I see myself as dependable, self-disciplined.' }
    ],
    scale: TIPI_SCALE,
    calculateScore: (answers) => Math.round(((answers['consc_q1'] || 4) - 1) / 6 * 100),
    interpretation: (score) => score >= 70 ? 'High conscientiousness - organized, reliable, goal-oriented' :
                              score >= 40 ? 'Moderate conscientiousness - balanced between structure and flexibility' :
                              'Low conscientiousness - spontaneous, flexible, may struggle with organization'
  },
  full: {
    domainId: 'big_five_conscientiousness',
    name: 'Conscientiousness Assessment',
    shortName: 'Conscientiousness (Full)',
    description: 'Comprehensive assessment based on NEO-PI-R facets',
    source: 'Based on NEO-PI-R (Costa & McCrae, 1992) and IPIP items',
    questions: [
      { id: 'consc_1', text: 'I am always prepared.' },
      { id: 'consc_2', text: 'I pay attention to details.' },
      { id: 'consc_3', text: 'I get chores done right away.' },
      { id: 'consc_4', text: 'I like order.' },
      { id: 'consc_5', text: 'I follow a schedule.' },
      { id: 'consc_6', text: 'I am exacting in my work.' },
      { id: 'consc_7', text: 'I leave my belongings around.', reverseScored: true },
      { id: 'consc_8', text: 'I make a mess of things.', reverseScored: true },
      { id: 'consc_9', text: 'I often forget to put things back in their proper place.', reverseScored: true },
      { id: 'consc_10', text: 'I shirk my duties.', reverseScored: true }
    ],
    scale: { min: 1, max: 5, labels: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'] },
    calculateScore: (answers) => calculateMean(answers, bigFiveConscientiousness.full.questions, 5),
    interpretation: (score) => score >= 70 ? 'High conscientiousness - organized, thorough, dependable' :
                              score >= 40 ? 'Moderate conscientiousness - balanced structure and flexibility' :
                              'Low conscientiousness - spontaneous, flexible, less detail-oriented'
  }
};

export const bigFiveExtraversion: { quick: Assessment; full: Assessment } = {
  quick: {
    domainId: 'big_five_extraversion',
    name: 'Extraversion Quick Assessment',
    shortName: 'Extraversion (Quick)',
    description: 'Single-item measure of extraversion',
    source: 'Adapted from TIPI (Gosling, Rentfrow, & Swann, 2003)',
    questions: [
      { id: 'extra_q1', text: 'I see myself as extraverted, enthusiastic.' }
    ],
    scale: TIPI_SCALE,
    calculateScore: (answers) => Math.round(((answers['extra_q1'] || 4) - 1) / 6 * 100),
    interpretation: (score) => score >= 70 ? 'High extraversion - outgoing, energetic, seeks social stimulation' :
                              score >= 40 ? 'Moderate extraversion - ambiverted, adapts to social situations' :
                              'Low extraversion (introverted) - reserved, prefers solitary activities'
  },
  full: {
    domainId: 'big_five_extraversion',
    name: 'Extraversion Assessment',
    shortName: 'Extraversion (Full)',
    description: 'Comprehensive assessment based on NEO-PI-R facets',
    source: 'Based on NEO-PI-R (Costa & McCrae, 1992) and IPIP items',
    questions: [
      { id: 'extra_1', text: 'I am the life of the party.' },
      { id: 'extra_2', text: 'I feel comfortable around people.' },
      { id: 'extra_3', text: 'I start conversations.' },
      { id: 'extra_4', text: 'I talk to a lot of different people at parties.' },
      { id: 'extra_5', text: 'I don\'t mind being the center of attention.' },
      { id: 'extra_6', text: 'I don\'t talk a lot.', reverseScored: true },
      { id: 'extra_7', text: 'I keep in the background.', reverseScored: true },
      { id: 'extra_8', text: 'I have little to say.', reverseScored: true },
      { id: 'extra_9', text: 'I don\'t like to draw attention to myself.', reverseScored: true },
      { id: 'extra_10', text: 'I am quiet around strangers.', reverseScored: true }
    ],
    scale: { min: 1, max: 5, labels: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'] },
    calculateScore: (answers) => calculateMean(answers, bigFiveExtraversion.full.questions, 5),
    interpretation: (score) => score >= 70 ? 'High extraversion - sociable, assertive, energetic' :
                              score >= 40 ? 'Moderate extraversion - adaptable to social contexts' :
                              'Low extraversion - reserved, reflective, enjoys solitude'
  }
};

export const bigFiveAgreeableness: { quick: Assessment; full: Assessment } = {
  quick: {
    domainId: 'big_five_agreeableness',
    name: 'Agreeableness Quick Assessment',
    shortName: 'Agreeableness (Quick)',
    description: 'Single-item measure of agreeableness',
    source: 'Adapted from TIPI (Gosling, Rentfrow, & Swann, 2003)',
    questions: [
      { id: 'agree_q1', text: 'I see myself as sympathetic, warm.' }
    ],
    scale: TIPI_SCALE,
    calculateScore: (answers) => Math.round(((answers['agree_q1'] || 4) - 1) / 6 * 100),
    interpretation: (score) => score >= 70 ? 'High agreeableness - cooperative, trusting, helpful' :
                              score >= 40 ? 'Moderate agreeableness - balanced between cooperation and competition' :
                              'Low agreeableness - competitive, skeptical, challenging'
  },
  full: {
    domainId: 'big_five_agreeableness',
    name: 'Agreeableness Assessment',
    shortName: 'Agreeableness (Full)',
    description: 'Comprehensive assessment based on NEO-PI-R facets',
    source: 'Based on NEO-PI-R (Costa & McCrae, 1992) and IPIP items',
    questions: [
      { id: 'agree_1', text: 'I am interested in people.' },
      { id: 'agree_2', text: 'I sympathize with others\' feelings.' },
      { id: 'agree_3', text: 'I have a soft heart.' },
      { id: 'agree_4', text: 'I take time out for others.' },
      { id: 'agree_5', text: 'I feel others\' emotions.' },
      { id: 'agree_6', text: 'I make people feel at ease.' },
      { id: 'agree_7', text: 'I am not really interested in others.', reverseScored: true },
      { id: 'agree_8', text: 'I insult people.', reverseScored: true },
      { id: 'agree_9', text: 'I am not interested in other people\'s problems.', reverseScored: true },
      { id: 'agree_10', text: 'I feel little concern for others.', reverseScored: true }
    ],
    scale: { min: 1, max: 5, labels: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'] },
    calculateScore: (answers) => calculateMean(answers, bigFiveAgreeableness.full.questions, 5),
    interpretation: (score) => score >= 70 ? 'High agreeableness - compassionate, cooperative, trusting' :
                              score >= 40 ? 'Moderate agreeableness - balanced social orientation' :
                              'Low agreeableness - analytical, competitive, skeptical'
  }
};

export const bigFiveNeuroticism: { quick: Assessment; full: Assessment } = {
  quick: {
    domainId: 'big_five_neuroticism',
    name: 'Emotional Stability Quick Assessment',
    shortName: 'Neuroticism (Quick)',
    description: 'Single-item measure of emotional stability/neuroticism',
    source: 'Adapted from TIPI (Gosling, Rentfrow, & Swann, 2003)',
    questions: [
      { id: 'neuro_q1', text: 'I see myself as anxious, easily upset.' }
    ],
    scale: TIPI_SCALE,
    calculateScore: (answers) => Math.round(((answers['neuro_q1'] || 4) - 1) / 6 * 100),
    interpretation: (score) => score >= 70 ? 'High neuroticism - prone to stress, emotional variability' :
                              score >= 40 ? 'Moderate neuroticism - generally stable with some sensitivity' :
                              'Low neuroticism - emotionally stable, calm under pressure'
  },
  full: {
    domainId: 'big_five_neuroticism',
    name: 'Neuroticism Assessment',
    shortName: 'Neuroticism (Full)',
    description: 'Comprehensive assessment based on NEO-PI-R facets',
    source: 'Based on NEO-PI-R (Costa & McCrae, 1992) and IPIP items',
    questions: [
      { id: 'neuro_1', text: 'I get stressed out easily.' },
      { id: 'neuro_2', text: 'I worry about things.' },
      { id: 'neuro_3', text: 'I am easily disturbed.' },
      { id: 'neuro_4', text: 'I get upset easily.' },
      { id: 'neuro_5', text: 'I change my mood a lot.' },
      { id: 'neuro_6', text: 'I have frequent mood swings.' },
      { id: 'neuro_7', text: 'I get irritated easily.' },
      { id: 'neuro_8', text: 'I often feel blue.' },
      { id: 'neuro_9', text: 'I am relaxed most of the time.', reverseScored: true },
      { id: 'neuro_10', text: 'I seldom feel blue.', reverseScored: true }
    ],
    scale: { min: 1, max: 5, labels: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'] },
    calculateScore: (answers) => calculateMean(answers, bigFiveNeuroticism.full.questions, 5),
    interpretation: (score) => score >= 70 ? 'High neuroticism - emotionally reactive, stress-prone' :
                              score >= 40 ? 'Moderate neuroticism - typical emotional reactivity' :
                              'Low neuroticism - emotionally stable, resilient'
  }
};

// ============================================================================
// B. DARK PERSONALITY
// ============================================================================

// Short Dark Triad (SD3) - Jones & Paulhus (2014)
const DARK_SCALE = { min: 1, max: 5, labels: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'] };

export const darkTriadNarcissism: { quick: Assessment; full: Assessment } = {
  quick: {
    domainId: 'dark_triad_narcissism',
    name: 'Narcissism Quick Assessment',
    shortName: 'Narcissism (Quick)',
    description: 'Single-item narcissism measure',
    source: 'Single-Item Narcissism Scale (SINS; Konrath et al., 2014)',
    questions: [
      { id: 'narc_q1', text: 'I am a narcissist. (Note: Narcissist means egotistical, self-focused, and vain)' }
    ],
    scale: { min: 1, max: 7, labels: ['Not at all true', '', '', '', '', '', 'Very true'] },
    calculateScore: (answers) => Math.round(((answers['narc_q1'] || 4) - 1) / 6 * 100),
    interpretation: (score) => score >= 70 ? 'High narcissism - strong self-focus and need for admiration' :
                              score >= 40 ? 'Moderate narcissism - healthy self-esteem with some ego' :
                              'Low narcissism - modest, self-effacing'
  },
  full: {
    domainId: 'dark_triad_narcissism',
    name: 'Narcissistic Personality Assessment',
    shortName: 'Narcissism (Full)',
    description: 'Based on Narcissistic Personality Inventory (NPI)',
    source: 'Adapted from NPI-16 (Ames, Rose, & Anderson, 2006)',
    questions: [
      { id: 'narc_1', text: 'I like to be the center of attention.' },
      { id: 'narc_2', text: 'I have a natural talent for influencing people.' },
      { id: 'narc_3', text: 'I am an extraordinary person.' },
      { id: 'narc_4', text: 'I like having authority over people.' },
      { id: 'narc_5', text: 'I find it easy to manipulate people.' },
      { id: 'narc_6', text: 'I insist upon getting the respect that is due me.' },
      { id: 'narc_7', text: 'I am apt to show off if I get the chance.' },
      { id: 'narc_8', text: 'I always know what I am doing.' },
      { id: 'narc_9', text: 'Everybody likes to hear my stories.' },
      { id: 'narc_10', text: 'I expect a great deal from other people.' }
    ],
    scale: DARK_SCALE,
    calculateScore: (answers) => calculateMean(answers, darkTriadNarcissism.full.questions, 5),
    interpretation: (score) => score >= 70 ? 'High narcissism - grandiosity, need for admiration, self-importance' :
                              score >= 40 ? 'Moderate narcissism - confident with healthy boundaries' :
                              'Low narcissism - humble, collaborative, modest'
  }
};

export const darkTriadMachiavellianism: { quick: Assessment; full: Assessment } = {
  quick: {
    domainId: 'dark_triad_machiavellianism',
    name: 'Machiavellianism Quick Assessment',
    shortName: 'Machiavellianism (Quick)',
    description: 'Single-item Machiavellianism measure',
    source: 'Adapted from SD3 (Jones & Paulhus, 2014)',
    questions: [
      { id: 'mach_q1', text: 'It\'s wise to keep track of information that you can use against people later.' }
    ],
    scale: DARK_SCALE,
    calculateScore: (answers) => Math.round(((answers['mach_q1'] || 3) - 1) / 4 * 100),
    interpretation: (score) => score >= 70 ? 'High Machiavellianism - strategic, calculating approach to social situations' :
                              score >= 40 ? 'Moderate Machiavellianism - pragmatic when necessary' :
                              'Low Machiavellianism - straightforward, trusting approach'
  },
  full: {
    domainId: 'dark_triad_machiavellianism',
    name: 'Machiavellianism Assessment',
    shortName: 'Machiavellianism (Full)',
    description: 'Based on MACH-IV scale',
    source: 'Adapted from MACH-IV (Christie & Geis, 1970)',
    questions: [
      { id: 'mach_1', text: 'It\'s not wise to tell your secrets.' },
      { id: 'mach_2', text: 'I like to use clever manipulation to get my way.' },
      { id: 'mach_3', text: 'Whatever it takes, you must get the important people on your side.' },
      { id: 'mach_4', text: 'Avoid direct conflict with others because they may be useful in the future.' },
      { id: 'mach_5', text: 'It\'s wise to keep track of information that you can use against people later.' },
      { id: 'mach_6', text: 'You should wait for the right time to get back at people.' },
      { id: 'mach_7', text: 'There are things you should hide from other people to preserve your reputation.' },
      { id: 'mach_8', text: 'Make sure your plans benefit yourself, not others.' },
      { id: 'mach_9', text: 'Most people can be manipulated.' },
      { id: 'mach_10', text: 'People are only motivated by personal gain.' }
    ],
    scale: DARK_SCALE,
    calculateScore: (answers) => calculateMean(answers, darkTriadMachiavellianism.full.questions, 5),
    interpretation: (score) => score >= 70 ? 'High Machiavellianism - strategic manipulation, cynical worldview' :
                              score >= 40 ? 'Moderate Machiavellianism - situationally strategic' :
                              'Low Machiavellianism - idealistic, trusting, straightforward'
  }
};

export const darkTriadPsychopathy: { quick: Assessment; full: Assessment } = {
  quick: {
    domainId: 'dark_triad_psychopathy',
    name: 'Psychopathy Quick Assessment',
    shortName: 'Psychopathy (Quick)',
    description: 'Single-item subclinical psychopathy measure',
    source: 'Adapted from SD3 (Jones & Paulhus, 2014)',
    questions: [
      { id: 'psych_q1', text: 'I like to get revenge on authorities.' }
    ],
    scale: DARK_SCALE,
    calculateScore: (answers) => Math.round(((answers['psych_q1'] || 3) - 1) / 4 * 100),
    interpretation: (score) => score >= 70 ? 'High psychopathy traits - impulsive, thrill-seeking, low empathy' :
                              score >= 40 ? 'Moderate traits - some thrill-seeking or impulsivity' :
                              'Low psychopathy traits - empathetic, cautious, follows rules'
  },
  full: {
    domainId: 'dark_triad_psychopathy',
    name: 'Subclinical Psychopathy Assessment',
    shortName: 'Psychopathy (Full)',
    description: 'Based on Levenson Self-Report Psychopathy Scale',
    source: 'Adapted from LSRP (Levenson, Kiehl, & Fitzpatrick, 1995)',
    questions: [
      { id: 'psych_1', text: 'I like to get revenge on authorities.' },
      { id: 'psych_2', text: 'I avoid dangerous situations.', reverseScored: true },
      { id: 'psych_3', text: 'Payback needs to be quick and nasty.' },
      { id: 'psych_4', text: 'People often say I\'m out of control.' },
      { id: 'psych_5', text: 'It\'s true that I can be mean to others.' },
      { id: 'psych_6', text: 'People who mess with me always regret it.' },
      { id: 'psych_7', text: 'I have never gotten into trouble with the law.', reverseScored: true },
      { id: 'psych_8', text: 'I enjoy having sex with people I hardly know.' },
      { id: 'psych_9', text: 'I\'ll say anything to get what I want.' },
      { id: 'psych_10', text: 'I feel bad when I do something wrong.', reverseScored: true }
    ],
    scale: DARK_SCALE,
    calculateScore: (answers) => calculateMean(answers, darkTriadPsychopathy.full.questions, 5),
    interpretation: (score) => score >= 70 ? 'High subclinical psychopathy - impulsive, callous, thrill-seeking' :
                              score >= 40 ? 'Moderate traits - some risk-taking or emotional detachment' :
                              'Low traits - empathetic, risk-averse, emotionally engaged'
  }
};

// ============================================================================
// C. EMOTIONAL/SOCIAL INTELLIGENCE
// ============================================================================

export const emotionalEmpathy: { quick: Assessment; full: Assessment } = {
  quick: {
    domainId: 'emotional_empathy',
    name: 'Empathy Quick Assessment',
    shortName: 'Empathy (Quick)',
    description: 'Single-item empathy measure',
    source: 'Adapted from Empathy Quotient (Baron-Cohen & Wheelwright, 2004)',
    questions: [
      { id: 'emp_q1', text: 'I can easily tell if someone else wants to enter a conversation.' }
    ],
    scale: { min: 1, max: 4, labels: ['Strongly Disagree', 'Slightly Disagree', 'Slightly Agree', 'Strongly Agree'] },
    calculateScore: (answers) => Math.round(((answers['emp_q1'] || 2) - 1) / 3 * 100),
    interpretation: (score) => score >= 70 ? 'High empathy - easily reads and responds to others\' emotions' :
                              score >= 40 ? 'Moderate empathy - reasonably attuned to others' :
                              'Low empathy - may miss social cues or emotional signals'
  },
  full: {
    domainId: 'emotional_empathy',
    name: 'Empathy Quotient Assessment',
    shortName: 'Empathy (Full)',
    description: 'Based on Empathy Quotient (EQ)',
    source: 'Adapted from EQ-Short (Wakabayashi et al., 2006)',
    questions: [
      { id: 'emp_1', text: 'I can easily tell if someone else wants to enter a conversation.' },
      { id: 'emp_2', text: 'I find it difficult to explain to others things that I understand easily.', reverseScored: true },
      { id: 'emp_3', text: 'I really enjoy caring for other people.' },
      { id: 'emp_4', text: 'I find it hard to know what to do in a social situation.', reverseScored: true },
      { id: 'emp_5', text: 'People often tell me that I went too far in driving my point home.', reverseScored: true },
      { id: 'emp_6', text: 'It doesn\'t bother me too much if I am late meeting a friend.', reverseScored: true },
      { id: 'emp_7', text: 'I often find it difficult to judge if something is rude or polite.', reverseScored: true },
      { id: 'emp_8', text: 'In a conversation, I tend to focus on my own thoughts rather than on what my listener might be thinking.', reverseScored: true },
      { id: 'emp_9', text: 'I can pick up quickly if someone says one thing but means another.' },
      { id: 'emp_10', text: 'I am good at predicting how someone will feel.' }
    ],
    scale: { min: 1, max: 4, labels: ['Strongly Disagree', 'Slightly Disagree', 'Slightly Agree', 'Strongly Agree'] },
    calculateScore: (answers) => calculateMean(answers, emotionalEmpathy.full.questions, 4),
    interpretation: (score) => score >= 70 ? 'High empathy - strong ability to understand and share feelings' :
                              score >= 40 ? 'Moderate empathy - typical empathic abilities' :
                              'Lower empathy - may benefit from developing emotional attunement'
  }
};

export const emotionalIntelligence: { quick: Assessment; full: Assessment } = {
  quick: {
    domainId: 'emotional_intelligence',
    name: 'Emotional Intelligence Quick Assessment',
    shortName: 'EI (Quick)',
    description: 'Single-item emotional intelligence measure',
    source: 'Adapted from Wong & Law EI Scale (WLEIS, 2002)',
    questions: [
      { id: 'ei_q1', text: 'I have good control of my own emotions.' }
    ],
    scale: TIPI_SCALE,
    calculateScore: (answers) => Math.round(((answers['ei_q1'] || 4) - 1) / 6 * 100),
    interpretation: (score) => score >= 70 ? 'High EI - excellent emotional awareness and regulation' :
                              score >= 40 ? 'Moderate EI - reasonable emotional management' :
                              'Lower EI - may benefit from emotional skills development'
  },
  full: {
    domainId: 'emotional_intelligence',
    name: 'Emotional Intelligence Scale',
    shortName: 'EI (Full)',
    description: 'Based on Wong and Law Emotional Intelligence Scale',
    source: 'WLEIS (Wong & Law, 2002)',
    questions: [
      // Self-emotion appraisal
      { id: 'ei_1', text: 'I have a good sense of why I have certain feelings most of the time.', subscale: 'SEA' },
      { id: 'ei_2', text: 'I have good understanding of my own emotions.', subscale: 'SEA' },
      { id: 'ei_3', text: 'I really understand what I feel.', subscale: 'SEA' },
      // Others' emotion appraisal
      { id: 'ei_4', text: 'I always know my friends\' emotions from their behavior.', subscale: 'OEA' },
      { id: 'ei_5', text: 'I am a good observer of others\' emotions.', subscale: 'OEA' },
      { id: 'ei_6', text: 'I am sensitive to the feelings and emotions of others.', subscale: 'OEA' },
      // Use of emotion
      { id: 'ei_7', text: 'I always set goals for myself and then try my best to achieve them.', subscale: 'UOE' },
      { id: 'ei_8', text: 'I always tell myself I am a competent person.', subscale: 'UOE' },
      { id: 'ei_9', text: 'I am a self-motivated person.', subscale: 'UOE' },
      // Regulation of emotion
      { id: 'ei_10', text: 'I am able to control my temper and handle difficulties rationally.', subscale: 'ROE' },
      { id: 'ei_11', text: 'I am quite capable of controlling my own emotions.', subscale: 'ROE' },
      { id: 'ei_12', text: 'I can always calm down quickly when I am very angry.', subscale: 'ROE' }
    ],
    scale: TIPI_SCALE,
    calculateScore: (answers) => calculateMean(answers, emotionalIntelligence.full.questions, 7),
    interpretation: (score, answers) => {
      if (!answers) return score >= 70 ? 'High EI' : score >= 40 ? 'Moderate EI' : 'Lower EI';
      const subscales = calculateSubscales(answers, emotionalIntelligence.full.questions, 7);
      const labels: Record<string, string> = {
        'SEA': 'Self-Emotion Appraisal',
        'OEA': 'Others\' Emotion Appraisal',
        'UOE': 'Use of Emotion',
        'ROE': 'Regulation of Emotion'
      };
      const scoreStr = formatSubscaleScores(subscales, labels);
      const dominant = findDominant(subscales);
      const dominantNames = dominant.map(d => labels[d]).join(', ');

      const strengths: string[] = [];
      const areas: string[] = [];
      if (subscales['SEA'] >= 70) strengths.push('understanding your own emotions');
      else if (subscales['SEA'] < 40) areas.push('self-emotion awareness');
      if (subscales['OEA'] >= 70) strengths.push('reading others\' emotions');
      else if (subscales['OEA'] < 40) areas.push('perceiving others\' emotions');
      if (subscales['UOE'] >= 70) strengths.push('using emotions for motivation');
      else if (subscales['UOE'] < 40) areas.push('leveraging emotions productively');
      if (subscales['ROE'] >= 70) strengths.push('managing your emotional states');
      else if (subscales['ROE'] < 40) areas.push('emotional regulation');

      let result = `EI Profile (${scoreStr}). Strongest: ${dominantNames}.`;
      if (strengths.length > 0) result += ` Strengths: ${strengths.join(', ')}.`;
      if (areas.length > 0) result += ` Growth areas: ${areas.join(', ')}.`;
      return result;
    }
  }
};

export const attachmentStyle: { quick: Assessment; full: Assessment } = {
  quick: {
    domainId: 'attachment_style',
    name: 'Attachment Style Quick Assessment',
    shortName: 'Attachment (Quick)',
    description: 'Single-item attachment style measure',
    source: 'Adapted from ECR-R (Fraley et al., 2000)',
    questions: [
      { id: 'attach_q1', text: 'I feel comfortable depending on romantic partners.' }
    ],
    scale: TIPI_SCALE,
    calculateScore: (answers) => Math.round(((answers['attach_q1'] || 4) - 1) / 6 * 100),
    interpretation: (score) => score >= 70 ? 'Secure attachment - comfortable with intimacy and independence' :
                              score >= 40 ? 'Moderate security - some comfort with closeness' :
                              'Insecure attachment - may have anxiety or avoidance in relationships'
  },
  full: {
    domainId: 'attachment_style',
    name: 'Attachment Style Assessment',
    shortName: 'Attachment (Full)',
    description: 'Based on Experiences in Close Relationships-Revised',
    source: 'ECR-R Short Form (Wei et al., 2007)',
    questions: [
      // Anxiety dimension
      { id: 'attach_1', text: 'I\'m afraid that I will lose my partner\'s love.', subscale: 'anxiety' },
      { id: 'attach_2', text: 'I often worry that my partner will not want to stay with me.', subscale: 'anxiety' },
      { id: 'attach_3', text: 'I often worry that my partner doesn\'t really love me.', subscale: 'anxiety' },
      { id: 'attach_4', text: 'I worry that romantic partners won\'t care about me as much as I care about them.', subscale: 'anxiety' },
      { id: 'attach_5', text: 'I often wish that my partner\'s feelings for me were as strong as my feelings for them.', subscale: 'anxiety' },
      { id: 'attach_6', text: 'I worry a lot about my relationships.', subscale: 'anxiety' },
      // Avoidance dimension
      { id: 'attach_7', text: 'I prefer not to show a partner how I feel deep down.', subscale: 'avoidance' },
      { id: 'attach_8', text: 'I feel comfortable sharing my private thoughts and feelings with my partner.', subscale: 'avoidance', reverseScored: true },
      { id: 'attach_9', text: 'I find it difficult to allow myself to depend on romantic partners.', subscale: 'avoidance' },
      { id: 'attach_10', text: 'I am very comfortable being close to romantic partners.', subscale: 'avoidance', reverseScored: true },
      { id: 'attach_11', text: 'I don\'t feel comfortable opening up to romantic partners.', subscale: 'avoidance' },
      { id: 'attach_12', text: 'I prefer not to be too close to romantic partners.', subscale: 'avoidance' }
    ],
    scale: TIPI_SCALE,
    calculateScore: (answers) => {
      // Lower scores = more secure (reverse the final score)
      const raw = calculateMean(answers, attachmentStyle.full.questions, 7);
      return 100 - raw; // Invert so higher = more secure
    },
    interpretation: (score, answers) => {
      if (!answers) return score >= 70 ? 'Secure' : score >= 40 ? 'Some insecurity' : 'Insecure';
      const subscales = calculateSubscales(answers, attachmentStyle.full.questions, 7);
      const anxiety = subscales['anxiety'] || 50;
      const avoidance = subscales['avoidance'] || 50;

      // Determine attachment style based on Bartholomew's 4-category model
      let style: string;
      let description: string;
      if (anxiety < 50 && avoidance < 50) {
        style = 'Secure';
        description = 'comfortable with intimacy and independence';
      } else if (anxiety >= 50 && avoidance < 50) {
        style = 'Anxious-Preoccupied';
        description = 'desires closeness but worries about rejection';
      } else if (anxiety < 50 && avoidance >= 50) {
        style = 'Dismissive-Avoidant';
        description = 'values independence, may suppress emotions';
      } else {
        style = 'Fearful-Avoidant';
        description = 'desires closeness but fears it, mixed feelings';
      }

      return `${style} attachment (Anxiety=${anxiety}, Avoidance=${avoidance}). ${description.charAt(0).toUpperCase() + description.slice(1)}.`;
    }
  }
};

export const loveLanguages: { quick: Assessment; full: Assessment } = {
  quick: {
    domainId: 'love_languages',
    name: 'Love Languages Quick Assessment',
    shortName: 'Love Languages (Quick)',
    description: 'Single scenario love language identification',
    source: 'Based on 5 Love Languages (Chapman, 1992)',
    questions: [
      { id: 'love_q1', text: 'What makes you feel most loved? (1=Words of affirmation, 2=Acts of service, 3=Receiving gifts, 4=Quality time, 5=Physical touch)' }
    ],
    scale: { min: 1, max: 5, labels: ['Words of Affirmation', 'Acts of Service', 'Receiving Gifts', 'Quality Time', 'Physical Touch'] },
    calculateScore: (answers) => Math.round(((answers['love_q1'] || 3) - 1) / 4 * 100),
    interpretation: (score) => {
      const lang = Math.round(score / 25) + 1;
      const languages = ['Words of Affirmation', 'Acts of Service', 'Receiving Gifts', 'Quality Time', 'Physical Touch'];
      return `Primary love language: ${languages[Math.min(lang - 1, 4)]}`;
    }
  },
  full: {
    domainId: 'love_languages',
    name: 'Love Languages Assessment',
    shortName: 'Love Languages (Full)',
    description: 'Comprehensive love languages profile',
    source: 'Based on 5 Love Languages (Chapman, 1992)',
    questions: [
      { id: 'love_1', text: 'I feel loved when someone gives me undivided attention.', subscale: 'quality_time' },
      { id: 'love_2', text: 'I feel loved when someone helps me with tasks or chores.', subscale: 'acts_of_service' },
      { id: 'love_3', text: 'I feel loved when I receive a thoughtful gift.', subscale: 'gifts' },
      { id: 'love_4', text: 'I feel loved when someone tells me they appreciate me.', subscale: 'words' },
      { id: 'love_5', text: 'I feel loved when someone hugs me or holds my hand.', subscale: 'touch' },
      { id: 'love_6', text: 'Spending quality time together is important to me.', subscale: 'quality_time' },
      { id: 'love_7', text: 'When someone does something helpful for me, I feel cared for.', subscale: 'acts_of_service' },
      { id: 'love_8', text: 'Receiving a meaningful present means a lot to me.', subscale: 'gifts' },
      { id: 'love_9', text: 'Hearing "I love you" or compliments is important to me.', subscale: 'words' },
      { id: 'love_10', text: 'Physical affection makes me feel connected.', subscale: 'touch' }
    ],
    scale: DARK_SCALE,
    calculateScore: (answers) => calculateMean(answers, loveLanguages.full.questions, 5),
    interpretation: (score, answers) => {
      if (!answers) return score >= 70 ? 'High emotional needs' : score >= 40 ? 'Moderate needs' : 'Lower needs';
      const subscales = calculateSubscales(answers, loveLanguages.full.questions, 5);
      const labels: Record<string, string> = {
        'words': 'Words of Affirmation',
        'acts_of_service': 'Acts of Service',
        'gifts': 'Receiving Gifts',
        'quality_time': 'Quality Time',
        'touch': 'Physical Touch'
      };

      // Sort subscales by score descending
      const sorted = Object.entries(subscales)
        .sort(([,a], [,b]) => b - a)
        .map(([k, v]) => ({ key: k, score: v, label: labels[k] }));

      const primary = sorted[0];
      const secondary = sorted[1];
      const scoreStr = sorted.map(s => `${s.label}=${s.score}`).join(', ');

      if (primary.score - secondary.score <= 10) {
        return `Primary: ${primary.label} & ${secondary.label} (tied). Profile: ${scoreStr}`;
      }
      return `Primary: ${primary.label} (${primary.score}). Secondary: ${secondary.label} (${secondary.score}). Full profile: ${scoreStr}`;
    }
  }
};

export const communicationStyle: { quick: Assessment; full: Assessment } = {
  quick: {
    domainId: 'communication_style',
    name: 'Communication Style Quick Assessment',
    shortName: 'Communication (Quick)',
    description: 'Single-item communication style measure',
    source: 'Based on DISC Assessment',
    questions: [
      { id: 'comm_q1', text: 'In conversations, I tend to be direct and assertive rather than diplomatic and cautious.' }
    ],
    scale: DARK_SCALE,
    calculateScore: (answers) => Math.round(((answers['comm_q1'] || 3) - 1) / 4 * 100),
    interpretation: (score) => score >= 70 ? 'Direct communicator - assertive, task-focused' :
                              score >= 40 ? 'Balanced communicator - adapts style to situation' :
                              'Indirect communicator - diplomatic, relationship-focused'
  },
  full: {
    domainId: 'communication_style',
    name: 'Communication Style Assessment',
    shortName: 'Communication (Full)',
    description: 'Based on DISC communication profiles',
    source: 'Adapted from DISC Assessment (Marston, 1928)',
    questions: [
      // Dominance
      { id: 'comm_1', text: 'I enjoy taking charge in group situations.', subscale: 'D' },
      { id: 'comm_2', text: 'I am competitive and like to win.', subscale: 'D' },
      // Influence
      { id: 'comm_3', text: 'I am optimistic and enthusiastic.', subscale: 'I' },
      { id: 'comm_4', text: 'I enjoy meeting new people.', subscale: 'I' },
      // Steadiness
      { id: 'comm_5', text: 'I am patient and a good listener.', subscale: 'S' },
      { id: 'comm_6', text: 'I prefer a stable, predictable environment.', subscale: 'S' },
      // Conscientiousness
      { id: 'comm_7', text: 'I focus on accuracy and quality.', subscale: 'C' },
      { id: 'comm_8', text: 'I analyze all the facts before making decisions.', subscale: 'C' },
      { id: 'comm_9', text: 'I prefer to communicate in writing rather than verbally.', subscale: 'C' },
      { id: 'comm_10', text: 'I adapt my communication style based on who I\'m talking to.' }
    ],
    scale: DARK_SCALE,
    calculateScore: (answers) => calculateMean(answers, communicationStyle.full.questions, 5),
    interpretation: (score, answers) => {
      if (!answers) return score >= 70 ? 'Assertive' : score >= 40 ? 'Balanced' : 'Reserved';
      const subscales = calculateSubscales(answers, communicationStyle.full.questions, 5);
      const labels: Record<string, string> = {
        'D': 'Dominance',
        'I': 'Influence',
        'S': 'Steadiness',
        'C': 'Conscientiousness'
      };
      const descriptions: Record<string, string> = {
        'D': 'direct, results-oriented, decisive',
        'I': 'enthusiastic, optimistic, collaborative',
        'S': 'patient, reliable, team-oriented',
        'C': 'analytical, precise, systematic'
      };

      // Sort by score descending
      const sorted = Object.entries(subscales)
        .sort(([,a], [,b]) => b - a)
        .map(([k, v]) => ({ key: k, score: v, label: labels[k], desc: descriptions[k] }));

      const primary = sorted[0];
      const secondary = sorted[1];
      const scoreStr = sorted.map(s => `${s.key}=${s.score}`).join(' ');

      if (primary.score - secondary.score <= 10) {
        return `DiSC Profile: ${primary.key}${secondary.key} (${scoreStr}). Blend of ${primary.label} and ${secondary.label} - ${primary.desc} with ${secondary.desc} tendencies.`;
      }
      return `DiSC Profile: ${primary.key} (${scoreStr}). Primary ${primary.label} - ${primary.desc}. Secondary: ${secondary.label}.`;
    }
  }
};

// ============================================================================
// D. DECISION MAKING & MOTIVATION
// ============================================================================

export const riskTolerance: { quick: Assessment; full: Assessment } = {
  quick: {
    domainId: 'risk_tolerance',
    name: 'Risk Tolerance Quick Assessment',
    shortName: 'Risk (Quick)',
    description: 'Single-item risk tolerance measure',
    source: 'Adapted from DOSPERT (Blais & Weber, 2006)',
    questions: [
      { id: 'risk_q1', text: 'I am willing to take risks to achieve my goals.' }
    ],
    scale: DARK_SCALE,
    calculateScore: (answers) => Math.round(((answers['risk_q1'] || 3) - 1) / 4 * 100),
    interpretation: (score) => score >= 70 ? 'High risk tolerance - comfortable with uncertainty and bold choices' :
                              score >= 40 ? 'Moderate risk tolerance - calculated risk-taking' :
                              'Low risk tolerance - prefers safety and certainty'
  },
  full: {
    domainId: 'risk_tolerance',
    name: 'Risk Taking Assessment',
    shortName: 'Risk (Full)',
    description: 'Based on Domain-Specific Risk-Taking Scale',
    source: 'DOSPERT (Blais & Weber, 2006)',
    questions: [
      { id: 'risk_1', text: 'Betting a day\'s income at a casino.', subscale: 'financial' },
      { id: 'risk_2', text: 'Investing 10% of your annual income in a new business venture.', subscale: 'financial' },
      { id: 'risk_3', text: 'Going camping in the wilderness.', subscale: 'recreational' },
      { id: 'risk_4', text: 'Going down a ski run that is beyond your ability.', subscale: 'recreational' },
      { id: 'risk_5', text: 'Disagreeing with an authority figure on a major issue.', subscale: 'social' },
      { id: 'risk_6', text: 'Speaking your mind about an unpopular issue at a social event.', subscale: 'social' },
      { id: 'risk_7', text: 'Drinking heavily at a social function.', subscale: 'health' },
      { id: 'risk_8', text: 'Engaging in unprotected sex.', subscale: 'health' },
      { id: 'risk_9', text: 'Taking a job that you enjoy over one that is secure.', subscale: 'ethical' },
      { id: 'risk_10', text: 'Moving to a new city for a fresh start.', subscale: 'social' }
    ],
    scale: { min: 1, max: 7, labels: ['Extremely Unlikely', 'Moderately Unlikely', 'Somewhat Unlikely', 'Not Sure', 'Somewhat Likely', 'Moderately Likely', 'Extremely Likely'] },
    calculateScore: (answers) => calculateMean(answers, riskTolerance.full.questions, 7),
    interpretation: (score, answers) => {
      if (!answers) return score >= 70 ? 'High risk tolerance' : score >= 40 ? 'Moderate' : 'Low';
      const subscales = calculateSubscales(answers, riskTolerance.full.questions, 7);
      const labels: Record<string, string> = {
        'financial': 'Financial',
        'recreational': 'Recreational',
        'social': 'Social',
        'health': 'Health/Safety',
        'ethical': 'Ethical'
      };

      const sorted = Object.entries(subscales)
        .sort(([,a], [,b]) => b - a)
        .map(([k, v]) => ({ key: k, score: v, label: labels[k] }));

      const highest = sorted[0];
      const lowest = sorted[sorted.length - 1];
      const scoreStr = sorted.map(s => `${s.label}=${s.score}`).join(', ');

      let profile = score >= 70 ? 'High risk-taker' : score >= 40 ? 'Moderate risk-taker' : 'Risk-averse';
      return `${profile}. Most willing: ${highest.label} risks (${highest.score}). Most cautious: ${lowest.label} (${lowest.score}). Profile: ${scoreStr}`;
    }
  }
};

export const decisionStyle: { quick: Assessment; full: Assessment } = {
  quick: {
    domainId: 'decision_style',
    name: 'Decision Style Quick Assessment',
    shortName: 'Decision (Quick)',
    description: 'Single-item decision style measure',
    source: 'Adapted from GDMS (Scott & Bruce, 1995)',
    questions: [
      { id: 'dec_q1', text: 'When making decisions, I rely more on logic and analysis than on intuition and feelings.' }
    ],
    scale: DARK_SCALE,
    calculateScore: (answers) => Math.round(((answers['dec_q1'] || 3) - 1) / 4 * 100),
    interpretation: (score) => score >= 70 ? 'Rational decision style - logical, analytical approach' :
                              score >= 40 ? 'Balanced decision style - uses both logic and intuition' :
                              'Intuitive decision style - relies on gut feelings'
  },
  full: {
    domainId: 'decision_style',
    name: 'General Decision Making Style',
    shortName: 'Decision (Full)',
    description: 'Based on General Decision Making Style inventory',
    source: 'GDMS (Scott & Bruce, 1995)',
    questions: [
      // Rational
      { id: 'dec_1', text: 'I make decisions in a logical and systematic way.', subscale: 'rational' },
      { id: 'dec_2', text: 'My decision making requires careful thought.', subscale: 'rational' },
      // Intuitive
      { id: 'dec_3', text: 'When making decisions, I rely upon my instincts.', subscale: 'intuitive' },
      { id: 'dec_4', text: 'I generally make decisions that feel right to me.', subscale: 'intuitive' },
      // Dependent
      { id: 'dec_5', text: 'I often need the assistance of other people when making important decisions.', subscale: 'dependent' },
      { id: 'dec_6', text: 'I rarely make important decisions without consulting other people.', subscale: 'dependent' },
      // Avoidant
      { id: 'dec_7', text: 'I avoid making important decisions until the pressure is on.', subscale: 'avoidant' },
      { id: 'dec_8', text: 'I postpone decision making whenever possible.', subscale: 'avoidant' },
      // Spontaneous
      { id: 'dec_9', text: 'I often make decisions on the spur of the moment.', subscale: 'spontaneous' },
      { id: 'dec_10', text: 'I make quick decisions.', subscale: 'spontaneous' }
    ],
    scale: DARK_SCALE,
    calculateScore: (answers) => {
      // Focus on rational subscale for primary score
      const rationalQs = decisionStyle.full.questions.filter(q => q.subscale === 'rational');
      return calculateMean(answers, rationalQs, 5);
    },
    interpretation: (score, answers) => {
      if (!answers) return score >= 70 ? 'Rational' : score >= 40 ? 'Balanced' : 'Intuitive';
      const subscales = calculateSubscales(answers, decisionStyle.full.questions, 5);
      const labels: Record<string, string> = {
        'rational': 'Rational',
        'intuitive': 'Intuitive',
        'dependent': 'Dependent',
        'avoidant': 'Avoidant',
        'spontaneous': 'Spontaneous'
      };
      const descriptions: Record<string, string> = {
        'rational': 'logical, systematic analysis',
        'intuitive': 'gut feelings and instincts',
        'dependent': 'consulting others for input',
        'avoidant': 'postponing decisions',
        'spontaneous': 'quick, impulsive choices'
      };

      const sorted = Object.entries(subscales)
        .sort(([,a], [,b]) => b - a)
        .map(([k, v]) => ({ key: k, score: v, label: labels[k], desc: descriptions[k] }));

      const primary = sorted[0];
      const secondary = sorted[1];
      const scoreStr = sorted.map(s => `${s.label}=${s.score}`).join(', ');

      return `Primary: ${primary.label} (${primary.score}) - ${primary.desc}. Secondary: ${secondary.label} (${secondary.score}). Profile: ${scoreStr}`;
    }
  }
};

export const timeOrientation: { quick: Assessment; full: Assessment } = {
  quick: {
    domainId: 'time_orientation',
    name: 'Time Orientation Quick Assessment',
    shortName: 'Time (Quick)',
    description: 'Single-item time perspective measure',
    source: 'Adapted from ZTPI (Zimbardo & Boyd, 1999)',
    questions: [
      { id: 'time_q1', text: 'I focus more on the future than the past or present.' }
    ],
    scale: DARK_SCALE,
    calculateScore: (answers) => Math.round(((answers['time_q1'] || 3) - 1) / 4 * 100),
    interpretation: (score) => score >= 70 ? 'Future-oriented - goal-focused, plans ahead' :
                              score >= 40 ? 'Balanced time perspective - considers all timeframes' :
                              'Present/past-oriented - focused on now or reflecting on past'
  },
  full: {
    domainId: 'time_orientation',
    name: 'Time Perspective Assessment',
    shortName: 'Time (Full)',
    description: 'Based on Zimbardo Time Perspective Inventory',
    source: 'ZTPI-Short (Zimbardo & Boyd, 1999)',
    questions: [
      // Past Negative
      { id: 'time_1', text: 'I think about the bad things that have happened to me in the past.', subscale: 'past_negative' },
      { id: 'time_2', text: 'Painful past experiences keep being replayed in my mind.', subscale: 'past_negative' },
      // Past Positive
      { id: 'time_3', text: 'Happy memories of good times spring readily to mind.', subscale: 'past_positive' },
      { id: 'time_4', text: 'I enjoy stories about how things used to be in "the good old times."', subscale: 'past_positive' },
      // Present Hedonistic
      { id: 'time_5', text: 'Taking risks keeps my life from becoming boring.', subscale: 'present_hedonistic' },
      { id: 'time_6', text: 'I do things impulsively.', subscale: 'present_hedonistic' },
      // Present Fatalistic
      { id: 'time_7', text: 'Fate determines much in my life.', subscale: 'present_fatalistic' },
      { id: 'time_8', text: 'You can\'t really plan for the future because things change so much.', subscale: 'present_fatalistic' },
      // Future
      { id: 'time_9', text: 'I complete projects on time by making steady progress.', subscale: 'future' },
      { id: 'time_10', text: 'I am able to resist temptations when I know that there is work to be done.', subscale: 'future' }
    ],
    scale: DARK_SCALE,
    calculateScore: (answers) => {
      // Focus on future subscale
      const futureQs = timeOrientation.full.questions.filter(q => q.subscale === 'future');
      return calculateMean(answers, futureQs, 5);
    },
    interpretation: (score, answers) => {
      if (!answers) return score >= 70 ? 'Future-oriented' : score >= 40 ? 'Balanced' : 'Present-focused';
      const subscales = calculateSubscales(answers, timeOrientation.full.questions, 5);
      const labels: Record<string, string> = {
        'past_negative': 'Past Negative',
        'past_positive': 'Past Positive',
        'present_hedonistic': 'Present Hedonistic',
        'present_fatalistic': 'Present Fatalistic',
        'future': 'Future'
      };
      const descriptions: Record<string, string> = {
        'past_negative': 'focus on past regrets and trauma',
        'past_positive': 'nostalgic, warm memories of past',
        'present_hedonistic': 'pleasure-seeking, living in the moment',
        'present_fatalistic': 'feeling fate controls outcomes',
        'future': 'goal-oriented, planning ahead'
      };

      const sorted = Object.entries(subscales)
        .sort(([,a], [,b]) => b - a)
        .map(([k, v]) => ({ key: k, score: v, label: labels[k], desc: descriptions[k] }));

      const primary = sorted[0];
      const secondary = sorted[1];
      const scoreStr = sorted.map(s => `${s.label}=${s.score}`).join(', ');

      // Check for concerning patterns
      const concerns: string[] = [];
      if (subscales['past_negative'] >= 70) concerns.push('high past-negative rumination');
      if (subscales['present_fatalistic'] >= 70) concerns.push('strong fatalistic beliefs');

      let result = `Dominant: ${primary.label} (${primary.score}) - ${primary.desc}. Secondary: ${secondary.label}. Profile: ${scoreStr}`;
      if (concerns.length > 0) result += ` Note: ${concerns.join(', ')}.`;
      return result;
    }
  }
};

export const achievementMotivation: { quick: Assessment; full: Assessment } = {
  quick: {
    domainId: 'achievement_motivation',
    name: 'Achievement Motivation Quick Assessment',
    shortName: 'Achievement (Quick)',
    description: 'Single-item achievement motivation measure',
    source: 'Adapted from nAch Scale',
    questions: [
      { id: 'ach_q1', text: 'I have a strong desire to accomplish difficult tasks and achieve excellence.' }
    ],
    scale: DARK_SCALE,
    calculateScore: (answers) => Math.round(((answers['ach_q1'] || 3) - 1) / 4 * 100),
    interpretation: (score) => score >= 70 ? 'High achievement motivation - driven to excel and succeed' :
                              score >= 40 ? 'Moderate achievement motivation - balanced drive' :
                              'Lower achievement motivation - may prioritize other values'
  },
  full: {
    domainId: 'achievement_motivation',
    name: 'Achievement Motivation Scale',
    shortName: 'Achievement (Full)',
    description: 'Based on Need for Achievement measures',
    source: 'Adapted from Achievement Motivation Scale (Lang & Fries, 2006)',
    questions: [
      { id: 'ach_1', text: 'I work hard to continually improve my performance.' },
      { id: 'ach_2', text: 'I enjoy setting and achieving challenging goals.' },
      { id: 'ach_3', text: 'I feel satisfied when I master a difficult task.' },
      { id: 'ach_4', text: 'I prefer tasks that are challenging over easy ones.' },
      { id: 'ach_5', text: 'I persist at tasks until they are completed.' },
      { id: 'ach_6', text: 'Success means a lot to me.' },
      { id: 'ach_7', text: 'I set high standards for myself.' },
      { id: 'ach_8', text: 'I am ambitious.' },
      { id: 'ach_9', text: 'I get restless when I haven\'t accomplished anything for a while.' },
      { id: 'ach_10', text: 'Competition motivates me to do my best.' }
    ],
    scale: DARK_SCALE,
    calculateScore: (answers) => calculateMean(answers, achievementMotivation.full.questions, 5),
    interpretation: (score) => score >= 70 ? 'High achievement motivation - strongly driven toward success' :
                              score >= 40 ? 'Moderate motivation - balanced approach to achievement' :
                              'Lower achievement focus - values other life aspects'
  }
};

export const selfEfficacy: { quick: Assessment; full: Assessment } = {
  quick: {
    domainId: 'self_efficacy',
    name: 'Self-Efficacy Quick Assessment',
    shortName: 'Self-Efficacy (Quick)',
    description: 'Single-item self-efficacy measure',
    source: 'Adapted from GSE (Schwarzer & Jerusalem, 1995)',
    questions: [
      { id: 'se_q1', text: 'I can always manage to solve difficult problems if I try hard enough.' }
    ],
    scale: { min: 1, max: 4, labels: ['Not at all true', 'Hardly true', 'Moderately true', 'Exactly true'] },
    calculateScore: (answers) => Math.round(((answers['se_q1'] || 2) - 1) / 3 * 100),
    interpretation: (score) => score >= 70 ? 'High self-efficacy - strong belief in ability to succeed' :
                              score >= 40 ? 'Moderate self-efficacy - reasonable confidence' :
                              'Lower self-efficacy - may doubt abilities in challenges'
  },
  full: {
    domainId: 'self_efficacy',
    name: 'General Self-Efficacy Scale',
    shortName: 'Self-Efficacy (Full)',
    description: 'The validated General Self-Efficacy Scale',
    source: 'GSE (Schwarzer & Jerusalem, 1995)',
    questions: [
      { id: 'se_1', text: 'I can always manage to solve difficult problems if I try hard enough.' },
      { id: 'se_2', text: 'If someone opposes me, I can find the means and ways to get what I want.' },
      { id: 'se_3', text: 'It is easy for me to stick to my aims and accomplish my goals.' },
      { id: 'se_4', text: 'I am confident that I could deal efficiently with unexpected events.' },
      { id: 'se_5', text: 'Thanks to my resourcefulness, I know how to handle unforeseen situations.' },
      { id: 'se_6', text: 'I can solve most problems if I invest the necessary effort.' },
      { id: 'se_7', text: 'I can remain calm when facing difficulties because I can rely on my coping abilities.' },
      { id: 'se_8', text: 'When I am confronted with a problem, I can usually find several solutions.' },
      { id: 'se_9', text: 'If I am in trouble, I can usually think of a solution.' },
      { id: 'se_10', text: 'I can usually handle whatever comes my way.' }
    ],
    scale: { min: 1, max: 4, labels: ['Not at all true', 'Hardly true', 'Moderately true', 'Exactly true'] },
    calculateScore: (answers) => calculateMean(answers, selfEfficacy.full.questions, 4),
    interpretation: (score) => score >= 70 ? 'High self-efficacy - strong confidence in handling challenges' :
                              score >= 40 ? 'Moderate self-efficacy - adequate coping confidence' :
                              'Lower self-efficacy - may benefit from building confidence'
  }
};

export const locusOfControl: { quick: Assessment; full: Assessment } = {
  quick: {
    domainId: 'locus_of_control',
    name: 'Locus of Control Quick Assessment',
    shortName: 'Locus (Quick)',
    description: 'Single-item locus of control measure',
    source: 'Adapted from Rotter I-E Scale (Rotter, 1966)',
    questions: [
      { id: 'loc_q1', text: 'I am in control of what happens to me in life.' }
    ],
    scale: DARK_SCALE,
    calculateScore: (answers) => Math.round(((answers['loc_q1'] || 3) - 1) / 4 * 100),
    interpretation: (score) => score >= 70 ? 'Internal locus - believes in personal control over outcomes' :
                              score >= 40 ? 'Balanced locus - recognizes both personal and external factors' :
                              'External locus - attributes outcomes to external factors'
  },
  full: {
    domainId: 'locus_of_control',
    name: 'Locus of Control Scale',
    shortName: 'Locus (Full)',
    description: 'Based on Rotter\'s Internal-External Scale',
    source: 'Adapted from Rotter I-E Scale (Rotter, 1966)',
    questions: [
      { id: 'loc_1', text: 'My life is determined by my own actions.' },
      { id: 'loc_2', text: 'I am usually able to protect my personal interests.' },
      { id: 'loc_3', text: 'When I get what I want, it\'s usually because I worked hard for it.' },
      { id: 'loc_4', text: 'My life is chiefly controlled by powerful others.', reverseScored: true },
      { id: 'loc_5', text: 'I feel like what happens in my life is mostly determined by others.', reverseScored: true },
      { id: 'loc_6', text: 'To a great extent my life is controlled by accidental happenings.', reverseScored: true },
      { id: 'loc_7', text: 'People like myself have very little chance of protecting our personal interests.', reverseScored: true },
      { id: 'loc_8', text: 'I can pretty much determine what will happen in my life.' },
      { id: 'loc_9', text: 'When I make plans, I am almost certain to make them work.' },
      { id: 'loc_10', text: 'Whether or not I get into a car accident is mostly a matter of luck.', reverseScored: true }
    ],
    scale: DARK_SCALE,
    calculateScore: (answers) => calculateMean(answers, locusOfControl.full.questions, 5),
    interpretation: (score) => score >= 70 ? 'Strong internal locus - high sense of personal agency' :
                              score >= 40 ? 'Balanced locus - realistic view of control' :
                              'External locus - may feel controlled by circumstances'
  }
};

export const growthMindset: { quick: Assessment; full: Assessment } = {
  quick: {
    domainId: 'growth_mindset',
    name: 'Growth Mindset Quick Assessment',
    shortName: 'Mindset (Quick)',
    description: 'Single-item mindset measure',
    source: 'Adapted from Dweck Mindset Scale',
    questions: [
      { id: 'gm_q1', text: 'You can always substantially change how intelligent you are.' }
    ],
    scale: { min: 1, max: 6, labels: ['Strongly Disagree', 'Disagree', 'Mostly Disagree', 'Mostly Agree', 'Agree', 'Strongly Agree'] },
    calculateScore: (answers) => Math.round(((answers['gm_q1'] || 3) - 1) / 5 * 100),
    interpretation: (score) => score >= 70 ? 'Growth mindset - believes abilities can be developed' :
                              score >= 40 ? 'Mixed mindset - some flexibility in beliefs' :
                              'Fixed mindset - believes abilities are largely fixed'
  },
  full: {
    domainId: 'growth_mindset',
    name: 'Implicit Theories of Intelligence Scale',
    shortName: 'Mindset (Full)',
    description: 'The validated Dweck Mindset Scale',
    source: 'Dweck Mindset Scale (Dweck, 2000)',
    questions: [
      // Fixed mindset items (reverse scored)
      { id: 'gm_1', text: 'You have a certain amount of intelligence, and you can\'t really do much to change it.', reverseScored: true },
      { id: 'gm_2', text: 'Your intelligence is something about you that you can\'t change very much.', reverseScored: true },
      { id: 'gm_3', text: 'To be honest, you can\'t really change how intelligent you are.', reverseScored: true },
      { id: 'gm_4', text: 'You can learn new things, but you can\'t really change your basic intelligence.', reverseScored: true },
      // Growth mindset items
      { id: 'gm_5', text: 'No matter who you are, you can significantly change your intelligence level.' },
      { id: 'gm_6', text: 'You can always substantially change how intelligent you are.' },
      { id: 'gm_7', text: 'No matter how much intelligence you have, you can always change it quite a bit.' },
      { id: 'gm_8', text: 'You can change even your basic intelligence level considerably.' }
    ],
    scale: { min: 1, max: 6, labels: ['Strongly Disagree', 'Disagree', 'Mostly Disagree', 'Mostly Agree', 'Agree', 'Strongly Agree'] },
    calculateScore: (answers) => calculateMean(answers, growthMindset.full.questions, 6),
    interpretation: (score) => score >= 70 ? 'Strong growth mindset - embraces challenges and learning' :
                              score >= 40 ? 'Mixed mindset - some growth beliefs' :
                              'Fixed mindset - may avoid challenges to protect self-image'
  }
};

// ============================================================================
// E. VALUES & WELLBEING
// ============================================================================

export const personalValues: { quick: Assessment; full: Assessment } = {
  quick: {
    domainId: 'personal_values',
    name: 'Personal Values Quick Assessment',
    shortName: 'Values (Quick)',
    description: 'Single-item core value identification',
    source: 'Adapted from Schwartz PVQ',
    questions: [
      { id: 'val_q1', text: 'What matters most to you? Rate how much you value personal achievement and success.' }
    ],
    scale: { min: 1, max: 6, labels: ['Not at all like me', 'Not like me', 'Somewhat unlike me', 'Somewhat like me', 'Like me', 'Very much like me'] },
    calculateScore: (answers) => Math.round(((answers['val_q1'] || 3) - 1) / 5 * 100),
    interpretation: (score) => score >= 70 ? 'Achievement-oriented values - prioritizes success and competence' :
                              score >= 40 ? 'Balanced values - achievement matters but not paramount' :
                              'Other-focused values - may prioritize relationships or other domains'
  },
  full: {
    domainId: 'personal_values',
    name: 'Portrait Values Questionnaire',
    shortName: 'Values (Full)',
    description: 'Based on Schwartz Value Survey',
    source: 'PVQ-21 (Schwartz et al., 2001)',
    questions: [
      { id: 'val_1', text: 'Thinking up new ideas and being creative is important to me.', subscale: 'self-direction' },
      { id: 'val_2', text: 'It is important to me to be rich and have a lot of money.', subscale: 'power' },
      { id: 'val_3', text: 'I think it is important that every person in the world be treated equally.', subscale: 'universalism' },
      { id: 'val_4', text: 'It is important to me to show my abilities and be admired.', subscale: 'achievement' },
      { id: 'val_5', text: 'It is important to me to live in secure surroundings.', subscale: 'security' },
      { id: 'val_6', text: 'I like surprises and am always looking for new things to do.', subscale: 'stimulation' },
      { id: 'val_7', text: 'I believe that people should do what they\'re told.', subscale: 'conformity' },
      { id: 'val_8', text: 'It is important to me to listen to people who are different from me.', subscale: 'universalism' },
      { id: 'val_9', text: 'It is important to me to be humble and modest.', subscale: 'tradition' },
      { id: 'val_10', text: 'Having a good time is important to me.', subscale: 'hedonism' },
      { id: 'val_11', text: 'It is important to me to make my own decisions.', subscale: 'self-direction' },
      { id: 'val_12', text: 'It is important to me to help the people around me.', subscale: 'benevolence' }
    ],
    scale: { min: 1, max: 6, labels: ['Not at all like me', 'Not like me', 'Somewhat unlike me', 'Somewhat like me', 'Like me', 'Very much like me'] },
    calculateScore: (answers) => calculateMean(answers, personalValues.full.questions, 6),
    interpretation: (score, answers) => {
      if (!answers) return score >= 70 ? 'Strong value clarity' : score >= 40 ? 'Moderate' : 'Exploring';
      const subscales = calculateSubscales(answers, personalValues.full.questions, 6);
      const labels: Record<string, string> = {
        'self-direction': 'Self-Direction',
        'stimulation': 'Stimulation',
        'hedonism': 'Hedonism',
        'achievement': 'Achievement',
        'power': 'Power',
        'security': 'Security',
        'conformity': 'Conformity',
        'tradition': 'Tradition',
        'benevolence': 'Benevolence',
        'universalism': 'Universalism'
      };

      const sorted = Object.entries(subscales)
        .sort(([,a], [,b]) => b - a)
        .map(([k, v]) => ({ key: k, score: v, label: labels[k] }));

      const top3 = sorted.slice(0, 3);
      const bottom2 = sorted.slice(-2);

      // Schwartz value circumplex groupings
      const selfEnhancement = (subscales['achievement'] || 0) + (subscales['power'] || 0);
      const selfTranscendence = (subscales['benevolence'] || 0) + (subscales['universalism'] || 0);
      const openness = (subscales['self-direction'] || 0) + (subscales['stimulation'] || 0);
      const conservation = (subscales['security'] || 0) + (subscales['conformity'] || 0) + (subscales['tradition'] || 0);

      let orientation = '';
      if (selfTranscendence > selfEnhancement + 20) orientation = 'others-focused';
      else if (selfEnhancement > selfTranscendence + 20) orientation = 'self-focused';
      if (openness > conservation + 20) orientation += (orientation ? ', ' : '') + 'change-embracing';
      else if (conservation > openness + 20) orientation += (orientation ? ', ' : '') + 'stability-seeking';

      const topStr = top3.map(v => `${v.label}(${v.score})`).join(', ');
      const bottomStr = bottom2.map(v => `${v.label}(${v.score})`).join(', ');

      return `Core values: ${topStr}. Less important: ${bottomStr}.${orientation ? ` Orientation: ${orientation}.` : ''}`;
    }
  }
};

export const interests: { quick: Assessment; full: Assessment } = {
  quick: {
    domainId: 'interests',
    name: 'Interests Quick Assessment',
    shortName: 'Interests (Quick)',
    description: 'Single-item interest orientation',
    source: 'Adapted from Holland RIASEC',
    questions: [
      { id: 'int_q1', text: 'I prefer working with ideas and thinking over working with my hands or with people.' }
    ],
    scale: DARK_SCALE,
    calculateScore: (answers) => Math.round(((answers['int_q1'] || 3) - 1) / 4 * 100),
    interpretation: (score) => score >= 70 ? 'Investigative orientation - prefers analytical, intellectual tasks' :
                              score >= 40 ? 'Mixed interests - balanced orientation' :
                              'Practical/Social orientation - prefers hands-on or interpersonal work'
  },
  full: {
    domainId: 'interests',
    name: 'Vocational Interest Assessment',
    shortName: 'Interests (Full)',
    description: 'Based on Holland\'s RIASEC model',
    source: 'Holland RIASEC (Holland, 1997)',
    questions: [
      // Realistic
      { id: 'int_1', text: 'I enjoy working with tools and machines.', subscale: 'R' },
      { id: 'int_2', text: 'I like building or fixing things.', subscale: 'R' },
      // Investigative
      { id: 'int_3', text: 'I enjoy solving complex problems.', subscale: 'I' },
      { id: 'int_4', text: 'I like analyzing data and information.', subscale: 'I' },
      // Artistic
      { id: 'int_5', text: 'I enjoy creative activities like writing, art, or music.', subscale: 'A' },
      { id: 'int_6', text: 'I like expressing myself through creative work.', subscale: 'A' },
      // Social
      { id: 'int_7', text: 'I enjoy helping and teaching others.', subscale: 'S' },
      { id: 'int_8', text: 'I like working directly with people.', subscale: 'S' },
      // Enterprising
      { id: 'int_9', text: 'I enjoy leading and persuading others.', subscale: 'E' },
      { id: 'int_10', text: 'I like starting new projects or businesses.', subscale: 'E' },
      // Conventional
      { id: 'int_11', text: 'I enjoy organizing and managing information.', subscale: 'C' },
      { id: 'int_12', text: 'I like following clear procedures and routines.', subscale: 'C' }
    ],
    scale: DARK_SCALE,
    calculateScore: (answers) => calculateMean(answers, interests.full.questions, 5),
    interpretation: (score, answers) => {
      if (!answers) return score >= 70 ? 'Strong clarity' : score >= 40 ? 'Moderate' : 'Broad';
      const subscales = calculateSubscales(answers, interests.full.questions, 5);
      const labels: Record<string, string> = {
        'R': 'Realistic',
        'I': 'Investigative',
        'A': 'Artistic',
        'S': 'Social',
        'E': 'Enterprising',
        'C': 'Conventional'
      };
      const descriptions: Record<string, string> = {
        'R': 'hands-on, practical work with tools/machines',
        'I': 'research, analysis, intellectual problem-solving',
        'A': 'creative expression, arts, unconventional work',
        'S': 'helping, teaching, counseling others',
        'E': 'leading, persuading, business ventures',
        'C': 'organizing, data management, structured tasks'
      };

      const sorted = Object.entries(subscales)
        .sort(([,a], [,b]) => b - a)
        .map(([k, v]) => ({ key: k, score: v, label: labels[k], desc: descriptions[k] }));

      // Holland code is top 3 letters
      const hollandCode = sorted.slice(0, 3).map(s => s.key).join('');
      const primary = sorted[0];
      const secondary = sorted[1];
      const tertiary = sorted[2];

      const scoreStr = sorted.map(s => `${s.key}=${s.score}`).join(' ');

      return `Holland Code: ${hollandCode} (${scoreStr}). Primary: ${primary.label} - ${primary.desc}. Also strong: ${secondary.label}, ${tertiary.label}.`;
    }
  }
};

export const lifeSatisfaction: { quick: Assessment; full: Assessment } = {
  quick: {
    domainId: 'life_satisfaction',
    name: 'Life Satisfaction Quick Assessment',
    shortName: 'Life Satisfaction (Quick)',
    description: 'Single-item life satisfaction measure',
    source: 'Single-Item Life Satisfaction (Cheung & Lucas, 2014)',
    questions: [
      { id: 'ls_q1', text: 'All things considered, how satisfied are you with your life as a whole these days?' }
    ],
    scale: { min: 0, max: 10, labels: ['Completely Dissatisfied', '', '', '', '', 'Neutral', '', '', '', '', 'Completely Satisfied'] },
    calculateScore: (answers) => Math.round((answers['ls_q1'] || 5) * 10),
    interpretation: (score) => score >= 70 ? 'High life satisfaction - generally happy with life' :
                              score >= 40 ? 'Moderate life satisfaction - some contentment' :
                              'Lower life satisfaction - may be experiencing challenges'
  },
  full: {
    domainId: 'life_satisfaction',
    name: 'Satisfaction With Life Scale',
    shortName: 'Life Satisfaction (Full)',
    description: 'The validated SWLS',
    source: 'SWLS (Diener et al., 1985)',
    questions: [
      { id: 'ls_1', text: 'In most ways my life is close to my ideal.' },
      { id: 'ls_2', text: 'The conditions of my life are excellent.' },
      { id: 'ls_3', text: 'I am satisfied with my life.' },
      { id: 'ls_4', text: 'So far I have gotten the important things I want in life.' },
      { id: 'ls_5', text: 'If I could live my life over, I would change almost nothing.' }
    ],
    scale: TIPI_SCALE,
    calculateScore: (answers) => calculateMean(answers, lifeSatisfaction.full.questions, 7),
    interpretation: (score) => score >= 70 ? 'High life satisfaction - strong overall wellbeing' :
                              score >= 50 ? 'Average satisfaction - typical life contentment' :
                              score >= 30 ? 'Below average - some dissatisfaction' :
                              'Low satisfaction - may benefit from support'
  }
};

export const stressCoping: { quick: Assessment; full: Assessment } = {
  quick: {
    domainId: 'stress_coping',
    name: 'Stress Coping Quick Assessment',
    shortName: 'Coping (Quick)',
    description: 'Single-item coping measure',
    source: 'Adapted from Brief COPE',
    questions: [
      { id: 'cope_q1', text: 'I\'ve been taking action to try to make stressful situations better.' }
    ],
    scale: { min: 1, max: 4, labels: ['I haven\'t been doing this at all', 'A little bit', 'A medium amount', 'I\'ve been doing this a lot'] },
    calculateScore: (answers) => Math.round(((answers['cope_q1'] || 2) - 1) / 3 * 100),
    interpretation: (score) => score >= 70 ? 'Active coping style - takes action to address stressors' :
                              score >= 40 ? 'Moderate coping - uses some problem-focused strategies' :
                              'May use more avoidant coping strategies'
  },
  full: {
    domainId: 'stress_coping',
    name: 'Brief COPE Assessment',
    shortName: 'Coping (Full)',
    description: 'Based on Brief COPE inventory',
    source: 'Brief COPE (Carver, 1997)',
    questions: [
      // Active coping
      { id: 'cope_1', text: 'I\'ve been taking action to try to make the situation better.', subscale: 'active' },
      { id: 'cope_2', text: 'I\'ve been concentrating my efforts on doing something about the situation.', subscale: 'active' },
      // Planning
      { id: 'cope_3', text: 'I\'ve been trying to come up with a strategy about what to do.', subscale: 'planning' },
      { id: 'cope_4', text: 'I\'ve been thinking hard about what steps to take.', subscale: 'planning' },
      // Positive reframing
      { id: 'cope_5', text: 'I\'ve been trying to see it in a different light, to make it seem more positive.', subscale: 'reframing' },
      { id: 'cope_6', text: 'I\'ve been looking for something good in what is happening.', subscale: 'reframing' },
      // Acceptance
      { id: 'cope_7', text: 'I\'ve been accepting the reality of the fact that it has happened.', subscale: 'acceptance' },
      { id: 'cope_8', text: 'I\'ve been learning to live with it.', subscale: 'acceptance' },
      // Emotional support
      { id: 'cope_9', text: 'I\'ve been getting emotional support from others.', subscale: 'emotional_support' },
      { id: 'cope_10', text: 'I\'ve been getting comfort and understanding from someone.', subscale: 'emotional_support' }
    ],
    scale: { min: 1, max: 4, labels: ['I haven\'t been doing this at all', 'A little bit', 'A medium amount', 'I\'ve been doing this a lot'] },
    calculateScore: (answers) => calculateMean(answers, stressCoping.full.questions, 4),
    interpretation: (score, answers) => {
      if (!answers) return score >= 70 ? 'Strong adaptive coping' : score >= 40 ? 'Moderate' : 'Developing';
      const subscales = calculateSubscales(answers, stressCoping.full.questions, 4);
      const labels: Record<string, string> = {
        'active': 'Active Coping',
        'planning': 'Planning',
        'reframing': 'Positive Reframing',
        'acceptance': 'Acceptance',
        'emotional_support': 'Emotional Support'
      };

      const sorted = Object.entries(subscales)
        .sort(([,a], [,b]) => b - a)
        .map(([k, v]) => ({ key: k, score: v, label: labels[k] }));

      const primary = sorted[0];
      const secondary = sorted[1];
      const scoreStr = sorted.map(s => `${s.label}=${s.score}`).join(', ');

      // Categorize coping style
      const problemFocused = (subscales['active'] || 0) + (subscales['planning'] || 0);
      const emotionFocused = (subscales['reframing'] || 0) + (subscales['acceptance'] || 0) + (subscales['emotional_support'] || 0);

      let style = problemFocused > emotionFocused + 20 ? 'Problem-focused coper' :
                  emotionFocused > problemFocused + 20 ? 'Emotion-focused coper' : 'Balanced coper';

      return `${style}. Primary: ${primary.label} (${primary.score}). Secondary: ${secondary.label}. Profile: ${scoreStr}`;
    }
  }
};

export const socialSupport: { quick: Assessment; full: Assessment } = {
  quick: {
    domainId: 'social_support',
    name: 'Social Support Quick Assessment',
    shortName: 'Support (Quick)',
    description: 'Single-item social support measure',
    source: 'Adapted from MSPSS',
    questions: [
      { id: 'ss_q1', text: 'There is a special person in my life who cares about my feelings.' }
    ],
    scale: TIPI_SCALE,
    calculateScore: (answers) => Math.round(((answers['ss_q1'] || 4) - 1) / 6 * 100),
    interpretation: (score) => score >= 70 ? 'High perceived social support' :
                              score >= 40 ? 'Moderate social support' :
                              'Lower perceived support - may feel isolated'
  },
  full: {
    domainId: 'social_support',
    name: 'Multidimensional Scale of Perceived Social Support',
    shortName: 'Support (Full)',
    description: 'The validated MSPSS',
    source: 'MSPSS (Zimet et al., 1988)',
    questions: [
      // Significant Other
      { id: 'ss_1', text: 'There is a special person who is around when I am in need.', subscale: 'SO' },
      { id: 'ss_2', text: 'There is a special person with whom I can share my joys and sorrows.', subscale: 'SO' },
      { id: 'ss_3', text: 'I have a special person who is a real source of comfort to me.', subscale: 'SO' },
      { id: 'ss_4', text: 'There is a special person in my life who cares about my feelings.', subscale: 'SO' },
      // Family
      { id: 'ss_5', text: 'My family really tries to help me.', subscale: 'family' },
      { id: 'ss_6', text: 'I get the emotional help and support I need from my family.', subscale: 'family' },
      { id: 'ss_7', text: 'I can talk about my problems with my family.', subscale: 'family' },
      { id: 'ss_8', text: 'My family is willing to help me make decisions.', subscale: 'family' },
      // Friends
      { id: 'ss_9', text: 'My friends really try to help me.', subscale: 'friends' },
      { id: 'ss_10', text: 'I can count on my friends when things go wrong.', subscale: 'friends' },
      { id: 'ss_11', text: 'I have friends with whom I can share my joys and sorrows.', subscale: 'friends' },
      { id: 'ss_12', text: 'I can talk about my problems with my friends.', subscale: 'friends' }
    ],
    scale: TIPI_SCALE,
    calculateScore: (answers) => calculateMean(answers, socialSupport.full.questions, 7),
    interpretation: (score, answers) => {
      if (!answers) return score >= 70 ? 'High support' : score >= 40 ? 'Moderate' : 'Lower support';
      const subscales = calculateSubscales(answers, socialSupport.full.questions, 7);
      const labels: Record<string, string> = {
        'SO': 'Significant Other',
        'family': 'Family',
        'friends': 'Friends'
      };

      const sorted = Object.entries(subscales)
        .sort(([,a], [,b]) => b - a)
        .map(([k, v]) => ({ key: k, score: v, label: labels[k] }));

      const strongest = sorted[0];
      const weakest = sorted[sorted.length - 1];
      const scoreStr = sorted.map(s => `${s.label}=${s.score}`).join(', ');

      // Check for imbalances
      const gaps: string[] = [];
      if (subscales['SO'] < 40) gaps.push('partner/significant other support');
      if (subscales['family'] < 40) gaps.push('family support');
      if (subscales['friends'] < 40) gaps.push('friend support');

      let result = `Primary support: ${strongest.label} (${strongest.score}). Profile: ${scoreStr}.`;
      if (gaps.length > 0) result += ` Potential gaps: ${gaps.join(', ')}.`;
      return result;
    }
  }
};

export const authenticity: { quick: Assessment; full: Assessment } = {
  quick: {
    domainId: 'authenticity',
    name: 'Authenticity Quick Assessment',
    shortName: 'Authenticity (Quick)',
    description: 'Single-item authenticity measure',
    source: 'Adapted from Authenticity Scale (Wood et al., 2008)',
    questions: [
      { id: 'auth_q1', text: 'I always stand by what I believe in.' }
    ],
    scale: TIPI_SCALE,
    calculateScore: (answers) => Math.round(((answers['auth_q1'] || 4) - 1) / 6 * 100),
    interpretation: (score) => score >= 70 ? 'High authenticity - lives according to true self' :
                              score >= 40 ? 'Moderate authenticity - generally true to self' :
                              'May struggle with being authentic in some situations'
  },
  full: {
    domainId: 'authenticity',
    name: 'Authenticity Scale',
    shortName: 'Authenticity (Full)',
    description: 'Based on Wood\'s Authenticity Scale',
    source: 'Authenticity Scale (Wood et al., 2008)',
    questions: [
      // Authentic Living
      { id: 'auth_1', text: 'I think it is better to be yourself, than to be popular.' },
      { id: 'auth_2', text: 'I don\'t know how I really feel inside.', reverseScored: true },
      { id: 'auth_3', text: 'I am strongly influenced by the opinions of others.', reverseScored: true },
      { id: 'auth_4', text: 'I always stand by what I believe in.' },
      // Self-Alienation (reverse scored)
      { id: 'auth_5', text: 'I feel out of touch with the "real me."', reverseScored: true },
      { id: 'auth_6', text: 'I feel alienated from myself.', reverseScored: true },
      // Accepting External Influence (reverse scored)
      { id: 'auth_7', text: 'I usually do what other people tell me to do.', reverseScored: true },
      { id: 'auth_8', text: 'Other people influence me greatly.', reverseScored: true },
      { id: 'auth_9', text: 'I live in accordance with my values and beliefs.' },
      { id: 'auth_10', text: 'I feel free to express my true self.' }
    ],
    scale: TIPI_SCALE,
    calculateScore: (answers) => calculateMean(answers, authenticity.full.questions, 7),
    interpretation: (score) => score >= 70 ? 'High authenticity - strong alignment with true self' :
                              score >= 40 ? 'Moderate authenticity - generally genuine' :
                              'May benefit from self-exploration and authentic expression'
  }
};

// ============================================================================
// F. COGNITIVE/LEARNING
// ============================================================================

export const cognitiveAbilities: { quick: Assessment; full: Assessment } = {
  quick: {
    domainId: 'cognitive_abilities',
    name: 'Cognitive Ability Quick Assessment',
    shortName: 'Cognitive (Quick)',
    description: 'Single-item cognitive self-assessment',
    source: 'Self-assessment measure',
    questions: [
      { id: 'cog_q1', text: 'I am quick to understand new concepts and ideas.' }
    ],
    scale: DARK_SCALE,
    calculateScore: (answers) => Math.round(((answers['cog_q1'] || 3) - 1) / 4 * 100),
    interpretation: (score) => score >= 70 ? 'High perceived cognitive ability' :
                              score >= 40 ? 'Moderate cognitive self-assessment' :
                              'May underestimate cognitive abilities'
  },
  full: {
    domainId: 'cognitive_abilities',
    name: 'Cognitive Self-Assessment',
    shortName: 'Cognitive (Full)',
    description: 'Self-reported cognitive abilities across domains',
    source: 'Based on multiple intelligences framework',
    questions: [
      { id: 'cog_1', text: 'I am quick to understand new concepts and ideas.' },
      { id: 'cog_2', text: 'I can easily see patterns in complex information.' },
      { id: 'cog_3', text: 'I have a good memory for facts and details.' },
      { id: 'cog_4', text: 'I can concentrate for long periods without getting distracted.' },
      { id: 'cog_5', text: 'I am good at solving logical puzzles.' },
      { id: 'cog_6', text: 'I can easily visualize objects from different angles.' },
      { id: 'cog_7', text: 'I am skilled at expressing myself verbally.' },
      { id: 'cog_8', text: 'I am good with numbers and mathematical reasoning.' },
      { id: 'cog_9', text: 'I can quickly process and respond to new information.' },
      { id: 'cog_10', text: 'I am good at multitasking and switching between tasks.' }
    ],
    scale: DARK_SCALE,
    calculateScore: (answers) => calculateMean(answers, cognitiveAbilities.full.questions, 5),
    interpretation: (score) => score >= 70 ? 'High cognitive self-efficacy' :
                              score >= 40 ? 'Moderate cognitive confidence' :
                              'May benefit from cognitive skill building'
  }
};

export const creativity: { quick: Assessment; full: Assessment } = {
  quick: {
    domainId: 'creativity',
    name: 'Creativity Quick Assessment',
    shortName: 'Creativity (Quick)',
    description: 'Single-item creativity measure',
    source: 'Adapted from Creative Achievement Questionnaire',
    questions: [
      { id: 'cre_q1', text: 'I often come up with novel ideas or solutions that others haven\'t thought of.' }
    ],
    scale: DARK_SCALE,
    calculateScore: (answers) => Math.round(((answers['cre_q1'] || 3) - 1) / 4 * 100),
    interpretation: (score) => score >= 70 ? 'High creativity - frequently generates novel ideas' :
                              score >= 40 ? 'Moderate creativity - some creative tendencies' :
                              'May prefer structured, conventional approaches'
  },
  full: {
    domainId: 'creativity',
    name: 'Creative Personality Assessment',
    shortName: 'Creativity (Full)',
    description: 'Based on creative personality research',
    source: 'Adapted from CAQ and CPS (Gough, 1979)',
    questions: [
      { id: 'cre_1', text: 'I have a lot of creative ideas.' },
      { id: 'cre_2', text: 'I like to think of new ways to do things.' },
      { id: 'cre_3', text: 'I often come up with novel ideas or solutions.' },
      { id: 'cre_4', text: 'I am inventive.' },
      { id: 'cre_5', text: 'I am original and come up with new ideas.' },
      { id: 'cre_6', text: 'I am curious about many different things.' },
      { id: 'cre_7', text: 'I like to find creative solutions to problems.' },
      { id: 'cre_8', text: 'I enjoy thinking about abstract concepts.' },
      { id: 'cre_9', text: 'I am imaginative.' },
      { id: 'cre_10', text: 'I often see connections that others miss.' }
    ],
    scale: DARK_SCALE,
    calculateScore: (answers) => calculateMean(answers, creativity.full.questions, 5),
    interpretation: (score) => score >= 70 ? 'Highly creative - strong innovative potential' :
                              score >= 40 ? 'Moderately creative - capable of creative work' :
                              'Prefers established methods and approaches'
  }
};

// VARK subscale calculation helper
function calculateVARKSubscales(answers: Record<string, number>): { V: number; A: number; R: number; K: number } {
  const subscales = { V: [] as number[], A: [] as number[], R: [] as number[], K: [] as number[] };

  // Map question IDs to subscales
  const questionSubscales: Record<string, 'V' | 'A' | 'R' | 'K'> = {
    'learn_1': 'V', 'learn_2': 'V', 'learn_3': 'V',
    'learn_4': 'A', 'learn_5': 'A', 'learn_6': 'A',
    'learn_7': 'R', 'learn_8': 'R', 'learn_9': 'R',
    'learn_10': 'K', 'learn_11': 'K', 'learn_12': 'K'
  };

  for (const [qId, value] of Object.entries(answers)) {
    const subscale = questionSubscales[qId];
    if (subscale) {
      subscales[subscale].push(value);
    }
  }

  // Calculate mean for each subscale, normalize to 0-100
  const calcMean = (arr: number[]) => arr.length > 0 ? Math.round((arr.reduce((a, b) => a + b, 0) / arr.length - 1) / 4 * 100) : 0;

  return {
    V: calcMean(subscales.V),
    A: calcMean(subscales.A),
    R: calcMean(subscales.R),
    K: calcMean(subscales.K)
  };
}

function interpretVARK(score: number, answers?: Record<string, number>): string {
  if (!answers) return score >= 70 ? 'Strong learning preference' : score >= 40 ? 'Moderate learning preference' : 'Flexible learning style';
  const scores = calculateVARKSubscales(answers);
  const labels = { V: 'Visual', A: 'Auditory', R: 'Read/Write', K: 'Kinesthetic' };

  // Find dominant style(s) - within 10 points of max
  const max = Math.max(scores.V, scores.A, scores.R, scores.K);
  const dominant = (Object.keys(scores) as Array<keyof typeof scores>)
    .filter(k => scores[k] >= max - 10)
    .map(k => labels[k]);

  const scoreStr = `V=${scores.V} A=${scores.A} R=${scores.R} K=${scores.K}`;

  if (dominant.length >= 3) {
    return `Multimodal learner (${scoreStr}) - You learn effectively through multiple channels`;
  } else if (dominant.length === 2) {
    return `${dominant.join('-')} learner (${scoreStr}) - You prefer ${dominant.join(' and ').toLowerCase()} learning`;
  } else {
    const primary = dominant[0];
    const descriptions: Record<string, string> = {
      'Visual': 'diagrams, charts, maps, and visual representations',
      'Auditory': 'lectures, discussions, and verbal explanations',
      'Read/Write': 'reading, writing notes, and text-based materials',
      'Kinesthetic': 'hands-on practice, experiments, and physical activities'
    };
    return `${primary} learner (${scoreStr}) - You learn best through ${descriptions[primary]}`;
  }
}

export const learningStyles: { quick: Assessment; full: Assessment } = {
  quick: {
    domainId: 'learning_styles',
    name: 'Learning Style Quick Assessment',
    shortName: 'VARK (Quick)',
    description: 'Quick single-item learning preference identifier',
    source: 'Adapted from VARK (Fleming, 1987)',
    questions: [
      { id: 'learn_q1', text: 'When learning something new, I prefer: 1=Reading text, 2=Listening to explanations, 3=Watching demonstrations, 4=Hands-on practice, 5=Mix of all' }
    ],
    scale: { min: 1, max: 5, labels: ['Read/Write', 'Auditory', 'Visual', 'Kinesthetic', 'Multimodal'] },
    calculateScore: (answers) => Math.round(((answers['learn_q1'] || 3) - 1) / 4 * 100),
    interpretation: (score) => {
      if (score >= 80) return 'Multimodal learner - adapts to different learning formats';
      if (score >= 60) return 'Kinesthetic learner - learns best by doing hands-on activities';
      if (score >= 40) return 'Visual learner - learns best through diagrams and demonstrations';
      if (score >= 20) return 'Auditory learner - learns best through listening and discussion';
      return 'Read/Write learner - learns best through reading and note-taking';
    }
  },
  full: {
    domainId: 'learning_styles',
    name: 'VARK Learning Styles Assessment',
    shortName: 'VARK (Full)',
    description: 'Identifies your Visual, Auditory, Read/Write, and Kinesthetic learning preferences',
    source: 'VARK (Fleming & Mills, 1992)',
    questions: [
      // Visual
      { id: 'learn_1', text: 'I understand information better when I see diagrams or charts.', subscale: 'V' },
      { id: 'learn_2', text: 'I prefer using maps over written directions.', subscale: 'V' },
      { id: 'learn_3', text: 'I like to highlight or color-code my notes.', subscale: 'V' },
      // Auditory
      { id: 'learn_4', text: 'I prefer listening to lectures over reading textbooks.', subscale: 'A' },
      { id: 'learn_5', text: 'I learn well from discussions and verbal explanations.', subscale: 'A' },
      { id: 'learn_6', text: 'I often talk through problems out loud.', subscale: 'A' },
      // Reading/Writing
      { id: 'learn_7', text: 'I prefer written instructions over diagrams.', subscale: 'R' },
      { id: 'learn_8', text: 'I take detailed notes when learning something new.', subscale: 'R' },
      { id: 'learn_9', text: 'I learn best by reading textbooks and articles.', subscale: 'R' },
      // Kinesthetic
      { id: 'learn_10', text: 'I learn best by doing hands-on activities.', subscale: 'K' },
      { id: 'learn_11', text: 'I prefer to try things out rather than read about them.', subscale: 'K' },
      { id: 'learn_12', text: 'I remember things better if I\'ve practiced them.', subscale: 'K' }
    ],
    scale: DARK_SCALE,
    calculateScore: (answers) => {
      // Return the highest subscale score as the "dominant" score for storage
      const scores = calculateVARKSubscales(answers);
      return Math.max(scores.V, scores.A, scores.R, scores.K);
    },
    interpretation: interpretVARK
  }
};

export const informationProcessing: { quick: Assessment; full: Assessment } = {
  quick: {
    domainId: 'information_processing',
    name: 'Information Processing Quick Assessment',
    shortName: 'Processing (Quick)',
    description: 'Single-item processing style measure',
    source: 'Based on cognitive processing research',
    questions: [
      { id: 'proc_q1', text: 'I prefer to analyze details before understanding the big picture (vs. starting with the big picture).' }
    ],
    scale: DARK_SCALE,
    calculateScore: (answers) => Math.round(((answers['proc_q1'] || 3) - 1) / 4 * 100),
    interpretation: (score) => score >= 70 ? 'Analytical/sequential processor' :
                              score >= 40 ? 'Balanced processing style' :
                              'Global/holistic processor'
  },
  full: {
    domainId: 'information_processing',
    name: 'Information Processing Style Assessment',
    shortName: 'Processing (Full)',
    description: 'Based on cognitive processing research',
    source: 'Based on dual-process theories',
    questions: [
      // Analytical
      { id: 'proc_1', text: 'I prefer to analyze details carefully before making decisions.', subscale: 'analytical' },
      { id: 'proc_2', text: 'I like to break problems down into smaller parts.', subscale: 'analytical' },
      { id: 'proc_3', text: 'I tend to think step-by-step.', subscale: 'analytical' },
      // Holistic
      { id: 'proc_4', text: 'I like to see the big picture before the details.', subscale: 'holistic' },
      { id: 'proc_5', text: 'I often rely on intuition when processing information.', subscale: 'holistic' },
      { id: 'proc_6', text: 'I tend to think about things as interconnected wholes.', subscale: 'holistic' },
      // General processing
      { id: 'proc_7', text: 'I can process multiple sources of information at once.' },
      { id: 'proc_8', text: 'I prefer clear, organized information.' },
      { id: 'proc_9', text: 'I can quickly filter relevant from irrelevant information.' },
      { id: 'proc_10', text: 'I adapt my thinking style based on the task.' }
    ],
    scale: DARK_SCALE,
    calculateScore: (answers) => calculateMean(answers, informationProcessing.full.questions, 5),
    interpretation: (score, answers) => {
      if (!answers) return score >= 70 ? 'Highly flexible information processor' :
                           score >= 40 ? 'Moderate processing flexibility' :
                           'May benefit from varying processing approaches';
      const subscales = calculateSubscales(answers, informationProcessing.full.questions, 5);
      const labels: Record<string, string> = {
        'analytical': 'Analytical/Sequential',
        'holistic': 'Holistic/Global'
      };
      const scoreStr = formatSubscaleScores(subscales, labels);
      const analytical = subscales['analytical'] || 50;
      const holistic = subscales['holistic'] || 50;

      let style: string;
      let desc: string;
      if (analytical > holistic + 15) {
        style = 'Analytical/Sequential';
        desc = 'prefer breaking problems into parts, step-by-step thinking';
      } else if (holistic > analytical + 15) {
        style = 'Holistic/Global';
        desc = 'prefer seeing the big picture first, intuitive connections';
      } else {
        style = 'Balanced';
        desc = 'flexibly use both analytical and holistic approaches';
      }

      return `Processing Style: ${style}. ${scoreStr}. You ${desc}. Analytical thinkers excel with structured materials; holistic thinkers benefit from conceptual overviews.`;
    }
  }
};

export const metacognition: { quick: Assessment; full: Assessment } = {
  quick: {
    domainId: 'metacognition',
    name: 'Metacognition Quick Assessment',
    shortName: 'Metacognition (Quick)',
    description: 'Single-item metacognitive awareness',
    source: 'Adapted from MAI',
    questions: [
      { id: 'meta_q1', text: 'I am aware of my own thinking processes and can monitor how well I understand something.' }
    ],
    scale: DARK_SCALE,
    calculateScore: (answers) => Math.round(((answers['meta_q1'] || 3) - 1) / 4 * 100),
    interpretation: (score) => score >= 70 ? 'High metacognitive awareness' :
                              score >= 40 ? 'Moderate metacognition' :
                              'May benefit from developing metacognitive skills'
  },
  full: {
    domainId: 'metacognition',
    name: 'Metacognitive Awareness Inventory',
    shortName: 'Metacognition (Full)',
    description: 'Based on MAI',
    source: 'MAI (Schraw & Dennison, 1994)',
    questions: [
      // Knowledge of Cognition
      { id: 'meta_1', text: 'I know what kind of information is most important to learn.', subscale: 'knowledge' },
      { id: 'meta_2', text: 'I am good at organizing information.', subscale: 'knowledge' },
      { id: 'meta_3', text: 'I know what the teacher expects me to learn.', subscale: 'knowledge' },
      { id: 'meta_4', text: 'I am good at remembering information.', subscale: 'knowledge' },
      // Regulation of Cognition
      { id: 'meta_5', text: 'I ask myself periodically if I am meeting my goals.', subscale: 'regulation' },
      { id: 'meta_6', text: 'I think about what I really need to learn before I begin a task.', subscale: 'regulation' },
      { id: 'meta_7', text: 'I set specific goals before I begin a task.', subscale: 'regulation' },
      { id: 'meta_8', text: 'I ask myself if I have considered all options after I solve a problem.', subscale: 'regulation' },
      { id: 'meta_9', text: 'I summarize what I\'ve learned after I finish.', subscale: 'regulation' },
      { id: 'meta_10', text: 'I ask myself if there was an easier way to do things after I finish a task.', subscale: 'regulation' }
    ],
    scale: DARK_SCALE,
    calculateScore: (answers) => calculateMean(answers, metacognition.full.questions, 5),
    interpretation: (score, answers) => {
      if (!answers) return score >= 70 ? 'High metacognitive awareness - strong self-regulation' :
                           score >= 40 ? 'Moderate metacognition - some awareness of thinking' :
                           'May benefit from metacognitive strategy training';
      const subscales = calculateSubscales(answers, metacognition.full.questions, 5);
      const labels: Record<string, string> = {
        'knowledge': 'Knowledge of Cognition',
        'regulation': 'Regulation of Cognition'
      };
      const scoreStr = formatSubscaleScores(subscales, labels);
      const knowledge = subscales['knowledge'] || 50;
      const regulation = subscales['regulation'] || 50;

      let strength: string;
      let desc: string;
      if (knowledge > regulation + 15) {
        strength = 'Knowledge of Cognition';
        desc = 'You understand your thinking processes well. Focus on applying this knowledge through better self-monitoring and strategy adjustment.';
      } else if (regulation > knowledge + 15) {
        strength = 'Regulation of Cognition';
        desc = 'You effectively monitor and adjust your learning. Build more awareness of your cognitive strengths and strategies.';
      } else {
        strength = 'Balanced Metacognition';
        desc = 'You have good awareness of both knowing about and controlling your thinking processes.';
      }

      const level = score >= 70 ? 'High' : score >= 40 ? 'Moderate' : 'Developing';
      return `${level} Metacognition: ${strength}. ${scoreStr}. ${desc}`;
    }
  }
};

export const executiveFunctions: { quick: Assessment; full: Assessment } = {
  quick: {
    domainId: 'executive_functions',
    name: 'Executive Function Quick Assessment',
    shortName: 'Executive (Quick)',
    description: 'Single-item executive function measure',
    source: 'Adapted from BRIEF',
    questions: [
      { id: 'exec_q1', text: 'I can easily plan, organize, and carry out complex tasks.' }
    ],
    scale: DARK_SCALE,
    calculateScore: (answers) => Math.round(((answers['exec_q1'] || 3) - 1) / 4 * 100),
    interpretation: (score) => score >= 70 ? 'Strong executive function' :
                              score >= 40 ? 'Adequate executive function' :
                              'May benefit from executive function support'
  },
  full: {
    domainId: 'executive_functions',
    name: 'Executive Function Self-Assessment',
    shortName: 'Executive (Full)',
    description: 'Based on BRIEF-A domains',
    source: 'Adapted from BRIEF-A (Roth et al., 2005)',
    questions: [
      // Inhibition
      { id: 'exec_1', text: 'I can stop myself from doing something when I need to.', subscale: 'inhibit' },
      { id: 'exec_2', text: 'I think before I act.', subscale: 'inhibit' },
      // Shift
      { id: 'exec_3', text: 'I adapt easily when plans change.', subscale: 'shift' },
      { id: 'exec_4', text: 'I can shift from one activity to another without difficulty.', subscale: 'shift' },
      // Emotional Control
      { id: 'exec_5', text: 'I stay calm in stressful situations.', subscale: 'emotional' },
      { id: 'exec_6', text: 'I control my emotions well.', subscale: 'emotional' },
      // Working Memory
      { id: 'exec_7', text: 'I can hold multiple pieces of information in mind.', subscale: 'working_memory' },
      { id: 'exec_8', text: 'I remember instructions well.', subscale: 'working_memory' },
      // Planning/Organization
      { id: 'exec_9', text: 'I plan ahead for tasks and activities.', subscale: 'plan' },
      { id: 'exec_10', text: 'I organize my work well.', subscale: 'plan' },
      // Task Monitoring
      { id: 'exec_11', text: 'I check my work for mistakes.', subscale: 'monitor' },
      { id: 'exec_12', text: 'I keep track of my progress on tasks.', subscale: 'monitor' }
    ],
    scale: DARK_SCALE,
    calculateScore: (answers) => calculateMean(answers, executiveFunctions.full.questions, 5),
    interpretation: (score, answers) => {
      if (!answers) return score >= 70 ? 'Strong executive functions - effective self-regulation' :
                           score >= 40 ? 'Adequate executive function' :
                           'May benefit from executive function strategies';
      const subscales = calculateSubscales(answers, executiveFunctions.full.questions, 5);
      const labels: Record<string, string> = {
        'inhibit': 'Inhibition',
        'shift': 'Cognitive Flexibility',
        'emotional': 'Emotional Control',
        'working_memory': 'Working Memory',
        'plan': 'Planning/Organization',
        'monitor': 'Task Monitoring'
      };
      const scoreStr = formatSubscaleScores(subscales, labels);
      const dominant = findDominant(subscales);
      const sorted = Object.entries(subscales)
        .sort(([, a], [, b]) => b - a);

      // Find strengths (top 2) and areas to develop (bottom 2)
      const strengths = sorted.slice(0, 2).map(([key]) => labels[key] || key);
      const weakest = sorted.slice(-2).map(([key]) => labels[key] || key);

      const level = score >= 70 ? 'Strong' : score >= 40 ? 'Adequate' : 'Developing';
      return `${level} Executive Functions. ${scoreStr}. Strengths: ${strengths.join(', ')}. Growth areas: ${weakest.join(', ')}.`;
    }
  }
};

// ============================================================================
// G. SOCIAL/CULTURAL/VALUES
// ============================================================================

export const socialCognition: { quick: Assessment; full: Assessment } = {
  quick: {
    domainId: 'social_cognition',
    name: 'Social Cognition Quick Assessment',
    shortName: 'Social Cognition (Quick)',
    description: 'Single-item social cognition measure',
    source: 'Adapted from RMET concept',
    questions: [
      { id: 'soc_q1', text: 'I can easily tell what someone is feeling just by looking at their face.' }
    ],
    scale: DARK_SCALE,
    calculateScore: (answers) => Math.round(((answers['soc_q1'] || 3) - 1) / 4 * 100),
    interpretation: (score) => score >= 70 ? 'Strong social cognition - reads others well' :
                              score >= 40 ? 'Moderate social cognition' :
                              'May miss some social cues'
  },
  full: {
    domainId: 'social_cognition',
    name: 'Social Cognition Assessment',
    shortName: 'Social Cognition (Full)',
    description: 'Self-reported social cognitive abilities',
    source: 'Based on social cognition research',
    questions: [
      { id: 'soc_1', text: 'I can easily tell what someone is feeling just by looking at their face.' },
      { id: 'soc_2', text: 'I pick up on subtle social cues.' },
      { id: 'soc_3', text: 'I can tell when someone is being sarcastic.' },
      { id: 'soc_4', text: 'I understand why people behave the way they do.' },
      { id: 'soc_5', text: 'I can predict how others will react in social situations.' },
      { id: 'soc_6', text: 'I am good at reading between the lines in conversations.' },
      { id: 'soc_7', text: 'I notice when someone is uncomfortable.' },
      { id: 'soc_8', text: 'I understand social norms and unwritten rules.' },
      { id: 'soc_9', text: 'I can tell when someone doesn\'t want to be disturbed.' },
      { id: 'soc_10', text: 'I am good at understanding others\' perspectives.' }
    ],
    scale: DARK_SCALE,
    calculateScore: (answers) => calculateMean(answers, socialCognition.full.questions, 5),
    interpretation: (score) => score >= 70 ? 'High social cognition - attuned to social dynamics' :
                              score >= 40 ? 'Moderate social cognition' :
                              'May benefit from social skills development'
  }
};

export const politicalIdeology: { quick: Assessment; full: Assessment } = {
  quick: {
    domainId: 'political_ideology',
    name: 'Political Orientation Quick Assessment',
    shortName: 'Political (Quick)',
    description: 'Single-item political orientation',
    source: 'Standard single-item measure',
    questions: [
      { id: 'pol_q1', text: 'Where would you place yourself on a political spectrum?' }
    ],
    scale: { min: 1, max: 7, labels: ['Very Liberal', 'Liberal', 'Slightly Liberal', 'Moderate', 'Slightly Conservative', 'Conservative', 'Very Conservative'] },
    calculateScore: (answers) => Math.round(((answers['pol_q1'] || 4) - 1) / 6 * 100),
    interpretation: (score) => score >= 70 ? 'Conservative orientation' :
                              score >= 40 ? 'Moderate/centrist orientation' :
                              'Liberal orientation'
  },
  full: {
    domainId: 'political_ideology',
    name: 'Moral Foundations Assessment',
    shortName: 'Political (Full)',
    description: 'Based on Moral Foundations Theory',
    source: 'MFQ (Graham et al., 2011)',
    questions: [
      // Care/Harm
      { id: 'pol_1', text: 'Compassion for those who are suffering is the most crucial virtue.', subscale: 'care' },
      { id: 'pol_2', text: 'One of the worst things a person could do is hurt a defenseless animal.', subscale: 'care' },
      // Fairness/Cheating
      { id: 'pol_3', text: 'Justice is the most important requirement for a society.', subscale: 'fairness' },
      { id: 'pol_4', text: 'When the government makes laws, the number one principle should be ensuring that everyone is treated fairly.', subscale: 'fairness' },
      // Loyalty/Betrayal
      { id: 'pol_5', text: 'I am proud of my country\'s history.', subscale: 'loyalty' },
      { id: 'pol_6', text: 'People should be loyal to their family members, even when they have done something wrong.', subscale: 'loyalty' },
      // Authority/Subversion
      { id: 'pol_7', text: 'Respect for authority is something all children need to learn.', subscale: 'authority' },
      { id: 'pol_8', text: 'If I were a soldier and disagreed with my commanding officer\'s orders, I would obey anyway.', subscale: 'authority' },
      // Purity/Sanctity
      { id: 'pol_9', text: 'People should not do things that are disgusting, even if no one is harmed.', subscale: 'purity' },
      { id: 'pol_10', text: 'I would call some acts wrong on the grounds that they are unnatural.', subscale: 'purity' }
    ],
    scale: { min: 0, max: 5, labels: ['Not at all relevant', 'Not very relevant', 'Slightly relevant', 'Somewhat relevant', 'Very relevant', 'Extremely relevant'] },
    calculateScore: (answers) => calculateMean(answers, politicalIdeology.full.questions, 5),
    interpretation: (score, answers) => {
      if (!answers) return score >= 70 ? 'Broad moral foundation reliance' :
                           score >= 40 ? 'Moderate moral foundation engagement' :
                           'Narrower moral foundation focus';
      const subscales = calculateSubscales(answers, politicalIdeology.full.questions, 5);
      const labels: Record<string, string> = {
        'care': 'Care/Harm',
        'fairness': 'Fairness/Cheating',
        'loyalty': 'Loyalty/Betrayal',
        'authority': 'Authority/Subversion',
        'purity': 'Sanctity/Purity'
      };
      const descriptions: Record<string, string> = {
        'care': 'protecting others from harm',
        'fairness': 'justice and equal treatment',
        'loyalty': 'group solidarity and patriotism',
        'authority': 'respect for tradition and hierarchy',
        'purity': 'sanctity and avoiding degradation'
      };
      const scoreStr = formatSubscaleScores(subscales, labels);
      const sorted = Object.entries(subscales)
        .sort(([, a], [, b]) => b - a);
      const dominant = sorted.slice(0, 2).map(([key]) => key);
      const dominantNames = dominant.map(d => labels[d]).join(' & ');
      const dominantDescs = dominant.map(d => descriptions[d]).join('; ');

      // Individualizing (care, fairness) vs Binding (loyalty, authority, purity) foundations
      const individualizing = ((subscales['care'] || 50) + (subscales['fairness'] || 50)) / 2;
      const binding = ((subscales['loyalty'] || 50) + (subscales['authority'] || 50) + (subscales['purity'] || 50)) / 3;

      let orientation: string;
      if (individualizing > binding + 10) {
        orientation = 'You prioritize individualizing foundations (care, fairness) - typical of liberal moral reasoning.';
      } else if (binding > individualizing + 10) {
        orientation = 'You emphasize binding foundations (loyalty, authority, purity) - typical of conservative moral reasoning.';
      } else {
        orientation = 'You draw from all five moral foundations relatively evenly.';
      }

      return `Moral Foundations Profile: ${scoreStr}. Primary: ${dominantNames} (${dominantDescs}). ${orientation}`;
    }
  }
};

export const culturalValues: { quick: Assessment; full: Assessment } = {
  quick: {
    domainId: 'cultural_values',
    name: 'Cultural Values Quick Assessment',
    shortName: 'Cultural (Quick)',
    description: 'Single-item individualism-collectivism',
    source: 'Based on Hofstede\'s dimensions',
    questions: [
      { id: 'cult_q1', text: 'I prefer to work as part of a group rather than independently.' }
    ],
    scale: DARK_SCALE,
    calculateScore: (answers) => Math.round(((answers['cult_q1'] || 3) - 1) / 4 * 100),
    interpretation: (score) => score >= 70 ? 'Collectivist orientation' :
                              score >= 40 ? 'Balanced individualism-collectivism' :
                              'Individualist orientation'
  },
  full: {
    domainId: 'cultural_values',
    name: 'Cultural Values Survey',
    shortName: 'Cultural (Full)',
    description: 'Based on Hofstede\'s cultural dimensions',
    source: 'Based on VSM (Hofstede, 1984)',
    questions: [
      // Individualism vs Collectivism
      { id: 'cult_1', text: 'I prefer to work as part of a group.', subscale: 'collectivism' },
      { id: 'cult_2', text: 'Group success is more important than individual success.', subscale: 'collectivism' },
      { id: 'cult_3', text: 'I value my independence highly.', subscale: 'individualism' },
      // Power Distance
      { id: 'cult_4', text: 'I respect hierarchy and authority.', subscale: 'power_distance' },
      { id: 'cult_5', text: 'Decisions should be made by those in charge.', subscale: 'power_distance' },
      // Uncertainty Avoidance
      { id: 'cult_6', text: 'I prefer clear rules and structured environments.', subscale: 'uncertainty' },
      { id: 'cult_7', text: 'I feel uncomfortable in ambiguous situations.', subscale: 'uncertainty' },
      // Long-term Orientation
      { id: 'cult_8', text: 'I am willing to delay rewards for long-term benefits.', subscale: 'long_term' },
      { id: 'cult_9', text: 'I value tradition and maintaining the status quo.', subscale: 'tradition' },
      { id: 'cult_10', text: 'I believe in adapting traditions to modern circumstances.', subscale: 'long_term' }
    ],
    scale: DARK_SCALE,
    calculateScore: (answers) => calculateMean(answers, culturalValues.full.questions, 5),
    interpretation: (score, answers) => {
      if (!answers) return score >= 70 ? 'Strong cultural value engagement' :
                           score >= 40 ? 'Moderate cultural value orientation' :
                           'Flexible cultural orientation';
      const subscales = calculateSubscales(answers, culturalValues.full.questions, 5);
      const labels: Record<string, string> = {
        'collectivism': 'Collectivism',
        'individualism': 'Individualism',
        'power_distance': 'Power Distance',
        'uncertainty': 'Uncertainty Avoidance',
        'long_term': 'Long-term Orientation',
        'tradition': 'Tradition'
      };
      const scoreStr = formatSubscaleScores(subscales, labels);
      const sorted = Object.entries(subscales)
        .sort(([, a], [, b]) => b - a);
      const dominant = sorted.slice(0, 2).map(([key]) => labels[key] || key);

      // Key cultural dimension interpretations
      const coll = subscales['collectivism'] || 50;
      const indiv = subscales['individualism'] || 50;
      const pd = subscales['power_distance'] || 50;
      const ua = subscales['uncertainty'] || 50;

      let orientation: string;
      if (coll > indiv + 15) {
        orientation = 'You lean collectivist - valuing group harmony, family, and social obligation.';
      } else if (indiv > coll + 15) {
        orientation = 'You lean individualist - valuing personal autonomy and self-reliance.';
      } else {
        orientation = 'You balance individual and collective values.';
      }

      let structure = '';
      if (pd > 65) structure = ' You accept hierarchical structures.';
      else if (pd < 35) structure = ' You prefer egalitarian relationships.';

      if (ua > 65) structure += ' You prefer structure and predictability.';
      else if (ua < 35) structure += ' You are comfortable with ambiguity.';

      return `Cultural Values: ${scoreStr}. Dominant: ${dominant.join(', ')}. ${orientation}${structure}`;
    }
  }
};

export const moralReasoning: { quick: Assessment; full: Assessment } = {
  quick: {
    domainId: 'moral_reasoning',
    name: 'Moral Reasoning Quick Assessment',
    shortName: 'Moral (Quick)',
    description: 'Single-item moral reasoning orientation',
    source: 'Based on Kohlberg stages',
    questions: [
      { id: 'mor_q1', text: 'When making moral decisions, I consider universal ethical principles over personal benefit or social conventions.' }
    ],
    scale: DARK_SCALE,
    calculateScore: (answers) => Math.round(((answers['mor_q1'] || 3) - 1) / 4 * 100),
    interpretation: (score) => score >= 70 ? 'Principled moral reasoning' :
                              score >= 40 ? 'Conventional moral reasoning' :
                              'Pre-conventional or pragmatic reasoning'
  },
  full: {
    domainId: 'moral_reasoning',
    name: 'Moral Reasoning Assessment',
    shortName: 'Moral (Full)',
    description: 'Based on moral development theory',
    source: 'Adapted from DIT-2 concepts (Rest et al., 1999)',
    questions: [
      { id: 'mor_1', text: 'I believe in following rules because they maintain social order.' },
      { id: 'mor_2', text: 'What\'s right is what benefits the most people.' },
      { id: 'mor_3', text: 'I would break a rule if I believed it was unjust.' },
      { id: 'mor_4', text: 'Laws should be followed because they represent agreed-upon standards.' },
      { id: 'mor_5', text: 'I consider the perspectives of all affected parties when making moral decisions.' },
      { id: 'mor_6', text: 'Some ethical principles are more important than specific laws.' },
      { id: 'mor_7', text: 'I try to be fair and impartial in my moral judgments.' },
      { id: 'mor_8', text: 'I believe in treating all people with dignity.' },
      { id: 'mor_9', text: 'I consider consequences when making ethical decisions.' },
      { id: 'mor_10', text: 'I try to understand different perspectives before judging.' }
    ],
    scale: DARK_SCALE,
    calculateScore: (answers) => calculateMean(answers, moralReasoning.full.questions, 5),
    interpretation: (score) => score >= 70 ? 'Sophisticated moral reasoning' :
                              score >= 40 ? 'Moderate moral reasoning complexity' :
                              'Developing moral reasoning skills'
  }
};

export const workCareerStyle: { quick: Assessment; full: Assessment } = {
  quick: {
    domainId: 'work_career_style',
    name: 'Career Style Quick Assessment',
    shortName: 'Career (Quick)',
    description: 'Single-item career anchor identification',
    source: 'Adapted from Career Anchors (Schein, 1978)',
    questions: [
      { id: 'work_q1', text: 'What matters most in your career? (1=Security, 2=Independence, 3=Technical expertise, 4=Management, 5=Challenge)' }
    ],
    scale: { min: 1, max: 5, labels: ['Security/Stability', 'Autonomy/Independence', 'Technical/Functional', 'General Management', 'Pure Challenge'] },
    calculateScore: (answers) => Math.round(((answers['work_q1'] || 3) - 1) / 4 * 100),
    interpretation: (score) => {
      const anchor = Math.round(score / 25) + 1;
      const anchors = ['Security/Stability focused', 'Autonomy/Independence focused', 'Technical/Functional focused', 'Management focused', 'Challenge-seeking'];
      return anchors[Math.min(anchor - 1, 4)];
    }
  },
  full: {
    domainId: 'work_career_style',
    name: 'Career Anchors Assessment',
    shortName: 'Career (Full)',
    description: 'Based on Schein\'s Career Anchors',
    source: 'Career Anchors (Schein, 1978)',
    questions: [
      { id: 'work_1', text: 'Job security is very important to me.', subscale: 'security' },
      { id: 'work_2', text: 'I want to be autonomous in my work.', subscale: 'autonomy' },
      { id: 'work_3', text: 'I want to be known as an expert in my field.', subscale: 'technical' },
      { id: 'work_4', text: 'I aspire to reach a senior management position.', subscale: 'management' },
      { id: 'work_5', text: 'I enjoy entrepreneurial activities and creating new things.', subscale: 'entrepreneurial' },
      { id: 'work_6', text: 'I want to help others through my work.', subscale: 'service' },
      { id: 'work_7', text: 'I thrive on solving complex, challenging problems.', subscale: 'challenge' },
      { id: 'work_8', text: 'Work-life balance is crucial to me.', subscale: 'lifestyle' },
      { id: 'work_9', text: 'I prefer predictable, stable work environments.', subscale: 'security' },
      { id: 'work_10', text: 'I want to make a difference in the world.', subscale: 'service' }
    ],
    scale: DARK_SCALE,
    calculateScore: (answers) => calculateMean(answers, workCareerStyle.full.questions, 5),
    interpretation: (score, answers) => {
      if (!answers) return score >= 70 ? 'Strong career anchor awareness' :
                           score >= 40 ? 'Moderate career focus' :
                           'May be exploring career direction';
      const subscales = calculateSubscales(answers, workCareerStyle.full.questions, 5);
      const labels: Record<string, string> = {
        'security': 'Security/Stability',
        'autonomy': 'Autonomy/Independence',
        'technical': 'Technical/Functional',
        'management': 'General Management',
        'entrepreneurial': 'Entrepreneurial',
        'service': 'Service/Dedication',
        'challenge': 'Pure Challenge',
        'lifestyle': 'Lifestyle'
      };
      const descriptions: Record<string, string> = {
        'security': 'You prioritize job stability and predictable career paths',
        'autonomy': 'You value freedom to do work your own way',
        'technical': 'You want to be an expert in your specialty',
        'management': 'You aspire to lead and coordinate others',
        'entrepreneurial': 'You want to create and build new ventures',
        'service': 'You seek meaning through helping others',
        'challenge': 'You thrive on solving difficult problems',
        'lifestyle': 'Work-life balance is your priority'
      };
      const scoreStr = formatSubscaleScores(subscales, labels);
      const sorted = Object.entries(subscales)
        .sort(([, a], [, b]) => b - a);
      const primary = sorted[0];
      const secondary = sorted[1];
      const primaryKey = primary[0];
      const secondaryKey = secondary[0];

      return `Career Anchors: ${scoreStr}. Primary: ${labels[primaryKey]} - ${descriptions[primaryKey]}. Secondary: ${labels[secondaryKey]}.`;
    }
  }
};

// ============================================================================
// H. SENSORY/AESTHETIC
// ============================================================================

export const sensoryProcessing: { quick: Assessment; full: Assessment } = {
  quick: {
    domainId: 'sensory_processing',
    name: 'Sensory Processing Quick Assessment',
    shortName: 'Sensory (Quick)',
    description: 'Single-item sensory sensitivity measure',
    source: 'Adapted from HSP Scale',
    questions: [
      { id: 'sens_q1', text: 'I am easily overwhelmed by strong sensory input (bright lights, loud sounds, strong smells).' }
    ],
    scale: DARK_SCALE,
    calculateScore: (answers) => Math.round(((answers['sens_q1'] || 3) - 1) / 4 * 100),
    interpretation: (score) => score >= 70 ? 'Highly sensitive to sensory input' :
                              score >= 40 ? 'Moderate sensory sensitivity' :
                              'Lower sensory sensitivity'
  },
  full: {
    domainId: 'sensory_processing',
    name: 'Highly Sensitive Person Scale',
    shortName: 'Sensory (Full)',
    description: 'Based on HSP Scale',
    source: 'HSP Scale (Aron & Aron, 1997)',
    questions: [
      { id: 'sens_1', text: 'I am easily overwhelmed by strong sensory input.' },
      { id: 'sens_2', text: 'I seem to be aware of subtleties in my environment.' },
      { id: 'sens_3', text: 'Other people\'s moods affect me.' },
      { id: 'sens_4', text: 'I tend to be very sensitive to pain.' },
      { id: 'sens_5', text: 'I find myself needing to withdraw during busy days.' },
      { id: 'sens_6', text: 'I am particularly sensitive to the effects of caffeine.' },
      { id: 'sens_7', text: 'I am easily overwhelmed by things like bright lights, strong smells, or sirens.' },
      { id: 'sens_8', text: 'I have a rich, complex inner life.' },
      { id: 'sens_9', text: 'I am made uncomfortable by loud noises.' },
      { id: 'sens_10', text: 'I am deeply moved by the arts or music.' },
      { id: 'sens_11', text: 'My nervous system sometimes feels so frazzled that I have to go off by myself.' },
      { id: 'sens_12', text: 'I am conscientious.' }
    ],
    scale: TIPI_SCALE,
    calculateScore: (answers) => calculateMean(answers, sensoryProcessing.full.questions, 7),
    interpretation: (score) => score >= 70 ? 'Highly sensitive person - deep processing of stimuli' :
                              score >= 40 ? 'Moderate sensitivity' :
                              'Lower sensory sensitivity - tolerates more stimulation'
  }
};

export const aestheticPreferences: { quick: Assessment; full: Assessment } = {
  quick: {
    domainId: 'aesthetic_preferences',
    name: 'Aesthetic Preferences Quick Assessment',
    shortName: 'Aesthetic (Quick)',
    description: 'Single-item aesthetic sensitivity',
    source: 'Adapted from AESTHEMOS',
    questions: [
      { id: 'aes_q1', text: 'I am deeply moved by beauty in art, nature, or music.' }
    ],
    scale: DARK_SCALE,
    calculateScore: (answers) => Math.round(((answers['aes_q1'] || 3) - 1) / 4 * 100),
    interpretation: (score) => score >= 70 ? 'High aesthetic sensitivity' :
                              score >= 40 ? 'Moderate aesthetic appreciation' :
                              'Lower aesthetic focus'
  },
  full: {
    domainId: 'aesthetic_preferences',
    name: 'Aesthetic Experiences Assessment',
    shortName: 'Aesthetic (Full)',
    description: 'Based on AESTHEMOS scale',
    source: 'AESTHEMOS (Schindler et al., 2017)',
    questions: [
      { id: 'aes_1', text: 'I am deeply moved by beauty in art, nature, or music.' },
      { id: 'aes_2', text: 'I experience strong emotional reactions to beautiful things.' },
      { id: 'aes_3', text: 'I notice and appreciate beautiful details that others miss.' },
      { id: 'aes_4', text: 'I seek out aesthetic experiences (museums, concerts, nature).' },
      { id: 'aes_5', text: 'I have strong preferences about visual design and aesthetics.' },
      { id: 'aes_6', text: 'I feel uplifted when I experience something beautiful.' },
      { id: 'aes_7', text: 'I am sensitive to color, form, and composition.' },
      { id: 'aes_8', text: 'Beautiful music can bring me to tears.' },
      { id: 'aes_9', text: 'I enjoy discussing and analyzing art.' },
      { id: 'aes_10', text: 'Aesthetic experiences are an important part of my life.' }
    ],
    scale: DARK_SCALE,
    calculateScore: (answers) => calculateMean(answers, aestheticPreferences.full.questions, 5),
    interpretation: (score) => score >= 70 ? 'High aesthetic sensitivity and engagement' :
                              score >= 40 ? 'Moderate aesthetic appreciation' :
                              'Less focused on aesthetic experiences'
  }
};

// ============================================================================
// EXPORT ALL ASSESSMENTS
// ============================================================================

export const ALL_ASSESSMENTS: Record<string, { quick: Assessment; full: Assessment }> = {
  // A. Core Personality
  big_five_openness: bigFiveOpenness,
  big_five_conscientiousness: bigFiveConscientiousness,
  big_five_extraversion: bigFiveExtraversion,
  big_five_agreeableness: bigFiveAgreeableness,
  big_five_neuroticism: bigFiveNeuroticism,
  // B. Dark Personality
  dark_triad_narcissism: darkTriadNarcissism,
  dark_triad_machiavellianism: darkTriadMachiavellianism,
  dark_triad_psychopathy: darkTriadPsychopathy,
  // C. Emotional/Social
  emotional_empathy: emotionalEmpathy,
  emotional_intelligence: emotionalIntelligence,
  attachment_style: attachmentStyle,
  love_languages: loveLanguages,
  communication_style: communicationStyle,
  // D. Decision/Motivation
  risk_tolerance: riskTolerance,
  decision_style: decisionStyle,
  time_orientation: timeOrientation,
  achievement_motivation: achievementMotivation,
  self_efficacy: selfEfficacy,
  locus_of_control: locusOfControl,
  growth_mindset: growthMindset,
  // E. Values/Wellbeing
  personal_values: personalValues,
  interests: interests,
  life_satisfaction: lifeSatisfaction,
  stress_coping: stressCoping,
  social_support: socialSupport,
  authenticity: authenticity,
  // F. Cognitive/Learning
  cognitive_abilities: cognitiveAbilities,
  creativity: creativity,
  learning_styles: learningStyles,
  information_processing: informationProcessing,
  metacognition: metacognition,
  executive_functions: executiveFunctions,
  // G. Social/Cultural
  social_cognition: socialCognition,
  political_ideology: politicalIdeology,
  cultural_values: culturalValues,
  moral_reasoning: moralReasoning,
  work_career_style: workCareerStyle,
  // H. Sensory/Aesthetic
  sensory_processing: sensoryProcessing,
  aesthetic_preferences: aestheticPreferences,
};

// Helper to get all quick assessments
export function getQuickAssessments(): Assessment[] {
  return Object.values(ALL_ASSESSMENTS).map(a => a.quick);
}

// Helper to get all full assessments
export function getFullAssessments(): Assessment[] {
  return Object.values(ALL_ASSESSMENTS).map(a => a.full);
}

// Helper to get assessment by domain ID
export function getAssessment(domainId: string, type: 'quick' | 'full'): Assessment | undefined {
  return ALL_ASSESSMENTS[domainId]?.[type];
}

// Assessment categories for UI organization
export const ASSESSMENT_CATEGORIES = [
  {
    id: 'core_personality',
    name: 'A. Core Personality (Big Five)',
    domains: ['big_five_openness', 'big_five_conscientiousness', 'big_five_extraversion', 'big_five_agreeableness', 'big_five_neuroticism']
  },
  {
    id: 'dark_personality',
    name: 'B. Dark Personality',
    domains: ['dark_triad_narcissism', 'dark_triad_machiavellianism', 'dark_triad_psychopathy']
  },
  {
    id: 'emotional_social',
    name: 'C. Emotional/Social Intelligence',
    domains: ['emotional_empathy', 'emotional_intelligence', 'attachment_style', 'love_languages', 'communication_style']
  },
  {
    id: 'decision_motivation',
    name: 'D. Decision Making & Motivation',
    domains: ['risk_tolerance', 'decision_style', 'time_orientation', 'achievement_motivation', 'self_efficacy', 'locus_of_control', 'growth_mindset']
  },
  {
    id: 'values_wellbeing',
    name: 'E. Values & Wellbeing',
    domains: ['personal_values', 'interests', 'life_satisfaction', 'stress_coping', 'social_support', 'authenticity']
  },
  {
    id: 'cognitive_learning',
    name: 'F. Cognitive/Learning',
    domains: ['cognitive_abilities', 'creativity', 'learning_styles', 'information_processing', 'metacognition', 'executive_functions']
  },
  {
    id: 'social_cultural',
    name: 'G. Social/Cultural/Values',
    domains: ['social_cognition', 'political_ideology', 'cultural_values', 'moral_reasoning', 'work_career_style']
  },
  {
    id: 'sensory_aesthetic',
    name: 'H. Sensory/Aesthetic',
    domains: ['sensory_processing', 'aesthetic_preferences']
  }
];
