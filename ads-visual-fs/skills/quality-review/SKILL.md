---
name: quality-review
description: >
  Activates after image generation to evaluate the output against brand compliance
  and brief alignment. Runs as step 5b in the standard workflow — between Generate
  and Review. Auto-retries on gross brand failures; advisory-only for fine-grained issues.
metadata:
  version: "0.9.0"
---

# Quality Self-Review

Evaluate generated ad images for brand compliance and brief alignment before presenting to the user.

## When This Activates

Automatically after every image generation call in any command (create, reimagine, refine, resize, competitor-reference, campaign). This is step 5b in the workflow — between Generate (step 5) and Review (step 6).

## How It Works

After an image is generated and saved to disk:

1. **Read the generated image** — You are multimodal. View the image directly.
2. **Evaluate** against two dimensions (see below).
3. **Decide**: PASS, WARN, or FAIL.

## Evaluation Dimensions

### Brand Compliance (coarse-grained — can trigger auto-retry)

Check for **gross failures only**. LLM vision cannot reliably detect exact hex values or measure pixel-level spacing. Only flag obvious misses:

- **Color palette**: Is the dominant color family clearly wrong? (e.g., red/green when it should be purple/yellow/teal). Do NOT try to match exact hex codes.
- **Logo presence**: If the logo was requested, is it visibly present? (Not checking clear space or proportions — just existence.)
- **Disclaimer**: If a regulatory disclaimer was requested, is text visible in the bottom area? (Not checking exact wording.)
- **Off-concept**: Does the image clearly not match what was requested? (e.g., asked for a professional SME loan ad, got a landscape photo.)

### Brief Alignment (advisory only — never triggers auto-retry)

- Does the image generally match the requested concept direction?
- Is the overall mood/tone appropriate? (professional vs casual)
- Are the right elements present? (product, people, abstract graphics)

### Fine-Grained Issues (advisory only — never triggers auto-retry)

- Text legibility — can the headline be read?
- Composition quality — is the layout balanced?
- Exact color matching — are specific hex values correct?
- Logo clear space — is there enough margin?
- Typography accuracy — correct font rendering?

## Decision Logic

```
IF gross brand failure (wrong colors, missing logo, off-concept):
  → FAIL → auto-retry (max 2 retries per image)
  → On retry: append to prompt "IMPORTANT: The previous generation had [specific issue].
    Ensure this attempt corrects it."

IF fine-grained or brief alignment issues only:
  → WARN → present image to user with advisory warnings
  → Example: "Note: The headline text may not be fully legible at small sizes."

IF no issues:
  → PASS → present image to user normally
```

## Max Retries

- **2 auto-retries** per image. After 2 failures, present the best attempt with warnings listing what failed QA.
- "Best attempt" = the last generated image (most recent retry).
- Format warnings as: "QA warnings: [bullet list of issues found]"

## What NOT to Do

- Do NOT try to match exact hex color values from the image
- Do NOT measure pixel distances or proportions
- Do NOT judge text rendering accuracy (AI image gen has known text limitations)
- Do NOT block the user from seeing an image that has only advisory issues
- Do NOT re-run QA on retried images more than twice total
