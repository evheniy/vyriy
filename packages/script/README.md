# @vyriy/script

Part of [Vyriy](https://vyriy.dev) - a calm architecture toolkit for TypeScript, React, SSR, SSG, APIs, and cloud-ready apps.

Full documentation: https://vyriy.dev/docs/script/

Composable script wrappers for Vyriy projects.

## Purpose

This package provides a small composition layer for CLI-style or bootstrap-style async tasks.

It includes:

- a generic `factory()` helper for building wrappers
- `compose()` for combining decorators
- a ready-made `script` decorator with the default Vyriy wrapper chain
- focused wrappers for error handling, logging, timeout control, and process exit codes

## Install

With npm:

```bash
npm install @vyriy/script
```

With Yarn:

```bash
yarn add @vyriy/script
```

## Usage

Use the default `script` decorator:

```ts
import { script } from '@vyriy/script';

await script(async () => {
  // your task
});
```

Or compose wrappers manually:

```ts
import { compose, withError, withLogger, withTimeout } from '@vyriy/script';

const run = compose(
  withError({
    errorHandler: async (error) => {
      console.error('Task failed:', error);
    },
  }),
  withLogger(),
  withTimeout(),
);

await run(async () => {
  // your task
});
```

## Default Script Chain

The exported `script` decorator is built from:

- `withExit()`
- `withError()`
- `withLogger()`
- `withTimeout()`

Applied through `compose(...)`, this means the task gets timeout handling, logging, error interception, and final process exit handling in one reusable decorator.

## API

- `compose(...decorators)`
  Combines decorators from right to left into one decorator.

- `factory(wrapper)`
  Creates decorator factories from `(task, options?) => Promise<void>` wrappers.

- `script`
  Default decorator composed from the built-in wrappers.

- `withError(options?)`
  Wraps a task with optional async error handling.

- `withExit()`
  Exits the process with `0` on success and `1` on failure.

- `withLogger(options?)`
  Logs task start, success, and failure messages. Uses `createLogger()` by default.

- `withTimeout()`
  Reads `TIMEOUT` through `@vyriy/config` and races the task against `@vyriy/timeout`.

## Wrapper Options

`withError(options?)`

```ts
{
  errorHandler?: (error: unknown) => Promise<void>;
}
```

`withLogger(options?)`

```ts
{
  logger?: typeof console;
}
```

## Exports

The package exposes:

```ts
import { compose, factory, script, withError, withExit, withLogger, withTimeout } from '@vyriy/script';

import { compose } from '@vyriy/script/compose';
import { factory } from '@vyriy/script/factory';

import { withError } from '@vyriy/script/wrapper/error';
import { withExit } from '@vyriy/script/wrapper/exit';
import { withLogger } from '@vyriy/script/wrapper/logger';
import { withTimeout } from '@vyriy/script/wrapper/timeout';

import type { Compose, Decorator, Factory, Result, Task, Wrapper } from '@vyriy/script/types';
```

## Notes

- decorators operate on async tasks shaped as `() => Promise<void>`
- `withTimeout()` uses no timeout when `TIMEOUT` is missing and parses configured values as durations
- `withExit()` is intended for real script entrypoints because it calls `process.exit(...)`
