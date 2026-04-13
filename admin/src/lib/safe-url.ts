/**
 * @file safe-url.ts
 * @description Safe URL helpers — allow only http(s) and root-relative URLs for rendered links/iframes
 * @author Gurkirat Singh
 * @org GBN Government Polytechnic, Nilokheri
 * @license All rights reserved — GBN Government Polytechnic, Nilokheri
 */

const BLOCKED_SCHEME = /^(javascript|data|file|vbscript):/i;

/**
 * Returns a safe URL for rendering or null when the value is unsafe.
 */
export function toSafeUrl(input?: string | null): string | null {
  if (!input) return null;
  const value = input.trim();
  if (!value || BLOCKED_SCHEME.test(value) || value.startsWith("//")) return null;

  if (value.startsWith("/")) {
    return value;
  }

  try {
    const parsed = new URL(value);
    if (parsed.protocol === "http:" || parsed.protocol === "https:") {
      return value;
    }
    return null;
  } catch {
    return null;
  }
}
