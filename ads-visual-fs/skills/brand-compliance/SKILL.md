---
name: brand-compliance
description: >
  Activates during any ad creative work for Funding Societies — generation, refinement,
  resizing, or review. Enforces FS brand colors, typography, tone, logo usage, and
  regulatory compliance. This is a shared compliance capability that enhances all workflows.
metadata:
  version: "0.7.1"
---

# Funding Societies Brand Compliance

Enforce Funding Societies (FSMY) brand guidelines across all ad creative work.

## When This Activates

This skill auto-activates during ANY ad creative workflow. Apply these rules to every output.

## Color Palette (FSMY May 2025)

| Name | Hex | RGB | Pantone | Role |
|------|-----|-----|---------|------|
| Light Gray | `#F1F1F2` | 241,241,242 | 9345 C | Backgrounds, neutral |
| Yellow | `#FFDE0F` | 255,222,15 | 3945 C | Accent, energy, highlights |
| Purple | `#5203EA` | 82,3,234 | 2665 C | Primary brand, headings, CTAs |
| Teal | `#27E4CD` | 39,228,205 | 3255 C | Secondary, accents |
| Blue | `#2C50FF` | 44,80,255 | 2728 C | Links, interactive |

## Typography

- **Titles/Headings**: Poppins SemiBold (emphasis), Poppins Light (softer)
- **Body**: Inter Regular, Inter Bold

## Strapline

- "Stronger SMEs, Stronger Societies"
- 2-line format: no punctuation
- Horizontal format: comma, no full stop → "Stronger SMEs, Stronger Societies"

## Logo Rules

- **Primary**: 2-line logotype (marketing collaterals)
- **Alternative**: horizontal logotype (e-greetings, wider formats)
- **Versions**: full color on white, full color on dark, mono white, mono dark
- **Image backgrounds**: colored logo encouraged, semi-transparent overlay if busy
- **Clear space**: ≥1× logo mark width on all sides
- **Do's**: clear space, approved colors, legibility, high-res, approved backgrounds
- **Don'ts**: no altering, no stretching, no shadows/gradients/bevels, no unapproved colors, no busy backgrounds, no added elements

## Tone of Voice

- **Professional** — Licensed financial institution
- **Trustworthy** — Data-backed claims, regulatory compliance visible
- **Empowering** — SMEs are the heroes; FS is the enabler
- **Accessible** — Complex finance made simple
- **Regional** — Respect for Southeast Asian business culture

## Mandatory Don'ts

- Never use gambling, casino, or get-rich-quick imagery
- Never promise guaranteed returns or risk-free investments
- Never use meme formats or rocket emojis
- Never alter logo colors or proportions
- Never use aggressive or predatory lending language
- Never make claims without regulatory disclaimers
- Never use generic stock photos unrelated to SMEs

## Regulatory Disclaimers (by Market)

- **SG**: "Funding Societies Pte Ltd holds a Capital Markets Services Licence (CMS101541)"
- **MY**: "Modalku Ventures Sdn Bhd is registered with the Securities Commission Malaysia"
- **ID**: "PT Modalku Finansial Teknologi terdaftar dan diawasi oleh OJK"
- **TH**: "Registered under SEC Thailand"
- **VN**: "Licensed under SBV regulations"

## Logo Placement Standard

- **Default position:** Top-right corner
- **Format:** 2-line logotype (primary) per brand guidelines
- **Clear space:** ≥1× logo mark width on all sides
- **On busy backgrounds:** Add subtle semi-transparent backing
- **Consistent across all ads in a campaign set**

## CTA Button Standard

- **Style:** Solid brand yellow (#FFDE0F) with dark text, OR frosted glass effect
- **Pick ONE style per campaign** and apply consistently
- **Sizing:** ~40% frame width (feed/square), ~60% frame width (story/vertical)
- **Position:** Bottom-center, second most prominent element after headline
- **Font:** Poppins SemiBold, high contrast

## Disclaimer Styling Standard

- **Position:** Bottom of frame, left-aligned
- **Font:** Inter Light, smallest legible size
- **Must not overlap** with CTA button or hero imagery
- **Consistent styling** across all ads in a campaign set

## Campaign Colorways

Two approved background systems:
1. **Warm** — Yellow/amber gradient (#FFDE0F dominant) — primary, matches approved style reference
2. **Cool** — Purple (#5203EA) with teal (#27E4CD) accents — for variety/carousel rotation

Both use the same layout grid and type hierarchy.

## Prompt Injection Template

**This template MUST be appended to EVERY prompt passed to ALL `generate-image.ts` script calls.** It is not optional — every image generation call should include these constraints:

```
Brand colors: Light Gray #F1F1F2, Yellow #FFDE0F, Purple #5203EA, Teal #27E4CD, Blue #2C50FF.
Typography: Poppins SemiBold for headings, Inter Regular for body.
Tone: professional, trustworthy, empowering.
Do not include: gambling, casino, rockets, memes, aggressive lending, predatory language, illegible text, generic stock photos.
Keep on-visual text minimal: headline (max 5 words), CTA button, logo, disclaimer only.
Do not render body copy, bullet points, or detailed offer text on the image.
All marketing copy must address the viewing audience directly. Never depict copy as text shown to or viewed by characters in the scene.
The reference image IS the ad creative. Transform its elements directly. DO NOT treat it as content displayed within a scene (not on a monitor, billboard, poster, or screen).
```

## Platform-Specific Rules

For platform-specific constraints, read `references/platform-rules.md` when
generating for a specific platform.

## Compliance Validation Checklist

When reviewing any ad creative (generated or uploaded), verify:

- [ ] Colors use FS palette (no off-brand colors dominating)
- [ ] Typography specified as Poppins/Inter in prompts
- [ ] No gambling, casino, or get-rich-quick imagery
- [ ] No guaranteed returns or risk-free language
- [ ] Regulatory disclaimer present and correct for target market
- [ ] Logo clearspace respected (≥1× logo mark width)
- [ ] Tone is professional and empowering, not aggressive
- [ ] CTA is clear and action-oriented
- [ ] Strapline format is correct (no period on horizontal)
