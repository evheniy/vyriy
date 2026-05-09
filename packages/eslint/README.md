# @vyriy/eslint-config

Shared ESLint flat config for Vyriy projects.

## Purpose

This package provides the base ESLint setup used in Vyriy repositories for:

- TypeScript
- React
- Storybook
- Jest
- import resolution
- Prettier integration
- multiline object formatting for objects with more than three properties

## Install

With npm:

```bash
npm install -D @vyriy/eslint-config eslint jiti
```

With Yarn:

```bash
yarn add -D @vyriy/eslint-config eslint jiti
```

Install `eslint` and `jiti` in the consumer project so CLI binaries are available.

## Usage

Create `eslint.config.mjs` in your project:

```js
export { default } from '@vyriy/eslint-config';
```

If you need local overrides:

```js
import baseConfig from '@vyriy/eslint-config';

export default [
  ...baseConfig,
  {
    rules: {
      'no-console': 'warn',
    },
  },
];
```

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
