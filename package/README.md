# @vyriy/package

Helpers for reading and caching `package.json` in Vyriy projects.

## Purpose

This package provides a small helper for reading the project `package.json`.

The file is read lazily:

- the first call reads and parses `package.json`
- the parsed result is cached
- all next calls return the cached object

## Install

With npm:

```bash
npm install @vyriy/package
```

With Yarn:

```bash
yarn add @vyriy/package
```

## Usage

```ts
import { getPackage } from '@vyriy/package';

const package = getPackage();

console.log(package.name);
console.log(package.version);
```

You can also narrow the fields you need:

```ts
import { getPackage } from '@vyriy/package';

const { name, scripts } = getPackage();

console.log(name);
console.log(scripts?.build);
```

## API

`getPackage()`

- reads the root `package.json` file on first access
- caches the parsed object
- returns the cached `Package` object on later calls

## Exported Types

- `Package`
