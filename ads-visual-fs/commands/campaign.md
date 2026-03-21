---
name: campaign
description: Generate a full campaign set across multiple platforms from a single brief
argument-hint: [brief-file] [branding-guide] [logo] [--variants N]
allowed-tools: Read, Bash, AskUserQuestion
---

# /campaign

Generate a complete set of brand-compliant ad creatives across multiple platforms from a single brief. One concept, consistent visual language, every platform you need.

**Follow `ask-user-protocol/SKILL.md` for all user decision points.** Every AskUserQuestion call must use the 4-section format (Re-ground, Simplify, Recommend, Options).

## Step 1 — Gather Brief

Same as `/create` Step 1. If the user provides file paths, read them. Otherwise collect campaign details in two rounds:

### Round 1 — Structured choices (batched AskUserQuestion)

Use AskUserQuestion with 2 questions in a single call:

**Question 1 — Campaign Goal:**
- header: "Goal"
- options: Awareness / Lead Generation / Retargeting / Product Launch

**Question 2 — Target Market:**
- header: "Market"
- options: Singapore / Malaysia / Indonesia / Thailand

### Round 2 — Free-text inputs

Prompt the user for:
1. **Product/Service** — What is being advertised?
2. **Target Audience** — Who are we reaching?
3. **Key Message** — What is the one thing the audience should remember?
4. **Logo Image** (optional) — Path to a logo file

## Step 2 — Build Marketing Copy

Same as `/create` Step 2. Construct headline, support line, CTA, trust signals, regulatory disclaimer using FS brand guidelines. Present for confirmation.

## Step 2b — Select Visual Elements

Use **Pattern B (Visual Element Presets)** from `ask-user-protocol/SKILL.md`. Present with conversational intro and platform-aware suggestion.

## Step 3 — Generate 3 Concept Variations

Same as `/create` Step 3. Generate SAFE, BOLD, and EXPERIMENTAL concepts. Then use **Pattern C (Concept Selection)** — but always recommend selecting ONE concept (not "All Three") since `/campaign` will generate it across multiple platforms.

## Step 4 — Select Platforms

Use **Pattern A (Platform Selection)** from `ask-user-protocol/SKILL.md` with `multiSelect: true` on both steps.

**Step A — Category selection (multiSelect):**
Present with conversational intro: "Now let's pick where this ad will run. Each platform gets an intelligent recomposition — not just a crop. I'll adapt the layout, text density, and safe zones for each one."

**Step B — Specific platforms within each selected category (multiSelect):**
Batch into a single AskUserQuestion call (up to 4 questions, one per selected category).

### Variants Check

If the user passed `--variants N` (or mentions wanting A/B variants):
- Parse N (default 2, max 4).
- Calculate total: platforms × variants.
- If total > 12: prompt the user to reduce. "That's [total] images (platforms × variants). Max is 12 per /campaign run. Reduce platforms or variants?"
- If total ≤ 12: proceed.

Include cost context: "Generating for [N] platforms × [V] variants = [total] images. That takes about [total × 30]s plus QA review."

## Step 5 — Generate Campaign Set

### Prompt Adaptation

The concept prompt from Step 3 is generated ONCE. For each platform, adapt it:
- Change aspect ratio description and `--ar` flag
- Adjust text density per `brand-compliance/references/platform-rules.md`
- Apply platform-specific safe zones and constraints
- Keep everything else identical (same color treatment, hero style, CTA approach, concept title)

### Prompt Transparency

Display the full prompt for the **first platform only**:

> **Prompt sent to Gemini:**
> [full prompt text]

For subsequent platforms: "Same concept, adapted for [platform name] ([aspect ratio])."

If the user says "don't show prompts" or "hide prompts", omit for all platforms.

### Generation Loop

For each platform (and each variant if `--variants` is set):

1. Print progress: "Generating [current]/[total]: [Platform Name]..."
2. Run the generation script:

```bash
${BUN_X} ${CLAUDE_PLUGIN_ROOT}/scripts/generate-image.ts \
  --prompt "<adapted concept prompt with FS brand constraints>" \
  --image "./ads-output/campaign/<campaign-slug>/<platform-key>.png" \
  --ar "<platform aspect ratio>" \
  --json
```

If FS Logo was selected, add `--ref ${CLAUDE_PLUGIN_ROOT}/assets/fs-logo.png`. If the user provided a logo via argument, use that instead.

If generating variants, append variant suffix: `<platform-key>-v1.png`, `<platform-key>-v2.png`. Each variant uses the SAME base prompt with ONE targeted change (alternate CTA text, warm vs cool colorway, or headline emphasis shift).

3. Print result: "✓ [Platform Name] — saved to [path]" or "✗ [Platform Name] — [error]"
4. Run quality self-review from `quality-review/SKILL.md`. Auto-retry up to 2 times on gross failures.
5. Wait 2 seconds before next platform (rate-limit prevention).

### Error Mid-Batch

If a platform fails after max retries: log the error and **continue** to the next platform. Do NOT abort the entire batch.

**Error handling**: Follow the error handling pattern in CLAUDE.md.

## Step 6 — Review

Present all results:

**Successful:**
| Platform | Variant | Aspect Ratio | Output Path |
|----------|---------|-------------|-------------|
| ... | ... | ... | ... |

**Failed (if any):**
| Platform | Error |
|----------|-------|
| ... | ... |

Then use **Pattern D (Next Action)** from `ask-user-protocol/SKILL.md`.

Options for `/campaign`:
- **Regenerate** — Retry failed platforms or regenerate specific ones
- **Refine** — Make targeted changes to a specific platform result (-> `/refine`)

## Step 6b — Ad Caption Copy

Provide the full marketing copy formatted for each platform's caption field. The copy content is the same across platforms; format may vary (e.g., LinkedIn can be longer).

Present alongside the generated image paths.
