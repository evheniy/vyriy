# @vyriy/dist

Vyriy distribution build CLI and package metadata preparation API.

## CLI

Install globally:

```bash
npm install --global @vyriy/dist
```

Prepare compiled workspace packages for distribution:

```bash
vyriy-dist
```

## API

Install as a project dependency:

```bash
npm install @vyriy/dist
```

Run distribution preparation from code:

```ts
import { dist } from '@vyriy/dist';

const code = await dist();
```

`dist()` copies root package metadata, prepares each `dist/<package>/package.json`, creates export maps, removes empty generated JavaScript files, and returns a process-style exit code.
