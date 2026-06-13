# @vyriy/create

Part of [Vyriy](https://vyriy.dev) - a calm architecture toolkit for TypeScript, React, SSR, SSG, APIs, and cloud-ready apps.

Full documentation: https://vyriy.dev/docs/create/

Vyriy project creation CLI and programmatic scaffold API.

## CLI

Install globally:

```bash
npm install --global @vyriy/create
```

Run the project creator:

```bash
vyriy-create app
vyriy-create app --dry-run
vyriy-create . --overwrite
vyriy-create app --no-install
vyriy-create app --no-verify
vyriy-create --help
vyriy-create --version
```

## API

Install as a project dependency:

```bash
npm install @vyriy/create
```

Use the creator and CLI helpers from code:

```ts
import { create, runCreateCli } from '@vyriy/create';

const code = await create({
  directory: 'app',
  dryRun: false,
  overwrite: false,
  skipExisting: false,
  install: true,
  verify: true,
});

await runCreateCli(['app', '--dry-run']);
```

`create(options)` creates a Vyriy project from the configured starter options and returns a process-style exit code.
