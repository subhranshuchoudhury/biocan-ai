import next from '@next/eslint-plugin-next';
import stylistic from '@stylistic/eslint-plugin';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import jsdoc from 'eslint-plugin-jsdoc';
import jsonPlugin from 'eslint-plugin-json';
import prettier from 'eslint-plugin-prettier';
import yamlPlugin from 'eslint-plugin-yaml';
import globals from 'globals';
import jsonParser from 'jsonc-eslint-parser';
import yamlParser from 'yaml-eslint-parser';

export default [
  {
    // Common configuration for all file types
    files: ['**/*.{js,ts,tsx,json,yml,yaml}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module'
    },
    plugins: {
      prettier
    },
    rules: {
      'prettier/prettier': 'warn',
      curly: 'warn',
      'arrow-body-style': ['warn', 'as-needed'],
      'no-console': 'warn'
    }
  },
  {
    // JSON specific configuration
    files: ['**/*.json'],
    languageOptions: {
      parser: jsonParser
    },
    plugins: {
      json: jsonPlugin
    }
  },
  {
    // TypeScript specific configuration
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        project: './tsconfig.json',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true
        }
      },
      globals: {
        ...globals.browser
      }
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      jsdoc,
      '@stylistic': stylistic,
      '@next/next': next
    },
    settings: {
      react: {
        version: 'detect'
      }
    },
    rules: {
      ...next.configs.recommended.rules,
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      'no-param-reassign': 'off', // TODO must be 'error'
      'class-methods-use-this': 'off',
      'no-underscore-dangle': 'off', // TODO must be 'error'
      'consistent-return': 'warn',
      'jsdoc/require-jsdoc': 'warn',
      'jsdoc/require-param': 'warn',
      'jsdoc/require-returns': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          args: 'after-used',
          ignoreRestSiblings: true,
          varsIgnorePattern: '^_',
          argsIgnorePattern: '^_'
        }
      ],
      'jsx-quotes': ['warn', 'prefer-double'],
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@stylistic/lines-between-class-members': 'warn',
      'jsdoc/check-param-names': 'off',
      'default-case': 'off'
    }
  },
  {
    // YAML specific configuration
    files: ['**/*.{yml,yaml}'],
    languageOptions: {
      parser: yamlParser
    },
    plugins: {
      yaml: yamlPlugin
    }
  },
  {
    // JavaScript specific configuration
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module'
    }
  },
  {
    // Ignore certain directories
    ignores: ['node_modules', '.next']
  }
];
