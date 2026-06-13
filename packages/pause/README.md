# @vyriy/pause

Part of [Vyriy](https://vyriy.dev) - a calm architecture toolkit for TypeScript, React, SSR, SSG, APIs, and cloud-ready apps.

Full documentation: https://vyriy.dev/docs/pause/

Shared pause utility for Vyriy projects.

## Purpose

This package provides a tiny promise-based delay helper for async flows where code should wait for a fixed amount of time before continuing.

## Install

With npm:

```bash
npm install @vyriy/pause
```

With Yarn:

```bash
yarn add @vyriy/pause
```

## Usage

```ts
import { pause } from '@vyriy/pause';

await pause(250);

console.log('continued after 250ms');
```

## API

- `pause(ms)` returns a `Promise<void>` that resolves after `ms` milliseconds.
