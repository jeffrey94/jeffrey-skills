---
name: create
description: Create a new ad from a marketing brief
argument-hint: [brief-file] [branding-guide] [logo]
allowed-tools: Read, Bash
---

# /create

Generate brand-new ad creatives from a marketing brief with Funding Societies brand guidelines automatically applied.

## Step 1 — Gather Brief

If the user provides file paths (PDFs, docs, images), read them directly to extract campaign details instead of asking questions. If `$1` is a brief document, read it. If `$2` is a branding guide, read it. If `$3` is a logo, use it as reference.

If no files are provided, prompt the user for campaign details:

1. **Product/Service** — What is being advertised? (e.g., SME business loan, invoice financing)
2. **Campaign Goal** — Awareness, lead generation, retargeting, or product launch?
3. **Target Audience** — Who are we reaching? (e.g., SME owners in Singapore)
4. **Key Message** — What is the one thing the audience should remember?
5. **Target Market** — SG, MY, ID, TH, or VN?
6. **Target Platform** — Where will this run? (determines aspect ratio)
7. **Logo Image** (optional) — Path to a logo file to include as reference

Collect all answers before proceeding.

## Step 2 — Build Marketing Copy

Using the brief and FS brand guidelines, construct:

- **H1 Headline** — Primary text (under 8 words)
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

After copy is confirmed, ask the user which elements should be rendered in the visual:

**Copy Elements:**
- [ ] **H1 Headline**: "<confirmed text>"
- [ ] **Support Line**: "<confirmed text>"
- [ ] **CTA Label**: "<confirmed text>"
- [ ] **Trust Signals**: "<confirmed text>"
- [ ] **Regulatory Disclaimer**: "<confirmed text>"

**Brand Elements:**
- [ ] **FS Logo**: Include Funding Societies logo

> **Which elements should appear in the generated visuals? Select all that apply, or choose 'none' for visual-only output.**

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

> **Which concepts would you like me to generate? (1, 2, 3, or all)**

Wait for selection.

## Step 4 — Generate Images

### Prompt Construction

Every image generation prompt MUST include these sections:

1. **Scene Description** — Full composition: background, foreground, subjects, layout
2. **Brand Constraints** — `Brand colors: Light Gray #F1F1F2, Yellow #FFDE0F, Purple #5203EA, Teal #27E4CD, Blue #2C50FF. Typography: Poppins SemiBold for headings, Inter Regular for body text.`
3. **Copy Elements** — Exact text to render: headline, support line, CTA button text
4. **Style Direction** — Mood, photography style, lighting, composition guidance
5. **Negative Prompts** — Always append: "Do not include gambling, casino, rockets, memes, aggressive lending language, illegible text, distorted faces, or generic stock photo aesthetics."

See `${CLAUDE_PLUGIN_ROOT}/scripts/references/prompt-patterns.md` for reusable prompt templates (product-forward, lifestyle, data-driven) and FS brand color usage guide.

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

**Error handling**: If the script fails, wait 5 seconds and retry once. If it still fails, present the error and offer to modify the prompt. If a content policy violation occurs, present the error and offer to adjust the prompt language.

## Step 5 — Review

Present all generated image paths. Offer:

- **Regenerate** — Try again with modified brief or concept
- **Refine** — Make targeted changes (→ suggest `/refine`)
- **Resize** — Adapt for additional platforms (→ suggest `/resize`)
