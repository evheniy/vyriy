# @vyriy/check

Vyriy environment check CLI and reusable validation API.

## CLI

Install globally:

```bash
npm install --global @vyriy/check
```

Check the local project environment:

```bash
vyriy-check
```

## API

Install as a project dependency:

```bash
npm install @vyriy/check
```

Run the environment check from code:

```ts
import { checkEnv } from '@vyriy/check';

const code = await checkEnv();
```

`checkEnv()` checks the local Node.js, Corepack, and Yarn environment and returns a process-style exit code.
