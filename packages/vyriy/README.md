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
vyriy --dry-run
vyriy --yes
vyriy --overwrite
vyriy --skip-existing
vyriy --help
vyriy --version
```

### `vyriy`

Runs the same flow as `vyriy new`.

### `vyriy new [name]`

Starts the project planning wizard, prints the project summary and file plan, then writes generated files when no unresolved conflicts exist.

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

## Flags

### `--dry-run`

Prints the doctor report, project summary, and file plan without writing files or running fix commands.

### `--yes`

Uses default wizard answers and avoids prompts where possible. It does not overwrite existing files unless `--overwrite` is also passed.

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
- optional infrastructure choices
- confirmation

After confirmation, the CLI prints the project plan, creates generated files in memory, builds a conflict-aware file plan, and writes the accepted file plan.

Presets do not write to disk directly.

Generated projects always include `AGENTS.md` based on the shared Vyriy package agent guide.

## Project Presets

Supported presets:

- `library`
- `api`
- `react-csr`
- `react-ssr`
- `react-ssg`
- `mfe`
- `openmfe`
- `mfe-bff`
- `openmfe-bff`
- `fullstack`
- `aws-serverless`
- `empty`

The preset is the concrete future generated setup. The project kind is the broader architecture category.

Examples:

- `react-csr` -> `csr`
- `react-ssr` -> `ssr`
- `react-ssg` -> `ssg`
- `openmfe-bff` -> `mfe`
- `aws-serverless` -> `aws-serverless`

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
- API planning for API-capable presets: REST, GraphQL, or mixed API style
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
