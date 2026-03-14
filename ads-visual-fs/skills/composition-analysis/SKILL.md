---
name: composition-analysis
description: >
  Activates when analyzing visual elements, layout, bounding boxes, or spatial composition
  of an ad image. Maps elements with positions for refine and resize workflows. This is a
  shared analysis capability, not a user-facing workflow.
metadata:
  version: "0.2.0"
---

# Composition Analysis

Structured element mapping and spatial analysis of ad visuals. Used by Refine and Resize workflows.

## When This Activates

This skill provides domain expertise when you need to map the visual elements of an ad for refinement or resizing. You perform this analysis directly using your multimodal capabilities — do NOT call any MCP tool.

## Element Mapping

Identify and map all visible elements with their approximate positions:

### Copy Elements
| Element | Position | Content | Size |
|---------|----------|---------|------|
| H1 Headline | top-center | "..." | large |
| Support Line | below headline | "..." | medium |
| CTA Button | bottom-center | "Apply Now" | medium |
| Trust Signal | near CTA | "Licensed by MAS" | small |
| Legal Text | bottom | "CMS101541..." | tiny |

### Visual Elements
| Element | Position | Description |
|---------|----------|-------------|
| Logo | top-left | FS full-color logotype |
| Background | full | gradient #5203EA → #2C50FF |
| Product Image | center-right | SME owner in shop |
| Icons/Badges | near CTA | shield trust icon |

## Spatial Analysis

- **Visual Hierarchy**: What draws the eye first → second → third?
- **Whitespace Distribution**: Where is breathing room? Where is it cramped?
- **Balance**: Is the composition left-heavy, right-heavy, centered?
- **Safe Zones**: For platform resizing — what's in the danger zones?

## For Refine Workflows

Map user's change intent to specific elements:
- Which elements will be modified?
- Which elements must be preserved exactly?
- What's the blast radius of the proposed change?

## For Resize Workflows

Provide recomposition guidance:
- Which elements are essential vs. optional for tight formats?
- Priority ranking: what to keep if space is limited?
- How should the hierarchy adapt to different aspect ratios?
