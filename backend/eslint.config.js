import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import jsdoc from "eslint-plugin-jsdoc";

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: { jsdoc },
    rules: {
      // ── Errors (block deploy) ──
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": ["error", {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
      }],

      // ── Warnings (show but don't block) ──
      "jsdoc/require-file-overview": ["warn", {
        tags: {
          file: { mustExist: true },
        },
      }],
      "no-console": ["warn", { allow: ["warn", "error"] }],
    },
  },
  {
    ignores: ["dist/", "node_modules/", "prisma/", "tests/"],
  },
);
