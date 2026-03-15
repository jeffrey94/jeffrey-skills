---
name: reimagine
description: Reimagine an existing ad with 3 concept variations (SAFE/BOLD/EXPERIMENTAL)
argument-hint: <image-path>
allowed-tools: Read, Bash
---

# /reimagine

Transform an existing ad creative into fresh concept variations at three conceptual levels.

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

Ask the user:

> **What platform is this ad for?** (e.g., Instagram Feed, LinkedIn, TikTok)

Then present each extracted copy element and the logo option individually. Ask the user to select which should appear in the generated visuals:

**Copy Elements:**
- [ ] **H1 Headline**: "<extracted text>"
- [ ] **Support Line**: "<extracted text>"
- [ ] **CTA Label**: "<extracted text>"
- [ ] **Trust Signals**: "<extracted text>"
- [ ] **Legal/Disclaimer**: "<extracted text>"

**Brand Elements:**
- [ ] **FS Logo**: Include Funding Societies logo

> **Which elements should appear in the generated visuals? Select all that apply, or choose 'none' for visual-only output.**

When generating concept prompts in Step 2:
- If copy elements are selected: include them with layout instructions ("Reserve appropriate visual space ONLY for the selected mandatory copy elements. Follow hierarchical order and ensure each element is legible.")
- If no copy selected: include "No mandatory copy required. Focus on visual composition, product showcase, and brand codes."
- Copy direction: "All marketing copy must directly address the viewing AUDIENCE. The copy speaks TO the viewer, not to characters within the scene."
- If FS Logo is selected: include in the prompt "Include the Funding Societies logo from the provided logo reference image. Place the logo with adequate clear space (minimum 1× logo mark width on all sides). Do not alter logo proportions, colors, or add effects."

Wait for user selection.

### Platform Recommendations

After the user selects elements, read `brand-compliance/references/platform-rules.md`
for the target platform and present recommendations:

> **Recommended for [Platform Name]:**
> Based on [platform] best practices, we recommend including only:
> - ✅ Headline (max 5 words)
> - ✅ CTA button
> - ✅ FS Logo
> - ✅ Regulatory disclaimer (small)
>
> These elements are better in the **ad caption** (not on the visual):
> - Support line
> - Trust signals
>
> You can override these recommendations using the checkboxes above.

## Step 2 — Generate 3 Concept Variations

Using the confirmed insights, generate 3 creative concept variations yourself.

### Level 1 — SAFE (REFRAME)
Refined execution of the proven approach. Minimal conceptual distance. Keep the same visual language but elevate the execution quality. Image strength: **0.55–0.65** (close to original).

### Level 2 — BOLD (TRANSFORM)
New visual metaphor, rebuilt composition. The product remains the hero but the storytelling approach changes significantly. Image strength: **0.70–0.80**.

### Level 3 — EXPERIMENTAL (TRANSCEND)
Genre-shift allowed. Only the product identity and core message persist. Everything else can be reimagined. Image strength: **0.85–0.95**.

For each concept, present:
- **Title** — A catchy name for the concept
- **Rationale** — Why this works for the audience
- **Image Generation Prompt** — Detailed prompt for Gemini (include FS brand colors: #F1F1F2, #FFDE0F, #5203EA, #27E4CD, #2C50FF; fonts: Poppins headings, Inter body)
- **Settings** — image_strength value, aspect_ratio (auto-detected from source)

Then ask:

> **Which concepts would you like me to generate? (1, 2, 3, or all)**

Wait for user selection.

## Step 3 — Generate Images

For each selected concept, run the generation script via Bash:

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

**Image strength guide:**

| Strength | Effect | Use When |
|----------|--------|----------|
| 0.55–0.65 | Close to original | SAFE concepts, minor variations |
| 0.70–0.80 | Moderate transformation | BOLD concepts, new composition |
| 0.85–0.95 | Major transformation | EXPERIMENTAL concepts, genre shifts |

**Error handling**:
- Rate limit (429) or service unavailable (503): wait 5 seconds, retry once
- Content policy violation: present the error, offer to modify the prompt
- No image data returned: retry with simplified prompt
- Other failures: present the error and offer to try a different prompt

## Step 4 — Review

Present the output file paths. Then offer:

- **Regenerate** — Try again with a modified prompt
- **Refine** — Make targeted changes to a result (→ suggest `/refine`)
- **Resize** — Adapt results for platforms (→ suggest `/resize`)

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
