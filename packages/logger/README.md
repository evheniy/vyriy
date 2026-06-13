# @vyriy/logger

Part of [Vyriy](https://vyriy.dev) - a calm architecture toolkit for TypeScript, React, SSR, SSG, APIs, and cloud-ready apps.

Full documentation: https://vyriy.dev/docs/logger/

Shared logger helpers for Vyriy projects.

## Purpose

This package exposes the raw `console` object as `logger` and a `createLogger()` helper that filters messages by `LOG_LEVEL`.

## Install

With npm:

```bash
npm install @vyriy/logger
```

With Yarn:

```bash
yarn add @vyriy/logger
```

## Usage

```ts
import { LOG_LEVELS, createLogger, logger } from '@vyriy/logger';

logger.log('plain console logging');

console.log(LOG_LEVELS);

const appLogger = createLogger();

appLogger.debug('debug message');
appLogger.info('info message');
appLogger.warn('warn message');
appLogger.error('error message');
```

## API

- `logger`
  Exposes the global `console`.

- `createLogger()`
  Creates a logger that respects `LOG_LEVEL`.

- `LOG_LEVELS`
  Lists supported log levels from lowest to highest severity.

Supported log levels:

- `debug`
- `info`
- `warn`
- `error`

## Notes

- `LOG_LEVEL` is read from `process.env`.
- Unknown or missing `LOG_LEVEL` falls back to `warn`.
- `debug`, `info`, `warn`, and `error` are filtered by level.
- `log()` is treated as `info()`.
