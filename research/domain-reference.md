# Psychological Domain Reference

This document contains the complete reference for all **39 psychological domains** analyzed by the psychometric analysis system. Each domain includes linguistic markers, data points, and the validated psychometric source.

---

## Overview

We analyze user conversations using a three-signal hybrid approach:
- **LIWC Analysis (20%)** - Fast word-matching based on linguistic markers
- **Embedding Similarity (30%)** - Semantic similarity to trait prototypes
- **LLM Deep Analysis (50%)** - Full semantic understanding via on-device AI

The 39 domains are organized into 8 categories:

| Category | Domains | Description |
|----------|---------|-------------|
| A. Core Personality | 1-5 | Big Five traits |
| B. Dark Personality | 6-8 | Dark Triad traits |
| C. Emotional/Social Intelligence | 9-13 | Empathy, EQ, attachment, love languages, communication |
| D. Decision Making & Motivation | 14-20 | Risk, decisions, time, achievement, efficacy, control, mindset |
| E. Values & Wellbeing | 21-26 | Values, interests, satisfaction, coping, support, authenticity |
| F. Cognitive/Learning | 27-32 | Abilities, creativity, learning, processing, metacognition, executive |
| G. Social/Cultural/Values | 33-37 | Social cognition, political, cultural, moral, career |
| H. Sensory/Aesthetic | 38-39 | Sensory processing, aesthetic preferences |

---

## Category A: Core Personality - Big Five (Domains 1-5)

### Domain 1: Openness to Experience
**ID:** `big_five_openness`
**Psychometric Source:** Big Five / NEO-PI-R (Costa & McCrae, 1992)

**Description:** Reflects intellectual curiosity, creativity, and preference for novelty and variety. High scorers are imaginative, artistic, and open to new experiences.

**Behavioral Markers:**
- Lexical diversity
- Insight words
- Abstract language
- Perceptual words
- Creative references

**Data Points:**
| Feature | High Score | Low Score |
|---------|-----------|-----------|
| Word variety (TTR) | Higher type-token ratio | Lower type-token ratio |
| Articles | More frequent | Less frequent |
| Insight words | More frequent | Less frequent |
| Tentative words | More frequent | Less frequent |
| Certainty words | Less frequent | More frequent |

---

### Domain 2: Conscientiousness
**ID:** `big_five_conscientiousness`
**Psychometric Source:** Big Five / NEO-PI-R (Costa & McCrae, 1992)

**Description:** Reflects self-discipline, organization, and goal-directed behavior. High scorers are reliable, hardworking, and achievement-oriented.

**Behavioral Markers:**
- Achievement words
- Work vocabulary
- Future tense
- Negations
- Organizational language

**Data Points:**
| Feature | High Score | Low Score |
|---------|-----------|-----------|
| Achievement words | More frequent | Less frequent |
| Work words | More frequent | Less frequent |
| Future focus | Higher | Lower |
| Negations | More frequent | Less frequent |
| Fillers (um, uh) | Less frequent | More frequent |

---

### Domain 3: Extraversion
**ID:** `big_five_extraversion`
**Psychometric Source:** Big Five / NEO-PI-R (Costa & McCrae, 1992)

**Description:** Reflects sociability, assertiveness, and positive emotionality. High scorers are outgoing, energetic, and seek stimulation from others.

**Behavioral Markers:**
- Social process words
- Positive emotions
- 1st-person plural
- Word count
- Exclamations

**Data Points:**
| Feature | High Score | Low Score |
|---------|-----------|-----------|
| Social words | More frequent | Less frequent |
| Positive emotion | More frequent | Less frequent |
| Word count | Higher | Lower |
| 1st person plural | More frequent | Less frequent |
| Questions asked | More frequent | Less frequent |

---

### Domain 4: Agreeableness
**ID:** `big_five_agreeableness`
**Psychometric Source:** Big Five / NEO-PI-R (Costa & McCrae, 1992)

