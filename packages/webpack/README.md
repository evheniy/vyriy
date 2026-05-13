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

The `webpack` package is listed in the install command because the shared config is consumed by Webpack at build time. Add `webpack-cli` only when the consumer project runs Webpack through CLI commands.

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

Both generators accept a third parameter with a local Webpack config transform. The transform receives the shared config and returns the final config, so the consumer can choose where to extend defaults and where to replace them:

```js
import { csr } from '@vyriy/webpack-config';

export default csr(
  './src/index.tsx',
  {
    path: '/absolute/path/to/dist/client',
    filename: 'index.js',
    clean: true,
  },
  (config) => ({
    ...config,
    optimization: {
      ...config.optimization,
      splitChunks: true,
    },
  }),
);
```

For example, append a local CSR plugin while keeping the shared CSR plugin:

```js
import { csr } from '@vyriy/webpack-config';

export default csr(
  './src/index.tsx',
  {
    path: '/absolute/path/to/dist/client',
    filename: 'index.js',
    clean: true,
  },
  (config) => ({
    ...config,
    plugins: [
      ...(config.plugins ?? []),
      new LocalPlugin(),
    ],
  }),
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

- `csr(entry, output, transform?)` creates a browser-oriented Webpack config.
- `ssr(entry, output, transform?)` creates a node-oriented SSR Webpack config.
- `WebpackConfig`, `WebpackConfigTransform`, `WebpackEntry`, and `WebpackOutput` expose the shared config helper types.

Shared defaults:

- `devtool: false`
- `mode`: `production` when `NODE_ENV=production`, otherwise `development`
- `performance.hints: false`
- production `optimization` with `TerserPlugin`
- merged `resolve` defaults

See the article with a complete browser and SSR bundling walkthrough: <https://vyriy.dev/examples/vyriy-webpack-config/>.
