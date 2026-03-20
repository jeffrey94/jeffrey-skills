# ads-visual-fs

AI-powered ad creative generation plugin for Funding Societies. Reimagine existing ads, refine elements, resize for platforms, and create from briefs — all with FS brand compliance built in.

## Architecture

```
/reimagine            → [marketing-analysis] → [concept-generation] → [generate-image.ts]
/refine               → [composition-analysis] ─────────────────────→ [generate-image.ts]
/resize               → [composition-analysis] ─────────────────────→ [generate-image.ts]
/create               → [concept-generation] ───────────────────────→ [generate-image.ts]
/competitor-reference  → [competitor-analysis] → [concept-generation] → [generate-image.ts]
                                    ↑ [brand-compliance] applied to ALL ↑

Claude does: analysis, concept generation, brand compliance (native LLM capabilities)
Script does: image generation via Gemini API (scripts/generate-image.ts)
```

## Components

### Commands (5)

| Command | Description |
|---------|-------------|
| `/reimagine <image>` | Reimagine an ad with 3 concept variations (SAFE/BOLD/EXPERIMENTAL) |
| `/refine <image> [changes]` | Refine specific elements while preserving the rest |
| `/resize <image> [platforms]` | Adapt for different platform formats |
| `/create` | Create a new ad from a marketing brief |
| `/competitor-reference <image>` | Analyze a competitor ad and generate FS-branded ads inspired by its creative strategies |

### Workflow Skills (5)

Auto-trigger on natural language — same orchestration as commands.

| Skill | Triggers On |
|-------|------------|
| reimagine | "reimagine this ad", "create variations", "remix this creative" |
| refine | "change the headline", "adjust the CTA", "tweak this ad" |
| resize | "resize for Instagram", "make platform versions", "adapt for social" |
| create | "create an ad for", "design a new ad", "make marketing visuals" |
| competitor-reference | "analyze this competitor ad", "do something like this competitor ad", "inspired by this ad" |

### Shared Skills (5)

Context-activated domain expertise — auto-activates during workflows.

| Skill | Activation Context | Used By |
|-------|--------------------|---------|
| marketing-analysis | Marketing inference on ad images | Reimagine |
| composition-analysis | Visual element/layout analysis | Refine, Resize |
| concept-generation | Creative concept variations | Reimagine, Create, Competitor Reference |
| competitor-analysis | Creative strategy extraction from competitor ads | Competitor Reference |
| brand-compliance | Any FS ad creative work | All 5 |

### Image Generation Script

`scripts/generate-image.ts` — Calls the Gemini API directly via Bash. No MCP server needed.

```bash
# Text-to-image
bun scripts/generate-image.ts --prompt "A professional ad..." --image out.png --ar 1:1

# Image-to-image (with reference)
bun scripts/generate-image.ts --prompt "Adapt this ad..." --image out.png --ref source.png --ar 9:16

# With strength control
bun scripts/generate-image.ts --prompt "..." --image out.png --ref source.png --strength 0.7
```

## Setup

### 1. Get a Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/apikey)
2. Create an API key
3. Set the environment variable:

```bash
export GEMINI_API_KEY="your-api-key-here"
```

### 2. Install Bun (if not already installed)

```bash
curl -fsSL https://bun.sh/install | bash
```

Or the script will fall back to `npx -y bun` if bun is not installed.

### 3. Install the Plugin

Install from GitHub: `jeffrey94/jeffrey-skills` → `ads-visual-fs`

### 4. Preflight Check

Run the preflight script to verify everything is set up correctly:

```bash
bash scripts/preflight.sh
```

This checks: Bun installation, API key validity, script accessibility, input folder, and CLAUDE.md presence.

## Getting the Best Results

The plugin works out of the box with slash commands, but you'll get significantly better output by setting up your project with the right context.

### Recommended Project Structure

```
your-project/
├── CLAUDE.md              # Agent role, behavior, brand context
├── .env                   # GEMINI_API_KEY=your-key (never commit this)
├── input/                 # Source materials
│   ├── branding-guide.pdf # Brand guidelines, visual identity
│   ├── target-segment.pdf # Audience personas, segments
│   ├── style-ref.jpg      # Visual style references
│   └── brief.pdf          # Campaign brief (optional)
└── ads-output/            # Generated images (auto-created)
```

### Setting Up CLAUDE.md

A `CLAUDE.md` file tells Claude how to behave in your project. For marketing work, define the agent's role, workflow guidance, brand reference, and input awareness.

A ready-to-use template is included in the plugin:

```bash
cp examples/CLAUDE.md.example ./CLAUDE.md
```

The template frames Claude as a marketing executive who asks strategic questions (objective, audience, market, channels) before producing visuals. Customize it for your team's workflow.

### Input Materials That Improve Output

| Material | Why It Helps | Format |
|----------|-------------|--------|
| **Branding guide** | Enforces correct colors, fonts, logo usage, tone | PDF, image |
| **Target segment doc** | Sharpens messaging for the right audience | PDF, text |
| **Style references** | Gives visual direction beyond brand guidelines | JPG, PNG |
| **Campaign brief** | Provides objective, offer, channels, constraints | PDF, text |
| **Existing ads** | Source material for `/reimagine`, `/refine`, `/resize` | JPG, PNG |
| **Competitor examples** | Context for differentiation and positioning | JPG, PNG |

The more context you provide in `./input/`, the less back-and-forth is needed and the more on-brand the output will be.

### Tips

- **Strategy before visuals** — Start by discussing the campaign objective and audience. Use `/create` only after the brief is clear.
- **Right command for the job** — `/reimagine` for fresh concepts from an existing ad, `/refine` for surgical edits, `/resize` for platform adaptation.
- **Iterate in sequence** — A typical flow: `/create` → pick the best → `/refine` to polish → `/resize` for all platforms.
- **Provide style references** — A single reference image can dramatically improve visual consistency across generated ads.
- **Review the analysis step** — Each command presents its analysis for confirmation. Correct any misinterpretations before generation.

## Usage

### Commands

```
/reimagine ./path/to/ad.png
/refine ./path/to/ad.png make CTA more urgent
/resize ./path/to/ad.png instagram linkedin tiktok
/create
/competitor-reference ./path/to/competitor-ad.png
```

### Natural Language

```
"Reimagine this ad with fresh variations" (attach image)
"Change the headline to '48-Hour Funding'" (attach image)
"Resize this for Instagram and LinkedIn" (attach image)
"Create an ad for our SME loan targeting Singapore"
"I love this competitor ad, can we do something similar for FS?" (attach competitor image)
"Analyze this Alliance Bank ad and create FS versions" (attach image)
```

## Output

Generated images are saved to `./ads-output/` organized by workflow:

```
ads-output/
├── create/<campaign-name>/
├── reimagine/<concept-title>.png
├── refine/<description>-v{1,2,3}.png
├── resize/<platform>.png
└── competitor-reference/<competitor-slug>/<concept-title>.png
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
