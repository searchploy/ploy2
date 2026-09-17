import coreWebVitals from "eslint-config-next/core-web-vitals";
import typescript from "eslint-config-next/typescript";

/**
 * ESLint 9 only reads flat config, so the old .eslintrc.json was ignored and
 * `npm run lint` failed outright.
 *
 * eslint-config-next 16 already ships flat-native config arrays, so they are
 * spread directly. Routing them through FlatCompat instead makes ESLint try to
 * validate them as eslintrc and throw "Converting circular structure to JSON"
 * on the react plugin's self-reference.
 */
const asFlat = (mod) => (Array.isArray(mod) ? mod : mod.default);

const eslintConfig = [
  {
    ignores: [".next/**", "node_modules/**", "next-env.d.ts", "supabase/**"],
  },
  ...asFlat(coreWebVitals),
  ...asFlat(typescript),
];

export default eslintConfig;
