# @vyriy/webpack-config

Shared Webpack config for Vyriy projects.

## Purpose

This package provides small typed Webpack helpers for Vyriy client and server builds:

- browser and SSR config generators
- an HTML plugin helper backed by `html-webpack-plugin` and `@vyriy/html`
- reusable script and style module rules
- a node_modules externalizer for server bundles

## Install

With npm:

```bash
npm install @vyriy/webpack-config webpack-cli
```

With Yarn:

```bash
yarn add @vyriy/webpack-config webpack-cli
```

The `webpack` package is listed in the install command because the shared config is consumed by Webpack at build time. Add `webpack-cli` only when the consumer project runs Webpack through CLI commands.

Build loaders, Babel presets, and Babel plugins used by the shared config are resolved from `@vyriy/webpack-config`. Consumer projects do not need to install `babel-loader`, style loaders, or the shared Babel presets just to use the defaults.

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
import { ssr, external } from '@vyriy/webpack-config';

export default ssr(
  ['@w/api'],
  {
    path: '/absolute/path/to/dist/api',
    filename: 'index.js',
    library: { type: 'commonjs2' },
    clean: true,
  },
  (config) => ({
    ...config,
    externals: [
      ...(Array.isArray(config.externals) ? config.externals : []),
      external({
        allowlist: [/^@p/, /^@w/, /^@vyriy/],
      }),
    ],
  }),
);
```

The second parameter is a regular Webpack `output` config passed as-is.

Both generators accept a third parameter with a local Webpack config transform. The transform receives the shared config and returns the final config, so the consumer can choose where to extend defaults and where to replace them.

For example, add an HTML document to a client build:

```js
import { csr, html } from '@vyriy/webpack-config';

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
      html({
        title: '<title>App</title>',
        body: '<div id="root"></div>',
      }),
    ],
  }),
);
```

The `html` helper accepts `HtmlProps` from `@vyriy/html` as the first parameter and optional `html-webpack-plugin` options as the second parameter:

```js
import { html } from '@vyriy/webpack-config';

html(
  {
    title: '<title>App</title>',
    meta: '<meta name="viewport" content="width=device-width, initial-scale=1" />',
    body: '<div id="root"></div>',
  },
  {
    filename: 'index.html',
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

- `csr(entry, output, transform?)` creates a browser-oriented Webpack config.
- `ssr(entry, output, transform?)` creates a node-oriented SSR Webpack config.
- `html(props, options?)` creates an `HtmlWebpackPlugin` instance from `@vyriy/html` document sections.
- `external(options?)` creates a Webpack `externals` function that leaves bare package imports as CommonJS runtime imports.
- `WebpackConfig`, `WebpackConfigTransform`, `WebpackEntry`, and `WebpackOutput` expose the shared config helper types.

Shared defaults:

- `devtool: false`
- `mode`: `production` when `NODE_ENV=production`, otherwise `development`
- `performance.hints: false`
- production `optimization` with `TerserPlugin`
- merged `resolve` defaults

CSR defaults:

- loaders and Babel extensions are resolved from this package for workspace and package-manager isolation
- webpack-dev-server uses shared CORS headers for local cross-origin bundle consumption
- CSS is extracted with `MiniCssExtractPlugin` in production and development
- development builds enable React refresh with `ReactRefreshWebpackPlugin`

HTML plugin defaults:

- `templateContent` rendered from `@vyriy/html`
- `publicPath: '/'`
- `hash: true`
- `inject: 'body'`
- minification enabled for whitespace, comments, JS, and CSS
- local plugin options override shared defaults

## Style Rules

The `style(options?)` helper creates the shared CSS/SCSS/Sass rule:

```ts
import { style } from '@vyriy/webpack-config';

style({ mode: 'inject' });
style({ mode: 'extract' });
style({ mode: 'ignore' });
```

Modes:

- `inject` uses `style-loader`, so ordinary style imports are inserted into the document head.
- `extract` uses `mini-css-extract-plugin`, so ordinary style imports become CSS files that can be linked by HTML or served by webpack-dev-server.
- `ignore` uses `null-loader`, which is useful for SSR bundles.

All non-ignored modes also support inline CSS string imports:

```ts
import css from './profile-card.scss?inline';

const styles = document.createElement('style');
styles.textContent = css;
```

This is useful for custom elements that place styles inside a Shadow DOM. CSR builds extract ordinary stylesheet imports by default, so custom elements can also use a linked stylesheet without local rule replacement. Webpack dev server can serve the extracted CSS from memory, while production emits the same kind of CSS asset to disk.

See the article with a complete browser and SSR bundling walkthrough: <https://vyriy.dev/examples/vyriy-webpack-config/>.
