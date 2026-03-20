# Competitor Analysis Dimensions — Detailed Schema

Detailed schema, example outputs, and edge cases for the 8-dimension competitor analysis framework.

## Dimension Schema

Each dimension follows this structure:

| Field | Type | Description |
|-------|------|-------------|
| dimension | string | One of the 8 analysis dimensions |
| competitor_pattern | CompetitorPattern | What was observed in the competitor ad |
| fs_translation | FSTranslation | How to map this to FS brand |
| confidence | number (0–1) | Confidence in the observation |
| evidence | Array\<string\> | Supporting evidence from the image |

### CompetitorPattern

| Field | Type | Description |
|-------|------|-------------|
| observation | string | What the competitor is doing |
| technique | string | The underlying creative technique |
| effectiveness | string | Why it works (or doesn't) |

### FSTranslation

| Field | Type | Description |
|-------|------|-------------|
| adaptation | string | How to translate to FS brand |
| palette_mapping | Array\<{from, to}\> | Color translations (competitor hex → FS hex) |
| constraints | Array\<string\> | FS brand constraints that apply |

---

## Dimension Details

### 1. Layout Architecture

**What to look for:**
- Grid structure: symmetric vs asymmetric, number of columns/panels
- Element zones: where headline, imagery, CTA, logo are placed
- Visual flow: left-to-right, top-to-bottom, Z-pattern, F-pattern
- White space usage and density
- Split-panel or single-panel composition

**Example output:**
```
Competitor Pattern: Split-panel layout (left: before state, right: after state).
  Z-pattern reading flow. Logo top-left, CTA bottom-right.
FS Translation: Adapt split-panel as a growth journey using FS teal (#27E4CD)
  divider. Place FS logo top-right per brand standard. CTA bottom-center
  with yellow (#FFDE0F) button.
```

**Edge cases:**
- Competitor uses a full-bleed photo with text overlay → translate as FS photo with purple (#5203EA) gradient overlay
- Competitor uses collage/multi-panel → simplify to single focal point for Meta feed (per platform rules)

### 2. Visual Metaphor

**What to look for:**
- Core concept being communicated visually (not through text)
- Transformation narratives: small → big, old → new, problem → solution
- Abstract concepts: growth (upward lines), speed (motion blur), trust (handshake, shield)
- Cultural references or symbols

**Example output:**
```
Competitor Pattern: Food cart → food truck transformation = business growth metaphor.
  Uses size progression to show scaling.
FS Translation: Use the growth transformation concept but with FS-relevant imagery
  (e.g., small shop → modern office, or seed → tree). Maintain the aspirational
  quality while keeping FS's empowering tone.
```

**Edge cases:**
- Competitor metaphor involves gambling/lottery imagery → replace entirely with professional alternatives
- Competitor uses culturally specific symbols → adapt to target market context

### 3. Color Psychology

**What to look for:**
- Dominant brand color and coverage percentage
- Accent/highlight colors and their role
- Contrast strategy: high-contrast vs subtle
- Warmth/coolness of overall palette
- Background color approach

**Example output:**
```
Competitor Pattern: Blue (#0055A3) dominant ~60%, white secondary, red accent CTA.
  Cool professional palette. High contrast headline on dark blue.
FS Translation:
  - Blue (#0055A3) → Purple (#5203EA) as dominant brand color
  - White → Light Gray (#F1F1F2) as secondary
  - Red accent → Yellow (#FFDE0F) for CTA and energy
  Maintain the high-contrast approach for headline legibility.
```

**Palette mapping reference:**

| Competitor Color Family | FS Equivalent | Rationale |
|------------------------|---------------|-----------|
| Blue (trust, corporate) | Purple #5203EA | Primary brand, same authority feel |
| Red (urgency, energy) | Yellow #FFDE0F | Energy without aggression |
| Green (growth, money) | Teal #27E4CD | Growth connotation, secondary accent |
| Orange (warmth, action) | Yellow #FFDE0F | Warm energy, CTA emphasis |
| Dark/black (premium) | Purple #5203EA | Premium feel within FS palette |
| White/light (clean) | Light Gray #F1F1F2 | Clean backgrounds |

### 4. Typography Approach

**What to look for:**
- Weight contrast between headline and body
- Type hierarchy: how many levels, size ratios
- Text density: word count per element
- Stylistic choices: all-caps, sentence case, italic, decorative

**Example output:**
```
Competitor Pattern: Bold sans-serif headline (all-caps, ~40pt equivalent),
  light-weight body text (~14pt), 3:1 size ratio. Low text density (5 words headline).
FS Translation: Poppins SemiBold for headline (maintain the bold weight contrast),
  Inter Regular for body. Keep the 3:1 ratio. Sentence case (FS avoids all-caps
  for readability).
```

**Edge cases:**
- Competitor uses decorative/script fonts → always translate to Poppins/Inter
- Competitor uses extreme text density → reduce per FS visual text density guidelines (max 5 words headline)

### 5. Imagery Style

**What to look for:**
- Photography vs illustration vs 3D render vs flat graphic
- Lighting: bright/natural vs dramatic/moody
- Perspective: eye-level, bird's-eye, close-up
- Subject treatment: people, products, abstract shapes
- Realism level

**Example output:**
```
Competitor Pattern: Stylized illustration of business owner with food cart.
  Bright, flat-color style. Eye-level perspective. Warm lighting.
FS Translation: Can use illustration or photography (both acceptable in FS brand).
  If illustration: clean, modern style with FS color palette.
  If photography: authentic SME owner imagery, warm natural lighting.
  Maintain eye-level perspective for relatability.
```

### 6. Emotional Appeal

**What to look for:**
- Primary emotion: aspiration, urgency, fear-of-missing-out, security, pride, relief
- How the emotion is delivered: through imagery, copy, color, or combination
- Emotional arc: problem → solution, current → aspirational

**Example output:**
```
Competitor Pattern: Aspirational pride — "your business can be this big."
  Delivered through visual transformation metaphor (small → large).
FS Translation: FS can deliver aspiration through its empowering tone.
  Frame as "we help you get there" rather than "look how big you could be."
  FS is the enabler, the SME owner is the hero.
```

**Edge cases:**
- Competitor uses fear/scarcity → translate to positive framing (FS tone is empowering, not fear-based)
- Competitor uses humor/memes → translate to professional warmth (FS avoids meme formats)

### 7. Messaging Strategy

**What to look for:**
- Headline structure: question, command, statistic, rhyme, contrast, benefit statement
- CTA approach: urgency-driven, benefit-driven, action-driven
- Value proposition placement
- Use of social proof or data points

**Example output:**
```
Competitor Pattern: Rhyming headline ("Click and go, no moving slow").
  Urgency CTA ("Apply Now"). Stats-based proof ("up to RM5,000,000").
FS Translation: Rhyming can work for FS if professional — suggest testing.
  CTA: "Get Started" or "Apply Today" (FS avoids aggressive urgency).
  Stats: FS can use "100,000+ SMEs funded" or loan amounts.
```

### 8. Attention Mechanics

**What to look for:**
- Primary focal point and its position (rule of thirds, center, etc.)
- Eye path: what you see first, second, third
- Contrast hotspots: where the highest color/size contrast exists
- Visual weight distribution

**Example output:**
```
Competitor Pattern: Focal point at center (food truck image). Eye path:
  center image → top headline → bottom CTA. High contrast at CTA (red on white).
FS Translation: Maintain center-focal-point strategy. Eye path:
  hero image → headline (Poppins SemiBold, purple) → CTA (yellow #FFDE0F button).
  Yellow CTA on purple or gray background creates strong contrast hotspot.
```

---

## Usage

1. Analyze all 8 dimensions from the competitor image
2. Present the analysis table with competitor patterns and FS translations
3. Flag uncertainties (e.g., "font identification is approximate")
4. Wait for user confirmation before passing to copy drafting and concept generation
5. Use confirmed analysis to inform copy suggestions and concept prompts

## Important Constraints

- **Never reproduce competitor branding** — analysis is for creative strategy transfer only
- **Always map to FS palette** — no competitor colors should appear in outputs
- **Respect FS tone** — even if competitor uses aggressive/fear-based messaging, translate to FS's professional, empowering voice
- **Cultural sensitivity** — adapt metaphors for the target market
