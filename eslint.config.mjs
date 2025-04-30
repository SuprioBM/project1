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
      // Disable unused variable rules globally
      "@typescript-eslint/no-unused-vars": "off",
      "no-unused-vars": "off",

      // Disable unused expression rule globally
      "no-unused-expressions": "off",

      // Disable explicit any warning globally
      "@typescript-eslint/no-explicit-any": "off",

      // Disable empty object type warning globally
      "@typescript-eslint/no-empty-object-type": "off",

      // Optional: disable other common rules
      "react/jsx-key": "off",
      "react/react-in-jsx-scope": "off",
    },
    ignorePatterns: ["generated/*"], // Ignore the 'generated' folder
  },
];

export default eslintConfig;
