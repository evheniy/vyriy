# @vyriy/typescript-config

Shared TypeScript configs for Vyriy projects.

## Purpose

This package provides the base TypeScript config used by Vyriy repositories.

The package is designed for monorepos and shared project setup, while path-based settings such as `include`, `rootDir`, `outDir`, and emit behavior stay in the consumer project. Projects extend the shared baseline and override only the options that are specific to their build or type-checking workflow.

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

Create `tsconfig.json` and extend the shared config:

```json
{
  "extends": "@vyriy/typescript-config/index.json",
  "compilerOptions": {
    "noEmit": false
  },
  "include": [
    "index.ts"
  ]
}
```

The shared config defaults to `noEmit: true`, which is useful for type-check-only workflows. Set `noEmit` to `false` in the consumer project when TypeScript should write JavaScript output.

For a package or monorepo build, keep project-specific paths local:

```json
{
  "extends": "@vyriy/typescript-config/index.json",
  "compilerOptions": {
    "noEmit": false,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": [
    "src/**/*.ts",
    "src/**/*.tsx"
  ],
  "exclude": [
    "**/*.stories.ts",
    "**/*.stories.tsx",
    "**/*.test.ts",
    "**/*.test.tsx"
  ]
}
```

## Compiler Baseline

The shared config uses:

- `target: "ESNext"`
- `module: "ESNext"`
- `moduleResolution: "Bundler"`
- `jsx: "react-jsx"`
- `strict: true`
- `isolatedModules: true`
- `skipLibCheck: true`

## CLI

Run the TypeScript compiler with the local project config:

```bash
npx tsc
npx tsc --noEmit
```

## Full Example

See the article with a complete compile-and-run walkthrough: <https://vyriy.dev/examples/vyriy-typescript-config/>.
