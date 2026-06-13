# @vyriy/dist

Part of [Vyriy](https://vyriy.dev) - a calm architecture toolkit for TypeScript, React, SSR, SSG, APIs, and cloud-ready apps.

Full documentation: https://vyriy.dev/docs/dist/

Vyriy distribution build CLI and package metadata preparation API.

## CLI

Install globally:

```bash
npm install --global @vyriy/dist
```

Prepare compiled workspace packages for distribution:

```bash
vyriy-dist
vyriy-dist --help
vyriy-dist --version
```

## API

Install as a project dependency:

```bash
npm install @vyriy/dist
```

Run distribution preparation and CLI helper from code:

```ts
import { dist, runDistCli } from '@vyriy/dist';

const code = await dist();

await runDistCli(['--help']);
```

`dist()` copies root package metadata, prepares each `dist/<package>/package.json`, creates export maps, removes empty generated JavaScript files, and returns a process-style exit code.