**Description:** Reflects cooperativeness, trust, and concern for social harmony. High scorers are warm, friendly, and considerate of others.

**Behavioral Markers:**
- Affiliation words
- Positive emotions
- Assent words
- Family/friend refs
- Politeness

**Data Points:**
| Feature | High Score | Low Score |
|---------|-----------|-----------|
| Positive emotion | More frequent | Less frequent |
| Negative emotion | Less frequent | More frequent |
| Swear words | Less frequent | More frequent |
| Affiliation words | More frequent | Less frequent |
| Anger words | Less frequent | More frequent |

---

### Domain 5: Neuroticism
**ID:** `big_five_neuroticism`
**Psychometric Source:** Big Five / NEO-PI-R (Costa & McCrae, 1992)

**Description:** Reflects emotional instability and tendency to experience negative emotions. High scorers are more prone to anxiety, depression, and stress.

**Behavioral Markers:**
- Negative emotions
- 1st-person singular
- Certainty language
- Health references
- Death references

**Data Points:**
| Feature | High Score | Low Score |
|---------|-----------|-----------|
| Negative emotion | More frequent | Less frequent |
| Anxiety words | More frequent | Less frequent |
| 1st person singular | More frequent | Less frequent |
| Tentative words | More frequent | Less frequent |
| Health words | More frequent | Less frequent |

---

## Category B: Dark Personality (Domains 6-8)

### Domain 6: Narcissism
**ID:** `dark_triad_narcissism`
**Psychometric Source:** NPI (Narcissistic Personality Inventory)

**Description:** Reflects grandiosity, entitlement, and need for admiration. High scorers have inflated self-views and expect special treatment.

**Behavioral Markers:**
- Self-focus pronouns
- Superiority language
- Entitlement expressions
- Status/prestige words

**Data Points:**
| Feature | Indicator |
|---------|-----------|
| 1st person singular | More frequent (high), Less frequent (low) |
| Superiority words | Best, superior, exceptional, special |
| Entitlement | Deserve, entitled, should have |
| Status references | Success, achievement, recognition |

---

### Domain 7: Machiavellianism
**ID:** `dark_triad_machiavellianism`
**Psychometric Source:** MACH-IV Scale

**Description:** Reflects strategic manipulation and cynical worldview. High scorers prioritize self-interest and use calculated tactics.

**Behavioral Markers:**
- Strategic language
- Manipulation cues
- Cynicism markers
- Self-interest focus

**Data Points:**
| Feature | Indicator |
|---------|-----------|
| Strategic thinking | Plan, strategy, tactics, leverage |
| Manipulation | Persuade, influence, control, use |
| Cynicism | Distrust, ulterior motives, skeptical |
| Self-interest | Advantage, benefit me, my gain |

---

### Domain 8: Psychopathy
**ID:** `dark_triad_psychopathy`
**Psychometric Source:** Levenson Self-Report Psychopathy Scale

**Description:** Reflects callousness, impulsivity, and lack of remorse. High scorers show reduced empathy and emotional detachment.

**Behavioral Markers:**
- Emotional coldness
- Impulsivity markers
- Low empathy language
- Rule-breaking references

**Data Points:**
| Feature | Indicator |
|---------|-----------|
| Emotional detachment | Doesn't matter, who cares, indifferent |
| Impulsivity | Now, immediately, can't wait, spontaneous |
| Low empathy | Absence of concern for others' feelings |
| Rule violations | Rules are..., exceptions, don't apply |

---

## Category C: Emotional/Social Intelligence (Domains 9-13)

### Domain 9: Empathy
**ID:** `emotional_empathy`
**Psychometric Source:** Empathy Quotient (EQ) - Baron-Cohen

**Description:** Reflects ability to share and understand others' emotional states. High scorers easily connect with others' feelings.

**Behavioral Markers:**
- Perspective-taking
- Emotional mirroring
- Compassion language
- Social sensitivity

