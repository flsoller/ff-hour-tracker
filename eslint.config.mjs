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
