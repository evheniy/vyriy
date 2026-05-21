# vyriy

Interactive project master for calm cloud-ready applications.

## Purpose

`vyriy` is the user-facing CLI entry point for the Vyriy ecosystem.

The CLI checks the local environment, runs a small project wizard, creates a normalized `VyriyProjectPlan`, builds generated project files in memory, prints a file plan, and writes only files that are safe to create or explicitly allowed to overwrite.

For a detailed map of CLI choices, diagrams, current generated files, and next
generator targets, see [PROJECT-MASTER.md](./PROJECT-MASTER.md).

## Install

Install globally:

```bash
npm i -g vyriy
```

Or run the package temporarily:

```bash
npx vyriy new my-app
yarn dlx vyriy new my-app
```

## Commands

```bash
vyriy new
vyriy new my-app
vyriy .
vyriy init
vyriy doctor
vyriy publish
vyriy --dry-run
vyriy --yes
vyriy --no-install
vyriy --no-verify
vyriy --install-only
vyriy --verify
vyriy --overwrite
vyriy --skip-existing
vyriy --help
vyriy --version
```

### `vyriy`

Runs the same flow as `vyriy new`.

### `vyriy new [name]`

Starts the project planning wizard, prints the project summary and file plan, writes generated files when no unresolved conflicts exist, installs dependencies, and runs generated project checks.

If `name` is provided, it is used as the default project name and target directory.

### `vyriy init`

Starts the same planning wizard for the current directory.

The current directory name is used as the default project name.

### `vyriy .`

Alias for `vyriy init`.

### `vyriy doctor`

Runs environment checks only.

Current checks:

- Node.js `>=24`
- Corepack availability
- Yarn `>=4`
- Git availability

Node.js is fatal when unsupported. Yarn and Git are warnings so generation can continue without silently installing tools or initializing Git.

### `vyriy publish`

Prepares compiled `dist` package metadata for publishing without running `npm publish`.

Use it after TypeScript emits package files into `dist`, for example from a `build:dist` script.

## Flags

### `--dry-run`

Prints the doctor report, project summary, and file plan without writing files, installing dependencies, or running checks.

### `--no-install`

Writes generated files but skips `yarn install` and `yarn check`.

### `--no-verify`

Writes generated files and runs `yarn install`, but skips `yarn check`.

### `--install-only`

Alias for `--no-verify`.

### `--verify`

Explicitly enables `yarn check`. This is already the default unless `--no-install`, `--no-verify`, or `--install-only` is passed.

### `--yes`

Uses default wizard answers and avoids prompts where possible. In non-interactive mode, the default preset is `empty` with no CI/CD provider. It does not overwrite existing files unless `--overwrite` is also passed.

### `--overwrite`

Marks existing generated paths as overwrite candidates and writes them.

### `--skip-existing`

Marks existing generated paths as skipped and leaves them untouched.

`--overwrite` and `--skip-existing` cannot be used together.

## Wizard

The wizard collects:

- project name
- target directory
- package scope
- description
- project preset
- API style for API-capable presets
- CI/CD provider
- infrastructure provider
- confirmation

After confirmation, the CLI prints the project plan, creates generated files in memory, builds a conflict-aware file plan, writes the accepted file plan, runs `yarn install`, and runs `yarn check`.

Presets do not write to disk directly.

Generated projects always include `AGENTS.md` based on the shared Vyriy package agent guide.

## Project Presets

Supported presets:

- `empty`
- `library`
- `api`
- `ssr`
- `ssg`
- `csr`
- `fullstack`
- `mfe`

The preset is the concrete future generated setup. The project kind is the broader architecture category. The infrastructure choice is selected separately: Docker is the default local/container shape, while AWS selects CDK plus Lambda/API Gateway for API-capable presets.

The `mfe` preset uses OpenMFE as the default MFE contract shape. There is no separate `openmfe` preset unless a future use case proves that split is useful.

Workspace kinds describe deployment intent: `ui` is universal UI output, `api` is Docker-oriented, `lambda` is the AWS API runtime, `fargate` is an AWS container runtime, and `stack` contains AWS infrastructure.

Examples:

- `csr` -> `csr`
- `ssr` -> `ssr`
- `ssg` -> `ssg`
- `mfe` -> `mfe`
- `fullstack` -> `fullstack`

## Public API

The package exports the CLI runner, command helpers, doctor checks, file-plan utilities, generated preset files, prompt helper, and project-plan utilities.

```ts
import {
  askProjectPlan,
  checkNodeVersion,
  checkYarnVersion,
  createDoctorReport,
  createFilePlan,
  createProjectFiles,
  createApiPlan,
  createCiPlan,
  createProjectPlanFromPreset,
  getProjectKindFromPreset,
  parseArgs,
  printProjectPlan,
  writeFilePlan,
  runDoctorCommand,
  runInitCommand,
  runNewCommand,
  runVyriyCli,
} from 'vyriy';
```

## Project Plan

The central model is `VyriyProjectPlan`.

It includes:

- project identity: `projectName`, `targetDirectory`, `packageScope`, `description`
- architecture: `preset`, `projectKind`
- selected features
- CI/CD planning: enabled state, providers, and validation pipelines
- API planning for API-capable presets: REST or GraphQL API style
- future package plans
- future workspace plans

This model is intentionally useful before files are written. It gives generator steps a stable contract to build from.

## Current Non-Goals

The CLI does not yet:

- initialize Git
- run `yarn install`
- generate AWS CDK stacks
- generate Docker files
- generate React, OpenMFE, API, or service workspaces
