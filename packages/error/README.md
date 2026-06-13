# @vyriy/error

Part of [Vyriy](https://vyriy.dev) - a calm architecture toolkit for TypeScript, React, SSR, SSG, APIs, and cloud-ready apps.

Full documentation: https://vyriy.dev/docs/error/

Shared error utilities for Vyriy projects.

## Purpose

This package provides small helpers for normalizing unknown caught or rejected values before logging or rethrowing them.

## Install

With npm:

```bash
npm install @vyriy/error
```

With Yarn:

```bash
yarn add @vyriy/error
```

## Usage

```ts
import { toError } from '@vyriy/error';

try {
  await runTask();
} catch (error) {
  throw toError(error);
}
```
