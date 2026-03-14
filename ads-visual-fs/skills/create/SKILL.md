---
name: create
description: >
  Activates when the user wants to create an ad from scratch, design a new ad, generate ad creative
  from a brief, build a campaign visual, or says things like "create an ad for", "design an ad",
  "make a new ad", "generate marketing visuals for", "I need an ad for our SME loan product".
metadata:
  version: "0.2.0"
---

# Create Ad from Brief

Generate brand-new ad creatives from a marketing brief with Funding Societies brand guidelines automatically applied.

## Trigger

This skill auto-activates when the user wants to create a new ad without an existing reference image.

## Workflow

Follow the exact same workflow as the `/create` command. Read the command at `../../commands/create.md` for the full orchestration steps.

The key steps are:

1. **Gather Brief** — Collect: product/service, campaign goal, target audience, key message, target market (SG/MY/ID/TH/VN), target platform, optional logo path.
2. **Build Copy** — YOU construct marketing copy using FS brand guidelines: H1, support line, CTA, trust signals, regulatory disclaimer. Present for user review and confirmation.
3. **Generate Concepts** — YOU generate 3 concept variations (SAFE/BOLD/EXPERIMENTAL). Present for user selection.
4. **Generate Images** — Call `mcp__ads-visual_gemini-ads__generate_ad_image` (text-to-image, no reference) with FS brand constraints in prompt.
5. **Review** — Present outputs. Offer to refine or resize.

## Important

- YOU do all concept generation and copy writing. The MCP server is ONLY for image generation.
- Always inject FS brand colors (#F1F1F2, #FFDE0F, #5203EA, #27E4CD, #2C50FF) and Poppins/Inter fonts.
- Always include negative prompts in every MCP call: no gambling, casino, rockets, memes, illegible text, aggressive lending.
- Always append the brand-compliance prompt injection template to all MCP prompts.
- Include market-specific regulatory disclaimer.
- If user provides a logo image path, include it as `reference_image_path` with `image_strength: 0.2` so Gemini uses it as a loose visual reference without dominating the output.
- Set `aspect_ratio` from the target platform selected in the brief (e.g., Instagram Feed → `1:1`, Story → `9:16`, LinkedIn → `4:3`).
- User confirmation required at copy review and concept selection steps.
- If Gemini fails, wait 5s and retry once.
