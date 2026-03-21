---
name: competitor-reference
description: Analyze a competitor ad and generate FS-branded ads inspired by its creative strategies
argument-hint: <competitor-image-path>
allowed-tools: Read, Bash, AskUserQuestion
---

# /competitor-reference

Analyze a competitor ad for transferable creative strategies, then generate production-ready FS-branded ads inspired by those strategies.

**Follow `ask-user-protocol/SKILL.md` for all user decision points.** Every AskUserQuestion call must use the 4-section format (Re-ground, Simplify, Recommend, Options).

## Step 1 — Intake

Read the competitor image at `$1`. You are multimodal — analyze it directly.

Collect details in two rounds:

### Round 1 — Structured choices (batched AskUserQuestion)

Use AskUserQuestion with 2 questions in a single call:

**Question 1 — Platform Category:**
- header: "Platform"
- Use Pattern A Step 1 from ask-user-protocol (Social Feed / Social Story / Display / Video)

**Question 2 — Target Market:**
- header: "Market"
- options: Singapore / Malaysia / Indonesia / Thailand (VN and others via auto "Other")
- Each option description includes the regulatory entity

Then use a follow-up AskUserQuestion for the **specific platform** within the selected category (Pattern A Step 2). If the category has only 1 platform, auto-select it.

### Round 2 — Free-text input

After structured choices, prompt the user for:
- **FS product/campaign** — What FS product or campaign is this for? (e.g., SME Business Loan MY, Invoice Financing SG)

Wait for all answers before proceeding.

## Step 2 — Competitor Analysis

Perform the 8-dimension competitor analysis on the image:

| Dimension | Competitor Pattern | FS Translation |
|-----------|-------------------|----------------|
| Layout Architecture | Grid structure, element zones, visual flow | FS layout adaptation |
| Visual Metaphor | Core concept (growth, speed, trust) | FS-appropriate metaphor |
| Color Psychology | Dominant/accent, contrast strategy | Map to FS palette |
| Typography Approach | Weight contrast, hierarchy, density | Poppins/Inter equivalent |
| Imagery Style | Photo vs illustration, lighting, perspective | FS art direction |
| Emotional Appeal | Primary emotion targeted | FS tone adaptation |
| Messaging Strategy | Headline structure, CTA approach | FS messaging pattern |
| Attention Mechanics | Eye path, contrast hotspots, focal point | FS attention flow |

Present results in the table format above. Then ask:

> **Please confirm or edit this analysis before I proceed to copy drafting.**

Wait for user confirmation. Do NOT proceed until the user confirms.

## Step 3 — Marketing Copy Drafting

Based on the confirmed competitor analysis (especially dimensions 6: Emotional Appeal and 7: Messaging Strategy), present a copy template for the user to review and finalize.

> **Based on the competitor's messaging strategy, here's a suggested copy structure:**
>
> | Element | Competitor's Approach | Suggested FS Copy |
> |---------|----------------------|-------------------|
> | Headline (max 5 words) | [e.g., rhyming format] | [Your suggestion based on FS product and competitor strategy] |
> | Support Line | [e.g., stats-based proof] | [Your suggestion] |
> | CTA (2-4 words) | [e.g., urgency-driven] | [Your suggestion — FS uses empowering, not aggressive CTAs] |
> | Regulatory Disclaimer | — | [Auto: market-specific regulatory text from brand-compliance] |
> | Trust Signals | — | [e.g., "100,000+ SMEs funded", license info, social proof] |
>
> **Edit the copy above, then confirm. This is what will appear in the generated ads.**

Wait for user to finalize copy. Do NOT proceed until the user confirms their copy.

## Step 3b — Element Selection

After copy is confirmed, use **Pattern B (Visual Element Presets)** from `ask-user-protocol/SKILL.md`.

Present with a conversational intro covering: what step we're at (creating FS ad inspired by competitor), why "on visual vs. caption" matters for ad performance (reference platform-rules.md), and your suggestion based on the target platform (see Pattern B in ask-user-protocol). Then call AskUserQuestion with Minimal / Standard (Recommended) / Full / Custom options with preview fields.

If the user selects "Custom", follow up with the multiSelect AskUserQuestion defined in Pattern B.

