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
vyriy-static --port 3000 dist
```

When no directory is provided to the CLI, it tries `dist`, `build`, `public`, `out`, and then the current directory.

CLI flags:

- `--port <port>` or `-p <port>` sets the local server port.
- `--help` or `-h` prints command help.
- `--version` or `-v` prints the package version.

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

export const router = withStatic(createRouter())
  .get('/api', () => ({ body: JSON.stringify({ ok: true }) }))
  .static('/dist', { directory: 'dist' })
  .static('/', { directory: 'public' });
export const spaRouter = withSpa(createRouter(), 'dist');

const code = await staticServer({ directory: 'dist' });
```

- `useStatic({ directory, index, error })` serves files from a directory.
- `useSpa(options)` serves static files and falls back to the configured index file for missing `GET` and `HEAD` paths.
- `withStatic(router).static(path, options)` adds prefix-based static mounts.
- `withStatic(router, options).static(path)` keeps a shared default for static mounts.
- `withSpa(router, directoryOrOptions)` adds static-first SPA fallback behavior.

Defaults are `directory: 'dist'`, `index: 'index.html'`, and `error: '404.html'`.
When `staticServer()` is called without options, it tries `dist`, `build`, `public`, `out`, and then the current directory.
