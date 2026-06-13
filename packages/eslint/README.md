# @vyriy/eslint-config

Part of [Vyriy](https://vyriy.dev) - a calm architecture toolkit for TypeScript, React, SSR, SSG, APIs, and cloud-ready apps.

Full documentation: https://vyriy.dev/docs/eslint/

Shared ESLint flat config for Vyriy projects.

## Purpose

This package provides the base ESLint setup used in Vyriy repositories for:

- JavaScript recommended rules
- TypeScript
- React
- React Hooks
- Storybook
- Jest
- YAML
- `import-x` import rules and TypeScript-aware resolution
- Prettier integration
- multiline object formatting for objects with more than three properties
- runtime file extensions for relative ESM imports

## Install

With npm:

```bash
npm install -D @vyriy/eslint-config eslint
```

With Yarn:

```bash
yarn add -D @vyriy/eslint-config eslint
```

Install `eslint` in the consumer project so the ESLint CLI is available.
The shared config includes the ESLint plugins, resolvers, Storybook integration, and Prettier runtime it uses.

## Usage

Create `eslint.config.mjs` in your project:

```js
export { default } from '@vyriy/eslint-config';
```

If you need local overrides:

```ts
import baseConfig, { type Linter } from '@vyriy/eslint-config';

const config: Linter.Config[] = [
  ...baseConfig,
  {
    rules: {
      'no-console': 'warn',
    },
  },
];

export default config;
```

The TypeScript rules use type-aware linting with `parserOptions.project` set to `./tsconfig.json`.
Consumer projects should have a root `tsconfig.json` that covers the files ESLint checks.

Generated output is ignored by default:

- `node_modules/**`
- `dist/**`
- `coverage/**`
- `storybook-static/**`
- `consumer/**`

## Included Rules

The config includes:

- `@eslint/js` recommended rules
- browser and Node globals
- `@typescript-eslint` recommended type-checked rules for `**/*.{ts,tsx,mts,cts}`
- `@eslint-react` recommended TypeScript rules for package, workspace, Storybook, and story files
- `eslint-plugin-react-hooks` flat recommended rules for the same React-capable files
- `eslint-plugin-jest` recommended rules and Jest globals for `**/*.test.{ts,tsx}`
- `yaml-eslint-parser` and `eslint-plugin-yml` recommended rules for `*.yml` and `*.yaml`
- `eslint-plugin-storybook` flat recommended config entries
- `eslint-plugin-prettier` with `prettier/prettier` as a warning
- relaxed `@typescript-eslint/require-await` for `.bin` and `.storybook` TypeScript files

## Import Resolution

The config enables `eslint-plugin-import-x` for:

- `**/*.{js,mjs,cjs,jsx,ts,mts,cts,tsx}`

It uses both the TypeScript resolver and Node resolver with aliases that allow runtime `.js`, `.mjs`, and `.cjs` specifiers to resolve to matching TypeScript source files.

## Relative ESM Imports

Relative module specifiers must include the runtime file extension. TypeScript source that compiles to ESM should import local files with `.js` specifiers:

```ts
export * from './feature.js';
import { feature } from './feature.js';
export type { FeatureOptions } from './types.js';
```

Extensionless relative specifiers are reported for static imports/exports, dynamic imports, `require`, and Jest module mocks:

```ts
import { feature } from './feature';
jest.mock('./feature');
```

## Multiline Objects

Object literals with more than three properties are reported when they are kept on one line.
This keeps larger value lists easier to scan:

```ts
const options = {
  first,
  second,
  third,
  fourth,
};
```

## Prettier

Formatting issues are reported by ESLint as warnings through `prettier/prettier`.
The package depends on `prettier` directly so consumers of `@vyriy/eslint-config` do not need to install Prettier only to satisfy the plugin runtime.

Projects that also run the Prettier CLI should still install or expose `prettier` in that project so commands like `prettier . --check` are available.

See the article with a complete linting setup walkthrough: <https://vyriy.dev/examples/vyriy-eslint-config/>.
