# @vyriy/router

Router utility for Vyriy projects.

## Purpose

This package provides a small API Gateway router for Lambda handlers.

It is intentionally kept small:

- matches by HTTP method and exact path
- passes API Gateway event data into handlers
- returns a Lambda-friendly response shape

It does not try to be a path parser or dispatcher. If you later need regular expressions, wildcard matching, route params extraction, or more advanced dispatch rules, that logic should live in a separate package or layer.

## Install

With npm:

```bash
npm install @vyriy/router
```

With Yarn:

```bash
yarn add @vyriy/router
```

## Basic Router

```ts
import { createRouter } from '@vyriy/router';

const router = createRouter();

router.get('/health', async ({ event, query, headers, pathParameters, body }) => ({
  body: JSON.stringify({
    ok: true,
    method: event.httpMethod,
    query,
    headers,
    pathParameters,
    body,
  }),
}));

router.fallback(async ({ event }) => ({
  statusCode: 404,
  body: JSON.stringify({
    message: 'Not Found',
    path: event.path,
  }),
}));

export const handler = router.handle();
```

## Stream Router

Use `createStreamRouter()` when handlers write directly to a Lambda response stream. The stream is passed as the second handler argument, and stream handlers do not return a response object.

```ts
import { createStreamRouter } from '@vyriy/router';

const streamRouter = createStreamRouter();

streamRouter.get('/events', ({ event, query }, responseStream) => {
  responseStream.setContentType?.('text/plain');
  responseStream.write(`path: ${event.path}\n`);
  responseStream.write(`cursor: ${query?.cursor ?? 'start'}\n`);
  responseStream.end('done');
});

streamRouter.fallback(({ event }, responseStream) => {
  responseStream.setContentType?.('application/json');
  responseStream.end(
    JSON.stringify({
      message: 'Not Found',
      path: event.path,
    }),
  );
});

export const handler = streamRouter.handle();
```

## Calm Composition

The router keeps request matching separate from handler wrappers and local server adapters. A small API can stay as a plain composition of focused packages:

```ts
import { api } from '@vyriy/handler';
import { createRouter } from '@vyriy/router';
import { server } from '@vyriy/server';

const router = createRouter();

router.get('/health', () => ({
  body: JSON.stringify({
    ok: true,
  }),
}));

const handler = api(router.handle());

server(handler);
```

The same shape works for Lambda response streaming:

```ts
import { streamApi } from '@vyriy/handler';
import { createStreamRouter } from '@vyriy/router';
import { streamServer } from '@vyriy/server';

const router = createStreamRouter();

router.get('/events', (_params, responseStream) => {
  responseStream.setContentType?.('text/plain');
  responseStream.end('ok');
});

const handler = streamApi(router.handle());

streamServer(handler);
```

For a Lambda-only entrypoint, keep the same composition and export the handler:

```ts
import { api } from '@vyriy/handler';
import { createRouter } from '@vyriy/router';

const router = createRouter();

router.get('/health', () => ({
  body: JSON.stringify({
    ok: true,
  }),
}));

export const handler = api(router.handle());
```

## Exports

The package exposes both the root entry and the direct module entry:

```ts
import { createRouter, createStreamRouter } from '@vyriy/router';
import { Router, StreamRouter } from '@vyriy/router/router';
```

## API

- `createRouter()` returns a chainable router API.
- `createStreamRouter()` returns a chainable response streaming router API.
- `router.get(path, handler)` registers a `GET` handler.
- `router.post(path, handler)` registers a `POST` handler.
- `router.put(path, handler)` registers a `PUT` handler.
- `router.delete(path, handler)` registers a `DELETE` handler.
- `router.patch(path, handler)` registers a `PATCH` handler.
- `router.fallback(handler)` registers a handler for unmatched requests.
- `router.handle()` returns `(event) => router.route(event)` for API Gateway wrappers.
- `router.route(event)` resolves the matching route and returns an API Gateway response.
- `streamRouter.handle()` returns `(event, responseStream) => streamRouter.route(event, responseStream)` for stream wrappers.
- `streamRouter.route(event, responseStream)` resolves the matching route and writes to the stream.

Route handlers may omit `statusCode`; the router normalizes missing status codes to `200` before returning from `router.route(event)`.

The low-level `Router` and `StreamRouter` classes are also available from `@vyriy/router/router`:

- `router.on(method, path, handler)`
- `router.fallback(handler)`
- `router.route(event)`
- `streamRouter.on(method, path, handler)`
- `streamRouter.fallback(handler)`
- `streamRouter.route(event, responseStream)`

Route handlers receive:

```ts
type HandlerParams = {
  query?: APIGatewayProxyEventQueryStringParameters;
  body?: string;
  headers?: APIGatewayProxyEvent['headers'];
  pathParameters?: APIGatewayProxyEvent['pathParameters'];
  event: APIGatewayProxyEvent;
};
```

Stream route handlers receive the same `HandlerParams` as the first argument and `ResponseStream` as the second argument:

```ts
type StreamHandler = (params: HandlerParams, responseStream: ResponseStream) => void | Promise<void>;
```
