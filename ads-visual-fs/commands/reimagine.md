---
name: reimagine
description: Reimagine an existing ad with 3 concept variations (SAFE/BOLD/EXPERIMENTAL)
argument-hint: <image-path> [--variants N]
allowed-tools: Read, Bash, AskUserQuestion
---

# /reimagine

Transform an existing ad creative into fresh concept variations at three conceptual levels.

**Follow `ask-user-protocol/SKILL.md` for all user decision points.** Every AskUserQuestion call must use the 4-section format (Re-ground, Simplify, Recommend, Options).

## Step 1 — Analyze the Source Ad

Read the image at `$1`. You are multimodal — analyze it directly.

Perform marketing inference on the image. For each insight below, provide a label, rationale, confidence score (0–1), and evidence tags:

- **Product/Service** — What is being advertised?
- **Core Message** — What is the key marketing message?
- **Target Audience** — Who is this aimed at?
- **Brand Codes** — Colors (hex), fonts, visual rules observed
- **Mandatory Copy** — Headlines, CTAs, trust signals, legal text visible

Present results in a structured table. Then ask:

> **Please confirm or edit these insights before I generate concepts.**

Wait for user confirmation. Do NOT proceed until the user confirms.

## Step 1b — Platform & Visual Elements

### Platform Selection

Use **Pattern A (Platform Selection)** from `ask-user-protocol/SKILL.md`.

Present a two-step AskUserQuestion:
1. Platform category (Social Feed / Social Story / Display / Video)
2. Specific platform within the selected category

### Visual Element Selection

Then use **Pattern B (Visual Element Presets)** from `ask-user-protocol/SKILL.md`.

Present with a conversational intro covering: what step we're at (reimagining the source ad), why "on visual vs. caption" matters for the selected platform, and your suggestion based on the target platform (see Pattern B in ask-user-protocol). Then call AskUserQuestion with Minimal / Standard (Recommended) / Full / Custom options with preview fields.

If the user selects "Custom", follow up with the multiSelect AskUserQuestion defined in Pattern B.

Wait for user selection.

### Applying the selection

When generating concept prompts in Step 2:
- If copy elements are selected: include them with layout instructions ("Reserve appropriate visual space ONLY for the selected mandatory copy elements. Follow hierarchical order and ensure each element is legible.")
- If no copy selected: include "No mandatory copy required. Focus on visual composition, product showcase, and brand codes."
- Copy direction: "All marketing copy must directly address the viewing AUDIENCE. The copy speaks TO the viewer, not to characters within the scene."
- If FS Logo is selected: include in the prompt "Include the Funding Societies logo from the provided logo reference image. Place the logo with adequate clear space (minimum 1× logo mark width on all sides). Do not alter logo proportions, colors, or add effects."

## Step 2 — Generate 3 Concept Variations

Using the confirmed insights, generate 3 creative concept variations yourself.

### Level 1 — SAFE (REFRAME)
Refined execution of the proven approach. Minimal conceptual distance. Keep the same visual language but elevate the execution quality. Image strength: **0.85–0.95** (very closely follows reference).

### Level 2 — BOLD (TRANSFORM)
New visual metaphor, rebuilt composition. The product remains the hero but the storytelling approach changes significantly. Image strength: **0.55–0.70** (moderate divergence from reference).

### Level 3 — EXPERIMENTAL (TRANSCEND)
Genre-shift allowed. Only the product identity and core message persist. Everything else can be reimagined. Image strength: **0.20–0.40** (loose reference, prompt-driven).