**Data Points:**
| Feature | Indicator |
|---------|-----------|
| Perspective words | Understand, feel for, imagine how |
| Compassion | Sorry for, sympathize, heart goes out |
| Emotional sharing | Feel the same, share your... |
| Other-focus | You must feel, they probably... |

---

### Domain 10: Emotional Intelligence
**ID:** `emotional_intelligence`
**Psychometric Source:** MSCEIT (Mayer-Salovey-Caruso)

**Description:** Reflects ability to perceive, understand, manage, and use emotions effectively. Includes self-awareness, empathy, and social skills.

**Behavioral Markers:**
- Emotion word diversity
- Emotion specificity
- Social awareness
- Empathy expressions
- Emotion regulation

**Data Points:**
| Feature | Indicator |
|---------|-----------|
| Self-awareness | Emotion vocabulary diversity, insight words |
| Self-regulation | Inhibition words, future-focused language |
| Motivation | Achievement words, drive words |
| Empathy | 2nd person pronouns, social process words |
| Social skills | Affiliation words, positive emotion, politeness |

---

### Domain 11: Attachment Style
**ID:** `attachment_style`
**Psychometric Source:** ECR-R (Experiences in Close Relationships)

**Description:** Reflects patterns of relating to others based on early bonding experiences. Influences trust, intimacy, and relationship behaviors.

**Behavioral Markers:**
- Relationship vocabulary
- Proximity-seeking
- Trust/intimacy words
- Social network refs

**Data Points:**
| Feature | Indicator |
|---------|-----------|
| Secure | Balanced self/other, positive social, trust |
| Anxious | High 1st person, relationship worry |
| Avoidant | Low intimacy words, distancing |
| Fearful | Inconsistent, approach-avoidance |

---

### Domain 12: Love Languages
**ID:** `love_languages`
**Psychometric Source:** 5 Love Languages (Chapman)

**Description:** Reflects preferred ways of expressing and receiving love. Based on five distinct love languages.

**Behavioral Markers:**
- Affirmation words
- Time references
- Service language
- Touch words
- Gift references

**Data Points:**
| Feature | Indicator |
|---------|-----------|
| Words of Affirmation | Compliments, appreciation, verbal support |
| Quality Time | Together, attention, focus, presence |
| Acts of Service | Help, do for, take care of |
| Physical Touch | Hug, hold, touch, physical closeness |
| Receiving Gifts | Gift, present, surprise, thoughtful |

---

### Domain 13: Communication Style
**ID:** `communication_style`
**Psychometric Source:** DISC Assessment

**Description:** Reflects patterns of verbal and written expression. Includes directness, formality, assertiveness, and expressiveness.

**Behavioral Markers:**
- Directness level
- Formality markers
- Assertiveness
- Listening cues

**Data Points:**
| Feature | Indicator |
|---------|-----------|
| Dominant (D) | Direct, results-oriented, decisive |
| Influential (I) | Enthusiastic, collaborative, optimistic |
| Steady (S) | Patient, reliable, team-oriented |
| Conscientious (C) | Analytical, precise, systematic |

---

## Category D: Decision Making & Motivation (Domains 14-20)

### Domain 14: Risk Tolerance
**ID:** `risk_tolerance`
**Psychometric Source:** DOSPERT (Domain-Specific Risk-Taking)

**Description:** Reflects willingness to accept uncertainty for potential gains. Varies across financial, physical, and social domains.

**Behavioral Markers:**
- Risk vocabulary
- Uncertainty language
- Caution vs boldness
- Probability references

**Data Points:**
| Feature | Indicator |
|---------|-----------|
| Risk-seeking | Chance, bet, gamble, opportunity |
| Risk-averse | Safe, certain, guaranteed, secure |
| Uncertainty tolerance | Maybe, could be, possible |
| Domain specificity | Financial vs physical vs social |

---

### Domain 15: Decision Style
**ID:** `decision_style`
**Psychometric Source:** General Decision Making Style (GDMS)

**Description:** Reflects how people approach choices and make decisions. Includes rational, intuitive, and social decision-making styles.

