# @vyriy/handler

Part of [Vyriy](https://vyriy.dev) - a calm architecture toolkit for TypeScript, React, SSR, SSG, APIs, and cloud-ready apps.

Full documentation: https://vyriy.dev/docs/handler/

Composable AWS Lambda handler chains and wrappers for Vyriy projects.

## Purpose

`@vyriy/handler` provides ready-made handler chains for common AWS Lambda workloads and small reusable wrappers for logging, timeouts, smoke checks, development chaos injection, context setup, headers, CORS, healthchecks, and error handling.

It is designed for projects that want a consistent handler pipeline without repeating the same boilerplate in every Lambda entrypoint.

## Install

With npm:

```bash
npm install @vyriy/handler
```

With Yarn:

```bash
yarn add @vyriy/handler
```

For TypeScript Lambda projects, install AWS Lambda types as a development dependency:

```bash
yarn add @types/aws-lambda
```

The `awslambda` response streaming helper is a global provided by the AWS Lambda Node.js runtime. It is not imported from `aws-lambda`; `@types/aws-lambda` only lets TypeScript type-check that global.

## API

Use `api` for API Gateway-style Lambda handlers:

```ts
import { api } from '@vyriy/handler';

export const handler = api(async (event) => ({
  statusCode: 200,
  body: JSON.stringify({
    path: event.path,
  }),
}));
```

`api` includes error handling, logging, timeout handling, context setup, smoke checks, healthcheck handling, default headers, CORS preflight handling, and development chaos injection.

Use `create.api(...)` when a project needs a configured API chain. Passing `headers` replaces the default API headers:

```ts
import { create } from '@vyriy/handler';

const api = create.api({
  headers: {
    'access-control-allow-origin': '*',
    'content-type': 'application/json',
  },
  healthcheck: {
    path: '/ready',
  },
});

export const handler = api(async () => ({
  statusCode: 200,
  body: JSON.stringify({ ok: true }),
}));
```

The API-specific entrypoint exposes the same chain as `api`:

```ts
import { api, create } from '@vyriy/handler/api';
```

## Event Sources

The event-source chains share the Lambda wrapper set: `withError`, `withLogger`, `withTimeout`, `withContext`, and `withSmoke`. Failures are rethrown so AWS event-source retry behavior still works.

### S3

```ts
import { s3 } from '@vyriy/handler';

export const handler = s3(async (event) => {
  for (const record of event.Records) {
    console.info(record.s3.bucket.name, record.s3.object.key);
  }
});
```

### SQS

```ts
import { sqs } from '@vyriy/handler';

export const handler = sqs(async (event) => {
  for (const record of event.Records) {
    console.info(record.body);
  }
});
```

### SNS

```ts
import { sns } from '@vyriy/handler';

export const handler = sns(async (event) => {
  for (const record of event.Records) {
    console.info(record.Sns.Message);
  }
});
```

### DynamoDB Streams

```ts
import { dynamodb } from '@vyriy/handler';

export const handler = dynamodb(async (event) => {
  for (const record of event.Records) {
    console.info(record.eventName);
  }
});
```

### EventBridge

```ts
import { eventBridge } from '@vyriy/handler';

export const handler = eventBridge(async (event) => {
  console.info('EventBridge event:', event.source, event['detail-type'], event.detail);
});
```

### Schedule

```ts
import { schedule } from '@vyriy/handler';

export const handler = schedule(async (event) => {
  console.info('Scheduled event:', event['detail-type']);
});
```

### SES

```ts
import { ses } from '@vyriy/handler';

export const handler = ses(async (event) => {
  for (const record of event.Records) {
    console.info(record.ses.mail.messageId, record.ses.mail.source);
  }
});
```

`ses` targets SES receipt rule Lambda events for incoming email. SES event publishing notifications can still be handled through the `sns` chain when delivered via SNS.

## HTTP

Use `httpApi` for native Node HTTP handlers. Handlers receive `(request, response)` and own the response lifecycle, which fits transports such as MCP Streamable HTTP:

```ts
import { httpApi } from '@vyriy/handler';

export const handler = httpApi(async (request, response) => {
  response
    .writeHead(200, {
      'content-type': 'application/json',
    })
    .end(JSON.stringify({ ok: true, url: request.url }));
});
```

`httpApi` includes error handling, request logging, healthcheck handling, default headers, and CORS preflight handling. It sets no default `content-type` because native handlers own the response body format.

Use the runtime-specific entrypoint when that reads better:

```ts
import { api, create } from '@vyriy/handler/api/http';
```

Configure a native HTTP chain with `create.httpApi(...)`. Passing `headers` replaces the default HTTP headers:

```ts
import { create } from '@vyriy/handler';

const httpApi = create.httpApi({
  headers: {
    'access-control-allow-headers': 'content-type, mcp-protocol-version',
    'access-control-allow-methods': 'GET, POST, OPTIONS',
    'access-control-allow-origin': '*',
    'x-content-type-options': 'nosniff',
  },
});

export const handler = httpApi(async (_request, response) => {
  response.writeHead(200).end('ok');
});
```

Run it locally or in a container with `httpServer` from `@vyriy/server`:

```ts
import { httpServer } from '@vyriy/server';

import { handler } from './handler.js';

httpServer(handler);
```

Build a custom native HTTP pipeline with `httpCompose(...)` and `httpFactory(...)`:

```ts
import { httpCompose, httpFactory, httpWithError } from '@vyriy/handler';

const httpWithRequestId = httpFactory<{ headerName?: string }>(async (handler, args, options = {}) => {
  const [request] = args;
  const requestId = request.headers[options.headerName ?? 'x-request-id'];

  if (requestId) {
    console.info('Request ID:', requestId);
  }

  await handler(...args);
});

export const handler = httpCompose(
  httpWithError(),
  httpWithRequestId(),
)(async (_request, response) => {
  response.writeHead(200).end('ok');
});
```

The lower-level helpers are also available from runtime subpaths:

```ts
import { compose } from '@vyriy/handler/api/http/compose';
import { factory } from '@vyriy/handler/api/http/factory';
```

## Stream

Use `streamApi` for Lambda response streaming. Stream handlers receive `(event, responseStream, context)` and write directly to the response stream:

```ts
import { streamApi } from '@vyriy/handler';

export const handler = streamApi(async (event, responseStream) => {
  responseStream.setContentType?.('text/plain');
  responseStream.write(`Request path: ${event.path}\n`);
  responseStream.write('Part 1 of the response...');
  responseStream.end('Part 2 of the response...');
});
```

Use the same handler in AWS Lambda response streaming:

```ts
import { handler } from './handler.js';

export const main = awslambda.streamifyResponse(handler);
```

Run the same handler locally, in Docker, or in a Fargate-style HTTP runtime:

```ts
import { streamServer } from '@vyriy/server';

import { handler } from './handler.js';

streamServer(handler);
```

You can also inline the same shape in one file:

```ts
import { streamApi } from '@vyriy/handler';

export const main = awslambda.streamifyResponse(
  streamApi(async (event, responseStream) => {
    responseStream.setContentType?.('text/plain');
    responseStream.write(`Request path: ${event.path}\n`);
    responseStream.end('ok');
  }),
);
```

The runtime-specific entrypoint exposes the same chain as `api`:

```ts
import { api, create } from '@vyriy/handler/api/stream';
```

`streamApi` includes the same wrapper behavior as `api`, adapted for response streaming. Passing `headers` to `create.streamApi(...)` replaces the default stream headers.

Custom stream pipelines use stream-specific compose and factory helpers:

```ts
import { streamCompose, streamFactory, streamWithApiError } from '@vyriy/handler';

const streamWithRequestId = streamFactory<{ headerName?: string }>(async (handler, args, options = {}) => {
  const [event] = args;
  const requestId = event.headers?.[options.headerName ?? 'x-request-id'];

  if (requestId) {
    console.info('Request ID:', requestId);
  }

  await handler(...args);
});

export const handler = streamCompose(
  streamWithApiError(),
  streamWithRequestId(),
)(async (_event, responseStream) => {
  responseStream.end('ok');
});
```

The lower-level helpers are also available from runtime subpaths:

```ts
import { compose } from '@vyriy/handler/api/stream/compose';
import { factory } from '@vyriy/handler/api/stream/factory';
```

## Create

`create` builds configured versions of the prebuilt chains while keeping the standard exports unchanged:

```ts
import { create } from '@vyriy/handler';

const { api, httpApi, s3, sqs, streamApi } = create;
```

Each key is a factory:

```ts
import { create } from '@vyriy/handler';

const httpApi = create.httpApi({
  healthcheck: {
    path: '/health',
  },
  headers: {
    'access-control-allow-origin': '*',
    'access-control-allow-methods': 'GET, POST, OPTIONS',
    'access-control-allow-headers': 'content-type, mcp-protocol-version',
    'x-content-type-options': 'nosniff',
  },
});

export const handler = httpApi(async (_request, response) => {
  response.writeHead(200).end('ok');
});
```

Available factories:

- `create.api(options?)`
- `create.httpApi(options?)`
- `create.streamApi(options?)`
- `create.dynamodb(options?)`
- `create.eventBridge(options?)`
- `create.s3(options?)`
- `create.schedule(options?)`
- `create.ses(options?)`
- `create.sns(options?)`
- `create.sqs(options?)`

For `api`, `httpApi`, and `streamApi`, passing `headers` replaces the default header set for that configured chain.

Runtime subpaths also expose local factories:

```ts
import { create as createHttpApi } from '@vyriy/handler/api/http';
import { create as createStreamApi } from '@vyriy/handler/api/stream';

const httpApi = createHttpApi({
  headers: {
    'access-control-allow-origin': '*',
  },
});

const streamApi = createStreamApi();
```

## Custom Wrappers

Use `compose(...)` to build a custom Lambda pipeline from decorators:

```ts
import { compose, withChaos, withContext, withError, withLogger, withTimeout } from '@vyriy/handler';

export const handler = compose(
  withError(),
  withLogger(),
  withChaos(),
  withTimeout(),
  withContext(),
)(async (event) => {
  return {
    ok: true,
    event,
  };
});
```

Use `factory(...)` to create a custom Lambda wrapper:

```ts
import { compose, factory, withError, withLogger, withTimeout } from '@vyriy/handler';

const withRequestId = factory<{ headerName?: string }>(async (handler, args, options = {}) => {
  const [event] = args;
  const headerName = options.headerName ?? 'x-request-id';
  const requestId =
    typeof event === 'object' && event && 'headers' in event
      ? (event.headers as Record<string, string | undefined> | undefined)?.[headerName]
      : undefined;

  if (requestId) {
    console.info('Request ID:', requestId);
  }

  return handler(...args);
});

export const handler = compose(
  withError(),
  withLogger(),
  withTimeout(),
  withRequestId({
    headerName: 'x-request-id',
  }),
)(async (event) => {
  return {
    ok: true,
    event,
  };
});
```

Each runtime has matching helpers:

- Lambda: `compose` and `factory` from `@vyriy/handler`
- HTTP: `httpCompose` and `httpFactory` from `@vyriy/handler`, or `compose` / `factory` from `@vyriy/handler/api/http/compose` and `@vyriy/handler/api/http/factory`
- Stream: `streamCompose` and `streamFactory` from `@vyriy/handler`, or `compose` / `factory` from `@vyriy/handler/api/stream/compose` and `@vyriy/handler/api/stream/factory`

## Wrappers

Wrapper exports are split by runtime:

```ts
import { withError, withLogger } from '@vyriy/handler/wrappers';
import { withHeaders } from '@vyriy/handler/api/wrappers';
import { httpWithHeaders } from '@vyriy/handler/api/http/wrappers';
import { streamWithHeaders } from '@vyriy/handler/api/stream/wrappers';
```

The root `@vyriy/handler` entrypoint re-exports the public wrappers for convenience.

### Common Lambda Wrappers

#### `withError(options?)`

Catches handler failures, optionally runs a side-effect `errorHandler`, and rethrows the original error.

Options:

```ts
{
  errorHandler?: (error: unknown, args: HandlerParams<Event>) => Promise<void> | void;
}
```

#### `withLogger(options?)`

Logs the incoming event and context, then logs either the result or the thrown error.

Options:

```ts
{
  logger?: typeof console;
}
```

By default the wrapper creates a logger via `@vyriy/logger`.

#### `withTimeout()`

Races the handler against a timeout scheduled one second before the Lambda runtime limit.

#### `withContext()`

Sets `context.callbackWaitsForEmptyEventLoop = false` before calling the handler.

#### `withSmoke()`

Returns the smoke response when the incoming event has `isSmoke: true`. Matching is delegated to `@vyriy/smoke`.

#### `withChaos(options?)`

Injects development-only random failures before the wrapped handler runs.

Options:

```ts
{
  enabled?: boolean;
  probability?: number;
  strategy?: 'error' | 'timeout' | 'random';
  timeoutMs?: number;
  error?: unknown;
}
```

`enabled` and `timeoutMs` can be read through `@vyriy/config` when they are not passed directly.

### API Wrappers

#### `withApiError(options?)`

Catches API handler failures and converts them to an API Gateway result. Without a custom `errorHandler`, it returns a JSON `500`.

Options:

```ts
{
  errorHandler?: (error: unknown, args: HandlerParams<ApiEvent>) => Promise<ApiResult> | ApiResult;
}
```

#### `withHealthcheck(options?)`

Returns a JSON `200` response when `event.path` matches the configured `path`.

Options:

```ts
{
  path?: string;
  action?: () => Promise<void>;
}
```

#### `withHeaders(options?)`

Adds configured headers to the API result.

Options:

```ts
Record<string, string>;
```

#### `withCors()`

Short-circuits API Gateway `OPTIONS` requests with a `204` response and delegates all other requests.

### HTTP Wrappers

#### `httpWithError(options?)`

Catches native HTTP handler failures and runs an optional side-effect `errorHandler`. When the response is still open it writes a JSON `500`; when headers were already sent it only ends the response.

Options:

```ts
{
  errorHandler?: (error: unknown, args: HttpHandlerParams) => Promise<void> | void;
}
```

#### `httpWithLogger(options?)`

Logs the incoming request method and URL, then logs either the final response status code or the thrown error. Accepts the same `logger` option as `withLogger`.

#### `httpWithHealthcheck(options?)`

Writes a JSON `200` response when the request path matches the configured `path`.

Options:

```ts
{
  path?: string;
  action?: () => Promise<void>;
  body?: unknown;
}
```

#### `httpWithHeaders(options?)`

Sets configured headers on the response before delegating, so handler-defined headers win on key conflicts.

Options:

```ts
Record<string, string>;
```

#### `httpWithCors()`

Short-circuits `OPTIONS` preflight requests with a `204` response and delegates all other requests.

### Stream Wrappers

The `streamWith*` wrappers mirror the API and common Lambda wrappers for response streaming handlers:

- `streamWithApiError(options?)`
- `streamWithLogger(options?)`
- `streamWithTimeout()`
- `streamWithContext()`
- `streamWithSmoke()`
- `streamWithHealthcheck(options?)`
- `streamWithHeaders(options?)`
- `streamWithCors()`
- `streamWithChaos(options?)`

Stream-specific wrappers write metadata through the response stream before or instead of delegating to the wrapped stream handler.

## Types

The package exports shared Lambda handler types from the root entrypoint:

```ts
import type { Context, Decorator, Handler, HandlerParams, Response } from '@vyriy/handler';
```

Runtime-specific types are available from their runtime entrypoints:

```ts
import type { ApiEvent, ApiOptions, ApiResult } from '@vyriy/handler/api';
import type { HttpApiOptions, HttpDecorator, HttpHandler, HttpHandlerParams } from '@vyriy/handler/api/http';
import type { ResponseStream, StreamApiOptions, StreamHandler } from '@vyriy/handler/api/stream';
```

The root entrypoint still re-exports runtime-specific types for compatibility.

## Notes

- `api` includes API-specific wrappers such as healthcheck handling, default headers, and CORS preflight handling
- `httpApi` skips timeout, context, smoke, and chaos wrappers because they rely on the Lambda context and event shape
- `streamApi` keeps the API-style behavior but adapts result writing to Lambda response streams
- `dynamodb`, `s3`, `ses`, `schedule`, `sns`, `sqs`, and `eventBridge` use `withError()` so failures are rethrown for event-source retry behavior
- Passing `headers` to `create.api`, `create.httpApi`, or `create.streamApi` replaces that chain's default headers
