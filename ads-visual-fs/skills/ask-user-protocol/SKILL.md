---
name: ask-user-protocol
description: >
  Activates during any ads-visual-fs command workflow when a structured user decision
  is needed. Provides the 4-section conversational format (Context, Explanation, Suggestion,
  Cost) and reusable patterns (Platform Selection, Visual Elements, Concept Selection,
  Next Action, Style Presets). This is a shared UX protocol, not a user-facing workflow.
metadata:
  version: "0.9.1"
---

# AskUserQuestion Protocol

Standardized format for every user decision point across all ads-visual-fs commands. This skill ensures consistent, low-friction interactions that guide users to good creative decisions.

## When This Activates

Automatically during ANY command workflow when a user decision is needed. Do NOT use this for free-text inputs (product name, key message, audience, copy editing, file paths) — those stay as regular text prompts.

---

## The 4-Section Format

Before every AskUserQuestion call, write a short conversational paragraph that naturally covers these 4 points. Do NOT use section labels or protocol headers — write as if you're talking to a marketing manager.

### What to cover (internal checklist — do NOT show these labels to the user):

1. **Context** (orients the user): Open with 1 sentence stating what command we're running, for what campaign, and what step we're at. This keeps the user oriented if they've stepped away.

2. **Explanation** (why this choice matters): In 1-2 sentences, explain why this decision matters for the ad. Use plain language — what each choice does for performance, reach, or brand compliance. No prompt engineering jargon, no internal parameter names.

3. **Suggestion** (your recommendation): State your pick with a reason tied to the campaign goal or platform best practice. Use natural phrasing like "I'd suggest X because..." or "X works best here because...". Always tie it to something concrete:
   - Platform best practices (reference `brand-compliance/references/platform-rules.md`)
   - Campaign goal alignment (awareness → different choice than lead gen)
   - Industry norms for the target market

4. **Cost context** (when relevant): When options involve image generation, mention the time/count naturally in the text: "This generates 3 images and takes about 2 minutes." Do NOT use formatted estimates like `(~3 images, ~2 min)`.

Then call AskUserQuestion. The tool's structured UI handles the actual option presentation — do NOT list lettered options (A/B/C/D) in the text output.

---

## Example (from /create, Step 2b)

```
We're creating an Instagram Feed ad for SME Business Loan SG — copy is
confirmed, now choosing what text goes on the image itself versus the caption.

Instagram's algorithm deprioritizes ads with too much text on the image,
so keeping the visual clean means more people see it and it costs less
per impression. Details like trust signals and support lines work better
in the caption.

I'd suggest Standard — headline, CTA, logo, and disclaimer gives you
brand presence without triggering text-heavy penalties on Instagram.
```

Then call AskUserQuestion with the preset options.

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

For your **suggestion**, reference the campaign goal:
- Awareness campaigns → suggest Social Feed or Social Story (broadest reach)
- Lead gen → suggest LinkedIn Feed or Social Feed (conversion-optimized)
- Retargeting → suggest Display Ads (follows users across sites)
- Product launch → suggest Social Story or Video (highest engagement)

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

**For your suggestion**, reference `brand-compliance/references/platform-rules.md`:
- Meta (IG/FB): suggest **Standard** — < 20% text rule, algorithmically penalizes text-heavy ads
- LinkedIn: suggest **Full** or **Standard** — more text-tolerant, stats perform well
- TikTok: suggest **Minimal** — visual-first, minimal text outperforms
- Google Display Leaderboard: suggest **Minimal** — extremely compact, no room for more
- Google Display Rectangle/Skyscraper: suggest **Standard**
- YouTube: suggest **Minimal** — bold headline must read at thumbnail size

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

**For your suggestion**, reference the campaign context:
- First campaign or exploring: suggest **All Three** — gives options to compare
- Iterating on a proven concept: suggest **Level 1** (Safe) — refine what works
- Campaign refresh or fatigue: suggest **Level 2** (Bold) — new angle, controlled risk
- Brand campaign with creative freedom: suggest **Level 3** (Experimental)

Mention generation time naturally in the text (e.g., "Generating one concept takes about 30 seconds. All three takes about 2 minutes.").

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

**For context:** Summarize what was generated (how many images, which concepts, output paths).

**For your suggestion:** Recommend the most logical next step:
- If one concept is close but needs tweaks → suggest **Refine**
- If the user has a winner and needs it on other platforms → suggest **Resize**
- If none of the concepts hit the mark → suggest **Regenerate**

---

### Pattern E — Style Presets

Present after visual element selection (Pattern B) and before concept generation. Used by `/create` and `/campaign` only.

Reference `style-presets/SKILL.md` and `style-presets/references/style-directory.md` for full style definitions.

Use AskUserQuestion with `preview` fields showing style breakdowns:

| Label | Header | Description | Preview |
|-------|--------|-------------|---------|
| Warm Showcase | WARM | Photo-real person with 3D props, organic blob frame | `SUBJECT: Photo-real person + 3D props\nFRAME: Organic blob shape\nBACKGROUND: Solid color\nMOOD: Friendly, relatable, micro-SME` |
| Bold Professional | BOLD_PRO | Photo-real person in teal photo mask, trust badges | `SUBJECT: Photo-real person in workplace\nFRAME: Teal rounded-rect mask\nACCENTS: Trust badge pill\nMOOD: Corporate, polished, established` |
| Tech Forward | TECH | Person with device mockup, breaks out of frame | `SUBJECT: Person + phone mockup\nCOMPOSITION: Person breaks out of device\nBACKGROUND: Gradient\nMOOD: Digital transformation, growth` |
| Aspirational Shadow | SHADOW | 3D subject casts dream-shadow of bigger version | `SUBJECT: 3D rendered (cart/stall)\nMETAPHOR: Shadow = bigger dream version\nBACKGROUND: Clean white/light gray\nMOOD: Minimal, editorial, aspirational` |
| Custom | CUSTOM | Describe your own visual style | `You'll describe the visual style:\nsubject treatment, framing devices,\ncomposition approach, and mood.` |

**For your suggestion**, reference the campaign goal:
- Lead gen / product-focused → suggest **Warm Showcase** (relatable, high CTR for SME audience)
- Corporate / trust-building → suggest **Bold Professional** (polished, credibility signals)
- Digital product / fintech-forward → suggest **Tech Forward** (innovation narrative)
- Aspirational / brand awareness → suggest **Aspirational Shadow** (emotional, editorial quality)

If "Custom" is selected, follow up with a free-text prompt (NOT an AskUserQuestion):
"Describe the visual style you want — include subject treatment (photo-realistic, 3D, illustrated), framing devices (shapes, masks, mockups), composition approach, and mood."

---

## Batching Questions

AskUserQuestion supports up to 4 questions per call. Batch related questions into a single call when they are naturally co-located in the workflow:

- `/create` Step 1: Campaign Goal + Target Market + Platform Category (3 questions, 1 call)
- `/competitor-reference` Step 1: Platform Category + Target Market (2 questions, 1 call)
- `/resize` sub-selects: up to 4 category sub-selects in 1 call

Do NOT batch questions from different workflow steps (e.g., don't batch platform selection with element selection).
