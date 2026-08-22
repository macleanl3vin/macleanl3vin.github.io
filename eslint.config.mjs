import coreWebVitals from "eslint-config-next/core-web-vitals";
import typescript from "eslint-config-next/typescript";

/** @type {import("eslint").Linter.Config[]} */
const eslintConfig = [
  ...coreWebVitals,
  ...typescript,
  {
    ignores: [
      ".next/**",
      "out/**",
      // Nested too: Claude Code worktrees under .claude/ carry their own
      // node_modules, which a bare "node_modules/**" pattern would not match.
      "**/node_modules/**",
      ".claude/**",
      "next-env.d.ts",
    ],
  },
];

export default eslintConfig;
