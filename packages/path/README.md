# @vyriy/path

Shared path utility for Vyriy projects.

## Purpose

This package provides a small path resolver rooted at the current project directory. It resolves paths relative to `PROJECT_CWD` when that environment variable is set, and otherwise falls back to `process.cwd()`.

## Install

With npm:

```bash
npm install @vyriy/path
```

With Yarn:

```bash
yarn add @vyriy/path
```

## Usage

```ts
import { path } from '@vyriy/path';

const packageRoot = path('packages', 'path');
```

## API

- `path(...segments)` resolves an absolute path from `PROJECT_CWD` or `process.cwd()`.
