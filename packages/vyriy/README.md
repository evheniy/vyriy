# vyriy

Part of [Vyriy](https://vyriy.dev) - a calm architecture toolkit for TypeScript, React, SSR, SSG, APIs, and cloud-ready apps.

Full documentation: https://vyriy.dev/docs/vyriy/

Interactive project master for Vyriy projects.

## Purpose

`vyriy` is a CLI tool that scaffolds new projects with Vyriy configuration
presets, validates the local environment, merges optional provider files, and
prepares packages for publishing.

## Install

With npm:

```bash
npm install -g vyriy
```

With Yarn:

```bash
yarn global add vyriy
```

## Usage

```bash
vyriy create [name]    Create a new Vyriy project
vyriy create .         Initialise a new Vyriy project in the current directory
vyriy dist             Prepare dist package metadata without publishing to npm
vyriy static [dir]     Serve a static directory (defaults to .)
vyriy check            Check local environment (Node.js and Yarn versions)
vyriy tooling [tool]   Generate thin local tooling config files
vyriy --help, -h       Show help
vyriy --version, -v    Show version
```

## Commands

### `create`

The interactive wizard collects project details and writes the scaffold:

1. Project name and description
2. Target directory
3. Preset selection
4. Package scope (for package-based presets)
5. CI/CD provider when the preset offers one
6. Deploy provider when the preset offers one
7. Confirmation (`y` to continue)

The generated file set is built from the selected preset and then merged with
the selected CI/CD and deploy provider files. Later entries override earlier
entries with the same path.

When generated paths already exist, use `--overwrite` or `--skip-existing` to
avoid the interactive conflict prompt. Without either flag, `vyriy` asks whether
to overwrite existing files, skip them, or abort.

Create options:

```bash
vyriy create --dry-run        Print the merged file plan without writing project files
vyriy create --overwrite      Overwrite existing generated paths
vyriy create --skip-existing  Leave existing generated paths untouched
vyriy create --no-install     Create files without installing dependencies
vyriy create --no-verify      Install dependencies without running checks
```

### `check`

Validates Node.js and Yarn versions against the engine requirements declared in
`package.json`.

```bash
vyriy check
vyriy check --help
vyriy check --version
```

### `tooling`

Vyriy can generate thin local config files that connect your project to Vyriy
standards.

```bash
vyriy tooling init
```

Or configure tools one by one:

```bash
vyriy tooling typescript
vyriy tooling eslint
vyriy tooling prettier
vyriy tooling jest
vyriy tooling storybook
vyriy tooling stylelint
```

Generated files stay intentionally small. For TypeScript, Vyriy writes a local
`tsconfig.json` that extends `@vyriy/typescript-config` and includes common
project paths such as `.storybook`, `packages`, `workspaces`, and root
TypeScript files.

Existing files are skipped by default:

```bash
vyriy tooling typescript --force
vyriy tooling init --dry-run
vyriy tooling --help
vyriy tooling --version
```

The command does not install dependencies. If required Vyriy config packages are
missing from `package.json`, it prints a suggested install command:

```bash
yarn add -D @vyriy/typescript-config @vyriy/eslint-config
npm install --save-dev @vyriy/typescript-config @vyriy/eslint-config
```

### `dist`

Prepares every package inside the `dist/` directory for npm publishing:

- Strips dev-only fields from `package.json`
- Builds the `exports` map from compiled JS files
- Copies README, LICENSE, and AGENTS.md
- Makes bin files executable

```bash
vyriy dist
vyriy dist --help
vyriy dist --version
```

### `static`

Starts the reusable `@vyriy/static` server command:

```bash
vyriy static
vyriy static public
vyriy static --port 3000 dist
vyriy static dist --cache static
vyriy static dist --spa --fallback index.html --cache static
vyriy static --help
vyriy static --version
```

Static options are delegated to `@vyriy/static`:

```bash
vyriy static dist --cache none
vyriy static dist --cache default
vyriy static dist --cache static
vyriy static dist --cache immutable
vyriy static dist --index index.html --not-found 404.html
vyriy static dist --spa --fallback index.html
```

## Presets

Registered presets:

| Key         | Description                                       |
| ----------- | ------------------------------------------------- |
| `base`      | Preset to create minimal monorepo with configs    |
| `library`   | Preset to create js/react library                 |
| `api`       | Preset to create simple API                       |
| `mcp`       | Preset to create simple MCP server                |
| `ssr`       | Preset to create Server Side Rendering (SSR) API  |
| `ssg`       | Preset to create Static site generation (SSG)     |
| `spa`       | Preset to create Single-page application (SPA)    |
| `rest`      | Preset to create simple REST API                  |
| `gql`       | Preset to create GraphQL API                      |
| `mfe`       | Preset to create Micro-frontend (MFE) application |
| `fullstack` | Preset to create Fullstack React app with SSR     |

Registered presets are selectable by the wizard. In-progress presets exist as
source modules and are expected to become selectable as their generated project
shape is finalized.

## API

```ts
import { cli } from 'vyriy';

await cli(process.argv.slice(2));
```
