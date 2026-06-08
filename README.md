# Vyriy

## Overview

**Website:** [vyriy.dev](https://vyriy.dev/)

**Documentation:** [https://vyriy.dev/storybook/](https://vyriy.dev/storybook/)

Vyriy is a Yarn workspaces monorepo with a project CLI and small publishable packages for:

- fast project scaffolding from calm presets
- project configuration
- React rendering and SSR-friendly tooling
- environment and infrastructure contracts
- small runtime utilities for shared application code

The project philosophy is simple:

- prefer calm systems over clever systems
- keep architecture modular, explicit, and easy to explain
- start projects quickly, then keep them simple as they grow
- optimize for reuse across websites, widgets, services, APIs, and starters
- stay AWS-aware without coupling every package to infrastructure

## Lineage

Vyriy continues earlier work from [SkazkaJS](https://skazkajs.org/) and the
[skazkajs/skazkajs](https://github.com/skazkajs/skazkajs) project, carrying
forward the practical focus on small composable JavaScript tooling into a newer
cloud-oriented React and AWS toolkit.

## What Is In This Repo

Current packages are grouped by purpose. Each package has its own README in `packages/<name>/README.md`.

### Project CLIs

| Package         | Purpose                                                                                       |
| --------------- | --------------------------------------------------------------------------------------------- |
| `vyriy`         | Interactive project master for creating and maintaining Vyriy projects from reusable presets. |
| `create-vyriy`  | Unscoped `npm create vyriy` entry point for creating Vyriy projects.                          |
| `@vyriy/create` | Project creation CLI and programmatic scaffold API.                                           |
| `@vyriy/check`  | Environment check CLI and reusable validation API.                                            |
| `@vyriy/dist`   | Distribution build CLI for preparing compiled packages for publishing.                        |
| `@vyriy/static` | Static file and SPA serving CLI with reusable server helpers.                                 |

CLI packages expose both descriptive command names and short aliases:

| Package         | Commands                 | Example                                  |
| --------------- | ------------------------ | ---------------------------------------- |
| `@vyriy/create` | `vyriy-create`, `vc`     | `vyriy-create app` or `vc app`           |
| `@vyriy/check`  | `vyriy-check`, `vce`     | `vyriy-check` or `vce` (Vyriy Check Env) |
| `@vyriy/dist`   | `vyriy-dist`, `vd`       | `vyriy-dist` or `vd`                     |
| `@vyriy/static` | `vyriy-static`, `vs`     | `vyriy-static dist` or `vs dist`         |
| `create-vyriy`  | `create-vyriy`, npm init | `npm create vyriy app`                   |
| `vyriy`         | `vyriy`                  | `vyriy create app`, `vyriy check`, etc.  |

The CLI can create a ready project in seconds and keep the generated shape aligned with the same calm architecture used by the shared packages:

```bash
vyriy create app
npm create vyriy app
```

Available presets cover the common project shapes:

- `base` for a minimal configured workspace
- `library` for JavaScript and React libraries
- `spa` for single-page applications
- `ssg` for static generation projects
- `ssr` for server-rendered projects
- `api`, `rest`, and `gql` for service and API workloads
- `mfe` for microfrontend applications
- `fullstack` for fullstack React applications with SSR

The wizard can also merge CI/CD provider files, deployment provider files when a preset supports them, install dependencies, run checks, or print the generated plan with `--dry-run`.

### Configuration And Tooling

| Package                      | Purpose                                                                                                    |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `@vyriy/browserslist-config` | Shared Browserslist config for Vyriy projects.                                                             |
| `@vyriy/eslint-config`       | Shared ESLint flat config for TypeScript, React, Storybook, Jest, YAML, imports, and Prettier integration. |
| `@vyriy/jest-config`         | Shared Jest config for TypeScript test runs, SWC transforms, JSDOM, coverage, and JUnit reporting.         |
| `@vyriy/prettier-config`     | Shared Prettier config with the multiline arrays plugin.                                                   |
| `@vyriy/stylelint-config`    | Shared Stylelint config for SCSS-friendly CSS linting and property order.                                  |
| `@vyriy/storybook-config`    | Shared Storybook config for React projects.                                                                |
| `@vyriy/typescript-config`   | Shared TypeScript configs for base, build, config-file, and package output use cases.                      |
| `@vyriy/webpack-config`      | Shared Webpack config for browser-oriented builds.                                                         |

Some config packages intentionally document executable tools in their install command because the consumer project should expose the CLI binary:

| Package                    | Consumer install                                     |
| -------------------------- | ---------------------------------------------------- |
| `@vyriy/eslint-config`     | `npm install -D @vyriy/eslint-config eslint`         |
| `@vyriy/jest-config`       | `npm install -D @vyriy/jest-config jest`             |
| `@vyriy/prettier-config`   | `npm install -D @vyriy/prettier-config prettier`     |
| `@vyriy/stylelint-config`  | `npm install -D @vyriy/stylelint-config stylelint`   |
| `@vyriy/storybook-config`  | `npm install -D @vyriy/storybook-config storybook`   |
| `@vyriy/typescript-config` | `npm install -D @vyriy/typescript-config typescript` |
| `@vyriy/webpack-config`    | `npm install -D @vyriy/webpack-config webpack-cli`   |

### Runtime And Shared Utilities

| Package            | Purpose                                                                          |
| ------------------ | -------------------------------------------------------------------------------- |
| `@vyriy/cdk`       | Shared AWS CDK helpers for Vyriy projects.                                       |
| `@vyriy/chaos`     | Small chaos-testing helpers for delay and failure simulation.                    |
| `@vyriy/cn`        | Class name utility for composing CSS class strings.                              |
| `@vyriy/commit`    | Commit message validation helper.                                                |
| `@vyriy/config`    | Environment config parsing utility with named parsers and defaults.              |
| `@vyriy/env`       | Shared environment variable utilities.                                           |
| `@vyriy/error`     | Shared error utilities.                                                          |
| `@vyriy/event`     | Custom and analytics event helpers for microfrontend-style events.               |
| `@vyriy/exec`      | Command execution utility.                                                       |
| `@vyriy/handler`   | Composable AWS Lambda handler chains and wrappers.                               |
| `@vyriy/hoc`       | React higher-order component utilities.                                          |
| `@vyriy/html`      | HTML document utility.                                                           |
| `@vyriy/logger`    | Shared logger utility.                                                           |
| `@vyriy/package`   | `package.json` helper utilities.                                                 |
| `@vyriy/path`      | Shared path utilities.                                                           |
| `@vyriy/pause`     | Promise-based pause utility.                                                     |
| `@vyriy/recursive` | Recursive iteration utility.                                                     |
| `@vyriy/request`   | Shared request utility.                                                          |
| `@vyriy/render`    | React rendering adapters for DOM, custom elements, SSR, streaming SSR, and SSG.  |
| `@vyriy/retry`     | Retry utility.                                                                   |
| `@vyriy/router`    | Router utility.                                                                  |
| `@vyriy/script`    | Script utilities.                                                                |
| `@vyriy/scripts`   | Shared CI/CD, deployment, Docker, E2E, Lambda, UI, and webhook script helpers.   |
| `@vyriy/server`    | Small HTTP server adapter for Lambda-style Vyriy handlers.                       |
| `@vyriy/services`  | Shared AWS service clients and helpers.                                          |
| `@vyriy/smoke`     | Smoke request matcher for short-circuiting handlers.                             |
| `@vyriy/stack`     | AWS CDK helpers for S3, CloudFront, Route 53, ACM, Lambda, ECS, and deployments. |
| `@vyriy/static`    | Static file and SPA serving helpers for Vyriy servers.                           |
| `@vyriy/timeout`   | Timeout utility.                                                                 |

## Using Packages

Most packages can be installed directly:

```bash
npm install @vyriy/handler
```

Example usage:

```ts
import { createLogger } from '@vyriy/logger';
import { pause } from '@vyriy/pause';

const logger = createLogger();

logger.info('waiting...');
await pause(250);
logger.info('done');
```

Example Lambda-style handler:

```ts
import { api } from '@vyriy/handler';

export const handler = api(async (event) => ({
  statusCode: 200,
  body: JSON.stringify({
    path: event.path,
  }),
}));
```

Example local server for a Lambda-style handler:

```ts
import { server } from '@vyriy/server';

server(async () => ({
  statusCode: 200,
  body: JSON.stringify({ ok: true }),
}));
```

Example React render helper:

```tsx
import { element } from '@vyriy/render';

import { App } from './app.js';

element({
  root: document.getElementById('root'),
  component: <App />,
});
```

## Direction

Vyriy is aimed at a broader ecosystem of starters and shared tooling for:

- libraries
- SSG and SSR projects
- MFE and widget delivery
- service and API workloads

The current CLI presets are the first practical layer of that direction: they make new projects fast to start, while the package contracts keep the architecture explicit, reusable, and easy to maintain after the first commit.

## Requirements

- Node.js (`>=24.0.0`)
- Yarn (`4.16.0`, managed by the root `packageManager` field)

In projects that plan to use this library, `typescript` is also expected to be installed in the consumer project (latest stable version `>= 6.0.0`).

## Consulting

Vyriy is also a practical foundation for my consulting work around calm frontend and Node.js architecture.

I can help teams with:

- React architecture
- SSR / SSG / static publishing
- micro frontend integration
- Storybook as project documentation
- Node.js tooling and CLI
- frontend project structure
- AWS-ready frontend infrastructure

If your team is working with similar problems, I can help review, simplify, or improve the system.

[Work with me](https://vyriy.dev/consulting/)
