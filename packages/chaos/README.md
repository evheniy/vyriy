# @vyriy/chaos

Part of [Vyriy](https://vyriy.dev) - a calm architecture toolkit for TypeScript, React, SSR, SSG, APIs, and cloud-ready apps.

Full documentation: https://vyriy.dev/docs/chaos/

Random failure helper for local Vyriy development.

## Purpose

This package injects development-only failures so callers can exercise error and timeout handling paths before real backend instability happens.

## Install

With npm:

```bash
npm install @vyriy/chaos
```

With Yarn:

```bash
yarn add @vyriy/chaos
```

## Usage

```ts
import { chaos } from '@vyriy/chaos';

await chaos({
  enabled: process.env.CHAOS_ENABLED === 'true',
  probability: 0.2,
  strategy: 'random',
  timeoutMs: 1500,
});
```

## API

- `chaos(options)` resolves when no fault should be injected.
- `chaos(options)` throws an `Error` or waits and throws a timeout when the random check matches.
- `defaultMessage` is the default non-timeout error message.
- `defaultProbability` is the default failure probability.
- `defaultTimeoutMs` is the default timeout duration in milliseconds.
