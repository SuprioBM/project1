import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // Override rules ONLY for generated files
  {
    files: ["src/generated/**"],
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "no-unused-vars": "off",
      "no-unused-expressions": "off",
      "@typescript-eslint/no-require-imports": "off",
    },
  },

  // You can keep global rule overrides here if truly needed
  {
    rules: {
      "react/jsx-key": "off",
      "react/react-in-jsx-scope": "off",
    },
  },
];
