---
name: resize
description: Adapt an ad for different platform formats
argument-hint: <image-path> [platforms]
allowed-tools: Read, mcp__ads-visual_gemini-ads__resize_ad_image
---

# /resize

Adapt an ad creative for different platform formats with composition-aware recomposition.

## Step 1 — Analyze Source

Read the image at `$1`. Analyze it directly — you are multimodal.

Determine:
- Source aspect ratio (from image dimensions)
- Key elements and their positions (headline, CTA, logo, product, background)
- Visual hierarchy and composition notes

Present a brief composition summary.

## Step 2 — Select Platforms

If `$2` is provided, parse platform names from it (e.g., "instagram linkedin tiktok").

Otherwise, present the platform menu and ask the user to select:

**Social Media:**
- [ ] Instagram Feed (1:1)
- [ ] Instagram Story/Reel (9:16)
- [ ] Facebook Feed (4:3)
- [ ] Facebook Story (9:16)
- [ ] LinkedIn Feed (4:3)
- [ ] LinkedIn Story (9:16)
- [ ] TikTok (9:16)

**Display & Video:**
- [ ] YouTube Thumbnail (16:9)
- [ ] Google Display Leaderboard (16:9)
- [ ] Google Display Rectangle (4:3)
- [ ] Google Display Skyscraper (9:16)

> **Select platforms (comma-separated numbers or names):**

Wait for selection.

## Step 3 — Generate Resized Versions

For each selected platform, call the MCP tool with composition context:

```
Tool: mcp__ads-visual_gemini-ads__resize_ad_image
Args: {
  image_path: "$1",
  platform: "<platform-key>",
  output_path: "./ads-output/resize/<platform-key>.png",
  composition_notes: "<element positions and hierarchy from Step 1>"
}
```

Process platforms sequentially to avoid rate limits.

**Error handling**: If an MCP call fails, wait 5 seconds and retry once. If it still fails, log the error and continue with remaining platforms.

## Step 4 — Review

List all generated files with their platform specs:

| Platform | Dimensions | Aspect Ratio | Output Path |
|----------|-----------|--------------|-------------|
| ... | ... | ... | ... |

Offer:
- **Regenerate** — Retry specific platforms
- **Refine** — Make targeted changes to a specific platform version (→ suggest `/refine`)
