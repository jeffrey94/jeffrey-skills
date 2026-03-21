---
name: resize
description: Adapt an ad for different platform formats
argument-hint: <image-path> [platforms]
allowed-tools: Read, Bash, AskUserQuestion
---

# /resize

Adapt an ad creative for different platform formats with composition-aware recomposition.

**Follow `ask-user-protocol/SKILL.md` for all user decision points.** Every AskUserQuestion call must use the 4-section format (Re-ground, Simplify, Recommend, Options).

## Step 1 — Analyze Source

Read the image at `$1`. Analyze it directly — you are multimodal.

Determine:
- Source aspect ratio (from image dimensions)
- Key elements and their positions (headline, CTA, logo, product, background)
- Visual hierarchy and composition notes
- **Critical elements list** — label each: logo, headline, CTA, support line, trust signals, product image, etc.
- **Focal point summary** — one sentence describing the visual focus
- **Exact headline text** — verbatim from the image
- **Exact CTA text** — verbatim from the image
- **Color palette** — hex codes observed in the image

**Document all extracted details** — these are used verbatim in Step 3 prompts.

## Step 2 — Select Platforms

If `$2` is provided, parse platform names from it (e.g., "instagram linkedin tiktok").

Otherwise, use **Pattern A (Platform Selection)** from `ask-user-protocol/SKILL.md` with `multiSelect: true` on both steps.

**Step A — Category selection (multiSelect):**

Present with a conversational intro covering: what step we're at (resizing for multiple platforms), explaining that each platform gets an intelligent recomposition (not just a crop), and your suggestion based on the source ad's format (e.g., if source is 1:1, suggest Social Feed first). Then call AskUserQuestion with Social Feed / Social Story / Display / Video options with `multiSelect: true`.

**Step B — Specific platforms within each selected category (multiSelect):**

Batch the sub-selects into a single AskUserQuestion call (up to 4 questions, one per selected category). If a category has only 1 platform (Video -> YouTube), auto-include it.

Wait for selection.

## Platform Specs

| Key | Aspect Ratio | Description |
|-----|-------------|-------------|
| instagram-feed | 1:1 | Instagram Feed (1080x1080) |
| instagram-story | 9:16 | Instagram Story (1080x1920) |
| facebook-feed | 4:3 | Facebook Feed (1200x900) |
| facebook-story | 9:16 | Facebook Story (1080x1920) |
| linkedin-feed | 4:3 | LinkedIn Feed (1200x627) |
| linkedin-story | 9:16 | LinkedIn Story (1080x1920) |
| tiktok | 9:16 | TikTok (1080x1920) |
| youtube-thumbnail | 16:9 | YouTube Thumbnail (1280x720) |
| google-leaderboard | 16:9 | Leaderboard (728x90) |
| google-rectangle | 4:3 | Medium Rectangle (300x250) |
| google-skyscraper | 9:16 | Wide Skyscraper (160x600) |

## Step 3 — Generate Resized Versions

For each target platform, read `brand-compliance/references/platform-rules.md`
and apply the platform-specific rules to the recomposition prompt:
- Adjust text density per platform (e.g., Google Leaderboard = headline + CTA only)
- Respect safe zones (e.g., TikTok right-side buttons, story bottom overlay)
- Adapt CTA sizing per format (~40% feed, ~60% story)

Append the relevant platform constraints as an additional line in the recomposition
prompt, e.g.: "Apply [platform] safe zones and text density limits: [key rules
extracted from platform-rules.md]."

For each selected platform, run the script via Bash with composition context:

**Brand compliance**: Append the brand compliance prompt injection template from `brand-compliance/SKILL.md` to every generation prompt.

Use ratio descriptions for the prompt:
- 9:16 → "Vertical stories/reels format"
- 16:9 → "Wide format for YouTube/display"
- 1:1 → "Square format for feed posts"
- 4:3 → "Landscape format"
- 3:4 → "Portrait format"

```bash
${BUN_X} ${CLAUDE_PLUGIN_ROOT}/scripts/generate-image.ts \
  --prompt "Recompose this advertisement into a <ratio description> canvas. Keep all critical elements visible and readable: <critical element labels from Step 1>. Maintain original brand colours <hex palette from Step 1>. Ensure the focal point remains: <focal point summary from Step 1>. Keep the headline text intact: '<exact headline from Step 1>'. Preserve the CTA that reads '<exact CTA from Step 1>'. Do not translate or rewrite any text. Generate clean, legible typography and respect safe margins. Focus on intelligent layout changes rather than stylistic overhauls." \
  --image "./ads-output/resize/<platform-key>.png" \
  --ref "$1" \
  --ar "<aspect ratio>" \
  --json
```

Process platforms sequentially to avoid rate limits.

**Runtime resolution**: If `bun` is installed, use `bun`. Otherwise use `npx -y bun`.

**Error handling**:
- Rate limit (429) or service unavailable (503): wait 5 seconds, retry once
- Content policy violation: present the error, offer to modify the prompt
- No image data returned: retry with simplified prompt
- Other failures: log the error and continue with remaining platforms

See `brand-compliance/references/platform-rules.md` for detailed platform dimensions, safe zones, and layout guidance.

## Step 4 — Review

List all generated files with their platform specs:

| Platform | Dimensions | Aspect Ratio | Output Path |
|----------|-----------|--------------|-------------|
| ... | ... | ... | ... |

Then use **Pattern D (Next Action)** from `ask-user-protocol/SKILL.md`.

Options for `/resize`:
- **Regenerate** — Retry specific platforms
- **Refine** — Make targeted changes to a specific platform version (-> `/refine`)
