// @ts-check

import eslint from "@eslint/js";
import eslintPluginJest from "eslint-plugin-jest";
import tseslint from "typescript-eslint";

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  {
    ignores: [
      "**/node_modules/*",
      "**/dist/*",
      "**/build/*",
      "**/coverage/*",
      "**/jest.config.js",
      "**/.gitignore",
      ".github/workflows/*",
      "apps/e2e/playwright-report/*",
      "apps/e2e/test-results/*",
      ".changelog.config.cjs",
    ],
  },
  {
    rules: {
      "no-console": "error",
      "jest/no-disabled-tests": "warn",
      "jest/no-focused-tests": "error",
      "jest/no-identical-title": "error",
    },
  },
  {
    plugins: {
      jest: eslintPluginJest,
    },
  },
);
