---
name: create
description: Create a new ad from a marketing brief
argument-hint: [brief-file] [branding-guide] [logo] [--variants N]
allowed-tools: Read, Bash, AskUserQuestion
---

# /create

Generate brand-new ad creatives from a marketing brief with Funding Societies brand guidelines automatically applied.

**Follow `ask-user-protocol/SKILL.md` for all user decision points.** Every AskUserQuestion call must use the 4-section format (Re-ground, Simplify, Recommend, Options).

## Step 1 — Gather Brief

If the user provides file paths (PDFs, docs, images), read them directly to extract campaign details instead of asking questions. If `$1` is a brief document, read it. If `$2` is a branding guide, read it. If `$3` is a logo, use it as reference.

If no files are provided, collect campaign details in two rounds:

### Round 1 — Structured choices (batched AskUserQuestion)

Use AskUserQuestion with 3 questions in a single call:

**Question 1 — Campaign Goal:**
- header: "Goal"
- options: Awareness / Lead Generation / Retargeting / Product Launch
- Recommend based on context if available (e.g., "Choose Lead Generation for loan products targeting SME owners")

**Question 2 — Target Market:**
- header: "Market"
- options: Singapore / Malaysia / Indonesia / Thailand (VN and others via auto "Other")
- Each option description includes the regulatory entity (e.g., "Funding Societies Pte Ltd — CMS licence")

**Question 3 — Platform Category:**
- header: "Platform"
- Use Pattern A Step 1 from ask-user-protocol (Social Feed / Social Story / Display / Video)
- Recommend based on campaign goal (see Pattern A)

Then use a follow-up AskUserQuestion for the **specific platform** within the selected category (Pattern A Step 2). If the category has only 1 platform, auto-select it.

### Round 2 — Free-text inputs

After structured choices are collected, prompt the user for:

1. **Product/Service** — What is being advertised? (e.g., SME business loan, invoice financing)
2. **Target Audience** — Who are we reaching? (e.g., SME owners in Singapore)
3. **Key Message** — What is the one thing the audience should remember?
4. **Logo Image** (optional) — Path to a logo file to include as reference

Collect all answers before proceeding.

## Step 2 — Build Marketing Copy

Using the brief and FS brand guidelines, construct:

- **H1 Headline** — Primary text (max 5 words for on-visual use; full version goes to ad caption)
- **Support Line** — Secondary proof point (one sentence)
- **CTA Label** — Action button text (2-4 words)
- **Trust Signals** — License info, track record, social proof
- **Regulatory Disclaimer** — Market-specific:
  - SG: "Funding Societies Pte Ltd holds a Capital Markets Services Licence (CMS101541)"
  - MY: "Modalku Ventures Sdn Bhd is registered with the Securities Commission Malaysia"
  - ID: "PT Modalku Finansial Teknologi terdaftar dan diawasi oleh OJK"
  - TH: "Registered under SEC Thailand"
  - VN: "Licensed under SBV regulations"

FS Brand colors: `#F1F1F2` (Light Gray), `#FFDE0F` (Yellow), `#5203EA` (Purple), `#27E4CD` (Teal), `#2C50FF` (Blue)
Fonts: Poppins SemiBold/Light for headings, Inter Regular/Bold for body
Strapline: "Stronger SMEs, Stronger Societies"

Present all copy to the user:

> **Review and edit the marketing copy below, then confirm.**

Wait for confirmation.

## Step 2b — Select Visual Elements

After copy is confirmed, use **Pattern B (Visual Element Presets)** from `ask-user-protocol/SKILL.md`.

Present with a conversational intro covering: what step we're at, why "on visual vs. caption" matters for ad performance (reference platform-rules.md), and your suggestion based on the target platform (see Pattern B in ask-user-protocol). Then call AskUserQuestion with Minimal / Standard (Recommended) / Full / Custom options with preview fields.

If the user selects "Custom", follow up with the multiSelect AskUserQuestion defined in Pattern B.

Wait for user selection.

### Applying the selection

When generating concept prompts in Step 3:
- If copy elements are selected: include them with layout instructions ("Reserve appropriate visual space ONLY for the selected mandatory copy elements. Follow hierarchical order and ensure each element is legible.")
- If no copy selected: include "No mandatory copy required. Focus on visual composition, product showcase, and brand codes."
- Copy direction: "All marketing copy must directly address the viewing AUDIENCE. The copy speaks TO the viewer, not to characters within the scene."
- If FS Logo is selected: include in the prompt "Include the Funding Societies logo from the provided logo reference image. Place the logo with adequate clear space (minimum 1× logo mark width on all sides). Do not alter logo proportions, colors, or add effects."

## Step 2c — Select Style Preset

After visual elements are confirmed, use **Pattern E (Style Presets)** from `ask-user-protocol/SKILL.md`.

Present with a conversational intro covering: what step we're at (choosing the visual style), why visual style matters (it defines the entire look — composition, framing devices, subject treatment, mood), and your suggestion based on the campaign goal and target audience (see Pattern E in ask-user-protocol).

Then call AskUserQuestion with the 5 style options (Warm Showcase / Bold Professional / Tech Forward / Aspirational Shadow / Custom).

If "Custom" is selected, prompt for a free-text style description.

After selection, **read the reference image** for the chosen style from `style-presets/references/`. This ensures you understand the visual system before generating concepts.

Then ask whether to pass the style reference image to Gemini (see "Passing Reference Image to Gemini" in `style-presets/SKILL.md`). This is a separate AskUserQuestion.

Wait for both selections.

