# Marketing Analysis Output Schema

The marketing analysis produces structured insights in this format:

## Fields

| Field | Type | Description |
|-------|------|-------------|
| product_service | Array<Candidate> | What is being advertised |
| core_message | Array<Candidate> | Key marketing message |
| audience | Array<Candidate> | Target audience |
| brand_codes | BrandCodes | Visual brand identity |
| mandatory_copy | CopyElements | Text elements in the ad |
| uncertainties | Array<string> | What remains unclear |
| assumptions | Array<string> | Assumptions made |

## Candidate

| Field | Type | Description |
|-------|------|-------------|
| option | string | The inferred value |
| rationale | string | Why this was inferred |
| evidence | Array<string> | Supporting evidence |
| confidence | number (0-1) | Confidence score |

## BrandCodes

| Field | Type | Description |
|-------|------|-------------|
| palette_hex | Array<{hex, role, evidence}> | Color palette with roles |
| typefaces | Array<{family_guess, evidence, confidence}> | Font identification |
| do | Array<string> | Design rules to follow |
| dont | Array<string> | Design rules to avoid |

## CopyElements

| Field | Type | Description |
|-------|------|-------------|
| h1_headline | Array<string> | Primary headline options |
| support_line | Array<string> | Secondary copy options |
| cta_label | Array<string> | CTA text options |
| trust_microcopy | Array<string> | Trust signals |
| legal | Array<string> | Disclaimer text |

## Usage

1. Present each section to the user for confirmation
2. Let the user toggle/edit insights
3. Use the top-confidence option as the default
4. Pass confirmed insights to concept generation
