# Fine-Tuned Psychometrics PRD

## Product Requirements Document for Gemma 3 Fine-Tuned Personality Classifier

**Version:** 1.0
**Date:** December 2025
**Author:** Digital Twin Project

---

## Executive Summary

This document outlines the requirements for fine-tuning a Google Gemma 3 model to perform structured psychometric classification from natural language text. The goal is to replace the current rule-based LIWC word-matching system with a semantically-aware model that understands context, negation, and implicit personality signals.

### Key Objectives
1. Create a fine-tuned classifier for all 39 psychological domains
2. Output structured JSON responses with confidence scores
3. Enable on-device inference for privacy preservation
4. Achieve significantly better accuracy than rule-based matching

---

## 1. Synthetic Data Generation with SDV

### Overview

We use the [Synthetic Data Vault (SDV)](https://sdv.dev/) by DataCebo to generate high-quality training data for our psychometric classifier. SDV uses machine learning (Gaussian Copulas, CTGAN, TVAE) to learn statistical patterns from seed data and generate realistic synthetic samples.

**Why Synthetic Data?**
- Real psychometric datasets are limited, expensive, and privacy-sensitive
- Synthetic data preserves statistical properties without exposing individuals
- Enables generation of rare trait combinations (e.g., high psychopathy + high empathy)
- Allows targeted data augmentation for underrepresented domains

### SDV Setup

```bash
pip install sdv
```

```python
from sdv.single_table import GaussianCopulaSynthesizer, CTGANSynthesizer
from sdv.metadata import SingleTableMetadata
```

### Training Data Schema

```python
# SDV Metadata for Psychometric Training Data
metadata = SingleTableMetadata()
metadata.detect_from_dataframe(seed_data)

# Schema Definition
TRAINING_DATA_SCHEMA = {
    "sample_id": "id",
    "text": "text",                           # Input text sample
    "word_count": "numerical",
    "domain_id": "categorical",               # One of 26 domains
    "score": "numerical",                     # 0.0-1.0 trait score
    "confidence_label": "categorical",        # high/medium/low
    "facets": "categorical",                  # Comma-separated facet labels
    "linguistic_features": "json",            # Extracted LIWC-style features
    "source_dataset": "categorical",          # pandora/essays/synthetic
    "negation_present": "boolean",
    "text_quality": "categorical"             # clean/noisy/mixed
}
```

---

## 1.1 Deep Psychometric Domain Research

### Domain Research Methodology

For each of the 26 psychological domains, we document:
1. **Standard Assessment Instrument** - The gold-standard psychometric test
2. **Facets/Subscales** - Component dimensions measured
3. **Linguistic Markers** - Text features correlated with the trait (from LIWC and NLP research)
4. **High Score Text Patterns** - Example language indicating high trait levels
5. **Low Score Text Patterns** - Example language indicating low trait levels
6. **SDV Generation Parameters** - Constraints for synthetic data

---

### CATEGORY A: BIG FIVE PERSONALITY (Domains 1-5)

**Source Instrument:** NEO-PI-R (Costa & McCrae, 1992)
- 240 items, 30 facets (6 per domain)
- Alternative: IPIP-NEO (120 items, public domain)
- Alternative: BFI-2 (60 items, Soto & John, 2017)

---

#### Domain 1: Openness to Experience

| Attribute | Value |
|-----------|-------|
| **ID** | `big_five_openness` |
| **Assessment** | NEO-PI-R Openness Scale (48 items) |
| **Score Range** | 0.0 (Closed) - 1.0 (Open) |

**Facets (NEO-PI-R O1-O6):**
| Facet | Description | High Score Indicators |
|-------|-------------|----------------------|
| O1: Fantasy | Imagination, daydreaming | "I often imagine...", "What if we could..." |
| O2: Aesthetics | Appreciation of art/beauty | "The colors were breathtaking", "I was moved by..." |
| O3: Feelings | Emotional awareness | "I felt deeply...", "It resonated with me" |
| O4: Actions | Variety-seeking | "I tried something new", "Why not experiment?" |
| O5: Ideas | Intellectual curiosity | "I've been thinking about...", "Consider this..." |
| O6: Values | Unconventional beliefs | "Society assumes...", "I question whether..." |

**Linguistic Markers (Research-Based):**
```yaml
high_openness:
  vocabulary:
    - High type-token ratio (diverse vocabulary)
    - Abstract nouns (concept, theory, idea)
    - Aesthetic words (beautiful, elegant, profound)
    - Tentative modifiers (perhaps, possibly, might)
  syntax:
    - Complex sentence structures
    - Subordinate clauses
    - Rhetorical questions
  LIWC_categories:
    - insight: elevated (think, know, consider)
    - tentative: elevated (maybe, perhaps)
    - certain: reduced (always, never, definitely)

low_openness:
  vocabulary:
    - Concrete nouns (car, house, food)
    - Certainty words (obviously, clearly, always)
    - Practical/utilitarian language
  syntax:
    - Simple declarative sentences
    - Direct statements
  LIWC_categories:
    - certain: elevated
    - insight: reduced
```

**SDV Generation Constraints:**
```python
openness_constraints = [
    # High openness → high vocabulary diversity
    ScalarInequality(column='type_token_ratio', relation='>=', value=0.6,
                     condition={'score': {'>=': 0.7}}),
    # Low openness → more certain language
    ScalarInequality(column='certainty_words', relation='>=', value=5,
                     condition={'score': {'<=': 0.3}})
]
```

---

#### Domain 2: Conscientiousness

| Attribute | Value |
|-----------|-------|
| **ID** | `big_five_conscientiousness` |
| **Assessment** | NEO-PI-R Conscientiousness Scale (48 items) |
| **Score Range** | 0.0 (Disorganized) - 1.0 (Organized) |

**Facets (NEO-PI-R C1-C6):**
| Facet | Description | High Score Indicators |
|-------|-------------|----------------------|
| C1: Competence | Self-efficacy | "I can handle...", "I'm good at..." |
| C2: Order | Organization | "First... then... finally...", "My system is..." |
| C3: Dutifulness | Reliability | "I always...", "I committed to..." |
| C4: Achievement Striving | Ambition | "My goal is...", "I'm working toward..." |
| C5: Self-Discipline | Persistence | "I pushed through...", "Despite the difficulty..." |
| C6: Deliberation | Thoughtful planning | "I considered...", "After weighing options..." |

**Linguistic Markers:**
```yaml
high_conscientiousness:
  vocabulary:
    - Achievement words (win, success, accomplish, goal)
    - Planning words (schedule, organize, prepare, deadline)
    - Future tense verbs
    - Temporal markers (then, next, after, before)
  syntax:
    - Sequential/numbered lists
    - Cause-effect structures
    - Few filler words (um, uh, like)
  LIWC_categories:
    - achieve: elevated
    - work: elevated
    - future: elevated
    - negate: moderate (inhibition language)

low_conscientiousness:
  vocabulary:
    - Hedging language (whatever, maybe later)
    - Present-focus words
    - Filler words abundant
  syntax:
    - Incomplete thoughts
    - Topic changes
  LIWC_categories:
    - achieve: reduced
    - filler: elevated
```

---

#### Domain 3: Extraversion

| Attribute | Value |
|-----------|-------|
| **ID** | `big_five_extraversion` |
| **Assessment** | NEO-PI-R Extraversion Scale (48 items) |
| **Score Range** | 0.0 (Introverted) - 1.0 (Extraverted) |

**Facets (NEO-PI-R E1-E6):**
| Facet | Description | High Score Indicators |
|-------|-------------|----------------------|
| E1: Warmth | Affectionate | "I love seeing you!", enthusiastic greetings |
| E2: Gregariousness | Sociability | "Let's get everyone together", group references |
| E3: Assertiveness | Leadership | "I think we should...", directive language |
| E4: Activity | Energy/pace | "I've been so busy!", multiple activities |
| E5: Excitement-Seeking | Thrill-seeking | "It was amazing!", intensity markers |
| E6: Positive Emotions | Cheerfulness | Exclamation points, positive adjectives |

**Linguistic Markers:**
```yaml
high_extraversion:
  vocabulary:
    - Social words (friend, party, together, we, us)
    - Positive emotion words (love, great, amazing, fun)
    - Exclamations and intensifiers
    - First-person plural (we, us, our)
  syntax:
    - Higher word count per message
    - More questions asked
    - Exclamation marks
  LIWC_categories:
    - social: elevated
    - posemo: elevated
    - we: elevated (first-person plural)
    - word_count: above average

low_extraversion:
  vocabulary:
    - Singular pronouns (I, me, my)
    - Hedging/qualifying language
    - Fewer social references
  syntax:
    - Shorter messages
    - Fewer questions
  LIWC_categories:
    - i: elevated (first-person singular)
    - social: reduced
```

---

#### Domain 4: Agreeableness

| Attribute | Value |
|-----------|-------|
| **ID** | `big_five_agreeableness` |
| **Assessment** | NEO-PI-R Agreeableness Scale (48 items) |
| **Score Range** | 0.0 (Antagonistic) - 1.0 (Agreeable) |

**Facets (NEO-PI-R A1-A6):**
| Facet | Description | High Score Indicators |
|-------|-------------|----------------------|
| A1: Trust | Belief in others' honesty | "I believe they meant well" |
| A2: Straightforwardness | Sincerity | Direct, honest communication |
| A3: Altruism | Helpfulness | "How can I help?", "Let me..." |
| A4: Compliance | Cooperation | "I understand your point", "That makes sense" |
| A5: Modesty | Humility | "I'm no expert, but...", deflecting praise |
| A6: Tender-Mindedness | Sympathy | "That must be hard", empathic responses |

**Linguistic Markers:**
```yaml
high_agreeableness:
  vocabulary:
    - Affiliation words (friend, ally, together)
    - Agreement markers (yes, right, exactly, I agree)
    - Helping verbs (let me, I can, shall I)
    - Empathy phrases (I understand, that makes sense)
  syntax:
    - Softening hedges (perhaps, might, could)
    - Acknowledgment before disagreement
  LIWC_categories:
    - affiliation: elevated
    - posemo: elevated
    - anger: reduced
    - swear: reduced

low_agreeableness:
  vocabulary:
    - Confrontational language
    - Criticism words
    - Swear words
    - Competitive language
  syntax:
    - Direct contradiction ("No, you're wrong")
    - Sarcasm markers
  LIWC_categories:
    - anger: elevated
    - swear: elevated
    - negemo: elevated
```

---

#### Domain 5: Neuroticism

| Attribute | Value |
|-----------|-------|
| **ID** | `big_five_neuroticism` |
| **Assessment** | NEO-PI-R Neuroticism Scale (48 items) |
| **Score Range** | 0.0 (Emotionally Stable) - 1.0 (Neurotic) |

**Facets (NEO-PI-R N1-N6):**
| Facet | Description | High Score Indicators |
|-------|-------------|----------------------|
| N1: Anxiety | Worry, nervousness | "I'm worried about...", "What if..." |
| N2: Angry Hostility | Irritability | "It's so frustrating", anger expressions |
| N3: Depression | Sadness, hopelessness | "I feel down", "Nothing seems to work" |
| N4: Self-Consciousness | Social anxiety | "Everyone must think...", embarrassment |
| N5: Impulsiveness | Poor impulse control | "I couldn't resist", regret expressions |
| N6: Vulnerability | Stress susceptibility | "I can't handle...", overwhelm language |

**Linguistic Markers:**
```yaml
high_neuroticism:
  vocabulary:
    - Anxiety words (worried, nervous, anxious, stressed)
    - Negative emotion words (sad, angry, afraid, upset)
    - First-person singular (I, me, my) - self-focus
    - Health/body references
    - Tentative language
  syntax:
    - Rumination patterns (repetitive concerns)
    - Catastrophizing ("always", "never", "worst")
  LIWC_categories:
    - negemo: elevated
    - anx: elevated
    - sad: elevated
    - i: elevated (self-focus)
    - health: elevated

low_neuroticism:
  vocabulary:
    - Calm, measured language
    - Problem-solving focus
    - Positive reframing
  syntax:
    - Balanced perspective statements
    - Solution-oriented language
  LIWC_categories:
    - negemo: reduced
    - posemo: moderate-high
```

---

### CATEGORY B: DARK TRIAD (Domains 6-8)

**Source Instrument:** Short Dark Triad (SD3) - Jones & Paulhus, 2014
- 27 items (9 per trait)
- Alternative: Dirty Dozen (12 items)

**Research Basis:** NLP studies using BERT and ML models have achieved reliable accuracy in detecting Dark Triad traits from text (Linear SVC showing best performance).

---

#### Domain 6: Narcissism

| Attribute | Value |
|-----------|-------|
| **ID** | `dark_triad_narcissism` |
| **Assessment** | NPI-40, SD3 Narcissism subscale |
| **Score Range** | 0.0 (Humble) - 1.0 (Narcissistic) |

**Facets:**
| Facet | Description | Text Indicators |
|-------|-------------|-----------------|
| Grandiosity | Inflated self-view | "I'm exceptional at...", superiority claims |
| Entitlement | Deserving special treatment | "I deserve...", "They should..." |
| Exhibitionism | Attention-seeking | Self-promotion, achievement highlighting |
| Exploitativeness | Using others | Transactional relationship language |

**Linguistic Markers:**
```yaml
high_narcissism:
  vocabulary:
    - First-person singular (I, me, my) - extremely elevated
    - Achievement/status words
    - Superiority language (best, exceptional, unmatched)
    - Name-dropping, credential citing
  syntax:
    - Self-referential statements
    - Minimizing others' contributions
    - Grandiose claims
  LIWC_categories:
    - i: highly elevated
    - achieve: elevated
    - power: elevated
    - we: reduced

low_narcissism:
  vocabulary:
    - Inclusive pronouns
    - Credit-sharing language
    - Humble qualifiers
```

---

#### Domain 7: Machiavellianism

| Attribute | Value |
|-----------|-------|
| **ID** | `dark_triad_machiavellianism` |
| **Assessment** | MACH-IV, SD3 Machiavellianism subscale |
| **Score Range** | 0.0 (Sincere) - 1.0 (Manipulative) |

**Facets:**
| Facet | Description | Text Indicators |
|-------|-------------|-----------------|
| Cynicism | Distrust of human nature | "People only care about themselves" |
| Amorality | Ends justify means | Strategic/tactical language |
| Manipulation | Interpersonal exploitation | Persuasion tactics, flattery |
| Strategic Planning | Long-term scheming | "In the long run...", calculated reasoning |

**Linguistic Markers:**
```yaml
high_machiavellianism:
  vocabulary:
    - Strategic words (plan, leverage, position, advantage)
    - Cynical expressions about human nature
    - Transactional language (deal, exchange, benefit)
    - Conditional statements (if...then)
  syntax:
    - Complex conditional reasoning
    - Cost-benefit framing
    - Detached, unemotional tone
  LIWC_categories:
    - cogproc: elevated (analytical)
    - cause: elevated (causal reasoning)
    - tentat: elevated (calculated hedging)

low_machiavellianism:
  vocabulary:
    - Trust language
    - Sincere expressions
    - Straightforward statements
```

---

#### Domain 8: Psychopathy

| Attribute | Value |
|-----------|-------|
| **ID** | `dark_triad_psychopathy` |
| **Assessment** | Levenson Self-Report Psychopathy Scale, SD3 Psychopathy subscale |
| **Score Range** | 0.0 (Empathic) - 1.0 (Psychopathic) |

**Facets:**
| Facet | Description | Text Indicators |
|-------|-------------|-----------------|
| Callousness | Lack of empathy | Dismissing others' feelings |
| Impulsivity | Reckless behavior | "I just did it", no planning |
| Thrill-Seeking | Excitement-seeking | Risk-taking descriptions |
| Antisocial | Rule-breaking | Defiance, norm violation |

**Linguistic Markers:**
```yaml
high_psychopathy:
  vocabulary:
    - Action words without consequence consideration
    - Thrill/excitement words (rush, adrenaline)
    - Callous dismissals ("who cares", "whatever")
    - Rule-violation references
  syntax:
    - Short, direct sentences
    - Lack of emotional elaboration
    - Present-focused
  LIWC_categories:
    - affect: reduced (flat affect)
    - social: reduced
    - risk: elevated
    - motion: elevated (action-oriented)

low_psychopathy:
  vocabulary:
    - Consequence consideration
    - Empathy expressions
    - Rule-following references
```

---

### CATEGORY C: EMOTIONAL/SOCIAL (Domains 9-13)

---

#### Domain 9: Empathy

| Attribute | Value |
|-----------|-------|
| **ID** | `emotional_empathy` |
| **Assessment** | Interpersonal Reactivity Index (IRI) - Davis, 1983 |
| **Score Range** | 0.0 (Low Empathy) - 1.0 (High Empathy) |

**Facets:**
| Facet | Description | Text Indicators |
|-------|-------------|-----------------|
| Perspective Taking | Cognitive empathy | "From their point of view..." |
| Empathic Concern | Emotional concern for others | "I feel for them", "That must be hard" |
| Fantasy | Emotional engagement with fiction | "I really connected with the character" |
| Personal Distress | Self-oriented distress | "Seeing that made me anxious" |

**Linguistic Markers:**
```yaml
high_empathy:
  vocabulary:
    - Perspective-taking phrases ("I can see why", "In their shoes")
    - Emotional validation ("That sounds difficult")
    - Supportive language ("I'm here for you")
    - Second-person pronouns (you, your)
  syntax:
    - Questions about others' feelings
    - Reflective statements
  LIWC_categories:
    - social: elevated
    - affect: elevated
    - you: elevated

low_empathy:
  vocabulary:
    - Dismissive language
    - Self-focused responses to others' problems
    - Solution-jumping without validation
```

---

#### Domain 10: Emotional Intelligence

| Attribute | Value |
|-----------|-------|
| **ID** | `emotional_intelligence` |
| **Assessment** | MSCEIT (Mayer-Salovey-Caruso), SREIS |
| **Score Range** | 0.0 (Low EI) - 1.0 (High EI) |

**Facets (Four-Branch Model):**
| Facet | Description | Text Indicators |
|-------|-------------|-----------------|
| Perceiving Emotions | Identifying emotions | Accurate emotion labeling |
| Using Emotions | Emotions facilitating thought | "I felt motivated by..." |
| Understanding Emotions | Emotional knowledge | "Anger often comes from..." |
| Managing Emotions | Emotion regulation | "I took a breath and..." |

**Linguistic Markers:**
```yaml
high_emotional_intelligence:
  vocabulary:
    - Nuanced emotion words (specific vs. generic)
    - Regulation language ("I calmed myself", "I processed")
    - Meta-emotional awareness ("I notice I'm feeling...")
    - Emotion vocabulary richness
  syntax:
    - Cause-effect emotional reasoning
    - Self-reflection statements

low_emotional_intelligence:
  vocabulary:
    - Generic emotion words (good, bad, fine)
    - Externalizing blame
    - Reactive language
```

---

#### Domain 11: Attachment Style

| Attribute | Value |
|-----------|-------|
| **ID** | `attachment_style` |
| **Assessment** | ECR-R (Experiences in Close Relationships-Revised) |
| **Score Range** | Categorical: secure, anxious, avoidant, disorganized |

**Dimensions:**
| Dimension | Description | Text Indicators |
|-----------|-------------|-----------------|
| Anxiety | Fear of abandonment | "Will they leave?", reassurance-seeking |
| Avoidance | Discomfort with closeness | "I need my space", independence emphasis |

**Attachment Types:**
| Type | Anxiety | Avoidance | Language Patterns |
|------|---------|-----------|-------------------|
| Secure | Low | Low | Balanced, comfortable with intimacy |
| Anxious | High | Low | Reassurance-seeking, future-focused worry |
| Avoidant | Low | High | Independence emphasis, emotional distance |
| Disorganized | High | High | Contradictory, confused relationship language |

**Linguistic Markers:**
```yaml
secure_attachment:
  - Balanced "I" and "we" usage
  - Comfortable discussing feelings
  - Trust language

anxious_attachment:
  - High reassurance-seeking questions
  - Future-focused worry about relationships
  - Intensifiers in affection ("I love you SO much")

avoidant_attachment:
  - Reduced emotional language
  - Independence/autonomy emphasis
  - Discomfort with vulnerability
```

---

#### Domain 12: Love Languages

| Attribute | Value |
|-----------|-------|
| **ID** | `love_languages` |
| **Assessment** | Chapman Love Languages Quiz |
| **Score Range** | Categorical with intensity: words_of_affirmation, quality_time, gifts, acts_of_service, physical_touch |

**Language Patterns by Type:**
```yaml
words_of_affirmation:
  - Verbal compliments and praise
  - Explicit appreciation statements
  - "I love when you say..."

quality_time:
  - "Let's spend time together"
  - Activity proposals
  - Presence/attention focus

gifts:
  - Gift-giving/receiving references
  - Thoughtfulness in objects
  - "I saw this and thought of you"

acts_of_service:
  - "Let me help you with..."
  - Task-oriented care
  - Action-based love expression

physical_touch:
  - Touch references (hug, hold, cuddle)
  - Physical comfort seeking
  - Proximity language
```

---

#### Domain 13: Communication Style

| Attribute | Value |
|-----------|-------|
| **ID** | `communication_style` |
| **Assessment** | Thomas-Kilmann Conflict Mode Instrument |
| **Score Range** | Categorical: assertive, passive, aggressive, passive_aggressive |

**Linguistic Markers:**
```yaml
assertive:
  - "I think...", "I feel...", "I need..."
  - Clear boundary statements
  - Respectful disagreement

passive:
  - Hedging and apologizing
  - Deference to others
  - "I guess...", "Maybe..."

aggressive:
  - Demands and commands
  - Blame language
  - Interrupting indicators

passive_aggressive:
  - Sarcasm
  - Backhanded compliments
  - Indirect criticism
```

---

### CATEGORY D: DECISION/MOTIVATION (Domains 14-20)

---

#### Domain 14: Risk Tolerance

| Attribute | Value |
|-----------|-------|
| **ID** | `risk_tolerance` |
| **Assessment** | Domain-Specific Risk-Taking (DOSPERT) |
| **Score Range** | 0.0 (Risk-Averse) - 1.0 (Risk-Seeking) |

**Linguistic Markers:**
```yaml
high_risk_tolerance:
  - Adventure/excitement language
  - "Why not?", "Let's try..."
  - Minimizing potential downsides
  - Future possibility focus

low_risk_tolerance:
  - Safety/security language
  - "What if something goes wrong?"
  - Detailed contingency planning
  - Past experience caution
```

---

#### Domain 15: Decision Making Style

| Attribute | Value |
|-----------|-------|
| **ID** | `decision_style` |
| **Assessment** | General Decision Making Style (GDMS) |
| **Score Range** | Categorical: rational, intuitive, dependent, avoidant, spontaneous |

**Linguistic Markers:**
```yaml
rational:
  - "Based on the data...", "The evidence suggests..."
  - Pros/cons enumeration
  - Logical connectors

intuitive:
  - "I feel like...", "My gut says..."
  - Immediate conclusions
  - Pattern recognition references

dependent:
  - "What do you think I should do?"
  - Seeking external validation
  - Referencing others' opinions

avoidant:
  - Postponement language
  - "I'll decide later"
  - Topic changing

spontaneous:
  - "I just decided!"
  - Present-moment focus
  - Minimal deliberation references
```

---

#### Domain 16: Time Orientation

| Attribute | Value |
|-----------|-------|
| **ID** | `time_orientation` |
| **Assessment** | Zimbardo Time Perspective Inventory (ZTPI) |
| **Score Range** | Categorical: past_negative, past_positive, present_hedonistic, present_fatalistic, future |

**Linguistic Markers:**
```yaml
past_focus:
  - Past tense verbs dominant
  - Nostalgia references
  - "Remember when...", "Back then..."

present_focus:
  - Present tense dominant
  - Immediate experience language
  - "Right now...", "In this moment..."

future_focus:
  - Future tense verbs
  - Goal/plan language
  - "Eventually...", "Someday...", "I will..."
```

---

#### Domain 17: Achievement Motivation

| Attribute | Value |
|-----------|-------|
| **ID** | `achievement_motivation` |
| **Assessment** | Achievement Motivation Scale (AMS) |
| **Score Range** | 0.0 (Low Achievement) - 1.0 (High Achievement) |

**Linguistic Markers:**
```yaml
high_achievement:
  - Goal language ("My goal is...", "I'm aiming for...")
  - Progress tracking ("I've accomplished...", "Next step is...")
  - Competition references
  - Excellence standards

low_achievement:
  - Satisfaction with status quo
  - Minimal goal references
  - Avoidance of challenge
```

---

#### Domain 18: Self-Efficacy

| Attribute | Value |
|-----------|-------|
| **ID** | `self_efficacy` |
| **Assessment** | General Self-Efficacy Scale (GSES) - Schwarzer & Jerusalem |
| **Score Range** | 0.0 (Low Self-Efficacy) - 1.0 (High Self-Efficacy) |

**Linguistic Markers:**
```yaml
high_self_efficacy:
  - "I can...", "I'm able to..."
  - Confidence in capability statements
  - Challenge-embracing language
  - Problem-solving focus

low_self_efficacy:
  - "I can't...", "I'm not good at..."
  - Doubt expressions
  - External attribution for failure
  - Help-seeking for basic tasks
```

---

#### Domain 19: Locus of Control

| Attribute | Value |
|-----------|-------|
| **ID** | `locus_of_control` |
| **Assessment** | Rotter's I-E Scale, Levenson's IPC |
| **Score Range** | 0.0 (External) - 1.0 (Internal) |

**Linguistic Markers:**
```yaml
internal_locus:
  - Agency language ("I made it happen", "My effort...")
  - Personal responsibility statements
  - "Because I...", self-attribution

external_locus:
  - Fate/luck references ("It was meant to be", "Lucky break")
  - "They caused...", other-attribution
  - Powerlessness language ("Nothing I can do")
  - "Powerful others" references
```

---

#### Domain 20: Growth Mindset

| Attribute | Value |
|-----------|-------|
| **ID** | `growth_mindset` |
| **Assessment** | Dweck Mindset Scale |
| **Score Range** | 0.0 (Fixed Mindset) - 1.0 (Growth Mindset) |

**Research Source:** Stanford research identified linguistic indicators correlating with stress coping and mindset.

**Linguistic Markers:**
```yaml
growth_mindset:
  - Learning language ("I'm learning...", "I'm improving...")
  - Effort attribution ("With practice...", "Hard work...")
  - "Yet" usage ("I can't do it YET")
  - Challenge-as-opportunity framing

fixed_mindset:
  - Talent/natural ability attribution
  - "I'm just not a ___ person"
  - Avoiding challenges
  - "Either you have it or you don't"
```

---

### CATEGORY E: VALUES/WELLBEING (Domains 21-26)

---

#### Domain 21: Values

| Attribute | Value |
|-----------|-------|
| **ID** | `personal_values` |
| **Assessment** | Schwartz Values Survey (SVS) |
| **Score Range** | Categorical: 10 value types |

**Value Types:**
| Value | Description | Linguistic Indicators |
|-------|-------------|----------------------|
| Self-Direction | Independence | "I choose my own...", autonomy language |
| Stimulation | Excitement | Adventure, novelty language |
| Hedonism | Pleasure | Enjoyment, gratification language |
| Achievement | Success | Goal, accomplishment language |
| Power | Control/status | Dominance, influence language |
| Security | Safety | Stability, protection language |
| Conformity | Rule-following | Should, ought, proper language |
| Tradition | Custom | Heritage, ritual language |
| Benevolence | Caring for close others | Helping, loyalty language |
| Universalism | Caring for all | Equality, justice, environment language |

---

#### Domain 22: Interests

| Attribute | Value |
|-----------|-------|
| **ID** | `interests` |
| **Assessment** | RIASEC (Holland Codes) |
| **Score Range** | Categorical: realistic, investigative, artistic, social, enterprising, conventional |

**Linguistic Markers:**
```yaml
realistic: Tools, building, fixing, outdoors, hands-on
investigative: Research, analyze, discover, understand, theory
artistic: Create, design, express, imagine, original
social: Help, teach, counsel, serve, cooperate
enterprising: Lead, persuade, sell, manage, compete
conventional: Organize, data, detail, systematic, accurate
```

---

#### Domain 23: Life Satisfaction

| Attribute | Value |
|-----------|-------|
| **ID** | `life_satisfaction` |
| **Assessment** | Satisfaction With Life Scale (SWLS) |
| **Score Range** | 0.0 (Dissatisfied) - 1.0 (Highly Satisfied) |

**Linguistic Markers:**
```yaml
high_satisfaction:
  - Gratitude expressions
  - Positive life assessment
  - "I love my life", fulfillment language
  - Balanced perspective on challenges

low_satisfaction:
  - Complaint frequency
  - "If only...", regret language
  - Dissatisfaction expressions
  - Comparison to others (unfavorable)
```

---

#### Domain 24: Stress Coping

| Attribute | Value |
|-----------|-------|
| **ID** | `stress_coping` |
| **Assessment** | Brief COPE, Ways of Coping Questionnaire |
| **Score Range** | Categorical: problem_focused, emotion_focused, avoidant |

**Linguistic Markers:**
```yaml
problem_focused:
  - Action planning language
  - "I'll fix...", "Steps to resolve..."
  - Information seeking

emotion_focused:
  - Emotional processing language
  - "I need to feel...", "Processing..."
  - Support seeking

avoidant:
  - Denial language
  - Distraction references
  - "I don't want to think about it"
```

---

#### Domain 25: Social Support

| Attribute | Value |
|-----------|-------|
| **ID** | `social_support` |
| **Assessment** | Multidimensional Scale of Perceived Social Support (MSPSS) |
| **Score Range** | 0.0 (Low Support) - 1.0 (High Support) |

**Linguistic Markers:**
```yaml
high_support:
  - Frequent social references
  - "My friends/family...", network mentions
  - Help-available language
  - We/us pronouns

low_support:
  - Isolation language
  - "I'm alone in this"
  - Lack of support mentions
  - Self-reliance (forced, not chosen)
```

---

#### Domain 26: Authenticity

| Attribute | Value |
|-----------|-------|
| **ID** | `authenticity` |
| **Assessment** | Authenticity Scale (Wood et al., 2008) |
| **Score Range** | 0.0 (Inauthentic) - 1.0 (Authentic) |

**Facets:**
| Facet | Description | Text Indicators |
|-------|-------------|-----------------|
| Authentic Living | Acting in accord with true self | "This is who I am", congruent values/actions |
| Accepting External Influence | Conforming to others | "They expect me to...", pleasing language |
| Self-Alienation | Disconnection from true self | "I don't know who I am", confusion |

**Linguistic Markers:**
```yaml
high_authenticity:
  - Self-acceptance language
  - Value-congruent statements
  - "I feel true to myself"
  - Consistent self-presentation

low_authenticity:
  - Self-doubt about identity
  - "I should be...", external standards
  - Incongruence in values/actions
  - People-pleasing language
```

---

### CATEGORY F: COGNITIVE/LEARNING (Domains 27-32)

---

#### Domain 27: Cognitive Abilities

| Attribute | Value |
|-----------|-------|
| **ID** | `cognitive_abilities` |
| **Assessment** | Cattell-Horn-Carroll (CHC) Theory, Wechsler Adult Intelligence Scale (WAIS-IV) |
| **Score Range** | 0.0 (Lower Cognitive Complexity) - 1.0 (Higher Cognitive Complexity) |

**Facets (CHC Model):**
| Facet | Description | Text Indicators |
|-------|-------------|-----------------|
| Fluid Intelligence (Gf) | Novel problem-solving | Abstract reasoning, logical deductions |
| Crystallized Intelligence (Gc) | Acquired knowledge | Domain expertise, vocabulary breadth |
| Working Memory (Gwm) | Information manipulation | Complex sentence structures, multi-step reasoning |
| Processing Speed (Gs) | Cognitive efficiency | Concise communication, quick topic shifts |
| Verbal Comprehension | Language understanding | Sophisticated vocabulary, nuanced meaning |

**Linguistic Markers:**
```yaml
high_cognitive_abilities:
  vocabulary:
    - High type-token ratio (lexical diversity)
    - Abstract and technical terminology
    - Precise word choices
    - Multi-syllabic words
  syntax:
    - Complex sentence structures
    - Subordinate clauses
    - Logical connectors (therefore, consequently, thus)
    - Causal reasoning chains
  LIWC_categories:
    - insight: elevated
    - causation: elevated
    - differentiation: elevated
    - cognitive_processes: elevated

low_cognitive_abilities:
  vocabulary:
    - Repetitive word usage
    - Concrete, common words
    - Vague language (stuff, things)
  syntax:
    - Simple sentence structures
    - Fewer logical connections
    - Direct statements without elaboration
```

**SDV Generation Constraints:**
```python
cognitive_abilities_constraints = [
    ScalarInequality(column='type_token_ratio', relation='>=', value=0.7,
                     condition={'score': {'>=': 0.8}}),
    ScalarInequality(column='avg_word_length', relation='>=', value=5.5,
                     condition={'score': {'>=': 0.7}})
]
```

---

#### Domain 28: Creativity

| Attribute | Value |
|-----------|-------|
| **ID** | `creativity` |
| **Assessment** | Torrance Tests of Creative Thinking (TTCT), Remote Associates Test (RAT) |
| **Score Range** | 0.0 (Conventional) - 1.0 (Highly Creative) |

**Facets (Guilford's Model):**
| Facet | Description | Text Indicators |
|-------|-------------|-----------------|
| Fluency | Quantity of ideas | Multiple suggestions, brainstorming language |
| Flexibility | Category diversity | Shifting perspectives, "what if" questions |
| Originality | Unique ideas | Novel metaphors, unexpected connections |
| Elaboration | Detailed development | Rich descriptions, expanded concepts |

**Linguistic Markers:**
```yaml
high_creativity:
  vocabulary:
    - Novelty words (imagine, invent, create, innovate)
    - Metaphorical language
    - Unusual word combinations
    - Sensory descriptors
  syntax:
    - Hypothetical constructions ("What if...")
    - Analogies and comparisons
    - Playful language patterns
    - Non-linear narratives
  LIWC_categories:
    - insight: elevated
    - percept: elevated (sensory)
    - tentative: elevated (exploration)

low_creativity:
  vocabulary:
    - Standard, predictable language
    - Clichés and common phrases
    - Literal descriptions
  syntax:
    - Linear, predictable structure
    - Few analogies or metaphors
```

**SDV Generation Constraints:**
```python
creativity_constraints = [
    ScalarInequality(column='novelty_words', relation='>=', value=3,
                     condition={'score': {'>=': 0.7}}),
    ScalarInequality(column='metaphor_count', relation='>=', value=1,
                     condition={'score': {'>=': 0.6}})
]
```

---

#### Domain 29: Learning Styles

| Attribute | Value |
|-----------|-------|
| **ID** | `learning_styles` |
| **Assessment** | VARK Questionnaire (Fleming), Kolb Learning Style Inventory |
| **Score Range** | Categorical: visual, auditory, reading/writing, kinesthetic, multimodal |

**VARK Modalities:**
| Style | Description | Text Indicators |
|-------|-------------|-----------------|
| Visual | Learn through seeing | "I see what you mean", "Picture this", diagram references |
| Auditory | Learn through hearing | "Sounds good", "I hear you", discussion references |
| Reading/Writing | Learn through text | "Let me read about", "I'll write it down", documentation focus |
| Kinesthetic | Learn through doing | "Hands-on", "Let me try", action-oriented language |

**Linguistic Markers:**
```yaml
visual_learner:
  - Visual verbs (see, look, watch, observe, imagine)
  - Color and spatial references
  - "Show me", "Let me see"
  - Diagram/chart mentions

auditory_learner:
  - Auditory verbs (hear, listen, sound, tell)
  - Dialogue preferences
  - "Tell me about", "Sounds like"
  - Music/rhythm references

reading_writing_learner:
  - Reading/writing verbs (read, write, note, list)
  - Documentation preferences
  - "I'll look it up", "Let me write that down"
  - Definition/explanation requests

kinesthetic_learner:
  - Action verbs (do, try, feel, touch, handle)
  - Physical metaphors
  - "Let me try", "Hands-on experience"
  - Practice/exercise references

multimodal:
  - Balanced use of multiple modality words
  - Flexible learning references
  - "I learn best by..." with multiple methods
```

---

#### Domain 30: Information Processing

| Attribute | Value |
|-----------|-------|
| **ID** | `information_processing` |
| **Assessment** | Cognitive Style Index (CSI), Need for Cognition Scale |
| **Score Range** | 0.0 (Shallow/Fast) - 1.0 (Deep/Thorough) |

**Facets:**
| Facet | Description | Text Indicators |
|-------|-------------|-----------------|
| Processing Depth | Shallow vs deep analysis | Surface observations vs analytical reasoning |
| Processing Speed | Quick vs deliberate | Immediate responses vs considered replies |
| Global vs Local | Big picture vs details | Overview focus vs specific focus |
| Serial vs Parallel | One-at-a-time vs simultaneous | Linear progression vs multi-topic |

**Linguistic Markers:**
```yaml
deep_processing:
  vocabulary:
    - Analytical language (analyze, consider, evaluate)
    - Qualification words (however, although, but)
    - Nuance markers (somewhat, partially, to some extent)
  syntax:
    - Longer, more complex sentences
    - Multiple clauses
    - Cause-effect reasoning
    - Counterarguments and qualifications
  LIWC_categories:
    - cogproc: elevated
    - differ: elevated (differentiation)
    - tentat: elevated (considering alternatives)

shallow_processing:
  vocabulary:
    - Definitive language (definitely, absolutely)
    - Simple evaluations (good, bad, right, wrong)
  syntax:
    - Shorter sentences
    - Direct statements
    - Few qualifications
```

---

#### Domain 31: Metacognition

| Attribute | Value |
|-----------|-------|
| **ID** | `metacognition` |
| **Assessment** | Metacognitive Awareness Inventory (MAI), Schraw & Dennison |
| **Score Range** | 0.0 (Low Metacognitive Awareness) - 1.0 (High Metacognitive Awareness) |

**Facets:**
| Facet | Description | Text Indicators |
|-------|-------------|-----------------|
| Knowledge of Cognition | Awareness of own thinking | "I tend to think...", self-reflection |
| Regulation of Cognition | Managing own thinking | "Let me reconsider", "I should check" |
| Monitoring | Tracking comprehension | "I'm not sure I understand", comprehension checks |
| Evaluation | Assessing strategies | "That approach worked because...", strategy assessment |

**Linguistic Markers:**
```yaml
high_metacognition:
  vocabulary:
    - Self-reflection words (think, believe, realize, notice)
    - Uncertainty acknowledgment (I think, I believe, it seems)
    - Strategy language (approach, method, way to)
    - Evaluation words (worked, effective, better)
  syntax:
    - Meta-comments ("Let me think about this...")
    - Self-correction patterns
    - Explicit reasoning ("My reasoning is...")
    - Process description ("First I considered... then I...")
  LIWC_categories:
    - insight: elevated
    - tentative: elevated
    - i (first-person): elevated (self-reference)

low_metacognition:
  vocabulary:
    - Declarative statements without reflection
    - Absent self-monitoring language
    - Few process descriptions
```

---

#### Domain 32: Executive Functions

| Attribute | Value |
|-----------|-------|
| **ID** | `executive_functions` |
| **Assessment** | Behavior Rating Inventory of Executive Function (BRIEF), Wisconsin Card Sorting Test |
| **Score Range** | 0.0 (Lower Executive Control) - 1.0 (Higher Executive Control) |

**Facets (Miyake Model):**
| Facet | Description | Text Indicators |
|-------|-------------|-----------------|
| Inhibition | Stopping automatic responses | "Wait", "Let me stop and think", restraint language |
| Shifting | Cognitive flexibility | Topic transitions, perspective changes |
| Updating | Working memory refresh | Building on previous information, refinements |
| Planning | Goal-directed preparation | "First... then...", step sequences |
| Organization | Structuring information | Lists, categories, systematic approaches |

**Linguistic Markers:**
```yaml
high_executive_function:
  vocabulary:
    - Planning words (plan, prepare, organize, schedule)
    - Inhibition words (wait, stop, hold on, let me think)
    - Shifting markers (however, on the other hand, alternatively)
    - Organization words (first, second, finally, in summary)
  syntax:
    - Structured discourse (numbered points, clear sections)
    - Topic management (smooth transitions)
    - Goal-oriented language
    - Self-regulation markers
  LIWC_categories:
    - discrepancy: elevated (should/could language)
    - cogproc: elevated
    - time: elevated (temporal organization)

low_executive_function:
  vocabulary:
    - Impulsive markers (immediately, right now, can't wait)
    - Disorganization signals (anyway, whatever, I forgot)
  syntax:
    - Topic jumping
    - Incomplete thoughts
    - Lack of structure
```

---

### CATEGORY G: SOCIAL/CULTURAL/VALUES (Domains 33-37)

---

#### Domain 33: Social Cognition

| Attribute | Value |
|-----------|-------|
| **ID** | `social_cognition` |
| **Assessment** | Reading the Mind in the Eyes Test (RMET), Social Attribution Test |
| **Score Range** | 0.0 (Low Social Awareness) - 1.0 (High Social Awareness) |

**Facets:**
| Facet | Description | Text Indicators |
|-------|-------------|-----------------|
| Theory of Mind | Understanding others' mental states | "They must be thinking...", perspective-taking |
| Social Perception | Reading social cues | References to social dynamics, relationship awareness |
| Social Knowledge | Understanding social rules | Norm references, social appropriateness |
| Attribution | Explaining behavior | "Because they felt...", motivational reasoning |

**Linguistic Markers:**
```yaml
high_social_cognition:
  vocabulary:
    - Mental state verbs (think, feel, believe, want, know)
    - Relationship words (friend, colleague, relationship)
    - Social role references (as a friend, in my role as)
    - Perspective markers (from their view, in their shoes)
  syntax:
    - Perspective-taking statements
    - Social explanations
    - Relationship context provided
    - Emotional attribution to others
  LIWC_categories:
    - social: elevated
    - cogproc: elevated
    - you/they: elevated (other-focus)

low_social_cognition:
  vocabulary:
    - Self-focused language
    - Limited social references
    - Few mental state attributions
  syntax:
    - Absent perspective-taking
    - Limited social context
```

---

#### Domain 34: Political Ideology

| Attribute | Value |
|-----------|-------|
| **ID** | `political_ideology` |
| **Assessment** | Moral Foundations Questionnaire (MFQ), Political Compass |
| **Score Range** | 0.0 (Conservative) - 1.0 (Liberal) - or multidimensional |

**Moral Foundations (Haidt):**
| Foundation | Conservative Emphasis | Liberal Emphasis |
|------------|----------------------|------------------|
| Care/Harm | Moderate | High |
| Fairness/Cheating | Proportionality | Equality |
| Loyalty/Betrayal | High | Lower |
| Authority/Subversion | High | Lower |
| Sanctity/Degradation | High | Lower |
| Liberty/Oppression | Group liberty | Individual liberty |

**Linguistic Markers:**
```yaml
conservative_ideology:
  vocabulary:
    - Tradition words (heritage, custom, traditional, family values)
    - Authority words (respect, order, discipline, duty)
    - In-group loyalty (our country, our people, patriot)
    - Sanctity language (pure, sacred, wholesome)
  LIWC_categories:
    - authority_subversion: elevated
    - loyalty_betrayal: elevated
    - sanctity_degradation: elevated

liberal_ideology:
  vocabulary:
    - Equality words (equal, fair, rights, justice)
    - Care words (compassion, empathy, help, suffering)
    - Diversity language (inclusive, diverse, different perspectives)
    - Change words (progress, reform, evolve)
  LIWC_categories:
    - care_harm: elevated
    - fairness_cheating: elevated
```

---

#### Domain 35: Cultural Values

| Attribute | Value |
|-----------|-------|
| **ID** | `cultural_values` |
| **Assessment** | Hofstede's Cultural Dimensions, World Values Survey |
| **Score Range** | Multiple dimensions: individualism-collectivism, power distance, etc. |

**Dimensions (Hofstede):**
| Dimension | Low Score | High Score |
|-----------|-----------|------------|
| Individualism-Collectivism | Collectivist (we-focused) | Individualist (I-focused) |
| Power Distance | Egalitarian | Hierarchical |
| Uncertainty Avoidance | Risk-tolerant | Rule-following |
| Masculinity-Femininity | Cooperation-focused | Achievement-focused |
| Long-term Orientation | Traditional | Pragmatic |

**Linguistic Markers:**
```yaml
individualist:
  vocabulary:
    - I/me/my pronouns dominant
    - Achievement language (my success, personal goals)
    - Independence words (self-reliant, individual, unique)
  LIWC_categories:
    - i: elevated
    - achieve: elevated

collectivist:
  vocabulary:
    - We/us/our pronouns dominant
    - Group references (family, community, team)
    - Harmony language (together, cooperation, group)
  LIWC_categories:
    - we: elevated
    - affiliation: elevated
    - family: elevated

high_power_distance:
  - Title/role references
  - Deference language
  - Hierarchy acknowledgment

low_power_distance:
  - First-name usage
  - Egalitarian language
  - Challenge to authority
```

---

#### Domain 36: Moral Reasoning

| Attribute | Value |
|-----------|-------|
| **ID** | `moral_reasoning` |
| **Assessment** | Defining Issues Test (DIT-2), Moral Foundations Questionnaire |
| **Score Range** | 0.0 (Low Moral Engagement) - 1.0 (High Moral Engagement) |

**Moral Foundations (Haidt):**
| Foundation | Description | Text Indicators |
|------------|-------------|-----------------|
| Care/Harm | Concern for suffering | "That's harmful", "We should protect" |
| Fairness/Cheating | Justice and reciprocity | "That's not fair", "Everyone deserves" |
| Loyalty/Betrayal | Group allegiance | "Betrayal", "Standing by your people" |
| Authority/Subversion | Respect for hierarchy | "Disrespectful", "Proper authority" |
| Sanctity/Degradation | Purity concerns | "Disgusting", "Sacred", "Pure" |

**Kohlberg Stages:**
| Level | Stage | Text Indicators |
|-------|-------|-----------------|
| Pre-conventional | Punishment/Reward | "I'll get in trouble", "What's in it for me" |
| Conventional | Social norms | "Everyone does it", "It's the rule" |
| Post-conventional | Principles | "In principle", "Universal rights" |

**Linguistic Markers:**
```yaml
high_moral_reasoning:
  vocabulary:
    - Moral vocabulary (right, wrong, should, ought)
    - Foundation-specific terms (fair, caring, loyal, respectful, pure)
    - Principle language (justice, rights, duty)
  syntax:
    - Moral justifications ("Because it's right to...")
    - Ethical reasoning ("We have a duty to...")
    - Value-based arguments
  LIWC_categories:
    - care_harm: present
    - fairness_cheating: present
    - moral_words: elevated

low_moral_reasoning:
  vocabulary:
    - Amoral language
    - Self-interest focus
    - Few moral references
```

---

#### Domain 37: Work & Career Style

| Attribute | Value |
|-----------|-------|
| **ID** | `work_career_style` |
| **Assessment** | Strong Interest Inventory, Career Anchors (Schein) |
| **Score Range** | Categorical or continuous dimensions |

**Career Anchors (Schein):**
| Anchor | Description | Text Indicators |
|--------|-------------|-----------------|
| Technical/Functional | Expertise-focused | Technical detail, skill references |
| Managerial | Leadership-focused | Team, management, strategy language |
| Autonomy | Independence-focused | Freedom, flexibility, own pace |
| Security | Stability-focused | Stable, secure, reliable |
| Entrepreneurial | Creation-focused | Build, create, own business |
| Service | Helping-focused | Help others, make a difference |
| Challenge | Competition-focused | Challenge, compete, win |
| Lifestyle | Work-life balance | Balance, family, personal time |

**Linguistic Markers:**
```yaml
achievement_oriented:
  vocabulary:
    - Achievement words (succeed, accomplish, win, goal)
    - Competition language (compete, best, outperform)
    - Ambition markers (aspire, aim, strive)
  LIWC_categories:
    - achieve: elevated
    - power: elevated
    - work: elevated

service_oriented:
  vocabulary:
    - Helping words (help, support, serve, assist)
    - Impact language (difference, contribute, meaningful)
    - Others-focus
  LIWC_categories:
    - affiliation: elevated
    - social: elevated

autonomy_oriented:
  vocabulary:
    - Independence words (freedom, flexible, own way)
    - Self-direction language
    - Control references (my choice, I decide)
```

---

### CATEGORY H: SENSORY/AESTHETIC (Domains 38-39)

---

#### Domain 38: Sensory Processing

| Attribute | Value |
|-----------|-------|
| **ID** | `sensory_processing` |
| **Assessment** | Sensory Profile (Dunn), Highly Sensitive Person Scale (HSP) |
| **Score Range** | 0.0 (Low Sensitivity) - 1.0 (High Sensitivity) |

**Sensory Modalities:**
| Modality | Description | Text Indicators |
|----------|-------------|-----------------|
| Visual | Sight processing | Color, light, visual detail references |
| Auditory | Sound processing | Sound, noise, music references |
| Kinesthetic | Touch/movement | Texture, movement, physical sensation |
| Olfactory | Smell processing | Scent, smell references |
| Gustatory | Taste processing | Taste, flavor references |

**Sensitivity Patterns:**
| Pattern | Description | Text Indicators |
|---------|-------------|-----------------|
| Sensory Seeking | Craves stimulation | "I love intense", "More exciting" |
| Sensory Avoiding | Avoids stimulation | "Too loud", "Overwhelming" |
| Sensory Sensitivity | Heightened awareness | Detailed sensory descriptions |
| Low Registration | Misses sensory input | Limited sensory references |

**Linguistic Markers:**
```yaml
high_sensory_sensitivity:
  vocabulary:
    - Rich sensory words (vivid, bright, loud, soft, smooth)
    - Intensity modifiers (very, extremely, overwhelmingly)
    - Specific sensory details
  syntax:
    - Detailed sensory descriptions
    - Environment references
    - Sensory metaphors
  LIWC_categories:
    - percept: elevated (see, hear, feel)

low_sensory_sensitivity:
  vocabulary:
    - Generic descriptions
    - Few sensory details
    - Abstract over concrete
```

---

#### Domain 39: Aesthetic Preferences

| Attribute | Value |
|-----------|-------|
| **ID** | `aesthetic_preferences` |
| **Assessment** | Aesthetic Fluency Scale, Art Preference Assessment |
| **Score Range** | 0.0 (Low Aesthetic Engagement) - 1.0 (High Aesthetic Engagement) |

**Aesthetic Dimensions:**
| Dimension | Description | Text Indicators |
|-----------|-------------|-----------------|
| Complexity | Simple vs complex preferences | "Intricate", "Simple and clean" |
| Novelty | Familiar vs novel | "Something new", "Classic" |
| Harmony | Order vs tension | "Balanced", "Edgy" |
| Emotional Resonance | Cognitive vs affective response | "Moved me", "Intellectually interesting" |

**Berlyne's Aesthetic Properties:**
| Property | Low Score | High Score |
|----------|-----------|------------|
| Complexity | Simple, minimal | Complex, intricate |
| Novelty | Familiar, traditional | Novel, unusual |
| Uncertainty | Predictable | Surprising |
| Conflict | Harmonious | Tension-creating |

**Linguistic Markers:**
```yaml
high_aesthetic_engagement:
  vocabulary:
    - Beauty words (beautiful, elegant, stunning, gorgeous)
    - Art terminology (composition, form, style, design)
    - Appreciation language (appreciate, admire, moved by)
    - Sensory aesthetic words (vivid, striking, harmonious)
  syntax:
    - Aesthetic judgments ("I find it beautiful because...")
    - Detailed appreciation
    - Emotional responses to beauty
  LIWC_categories:
    - percept: elevated
    - posemo: elevated (positive aesthetic response)
    - insight: elevated (aesthetic analysis)

low_aesthetic_engagement:
  vocabulary:
    - Functional language (works, useful, practical)
    - Few aesthetic judgments
    - Utility-focused
```

---

## 1.2 SDV Synthesizer Configuration

### GaussianCopulaSynthesizer (Recommended for Psychometric Data)

```python
from sdv.single_table import GaussianCopulaSynthesizer
from sdv.metadata import SingleTableMetadata

# Load seed data from real datasets
seed_data = load_pandora_dataset()  # ~10,000 labeled samples

# Define metadata
metadata = SingleTableMetadata()
metadata.detect_from_dataframe(seed_data)

# Configure synthesizer
synthesizer = GaussianCopulaSynthesizer(
    metadata,
    enforce_min_max_values=True,
    enforce_rounding=False,
    numerical_distributions={
        'score': 'truncated_gaussian',
        'word_count': 'gamma'
    }
)

# Add domain-specific constraints
from sdv.constraints import ScalarInequality, FixedCombinations

synthesizer.add_constraints([
    # High neuroticism correlates with high negative emotion words
    ScalarInequality(
        column='negemo_count',
        relation='>=',
        value=3,
        condition={'domain_id': 'big_five_neuroticism', 'score': {'>=': 0.7}}
    ),
    # Valid domain-facet combinations
    FixedCombinations(column_names=['domain_id', 'facets'])
])

# Train on seed data
synthesizer.fit(seed_data)

# Generate synthetic training data
synthetic_data = synthesizer.sample(num_rows=50000)
```

### CTGAN for Complex Distributions

```python
from sdv.single_table import CTGANSynthesizer

# Use CTGAN for rare trait combinations
ctgan = CTGANSynthesizer(
    metadata,
    epochs=500,
    batch_size=500,
    generator_dim=(256, 256),
    discriminator_dim=(256, 256)
)

ctgan.fit(seed_data)
rare_combinations = ctgan.sample(num_rows=10000)
```

---

## 1.3 Text Generation Pipeline

### Generating Synthetic Text Samples

After generating structured trait data with SDV, we need corresponding text samples. We use a combination of:

1. **Template-Based Generation**: Fill templates with domain-specific vocabulary
2. **LLM-Assisted Generation**: Use a larger model to generate realistic text given trait constraints
3. **Augmentation**: Paraphrase real samples while preserving trait labels

```python
def generate_training_text(trait_profile: dict) -> str:
    """
    Generate synthetic text that exhibits the given trait profile.

    Args:
        trait_profile: {
            'domain_id': 'big_five_extraversion',
            'score': 0.85,
            'facets': ['warmth', 'gregariousness', 'positive_emotions']
        }
    """

    # Get linguistic markers for this domain and score
    markers = get_linguistic_markers(
        domain=trait_profile['domain_id'],
        score=trait_profile['score'],
        facets=trait_profile['facets']
    )

    # Generate text using template + vocabulary sampling
    text = generate_from_markers(markers)

    # Validate: run through analyzer to confirm trait detection
    detected = analyze_text(text)
    if abs(detected['score'] - trait_profile['score']) > 0.2:
        # Regenerate if detection doesn't match
        return generate_training_text(trait_profile)

    return text

# Example output for high extraversion
# "I absolutely LOVE meeting new people! Yesterday I organized a surprise
#  party for my coworker and invited the whole team. It was exhausting but
#  so worth it! Who wants to grab coffee later? 😊"
```

### Quality Validation

```python
from sdv.evaluation.single_table import run_diagnostic, evaluate_quality

# Run diagnostic checks
diagnostic = run_diagnostic(
    real_data=seed_data,
    synthetic_data=synthetic_data,
    metadata=metadata
)

# Evaluate quality
quality_report = evaluate_quality(
    real_data=seed_data,
    synthetic_data=synthetic_data,
    metadata=metadata
)

print(quality_report.get_score())  # Target: > 0.85
```

**Sources:**
- [SDV Documentation](https://docs.sdv.dev/sdv/)
- [SDV GitHub](https://github.com/sdv-dev/SDV)
- [DataCebo SDV Introduction](https://datacebo.com/blog/intro-to-sdv/)
- [SDV Tutorials](https://docs.sdv.dev/sdv/tutorials)

---

## 2. Model Selection Recommendation

### Primary Recommendation: **Gemma 3 270M** (Browser-First)

| Model | Parameters | Size (INT4) | Memory | Use Case |
|-------|------------|-------------|--------|----------|
| **Gemma 3 270M** | 270M | ~125MB | <300MB | **Primary: Browser/WebGPU deployment** |
| **Gemma 3 1B** | 1B | ~500MB | ~1GB | **Premium: Higher accuracy, still browser-compatible** |
| Gemma 3 4B-IT | 4B | ~2GB | ~4GB | Server-side only |
| Gemma 3 12B | 12B | ~6GB | ~12GB | Research/server-side only |
| Gemma 3 27B | 27B | ~14GB | ~24GB | Maximum accuracy, server-only |

### Why Gemma 3 270M as Primary?

1. **Browser-Native**: Runs entirely in Chrome/Edge with WebGPU—no backend server required
2. **Ultra-Compact**: Only 125MB quantized (INT4), loads in seconds
3. **Over-Trained**: Trained on 6 trillion tokens (vs 2T for 1B), maximizing quality per parameter
4. **Quantization-Aware Training (QAT)**: INT4/Q8 have negligible quality loss vs FP16
5. **256k Vocabulary**: Large vocabulary handles domain-specific psychological terminology
6. **Power Efficient**: 0.75% battery for 25 conversations (Pixel 9 Pro benchmark)
7. **Privacy-First**: All inference happens client-side, no data leaves the device

### Architecture Details (270M)

```
Total Parameters: 270M
├── Embedding Parameters: 170M (256k vocabulary)
└── Transformer Blocks: 100M

Quantization Options:
├── INT4: 77% size reduction, ~125MB
├── Q8: 55% size reduction, ~200MB
└── FP16: Full precision, ~540MB
```

### Premium Option: Gemma 3 1B

For users who want higher accuracy and have capable devices:
- ~4x more transformer parameters than 270M
- Better multi-domain classification in single inference
- Still browser-compatible with WebGPU
- ~500MB quantized (INT4)

### Deployment Frameworks

| Framework | Platform | Integration |
|-----------|----------|-------------|
| **MediaPipe LLM** | Browser/Mobile | WebGPU, LiteRT conversion |
| **Transformers.js** | Browser | ONNX conversion, @xenova/transformers |
| **Ollama** | Desktop | GGUF format, local API |

**Sources:**
- [Google Introduces Gemma 3 270M](https://developers.googleblog.com/en/introducing-gemma-3-270m/)
- [Fine-Tune Gemma 3 270M On-Device](https://developers.googleblog.com/own-your-ai-fine-tune-gemma-3-270m-for-on-device/)
- [Gemma 3 270M on HuggingFace](https://huggingface.co/google/gemma-3-270m)
- [Gemma 3 270M Tutorial - DataCamp](https://www.datacamp.com/tutorial/gemma-3-270m)

---

## 3. Structured Output Schema

### JSON Response Format

```json
{
  "text_analyzed": "string",
  "word_count": 0,
  "analysis_timestamp": "ISO-8601",
  "domains": {
    "big_five_openness": {
      "score": 0.75,
      "confidence": 0.85,
      "evidence": [
        {
          "text_span": "I love exploring new ideas",
          "indicator": "novelty_seeking",
          "weight": 0.8
        }
      ],
      "detected_markers": ["insight_words", "creativity_language"],
      "reasoning": "High use of exploration and novelty language indicates elevated openness"
    },
    "big_five_conscientiousness": {
      "score": 0.62,
      "confidence": 0.70,
      "evidence": [...],
      "detected_markers": [...],
      "reasoning": "..."
    }
    // ... all 26 domains
  },
  "meta": {
    "model_version": "gemma-3-4b-psychometrics-v1",
    "inference_time_ms": 245,
    "context_window_used": 512
  }
}
```

### Response Schema Definition

```typescript
interface PsychometricAnalysis {
  text_analyzed: string;
  word_count: number;
  analysis_timestamp: string;

  domains: {
    [domainId: string]: DomainScore;
  };

  meta: {
    model_version: string;
    inference_time_ms: number;
    context_window_used: number;
  };
}

interface DomainScore {
  score: number;           // 0.0 - 1.0
  confidence: number;      // 0.0 - 1.0
  evidence: Evidence[];
  detected_markers: string[];
  reasoning: string;
}

interface Evidence {
  text_span: string;       // Exact text that triggered detection
  indicator: string;       // Which marker was detected
  weight: number;          // How strongly it influenced score
}
```

---

## 4. Training Data Requirements

### Data Sources

#### Primary: Validated Psychometric Datasets

1. **PANDORA Reddit Dataset** (1M+ posts)
   - Big Five personality labels from self-reports
   - Validated correlations with LIWC features
   - Source: [JMIR Research 2025](https://www.jmir.org/2025/1/e75347)

2. **Essays Dataset** (2,468 essays)
   - Big Five labels from gold-standard assessments
   - Widely used in personality NLP research

3. **MyPersonality Dataset** (Facebook)
   - 250+ features per user
   - Big Five scores from validated tests

#### Secondary: Synthetic Generation

For domains without large datasets, generate training examples:

```
Prompt Template for Synthetic Data:
"Generate a realistic conversational message from someone who scores [HIGH/MEDIUM/LOW] on [DOMAIN].
The message should be about [TOPIC] and demonstrate [SPECIFIC_MARKERS].
Do not explicitly mention the trait - show it through language patterns."
```

### Training Data Format

```json
{
  "id": "train_001",
  "text": "I can't wait to try that new restaurant! Let's invite Sarah and Mike too - it's always more fun with friends.",
  "labels": {
    "big_five_openness": 0.72,
    "big_five_extraversion": 0.88,
    "big_five_agreeableness": 0.81,
    "big_five_conscientiousness": 0.55,
    "big_five_neuroticism": 0.25
  },
  "annotations": {
    "evidence_spans": [
      {"span": "can't wait", "domain": "big_five_extraversion", "marker": "positive_emotion"},
      {"span": "invite Sarah and Mike", "domain": "big_five_extraversion", "marker": "social_words"},
      {"span": "more fun with friends", "domain": "big_five_agreeableness", "marker": "affiliation"}
    ]
  },
  "source": "pandora_reddit",
  "confidence": 0.85
}
```

### Minimum Training Requirements

| Domain Category | Minimum Examples | Recommended |
|-----------------|------------------|-------------|
| Big Five (each) | 10,000 | 50,000 |
| Cognitive | 5,000 | 20,000 |
| Emotional | 5,000 | 20,000 |
| Values | 3,000 | 15,000 |
| Behavioral | 3,000 | 15,000 |
| Other domains | 1,000 | 10,000 |

---

## 5. Fine-Tuning Approach

### Method: LoRA (Low-Rank Adaptation)

Based on recent research ([ACL 2025](https://aclanthology.org/2025.acl-long.999.pdf)), LoRA fine-tuning is the most effective method for personality trait induction:

```python
# LoRA Configuration
lora_config = LoraConfig(
    r=64,                    # Rank (validated for personality tasks)
    lora_alpha=128,          # Scaling factor
    target_modules=[         # Apply to attention AND MLP layers
        "q_proj", "k_proj", "v_proj", "o_proj",
        "gate_proj", "up_proj", "down_proj"
    ],
    lora_dropout=0.05,
    bias="none",
    task_type="CAUSAL_LM"
)
```

### Training Configuration

```python
training_args = TrainingArguments(
    output_dir="./gemma3-psychometrics",
    num_train_epochs=3,
    per_device_train_batch_size=4,
    gradient_accumulation_steps=4,
    learning_rate=2e-4,
    warmup_ratio=0.1,
    lr_scheduler_type="cosine",
    logging_steps=10,
    eval_strategy="steps",
    eval_steps=100,
    save_steps=500,
    bf16=True,
    optim="adamw_8bit",
    max_grad_norm=0.3,
)
```

### Fine-Tuning Tools

**Recommended: Unsloth**
- 1.6x faster fine-tuning
- 60% less VRAM
- Works on free Colab T4 GPUs
- Native Gemma 3 support

```bash
pip install unsloth
```

**Alternative: NVIDIA NeMo**
- Enterprise-grade
- Better for multi-GPU setups
- Comprehensive experiment tracking

**Sources:**
- [Unsloth Gemma 3 Guide](https://unsloth.ai/blog/gemma3)
- [NeMo AutoModel Gemma 3](https://docs.nvidia.com/nemo/automodel/latest/guides/omni/gemma3-3n.html)
- [DataCamp Fine-Tuning Tutorial](https://www.datacamp.com/tutorial/fine-tune-gemma-3)

---

## 6. Prompt Engineering

### System Prompt

```
You are a psychometric analysis system. Analyze the provided text and output a structured JSON assessment of psychological traits across 26 domains.

For each domain:
1. Identify specific text evidence that indicates trait levels
2. Consider context and negation (e.g., "I'm NOT anxious" should not indicate high anxiety)
3. Assess confidence based on evidence strength and quantity
4. Provide brief reasoning for your assessment

Output ONLY valid JSON matching the specified schema. Do not include explanatory text outside the JSON.
```

### Few-Shot Examples

**Example 1: High Extraversion + High Agreeableness**

```
User: Analyze this text: "I absolutely love meeting new people! Yesterday I organized a surprise party for my coworker and invited the whole team. It was exhausting but so worth it!"
Assistant: ```json
{
  "analysisId": "example-001",
  "timestamp": "2024-01-15T10:30:00Z",
  "textAnalyzed": "I absolutely love meeting new people! Yesterday I organized a surprise party for my coworker and invited the whole team. It was exhausting but so worth it!",
  "domains": {
    "extraversion": {
      "score": 0.92,
      "confidence": 0.95,
      "evidence": [
        "love meeting new people",
        "organized a surprise party",
        "invited the whole team"
      ],
      "reasoning": "Strong indicators of social energy, initiative in group activities, and enthusiasm for interpersonal engagement"
    },
    "agreeableness": {
      "score": 0.85,
      "confidence": 0.88,
      "evidence": [
        "surprise party for my coworker",
        "so worth it"
      ],
      "reasoning": "Demonstrates care for others through thoughtful actions and satisfaction from making others happy"
    },
    "conscientiousness": {
      "score": 0.75,
      "confidence": 0.70,
      "evidence": [
        "organized a surprise party"
      ],
      "reasoning": "Planning and organizing an event suggests conscientiousness, though limited evidence"
    },
    "neuroticism": {
      "score": 0.25,
      "confidence": 0.65,
      "evidence": [
        "exhausting but so worth it"
      ],
      "reasoning": "Acknowledges effort but maintains positive framing, suggesting emotional stability"
    },
    "openness": {
      "score": 0.60,
      "confidence": 0.50,
      "evidence": [],
      "reasoning": "Insufficient evidence to assess openness from this text"
    }
  },
  "overallConfidence": 0.78,
  "flags": []
}
```

**Example 2: Negation Handling**

```
User: Analyze this text: "I am NOT the type of person who worries constantly. Sure, I used to have anxiety, but I have worked through it and now I feel calm most of the time."
```

```
Assistant: ```json
{
  "analysisId": "example-002",
  "timestamp": "2024-01-15T10:35:00Z",
  "textAnalyzed": "I am NOT the type of person who worries constantly. Sure, I used to have anxiety, but I have worked through it and now I feel calm most of the time.",
  "domains": {
    "neuroticism": {
      "score": 0.30,
      "confidence": 0.82,
      "evidence": [
        "NOT the type of person who worries constantly",
        "worked through it",
        "feel calm most of the time"
      ],
      "reasoning": "Explicit negation of anxiety traits, combined with statements of current emotional stability. Past anxiety acknowledged but framed as resolved."
    },
    "conscientiousness": {
      "score": 0.70,
      "confidence": 0.65,
      "evidence": [
        "worked through it"
      ],
      "reasoning": "Self-improvement and working through challenges suggests goal-directed behavior"
    },
    "openness": {
      "score": 0.55,
      "confidence": 0.45,
      "evidence": [],
      "reasoning": "Insufficient direct evidence for openness assessment"
    }
  },
  "overallConfidence": 0.72,
  "flags": ["negation_detected"]
}
```

**Example 3: Low Confidence / Insufficient Evidence**

```
User: Analyze this text: "The weather is nice today."
```

```
Assistant: ```json
{
  "analysisId": "example-003",
  "timestamp": "2024-01-15T10:40:00Z",
  "textAnalyzed": "The weather is nice today.",
  "domains": {},
  "overallConfidence": 0.10,
  "flags": ["insufficient_text", "no_psychological_indicators"]
}
```

---

## 7. Evaluation Metrics

### Primary Metrics

| Metric | Target | Description |
|--------|--------|-------------|
| **Domain Accuracy** | >85% | Correct identification of present domains |
| **Score MAE** | <0.15 | Mean Absolute Error on trait scores vs. ground truth |
| **Confidence Calibration** | ECE <0.10 | Expected Calibration Error - confidence should match accuracy |
| **Negation F1** | >0.90 | Correct handling of negated statements |
| **JSON Validity** | 100% | All outputs must be valid JSON |

### Domain-Specific Evaluation

```typescript
interface EvaluationResult {
  domain: string;
  metrics: {
    precision: number;      // True positives / (True positives + False positives)
    recall: number;         // True positives / (True positives + False negatives)
    f1Score: number;        // Harmonic mean of precision and recall
    scoreCorrelation: number; // Pearson correlation with ground truth scores
    confidenceCalibration: number; // How well confidence predicts accuracy
  };
}
```

### Test Dataset Requirements

1. **Held-out Test Set**: 10% of labeled data never seen during training
2. **Adversarial Examples**: 
   - Negation-heavy texts
   - Sarcasm and irony
   - Mixed-signal texts
   - Very short texts (<20 words)
3. **Cross-domain Examples**: Texts from different contexts (social media, journals, interviews)

### Evaluation Pipeline

```python
def evaluate_model(model, test_dataset):
    results = {
        "domain_metrics": {},
        "overall_metrics": {},
        "error_analysis": []
    }
    
    for example in test_dataset:
        prediction = model.generate(example.text)
        
        # Validate JSON structure
        if not is_valid_json(prediction):
            results["error_analysis"].append({
                "type": "invalid_json",
                "text": example.text,
                "output": prediction
            })
            continue
        
        # Compare predictions to ground truth
        for domain in ALL_DOMAINS:
            pred_score = prediction.domains.get(domain, {}).get("score", None)
            true_score = example.labels.get(domain, None)
            
            if pred_score is not None and true_score is not None:
                results["domain_metrics"][domain].append({
                    "predicted": pred_score,
                    "actual": true_score,
                    "confidence": prediction.domains[domain]["confidence"]
                })
    
    # Calculate aggregate metrics
    for domain, data in results["domain_metrics"].items():
        results["domain_metrics"][domain] = {
            "mae": mean_absolute_error(data),
            "correlation": pearson_correlation(data),
            "calibration": expected_calibration_error(data)
        }
    
    return results
```

---

## 8. Deployment Strategy

### Phase 1: Development & Testing (Weeks 1-4)

1. **Environment Setup**
   - Configure training infrastructure (Google Colab Pro+ or local GPU)
   - Set up experiment tracking (Weights & Biases or MLflow)
   - Prepare data processing pipelines

2. **Data Preparation**
   - Download and preprocess PANDORA dataset
   - Create train/validation/test splits (80/10/10)
   - Generate synthetic examples for rare domains
   - Convert all data to instruction-tuning format

3. **Initial Fine-Tuning**
   - Start with Gemma 3 4B-IT base model
   - Train with LoRA (rank-64, alpha-128)
   - Monitor loss curves and validation metrics

### Phase 2: Optimization (Weeks 5-6)

1. **Hyperparameter Tuning**
   - Learning rate sweep: [1e-5, 2e-5, 5e-5]
   - LoRA rank comparison: [32, 64, 128]
   - Batch size optimization for available VRAM

2. **Prompt Engineering Refinement**
   - Test variations of system prompts
   - Optimize few-shot example selection
   - A/B test different output formats

3. **Error Analysis**
   - Identify systematic failure modes
   - Create targeted training data for weak domains
   - Implement domain-specific post-processing

### Phase 3: Quantization & Export (Week 7)

1. **Model Quantization**
   ```python
   # 4-bit quantization for browser deployment
   from transformers import BitsAndBytesConfig
   
   quantization_config = BitsAndBytesConfig(
       load_in_4bit=True,
       bnb_4bit_compute_dtype=torch.float16,
       bnb_4bit_use_double_quant=True,
       bnb_4bit_quant_type="nf4"
   )
   ```

2. **Export Formats**
   - GGUF format for llama.cpp / Ollama
   - ONNX for cross-platform deployment
   - TensorFlow.js for browser inference

3. **Performance Benchmarking**
   - Measure inference latency
   - Compare accuracy vs. full precision
   - Memory footprint analysis

### Phase 4: Integration (Week 8)

1. **API Development**
   - REST endpoint for model inference
   - Batch processing support
   - Rate limiting and authentication

2. **Client Integration**
   - TypeScript SDK for frontend
   - Real-time streaming responses
   - Error handling and retries

---

## 9. Integration Plan

### Hybrid Architecture

The fine-tuned Gemma model will work alongside the existing LIWC-based system:

```
                    ┌─────────────────┐
                    │   User Input    │
                    │   (Text)        │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │  Text Router    │
                    │  (Length/Type)  │
                    └────────┬────────┘
                             │
           ┌─────────────────┼─────────────────┐
           │                 │                 │
    ┌──────▼──────┐   ┌──────▼──────┐   ┌──────▼──────┐
    │ Short Text  │   │ Medium Text │   │ Long Text   │
    │ (<50 words) │   │ (50-500)    │   │ (>500)      │
    └──────┬──────┘   └──────┬──────┘   └──────┬──────┘
           │                 │                 │
    ┌──────▼──────┐   ┌──────▼──────┐   ┌──────▼──────┐
    │ LIWC Only   │   │ Gemma 3     │   │ Chunked     │
    │ (Fast)      │   │ Full Model  │   │ Analysis    │
    └──────┬──────┘   └──────┬──────┘   └──────┬──────┘
           │                 │                 │
           └─────────────────┼─────────────────┘
                             │
                    ┌────────▼────────┐
                    │  Result Merger  │
                    │  & Confidence   │
                    │  Calibration    │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │ Psychological   │
                    │ Profile Output  │
                    └─────────────────┘
```

### Integration Code

```typescript
// src/services/psychometricAnalyzer.ts

import { LIWCAnalyzer } from "./liwcAnalyzer";
import { GemmaAnalyzer } from "./gemmaAnalyzer";
import { PsychologicalProfile, AnalysisResult } from "../types/psychology";

interface AnalyzerConfig {
  shortTextThreshold: number;  // Default: 50 words
  longTextThreshold: number;   // Default: 500 words
  useGemmaForShortText: boolean;
  confidenceThreshold: number; // Minimum confidence to include domain
}

export class HybridPsychometricAnalyzer {
  private liwc: LIWCAnalyzer;
  private gemma: GemmaAnalyzer;
  private config: AnalyzerConfig;

  constructor(config: Partial<AnalyzerConfig> = {}) {
    this.config = {
      shortTextThreshold: 50,
      longTextThreshold: 500,
      useGemmaForShortText: false,
      confidenceThreshold: 0.5,
      ...config
    };
    
    this.liwc = new LIWCAnalyzer();
    this.gemma = new GemmaAnalyzer();
  }

  async analyze(text: string): Promise<PsychologicalProfile> {
    const wordCount = text.split(/\s+/).length;
    
    // Route based on text length
    if (wordCount < this.config.shortTextThreshold) {
      return this.analyzeShortText(text);
    } else if (wordCount > this.config.longTextThreshold) {
      return this.analyzeLongText(text);
    } else {
      return this.analyzeMediumText(text);
    }
  }

  private async analyzeShortText(text: string): Promise<PsychologicalProfile> {
    // Use LIWC for speed, optionally augment with Gemma
    const liwcResult = await this.liwc.analyze(text);
    
    if (this.config.useGemmaForShortText) {
      const gemmaResult = await this.gemma.analyze(text);
      return this.mergeResults(liwcResult, gemmaResult, { preferLIWC: true });
    }
    
    return liwcResult;
  }

  private async analyzeMediumText(text: string): Promise<PsychologicalProfile> {
    // Primary: Gemma analysis with semantic understanding
    // Secondary: LIWC for validation
    const [gemmaResult, liwcResult] = await Promise.all([
      this.gemma.analyze(text),
      this.liwc.analyze(text)
    ]);
    
    return this.mergeResults(gemmaResult, liwcResult, { preferGemma: true });
  }

  private async analyzeLongText(text: string): Promise<PsychologicalProfile> {
    // Chunk the text and analyze each chunk
    const chunks = this.chunkText(text, 400); // ~400 words per chunk
    
    const chunkResults = await Promise.all(
      chunks.map(chunk => this.gemma.analyze(chunk))
    );
    
    // Aggregate chunk results
    return this.aggregateChunkResults(chunkResults);
  }

  private mergeResults(
    primary: AnalysisResult,
    secondary: AnalysisResult,
    options: { preferGemma?: boolean; preferLIWC?: boolean }
  ): PsychologicalProfile {
    const merged: PsychologicalProfile = {
      domains: {},
      overallConfidence: 0,
      analysisMethod: options.preferGemma ? "hybrid-gemma-primary" : "hybrid-liwc-primary"
    };

    // Merge domain scores with weighted averaging
    const allDomains = new Set([
      ...Object.keys(primary.domains),
      ...Object.keys(secondary.domains)
    ]);

    for (const domain of allDomains) {
      const primaryDomain = primary.domains[domain];
      const secondaryDomain = secondary.domains[domain];

      if (primaryDomain && secondaryDomain) {
        // Both systems detected the domain - weighted merge
        const primaryWeight = options.preferGemma ? 0.7 : 0.3;
        const secondaryWeight = 1 - primaryWeight;
        
        merged.domains[domain] = {
          score: primaryDomain.score * primaryWeight + secondaryDomain.score * secondaryWeight,
          confidence: Math.max(primaryDomain.confidence, secondaryDomain.confidence),
          evidence: [...(primaryDomain.evidence || []), ...(secondaryDomain.evidence || [])],
          source: "merged"
        };
      } else if (primaryDomain) {
        merged.domains[domain] = { ...primaryDomain, source: "primary" };
      } else if (secondaryDomain && secondaryDomain.confidence > this.config.confidenceThreshold) {
        merged.domains[domain] = { ...secondaryDomain, source: "secondary" };
      }
    }

    // Calculate overall confidence
    const confidences = Object.values(merged.domains).map(d => d.confidence);
    merged.overallConfidence = confidences.length > 0 
      ? confidences.reduce((a, b) => a + b, 0) / confidences.length 
      : 0;

    return merged;
  }

  private chunkText(text: string, targetWords: number): string[] {
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    const chunks: string[] = [];
    let currentChunk: string[] = [];
    let currentWordCount = 0;

    for (const sentence of sentences) {
      const sentenceWords = sentence.split(/\s+/).length;
      
      if (currentWordCount + sentenceWords > targetWords && currentChunk.length > 0) {
        chunks.push(currentChunk.join(" "));
        currentChunk = [];
        currentWordCount = 0;
      }
      
      currentChunk.push(sentence);
      currentWordCount += sentenceWords;
    }

    if (currentChunk.length > 0) {
      chunks.push(currentChunk.join(" "));
    }

    return chunks;
  }

  private aggregateChunkResults(results: AnalysisResult[]): PsychologicalProfile {
    const aggregated: PsychologicalProfile = {
      domains: {},
      overallConfidence: 0,
      analysisMethod: "chunked-aggregation"
    };

    // Collect all domain scores across chunks
    const domainScores: Record<string, { scores: number[]; confidences: number[]; evidence: string[] }> = {};

    for (const result of results) {
      for (const [domain, data] of Object.entries(result.domains)) {
        if (!domainScores[domain]) {
          domainScores[domain] = { scores: [], confidences: [], evidence: [] };
        }
        domainScores[domain].scores.push(data.score);
        domainScores[domain].confidences.push(data.confidence);
        domainScores[domain].evidence.push(...(data.evidence || []));
      }
    }

    // Average scores and combine evidence
    for (const [domain, data] of Object.entries(domainScores)) {
      aggregated.domains[domain] = {
        score: data.scores.reduce((a, b) => a + b, 0) / data.scores.length,
        confidence: Math.max(...data.confidences),
        evidence: [...new Set(data.evidence)].slice(0, 5), // Top 5 unique evidence
        source: "aggregated"
      };
    }

    const confidences = Object.values(aggregated.domains).map(d => d.confidence);
    aggregated.overallConfidence = confidences.length > 0
      ? confidences.reduce((a, b) => a + b, 0) / confidences.length
      : 0;

    return aggregated;
  }
}
```

### Gemma Model Wrapper

```typescript
// src/services/gemmaAnalyzer.ts

import { AnalysisResult, DomainResult } from "../types/psychology";

interface GemmaConfig {
  modelPath: string;
  maxTokens: number;
  temperature: number;
}

export class GemmaAnalyzer {
  private model: any; // Type depends on inference runtime
  private systemPrompt: string;

  constructor(config: Partial<GemmaConfig> = {}) {
    this.systemPrompt = `You are a psychometric analysis system. Analyze the provided text and output a structured JSON assessment of psychological traits across 26 domains.

For each domain:
1. Identify specific text evidence that indicates trait levels
2. Consider context and negation (e.g., "I'm NOT anxious" should not indicate high anxiety)
3. Assess confidence based on evidence strength and quantity
4. Provide brief reasoning for your assessment

Output ONLY valid JSON matching the specified schema. Do not include explanatory text outside the JSON.`;
  }

  async analyze(text: string): Promise<AnalysisResult> {
    const prompt = `${this.systemPrompt}\n\nUser: Analyze this text: "${text}"\n\nAssistant:`;
    
    try {
      const response = await this.model.generate(prompt, {
        maxTokens: 2048,
        temperature: 0.1,
        stopSequences: ["\n\nUser:"]
      });
      
      return this.parseResponse(response);
    } catch (error) {
      console.error("Gemma analysis error:", error);
      return {
        domains: {},
        overallConfidence: 0,
        error: error.message
      };
    }
  }

  private parseResponse(response: string): AnalysisResult {
    // Extract JSON from response
    const jsonMatch = response.match(/```json\n?([\s\S]*?)\n?```/) || 
                      response.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      throw new Error("No valid JSON found in response");
    }

    const jsonStr = jsonMatch[1] || jsonMatch[0];
    const parsed = JSON.parse(jsonStr);
    
    // Transform to internal format
    const result: AnalysisResult = {
      domains: {},
      overallConfidence: parsed.overallConfidence || 0
    };

    for (const [domain, data] of Object.entries(parsed.domains || {})) {
      result.domains[domain] = {
        score: (data as any).score,
        confidence: (data as any).confidence,
        evidence: (data as any).evidence || [],
        reasoning: (data as any).reasoning
      };
    }

    return result;
  }
}
```

---

## 10. Browser/WebGPU Deployment

For client-side inference (optional advanced deployment):

### WebGPU Model Loading

```typescript
// src/services/webgpuGemma.ts

import { AutoTokenizer, AutoModelForCausalLM } from "@xenova/transformers";

export class WebGPUGemmaAnalyzer {
  private model: any;
  private tokenizer: any;
  private isLoaded: boolean = false;

  async initialize(): Promise<void> {
    if (this.isLoaded) return;

    // Load quantized model for browser
    this.tokenizer = await AutoTokenizer.from_pretrained(
      "inverse-profiling/gemma-3-4b-psychometric-q4"
    );
    
    this.model = await AutoModelForCausalLM.from_pretrained(
      "inverse-profiling/gemma-3-4b-psychometric-q4",
      {
        device: "webgpu",
        dtype: "q4"
      }
    );

    this.isLoaded = true;
  }

  async analyze(text: string): Promise<AnalysisResult> {
    if (!this.isLoaded) {
      await this.initialize();
    }

    const inputIds = this.tokenizer.encode(
      `<bos><start_of_turn>user\nAnalyze: "${text}"<end_of_turn>\n<start_of_turn>model\n`
    );

    const output = await this.model.generate(inputIds, {
      max_new_tokens: 1024,
      temperature: 0.1,
      do_sample: false
    });

    const response = this.tokenizer.decode(output[0]);
    return this.parseResponse(response);
  }
}
```

### Progressive Loading UI

```typescript
// Component for showing model loading progress
export function ModelLoadingIndicator({ progress }: { progress: number }) {
  return (
    <div className="model-loading">
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>
      <p>Loading psychometric analysis model... {progress.toFixed(0)}%</p>
      <p className="text-sm text-gray-500">
        First load may take 30-60 seconds. Model is cached for future use.
      </p>
    </div>
  );
}
```

---

## 11. Appendix

### A. Complete Domain Reference

| # | Domain | Category | Key Indicators |
|---|--------|----------|----------------|
| 1 | Extraversion | Big Five | Social energy, talkativeness, assertiveness |
| 2 | Agreeableness | Big Five | Cooperation, trust, empathy |
| 3 | Conscientiousness | Big Five | Organization, reliability, discipline |
| 4 | Neuroticism | Big Five | Anxiety, emotional volatility, worry |
| 5 | Openness | Big Five | Creativity, curiosity, unconventionality |
| 6 | Narcissism | Dark Triad | Self-importance, superiority, entitlement |
| 7 | Machiavellianism | Dark Triad | Manipulation, cynicism, strategic thinking |
| 8 | Psychopathy | Dark Triad | Impulsivity, callousness, thrill-seeking |
| 9 | Empathy | Social | Understanding others, emotional attunement |
| 10 | Emotional Intelligence | Social | Self-awareness, regulation, social skills |
| 11 | Attachment Style | Relationship | Security, avoidance, anxiety in relationships |
| 12 | Love Languages | Relationship | Expression and reception of affection |
| 13 | Communication Style | Relationship | Directness, assertiveness, conflict approach |
| 14 | Risk Tolerance | Decision | Comfort with uncertainty, adventurousness |
| 15 | Decision Making Style | Decision | Analytical vs. intuitive, speed |
| 16 | Time Orientation | Decision | Present vs. future focus, planning |
| 17 | Achievement Motivation | Drive | Goal-setting, ambition, persistence |
| 18 | Self-Efficacy | Drive | Confidence in abilities, resilience |
| 19 | Locus of Control | Drive | Internal vs. external attribution |
| 20 | Growth Mindset | Drive | Beliefs about ability development |
| 21 | Values | Core | Priorities, principles, what matters |
| 22 | Interests | Core | Hobbies, passions, curiosities |
| 23 | Life Satisfaction | Wellbeing | Overall happiness, contentment |
| 24 | Stress Coping | Wellbeing | Strategies for handling pressure |
| 25 | Social Support | Wellbeing | Network quality, help-seeking |
| 26 | Authenticity | Identity | Self-congruence, genuine expression |

### B. Training Data Format Example

```jsonl
{"messages": [{"role": "system", "content": "You are a psychometric analysis system..."}, {"role": "user", "content": "Analyze this text: \"I love organizing my desk...\"" }, {"role": "assistant", "content": "{\"domains\": {\"conscientiousness\": {\"score\": 0.85...}}}"}]}
{"messages": [{"role": "system", "content": "You are a psychometric analysis system..."}, {"role": "user", "content": "Analyze this text: \"Why bother planning...\"" }, {"role": "assistant", "content": "{\"domains\": {\"conscientiousness\": {\"score\": 0.25...}}}"}]}
```

### C. Model Card Template

```markdown
# Gemma 3 4B Psychometric Analyzer

## Model Description
Fine-tuned version of Google Gemma 3 4B-IT for psychological trait detection from text.

## Intended Use
- Psychological profiling research
- Digital twin personality modeling
- Self-reflection applications

## Limitations
- Not a diagnostic tool
- May reflect training data biases
- Requires minimum text length for accuracy
- English language only (initial version)

## Training Data
- PANDORA Reddit Dataset (n=10,000 users)
- Essays Dataset (Big Five labeled)
- Synthetic examples for rare domains

## Evaluation Results
| Metric | Value |
|--------|-------|
| Domain Accuracy | 87.3% |
| Score MAE | 0.12 |
| Negation F1 | 0.94 |
| JSON Validity | 100% |

## Ethical Considerations
- Always obtain informed consent before analyzing personal text
- Results should supplement, not replace, professional assessment
- Model outputs are probabilistic estimates, not definitive labels
```

---

## 12. References

1. **Gemma 3 Technical Report** - Google DeepMind
2. **PANDORA Dataset** - Gjurković et al., 2020
3. **LoRA: Low-Rank Adaptation** - Hu et al., 2021
4. **Unsloth Fine-Tuning Library** - https://unsloth.ai
5. **LIWC-22 Manual** - Pennebaker et al., 2022
6. **Big Five Personality Model** - Costa & McCrae, 1992
7. **Dark Triad Measures** - Paulhus & Williams, 2002

---

*Document Version: 1.0*
*Last Updated: January 2024*
*Author: InverseProfiling Team*

