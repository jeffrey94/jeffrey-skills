---
name: create
description: Create a new ad from a marketing brief
argument-hint: [brief-file] [branding-guide] [logo]
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

Present the AskUserQuestion with the 4-section format:
- **Re-ground:** State the command, confirmed copy summary, target platform.
- **Simplify:** Explain what "on visual vs. in caption" means for ad performance. Reference platform-rules.md for the target platform (e.g., Meta's < 20% text rule).
- **Recommend:** Based on the target platform (see Pattern B recommendation table in ask-user-protocol).
- **Options:** Minimal / Standard (Recommended) / Full / Custom — with preview fields showing element breakdowns.

If the user selects "Custom", follow up with the multiSelect AskUserQuestion defined in Pattern B.

Wait for user selection.

### Applying the selection

When generating concept prompts in Step 3:
- If copy elements are selected: include them with layout instructions ("Reserve appropriate visual space ONLY for the selected mandatory copy elements. Follow hierarchical order and ensure each element is legible.")
- If no copy selected: include "No mandatory copy required. Focus on visual composition, product showcase, and brand codes."
- Copy direction: "All marketing copy must directly address the viewing AUDIENCE. The copy speaks TO the viewer, not to characters within the scene."
- If FS Logo is selected: include in the prompt "Include the Funding Societies logo from the provided logo reference image. Place the logo with adequate clear space (minimum 1× logo mark width on all sides). Do not alter logo proportions, colors, or add effects."

## Step 3 — Generate 3 Concept Variations

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

### Script Execution

For each selected concept, run the script via Bash:

```bash
# If FS Logo was NOT selected in Step 2b (and no user-provided logo):
${BUN_X} ${CLAUDE_PLUGIN_ROOT}/scripts/generate-image.ts \
  --prompt "<concept prompt with FS brand colors (#F1F1F2, #FFDE0F, #5203EA, #27E4CD, #2C50FF), Poppins/Inter fonts, and negative prompts>" \
  --image "./ads-output/create/<campaign-slug>/<level>.png" \
  --ar "<from target platform>" \
  --json

# If FS Logo WAS selected in Step 2b:
${BUN_X} ${CLAUDE_PLUGIN_ROOT}/scripts/generate-image.ts \
  --prompt "<concept prompt with FS brand colors, Poppins/Inter fonts, and negative prompts>" \
  --image "./ads-output/create/<campaign-slug>/<level>.png" \
  --ref ${CLAUDE_PLUGIN_ROOT}/assets/fs-logo.png \
  --ar "<from target platform>" \
  --json
```

If the user also provided their own logo image via `$3`, use that instead of the bundled logo: `--ref <user-logo-path>`.

**Runtime resolution**: If `bun` is installed, use `bun`. Otherwise use `npx -y bun`.

**Error handling**:
- Rate limit (429) or service unavailable (503): wait 5 seconds, retry once
- Content policy violation: present the error, offer to modify the prompt
- No image data returned: retry with simplified prompt
- Other failures: present the error and offer to try a different prompt

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
