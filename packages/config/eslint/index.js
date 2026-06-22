// Shared flat ESLint config for Softeneers projects.
// Usage (eslint.config.js):
//   import softeneers from "@softeneers/config/eslint";
//   export default softeneers;
// Extend with extra entries: export default [...softeneers, { rules: {...} }];
import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: ["**/dist/**", "**/.next/**", "**/node_modules/**", "**/templates/**"],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      globals: { ...globals.node },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
);
