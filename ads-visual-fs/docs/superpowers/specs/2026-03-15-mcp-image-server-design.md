# MCP Image Generation Server Design

## Problem

The plugin requires a `GEMINI_API_KEY` environment variable for image generation. In Claude Code this is straightforward (developers set env vars), but in Cowork the users are non-technical knowledge workers who cannot configure shell environment variables. The current design shells out via Bash to run `scripts/generate-image.ts`, which also requires `Bash` in the command's `allowed-tools`.

## Solution

Wrap the Gemini image generation logic as an MCP stdio server. The API key is configured in `.mcp.json`'s env field, which Cowork handles through its app settings UI. Commands call an MCP tool instead of shelling out to bash.

## Scope

### What changes

1. **New: `servers/gemini-image.ts`** — MCP stdio server exposing a `generate_image` tool
2. **New: `.mcp.json`** — MCP server declaration with env config for API key and optional overrides
3. **Update: `commands/*.md`** (all 4) — Replace bash script calls with MCP tool calls; remove `Bash` from `allowed-tools`
4. **Update: `.claude-plugin/plugin.json`** — Bump version to 0.5.0
5. **Update: `README.md`** — Add MCP server setup instructions for Cowork
6. **Keep: `scripts/generate-image.ts`** — Remains as standalone CLI fallback for Claude Code users

### What stays the same

- All 4 commands and their step-by-step workflows
- All 4 skills (brand-compliance, composition-analysis, concept-generation, marketing-analysis)
- Gemini API integration logic (model selection, retry with backoff, base64 encoding/decoding)
- Output directory structure (`./ads-output/<workflow>/`)
- All production guardrails (anti-recursive-embedding, copy direction, etc.)

## Component Details

### 1. MCP Server (`servers/gemini-image.ts`)

A stdio MCP server implemented in TypeScript (Bun runtime). Exposes a single tool.

**Tool definition:**

```
Tool: generate_image
Description: Generate an image using the Gemini API. Supports text-to-image and image-to-image with reference.

Inputs:
  prompt        (string, required)   — Image generation prompt
  output_path   (string, required)   — File path to save the generated image
  reference_images (string[], optional) — Paths to reference images for image-to-image mode
  aspect_ratio  (string, optional)   — One of: 1:1, 4:3, 3:4, 9:16, 16:9
  strength      (number, optional)   — 0-1, how closely output follows reference (0=loose, 1=exact)

Returns (JSON):
  status       — "success" or "error"
  output_path  — Absolute path to saved image (on success)
  model        — Gemini model used
  mode         — "text-to-image" or "image-to-image"
  error        — Error message (on failure)
```

**Implementation approach:**

- Copy the core Gemini API logic from `scripts/generate-image.ts` into the server file: `callGeminiApi()`, `readImageAsBase64()`, `saveImage()`, `extractImageData()`, `getApiKey()`, `getModel()`, `getBaseUrl()`. The server is a self-contained file — no shared imports with the CLI script to avoid coupling.
- Use `@modelcontextprotocol/sdk` for the MCP stdio transport — handles JSON-RPC framing, capability negotiation, and protocol compliance. Install via `bun add @modelcontextprotocol/sdk`.
- API key read from `process.env.GEMINI_API_KEY` or `process.env.GOOGLE_API_KEY` (same fallback as CLI script, injected by MCP config)
- Model and base URL configurable via `GEMINI_IMAGE_MODEL` and `GOOGLE_BASE_URL` env vars (same as current script)
- Stderr used for logging (same convention as current script)
- All `output_path` values are resolved to absolute paths using `path.resolve()` before writing, so relative paths from commands work correctly regardless of the server's working directory

**MCP protocol messages handled by SDK:**

- `initialize` — Return server info and capabilities (tool support)
- `notifications/initialized` — Acknowledged automatically by SDK
- `tools/list` — Return the `generate_image` tool definition
- `tools/call` — Execute image generation, return result

### 2. MCP Configuration (`.mcp.json`)

```json
{
  "mcpServers": {
    "gemini-image": {
      "command": "bun",
      "args": ["${CLAUDE_PLUGIN_ROOT}/servers/gemini-image.ts"],
      "env": {
        "GEMINI_API_KEY": "${GEMINI_API_KEY}",
        "GOOGLE_API_KEY": "${GOOGLE_API_KEY}",
        "GEMINI_IMAGE_MODEL": "${GEMINI_IMAGE_MODEL}",
        "GOOGLE_BASE_URL": "${GOOGLE_BASE_URL}"
      }
    }
  }
}
```

