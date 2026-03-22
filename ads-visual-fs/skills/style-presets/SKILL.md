---
name: style-presets
description: >
  Activates during /create and /campaign workflows when the user needs to choose a
  visual style for ad creation. Provides 4 predefined styles (Warm Showcase, Bold
  Professional, Tech Forward, Aspirational Shadow) plus Custom. Each style defines
  required visual elements, composition, layout, and mood.
metadata:
  version: "0.9.1"
---

# Style Presets

Predefined visual styles for FS ad creatives. Each style defines a repeatable visual system — the required elements, composition structure, reference layout, and mood that make ads from the same campaign look cohesive.

## When This Activates

During `/create` and `/campaign` workflows, after visual element selection (Pattern B) and before concept generation. The user selects a style preset, and it becomes the primary visual direction for all generated concepts.

NOT used by `/reimagine`, `/competitor-reference`, `/refine`, or `/resize` — those derive visual direction from the source/reference image.

## How to Use

1. **Present the style selection** using Pattern E from `ask-user-protocol/SKILL.md`
2. **Read the reference image** for the selected style from `references/` — you are multimodal, view it directly
3. **Pass the style's Prompt Injection Fragment** (from `references/style-directory.md`) to concept-generation as the primary visual direction
4. The concept-generation skill incorporates the style into all 3 concept levels

## What Styles Define (fixed per style)

- **Required visual elements** — signature elements that must always appear (e.g., organic blob frame, phone mockup, dream-shadow)
- **Composition structure** — how elements relate to each other (subject as hero, framing device, background treatment)
- **Reference layout** — prioritize matching the layout from the reference image. Only deviate when the target platform format physically cannot accommodate it
- **Mood** — emotional direction that shapes the entire creative

## What Styles Do NOT Define (flexible)

- **Colors** — all styles use the FS brand palette (#F1F1F2, #FFDE0F, #5203EA, #27E4CD, #2C50FF) flexibly. The concept-generation skill picks the best color combination based on campaign context.
- **Specific copy** — text content comes from the brief and copy drafting steps
- **Product/industry** — any style works for any FS product or industry vertical

## The 4 Styles

| Style | Required Elements | Mood |
|-------|------------------|------|
| **Warm Showcase** | Photo-real person + 3D props + organic blob frame + solid bg | Friendly, relatable, micro-SME |
| **Bold Professional** | Photo-real person + teal rounded-rect photo mask + trust badge pill + gradient bg | Corporate, polished, established |
| **Tech Forward** | Person + phone/device mockup + person breaks out of device + gradient bg | Digital transformation, growth |
| **Aspirational Shadow** | 3D rendered subject + dream-shadow + light/neutral bg + pastel accents | Minimal, editorial, aspirational |

See `references/style-directory.md` for full definitions including composition rules, photography direction, layout, and prompt injection fragments.

## Reference Images

Each style has a bundled reference image. **Always read the reference image** for the selected style before generating concept prompts (so you understand the visual system):

- `references/style-1-warm-showcase.jpg`
- `references/style-2-bold-professional.png`
- `references/style-3-tech-forward.png`
- `references/style-4-aspirational-shadow.png`

### Passing Reference Image to Gemini (user decides)

After the user selects a style, ask whether to pass the style reference image to Gemini as a `--ref` argument. This improves composition consistency but may cause the reference's specific subject to bleed into the output.

Use AskUserQuestion:
- **Use style reference** (Recommended for Styles 1-3) — Pass the style reference image as `--ref` with `--strength 0.3`. Gemini sees the visual system and matches it more closely.
- **Text prompt only** — Rely on the Prompt Injection Fragment alone. More creative freedom, less composition consistency.

If the user selects "Use style reference", pass it as `--ref` alongside the FS logo (if logo was selected in visual elements):
```
--ref <style-reference-image> <fs-logo.png>
```

If "Text prompt only", pass only the FS logo (if selected):
```
--ref <fs-logo.png>
```

**FS Logo handling:** When the design includes the FS logo (selected in Pattern B visual elements), the logo MUST always be passed as `--ref` regardless of the style reference decision. The style reference and logo are independent — both can be passed together.

## Interaction with Concept Levels

Style and concept level are orthogonal:

- **SAFE** — Follows the style preset literally. Same elements, same layout, same mood. Only copy approach varies.
- **BOLD** — Keeps the style's required elements and mood but introduces a new visual metaphor or storytelling angle within that style system.
- **EXPERIMENTAL** — Keeps the style's required elements but allows composition and layout to diverge. Mood is preserved as a starting point.

The style's Prompt Injection Fragment is included in EVERY concept prompt regardless of level.
