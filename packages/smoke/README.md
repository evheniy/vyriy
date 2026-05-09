# @vyriy/smoke

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
  Default smoke response payload: `{ status: 'success' }`.

- `smoke(event)`
  Returns the smoke response when `event` matches the smoke request, otherwise returns `false`.

## Notes

- matching is performed by comparing `JSON.stringify(event)` and `JSON.stringify(request)`
- if property order differs, objects that are otherwise structurally equal may not match
- the helper is best suited for small, stable smoke payloads
