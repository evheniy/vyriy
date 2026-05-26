# vyriy

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
vyriy [name]           Create a new Vyriy project
vyriy .                Initialise a new Vyriy project in the current directory
vyriy --help, -h       Show help
vyriy --version, -v    Show version
vyriy --check-env, -c  Check local environment (Node.js and Yarn versions)
vyriy --dist, -d       Prepare dist package metadata without publishing to npm
vyriy --dry-run        Print the merged file plan without writing project files
vyriy --overwrite      Overwrite existing generated paths
vyriy --skip-existing  Leave existing generated paths untouched
vyriy --no-install     Create files without installing dependencies
vyriy --no-verify      Install dependencies without running checks
```

## Commands

### `create` (default)

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

### `--check-env`

Validates Node.js and Yarn versions against the engine requirements declared in
`package.json`.

### `--dist`

Prepares every package inside the `dist/` directory for npm publishing:

- Strips dev-only fields from `package.json`
- Builds the `exports` map from compiled JS files
- Copies README, LICENSE, and AGENTS.md
- Makes bin files executable

## Presets

Registered presets:

| Key       | Description                                    |
| --------- | ---------------------------------------------- |
| `base`    | Minimal monorepo with config only              |
| `library` | Workspaces layout with a sample React package  |
| `api`     | Backend API workspace with server/build setup  |
| `ssr`     | Server-rendered React API with CMS placeholder |

Presets in progress:

| Key    | Direction                      |
| ------ | ------------------------------ |
| `rest` | REST API project               |
| `gql`  | GraphQL API project            |
| `ssg`  | Static site generation project |
| `spa`  | Single-page application        |
| `mfe`  | Micro-frontend project         |

Registered presets are selectable by the wizard. In-progress presets exist as
source modules and are expected to become selectable as their generated project
shape is finalized.

## Providers

Provider selections add files to the generated project.

| Preset    | CI/CD providers    | Deploy providers |
| --------- | ------------------ | ---------------- |
| `base`    | `gitlab`, `github` | none             |
| `library` | `gitlab`, `github` | none             |
| `api`     | `gitlab`, `github` | none             |
| `ssr`     | `gitlab`, `github` | none             |

## API

```ts
import { cli } from 'vyriy';

await cli(process.argv.slice(2));
```
