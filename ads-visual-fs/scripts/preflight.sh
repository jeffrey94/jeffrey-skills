#!/bin/bash
# Preflight check for ads-visual-fs plugin
# Validates environment before first use

pass=0
fail=0

check() {
  if [ $1 -eq 0 ]; then
    echo "  [OK] $2"
    pass=$((pass + 1))
  else
    echo "  [FAIL] $2 — $3"
    fail=$((fail + 1))
  fi
}

echo "ads-visual-fs preflight check"
echo "=============================="
echo ""

# 1. Bun
if command -v bun &>/dev/null; then
  check 0 "Bun installed ($(bun --version))"
else
  check 1 "Bun not installed" "Install: curl -fsSL https://bun.sh/install | bash"
fi

# 2. API key
if [ -n "$GEMINI_API_KEY" ] || [ -n "$GOOGLE_API_KEY" ]; then
  KEY="${GEMINI_API_KEY:-$GOOGLE_API_KEY}"
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image-preview?key=$KEY")
  if [ "$STATUS" = "200" ]; then
    check 0 "Gemini API key valid"
  else
    check 1 "Gemini API key invalid" "Got HTTP $STATUS — check your key at https://aistudio.google.com/apikey"
  fi
else
  check 1 "GEMINI_API_KEY not set" "Add to .env or export GEMINI_API_KEY=your-key"
fi

# 3. generate-image.ts
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
if [ -f "$SCRIPT_DIR/generate-image.ts" ]; then
  check 0 "generate-image.ts found"
else
  check 1 "generate-image.ts not found" "Expected at $SCRIPT_DIR/generate-image.ts"
fi

# 4. Input folder
if [ -d "./input" ] || [ -d "./Input" ]; then
  INPUT_DIR="$(ls -d ./input ./Input 2>/dev/null | head -1)"
  FILE_COUNT=$(ls -1 "$INPUT_DIR" 2>/dev/null | wc -l | tr -d ' ')
  check 0 "Input folder found ($FILE_COUNT files)"
else
  echo "  [WARN] No input/ folder — create one with branding guides, segment docs, and style references for best results"
fi

# 5. CLAUDE.md
if [ -f "./CLAUDE.md" ]; then
  check 0 "CLAUDE.md found"
else
  echo "  [WARN] No CLAUDE.md — the plugin includes one, but you can copy it to your project root to customize"
fi

echo ""
echo "Result: $pass passed, $fail failed"
if [ $fail -gt 0 ]; then
  echo "Fix the failures above before using the plugin."
  exit 1
else
  echo "Ready to go!"
fi
