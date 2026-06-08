# @vyriy/recursive

Recursive iteration utility for Vyriy projects.

## Purpose

This package provides a small helper for recursively iterating through a list and applying an async handler to each item.

## Install

With npm:

```bash
npm install @vyriy/recursive
```

With Yarn:

```bash
yarn add @vyriy/recursive
```

## Usage

```ts
import { recursive } from '@vyriy/recursive';

await recursive(
  async (item) => {
    console.log(item);
  },
  ['one', 'two', 'three'],
);
```

## Exports

The package exposes both the root entry and the direct utility module:

```ts
import { recursive } from '@vyriy/recursive';
```

## API

- `recursive(handler, list)` calls the async `handler` for each truthy item in `list`.
- iteration stops when the current `list[index]` value is falsy.
