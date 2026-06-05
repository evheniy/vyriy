# @vyriy/static

Static file and SPA serving CLI with reusable Lambda-style handlers and router helpers.

## CLI

Install globally:

```bash
npm install --global @vyriy/static
```

Serve a static directory:

```bash
vyriy-static
vyriy-static dist
vyriy-static public --cache static
vyriy-static --port 3000 dist
vyriy-static dist --spa --fallback index.html --cache static
```

When no directory is provided to the CLI, it tries `dist`, `build`, `public`, `out`, and then the current directory.

CLI flags:

- `--port <port>` or `-p <port>` sets the local server port.
- `--cache <preset>` sets `none`, `default`, `static`, or `immutable`.
- `--index <file>` sets the static directory index file.
- `--not-found <file>` sets the static `404` response file.
- `--spa` enables SPA fallback mode.
- `--fallback <file>` sets the SPA fallback file.
- `--help` or `-h` prints command help.
- `--version` or `-v` prints the package version.

CLI option priority is explicit CLI args, then `VYRIY_STATIC_*` env variables, then defaults. Outside production, CLI serving defaults to `cache: 'none'` when `--cache` is omitted.

## API

Install as a project dependency:

```bash
npm install @vyriy/static
```

Use direct handlers:

```ts
import { useSpa, useStatic } from '@vyriy/static';

export const assets = useStatic('./public', {
  cache: 'immutable',
  index: false,
});

export const site = useStatic('./dist', {
  cache: 'static',
  index: 'index.html',
  notFound: '404.html',
});

export const app = useSpa('./dist', {
  cache: 'static',
  fallback: 'index.html',
});
```

Use router helpers:

```ts
import { createRouter } from '@vyriy/router';
import { withStatic } from '@vyriy/static';

export const router = withStatic(createRouter())
  .get('/api/health', () => ({ body: JSON.stringify({ ok: true }) }))
  .static('/assets', './dist/assets', { cache: 'immutable' })
  .spa('/app', './dist', { cache: 'static' })
  .fallbackSpa('./landing-dist', { cache: 'static' });
```

`static` and `spa` mounts strip the route prefix before resolving files:

```txt
/assets/logo.svg       -> ./dist/assets/logo.svg
/app/assets/main.js    -> ./dist/assets/main.js
```

Global fallbacks are explicit:

- `fallback(handler)` registers a custom unmatched-request handler.
- `fallbackStatic(directory, options?)` serves unmatched requests through static file behavior.
- `fallbackSpa(directory, options?)` serves unmatched requests through SPA fallback behavior.

Only one fallback can be registered on a wrapped router.

## Cache

Cache presets:

- `false` or `'none'` sends `Cache-Control: no-store`.
- `'default'` sends `public, max-age=3600` with validators.
- `'immutable'` sends `public, max-age=31536000, immutable` with validators.
- `'static'` caches assets long-term and revalidates HTML and metadata.

The `static` preset is designed for S3/CloudFront, Storybook, SPA builds, MFE assets, and static sites:

```txt
assets -> long immutable cache
html/json/xml/txt/yml -> no-cache + ETag + Last-Modified
SPA fallback index.html -> no-cache + ETag + Last-Modified
```

Defaults:

- `useStatic('./dist')` uses `index: 'index.html'`, `notFound: false`, and `cache: 'default'`.
- `useSpa('./dist')` uses `fallback: 'index.html'` and `cache: 'static'`.
- `staticServer()` tries `dist`, `build`, `public`, `out`, and then the current directory.
