#!/usr/bin/env bun

import * as fs from "node:fs";
import * as path from "node:path";

// --- Types ---

type CliArgs = {
  prompt: string | null;
  image: string | null;
  ref: string[];
  ar: string | null;
  strength: number | null;
  json: boolean;
  help: boolean;
};

// --- Helpers ---

function getApiKey(): string {
  const key = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!key) {
    console.error("Error: GEMINI_API_KEY or GOOGLE_API_KEY environment variable is required");
    process.exit(1);
  }
  return key;
}

function getModel(): string {
  return process.env.GEMINI_IMAGE_MODEL || "gemini-3.1-flash-image-preview";
}

function getBaseUrl(): string {
  const base = process.env.GOOGLE_BASE_URL || "https://generativelanguage.googleapis.com";
  return base.replace(/\/+$/, "");
}

function readImageAsBase64(imagePath: string): { data: string; mimeType: string } {
  const absolutePath = path.resolve(imagePath);
  if (!fs.existsSync(absolutePath)) {
    throw new Error(`Image file not found: ${absolutePath}`);
  }
  const buffer = fs.readFileSync(absolutePath);
  const ext = path.extname(absolutePath).toLowerCase();
  const mimeMap: Record<string, string> = {
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".webp": "image/webp",
    ".gif": "image/gif",
  };
  return {
    data: buffer.toString("base64"),
    mimeType: mimeMap[ext] || "image/png",
  };
}

function saveImage(base64Data: string, outputPath: string): string {
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const buffer = Buffer.from(base64Data, "base64");
  fs.writeFileSync(outputPath, buffer);
  return path.resolve(outputPath);
}

function parseArgs(argv: string[]): CliArgs {
  const args: CliArgs = {
    prompt: null,
    image: null,
    ref: [],
    ar: null,
    strength: null,
    json: false,
    help: false,
  };

  let i = 2; // skip bun and script path
  while (i < argv.length) {
    const arg = argv[i];
    switch (arg) {
      case "-p":
      case "--prompt":
        args.prompt = argv[++i];
        break;
      case "--image":
        args.image = argv[++i];
        break;
      case "--ref": {
        i++;
        // Collect all following args until next flag
        while (i < argv.length && !argv[i].startsWith("--") && !argv[i].startsWith("-")) {
          args.ref.push(argv[i]);
          i++;
        }
        i--; // will be incremented by loop
        break;
      }
      case "--ar":
        args.ar = argv[++i];
        break;
      case "--strength": {
        const val = parseFloat(argv[++i]);
        if (isNaN(val) || val < 0 || val > 1) {
          console.error("Error: --strength must be a number between 0 and 1");
          process.exit(1);
        }
        args.strength = val;
        break;
      }
      case "--json":
        args.json = true;
        break;
      case "-h":
      case "--help":
        args.help = true;
        break;
      default:
        // skip unknown
        break;
    }
    i++;
  }
  return args;
}

function printUsage(): void {
  console.log(`Usage:
  bun generate-image.ts --prompt "A cat" --image out.png
  bun generate-image.ts --prompt "Make blue" --image out.png --ref source.png
  bun generate-image.ts --prompt "Adapt for Instagram" --image out.png --ref source.png --ar 1:1

Options:
  -p, --prompt <text>      Image generation prompt (required)
  --image <path>           Output image path (required)
  --ref <files...>         Reference image(s) for image-to-image generation
  --ar <ratio>             Aspect ratio (1:1, 4:3, 3:4, 9:16, 16:9)
  --strength <0-1>         How closely to follow reference (0=loose, 1=exact)
  --json                   JSON output
  -h, --help               Show help

Environment:
  GEMINI_API_KEY           Google Gemini API key (required)
  GEMINI_IMAGE_MODEL       Model override (default: gemini-3.1-flash-image-preview)
`);
}

// --- Gemini API ---

async function callGeminiApi(
  model: string,
  apiKey: string,
  contents: any[],
  generationConfig: any,
  maxRetries = 3
): Promise<any> {
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}/v1beta/models/${model}:generateContent`;

  let lastError: Error | null = null;
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    if (attempt > 0) {
      const delay = Math.min(2000 * Math.pow(2, attempt - 1), 16000);
      console.error(`Retry ${attempt}/${maxRetries - 1} after ${delay}ms...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({ contents, generationConfig }),
      });

      if (!response.ok) {
        const errText = await response.text();
        if (response.status === 429 || response.status === 503) {
          lastError = new Error(`Gemini API ${response.status}: ${errText}`);
          continue;
        }
        throw new Error(`Gemini API error (${response.status}): ${errText}`);
      }

      try {
        return await response.json();
      } catch {
        if (attempt < maxRetries - 1) {
          lastError = new Error("Gemini returned invalid JSON response");
          continue;
        }
        throw new Error("Gemini returned invalid JSON response");
      }
    } catch (err: any) {
      lastError = err;
      if (err.message?.includes("429") || err.message?.includes("503")) continue;
      throw err;
    }
  }
  throw lastError || new Error("All retries exhausted");
}

