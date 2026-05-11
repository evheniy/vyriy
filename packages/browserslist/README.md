# @vyriy/browserslist-config

Shared Browserslist config for Vyriy projects.

## Purpose

This package centralizes reusable Browserslist target sets for applications and libraries in the Vyriy monorepo. It provides separate environments for local development, SSR, default production builds, and a narrower modern browser target.

## Install

With npm:

```bash
npm install -D @vyriy/browserslist-config
```

With Yarn:

```bash
yarn add -D @vyriy/browserslist-config
```

Install `browserslist` separately only when the consumer project needs the Browserslist CLI binary.

## Usage

Create `.browserslistrc` in your project:

```ini
[development]
extends @vyriy/browserslist-config

[ssr]
extends @vyriy/browserslist-config

[production]
extends @vyriy/browserslist-config

[modern]
extends @vyriy/browserslist-config
```

Available environments:

- `development`
- `ssr`
- `production`
- `modern`

Programmatic usage is also supported:

```js
const browserslistConfig = require('@vyriy/browserslist-config');

module.exports = browserslistConfig;
```

```ts
import browserslistConfig from '@vyriy/browserslist-config';

export default browserslistConfig;
```

If you use it from TypeScript, the package also exposes types from the root entry.

```ts
import browserslistConfig, { type BrowserslistConfig } from '@vyriy/browserslist-config';

const config: BrowserslistConfig = browserslistConfig;
```

## CLI

You can inspect the resolved browser targets from the command line with `browserslist`:

```bash
npx browserslist --config .browserslistrc
npx browserslist --config .browserslistrc --env development
npx browserslist --config .browserslistrc --env ssr
npx browserslist --config .browserslistrc --env production
npx browserslist --config .browserslistrc --env modern
```

## API

- `development` targets the latest Chrome for fast local iteration.
- `ssr` targets Node.js 24 for server-side rendering.
- `production` targets a broad, safe browser baseline for public builds.
- `modern` targets the latest Chrome, Safari, and Firefox versions.
