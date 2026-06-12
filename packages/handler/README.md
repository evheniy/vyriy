# @vyriy/handler

Composable AWS Lambda handler chains and wrappers for Vyriy projects.

## Purpose

This package provides ready-made Lambda handler chains for common Vyriy workloads and a small set of reusable wrappers for logging, timeouts, smoke checks, development chaos injection, context setup, and error handling. It also ships a native Node HTTP chain (`httpApi`) with matching `httpWith*` wrappers for handlers that work directly with `IncomingMessage` and `ServerResponse`.

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

## Usage

Use a prebuilt API Gateway handler chain:

```ts
import { api } from '@vyriy/handler';

export const handler = api(async (event) => ({
  statusCode: 200,
  body: JSON.stringify({
    path: event.path,
  }),
}));
```

For Lambda response streaming, use the separate stream chain:

```ts
// handler.ts
import { streamApi } from '@vyriy/handler';

export const handler = streamApi(async (event, responseStream) => {
  responseStream.setContentType?.('text/plain');
  responseStream.write(`Request path: ${event.path}\n`);
  responseStream.write('Part 1 of the response...');
  responseStream.end('Part 2 of the response...');
});
```

`streamApi(...)` handlers receive `(event, responseStream, context)` and write directly to the response stream.

Use the same handler locally, in Docker, or in a Fargate-style HTTP runtime:

```ts
// server.ts
import { streamServer } from '@vyriy/server';

import { handler } from './handler.js';

streamServer(handler);
```

Use the same handler in AWS Lambda response streaming:

```ts
// lambda.ts
import { handler } from './handler.js';

export const main = awslambda.streamifyResponse(handler);
```

That `handler.ts` shape already matches Lambda response streaming. For a standard non-streaming Lambda, export an `api(...)` handler directly without `responseStream`.

You can also inline the same shape in one file when a separate local entrypoint is not needed:

```ts
import { streamApi } from '@vyriy/handler';

export const main = awslambda.streamifyResponse(
  streamApi(async (event, responseStream) => {
    responseStream.setContentType?.('text/plain');
    responseStream.write(`Request path: ${event.path}\n`);
    responseStream.write('Part 1 of the response...');
    responseStream.end('Part 2 of the response...');
  }),
);
```

For native Node HTTP handlers, use the HTTP chain. Handlers receive `(request, response)` and own the response lifecycle, which fits transports such as MCP Streamable HTTP:

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

Run it locally or in a container with `httpServer` from `@vyriy/server`:

```ts
import { httpServer } from '@vyriy/server';

import { handler } from './handler.js';

httpServer(handler);
```

Use a prebuilt queue or event handler chain:

```ts
import { sqs } from '@vyriy/handler';

export const handler = sqs(async (event) => {
  for (const record of event.Records) {
    console.info(record.body);
  }
});
```

Use a prebuilt SNS handler chain:

```ts
import { sns } from '@vyriy/handler';

export const handler = sns(async (event) => {
  for (const record of event.Records) {
    console.info(record.Sns.Message);
  }
});
```

Use a prebuilt DynamoDB Streams handler chain:

```ts
import { dynamodb } from '@vyriy/handler';

export const handler = dynamodb(async (event) => {
  for (const record of event.Records) {
    console.info(record.eventName);
  }
});
```

Use a prebuilt S3 event handler chain:

```ts
import { s3 } from '@vyriy/handler';

export const handler = s3(async (event) => {
  for (const record of event.Records) {
    console.info(record.s3.bucket.name, record.s3.object.key);
  }
});
```

Use a prebuilt SES receipt handler chain:

```ts
import { ses } from '@vyriy/handler';

export const handler = ses(async (event) => {
  for (const record of event.Records) {
    console.info(record.ses.mail.messageId, record.ses.mail.source);
  }
});
```

Use a prebuilt schedule handler chain:

```ts
import { schedule } from '@vyriy/handler';

export const handler = schedule(async (event) => {
  console.info('Scheduled event:', event['detail-type']);
});
```

Use a prebuilt EventBridge custom event handler chain:

```ts
import { eventBridge } from '@vyriy/handler';

export const handler = eventBridge(async (event) => {
  console.info('EventBridge event:', event.source, event['detail-type'], event.detail);
});
```

Each chain has its own composition and factory helpers: `compose`/`factory` for Lambda handlers, `streamCompose`/`streamFactory` for response streaming handlers, and `httpCompose`/`httpFactory` for native Node HTTP handlers.

Compose a custom handler pipeline from individual helpers:

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

Create a custom wrapper with `factory(...)` and compose it with the built-in helpers:

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

Compose a custom native HTTP pipeline with `httpCompose(...)` and the `httpWith*` wrappers:

```ts
import { httpCompose, httpWithCors, httpWithError, httpWithHealthcheck, httpWithLogger } from '@vyriy/handler';

export const handler = httpCompose(
  httpWithError(),
  httpWithLogger(),
  httpWithHealthcheck(),
  httpWithCors(),
)(async (request, response) => {
  response
    .writeHead(200, {
      'content-type': 'application/json',
    })
    .end(JSON.stringify({ ok: true }));
});
```

## Prebuilt Chains

- `api`
  API Gateway chain with error handling, logging, timeout handling, context setup, smoke checks, healthcheck handling, default headers, and CORS preflight handling.
- `streamApi`
  Response streaming API Gateway chain with the same wrapper behavior as `api`. Handlers receive `(event, responseStream, context)` and write directly to the Lambda response stream.

- `httpApi`
  Native Node HTTP chain with error handling, logging, healthcheck handling, default headers, and CORS preflight handling. Handlers receive `(request, response)` and write the response themselves. Unlike `api`, the chain sets no default `content-type` because native handlers own the response body format.

