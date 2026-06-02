# @vyriy/create

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
```

## API

Install as a project dependency:

```bash
npm install @vyriy/create
```

Use the creator from code:

```ts
import { create } from '@vyriy/create';

const code = await create({
  directory: 'app',
  dryRun: false,
  overwrite: false,
  skipExisting: false,
  install: true,
  verify: true,
});
```

`create(options)` creates a Vyriy project from the configured starter options and returns a process-style exit code.
