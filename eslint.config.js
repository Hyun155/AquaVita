module.exports = [
  {
    ignores: ["node_modules", ".next"],
  },
  {
    files: ["app/**/*.{js,jsx,ts,tsx}", "components/**/*.{js,jsx,ts,tsx}", "lib/**/*.{js,jsx,ts,tsx}", "hooks/**/*.{js,jsx,ts,tsx}", "pages/**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      parser: require("@typescript-eslint/parser"),
      parserOptions: { ecmaVersion: "latest", sourceType: "module", ecmaFeatures: { jsx: true } },
    },
    rules: {},
  },
];
