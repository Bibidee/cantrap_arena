import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
export default [{
  files: ['**/*.{ts,tsx}'],
  ignores: ['.next/**', 'node_modules/**'],
  languageOptions: { parser: tsParser, parserOptions: { ecmaVersion: 'latest', sourceType: 'module', ecmaFeatures: { jsx: true } } },
  plugins: { '@typescript-eslint': tsPlugin },
  rules: { '@typescript-eslint/no-unused-vars': 'warn' }
}];
