# @vyriy/prettier-config

Shared Prettier config for Vyriy projects.

## Purpose

This package provides the base Prettier setup used in Vyriy repositories, including the multiline arrays plugin and common formatting defaults.
Arrays with more than three elements are formatted across multiple lines.

## Install

With npm:

```bash
npm install -D @vyriy/prettier-config prettier
```

With Yarn:

```bash
yarn add -D @vyriy/prettier-config prettier
```

Install `prettier` in the consumer project so CLI binaries are available.

## Usage

Create `prettier.config.mjs` in your project:

```js
export { default } from '@vyriy/prettier-config';
```

If you need local overrides:

```js
import baseConfig from '@vyriy/prettier-config';

export default {
  ...baseConfig,
  printWidth: 100,
};
```

## Formatting Scope

Prettier controls multiline arrays through `prettier-plugin-multiline-arrays`.
Object multiline checks are handled by `@vyriy/eslint-config`.

Prettier does not support a stable count-based rule for import or export specifiers. If import or export specifiers fit within `printWidth`, Prettier may keep them on one line.
