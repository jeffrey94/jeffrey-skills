# TODOS

## P3 — Nice to Have

### Competitor analysis gallery
**What:** Save /competitor-reference 8-dimension analyses to a persistent gallery at `ads-output/competitor-gallery/`. Each analysis saved as a structured .md file with the competitor image path, analysis table, and FS translations.
**Why:** Over time, builds a searchable reference of competitor creative strategies. Enables queries like "show me all competitor ads that used urgency-based emotional appeal" or "what layout patterns do Alliance Bank use?"
**Context:** Currently, competitor analyses exist only in the conversation context and are lost after the session ends.
**Effort:** S (human) / S (CC)
**Depends on:** Nothing

### Style reference learning
**What:** When users provide style reference images in `./input/`, analyze them once and create a persistent style profile (`ads-output/style-profile.md`) that auto-injects into all subsequent generation prompts.
**Why:** Currently, each command invocation starts fresh with no memory of the campaign's visual style. A persistent profile means "remember this campaign's visual style" across sessions.
**Context:** Would need to be opt-in (not all users want style persistence) and include a way to reset/regenerate the profile.
**Effort:** M (human) / S (CC)
**Depends on:** Nothing
