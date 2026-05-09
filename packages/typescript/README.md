# @vyriy/typescript-config

Shared TypeScript configs for Vyriy projects.

## Purpose

This package provides reusable TypeScript config entry points for Vyriy repositories:

- base TypeScript config
- build config
- config-file-oriented config

The package is designed for monorepos and shared project setup, while path-based settings such as `include`, `rootDir`, and `outDir` stay in the consumer project.

## Install

With npm:

```bash
npm install -D @vyriy/typescript-config typescript
```

With Yarn:

```bash
yarn add -D @vyriy/typescript-config typescript
```

Install `typescript` in the consumer project so CLI commands are available.

## Usage

Base config:

```json
{
  "extends": "@vyriy/typescript-config",
  "include": [
    ".bin/**/*.ts",
    ".storybook/**/*.ts",
    ".storybook/**/*.tsx",
    "packages/**/*.ts",
    "packages/**/*.tsx",
    "stack/*.ts"
  ]
}
```

Build config:

```json
{
  "extends": "../typescript/build.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./packages"
  },
  "include": [
    "packages/**/*.ts",
    "packages/**/*.tsx"
  ],
  "exclude": [
    "**/*.stories.ts",
    "**/*.stories.tsx",
    "**/*.test.ts",
    "**/*.test.tsx"
  ]
}
```
