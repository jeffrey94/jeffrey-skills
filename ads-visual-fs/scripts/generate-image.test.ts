import { describe, expect, test } from "bun:test";
import * as fs from "node:fs";
import * as path from "node:path";

// Import by running the module's exported functions
// Since generate-image.ts uses top-level await via main(), we test the helpers directly
// by extracting them. For now, test via CLI invocation.

describe("generate-image CLI", () => {
  const script = path.resolve(__dirname, "generate-image.ts");

  test("--help exits 0 and shows usage", async () => {
    const proc = Bun.spawn(["bun", script, "--help"], { stdout: "pipe", stderr: "pipe" });
    const exitCode = await proc.exited;
    const stdout = await new Response(proc.stdout).text();
    expect(exitCode).toBe(0);
    expect(stdout).toContain("--prompt");
    expect(stdout).toContain("--image");
  });

  test("missing --prompt exits 1", async () => {
    const proc = Bun.spawn(["bun", script, "--image", "out.png"], { stdout: "pipe", stderr: "pipe" });
    const exitCode = await proc.exited;
    expect(exitCode).toBe(1);
  });

  test("missing --image exits 1", async () => {
    const proc = Bun.spawn(["bun", script, "--prompt", "test"], { stdout: "pipe", stderr: "pipe" });
    const exitCode = await proc.exited;
    expect(exitCode).toBe(1);
  });

  test("--strength abc exits 1 with validation error", async () => {
    const proc = Bun.spawn(
      ["bun", script, "--prompt", "test", "--image", "out.png", "--strength", "abc"],
      { stdout: "pipe", stderr: "pipe" }
    );
    const exitCode = await proc.exited;
    const stderr = await new Response(proc.stderr).text();
    expect(exitCode).toBe(1);
    expect(stderr).toContain("--strength must be a number between 0 and 1");
  });

  test("--strength 1.5 exits 1 with validation error", async () => {
    const proc = Bun.spawn(
      ["bun", script, "--prompt", "test", "--image", "out.png", "--strength", "1.5"],
      { stdout: "pipe", stderr: "pipe" }
    );
    const exitCode = await proc.exited;
    expect(exitCode).toBe(1);
  });

  test("--strength -0.1 exits 1 with validation error", async () => {
    const proc = Bun.spawn(
      ["bun", script, "--prompt", "test", "--image", "out.png", "--strength", "-0.1"],
      { stdout: "pipe", stderr: "pipe" }
    );
    const exitCode = await proc.exited;
    expect(exitCode).toBe(1);
  });
});
