# vyriy

Interactive project master for calm cloud-ready applications.

## Purpose

`vyriy` is the user-facing CLI entry point for the Vyriy ecosystem.

The first implementation focuses on project planning rather than file generation. It checks the local environment, runs a small project wizard, creates a normalized `VyriyProjectPlan`, prints the summary, and exits without writing generated project files.

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
vyriy --help
vyriy --version
```

### `vyriy`

Runs the same flow as `vyriy new`.

### `vyriy new [name]`

Starts the project planning wizard.

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
- Yarn `>=4`

## Wizard

The wizard collects:

- project name
- target directory
- package scope
- description
- project preset
- API style for API-capable presets
- CI/CD provider
- optional extra features
- confirmation

After confirmation, the CLI prints the project plan and exits.

File generation is not implemented yet.

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

The package exports the CLI runner, command helpers, environment checks, prompt helper, and project-plan utilities.

```ts
import {
  askProjectPlan,
  checkNodeVersion,
  checkYarnVersion,
  createApiPlan,
  createCiPlan,
  createProjectPlanFromPreset,
  getProjectKindFromPreset,
  parseArgs,
  printProjectPlan,
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

This model is intentionally useful before generation exists. It gives future generator steps a stable contract to build from.

## Current Non-Goals

The CLI does not yet:

- write project files
- initialize Git
- run `yarn install`
- generate AWS CDK stacks
- generate Docker files
- generate React, OpenMFE, API, or service workspaces
