---
name: marketing-analysis
description: >
  Activates when performing marketing inference on an ad image — extracting product/service,
  core message, target audience, brand codes, and mandatory copy from a visual. This is a
  shared analysis capability, not a user-facing workflow.
metadata:
  version: "0.2.0"
---

# Marketing Analysis

Structured marketing inference from ad visuals. Used by the Reimagine workflow.

## When This Activates

This skill provides domain expertise when you need to analyze an ad image for marketing insights. You perform this analysis directly using your multimodal capabilities — do NOT call any MCP tool.

## Analysis Framework

For each field, generate up to 5 candidate options ranked by confidence:

### Product/Service
- What is being advertised?
- Evidence: text overlays, product imagery, brand marks, URLs

### Core Message
- What is the key marketing message?
- Evidence: headlines, taglines, visual metaphors, emotional tone

### Target Audience
- Who is this aimed at?
- Evidence: demographics in imagery, language register, platform cues, lifestyle signals

### Brand Codes
- **Color Palette**: Extract hex values, assign roles (primary/secondary/accent)
- **Typography**: Identify font families (or closest guess), weights, sizing hierarchy
- **Visual Rules**: Do's and don'ts inferred from the design language

### Mandatory Copy
- **H1 Headline**: Primary attention text
- **Support Line**: Secondary detail or proof
- **CTA Label**: Call-to-action button text
- **Trust Microcopy**: License numbers, track record, social proof
- **Legal/Disclaimer**: Regulatory fine print

## Output Format

Present each insight as:

| Field | Inference | Confidence | Evidence |
|-------|-----------|------------|----------|
| ... | ... | 0.85 | text overlay: "...", visual: ... |

Always flag uncertainties and assumptions separately.

## Confirmation Gate

After presenting analysis, always ask the user to confirm or edit insights before they are used downstream. This is critical — never proceed automatically.
