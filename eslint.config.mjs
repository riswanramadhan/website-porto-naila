import { defineConfig, globalIgnores } from "eslint/config";
import js from "@eslint/js";
import nextPlugin from "@next/eslint-plugin-next";

const browserGlobals = {
  cancelAnimationFrame: "readonly",
  document: "readonly",
  IntersectionObserver: "readonly",
  localStorage: "readonly",
  requestAnimationFrame: "readonly",
  window: "readonly",
};

const nodeGlobals = {
  process: "readonly",
};

const eslintConfig = defineConfig([
  globalIgnores([".next/**", "out/**", "build/**", "node_modules/**", "legacy/**"]),
  {
    files: ["**/*.{js,jsx,mjs}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...browserGlobals,
        ...nodeGlobals,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      "@next/next": nextPlugin,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
      "no-unused-vars": "off",
      "@next/next/no-img-element": "off",
      "@next/next/no-page-custom-font": "off",
      "@next/next/no-html-link-for-pages": "off",
    },
  },
]);

export default eslintConfig;