- `dynamodb`
  DynamoDB Streams chain with logging, timeout handling, context setup, smoke checks, and rethrown errors.

- `eventBridge`
  EventBridge custom event chain with logging, timeout handling, context setup, smoke checks, and rethrown errors.

- `s3`
  S3 event chain with logging, timeout handling, context setup, smoke checks, and rethrown errors.

- `ses`
  SES receipt rule chain for incoming email processing with logging, timeout handling, context setup, smoke checks, and rethrown errors.

- `schedule`
  EventBridge schedule chain with logging, timeout handling, context setup, smoke checks, and rethrown errors.

- `sns`
  SNS chain with logging, timeout handling, context setup, smoke checks, and rethrown errors.

- `sqs`
  SQS chain with logging, timeout handling, context setup, smoke checks, and rethrown errors.

## Wrappers

### `withError(options?)`

Catches handler failures, optionally runs a side-effect `errorHandler`, and rethrows the original error.

Options:

```ts
{
  errorHandler?: (error: unknown, args: HandlerParams<Event>) => Promise<void> | void;
}
```

- `errorHandler`
  Callback invoked with the caught error and handler arguments before the original error is rethrown.

Example:

```ts
import { withError } from '@vyriy/handler';

export const handler = withError({
  errorHandler: async (error) => {
    console.error('Handler failed:', error);
  },
})(async () => {
  throw new Error('boom');
});
```

### `withApiError(options?)`

Catches API handler failures and converts them to an API Gateway result. Without a custom `errorHandler`, it returns a JSON `500`.

### `withLogger(options?)`

Logs the incoming event and context, then logs either the result or the thrown error.

Options:

```ts
{
  logger?: typeof console;
}
```

- `logger`
  Console-compatible logger implementation. By default the wrapper creates one via `@vyriy/logger`.

Example:

```ts
import { withLogger } from '@vyriy/handler';

export const handler = withLogger({
  logger: console,
})(async (event) => {
  return {
    ok: true,
    event,
  };
});
```

### `withTimeout()`

Races the handler against a timeout scheduled one second before the Lambda runtime limit.

Example:

```ts
import { withTimeout } from '@vyriy/handler';

export const handler = withTimeout()(async () => {
  await doWork();
});
```

### `withContext()`

Sets `context.callbackWaitsForEmptyEventLoop = false` before calling the handler.

Example:

```ts
import { withContext } from '@vyriy/handler';

export const handler = withContext()(async (_event, context) => {
  return {
    waitForEmptyLoop: context.callbackWaitsForEmptyEventLoop,
  };
});
```

### `withChaos(options?)`

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

- `enabled`
  Turns chaos injection on. By default the wrapper reads `CHAOS_ENABLED` through `@vyriy/config`.

- `probability`
  Probability from `0` to `1` that a failure is injected.

- `strategy`
  Chooses whether to throw an error, wait and time out, or pick one randomly. Defaults to `'random'`.

- `timeoutMs`
  Timeout delay used when the timeout strategy is selected. By default the wrapper reads `CHAOS_TIMEOUT_MS` through `@vyriy/config`.

- `error`
  Error value normalized through `@vyriy/error` when the error strategy is selected.

Example:

```ts
import { withChaos } from '@vyriy/handler';

export const handler = withChaos({
  enabled: true,
  probability: 0.2,
  strategy: 'random',
  timeoutMs: 1500,
})(async () => {
  return {
    ok: true,
  };
});
```

### `withSmoke()`

Returns the smoke response when the incoming event has `isSmoke: true`.

Example:

```ts
import { withSmoke } from '@vyriy/handler';

export const handler = withSmoke()(async () => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      status: 'runtime',
    }),
  };
});
```

`withSmoke()` is used by the API, DynamoDB Streams, S3, SES receipt, schedule, SNS, and SQS chains.

### Native HTTP Wrappers

The `httpWith*` wrappers decorate native Node HTTP handlers and are composed with `httpCompose(...)`:

- `httpWithError(options?)`
  Catches handler failures and runs an optional side-effect `errorHandler`. When the response is still open it writes a JSON `500`; when headers were already sent it only ends the response.

- `httpWithLogger(options?)`
  Logs the incoming request method and URL, then logs either the response status code or the thrown error. Accepts the same `logger` option as `withLogger`.

- `httpWithHealthcheck(options?)`
  Writes a JSON `200` response when the request path matches the configured `path` (default `/healthcheck`). Besides `path` and `action`, it accepts an optional JSON-serializable `body` for the healthcheck response.

- `httpWithHeaders(options?)`
  Sets configured headers on the response before delegating, so handler-defined headers win on key conflicts.

- `httpWithCors()`
  Short-circuits `OPTIONS` preflight requests with a `204` response and delegates all other requests.

Custom native HTTP wrappers are created with `httpFactory(...)`:

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
)(async (request, response) => {
  response.writeHead(200).end('ok');
});
```

## Types

The package also exports shared handler types:

```ts
import type { Context, Decorator, Handler, HandlerParams, Response } from '@vyriy/handler';
import type { HttpDecorator, HttpHandler, HttpHandlerParams } from '@vyriy/handler';
```

## Notes

- `api` includes API-specific wrappers such as healthcheck handling, default headers, and CORS preflight handling
- `httpApi` skips timeout, context, smoke, and chaos wrappers because they rely on the Lambda context and event shape; it also sets no default `content-type`
- `dynamodb`, `s3`, `ses`, `schedule`, `sns`, and `sqs` use `withError()` so failures are rethrown for event-source retry behavior
- `ses` targets SES receipt rule Lambda events for incoming email; SES event publishing notifications can still be handled through the `sns` chain when delivered via SNS
- `withSmoke()` delegates matching to `@vyriy/smoke` and returns its API Gateway-compatible response
