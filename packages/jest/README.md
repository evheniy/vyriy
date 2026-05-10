# @vyriy/jest-config

Shared Jest config for Vyriy projects.

## Purpose

This package provides the base Jest setup used in Vyriy repositories for:

- TypeScript test runs
- SWC transforms
- JSDOM environment
- coverage defaults
- JUnit reporting

## Install

With npm:

```bash
npm install -D @vyriy/jest-config jest
```

With Yarn:

```bash
yarn add -D @vyriy/jest-config jest
```

Install `jest` in the consumer project so CLI binaries are available.

## Usage

Create `jest.config.mjs` in your project:

```js
export { default } from '@vyriy/jest-config';
```

If you need local overrides:

```ts
import baseConfig, { type Config } from '@vyriy/jest-config';

const config: Config = {
  ...baseConfig,
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};

export default config;
```

## Current Vyriy Usage

In this repository the root Jest config is a thin wrapper:

```js
export { default } from '@vyriy/jest-config';
```
