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
vyriy-static build
vyriy-static public
```

When no directory is provided, the server tries `dist`, `build`, `public`, `out`, and then the current directory.

## API

Install as a project dependency:

```bash
npm install @vyriy/static
```

Use handlers and router helpers from code:

```ts
import { staticServer, useSpa, useStatic, withSpa, withStatic } from '@vyriy/static';
import { createRouter } from '@vyriy/router';

export const assets = useStatic();
export const app = useSpa({ directory: 'dist', index: 'index.html' });

export const router = withStatic(createRouter(), { directory: 'dist' }).static('/');
export const spaRouter = withSpa(createRouter(), 'dist');

const code = await staticServer({ directory: 'dist' });
```

`useStatic({ directory, index, error })` serves files from a directory. `useSpa(options)` serves static files and falls back to the configured index file for missing `GET` and `HEAD` paths. `withStatic(router, options).static(path)` adds prefix-based static mounts. `withSpa(router, directoryOrOptions)` adds static-first SPA fallback behavior.

Defaults are `directory: 'dist'`, `index: 'index.html'`, and `error: '404.html'`.