Wait for user selection.

### Applying the selection

When generating concept prompts in Step 4:
- If copy elements are selected: include them with layout instructions ("Reserve appropriate visual space ONLY for the selected mandatory copy elements. Follow hierarchical order and ensure each element is legible.")
- If no copy selected: include "No mandatory copy required. Focus on visual composition, product showcase, and brand codes."
- Copy direction: "All marketing copy must directly address the viewing AUDIENCE. The copy speaks TO the viewer, not to characters within the scene."
- If FS Logo is selected: include in the prompt "Include the Funding Societies logo from the provided logo reference image. Place the logo with adequate clear space (minimum 1× logo mark width on all sides). Do not alter logo proportions, colors, or add effects."

## Step 4 — Generate 3 Concept Variations

Using the confirmed analysis, confirmed copy, and selected elements, generate 3 adaptation concepts yourself.

All 3 levels stay on the **copy axis** — how much of the competitor's creative DNA survives — not the "creative freedom" axis (which is what `/reimagine` uses). This is what makes `/competitor-reference` distinct.

### Level 1 — Direct Adaptation
Closely follows the competitor's layout structure, visual metaphor, element placement, and composition. Everything is translated into FS brand system but the creative DNA is clearly recognizable. Image strength: **0.85–0.95** (very closely follow reference).
- **DNA preservation:** The concept prompt MUST explicitly reference ALL 8 analysis dimensions from Step 2 — layout, metaphor, colors, typography, imagery, emotion, messaging, attention flow.

### Level 2 — Blended Adaptation
Keeps the strongest elements from the competitor (e.g., the layout OR the visual metaphor, not necessarily both) and remixes the rest with FS creative direction. ~50% competitor DNA, ~50% original FS. Image strength: **0.55–0.70** (closely follow reference, prompt guides which elements to remix).
- **DNA preservation:** The concept prompt MUST explicitly list the 3-4 strongest competitor dimensions to preserve (from Step 2 analysis) and which dimensions to remix with FS creative direction.

### Level 3 — Creative Riff
Inspired by the competitor's emotional appeal and one key creative insight, but composition and execution are original FS work. The competitor influence is felt, not seen. Image strength: **0.30–0.45** (loosely follow reference, prompt preserves one key insight).
- **DNA preservation:** The concept prompt MUST explicitly name the 1 competitor dimension being preserved (typically emotional appeal or attention mechanics) and describe how it manifests in the FS execution.

