import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';
import path from 'node:path';

const projectRoot = path.resolve(import.meta.dirname, '../../');

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...tseslint.configs.strict,
  ...tseslint.configs.stylistic,
  {
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: [
            // Root execution relative paths
            'eslint.config.js',
            'vitest.config.ts',
            // Package execution relative paths (Unix style)
            '../../eslint.config.js',
            '../../vitest.config.ts',
            // Package execution relative paths (Windows style)
            '..\\..\\eslint.config.js',
            '..\\..\\vitest.config.ts',
            // Absolute paths
            path.resolve(projectRoot, 'eslint.config.js'),
            path.resolve(projectRoot, 'vitest.config.ts'),
          ],
        },
        tsconfigRootDir: projectRoot,
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
      eqeqeq: ['error', 'always'],
      curly: ['error', 'all'],
      'prefer-const': 'error',
      'no-var': 'error',
    },
  },
  prettier,
);