**Behavioral Markers:**
- Deliberation language
- Intuition references
- Risk vocabulary
- Temporal orientation

**Data Points:**
| Feature | Indicator |
|---------|-----------|
| Rational | Cause/effect, analytical, comparison |
| Intuitive | Feeling words, gut references |
| Dependent | Social reference, advice-seeking |
| Avoidant | Delay words, uncertainty, hedging |
| Spontaneous | Present focus, urgency |

---

### Domain 16: Time Orientation
**ID:** `time_orientation`
**Psychometric Source:** Zimbardo Time Perspective Inventory (ZTPI)

**Description:** Reflects how people mentally frame time and its influence on decisions. Includes past, present, and future orientations.

**Behavioral Markers:**
- Temporal references
- Verb tense usage
- Planning vs spontaneity

**Data Points:**
| Feature | Indicator |
|---------|-----------|
| Past-Negative | Regret, should have, if only |
| Past-Positive | Nostalgia, good times, memories |
| Present-Hedonistic | Now, enjoy, pleasure, YOLO |
| Present-Fatalistic | Fate, destiny, no control |
| Future | Will, plan, goal, going to |

---

### Domain 17: Achievement Motivation
**ID:** `achievement_motivation`
**Psychometric Source:** nAch (Need for Achievement) - McClelland

**Description:** Reflects drive to accomplish challenging goals and excel. High scorers are ambitious and goal-oriented.

**Behavioral Markers:**
- Achievement words
- Goal language
- Success references
- Competition markers

**Data Points:**
| Feature | Indicator |
|---------|-----------|
| Goal-setting | Goal, objective, target, aim |
| Success drive | Achieve, accomplish, succeed, win |
| Challenge-seeking | Challenge, difficult, ambitious |
| Excellence focus | Best, excellent, outstanding, superior |

---

### Domain 18: Self-Efficacy
**ID:** `self_efficacy`
**Psychometric Source:** General Self-Efficacy Scale (GSE)

**Description:** Reflects belief in one's ability to succeed in specific situations. High scorers are confident in their capabilities.

**Behavioral Markers:**
- Confidence language
- Capability words
- Can-do statements
- Control references

**Data Points:**
| Feature | Indicator |
|---------|-----------|
| Confidence | I can, I'm able, I'll manage |
| Capability | Capable, competent, skilled, able |
| Control | Handle, manage, overcome, deal with |
| Persistence | Keep trying, won't give up, persist |

---

### Domain 19: Locus of Control
**ID:** `locus_of_control`
**Psychometric Source:** Rotter Internal-External Scale

**Description:** Reflects beliefs about what controls outcomes in life. Internal = self, External = outside forces.

**Behavioral Markers:**
- Agency language
- Control attributions
- Fate/luck references
- Responsibility markers

**Data Points:**
| Feature | Indicator |
|---------|-----------|
| Internal | I control, my choice, I make it happen |
| External | Luck, fate, depends on others, chance |
| Agency | Decision, choose, determine, influence |
| Helplessness | Can't change, out of my hands, powerless |

---

### Domain 20: Growth Mindset
**ID:** `growth_mindset`
**Psychometric Source:** Implicit Theories of Intelligence Scale (Dweck)

**Description:** Reflects beliefs about whether abilities are fixed or can be developed through effort. Influences learning and achievement.

**Behavioral Markers:**
- Effort attribution
- Challenge response
- Failure interpretation
- Learning orientation

**Data Points:**
| Feature | Growth Mindset | Fixed Mindset |
|---------|---------------|---------------|
| General | Effort, practice, learn, improve, yet | Talent, natural, born with, can't |
| Failure talk | Learning opportunity | Defining, permanent |
| Challenge response | Embrace, try | Avoid, defensive |

---

## Category E: Values & Wellbeing (Domains 21-26)

### Domain 21: Personal Values
**ID:** `personal_values`
**Psychometric Source:** Schwartz PVQ (Portrait Values Questionnaire)

