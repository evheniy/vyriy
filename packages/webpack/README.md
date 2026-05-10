# @vyriy/webpack-config

Shared Webpack config for Vyriy projects.

## Purpose

This package provides two small typed Webpack config generators for Vyriy client and server builds.

## Install

With npm:

```bash
npm install @vyriy/webpack-config webpack webpack-cli
```

With Yarn:

```bash
yarn add @vyriy/webpack-config webpack webpack-cli
```

Install `webpack` and `webpack-cli` in the consumer project so Webpack CLI commands are available.

## Usage

For client bundles:

```js
import { csr } from '@vyriy/webpack-config';

export default csr('./src/index.tsx', {
  path: '/absolute/path/to/dist/client',
  filename: 'index.js',
  clean: true,
});
```

For SSR bundles:

```js
import { ssr } from '@vyriy/webpack-config';

export default ssr(['@w/api'], {
  path: '/absolute/path/to/dist/api',
  filename: 'index.js',
  library: { type: 'commonjs2' },
  clean: true,
});
```

The second parameter is a regular Webpack `output` config passed as-is.

Both generators accept a third parameter with local Webpack overrides that are merged over the shared defaults:

```js
import { csr } from '@vyriy/webpack-config';

export default csr(
  './src/index.tsx',
  {
    path: '/absolute/path/to/dist/client',
    filename: 'index.js',
    clean: true,
  },
  {
    optimization: {
      splitChunks: true,
    },
  },
);
```

With types:

```ts
import { csr, type WebpackConfig } from '@vyriy/webpack-config';

const config: WebpackConfig = csr('./src/index.tsx', {
  path: '/absolute/path/to/dist/client',
  filename: 'index.js',
  clean: true,
});

export default config;
```

## API

- `csr(entry, output, config?)` creates a browser-oriented Webpack config.
- `ssr(entry, output, config?)` creates a node-oriented SSR Webpack config.
- `WebpackConfig`, `WebpackEntry`, and `WebpackOutput` expose the shared config helper types.

Shared defaults:

- `devtool: false`
- `mode`: `production` when `NODE_ENV=production`, otherwise `development`
- `performance.hints: false`
- production `optimization` with `TerserPlugin`
- merged `resolve` defaults
