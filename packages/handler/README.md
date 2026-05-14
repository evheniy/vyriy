# @vyriy/handler

Composable AWS Lambda handler chains and wrappers for Vyriy projects.

## Purpose

This package provides ready-made Lambda handler chains for common Vyriy workloads and a small set of reusable wrappers for logging, timeouts, smoke checks, development chaos injection, context setup, and error handling.

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

For Lambda response streaming, keep the reusable handler separate from the runtime entrypoints:

```ts
// handler.ts
import { api, streamify } from '@vyriy/handler';

export const handler = streamify(
  api(async (event, responseStream, context) => {
    responseStream.setContentType?.('text/plain');
    responseStream.write(`Request path: ${event.path}\n`);
    responseStream.write(`Request id: ${context.awsRequestId}\n`);
    responseStream.write('Part 1 of the response...');
    responseStream.write('Part 2 of the response...');
    responseStream.end();
  }),
);
```

Use the same handler locally, in Docker, or in a Fargate-style HTTP runtime:

```ts
// server.ts
import { server } from '@vyriy/server';

import { handler } from './handler.js';

server(handler);
```

Use the same handler in AWS Lambda response streaming:

```ts
// lambda.ts
import { handler } from './handler.js';

export const main = awslambda.streamifyResponse(handler);
```

That `handler.ts` shape is already streamified. For a standard non-streaming Lambda, export an `api(...)` handler directly without `streamify(...)` and without `responseStream`.

You can also inline the same shape in one file when a separate local entrypoint is not needed:

```ts
import { api, streamify } from '@vyriy/handler';

export const main = awslambda.streamifyResponse(
  streamify(
    api(async (event, responseStream, context) => {
      responseStream.setContentType?.('text/plain');
      responseStream.write(`Request path: ${event.path}\n`);
      responseStream.write(`Request id: ${context.awsRequestId}\n`);
      responseStream.write('Part 1 of the response...');
      responseStream.write('Part 2 of the response...');
      responseStream.end();
    }),
  ),
);
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

Use a prebuilt schedule handler chain:

```ts
import { schedule } from '@vyriy/handler';

export const handler = schedule(async (event) => {
  console.info('Scheduled event:', event['detail-type']);
});
```

Compose a custom handler pipeline from individual helpers:

```ts
import { compose, withChaos, withContext, withError, withLogger, withSmoke, withTimeout } from '@vyriy/handler';

export const handler = compose(
  withError({ throwError: true }),
  withLogger(),
  withChaos(),
  withTimeout(),
  withContext(),
  withSmoke(),
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
  withError({ throwError: true }),
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

## Prebuilt Chains

- `api`
  API Gateway chain with error handling, logging, timeout handling, context setup, smoke checks, healthcheck handling, default headers, CORS preflight handling, and structural support for streaming/static-file response results.
- `streamifyApiResponse`
  Adapts an `api(...)` handler that returns a streaming result to the three-argument handler shape expected by `awslambda.streamifyResponse`.
- `streamify`
  Alias for `streamifyApiResponse` intended for direct Lambda response streaming handlers.

- `schedule`
  EventBridge schedule chain with logging, timeout handling, context setup, smoke checks, and rethrown errors.

- `sns`
  SNS chain with logging, timeout handling, context setup, smoke checks, and rethrown errors.

- `sqs`
  SQS chain with logging, timeout handling, context setup, smoke checks, and rethrown errors.

## Wrappers

### `withError(options?)`

Catches handler failures, optionally runs an async error handler, and rethrows only when `throwError` is enabled.

Options:

```ts
{
  errorHandler?: (error: unknown) => Promise<void>;
  throwError?: boolean;
}
```

- `errorHandler`
  Async callback invoked with the caught error.

- `throwError`
  Re-throws the original error after `errorHandler` runs. Defaults to `false`.

Example:

```ts
import { withError } from '@vyriy/handler';

export const handler = withError({
  errorHandler: async (error) => {
    console.error('Handler failed:', error);
  },
  throwError: true,
})(async () => {
  throw new Error('boom');
});
```

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

Returns the smoke response when the incoming event matches the smoke request payload.

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

## Types

The package also exports shared handler types:

```ts
import type { Context, Decorator, Handler, Response } from '@vyriy/handler';
```

## Notes

- `api` includes API-specific wrappers such as healthcheck handling, default headers, and CORS preflight handling
- `schedule`, `sns`, and `sqs` enable `throwError: true` in `withError(...)`
- `withSmoke()` delegates matching to `@vyriy/smoke`
