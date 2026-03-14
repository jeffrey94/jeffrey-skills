---
name: image-generation
description: >
  Activates when generating images from text prompts without a reference image (text-to-image).
  Guides prompt construction and MCP tool usage for the Create workflow. This is a shared
  capability, not a user-facing workflow.
metadata:
  version: "0.2.0"
---

# Image Generation (Text-to-Image)

Generate ad images from text prompts without a reference image. Used by the Create workflow.

## When This Activates

This skill provides guidance when you need to call the `generate_ad_image` MCP tool WITHOUT a reference image (pure text-to-image generation).

## MCP Tool

```
Tool: mcp__ads-visual_gemini-ads__generate_ad_image
Args: {
  prompt: "<detailed prompt>",
  output_path: "./ads-output/create/<campaign>/<name>.png",
  aspect_ratio: "<from target platform>"
}
```

Note: No `reference_image_path` — this is text-to-image only.

## Prompt Construction

Every prompt MUST include:

### 1. Scene Description
Describe the full composition: background, foreground, subjects, layout.

### 2. Brand Constraints
```
Brand colors: Light Gray #F1F1F2, Yellow #FFDE0F, Purple #5203EA, Teal #27E4CD, Blue #2C50FF.
Typography: Poppins SemiBold for headings, Inter Regular for body text.
```

### 3. Copy Elements
Include exact text to render: headline, support line, CTA button text.

### 4. Style Direction
Mood, photography style, lighting, and composition guidance.

### 5. Negative Prompts
Always append: "Do not include gambling, casino, rockets, memes, aggressive lending language, illegible text, distorted faces, or generic stock photo aesthetics."

## Aspect Ratio Selection

Match to target platform:
- Instagram Feed → 1:1
- Instagram Story/Reel, TikTok → 9:16
- Facebook Feed, LinkedIn Feed → 4:3
- YouTube Thumbnail, Google Leaderboard → 16:9

## Handoff from Concept-Generation

When the concept-generation skill produces concepts, each includes an "Image Generation Prompt" field. Use that prompt directly as the `prompt` argument to the MCP tool, after appending the brand-compliance prompt injection template. The concept also specifies `aspect_ratio` — pass it through to the MCP call.

## Error Handling

If Gemini returns an error:
1. Wait 5 seconds
2. Retry once with the same prompt
3. If still fails, present the error and offer to modify the prompt
