#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { GoogleGenAI } from "@google/generative-ai";
import * as fs from "fs";
import * as path from "path";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  console.error("GEMINI_API_KEY environment variable is required");
  process.exit(1);
}

const genai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

const server = new McpServer({
  name: "ads-visual-gemini",
  version: "0.2.0",
});

// Helper: read image file as base64
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
  };
  return {
    data: buffer.toString("base64"),
    mimeType: mimeMap[ext] || "image/png",
  };
}

// Helper: save base64 image to file
function saveBase64Image(base64Data: string, outputPath: string): string {
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const buffer = Buffer.from(base64Data, "base64");
  fs.writeFileSync(outputPath, buffer);
  return path.resolve(outputPath);
}

// Helper: call Gemini API with retry
async function callGeminiWithRetry(
  model: string,
  contents: any[],
  config: any,
  maxRetries = 3
): Promise<any> {
  let lastError: Error | null = null;
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    if (attempt > 0) {
      const delay = Math.min(2000 * Math.pow(2, attempt - 1), 16000);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
    try {
      const response = await genai.models.generateContent({
        model,
        contents,
        config,
      });
      return response;
    } catch (err: any) {
      lastError = err;
      if (err?.status === 429 || err?.status === 503) continue;
      throw err;
    }
  }
  throw lastError || new Error("All retries exhausted");
}

// Tool 1: Generate an ad image from prompt (text-to-image or image-to-image)
server.tool(
  "generate_ad_image",
  "Generate an ad creative image using Gemini's image generation. Supports text-to-image (no reference) and image-to-image (with reference image) generation.",
  {
    prompt: z.string().describe("Detailed image generation prompt including brand constraints, composition, and style"),
    reference_image_path: z.string().optional().describe("Path to reference image for image-to-image generation"),
    output_path: z.string().describe("Output file path for the generated image"),
    aspect_ratio: z.enum(["1:1", "3:4", "4:3", "9:16", "16:9"]).optional().describe("Aspect ratio for the output image"),
    image_strength: z.number().min(0).max(1).optional().describe("How closely to match reference image (0=loose, 1=exact). Only used with reference_image_path"),
  },
  async ({ prompt, reference_image_path, output_path, aspect_ratio, image_strength }) => {
    const parts: any[] = [];

    if (reference_image_path) {
      const { data, mimeType } = readImageAsBase64(reference_image_path);
      parts.push({ inlineData: { mimeType, data } });

      const strength = image_strength ?? 0.7;
      const strengthDesc = strength > 0.7 ? "very closely" : strength > 0.4 ? "closely" : "loosely";
      const referenceInstruction = `CRITICAL: Use the provided reference image as the primary visual base. The output should ${strengthDesc} match the reference image's composition, colors, subjects, and style. Transform and adapt the reference according to these instructions: `;
      parts.push({ text: referenceInstruction + prompt });
    } else {
      parts.push({ text: prompt });
    }

    const config: any = {
      responseModalities: ["IMAGE"],
    };
    if (aspect_ratio) {
      config.imageConfig = { aspectRatio: aspect_ratio };
    }

    const response = await callGeminiWithRetry(
      "gemini-2.0-flash-exp",
      [{ role: "user", parts }],
      config
    );

    const imagePart = response.candidates?.[0]?.content?.parts?.find(
      (part: any) => part.inlineData?.data
    );
    if (!imagePart?.inlineData?.data) {
      throw new Error("No image data returned from Gemini");
    }

    const savedPath = saveBase64Image(imagePart.inlineData.data, output_path);

    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify({
            status: "success",
            output_path: savedPath,
            aspect_ratio: aspect_ratio || "auto",
            mode: reference_image_path ? "image-to-image" : "text-to-image",
          }),
        },
      ],
    };
  }
);

