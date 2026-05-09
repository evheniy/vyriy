# Vyriy

## Overview

**Website:** [vyriy.dev](https://vyriy.dev/)

**Documentation:** [https://vyriy.dev/storybook/](https://vyriy.dev/storybook/)

Vyriy is a Yarn workspaces monorepo with small publishable packages for:

- project configuration
- React and SSR-friendly tooling
- environment and infrastructure contracts
- small runtime utilities for shared application code

The project philosophy is simple:

- prefer calm systems over clever systems
- keep architecture modular, explicit, and easy to explain
- optimize for reuse across websites, widgets, services, and future starters
- stay AWS-aware without coupling every package to infrastructure

## Lineage

Vyriy continues earlier work from [SkazkaJS](https://skazkajs.org/) and the
[skazkajs/skazkajs](https://github.com/skazkajs/skazkajs) project, carrying
forward the practical focus on small composable JavaScript tooling into a newer
cloud-oriented React and AWS toolkit.

## What Is In This Repo

Current packages are grouped by purpose. Each package has its own README in `packages/<name>/README.md`.

### Configuration And Tooling

| Package                      | Purpose                                                                                              |
| ---------------------------- | ---------------------------------------------------------------------------------------------------- |
| `@vyriy/browserslist-config` | Shared Browserslist config for Vyriy projects.                                                       |
| `@vyriy/eslint-config`       | Shared ESLint flat config for TypeScript, React, Storybook, Jest, imports, and Prettier integration. |
| `@vyriy/jest-config`         | Shared Jest config for TypeScript test runs, SWC transforms, JSDOM, coverage, and JUnit reporting.   |
| `@vyriy/prettier-config`     | Shared Prettier config with the multiline arrays plugin.                                             |
| `@vyriy/storybook-config`    | Shared Storybook config for React projects.                                                          |
| `@vyriy/typescript-config`   | Shared TypeScript configs for base, build, config-file, and package output use cases.                |
| `@vyriy/webpack-config`      | Shared Webpack config for browser-oriented builds.                                                   |

Some config packages intentionally document executable tools in their install command because the consumer project should expose the CLI binary:

| Package                      | Consumer install                                         |
| ---------------------------- | -------------------------------------------------------- |
| `@vyriy/browserslist-config` | `npm install -D @vyriy/browserslist-config browserslist` |
| `@vyriy/eslint-config`       | `npm install -D @vyriy/eslint-config eslint jiti`        |
| `@vyriy/jest-config`         | `npm install -D @vyriy/jest-config jest`                 |
| `@vyriy/prettier-config`     | `npm install -D @vyriy/prettier-config prettier`         |
| `@vyriy/storybook-config`    | `npm install -D @vyriy/storybook-config storybook`       |
| `@vyriy/typescript-config`   | `npm install -D @vyriy/typescript-config typescript`     |
| `@vyriy/webpack-config`      | `npm install -D @vyriy/webpack-config webpack`           |

### Runtime And Shared Utilities

| Package            | Purpose                                                             |
| ------------------ | ------------------------------------------------------------------- |
| `@vyriy/cdk`       | Shared AWS CDK helpers for Vyriy projects.                          |
| `@vyriy/cn`        | Class name utility for composing CSS class strings.                 |
| `@vyriy/commit`    | Shared commit package for Vyriy projects.                           |
| `@vyriy/config`    | Environment config parsing utility with named parsers and defaults. |
| `@vyriy/env`       | Shared environment variable utilities.                              |
| `@vyriy/error`     | Shared error utilities.                                             |
| `@vyriy/event`     | Custom and analytics event helpers for microfrontend-style events.  |
| `@vyriy/exec`      | Command execution utility.                                          |
| `@vyriy/handler`   | Composable AWS Lambda handler chains and wrappers.                  |
| `@vyriy/hoc`       | React higher-order component utilities.                             |
| `@vyriy/html`      | HTML document utility.                                              |
| `@vyriy/logger`    | Shared logger utility.                                              |
| `@vyriy/package`   | `package.json` helper utilities.                                    |
| `@vyriy/path`      | Shared path utilities.                                              |
| `@vyriy/pause`     | Promise-based pause utility.                                        |
| `@vyriy/recursive` | Recursive iteration utility.                                        |
| `@vyriy/request`   | Shared request utility.                                             |
| `@vyriy/retry`     | Retry utility.                                                      |
| `@vyriy/router`    | Router utility.                                                     |
| `@vyriy/script`    | Script utilities.                                                   |
| `@vyriy/scripts`   | Shared scripts package.                                             |
| `@vyriy/server`    | Small HTTP server adapter for Lambda-style Vyriy handlers.          |
| `@vyriy/services`  | Shared AWS service clients and helpers.                             |
| `@vyriy/smoke`     | Smoke request matcher for short-circuiting handlers.                |
| `@vyriy/stack`     | AWS CDK helpers for S3, CloudFront, Route 53, ACM, and deployments. |
| `@vyriy/timeout`   | Timeout utility.                                                    |

## Using Packages

Packages are private workspace packages. In practice this means:

- use them inside this monorepo
- publish them to a private registry when needed
- consume them from another app only after publishing or local linking

Most runtime packages can be installed directly after publishing:

```bash
npm install @vyriy/handler
```

Internal package dependencies are declared as package `dependencies`, so installing a package pulls the other `@vyriy/*` packages it uses.

Example runtime usage:

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

## Direction

Vyriy is aimed at a broader ecosystem of future starters and shared tooling for:

- libraries
- SSG and SSR projects
- MFE and widget delivery
- service and API workloads

The long-term goal is a reusable foundation with low cognitive load, clear contracts, and practical extraction from real projects.

## Requirements

- Node.js `>=24.0.0`
- Yarn `4.14.1`

In most projects that plan to use this library, `typescript` is also expected to be installed in the consumer project.
