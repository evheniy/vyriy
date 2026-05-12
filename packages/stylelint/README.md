# @vyriy/stylelint-config

Shared Stylelint config for Vyriy projects.

## Purpose

This package provides the base Stylelint setup used in Vyriy repositories for SCSS-friendly CSS linting and conventional property ordering.
It keeps CSS and SCSS linting consistent across applications, libraries, examples, and internal packages without copying the same Stylelint rules into every project.

## Install

With npm:

```bash
npm install -D @vyriy/stylelint-config stylelint
```

With Yarn:

```bash
yarn add -D @vyriy/stylelint-config stylelint
```

Install `stylelint` in the consumer project so the CLI binary is available.

## Usage

Create `stylelint.config.mjs` in your project:

```js
export { default } from '@vyriy/stylelint-config';
```

If you need local overrides:

```js
import baseConfig from '@vyriy/stylelint-config';

export default {
  ...baseConfig,
  ignoreFiles: [
    ...baseConfig.ignoreFiles,
    'coverage/**',
  ],
  rules: {
    ...baseConfig.rules,
    'selector-class-pattern': '^[a-z][a-zA-Z0-9]+$',
  },
};
```

Run Stylelint against CSS or SCSS files:

```bash
npx stylelint styles.scss
npx stylelint "src/**/*.{css,scss}"
```

## Ignore Files

The shared config ignores common generated and dependency directories:

- `build/**`
- `dist/**`
- `node_modules/**`

Project-specific generated output, such as `coverage/**` or framework-specific output directories, should be ignored in the consumer config when needed.

## API

- `extends` uses `stylelint-config-standard-scss` and `stylelint-config-recess-order`.
- `customSyntax` is `postcss-scss`.
- `ignoreFiles` contains common generated and dependency directories.
- selected rules are disabled where the shared Vyriy style stays intentionally flexible.

## Full Example

See the article with a complete SCSS linting walkthrough: <https://vyriy.dev/examples/vyriy-stylelint-config/>.
