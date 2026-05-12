# @vyriy/jest-config

Shared Jest config for Vyriy projects.

## Purpose

This package provides the base Jest setup used in Vyriy repositories for:

- TypeScript test runs
- SWC transforms
- JSDOM environment
- coverage defaults
- JUnit reporting

## Coverage

Coverage is enabled by default and collected from:

```ts
[
  '<rootDir>/**/*.{ts,tsx,js,jsx,mjs,cjs}',
  '!<rootDir>/**/*.d.ts',
  '!<rootDir>/**/*.stories.{ts,tsx}',
  '!<rootDir>/**/*.types.ts',
  '!<rootDir>/**/types.ts',
  '!<rootDir>/*.config.ts',
];
```

Coverage paths ignore generated output, package manager state, Storybook output, and common build folders:

```ts
[
  '/node_modules/',
  '<rootDir>/storybook-static/',
  '<rootDir>/dist/',
  '<rootDir>/build/',
  '<rootDir>/bin/',
  '<rootDir>/.bin/',
  '<rootDir>/.storybook/',
  '<rootDir>/coverage/',
  '<rootDir>/.yarn/',
];
```

Reports are written to `coverage` using `json`, `text`, `text-summary`, `lcov`, `clover`, and `cobertura` reporters. The shared default requires 100% global coverage for branches, functions, lines, and statements.

## CI Reports

The config includes `jest-junit` alongside the default Jest reporter. This writes a JUnit report to `coverage/junit.xml`, which CI systems such as GitLab can publish as a test report artifact.

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
