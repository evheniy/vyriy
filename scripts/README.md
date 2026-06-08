# @vyriy/scripts

Shared scripts package for Vyriy projects.

## Purpose

This package exposes reusable CDK deployment, smoke-test, and e2e script factories used by Vyriy projects.

## Install

With npm:

```bash
npm install @vyriy/scripts
```

With Yarn:

```bash
yarn add @vyriy/scripts
```

## Exports

- `api` for API smoke checks
- `deploy` for CDK synth, diff, and deploy execution
- `docker` for Docker image build and push to ECR
- `e2e` for custom end-to-end scenarios
- `kaniko` for container build and push with Kaniko
- `lambda` for Lambda smoke checks
- `ui` for static UI smoke checks
- `webhooks` for webhook execution

## Usage

Import from the package root:

```ts
import { api, deploy, docker, e2e, kaniko, lambda, ui, webhooks } from '@vyriy/scripts';
```

Or use subpath exports:

```ts
import { api } from '@vyriy/scripts/api';
import { deploy } from '@vyriy/scripts/deploy';
import { docker } from '@vyriy/scripts/docker';
import { e2e } from '@vyriy/scripts/e2e';
import { kaniko } from '@vyriy/scripts/kaniko';
import { lambda } from '@vyriy/scripts/lambda';
import { ui } from '@vyriy/scripts/ui';
import { webhooks } from '@vyriy/scripts/webhooks';
```

## Examples

### API smoke test

```ts
import { api } from '@vyriy/scripts/api';

await api();
```

### CDK deployment

```ts
import { deploy } from '@vyriy/scripts/deploy';

await deploy();
```

### Docker deployment

```ts
import { docker } from '@vyriy/scripts/docker';

await docker('./apps/api');
```

### E2E scenario

```ts
import { e2e } from '@vyriy/scripts/e2e';

await e2e(async (url) => {
  await fetch(`${url}healthcheck`);
});
```

### Kaniko deployment

```ts
import { kaniko } from '@vyriy/scripts/kaniko';

await kaniko('./apps/api');
```

### Lambda smoke test

```ts
import { lambda } from '@vyriy/scripts/lambda';

await lambda('my-function');
```

### UI smoke test

```ts
import { ui } from '@vyriy/scripts/ui';

await ui();
await ui('DistributionUrl', false); // skip index.js for HTML-only output
```

### Webhook execution

```ts
import { webhooks } from '@vyriy/scripts/webhooks';

await webhooks(['webhooks/build', 'webhooks/deploy']);
```