For each concept, present:
- **Title** — A catchy name for the concept
- **Rationale** — Why this works for the audience
- **Image Generation Prompt** — Detailed prompt for Gemini (include FS brand colors: #F1F1F2, #FFDE0F, #5203EA, #27E4CD, #2C50FF; fonts: Poppins headings, Inter body)
- **Settings** — image_strength value, aspect_ratio (auto-detected from source)

Then use **Pattern C (Concept Selection)** from `ask-user-protocol/SKILL.md`.

Present with the 4-section format. Level names for `/reimagine`:
- Level 1: **Safe (Reframe)** — Refined execution, close to original (~1 image, ~30s)
- Level 2: **Bold (Transform)** — New metaphor, rebuilt composition (~1 image, ~30s)
- Level 3: **Experimental (Transcend)** — Genre-shift, everything reimagined (~1 image, ~30s)
- All Three (~3 images, ~2 min)

Populate each option's `preview` field with the generated concept's title and first 2 sentences of rationale.

Wait for user selection.

## Step 3 — Generate Images

### A/B Variants

If the user passed `--variants N` (default 2, max 4): after generating the base image for the selected concept, generate N-1 additional variations. Each variant uses the SAME base prompt with ONE targeted change:
- Variant 1: Base (original prompt)
- Variant 2: Alternate CTA text
- Variant 3: Alternate colorway (warm → cool or vice versa)
- Variant 4: Headline emphasis shift

Output filenames: `<concept-title-slug>.png`, `<concept-title-slug>-v2.png`, etc.

### Prompt Transparency

Before calling the generation script, display the full prompt:

> **Prompt sent to Gemini:**
> [full prompt text]

If the user says "don't show prompts" or "hide prompts", omit this for subsequent generations within this command invocation.

For each selected concept, run the generation script via Bash:

**Brand compliance**: Append the brand compliance prompt injection template from `brand-compliance/SKILL.md` to every generation prompt.

```bash
# If FS Logo was NOT selected in Step 1b:
${BUN_X} ${CLAUDE_PLUGIN_ROOT}/scripts/generate-image.ts \
  --prompt "<concept prompt with FS brand constraints>" \
  --image "./ads-output/reimagine/<concept-title-slug>.png" \
  --ref "$1" \
  --strength <from concept settings> \
  --ar "<auto-detected from source>" \
  --json

# If FS Logo WAS selected in Step 1b:
${BUN_X} ${CLAUDE_PLUGIN_ROOT}/scripts/generate-image.ts \
  --prompt "<concept prompt with FS brand constraints>" \
  --image "./ads-output/reimagine/<concept-title-slug>.png" \
  --ref "$1" ${CLAUDE_PLUGIN_ROOT}/assets/fs-logo.png \
  --strength <from concept settings> \
  --ar "<auto-detected from source>" \
  --json
```

When constructing image generation prompts, ALWAYS include these directives:
- "The reference image IS the advertisement creative to reimagine. Transform and remix its visual elements directly into a new creative. DO NOT treat the reference as content to display within a new environment (not on a monitor, not as a poster, not on a screen someone is viewing)."
- "All marketing copy speaks TO the viewer. Never depict copy as text being shown to or viewed by characters in the scene."

Add these to the negative prompts: `reference-ad-shown-as-object-in-scene, recursive-image-embedding, marketing-copy-shown-to-scene-characters`.

**Runtime resolution**: If `bun` is installed, use `bun`. Otherwise use `npx -y bun`.

**Image strength guide** (`--strength`: 1=exact copy of reference, 0=ignore reference):

| Strength | Effect | Use When |
|----------|--------|----------|
| 0.85–0.95 | Very closely follows original | SAFE concepts, minor variations |
| 0.55–0.70 | Closely follows, moderate divergence | BOLD concepts, new composition |
| 0.20–0.40 | Loosely follows, prompt-driven | EXPERIMENTAL concepts, genre shifts |

**Error handling**: Follow the error handling pattern in CLAUDE.md.

## Step 3b — Quality Review

After each image is generated, run the **quality self-review** from `quality-review/SKILL.md`. Read the generated image and evaluate for gross brand compliance failures and brief alignment. Auto-retry up to 2 times on gross failures. Present advisory warnings for fine-grained issues.

## Step 4 — Review

Present the output file paths. Then use **Pattern D (Next Action)** from `ask-user-protocol/SKILL.md`.

Options for `/reimagine`:
- **Regenerate** — Try again with a modified prompt
- **Refine** — Make targeted changes to a result (-> `/refine`)
- **Resize** — Adapt results for platforms (-> `/resize`)

### Regeneration Protocol

When the user chooses "Regenerate" for a concept:

1. **Reuse the EXACT original prompt** from the first generation attempt. Do NOT write a new prompt from scratch.
2. **Adjust only the strength parameter** — typically increase it by 0.10–0.15 to follow the reference more closely (higher = closer to reference).
3. **If the user describes specific changes**, make TARGETED edits to the original prompt (add/remove a specific clause), not a full rewrite.
4. **Append the version suffix** to the output filename: `-v2.png`, `-v3.png`.
5. **Present both the original and adjusted prompt** so the user can see exactly what changed.

## Step 4b — Ad Caption Copy

Provide the full marketing copy formatted for the target platform's caption field:

**Ad Caption:**
> [Full headline — can be longer than the on-visual version]
>
> [Support line / value proposition]
>
> [Trust signals and social proof]
>
> [CTA with link placeholder]
>
> [Regulatory disclaimer]

Present this alongside the generated image paths so the user has both the visual
and the caption ready to use.
