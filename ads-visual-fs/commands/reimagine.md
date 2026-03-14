---
name: reimagine
description: Reimagine an existing ad with 3 concept variations (SAFE/BOLD/EXPERIMENTAL)
argument-hint: <image-path>
allowed-tools: Read, mcp__ads-visual_gemini-ads__generate_ad_image
---

# /reimagine

Transform an existing ad creative into fresh concept variations at three conceptual levels.

## Step 1 — Analyze the Source Ad

Read the image at `$1`. You are multimodal — analyze it directly. Do NOT call any MCP tool for analysis.

Perform marketing inference on the image. For each insight below, provide a label, rationale, confidence score (0–1), and evidence tags:

- **Product/Service** — What is being advertised?
- **Core Message** — What is the key marketing message?
- **Target Audience** — Who is this aimed at?
- **Brand Codes** — Colors (hex), fonts, visual rules observed
- **Mandatory Copy** — Headlines, CTAs, trust signals, legal text visible

Present results in a structured table. Then ask:

> **Please confirm or edit these insights before I generate concepts.**

Wait for user confirmation. Do NOT proceed until the user confirms.

## Step 2 — Generate 3 Concept Variations

Using the confirmed insights, generate 3 creative concept variations. Do NOT call any MCP tool — generate these yourself.

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

For each selected concept, call the MCP tool:

```
Tool: mcp__ads-visual_gemini-ads__generate_ad_image
Args: {
  prompt: "<concept prompt with FS brand constraints>",
  reference_image_path: "$1",
  output_path: "./ads-output/reimagine/<concept-title-slug>.png",
  image_strength: <from concept settings>,
  aspect_ratio: "<auto-detected from source>"
}
```

**Error handling**: If the MCP call fails (rate limit, content policy), wait 5 seconds and retry once. If it still fails, present the error and offer to try a different prompt.

## Step 4 — Review

Present the output file paths. Then offer:

- **Regenerate** — Try again with a modified prompt
- **Refine** — Make targeted changes to a result (→ suggest `/refine`)
- **Resize** — Adapt results for platforms (→ suggest `/resize`)
