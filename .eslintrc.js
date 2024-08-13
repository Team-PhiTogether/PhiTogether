module.exports = {
  env: {
    browser: true,
    es2021: true,
    worker: true,
    node: true
  },
  extends: "eslint:recommended",
  overrides: [
    {
      files: [".eslintrc.js","**/*.cjs"],
      parserOptions: {
        sourceType: "script"
      }
    }
  ],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module"
  },
  rules: {
    "quote-props": ["error", "consistent-as-needed"],
    "indent": ["error", 2, { SwitchCase: 1 }],
    "linebreak-style": ["error", "unix"],
    "quotes": ["error", "double"],
    "semi": ["error", "always"],
    "no-undef": "off",
    "no-unused-vars": "off",
  },
  ignorePatterns: ["/static/utils/*"]
};