**Description:** Reflects core personal values and what drives behavior. Based on universal human values that guide decisions and priorities.

**Behavioral Markers:**
- Value-laden vocabulary
- Priority expressions
- Goal-oriented language
- Cultural references

**Data Points:**
| Feature | Indicator |
|---------|-----------|
| Self-Direction | Autonomy, creative vocabulary, independence |
| Achievement | Success words, competence, ambition |
| Benevolence | Helping words, care, loyalty |
| Universalism | Equality, justice, environment |
| Security | Safety words, stability, order |

---

### Domain 22: Interests (RIASEC)
**ID:** `interests`
**Psychometric Source:** Holland RIASEC / Strong Interest Inventory

**Description:** Reflects vocational interests and preferred activities. Based on six interest types that guide career choices.

**Behavioral Markers:**
- Activity preferences
- Career language
- Domain vocabulary
- Work environment refs

**Data Points:**
| Feature | Indicator |
|---------|-----------|
| Realistic | Build, fix, hands-on, practical, tools |
| Investigative | Research, analyze, study, discover |
| Artistic | Create, design, express, imagine |
| Social | Help, teach, counsel, support |
| Enterprising | Lead, persuade, sell, manage |
| Conventional | Organize, detail, accurate, systematic |

---

### Domain 23: Life Satisfaction
**ID:** `life_satisfaction`
**Psychometric Source:** SWLS (Satisfaction with Life Scale)

**Description:** Reflects overall evaluation of one's life. High scorers are generally content with their life circumstances.

**Behavioral Markers:**
- Satisfaction language
- Life evaluation
- Contentment words
- Wellbeing references

**Data Points:**
| Feature | Indicator |
|---------|-----------|
| Overall satisfaction | Happy, satisfied, content, fulfilled |
| Life evaluation | Good life, ideal, close to perfect |
| Achievement sense | Accomplished, achieved, got what I wanted |
| Future outlook | Optimistic, hopeful, looking forward |

---

### Domain 24: Stress Coping
**ID:** `stress_coping`
**Psychometric Source:** Brief COPE Inventory

**Description:** Reflects strategies used to manage stress and adversity. Includes problem-focused and emotion-focused approaches.

**Behavioral Markers:**
- Coping strategy language
- Stress response
- Recovery language
- Support-seeking

**Data Points:**
| Feature | Indicator |
|---------|-----------|
| Problem-focused | Action words, plan, solve, fix |
| Emotion-focused | Feel, process, accept, support |
| Avoidant | Avoid, ignore, distract, deny |
| Support-seeking | Help, talk to, reach out |

---

### Domain 25: Social Support
**ID:** `social_support`
**Psychometric Source:** MSPSS (Multidimensional Scale of Perceived Social Support)

**Description:** Reflects perceived availability of support from others. Includes family, friends, and significant others.

**Behavioral Markers:**
- Support references
- Network language
- Help availability
- Relationship mentions

**Data Points:**
| Feature | Indicator |
|---------|-----------|
| Family support | Family helps, parents, siblings support |
| Friend support | Friends there, can count on friends |
| Significant other | Partner, spouse, relationship support |
| General support | People care, someone to turn to |

---

### Domain 26: Authenticity
**ID:** `authenticity`
**Psychometric Source:** Authenticity Scale (Wood et al.)

**Description:** Reflects alignment between inner experience and outward expression. High scorers are genuine and true to themselves.

**Behavioral Markers:**
- Self-expression
- Genuineness language
- Congruence markers
- Identity references

**Data Points:**
| Feature | High Score | Low Score |
|---------|-----------|-----------|
| Self-alienation | Don't know who I am | Know myself, understand who I am |
| Authentic living | True to self, genuine, real, honest | - |
| External influence | Others expect, should be | Own decisions, my choice |
| Congruence | Feel aligned, match, consistent | - |

---

## Category F: Cognitive/Learning (Domains 27-32)

