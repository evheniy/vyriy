# @vyriy/retry

Retry utility for Vyriy projects.

## Purpose

This package provides a small wrapper for retrying an async handler a fixed number of times with an optional delay between attempts.

## Install

With npm:

```bash
npm install @vyriy/retry
```

With Yarn:

```bash
yarn add @vyriy/retry
```

## Usage

```ts
import { retry } from '@vyriy/retry';

const result = await retry(async () => fetch('https://example.com/data').then((response) => response.json()), {
  retries: 3,
  delay: 250,
});
```

## Exports

The package exposes both the root entry and the direct utility module:

```ts
import { retry } from '@vyriy/retry';
```

## API

- `retry(handler, options?)` retries `handler` until it succeeds or retries are exhausted.
- `options.retries` controls how many retries happen after the first failure.
- `options.delay` sets the delay between retries in milliseconds.
