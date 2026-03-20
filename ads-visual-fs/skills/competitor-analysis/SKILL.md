---
name: competitor-analysis
description: >
  Activates when analyzing a competitor ad for transferable creative strategies —
  extracting layout architecture, visual metaphor, color psychology, typography approach,
  imagery style, emotional appeal, messaging strategy, and attention mechanics, then
  mapping each to FS brand equivalents. This is a shared analysis capability, not a
  user-facing workflow.
metadata:
  version: "0.7.0"
---

# Competitor Analysis

Structured creative strategy extraction from competitor ad visuals. Used by the Competitor Reference workflow.

## When This Activates

This skill provides domain expertise when you need to analyze a competitor ad for transferable creative strategies. You perform this analysis directly using your multimodal capabilities — do NOT call any MCP tool.

**Key difference from marketing-analysis:** This does NOT extract FS-specific attributes. It extracts *creative strategies* (layout, metaphor, emotion, attention flow) from competitor ads and maps each to FS brand equivalents.

## Analysis Framework

Analyze each dimension, then provide an FS Translation showing how to adapt it:

### 1. Layout Architecture
- Grid structure, element zones, visual flow direction
- **FS Translation:** How to adapt this layout using FS visual language

### 2. Visual Metaphor
- Core concept (growth, speed, trust, transformation, etc.)
- **FS Translation:** FS-appropriate metaphor that serves the same emotional function

### 3. Color Psychology
- Dominant/accent colors, contrast strategy, warmth/coolness
- **FS Translation:** Map to FS palette (#5203EA, #FFDE0F, #27E4CD, #2C50FF, #F1F1F2)

### 4. Typography Approach
- Weight contrast, hierarchy ratio, text density
- **FS Translation:** Equivalent approach using Poppins/Inter

### 5. Imagery Style
- Photo vs illustration, lighting, perspective, subject treatment
- **FS Translation:** How to achieve similar impact within FS art direction

### 6. Emotional Appeal
- Primary emotion targeted (aspiration, urgency, security, etc.)
- **FS Translation:** How FS tone (professional, trustworthy, empowering) can deliver the same emotion

### 7. Messaging Strategy
- Headline structure type (question, command, stat, rhyme, etc.), CTA approach
- **FS Translation:** Suggested headline structure and CTA pattern for FS

### 8. Attention Mechanics
- Eye path, contrast hotspots, focal point placement
- **FS Translation:** How to create equivalent attention flow in FS brand system

For detailed schemas, example outputs, and edge cases, see `references/analysis-dimensions.md`.

## Output Format

Present each dimension as:

| Dimension | Competitor Pattern | FS Translation |
|-----------|-------------------|----------------|
| Layout Architecture | ... | ... |
| Visual Metaphor | ... | ... |
| ... | ... | ... |

Always flag uncertainties and assumptions separately.

## Confirmation Gate

After presenting analysis, always ask the user to confirm or edit the analysis before it is used downstream. This is critical — never proceed automatically.
