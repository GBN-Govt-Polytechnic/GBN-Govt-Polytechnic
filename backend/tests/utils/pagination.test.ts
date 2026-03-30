import { describe, expect, test } from "bun:test";
import { parsePagination, buildPaginationMeta } from "@/utils/pagination";

describe("parsePagination", () => {
  test("returns defaults when no query params", () => {
    const result = parsePagination({});
    expect(result).toEqual({ skip: 0, take: 20, page: 1, limit: 20 });
  });

  test("parses page and limit from query", () => {
    const result = parsePagination({ page: "3", limit: "10" });
    expect(result).toEqual({ skip: 20, take: 10, page: 3, limit: 10 });
  });

  test("clamps page to minimum 1", () => {
    const result = parsePagination({ page: "-5", limit: "10" });
    expect(result.page).toBe(1);
    expect(result.skip).toBe(0);
  });

  test("falls back to default for zero limit", () => {
    // Number("0") is falsy, so || DEFAULT_LIMIT kicks in
    const result = parsePagination({ limit: "0" });
    expect(result.limit).toBe(20);
    expect(result.take).toBe(20);
  });

  test("clamps negative limit to 1", () => {
    const result = parsePagination({ limit: "-5" });
    expect(result.limit).toBe(1);
    expect(result.take).toBe(1);
  });

  test("clamps limit to MAX_LIMIT (100)", () => {
    const result = parsePagination({ limit: "999" });
    expect(result.limit).toBe(100);
    expect(result.take).toBe(100);
  });

  test("handles non-numeric input gracefully", () => {
    const result = parsePagination({ page: "abc", limit: "xyz" });
    expect(result).toEqual({ skip: 0, take: 20, page: 1, limit: 20 });
  });

  test("calculates skip correctly", () => {
    const result = parsePagination({ page: "5", limit: "25" });
    expect(result.skip).toBe(100); // (5-1) * 25
  });
});

describe("buildPaginationMeta", () => {
  test("builds correct meta", () => {
    const meta = buildPaginationMeta(95, 1, 20);
    expect(meta).toEqual({ page: 1, limit: 20, total: 95, totalPages: 5 });
  });

  test("handles zero total", () => {
    const meta = buildPaginationMeta(0, 1, 20);
    expect(meta).toEqual({ page: 1, limit: 20, total: 0, totalPages: 0 });
  });

  test("handles exact division", () => {
    const meta = buildPaginationMeta(60, 2, 20);
    expect(meta.totalPages).toBe(3);
  });

  test("rounds up partial pages", () => {
    const meta = buildPaginationMeta(21, 1, 20);
    expect(meta.totalPages).toBe(2);
  });
});
