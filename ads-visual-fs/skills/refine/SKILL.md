---
name: refine
description: >
  Activates when the user wants to refine an ad, edit ad elements, change a headline, adjust a CTA,
  modify ad colors, tweak an ad creative, update copy, or says things like "change the headline",
  "make the CTA more urgent", "adjust the colors", "edit this ad", "tweak this creative".
metadata:
  version: "0.2.0"
---

# Refine Ad Elements

Make targeted changes to specific elements of an existing ad creative while preserving everything else.

## Trigger

This skill auto-activates when the user provides an ad image and describes specific changes. Look for the image path and change description in their message.

## Workflow

Follow the exact same workflow as the `/refine` command. Read the command at `../../commands/refine.md` for the full orchestration steps.

The key steps are:

1. **Collect Intent** — Read image, get change description from user or their message.
2. **Analyze Composition** — YOU analyze the image directly for element mapping (headline, CTA, logo, background, etc. with positions). Present the element map.
3. **Propose Changes** — Map intent to elements, present proposed changes table, show editable prompt and preserve list. Get confirmation.
4. **Generate** — Call `mcp__ads-visual_gemini-ads__refine_ad_element` three times (v1, v2, v3) with slight prompt variations to produce diverse results. Use different phrasing or emphasis for each variation while keeping the core intent the same. Pass `preserve_elements` as an array of strings (e.g., `["logo", "background", "product image"]`). Save to `./ads-output/refine/<description>-v1.png`, `-v2.png`, `-v3.png`.
5. **Review** — Present all 3 output paths. Offer further refine or resize.

## Important

- YOU do all composition analysis. The MCP server is ONLY for image editing.
- Always validate against FS brand guidelines before generating.
- User confirmation required before generating.
- If Gemini fails, wait 5s and retry once.
- Always append the brand-compliance prompt injection template to all MCP prompts.