### Domain 27: Cognitive Abilities
**ID:** `cognitive_abilities`
**Psychometric Source:** LIWC Cognitive Processing + Verbal IQ correlates

**Description:** Reflects verbal intelligence, reasoning capacity, and cognitive complexity. Measures how people process and communicate complex information.

**Behavioral Markers:**
- Lexical sophistication
- Sentence complexity
- Logical connectors
- Abstract reasoning
- Reference coherence

**Data Points:**
| Feature | Indicator |
|---------|-----------|
| Average word length | General verbal intelligence |
| Words per sentence | Cognitive complexity |
| Subordinate clauses | Hierarchical thinking |
| Causal words | Causal reasoning |
| Exclusive words | Differentiation ability |

---

### Domain 28: Creativity
**ID:** `creativity`
**Psychometric Source:** CAQ (Creative Achievement Questionnaire) / Divergent Thinking Tests

**Description:** Reflects capacity for novel idea generation, divergent thinking, and making unusual connections. Includes fluency, flexibility, and originality.

**Behavioral Markers:**
- Remote associations
- Metaphor usage
- Novelty language
- Divergent thinking

**Data Points:**
| Feature | Indicator |
|---------|-----------|
| Semantic distance | Conceptual distance between words |
| Unusual combinations | Rare collocations |
| Metaphor density | Figurative to literal ratio |
| Question diversity | Variety in question types |
| Idea fluency | Distinct concepts per response |

---

### Domain 29: Learning Styles
**ID:** `learning_styles`
**Psychometric Source:** VARK Learning Style Inventory

**Description:** Reflects preferred modes of acquiring and processing new information. Includes visual, auditory, reading/writing, and kinesthetic preferences.

**Behavioral Markers:**
- Sensory preference
- Information seeking
- Processing style

**Data Points:**
| Feature | Indicator |
|---------|-----------|
| Visual | See, look, picture, visualize |
| Auditory | Hear, sound, tell, discuss |
| Read/Write | Read, write, list, note |
| Kinesthetic | Feel, touch, hands-on |

---

### Domain 30: Information Processing
**ID:** `information_processing`
**Psychometric Source:** Cognitive Processing Models (Craik & Lockhart)

**Description:** Reflects how information is encoded, stored, and retrieved. Includes processing depth, speed, and attention characteristics.

**Behavioral Markers:**
- Processing depth
- Attention patterns
- Memory references

**Data Points:**
| Feature | Indicator |
|---------|-----------|
| Processing depth | Elaboration, connections, abstract |
| Processing speed | Response latency |
| Attention span | Topic coherence, completion |
| Selective attention | Focus maintenance |

---

### Domain 31: Metacognition
**ID:** `metacognition`
**Psychometric Source:** MAI (Metacognitive Awareness Inventory)

**Description:** Reflects awareness and control of own thinking processes. Includes planning, monitoring, and evaluating cognitive strategies.

**Behavioral Markers:**
- Self-monitoring
- Strategy awareness
- Knowledge calibration
- Reflection

**Data Points:**
| Feature | Indicator |
|---------|-----------|
| Planning | Goal words, strategy, approach |
| Monitoring | Check, verify, evaluate, track |
| Evaluation | Assess, judge, review, reflect |
| Debugging | Correct, fix, adjust, revise |

---

### Domain 32: Executive Functions
**ID:** `executive_functions`
**Psychometric Source:** BRIEF (Behavior Rating Inventory of Executive Function) / Miyake Model

**Description:** Reflects higher-order cognitive processes for goal-directed behavior. Includes inhibition, cognitive flexibility, and working memory.

**Behavioral Markers:**
- Inhibition language
- Cognitive flexibility
- Working memory
- Planning language

**Data Points:**
| Feature | Indicator |
|---------|-----------|
| Inhibition | Stop, resist, control, restrain |
| Shifting | Change, switch, adapt, flexible |
| Updating | Remember, forget, recall |
| Planning | Plan, organize, schedule, steps |

---

## Category G: Social/Cultural/Values (Domains 33-37)

