# @vyriy/exec

Part of [Vyriy](https://vyriy.dev) - a calm architecture toolkit for TypeScript, React, SSR, SSG, APIs, and cloud-ready apps.

Full documentation: https://vyriy.dev/docs/exec/

Command execution utility for Vyriy projects.

## Purpose

This package provides a small promise-based wrapper around `node:child_process.exec` for running shell commands and returning `stdout` as a string.

## Install

With npm:

```bash
npm install @vyriy/exec
```

With Yarn:

```bash
yarn add @vyriy/exec
```

## Usage

```ts
import { exec } from '@vyriy/exec';

const stdout = await exec(`"${process.execPath}" -e "process.stdout.write('ok')"`);

console.log(stdout);
```

## Exports

The package exposes both the root entry and the direct utility module:

```ts
import { exec } from '@vyriy/exec';
import { exec as runCommand } from '@vyriy/exec/exec';
```

## API

- `exec(cmd, options?, showLogs?)` runs `cmd` through `node:child_process.exec`.
- `options` is forwarded to the underlying Node `exec` call, with `maxBuffer` forced to `Infinity`.
- `showLogs` defaults to `true` and writes the command lifecycle plus `stdout` and `stderr` through `@vyriy/logger`.
- the returned promise resolves to `stdout` as a string.
