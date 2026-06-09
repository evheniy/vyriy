# @vyriy/scripts

Shared script factories for Vyriy projects.

## Purpose

This package collects reusable deployment, build, smoke-test, and post-deploy script factories.

Every export is built on `@vyriy/script`, the common process wrapper used by Vyriy scripts. The wrapper keeps script execution consistent by centralizing process lifecycle behavior such as logging, timeout handling, and error reporting.

The package is meant for CI/CD and project-local automation where a project needs small, composable scripts instead of one large deployment framework.

## Install

With npm:

```bash
npm install @vyriy/scripts
```

With Yarn:

```bash
yarn add @vyriy/scripts
```

## Script Groups

### API Smoke Scripts

- `lambda` invokes a Lambda function directly with the shared smoke payload. Run this first when an API is backed by Lambda, because it shows whether the function is alive and its dependencies can load.
- `healthcheck` calls the standard API Gateway healthcheck endpoint. This is the narrow API smoke check and is a good next step after `lambda`.
- `api` resolves the API Gateway URL and passes it to a callback for custom API smoke scenarios across one or more endpoints.

### Deployment Scripts

- `deploy` runs AWS CDK synth, diff, and deploy in CI mode.
- `docker` builds and pushes a Docker image to ECR with Docker Buildx.
- `kaniko` builds and pushes a Docker image to ECR with Kaniko, usually for container-native CI.

`docker` and `kaniko` can be part of a deployment flow for services such as AWS Fargate tasks.

### Static Smoke Scripts

- `mfe` checks a static MFE distribution by requesting the distribution URL, `index.html`, and `index.js`.
- `site` checks a static website by requesting the site URL, `robots.txt`, `sitemap.xml`, and every URL listed in the sitemap.

Both scripts are smoke tests, but at different static delivery levels: `mfe` is focused on a widget/application bundle, while `site` is focused on a complete static website.

### Post-Deploy Scripts

- `webhooks` triggers API webhook endpoints after deployment.

Use `webhooks` for environment preparation after a deployment. For example, a feature environment may need to call API webhooks that generate translations, warm content, or start a Fargate task before manual or automated testing begins.

## Exports

```ts
import { api, deploy, docker, healthcheck, kaniko, lambda, mfe, site, webhooks } from '@vyriy/scripts';
```

Subpath imports are also supported:

```ts
import { api } from '@vyriy/scripts/api';
import { deploy } from '@vyriy/scripts/deploy';
import { docker } from '@vyriy/scripts/docker';
import { healthcheck } from '@vyriy/scripts/healthcheck';
import { kaniko } from '@vyriy/scripts/kaniko';
import { lambda } from '@vyriy/scripts/lambda';
import { mfe } from '@vyriy/scripts/mfe';
import { site } from '@vyriy/scripts/site';
import { webhooks } from '@vyriy/scripts/webhooks';
```

## Examples

### Lambda Smoke Test

```ts
import { lambda } from '@vyriy/scripts/lambda';

await lambda('my-function');
```

### API Healthcheck

```ts
import { healthcheck } from '@vyriy/scripts/healthcheck';

await healthcheck();
await healthcheck('CustomApiUrl', 'status');
```

### API Scenario

```ts
import { api } from '@vyriy/scripts/api';

await api(async (url) => {
  await fetch(`${url}healthcheck`);
  await fetch(`${url}users/me`);
});
```

### CDK Deployment

```ts
import { deploy } from '@vyriy/scripts/deploy';

await deploy();
```

### Docker Image Deployment

```ts
import { docker } from '@vyriy/scripts/docker';

await docker('./apps/api');
```

### Kaniko Image Deployment

```ts
import { kaniko } from '@vyriy/scripts/kaniko';

await kaniko('./apps/api');
```

### MFE Smoke Test

```ts
import { mfe } from '@vyriy/scripts/mfe';

await mfe();
await mfe('CustomDistributionUrl');
```

### Static Site Smoke Test

```ts
import { site } from '@vyriy/scripts/site';

await site();
await site('CustomSiteUrl');
```

### Webhook Execution

```ts
import { webhooks } from '@vyriy/scripts/webhooks';

await webhooks(['webhooks/build', 'webhooks/deploy']);
```
