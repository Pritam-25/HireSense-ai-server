import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import';
import boundaries from 'eslint-plugin-boundaries'; // ✅ NEW

export default [
  // Base JS rules
  js.configs.recommended,

  // TypeScript rules
  ...tseslint.configs.recommended,

  {
    files: ['**/*.ts'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
      },
      globals: {
        console: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        URL: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
      },
    },

    plugins: {
      import: importPlugin,
      boundaries, // ✅ NEW
    },

    // ✅ NEW — describe your layers
    settings: {
      'boundaries/elements': [
        { type: 'controllers', pattern: 'src/controllers/*' },
        { type: 'services', pattern: 'src/services/*' },
        { type: 'repositories', pattern: 'src/repositories/*' },
        { type: 'db', pattern: 'src/db/*' },
        { type: 'utils', pattern: 'src/utils/*' },
      ],
    },

    rules: {
      /* ===============================
         BEST PRACTICES
      =============================== */
      'no-console': 'off',
      'prefer-const': 'error',
      'no-var': 'error',
      'object-shorthand': 'error',
      'prefer-arrow-callback': 'error',

      /* ===============================
         TYPESCRIPT
      =============================== */
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_' },
      ],

      '@typescript-eslint/no-floating-promises': 'error',

      /* ===============================
         IMPORT HYGIENE
      =============================== */
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
          ],
          'newlines-between': 'always',
        },
      ],

      // 🚫 NO ../../../ imports
      'no-restricted-imports': [
        'error',
        {
          patterns: ['../*', '../../*', '../../../*'],
        },
      ],

      /* ===============================
         ARCHITECTURE (THE BIG WIN)
      =============================== */
      'boundaries/element-types': [
        'error',
        {
          default: 'disallow',
          rules: [
            {
              from: 'controllers',
              allow: ['services', 'utils'],
            },
            {
              from: 'services',
              allow: ['repositories', 'utils'],
            },
            {
              from: 'repositories',
              allow: ['db', 'utils'],
            },
          ],
        },
      ],
    },
  },

  // 🧪 Test files
  {
    files: ['tests/**/*.ts'],
    languageOptions: {
      globals: {
        describe: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
      },
    },
  },

  // 🚫 Ignore folders
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'coverage/**',
      'logs/**',
      'drizzle/**',
    ],
  },
];