### Domain 33: Social Cognition
**ID:** `social_cognition`
**Psychometric Source:** RMET (Reading the Mind in the Eyes Test) / Theory of Mind Tasks

**Description:** Reflects ability to understand and predict others' mental states and behaviors. Includes theory of mind and perspective-taking.

**Behavioral Markers:**
- Theory of mind
- Perspective-taking
- Social inference
- Attribution patterns

**Data Points:**
| Feature | Indicator |
|---------|-----------|
| Theory of Mind | They think..., mental state verbs |
| Perspective taking | From their view..., In their shoes... |
| Social inference | They probably..., That suggests... |
| Attribution | Cause explanations for behavior |

---

### Domain 34: Political Ideology
**ID:** `political_ideology`
**Psychometric Source:** MFQ (Moral Foundations Questionnaire) / Political Compass

**Description:** Reflects political orientation along liberal-conservative dimensions. Based on moral foundations and worldview differences.

**Behavioral Markers:**
- Authority orientation
- In-group/out-group
- Equality framing
- Moral foundation emphasis

**Data Points:**
| Feature | Conservative | Liberal |
|---------|-------------|---------|
| Authority | Respect, tradition, order | Question, challenge, change |
| Group focus | In-group loyalty | Universal, equality |
| Certainty | Higher certainty words | More nuance |
| Threat sensitivity | More threat words | Fewer threat words |

---

### Domain 35: Cultural Values
**ID:** `cultural_values`
**Psychometric Source:** Hofstede Cultural Dimensions

**Description:** Reflects cultural dimensions that influence behavior and worldview. Includes individualism, power distance, and time orientation.

**Behavioral Markers:**
- Individualism/collectivism
- Power distance
- Uncertainty avoidance
- Long-term orientation

**Data Points:**
| Feature | High | Low |
|---------|------|-----|
| Individualism | I, personal, independence | We, group, harmony |
| Power Distance | Hierarchy, respect, status | Equality, challenge authority |
| Uncertainty Avoidance | Rules, structure, certainty | Ambiguity tolerance |
| Long-term Orientation | Future, persistence | Present, tradition |

---

### Domain 36: Moral Reasoning
**ID:** `moral_reasoning`
**Psychometric Source:** DIT-2 (Defining Issues Test) / MFQ

**Description:** Reflects how people think about ethical issues and make moral judgments. Based on evolutionary moral foundations.

**Behavioral Markers:**
- Moral vocabulary
- Justice vs care orientation
- Principled reasoning
- Moral foundations

**Data Points:**
| Feature | Indicator |
|---------|-----------|
| Care/Harm | Suffering, kindness, compassion |
| Fairness/Cheating | Justice, rights, equality |
| Loyalty/Betrayal | Group words, patriotism |
| Authority/Subversion | Respect, tradition, obedience |
| Sanctity/Degradation | Purity, sacred, disgust |

---

### Domain 37: Work & Career Style
**ID:** `work_career_style`
**Psychometric Source:** Career Anchors (Schein)

**Description:** Reflects orientation toward work and career. Includes job vs career vs calling orientations and work values.

**Behavioral Markers:**
- Work orientation
- Career values
- Professional communication
- Achievement motivation

**Data Points:**
| Feature | Indicator |
|---------|-----------|
| Technical/Functional | Expertise, mastery, specialized |
| Managerial | Lead, manage, responsibility, authority |
| Autonomy | Independence, freedom, my way |
| Security/Stability | Stable, secure, predictable |
| Service/Dedication | Help, contribute, make difference |

---

## Category H: Sensory/Aesthetic (Domains 38-39)

### Domain 38: Sensory Processing
**ID:** `sensory_processing`
**Psychometric Source:** HSP Scale (Highly Sensitive Person Scale)

**Description:** Reflects how sensory information is processed and integrated. Includes sensory sensitivity and processing patterns.

**Behavioral Markers:**
- Sensory vocabulary
- Sensitivity indicators
- Stimulation seeking/avoiding

