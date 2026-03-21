# AskUserQuestion Protocol

Standardized format for every user decision point across all ads-visual-fs commands. This skill ensures consistent, low-friction interactions that guide users to good creative decisions.

## When This Activates

Automatically during ANY command workflow when a user decision is needed. Do NOT use this for free-text inputs (product name, key message, audience, copy editing, file paths) — those stay as regular text prompts.

---

## The 4-Section Format

**ALWAYS output this text block before every AskUserQuestion tool call:**

### 1. Re-ground
State the command being run, the campaign/ad context accumulated so far, and what step we're at. Keep it to 1-2 sentences. This prevents "wait, what are we doing?" drift.

### 2. Simplify
Explain the decision in plain English a marketing manager would understand. No prompt engineering jargon, no internal parameter names. Say what each choice **does for the ad**, not what it's called internally. Use concrete examples and analogies.

### 3. Recommend
Format: `RECOMMENDATION: Choose [X] because [one-line reason tied to campaign goal or platform best practice].`

Always tie the recommendation to something concrete:
- Platform best practices (reference `brand-compliance/references/platform-rules.md`)
- Campaign goal alignment (awareness → different choice than lead gen)
- Industry norms for the target market

### 4. Options
Lettered options: `A) ... B) ... C) ...`

When an option triggers image generation, show the cost:
- Single concept: `(~1 image, ~30s)`
- All concepts: `(~3 images, ~2 min)`
- Multi-platform resize: `(~N images, ~N min)`

Then immediately call the AskUserQuestion tool with matching options.

---

## Example (from /create, Step 2b)

```
**Re-ground:** We're creating an Instagram Feed ad for SME Business Loan SG.
Copy is confirmed: "Fund Growth Fast" / "Apply Now". Now choosing what text
goes on the image itself vs. the caption.

**Simplify:** Instagram penalizes ads with too much text on the image — fewer
people see it and it costs more per impression. Putting details in the caption
keeps the visual clean and lets the algorithm show your ad to more people.

**Recommend:** RECOMMENDATION: Choose B) Standard because it balances brand
presence (logo + disclaimer) with a clean layout, matching Instagram's
< 20% text guideline.

**Options:**
A) Minimal — headline + CTA only (cleanest visual)
B) Standard — headline + CTA + logo + disclaimer (recommended balance)
C) Full — all elements on the image (best for LinkedIn or print)
D) Custom — I'll pick specific elements
```

Then call AskUserQuestion with these 4 options.

---

## Shared Decision Patterns

### Pattern A — Platform Selection