Only `GEMINI_API_KEY` or `GOOGLE_API_KEY` is required (one or the other). `GEMINI_IMAGE_MODEL` and `GOOGLE_BASE_URL` are optional overrides. If `bun` is not available, document `npx -y bun` as a fallback in the README.

### 3. Command Updates

All 4 commands (`reimagine.md`, `refine.md`, `resize.md`, `create.md`) need these changes:

**Before (bash call):**
```markdown
allowed-tools: Read, Bash
```
```bash
${BUN_X} ${CLAUDE_PLUGIN_ROOT}/scripts/generate-image.ts \
  --prompt "<prompt>" \
  --image "./ads-output/reimagine/<slug>.png" \
  --ref "$1" \
  --strength <value> \
  --ar "<ratio>" \
  --json
```

**After (MCP tool call):**

The MCP tool name follows the pattern `mcp__<plugin>_<server-key>__<tool>`. Since the server key in `.mcp.json` is `gemini-image` and the plugin is `ads-visual-fs`, the mangled name is `mcp__ads_visual_fs_gemini_image__generate_image`. Verify the exact name at runtime with `tools/list`.

```markdown
allowed-tools: Read, mcp__ads_visual_fs_gemini_image__generate_image
```
```
Call the generate_image tool with:
  prompt: "<prompt with FS brand constraints>"
  output_path: "./ads-output/reimagine/<slug>.png"
  reference_images: ["$1"]
  strength: <value>
  aspect_ratio: "<ratio>"
```

Each command's Step 3 (or equivalent generation step) replaces the bash code block with a natural language instruction to call the MCP tool. The guardrail directives (anti-recursive-embedding, copy direction) remain in the prompt text passed to the tool.

### 4. CLI Script Preservation

`scripts/generate-image.ts` remains unchanged as a standalone CLI tool. This provides:

- Backward compatibility for Claude Code users
- A debugging/testing entry point
- A reference implementation for the MCP server

## Error Handling

The MCP server inherits the same error handling as the CLI script:

- **Rate limit (429) / Service unavailable (503)**: Retry with exponential backoff, up to 3 attempts
- **Missing API key**: Return error result with message guiding user to configure in Cowork settings
- **Content policy violation**: Return error with the API's rejection reason
- **No image data returned**: Return error suggesting prompt simplification
- **File write failure**: Return error with path details

## Dependencies

- **Runtime**: Bun (same as current)
- **MCP SDK**: `@modelcontextprotocol/sdk` — handles stdio transport and protocol compliance
- **Node built-ins**: `fs`, `path` (same as current)
- **External API**: Gemini API (same as current)

## Known Issues

- **Aspect ratio inconsistencies in `resize.md`**: Some platform specs have mismatched ratios (e.g., LinkedIn Feed lists `4:3 (1200x627)` which is not actually 4:3). These are pre-existing issues in the commands, not introduced by this change. Consider fixing as a follow-up.

## CLI Fallback

The CLI script (`scripts/generate-image.ts`) is preserved for Claude Code users but is **not** an automatic fallback. If the MCP server is unavailable (e.g., missing API key), commands should surface the error to the user with setup instructions rather than silently falling back to bash.

## File Tree (after changes)

```
ads-visual-fs/
├── .mcp.json                          (NEW)
├── .claude-plugin/plugin.json         (bump version to 0.5.0)
├── commands/
│   ├── reimagine.md                   (UPDATED - MCP tool call)
│   ├── refine.md                      (UPDATED - MCP tool call)
│   ├── resize.md                      (UPDATED - MCP tool call)
│   └── create.md                      (UPDATED - MCP tool call)
├── scripts/
│   └── generate-image.ts             (UNCHANGED - CLI fallback)
├── servers/
│   └── gemini-image.ts               (NEW - MCP stdio server)
├── skills/                            (UNCHANGED)
│   ├── brand-compliance/
│   ├── composition-analysis/
│   ├── concept-generation/
│   └── marketing-analysis/
├── hooks/
│   └── hooks.json                    (UNCHANGED)
└── README.md                         (UPDATE setup instructions)
```
