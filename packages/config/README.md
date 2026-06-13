# @vyriy/config

Part of [Vyriy](https://vyriy.dev) - a calm architecture toolkit for TypeScript, React, SSR, SSG, APIs, and cloud-ready apps.

Full documentation: https://vyriy.dev/docs/config/

Environment config parsing utility for Vyriy projects.

## Purpose

This package provides a small helper for reading environment variables and parsing them into useful runtime values.

## Install

With npm:

```bash
npm install @vyriy/config
```

With Yarn:

```bash
yarn add @vyriy/config
```

## Usage

```ts
import { getConfig, Parser } from '@vyriy/config';

const port = getConfig('PORT', 3000);
const features = getConfig<string[]>('FEATURES', [], 'auto');
const payload = getConfig<{ ok: boolean }>('PAYLOAD', null, 'json');
const timeout = getConfig('TIMEOUT', null, Parser.duration);
```

## Exports

The package exposes:

```ts
import { getConfig, Parser, auto } from '@vyriy/config';
import { parseDuration } from '@vyriy/config/duration';
```

## API

- `getConfig(envName, defaultValue?, parser = auto)` reads an environment variable and parses it.
- if the env is missing and a non-null default is provided, the default is returned unchanged.
- if the env is missing and no default is provided, `getConfig` throws.
- `getConfig(envName, null, parser)` lets you skip the default and pass a parser explicitly.

Built-in parser names:

- `auto`
- `string`
- `number`
- `int`
- `boolean`
- `csv`
- `json`
- `duration`

You can also pass parser functions directly:

```ts
import { getConfig, Parser } from '@vyriy/config';

const port = getConfig('PORT', null, Parser.int);
const enabled = getConfig('ENABLED', null, (value) => Parser.boolean(value, { extendedBooleans: true }));
```
