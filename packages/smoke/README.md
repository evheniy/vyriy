# @vyriy/smoke

Part of [Vyriy](https://vyriy.dev) - a calm architecture toolkit for TypeScript, React, SSR, SSG, APIs, and cloud-ready apps.

Full documentation: https://vyriy.dev/docs/smoke/

Smoke request matcher for Vyriy projects.

## Purpose

This package provides a small helper for recognizing a dedicated smoke request and returning a predefined response without running the main handler logic.

It is intended to be used directly or through packages such as `@vyriy/handler`.

## Install

With npm:

```bash
npm install @vyriy/smoke
```

With Yarn:

```bash
yarn add @vyriy/smoke
```

## Usage

Use the default smoke request and response:

```ts
import { smoke } from '@vyriy/smoke';

const result = smoke({ isSmoke: true });

if (result) {
  return result;
}
```

## API

- `request`
  Default smoke request payload: `{ isSmoke: true }`.

- `response`
  Default API Gateway-compatible smoke response:

```ts
{
  statusCode: 200,
  body: JSON.stringify({
    status: 'success',
  }),
}
```

- `smoke(event)`
  Returns the smoke response when `event` matches the smoke request, otherwise returns `false`.

## Notes

- matching checks whether the incoming event is an object with `isSmoke: true`
- the helper is best suited for small, stable smoke payloads
