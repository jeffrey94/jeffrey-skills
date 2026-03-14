---
name: image-editing
description: >
  Activates when transforming, refining, or resizing an existing image using a reference.
  Guides MCP tool usage for image-to-image generation, element refinement, and platform
  resizing. This is a shared capability, not a user-facing workflow.
metadata:
  version: "0.2.0"
---

# Image Editing (Image-to-Image)

Transform, refine, or resize existing ad images. Used by Reimagine, Refine, and Resize workflows.

## When This Activates

This skill provides guidance when you need to call MCP tools WITH a reference image:
- `generate_ad_image` with `reference_image_path` (Reimagine)
- `refine_ad_element` (Refine)
- `resize_ad_image` (Resize)

## MCP Tools

### For Reimagine (image-to-image with concept)

```
Tool: mcp__ads-visual_gemini-ads__generate_ad_image
Args: {
  prompt: "<concept prompt>",
  reference_image_path: "<original image>",
  output_path: "./ads-output/reimagine/<name>.png",
  image_strength: <0.55-0.95 based on concept level>,
  aspect_ratio: "<auto-detected from source>"
}
```

### For Refine (targeted element changes)

```
Tool: mcp__ads-visual_gemini-ads__refine_ad_element
Args: {
  image_path: "<source image>",
  instructions: "<specific changes>",
  output_path: "./ads-output/refine/<name>.png",
  preserve_elements: ["logo", "background", ...]
}
```

### For Resize (platform adaptation)

```
Tool: mcp__ads-visual_gemini-ads__resize_ad_image
Args: {
  image_path: "<source image>",
  platform: "<platform-key>",
  output_path: "./ads-output/resize/<platform>.png",
  composition_notes: "<element positions and hierarchy>"
}
```

## Image Strength Guide

| Strength | Effect | Use When |
|----------|--------|----------|
| 0.55–0.65 | Close to original | SAFE concepts, minor variations |
| 0.70–0.80 | Moderate transformation | BOLD concepts, new composition |
| 0.85–0.95 | Major transformation | EXPERIMENTAL concepts, genre shifts |

## Error Handling

1. If Gemini returns rate limit (429) or service unavailable (503): wait 5 seconds, retry once
2. If content policy violation: present the error, offer to modify the prompt
3. If no image data returned: retry with simplified prompt
