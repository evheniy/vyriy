# @vyriy/check

Part of [Vyriy](https://vyriy.dev) - a calm architecture toolkit for TypeScript, React, SSR, SSG, APIs, and cloud-ready apps.

Full documentation: https://vyriy.dev/docs/check/

Vyriy environment check CLI and reusable validation API.

## CLI

Install globally:

```bash
npm install --global @vyriy/check
```

Check the local project environment:

```bash
vyriy-check
vyriy-check --help
vyriy-check --version
```

## API

Install as a project dependency:

```bash
npm install @vyriy/check
```

Run the environment check and CLI helper from code:

```ts
import { checkEnv, runCheckCli } from '@vyriy/check';

const code = await checkEnv();

await runCheckCli(['--help']);
```

`checkEnv()` checks the local Node.js, Corepack, and Yarn environment and returns a process-style exit code.
