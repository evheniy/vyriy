# @vyriy/services

Part of [Vyriy](https://vyriy.dev) - a calm architecture toolkit for TypeScript, React, SSR, SSG, APIs, and cloud-ready apps.

Full documentation: https://vyriy.dev/docs/services/

Small AWS service SDK for Vyriy projects.

## Purpose

This package wraps common AWS SDK operations behind calm, reusable helpers.
It is not meant to hide AWS. It keeps the AWS command inputs available where
they are useful, while removing repeated client setup and common boilerplate
from app, script, service, and deployment code.

The package is AWS-first and serverless-oriented. Current helpers cover:

- `cloudfront`: create invalidations and optionally wait for completion
- `dynamodb`: create tables and read/write/query/scan document items
- `ecs`: start one Fargate task with environment overrides
- `lambda`: invoke Lambda functions with JSON string payloads
- `logs`: wait for marker strings in CloudWatch Logs
- `s3`: upload, download, and check object existence
- `sns`: publish messages to topics
- `ssm`: read one or many Parameter Store values

## Install

With npm:

```bash
npm install @vyriy/services
```

With Yarn:

```bash
yarn add @vyriy/services
```

## LocalStack

Some clients are prepared for local AWS-compatible development:

- `dynamodb` uses `LOCALSTACK_HOST` and `LOCALSTACK_PORT` as its endpoint when
  `@vyriy/env` reports the local stage.
- `s3` uses the same LocalStack endpoint in local stage and enables
  `forcePathStyle`.
- `ecs` uses the configured region in local stage, but does not point to a
  LocalStack endpoint.
- `cloudfront`, `lambda`, `logs`, `sns`, and `ssm` currently use their normal AWS SDK
  client configuration.

Service clients are created lazily inside each helper call. Importing
`@vyriy/services` or a service subpath does not construct AWS SDK clients.

LocalStack defaults come from `@vyriy/env`:

- `LOCALSTACK_HOST`: defaults to `localhost`
- `LOCALSTACK_PORT`: defaults to `4566`

## Usage

Import from the package root:

```ts
import * as services from '@vyriy/services';

await services.s3.upload('assets-bucket', 'pages/index.html', '<html>...</html>', 'text/html');
await services.lambda.invoke('my-function', JSON.stringify({ ok: true }));
```

Or import a service subpath directly:

```ts
import { getParameter } from '@vyriy/services/ssm';
import { upload } from '@vyriy/services/s3';

const apiUrl = await getParameter('/app/api-url');

await upload('assets-bucket', 'config/api-url.txt', apiUrl, 'text/plain');
```

Wait for a Lambda log marker and clean up the source S3 object:

```ts
import { logs, s3 } from '@vyriy/services';

await s3.upload('email-bucket', 'messages/test.eml', rawEmail, 'message/rfc822; charset=utf-8');

try {
  await logs.waitForMarker('/aws/lambda/process-email', marker);
} finally {
  await s3.remove('email-bucket', 'messages/test.eml');
}
```

Client factories are also exported from service subpaths when direct AWS SDK
access is needed. The service path gives the generic `createClient` name its
context:

```ts
import { createClient } from '@vyriy/services/s3';

const client = createClient({ region: 'eu-central-1' });
```

## Examples

Invalidate CloudFront after publishing static files:

```ts
import { invalidate } from '@vyriy/services/cloudfront';

await invalidate('DISTRIBUTION_ID', ['/index.html', '/assets/*'], true);
```

Run a Fargate task:

```ts
import { runTask } from '@vyriy/services/ecs';

await runTask('regenerate-pages', [{ name: 'CONTENT_ID', value: 'home' }]);
```

Read application settings from SSM:

```ts
import { getParameters } from '@vyriy/services/ssm';

const settings = await getParameters(['/app/api-url', '/app/cdn-url']);
```
