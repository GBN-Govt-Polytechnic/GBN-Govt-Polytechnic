import { describe, expect, test } from "bun:test";
import { slugify } from "@/utils/slug";

describe("slugify", () => {
  test("lowercases and hyphenates", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });

  test("strips special characters", () => {
    expect(slugify("Hello, World! @2026")).toBe("hello-world-2026");
  });

  test("collapses multiple spaces and hyphens", () => {
    expect(slugify("too   many   spaces")).toBe("too-many-spaces");
    expect(slugify("too---many---hyphens")).toBe("too-many-hyphens");
  });

  test("trims leading/trailing whitespace and hyphens", () => {
    expect(slugify("  hello world  ")).toBe("hello-world");
    expect(slugify("--hello--")).toBe("hello");
  });

  test("handles underscores as separators", () => {
    expect(slugify("hello_world_test")).toBe("hello-world-test");
  });

  test("returns empty string for empty input", () => {
    expect(slugify("")).toBe("");
  });

  test("handles strings with only special chars", () => {
    expect(slugify("@#$%^&*")).toBe("");
  });

  test("preserves numbers", () => {
    expect(slugify("CSE 301 Lab")).toBe("cse-301-lab");
  });

  test("handles real-world titles", () => {
    expect(slugify("Annual Day Celebration 2025-26")).toBe("annual-day-celebration-2025-26");
    expect(slugify("MoU with TCS — Signed")).toBe("mou-with-tcs-signed");
    expect(slugify("AICTE Approval (2024)")).toBe("aicte-approval-2024");
  });
});
