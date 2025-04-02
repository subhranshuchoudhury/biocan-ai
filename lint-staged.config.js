/**
 * @type {import('lint-staged').Configuration}
 */
export default {
  '*.css': ['prettier --check', 'stylelint'],
  '*.{ts,tsx,js,jsx,json,yml}': ['prettier --check', 'eslint --cache'],
  '*.{md,svg}': ['prettier --check']
};
