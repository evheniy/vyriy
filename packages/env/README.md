# @vyriy/env

Shared environment variable helpers for Vyriy projects.

## Purpose

This package provides small helpers for reading common environment variables used across local development, AWS, ECS, GitLab CI, LocalStack, logging, and stage detection.

## Install

With npm:

```bash
npm install @vyriy/env
```

With Yarn:

```bash
yarn add @vyriy/env
```

## Usage

```ts
import { existsEnv, getEnv, getNodeEnv, getStage, isProduction } from '@vyriy/env';

const appName = getEnv('APP_NAME');
const nodeEnv = getNodeEnv();
const stage = getStage();
const hasOptionalFeature = existsEnv('OPTIONAL_FEATURE');

if (isProduction() && hasOptionalFeature) {
  console.log({ appName, nodeEnv, stage });
}
```

## API

Core:

- `existsEnv(name)`
- `getEnv(name, defaultValue?)`
- `getNodeEnv()`
- `isNodeEnvProduction()`
- `isNodeEnvDevelopment()`
- `isNodeEnvTest()`

AWS / CDK / ECS:

- `getRegion()`
- `getAccessKeyId()`
- `getSecretAccessKey()`
- `getCdkAccount()`
- `getCdkRegion()`
- `getStack()`
- `getEcsClusterName()`
- `getEcsTaskDefinition()`
- `getEcsContainerName()`
- `getTask()`

CI / local tooling:

- `getCiPipelineId()`
- `getCiMergeRequestId()`
- `getCiProjectName()`
- `getLocalstackHost()`
- `getLocalstackPort()`
- `getLogLevel()`

Server:

- `getPort()`

Stage helpers:

- `getStage()`
- `isLocal()`
- `isDev()`
- `isDevelop()`
- `isTest()`
- `isTesting()`
- `isQa()`
- `isUat()`
- `isStaging()`
- `isPreProd()`
- `isPreProduction()`
- `isFeature()`
- `isHotfix()`
- `isProduction()`

## Notes

- `existsEnv` only checks whether the variable is defined.
- `getEnv` throws if the variable is missing and no default value is provided.
- Stage helpers are based on the `STAGE` environment variable.
- `getNodeEnv` defaults to `'development'`.
