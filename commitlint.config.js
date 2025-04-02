/** @type {import('@commitlint/types').UserConfig} */
export default {
  extends: ['@commitlint/config-conventional'],
  formatter: '@commitlint/format',
  rules: {
    'type-enum': [2, 'always', ['fix', 'ui', 'refactor', 'feat', 'chore', 'test', 'revert', 'perf', 'ci', 'docs']],
    'subject-max-length': [2, 'always', 72],
    'body-max-length': [2, 'always', 80],
    'subject-case': [1, 'always', 'lower-case']
  },
  defaultIgnores: false,
  helpUrl: 'https://github.com/conventional-changelog/commitlint/#what-is-commitlint'
};
