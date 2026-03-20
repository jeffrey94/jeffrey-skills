---
name: concept-generation
description: >
  Activates when generating creative concept variations at multiple conceptual levels
  (SAFE/BOLD/EXPERIMENTAL) for ad campaigns. Produces titles, rationales, and image
  generation prompts. This is a shared creative capability, not a user-facing workflow.
metadata:
  version: "0.7.1"
---

# Concept Generation

Generate creative concept variations at three conceptual distance levels. Used by Reimagine and Create workflows.

## When This Activates

This skill provides domain expertise when you need to generate creative concepts for ad campaigns. You generate these concepts yourself — do NOT call any external tool or script.

## The Three Levels

### Level 1 — SAFE (REFRAME)
- **Conceptual Distance**: Minimal. Refine the proven approach.
- **What Changes**: Execution quality, copy polish, color refinement
- **What Stays**: Same visual language, same composition structure, same metaphor
- **Image Strength**: 0.55–0.65 (for Reimagine with reference image)
- **Risk**: Low

### Level 2 — BOLD (TRANSFORM)
- **Conceptual Distance**: Moderate. New visual metaphor.
- **What Changes**: Storytelling approach, composition, visual metaphor
- **What Stays**: Product as hero, core message, brand identity
- **Image Strength**: 0.70–0.80
- **Risk**: Medium
- **Single focal point:** Bold means bolder color/graphic treatment, NOT more
  elements. One hero subject per ad. Use geometric brand shapes (teal curves,
  purple angles) for visual energy instead of adding figures or panels.

### Level 3 — EXPERIMENTAL (TRANSCEND)
- **Conceptual Distance**: High. Genre-shift allowed.
- **What Changes**: Everything except product identity and message
- **What Stays**: Product/service recognition, core marketing message
- **Image Strength**: 0.85–0.95
- **Risk**: High — but potential for breakthrough creative

## Concept Output Format

For each concept, produce:

1. **Title** — A catchy 2-5 word name (e.g., "Momentum Unleashed", "Trust in Numbers")
2. **Rationale** — 2-3 sentences on why this concept works for the audience
3. **Image Generation Prompt** — Detailed, specific Gemini prompt including:
   - Scene description and composition
   - FS brand colors to use (#F1F1F2, #FFDE0F, #5203EA, #27E4CD, #2C50FF)
   - Typography direction (Poppins headings, Inter body)
   - Copy elements to include (headline, CTA, trust signals)
   - Style and mood direction
   - Negative prompts (no gambling, casino, rockets, memes, illegible text)
4. **Settings** — image_strength matching the concept level (SAFE: 0.55–0.65, BOLD: 0.70–0.80, EXPERIMENTAL: 0.85–0.95), and aspect_ratio from the source image or target platform. The image_strength is passed as `--strength` to the generate-image.ts script when a reference image is used (Reimagine). For Create (text-to-image, no reference), image_strength is not applicable.

## Visual Text Density

AI image generation models struggle with rendering long text accurately. Fewer
words = higher legibility and correct spelling.

### On-Visual Elements (max)
- **Headline:** Default max 5 words. See `../brand-compliance/references/platform-rules.md` for platform-specific limits (LinkedIn: 7, TikTok/YouTube: 4). Shorter is better.
- **CTA button:** 2-4 words
- **Logo:** Via reference image
- **Regulatory disclaimer:** One line, small

### NOT on Visual (move to ad caption)
- Support lines / body copy
- Bullet points / feature lists
- Trust signals / social proof details
- Offer details / pricing

### Format-Specific Layouts
Read `../brand-compliance/references/platform-rules.md` for the target platform,
then apply:
- **Feed (1:1, 4:3):** Reduced layout — headline + hero subject + CTA + logo
- **Story (9:16):** Can add ONE support line if space allows
- **Leaderboard (16:9 wide):** Headline + CTA only — extremely compact
- **Skyscraper (vertical):** Vertical stack — logo → headline → image → CTA

## Ad Caption Output

After generating images, ALSO provide the full marketing copy formatted for the
platform's ad caption/description field. Include:
- Full headline (can be longer than the on-visual version)
- Support line / value proposition
- Trust signals and social proof
- CTA text
- Offer details
- Regulatory disclaimer

Format as ready-to-paste text for the target platform.

## Prompt Engineering Guidelines

- Be SPECIFIC about composition: "headline centered top-third, CTA button bottom-center"
- Include exact copy text in the prompt when possible
- Specify color usage: "primary purple #5203EA background, yellow #FFDE0F CTA button"
- Describe the mood: "confident, professional, empowering"
- Include negative prompts to avoid: gambling imagery, memes, rockets, aggressive language
- **Anti-recursive-embedding**: Always include in prompts: "The reference image IS the ad to reimagine. Transform and remix its visual elements directly into a new creative. DO NOT treat the reference as content to display within a scene (not on a monitor, billboard, poster, or screen)."
- **Copy direction**: All marketing copy must address the viewing audience. Never depict copy as text shown to or viewed by characters within the scene.

## Copy and Logo Selection

The calling workflow (Create or Reimagine) will specify which copy elements and whether the FS logo should appear in the generated visuals. Respect these selections when building prompts:

- **If copy elements are selected**: include the exact text for each selected element with specific layout positioning (e.g., "Headline 'Grow Your Business' in Poppins SemiBold, centered top-third"). Do NOT include copy elements that were not selected.
- **If no copy is selected**: include "No mandatory copy required. Focus on visual composition, product showcase, and brand codes." Do NOT invent or add text.
- **If FS Logo is selected**: include in the prompt "Include the Funding Societies logo from the provided logo reference image. Place the logo with adequate clear space (minimum 1× logo mark width on all sides). Do not alter logo proportions, colors, or add effects." The logo will be passed as a reference image to the generation script.
- **If FS Logo is not selected**: do NOT mention logo placement in the prompt.
