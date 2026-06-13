# @vyriy/cdk

Part of [Vyriy](https://vyriy.dev) - a calm architecture toolkit for TypeScript, React, SSR, SSG, APIs, and cloud-ready apps.

Full documentation: https://vyriy.dev/docs/cdk/

Shared AWS CDK helpers for Vyriy projects.

## Purpose

This package provides a small set of CDK-oriented helpers used across Vyriy stacks:

- `id()` for consistent stack naming
- `output()` for reading synthesized `cdk.out/cdk-outputs.json`
- `stack()` for creating a stack with shared env, tags, and termination protection defaults

`stack()` requires an explicit `STAGE` environment variable. The shared env helpers default to
`local` for development, but CDK stacks must use a real cloud deployment stage such as `dev`,
`staging`, or `production`.

## Install

With npm:

```bash
npm install @vyriy/cdk
```

With Yarn:

```bash
yarn add @vyriy/cdk
```

## Usage

Import from the package root:

```ts
import { id, output, stack } from '@vyriy/cdk';
```

Example:

```ts
import { Stack } from 'aws-cdk-lib';
import { output, stack } from '@vyriy/cdk';

const appStack = stack(Stack);
const apiUrl = output().ApiGatewayUrl;

console.log(appStack.stackName, apiUrl);
```