**Data Points:**
| Feature | Indicator |
|---------|-----------|
| Visual | See, look, bright, colorful, picture |
| Auditory | Hear, sound, loud, quiet, tune |
| Kinesthetic | Feel, touch, rough, smooth |
| Sensitivity level | Intensity words, overwhelm, seeking |

---

### Domain 39: Aesthetic Preferences
**ID:** `aesthetic_preferences`
**Psychometric Source:** Aesthetic Fluency Scale / AESTHEMOS

**Description:** Reflects preferences for beauty, art, and design. Includes complexity, novelty, and emotional resonance in aesthetic judgments.

**Behavioral Markers:**
- Beauty vocabulary
- Style preferences
- Artistic references

**Data Points:**
| Feature | Indicator |
|---------|-----------|
| Complexity preference | Simple vs intricate, minimal vs elaborate |
| Novelty preference | Classic vs modern, avant-garde |
| Emotional resonance | Feeling words in aesthetic discussion |
| Sensory emphasis | Dominant sensory words |

---

## Domain ID Quick Reference

| # | ID | Name |
|---|-----|------|
| 1 | `big_five_openness` | Openness to Experience |
| 2 | `big_five_conscientiousness` | Conscientiousness |
| 3 | `big_five_extraversion` | Extraversion |
| 4 | `big_five_agreeableness` | Agreeableness |
| 5 | `big_five_neuroticism` | Neuroticism |
| 6 | `dark_triad_narcissism` | Narcissism |
| 7 | `dark_triad_machiavellianism` | Machiavellianism |
| 8 | `dark_triad_psychopathy` | Psychopathy |
| 9 | `emotional_empathy` | Empathy |
| 10 | `emotional_intelligence` | Emotional Intelligence |
| 11 | `attachment_style` | Attachment Style |
| 12 | `love_languages` | Love Languages |
| 13 | `communication_style` | Communication Style |
| 14 | `risk_tolerance` | Risk Tolerance |
| 15 | `decision_style` | Decision Style |
| 16 | `time_orientation` | Time Orientation |
| 17 | `achievement_motivation` | Achievement Motivation |
| 18 | `self_efficacy` | Self-Efficacy |
| 19 | `locus_of_control` | Locus of Control |
| 20 | `growth_mindset` | Growth Mindset |
| 21 | `personal_values` | Personal Values |
| 22 | `interests` | Interests (RIASEC) |
| 23 | `life_satisfaction` | Life Satisfaction |
| 24 | `stress_coping` | Stress Coping |
| 25 | `social_support` | Social Support |
| 26 | `authenticity` | Authenticity |
| 27 | `cognitive_abilities` | Cognitive Abilities |
| 28 | `creativity` | Creativity |
| 29 | `learning_styles` | Learning Styles |
| 30 | `information_processing` | Information Processing |
| 31 | `metacognition` | Metacognition |
| 32 | `executive_functions` | Executive Functions |
| 33 | `social_cognition` | Social Cognition |
| 34 | `political_ideology` | Political Ideology |
| 35 | `cultural_values` | Cultural Values |
| 36 | `moral_reasoning` | Moral Reasoning |
| 37 | `work_career_style` | Work & Career Style |
| 38 | `sensory_processing` | Sensory Processing |
| 39 | `aesthetic_preferences` | Aesthetic Preferences |

---

## Related Files

- **Source Code:** `src/pages/ProfileDashboard.tsx` - Contains DOMAIN_REFERENCE constant
- **Config:** `src/lib/analysis-config.ts` - Contains PSYCHOLOGICAL_DOMAINS list and weights
- **Trait Prototypes:** `src/lib/trait-prototypes.ts` - Embedding prototypes for semantic matching
- **LIWC Analysis:** `src/lib/enhanced-analyzer.ts` - Word-matching analysis
- **LLM Analysis:** `src/lib/llm-deep-analyzer.ts` - Deep semantic analysis

---

*Last Updated: December 2024*
