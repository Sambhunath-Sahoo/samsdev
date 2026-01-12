import next from "eslint-config-next";

// Next.js v16 ships a flat-config export via `eslint-config-next`.
// Keeping this config minimal improves compatibility with ESLint v9.
const config = [
  ...next,
  {
    rules: {
      // This rule is too strict for common client-only initialization patterns
      // (e.g. reading localStorage in an effect, mounted guards for next-themes).
      "react-hooks/set-state-in-effect": "off",
    },
  },
];

export default config;
