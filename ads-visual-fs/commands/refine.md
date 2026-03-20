---
name: refine
description: Refine specific elements of an ad while preserving the rest
argument-hint: <image-path> [changes]
allowed-tools: Read, Bash
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

Analyze the image directly for its element composition.

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

Generate an editable Gemini prompt from the proposal. The prompt should describe the changes to apply and elements to preserve. Show it to the user:

> **Review the change prompt and preservation list. Edit if needed, then confirm.**

Wait for confirmation.

## Step 4 — Generate Refined Images

Generate 3 variations by running the script via Bash, with slight prompt variations for diversity:

**Brand compliance**: Append the brand compliance prompt injection template from `brand-compliance/SKILL.md` to every generation prompt.

```bash
${BUN_X} ${CLAUDE_PLUGIN_ROOT}/scripts/generate-image.ts \
  --prompt "Refine this marketing ad. Apply ONLY these changes: <confirmed changes>. PRESERVE these elements exactly: <preserve list>. Maintain all other visual elements, colors, typography, and layout. DO NOT recreate the ad as an object in a new scene. Apply edits directly to the existing creative." \
  --image "./ads-output/refine/<description-slug>-v1.png" \
  --ref "$1" \
  --json
```

Add `reference-ad-shown-as-object-in-scene` to the negative prompts for all refine generation calls.

Repeat for v2 and v3 with slight prompt variations.

**Runtime resolution**: If `bun` is installed, use `bun`. Otherwise use `npx -y bun`.

**Error handling**:
- Rate limit (429) or service unavailable (503): wait 5 seconds, retry once
- Content policy violation: present the error, offer to modify the prompt
- No image data returned: retry with simplified prompt
- Other failures: present the error and offer to adjust the prompt

## Step 5 — Review

Present the output paths. Offer:

- **Further refine** — Apply additional changes
- **Resize** — Adapt for platforms (→ suggest `/resize`)
