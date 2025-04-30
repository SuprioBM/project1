import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  {
    rules: {
      // ✅ Disable unused vars warning
      "@typescript-eslint/no-unused-vars": "off",
      "no-unused-vars": "off",

      // ✅ Optional: loosen other common annoying errors
      "react/jsx-key": "off",
      "react/react-in-jsx-scope": "off",
    },
  },
];

export default eslintConfig;