function extractImageData(response: any): string | null {
  for (const candidate of response.candidates || []) {
    for (const part of candidate.content?.parts || []) {
      const data = part.inlineData?.data;
      if (typeof data === "string" && data.length > 0) return data;
    }
  }
  return null;
}

// --- Logging ---

function logGeneration(entry: {
  prompt: string;
  model: string;
  strength: number | null;
  aspect_ratio: string | null;
  result: "success" | "error";
  output_path: string | null;
  error_message?: string;
}): void {
  try {
    const logPath = path.resolve("./ads-output/generation-log.jsonl");
    const logDir = path.dirname(logPath);
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
    const line = JSON.stringify({
      timestamp: new Date().toISOString(),
      prompt: entry.prompt.slice(0, 200),
      model: entry.model,
      strength: entry.strength,
      aspect_ratio: entry.aspect_ratio,
      result: entry.result,
      output_path: entry.output_path,
      error_message: entry.error_message,
    });
    fs.appendFileSync(logPath, line + "\n");
  } catch {
    // Logging should never break generation
  }
}

// --- Main ---

async function main() {
  const args = parseArgs(process.argv);

  if (args.help) {
    printUsage();
    process.exit(0);
  }

  if (!args.prompt) {
    console.error("Error: --prompt is required");
    printUsage();
    process.exit(1);
  }
  if (!args.image) {
    console.error("Error: --image is required");
    printUsage();
    process.exit(1);
  }

  const apiKey = getApiKey();
  const model = getModel();

  // Build prompt with reference image handling
  const parts: any[] = [];

  // Add reference images
  for (const refPath of args.ref) {
    const { data, mimeType } = readImageAsBase64(refPath);
    parts.push({ inlineData: { mimeType, data } });
  }

  // Build prompt text
  let promptText = args.prompt;
  if (args.ref.length > 0 && args.strength !== null) {
    const strengthDesc = args.strength > 0.7 ? "very closely" : args.strength > 0.4 ? "closely" : "loosely";
    promptText = `CRITICAL: Use the provided reference image as the primary visual base. The output should ${strengthDesc} match the reference image's composition, colors, subjects, and style. Transform and adapt the reference according to these instructions: ${promptText}`;
  }

  // Add aspect ratio to prompt
  if (args.ar) {
    promptText += ` Aspect ratio: ${args.ar}.`;
  }

  parts.push({ text: promptText });

  // Build generation config
  const generationConfig: any = {
    responseModalities: ["IMAGE"],
  };
  if (args.ar) {
    generationConfig.imageConfig = { aspectRatio: args.ar };
  }

  // Generate
  console.error(`Using ${model}`);
  console.error(`Generating image...`);

  const response = await callGeminiApi(
    model,
    apiKey,
    [{ role: "user", parts }],
    generationConfig
  );

  const imageData = extractImageData(response);
  if (!imageData) {
    const errMsg = "No image data returned from Gemini";
    logGeneration({
      prompt: promptText, model, strength: args.strength,
      aspect_ratio: args.ar, result: "error", output_path: null,
      error_message: errMsg,
    });
    if (args.json) {
      console.log(JSON.stringify({ status: "error", error: errMsg }));
    } else {
      console.error(`Error: ${errMsg}`);
    }
    process.exit(1);
  }

  const savedPath = saveImage(imageData, args.image);
  console.error(`Image saved to: ${savedPath}`);

  logGeneration({
    prompt: promptText, model, strength: args.strength,
    aspect_ratio: args.ar, result: "success", output_path: savedPath,
  });

  if (args.json) {
    console.log(JSON.stringify({
      status: "success",
      output_path: savedPath,
      model,
      aspect_ratio: args.ar || "auto",
      mode: args.ref.length > 0 ? "image-to-image" : "text-to-image",
    }));
  } else {
    console.log(savedPath);
  }
}

main().catch((err) => {
  console.error(`Error: ${err.message}`);
  process.exit(1);
});
