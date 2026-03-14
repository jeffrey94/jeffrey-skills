# ads-visual

AI-powered ad creative generation plugin for Funding Societies. Reimagine existing ads, refine elements, resize for platforms, and create from briefs — all with FS brand compliance built in.

## Architecture

```
/reimagine  → [marketing-analysis] → [concept-generation] → [image-editing] ←── MCP (Gemini)
/refine     → [composition-analysis] ─────────────────────→ [image-editing] ←── MCP (Gemini)
/resize     → [composition-analysis] ─────────────────────→ [image-editing] ←── MCP (Gemini)
/create     → [concept-generation] ───────────────────────→ [image-generation] ← MCP (Gemini)
                              ↑ [brand-compliance] applied to ALL ↑

Claude does: analysis, concept generation, brand compliance (native LLM capabilities)
MCP does:    image generation/editing/resizing only (Gemini image API)
```

## Components

### Commands (4)

| Command | Description |
|---------|-------------|
| `/reimagine <image>` | Reimagine an ad with 3 concept variations (SAFE/BOLD/EXPERIMENTAL) |
| `/refine <image> [intent]` | Refine specific elements while preserving the rest |
| `/resize <image> [platforms]` | Adapt for different platform formats |
| `/create` | Create a new ad from a marketing brief |

### Workflow Skills (4)

Auto-trigger on natural language — same orchestration as commands.

| Skill | Triggers On |
|-------|------------|
| reimagine | "reimagine this ad", "create variations", "remix this creative" |
| refine | "change the headline", "adjust the CTA", "tweak this ad" |
| resize | "resize for Instagram", "make platform versions", "adapt for social" |
| create | "create an ad for", "design a new ad", "make marketing visuals" |

### Shared Skills (6)

Context-activated domain expertise — auto-activates during workflows.

| Skill | Activation Context | Used By |
|-------|--------------------|---------|
| marketing-analysis | Marketing inference on ad images | Reimagine |
| composition-analysis | Visual element/layout analysis | Refine, Resize |
| concept-generation | Creative concept variations | Reimagine, Create |
| image-generation | Text-to-image (no reference) | Create |
| image-editing | Image-to-image (with reference) | Reimagine, Refine, Resize |
| brand-compliance | Any FS ad creative work | All 4 |

### MCP Server (3 tools)

| Tool | Description |
|------|-------------|
| `generate_ad_image` | Generate images (text-to-image or image-to-image) |
| `resize_ad_image` | Platform-specific resize with recomposition |
| `refine_ad_element` | Targeted element changes on existing images |

### Hook

| Event | Purpose |
|-------|---------|
| PostToolUse | Auto-validate FS brand compliance on generated images |

## Setup

### 1. Get a Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/apikey)
2. Create an API key
3. Set the environment variable:

```bash
export GEMINI_API_KEY="your-api-key-here"
```

### 2. Install Dependencies

```bash
cd servers && npm install
```

### 3. Install the Plugin

Copy the plugin directory or install the `.plugin` file through Cowork.

## Usage

### Commands

```
/reimagine ./path/to/ad.png
/refine ./path/to/ad.png make CTA more urgent
/resize ./path/to/ad.png instagram linkedin tiktok
/create
```

### Natural Language

```
"Reimagine this ad with fresh variations" (attach image)
"Change the headline to '48-Hour Funding'" (attach image)
"Resize this for Instagram and LinkedIn" (attach image)
"Create an ad for our SME loan targeting Singapore"
```

## Output

Generated images are saved to `./ads-output/` organized by workflow:

```
ads-output/
├── create/<campaign-name>/
├── reimagine/<concept-title>.png
├── refine/<description>.png
└── resize/<platform>.png
```

## Brand Guidelines (FSMY, May 2025)

| Color | Hex | Role |
|-------|-----|------|
| Light Gray | #F1F1F2 | Backgrounds |
| Yellow | #FFDE0F | Accent, highlights |
| Purple | #5203EA | Primary brand |
| Teal | #27E4CD | Secondary accents |
| Blue | #2C50FF | Links, interactive |

- **Fonts**: Poppins SemiBold/Light (headings), Inter Regular/Bold (body)
- **Strapline**: "Stronger SMEs, Stronger Societies"
- **Tone**: Professional, trustworthy, empowering
- **Regulatory**: Market-appropriate disclaimers auto-included
