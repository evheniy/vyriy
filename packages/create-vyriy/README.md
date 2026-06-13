# create-vyriy

Part of [Vyriy](https://vyriy.dev) - a calm architecture toolkit for TypeScript, React, SSR, SSG, APIs, and cloud-ready apps.

Full documentation: https://vyriy.dev/docs/create-vyriy/

Unscoped `npm create vyriy` entry point for creating Vyriy projects.

## CLI

Run with npm:

```bash
npm create vyriy app
npm create vyriy app -- --dry-run
npm create vyriy . -- --overwrite
npm create vyriy app -- --no-install
```

Install globally:

```bash
npm install --global create-vyriy
```

Run the installed command:

```bash
create-vyriy app
create-vyriy app --dry-run
create-vyriy . --skip-existing
create-vyriy --help
create-vyriy --version
```

## API

Install as a project dependency:

```bash
npm install create-vyriy
```

Use the creator from code:

```ts
import { create } from 'create-vyriy';

const code = await create({
  directory: 'app',
  dryRun: false,
  overwrite: false,
  skipExisting: false,
  install: true,
  verify: true,
});
```

`create-vyriy` delegates to `@vyriy/create` and returns the same process-style exit code.