// Tool 2: Resize ad for different platforms
server.tool(
  "resize_ad_image",
  "Resize and adapt an ad creative for a specific platform format with composition-aware recomposition (not simple crop/stretch).",
  {
    image_path: z.string().describe("Path to the source ad image"),
    platform: z.enum([
      "instagram-feed", "instagram-story", "instagram-reel",
      "facebook-feed", "facebook-story",
      "linkedin-feed", "linkedin-story",
      "tiktok",
      "google-display-leaderboard", "google-display-rectangle", "google-display-skyscraper",
      "youtube-thumbnail",
    ]).describe("Target platform and format"),
    output_path: z.string().describe("Output file path for the resized image"),
    composition_notes: z.string().optional().describe("Composition analysis notes to guide recomposition (element positions, hierarchy, safe zones)"),
  },
  async ({ image_path, platform, output_path, composition_notes }) => {
    const platformSpecs: Record<string, { ratio: string; desc: string }> = {
      "instagram-feed": { ratio: "1:1", desc: "Instagram Feed Post (1080x1080)" },
      "instagram-story": { ratio: "9:16", desc: "Instagram Story (1080x1920)" },
      "instagram-reel": { ratio: "9:16", desc: "Instagram Reel (1080x1920)" },
      "facebook-feed": { ratio: "4:3", desc: "Facebook Feed Post (1200x900)" },
      "facebook-story": { ratio: "9:16", desc: "Facebook Story (1080x1920)" },
      "linkedin-feed": { ratio: "4:3", desc: "LinkedIn Feed Post (1200x627)" },
      "linkedin-story": { ratio: "9:16", desc: "LinkedIn Story (1080x1920)" },
      "tiktok": { ratio: "9:16", desc: "TikTok Video Cover (1080x1920)" },
      "google-display-leaderboard": { ratio: "16:9", desc: "Google Display Leaderboard (728x90)" },
      "google-display-rectangle": { ratio: "4:3", desc: "Google Display Medium Rectangle (300x250)" },
      "google-display-skyscraper": { ratio: "9:16", desc: "Google Display Wide Skyscraper (160x600)" },
      "youtube-thumbnail": { ratio: "16:9", desc: "YouTube Thumbnail (1280x720)" },
    };

    const spec = platformSpecs[platform];
    const { data, mimeType } = readImageAsBase64(image_path);

    const compositionGuidance = composition_notes
      ? `\n\nComposition analysis for intelligent recomposition:\n${composition_notes}`
      : "";

    const prompt = `Adapt this marketing ad creative for ${spec.desc}. Maintain all brand elements, copy, and visual hierarchy. Recompose the layout to fit the ${spec.ratio} aspect ratio naturally — do not simply crop or stretch. Ensure all text remains legible and the CTA is prominent. Keep the same color palette and brand identity.${compositionGuidance}`;

    const response = await callGeminiWithRetry(
      "gemini-2.0-flash-exp",
      [
        {
          role: "user",
          parts: [
            { inlineData: { mimeType, data } },
            { text: prompt },
          ],
        },
      ],
      {
        responseModalities: ["IMAGE"],
        imageConfig: { aspectRatio: spec.ratio },
      }
    );

    const imagePart = response.candidates?.[0]?.content?.parts?.find(
      (part: any) => part.inlineData?.data
    );
    if (!imagePart?.inlineData?.data) {
      throw new Error("No image data returned from Gemini");
    }

    const savedPath = saveBase64Image(imagePart.inlineData.data, output_path);

    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify({
            status: "success",
            platform,
            spec: spec.desc,
            output_path: savedPath,
          }),
        },
      ],
    };
  }
);

// Tool 3: Refine specific ad elements
server.tool(
  "refine_ad_element",
  "Regenerate an ad image with specific element changes while keeping other elements intact. For targeted edits like headline, CTA, colors, or layout adjustments.",
  {
    image_path: z.string().describe("Path to the ad image to refine"),
    instructions: z.string().describe("Detailed description of what to change"),
    output_path: z.string().describe("Output file path for the refined image"),
    preserve_elements: z.array(z.string()).optional().describe("Elements to keep unchanged (e.g., ['logo', 'background', 'product image'])"),
  },
  async ({ image_path, instructions, output_path, preserve_elements }) => {
    const { data, mimeType } = readImageAsBase64(image_path);

    const preserveList = preserve_elements?.length
      ? `\n\nIMPORTANT — Preserve these elements exactly: ${preserve_elements.join(", ")}`
      : "";

    const prompt = `You are refining an existing marketing ad creative. Apply ONLY the requested changes while keeping the overall composition, brand identity, and visual style intact.

Requested changes: ${instructions}${preserveList}

Generate a refined version of this ad with the specified changes applied. Maintain all other visual elements, colors, typography, and layout as closely as possible.`;

    const response = await callGeminiWithRetry(
      "gemini-2.0-flash-exp",
      [
        {
          role: "user",
          parts: [
            { inlineData: { mimeType, data } },
            { text: prompt },
          ],
        },
      ],
      { responseModalities: ["IMAGE"] }
    );

    const imagePart = response.candidates?.[0]?.content?.parts?.find(
      (part: any) => part.inlineData?.data
    );
    if (!imagePart?.inlineData?.data) {
      throw new Error("No image data returned from Gemini");
    }

    const savedPath = saveBase64Image(imagePart.inlineData.data, output_path);

    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify({
            status: "success",
            changes_applied: instructions,
            output_path: savedPath,
          }),
        },
      ],
    };
  }
);

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error("Server error:", err);
  process.exit(1);
});