For each concept, present:
- **Title** — A catchy name for the concept
- **Rationale** — Why this adaptation works, what it borrows from the competitor
- **Image Generation Prompt** — Detailed prompt for Gemini including:
  - Scene description and composition (inspired by competitor analysis)
  - FS brand colors (#F1F1F2, #FFDE0F, #5203EA, #27E4CD, #2C50FF)
  - Typography direction (Poppins headings, Inter body)
  - Confirmed copy elements to include (only selected ones, with exact text)
  - Style and mood direction
  - Anti-embedding directives (see below)
  - Negative prompts (see below)
  - Brand compliance prompt injection (from brand-compliance skill)
- **Settings** — image_strength value, aspect_ratio from target platform

Then use **Pattern C (Concept Selection)** from `ask-user-protocol/SKILL.md`.

Present with the 4-section format. Level names for `/competitor-reference`:
- Level 1: **Direct Adaptation** — Closely follows competitor DNA (~1 image, ~30s)
- Level 2: **Blended** — ~50% competitor, ~50% FS (~1 image, ~30s)
- Level 3: **Creative Riff** — Competitor influence felt, not seen (~1 image, ~30s)
- All Three (~3 images, ~2 min)

Populate each option's `preview` field with the generated concept's title, rationale, and what it borrows from the competitor.

Wait for user selection.

## Step 5 — Generate Images

For each selected concept, run the generation script via Bash:

```bash
# If FS Logo was NOT selected in Step 3b:
${BUN_X} ${CLAUDE_PLUGIN_ROOT}/scripts/generate-image.ts \
  --prompt "<concept prompt with confirmed copy, FS brand constraints>" \
  --image "./ads-output/competitor-reference/<competitor-slug>/<concept-title-slug>.png" \
  --ref "$1" \
  --strength <from concept settings> \
  --ar "<from target platform>" \
  --json

# If FS Logo WAS selected in Step 3b:
${BUN_X} ${CLAUDE_PLUGIN_ROOT}/scripts/generate-image.ts \
  --prompt "<concept prompt with confirmed copy, FS brand constraints>" \
  --image "./ads-output/competitor-reference/<competitor-slug>/<concept-title-slug>.png" \
  --ref "$1" ${CLAUDE_PLUGIN_ROOT}/assets/fs-logo.png \
  --strength <from concept settings> \
  --ar "<from target platform>" \
  --json
```

### Anti-Recursive-Embedding Directives

When constructing image generation prompts, ALWAYS include:
- "The reference image is a COMPETITOR ad used for creative inspiration only. Extract its compositional strategies and translate them into an original Funding Societies creative. DO NOT reproduce the competitor's brand identity, logo, text, or brand colors."
- "All marketing copy speaks TO the viewer. Never depict copy as text being shown to or viewed by characters in the scene."

### Negative Prompts

Add these to EVERY prompt:
- `competitor-logo, competitor-brand-elements, competitor-text-reproduction, competitor-brand-colors`
- `reference-ad-shown-as-object-in-scene, recursive-image-embedding, marketing-copy-shown-to-scene-characters`
- Standard FS negatives: `gambling, casino, rockets, memes, aggressive-lending, predatory-language, illegible-text`
- Explicit directive: "Do NOT reproduce the competitor's logo, brand name, tagline, or brand colors in the output."

### Brand Compliance

Append the brand compliance prompt injection to every prompt:
```
Brand colors: Light Gray #F1F1F2, Yellow #FFDE0F, Purple #5203EA, Teal #27E4CD, Blue #2C50FF.
Typography: Poppins SemiBold for headings, Inter Regular for body.
Tone: professional, trustworthy, empowering.
Do not include: gambling, casino, rockets, memes, aggressive lending, predatory language, illegible text.
Keep on-visual text minimal: headline (max 5 words), CTA button, logo, disclaimer only.
Do not render body copy, bullet points, or detailed offer text on the image.
```

**Runtime resolution**: If `bun` is installed, use `bun`. Otherwise use `npx -y bun`.

**Image strength guide** (`--strength`: 1=exact copy of reference, 0=ignore reference):

| Strength | Effect | Adaptation Level |
|----------|--------|-----------------|
| 0.85–0.95 | Very closely follows reference | Direct Adaptation — full competitor DNA |
| 0.55–0.70 | Closely follows reference, prompt guides remixing | Blended Adaptation — ~50% competitor DNA |
| 0.30–0.45 | Loosely follows reference, prompt-driven | Creative Riff — competitor influence felt, not seen |

**Error handling**:
- Rate limit (429) or service unavailable (503): wait 5 seconds, retry once
- Content policy violation: present the error, offer to modify the prompt
- No image data returned: retry with simplified prompt
- Other failures: present the error and offer to try a different prompt

## Step 6 — Review

Present the output file paths. Then use **Pattern D (Next Action)** from `ask-user-protocol/SKILL.md`.

Options for `/competitor-reference`:
- **Regenerate** — Try again with a modified prompt
- **Refine** — Make targeted changes to a result (-> `/refine`)
- **Resize** — Adapt results for other platforms (-> `/resize`)

### Regeneration Protocol

When the user chooses "Regenerate" for a concept:

1. **Reuse the EXACT original prompt** from the first generation attempt. Do NOT write a new prompt from scratch.
2. **Adjust only the strength parameter** — typically increase it by 0.10–0.15 to follow the reference more closely (higher = closer to reference).
3. **If the user describes specific changes**, make TARGETED edits to the original prompt (add/remove a specific clause), not a full rewrite.
4. **Append the version suffix** to the output filename: `-v2.png`, `-v3.png`.
5. **Present both the original and adjusted prompt** so the user can see exactly what changed.

This prevents concept drift — regenerated outputs should be variations of the SAME concept, not entirely new ads.

### Ad Caption Copy

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

Present this alongside the generated image paths so the user has both the visual and the caption ready to use.