## Step 3 — Generate 3 Concept Variations

**Apply the selected style preset as the primary visual direction.** Read the style's definition from `style-presets/references/style-directory.md` and include its Prompt Injection Fragment in every concept prompt. The style defines required elements, composition, and layout. Concept levels (SAFE/BOLD/EXPERIMENTAL) control creative distance, not visual style.

Generate 3 creative concepts yourself:

### Level 1 — SAFE
Clean, proven layout. Product-forward with clear value proposition. Professional photography direction.

### Level 2 — BOLD
New visual metaphor. Rebuilt composition with a fresh storytelling angle. Product remains hero.

### Level 3 — EXPERIMENTAL
Genre-shift. Unexpected visual language. Only product identity and message persist.

For each concept, present: title, rationale, detailed image generation prompt (with FS brand colors and fonts injected, plus negative prompts: no gambling, casino, rockets, memes).
   - Negative prompts: no gambling, casino, rockets, memes, aggressive lending language, illegible text, generic stock photos

Then use **Pattern C (Concept Selection)** from `ask-user-protocol/SKILL.md`.

Present with the 4-section format. Level names for `/create`:
- Level 1: **Safe** — Clean, proven layout (~1 image, ~30s)
- Level 2: **Bold** — New visual metaphor (~1 image, ~30s)
- Level 3: **Experimental** — Genre-shift (~1 image, ~30s)
- All Three (~3 images, ~2 min)

Populate each option's `preview` field with the generated concept's title and first 2 sentences of rationale.

Wait for selection.

## Step 4 — Generate Images

### A/B Variants

If the user passed `--variants N` (default 2, max 4): after generating the base image for the selected concept, generate N-1 additional variations. Each variant uses the SAME base prompt with ONE targeted change:
- Variant 1: Base (original prompt)
- Variant 2: Alternate CTA text (e.g., "Apply Now" → "Get Started")
- Variant 3: Alternate colorway (warm → cool or vice versa)
- Variant 4: Headline emphasis shift (e.g., benefit-first → urgency-first)

Output filenames: `<campaign-slug>/<level>.png`, `<campaign-slug>/<level>-v2.png`, etc.

### Prompt Construction

Every image generation prompt MUST include these sections:

1. **Scene Description** — Full composition: background, foreground, subjects, layout
2. **Brand Constraints** — `Brand colors: Light Gray #F1F1F2, Yellow #FFDE0F, Purple #5203EA, Teal #27E4CD, Blue #2C50FF. Typography: Poppins SemiBold for headings, Inter Regular for body text.`
3. **Copy Elements** — Exact text to render: headline, support line, CTA button text
4. **Style Direction** — Mood, photography style, lighting, composition guidance
5. **Negative Prompts** — Always append: "Do not include gambling, casino, rockets, memes, aggressive lending language, illegible text, distorted faces, or generic stock photo aesthetics."


### Aspect Ratio Selection

Match `--ar` to target platform:
- Instagram Feed → 1:1
- Instagram Story/Reel, TikTok → 9:16
- Facebook Feed, LinkedIn Feed → 4:3
- YouTube Thumbnail, Google Leaderboard → 16:9

### Handoff from Concept-Generation

When the concept-generation skill produces concepts, each includes an "Image Generation Prompt" field. Use that prompt directly as the `--prompt` argument, after appending the brand-compliance prompt injection template. The concept also specifies `aspect_ratio` — pass it through as `--ar`.

### Prompt Transparency

Before calling the generation script, display the full prompt:

> **Prompt sent to Gemini:**
> [full prompt text]

If the user says "don't show prompts" or "hide prompts", omit this for subsequent generations within this command invocation.

### Script Execution

For each selected concept, run the script via Bash:

Build the `--ref` arguments based on Step 2b (visual elements) and Step 2c (style preset) selections:

```bash
${BUN_X} ${CLAUDE_PLUGIN_ROOT}/scripts/generate-image.ts \
  --prompt "<concept prompt with style injection, FS brand colors, Poppins/Inter fonts, negative prompts>" \
  --image "./ads-output/create/<campaign-slug>/<level>.png" \
  --ref <see ref logic below> \
  --ar "<from target platform>" \
  --json
```

**`--ref` logic (combine as needed):**
- Style reference selected → include `${CLAUDE_PLUGIN_ROOT}/skills/style-presets/references/<style-image>` with `--strength 0.3`
- FS Logo selected in Step 2b → include `${CLAUDE_PLUGIN_ROOT}/assets/fs-logo.png`
- User-provided logo via `$3` → use that instead of bundled logo
- Neither selected → omit `--ref` entirely (text-to-image mode)

Multiple refs can be passed together: `--ref <style-ref> <logo>`

**Runtime resolution**: If `bun` is installed, use `bun`. Otherwise use `npx -y bun`.

**Error handling**: Follow the error handling pattern in CLAUDE.md.

## Step 4b — Quality Review

After each image is generated, run the **quality self-review** from `quality-review/SKILL.md`. Read the generated image and evaluate for gross brand compliance failures and brief alignment. Auto-retry up to 2 times on gross failures. Present advisory warnings for fine-grained issues.

## Step 5 — Review

Present all generated image paths. Then use **Pattern D (Next Action)** from `ask-user-protocol/SKILL.md`.

Options for `/create`:
- **Regenerate** — Try again with modified brief or concept
- **Refine** — Make targeted changes (-> `/refine`)
- **Resize** — Adapt for additional platforms (-> `/resize`)

## Step 5b — Ad Caption Copy

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
