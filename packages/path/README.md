# @vyriy/path

Shared path utilities for Vyriy projects.

## Purpose

This package provides a small filesystem-oriented API rooted at the current project directory. It resolves paths relative to `PROJECT_CWD` when that environment variable is set, and otherwise falls back to `process.cwd()`.

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
import { directory, isEmpty, mkdir, path, readdir } from '@vyriy/path';

const packageRoot = path('packages', 'path');
const packageName = directory('packages', 'path');

mkdir('tmp', 'artifacts');

const entries = readdir('packages');
const empty = isEmpty('tmp');
```

## API

- `path(...segments)` resolves an absolute path from `PROJECT_CWD` or `process.cwd()`.
- `directory(...segments)` returns the final path segment name.
- `readdir(...segments)` returns directory entries from the resolved path.
- `isEmpty(...segments)` returns `true` when the directory contains only ignored entries: `README.md` and `.git`.
- `mkdir(...segments)` creates the resolved directory recursively.
