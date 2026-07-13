import baseConfig from './configs/eslient/base.js';

export default [
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.next/**',
      '**/out/**',
      '**/build/**',
      '**/coverage/**',
      '**/.turbo/**',
      'configs/eslient/**', // ignore configuration directory itself
      'configs/prettier/**',
      'configs/typescript/**',
      '**/*.d.ts',
    ],
  },
  ...baseConfig,
];
