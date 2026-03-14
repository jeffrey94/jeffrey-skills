---
name: refine
description: Refine specific elements of an ad while preserving the rest
argument-hint: <image-path> [description of changes]
allowed-tools: Read, mcp__ads-visual_gemini-ads__refine_ad_element
---

# /refine

Make targeted changes to specific elements of an existing ad creative while preserving everything else.

## Step 1 — Collect Intent

Read the image at `$1`. You are multimodal — view it directly.

If `$2` is provided, use it as the change description. Otherwise, ask:

> **What would you like to change in this ad?**
>
> Examples: "make CTA more urgent", "change headline to '48-Hour Funding'", "use warmer colors", "move logo to bottom-right"

Wait for the user's response.

## Step 2 — Analyze Composition

Analyze the image directly for its element composition. Do NOT call any MCP tool for analysis.

Map all visible elements with approximate positions:
- Headline (text content, position)
- Support line / body copy
- CTA button (text, position, color)
- Logo (position, size)
- Background (type: solid, gradient, image)
- Product/service imagery
- Trust signals / badges
- Legal / disclaimer text

Present the element map to the user.

## Step 3 — Propose Changes

Map the user's intent to specific elements. Present:

| Element | Current State | Proposed Change |
|---------|--------------|-----------------|
| ... | ... | ... |

**Elements to preserve:** (list all elements NOT being changed)

Generate an editable Gemini prompt from the proposal. Show it to the user:

> **Review the change prompt and preservation list. Edit if needed, then confirm.**

Wait for confirmation.

## Step 4 — Generate Refined Images

Call the MCP tool to generate 3 variations:

```
Tool: mcp__ads-visual_gemini-ads__refine_ad_element
Args: {
  image_path: "$1",
  instructions: "<confirmed changes>",
  output_path: "./ads-output/refine/<description-slug>-v1.png",
  preserve_elements: ["<confirmed preservation list>"]
}
```

Repeat for v2 and v3 with slight prompt variations for diversity.

**Error handling**: If the MCP call fails, wait 5 seconds and retry once. If it still fails, present the error and offer to adjust the prompt.

## Step 5 — Review

Present the output paths. Offer:

- **Further refine** — Apply additional changes
- **Resize** — Adapt for platforms (→ suggest `/resize`)
