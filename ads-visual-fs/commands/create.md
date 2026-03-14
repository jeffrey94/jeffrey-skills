---
name: create
description: Create a new ad from a marketing brief
allowed-tools: Read, mcp__ads-visual_gemini-ads__generate_ad_image
---

# /create

Generate brand-new ad creatives from a marketing brief with Funding Societies brand guidelines automatically applied.

## Step 1 — Gather Brief

Prompt the user for campaign details:

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

FS Brand colors to use: `#F1F1F2` (Light Gray), `#FFDE0F` (Yellow), `#5203EA` (Purple), `#27E4CD` (Teal), `#2C50FF` (Blue)
Fonts: Poppins SemiBold/Light for headings, Inter Regular/Bold for body
Strapline: "Stronger SMEs, Stronger Societies"

Present all copy to the user:

> **Review and edit the marketing copy below, then confirm.**

Wait for confirmation.

## Step 3 — Generate 3 Concept Variations

Generate 3 creative concepts yourself (do NOT call any MCP tool). Use the confirmed brief:

### Level 1 — SAFE
Clean, proven layout. Product-forward with clear value proposition. Professional photography direction.

### Level 2 — BOLD
New visual metaphor. Rebuilt composition with a fresh storytelling angle. Product remains hero.

### Level 3 — EXPERIMENTAL
Genre-shift. Unexpected visual language. Only product identity and message persist.

For each concept, present: title, rationale, detailed image generation prompt (with FS brand colors and fonts injected).

> **Which concepts would you like me to generate? (1, 2, 3, or all)**

Wait for selection.

## Step 4 — Generate Images

For each selected concept, call:

```
Tool: mcp__ads-visual_gemini-ads__generate_ad_image
Args: {
  prompt: "<concept prompt with FS brand colors (#F1F1F2, #FFDE0F, #5203EA, #27E4CD, #2C50FF), Poppins/Inter fonts, and negative prompts (no gambling, casino, rockets, memes)>",
  output_path: "./ads-output/create/<campaign-slug>/<level>.png",
  aspect_ratio: "<from target platform>"
}
```

If user provided a logo image, include it as `reference_image_path` with low `image_strength` (0.2) so it's used as a loose reference.

**Error handling**: If the MCP call fails, wait 5 seconds and retry once. If it still fails, present the error and offer to try a different prompt.

## Step 5 — Review

Present all generated image paths. Offer:

- **Regenerate** — Try again with modified brief or concept
- **Refine** — Make targeted changes (→ suggest `/refine`)
- **Resize** — Adapt for additional platforms (→ suggest `/resize`)
