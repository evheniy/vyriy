# @vyriy/prettier-config

Shared Prettier config for Vyriy projects.

## Purpose

This package provides the base Prettier setup used in Vyriy repositories, including the multiline arrays plugin and common formatting defaults.
Arrays with more than three elements are formatted across multiple lines.
The multiline arrays plugin is resolved from this shared config package, so consumer projects only need the config package and their local Prettier CLI.

Prettier is responsible for formatting syntactically valid code. It does not replace TypeScript, ESLint, Stylelint, or tests; it is one small validation and formatting step in the shared Vyriy workflow.

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

```ts
import baseConfig, { type Config } from '@vyriy/prettier-config';

const config: Config = {
  ...baseConfig,
  printWidth: 100,
};

export default config;
```

Run Prettier against a file or folder:

```bash
npx prettier index.ts
npx prettier index.ts --write
```

If Prettier cannot parse a file, it stops and reports the syntax error location instead of rewriting the file.

Use `.prettierignore` to skip generated and dependency directories. Vyriy projects ignore:

- `node_modules`
- `coverage`
- `dist`
- `storybook-static`
- `consumer`

## Formatting Scope

Prettier controls multiline arrays through `prettier-plugin-multiline-arrays`.
Object multiline checks are handled by `@vyriy/eslint-config`.

Prettier does not support a stable count-based rule for import or export specifiers. If import or export specifiers fit within `printWidth`, Prettier may keep them on one line.

## Full Example

See the article with a complete usage walkthrough: <https://vyriy.dev/examples/vyriy-prettier-config/>.
