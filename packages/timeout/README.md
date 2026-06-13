# @vyriy/timeout

Part of [Vyriy](https://vyriy.dev) - a calm architecture toolkit for TypeScript, React, SSR, SSG, APIs, and cloud-ready apps.

Full documentation: https://vyriy.dev/docs/timeout/

Timeout utility for Vyriy projects.

## Purpose

This package provides a small helper that waits for a given amount of time and then throws an error.

## Install

With npm:

```bash
npm install @vyriy/timeout
```

With Yarn:

```bash
yarn add @vyriy/timeout
```

## Usage

```ts
import { timeout } from '@vyriy/timeout';

await timeout(5000, 'Request took too long');
```

## Exports

The package exposes both the root entry and the direct utility module:

```ts
import { timeout } from '@vyriy/timeout';
```

## API

- `timeout(time, message?)` waits for `time` milliseconds and then throws an error.
- `message` overrides the default `'Timeout error!'` text.