**Two-step selection** (because 11 platforms exceed AskUserQuestion's 4-option limit).

**Step 1 — Category:**

Use AskUserQuestion with these options:

| Label | Header | Description |
|-------|--------|-------------|
| Social Feed | FEED | Instagram Feed (1:1), Facebook Feed (4:3), LinkedIn Feed (4:3) |
| Social Story | STORY | Instagram Story/Reel (9:16), Facebook Story (9:16), LinkedIn Story (9:16), TikTok (9:16) |
| Display Ads | DISPLAY | Google Leaderboard (16:9), Rectangle (4:3), Skyscraper (9:16) |
| Video | VIDEO | YouTube Thumbnail (16:9) |

For the **Recommend** section, reference the campaign goal:
- Awareness campaigns → Social Feed or Social Story (broadest reach)
- Lead gen → LinkedIn Feed or Social Feed (conversion-optimized)
- Retargeting → Display Ads (follows users across sites)
- Product launch → Social Story or Video (highest engagement)

**Step 2 — Specific platform within category:**

Use AskUserQuestion with the platforms in the selected category. If the category has only 1 platform (Video → YouTube Thumbnail), auto-select it and skip this step.

Social Feed options:

| Label | Header | Description |
|-------|--------|-------------|
| Instagram Feed | 1:1 | 1080x1080 — single focal point, reduced layout |
| Facebook Feed | 4:3 | 1200x900 — same rules as Instagram, slightly wider |
| LinkedIn Feed | 4:3 | 1200x627 — professional, more text-tolerant (up to 7 words headline) |

Social Story options:

| Label | Header | Description |
|-------|--------|-------------|
| Instagram Story | 9:16 | 1080x1920 — safe zone middle 66%, can add one support line |
| Facebook Story | 9:16 | 1080x1920 — same safe zones as Instagram Story |
| LinkedIn Story | 9:16 | 1080x1920 — professional tone, same safe zones |
| TikTok | 9:16 | 1080x1920 — minimal text, authentic feel, right-side safe zone |

Display options:

| Label | Header | Description |
|-------|--------|-------------|
| Leaderboard | 16:9 | 728x90 — headline + CTA only, extremely compact |
| Medium Rectangle | 4:3 | 300x250 — headline + CTA + logo + one product image |
| Wide Skyscraper | 9:16 | 160x600 — vertical stack, 2-3 words per line max |

**For `/resize` only:** Use `multiSelect: true` on both steps so the user can pick multiple categories and multiple platforms.

---

### Pattern B — Visual Element Presets

Use AskUserQuestion with `preview` fields showing element breakdowns:

| Label | Header | Description | Preview |
|-------|--------|-------------|---------|
| Minimal | MINIMAL | Clean visual with minimal text overlay | `ON VISUAL:\n  Headline (max 5 words)\n  CTA button\n\nIN CAPTION:\n  Support line\n  Trust signals\n  Disclaimer\n  Logo` |
| Standard (Recommended) | STANDARD | Recommended balance of brand and copy | `ON VISUAL:\n  Headline (max 5 words)\n  CTA button\n  FS Logo\n  Regulatory disclaimer\n\nIN CAPTION:\n  Support line\n  Trust signals` |
| Full | FULL | All copy and brand elements on visual | `ON VISUAL:\n  Headline\n  Support line\n  CTA button\n  Trust signals\n  Regulatory disclaimer\n  FS Logo` |
| Custom | CUSTOM | I'll pick specific elements | `You'll select from:\n  Headline + CTA (core copy)\n  FS Logo (brand)\n  Trust + Disclaimer (legal)\n  Support Line (detail)` |

**For the Recommend section**, reference `brand-compliance/references/platform-rules.md`:
- Meta (IG/FB): Recommend **Standard** — < 20% text rule, algorithmically penalizes text-heavy ads
- LinkedIn: Recommend **Full** or **Standard** — more text-tolerant, stats perform well
- TikTok: Recommend **Minimal** — visual-first, minimal text outperforms
- Google Display Leaderboard: Recommend **Minimal** — extremely compact, no room for more
- Google Display Rectangle/Skyscraper: Recommend **Standard**
- YouTube: Recommend **Minimal** — bold headline must read at thumbnail size

**If "Custom" is selected**, follow up with a multiSelect AskUserQuestion:

| Label | Header | Description | multiSelect |
|-------|--------|-------------|-------------|
| Headline + CTA | COPY | Primary text and action button | true |
| FS Logo | BRAND | Funding Societies logo with clear space | true |
| Trust + Disclaimer | LEGAL | Trust signals and regulatory text | true |
| Support Line | DETAIL | Secondary proof point | true |

---

### Pattern C — Concept Selection

Present after generating concepts. Use AskUserQuestion with `preview` fields populated dynamically from the generated concept output.

| Label | Header | Description | Preview |
|-------|--------|-------------|---------|
| [Level 1 name] | LEVEL 1 | [Level 1 description] — low risk | `[Generated concept title]\n\n[2-sentence rationale from concept output]` |
| [Level 2 name] | LEVEL 2 | [Level 2 description] — medium risk | `[Generated concept title]\n\n[2-sentence rationale]` |
| [Level 3 name] | LEVEL 3 | [Level 3 description] — high risk, high reward | `[Generated concept title]\n\n[2-sentence rationale]` |
| All Three | ALL | Generate all concept levels (~3 images, ~2 min) | `Generates all 3 concepts:\n\n1. [Level 1 title]\n2. [Level 2 title]\n3. [Level 3 title]\n\nBest for first campaigns or A/B testing.` |

**Level names are command-specific:**
- `/create`: Safe / Bold / Experimental
- `/reimagine`: Safe (Reframe) / Bold (Transform) / Experimental (Transcend)
- `/competitor-reference`: Direct Adaptation / Blended / Creative Riff

**For the Recommend section**, reference the campaign context:
- First campaign or exploring: Recommend **All Three** — gives options to compare
- Iterating on a proven concept: Recommend **Level 1** (Safe) — refine what works
- Campaign refresh or fatigue: Recommend **Level 2** (Bold) — new angle, controlled risk
- Brand campaign with creative freedom: Recommend **Level 3** (Experimental)

Generation time estimates per option:
- Single concept: `(~1 image, ~30s)`
- All Three: `(~3 images, ~2 min)`

---

### Pattern D — Next Action

Present after image generation completes. Options vary per command — each command specifies its own options.

**Common options across commands:**

| Label | Header | Description |
|-------|--------|-------------|
| Regenerate | REDO | Try again with a modified concept or prompt |
| Refine | ADJUST | Make targeted changes to a specific element -> /refine |
| Resize | ADAPT | Adapt for additional platforms -> /resize |
| Further Refine | REFINE | Apply additional changes to this ad |

**For the Re-ground section:** Summarize what was generated (how many images, which concepts, output paths).

**For the Recommend section:** Suggest the most logical next step:
- If one concept is close but needs tweaks → Recommend **Refine**
- If the user has a winner and needs it on other platforms → Recommend **Resize**
- If none of the concepts hit the mark → Recommend **Regenerate**

---

## Batching Questions

AskUserQuestion supports up to 4 questions per call. Batch related questions into a single call when they are naturally co-located in the workflow:

- `/create` Step 1: Campaign Goal + Target Market + Platform Category (3 questions, 1 call)
- `/competitor-reference` Step 1: Platform Category + Target Market (2 questions, 1 call)
- `/resize` sub-selects: up to 4 category sub-selects in 1 call

Do NOT batch questions from different workflow steps (e.g., don't batch platform selection with element selection).
