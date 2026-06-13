# @vyriy/router

Router utility for Vyriy projects.

## Purpose

This package provides a small router for Lambda handlers and native Node HTTP servers:

- `createRouter()` for API Gateway events
- `createStreamRouter()` for Lambda response streaming
- `createHttpRouter()` for native Node `IncomingMessage`/`ServerResponse` handlers

It is intentionally kept small:

- matches by HTTP method and exact path
- passes API Gateway event data into handlers (or raw Node request/response for the HTTP router)
- returns a Lambda-friendly response shape (the stream and HTTP routers write the response instead)

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

Use the streaming router when handlers write directly to a Lambda response stream. The stream is passed as the second handler argument, and stream handlers do not return a response object.

Import it from the `@vyriy/router/stream` subpath (clean `createRouter`/`router` names), or use the aggregated `createStreamRouter` alias from the root entry.

```ts
import { createRouter as createStreamRouter } from '@vyriy/router/stream';

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

## HTTP Router

Use `createHttpRouter()` when handlers work directly with native Node `IncomingMessage` and `ServerResponse` objects. Handlers own the response lifecycle and write the response themselves, which fits transports such as MCP Streamable HTTP.

In addition to the method helpers, the HTTP router supports `all(path, handler)` for routes that accept any HTTP method. Method-specific routes take precedence over `all` routes on the same path.

Import it from the `@vyriy/router/http` subpath (clean `createRouter`/`router` names), or use the aggregated `createHttpRouter` alias from the root entry.

```ts
import { createRouter as createHttpRouter } from '@vyriy/router/http';

const httpRouter = createHttpRouter();

httpRouter.get('/health', (request, response) => {
  response
    .writeHead(200, {
      'content-type': 'application/json',
    })
    .end(JSON.stringify({ ok: true }));
});

// transports that handle multiple HTTP methods on one path, such as MCP Streamable HTTP
httpRouter.all('/mcp', async (request, response) => {
  await transport.handleRequest(request, response);
});

httpRouter.fallback((request, response) => {
  response
    .writeHead(404, {
      'content-type': 'application/json',
    })
    .end(
      JSON.stringify({
        message: 'Not Found',
        path: request.url,
      }),
    );
});

export const handler = httpRouter.handle();
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

And for native Node HTTP handlers:

```ts
import { httpApi } from '@vyriy/handler';
import { createHttpRouter } from '@vyriy/router';
import { httpServer } from '@vyriy/server';

const router = createHttpRouter();

router.get('/health', (request, response) => {
  response
    .writeHead(200, {
      'content-type': 'application/json',
    })
    .end(JSON.stringify({ ok: true }));
});

const handler = httpApi(router.handle());

httpServer(handler);
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

The classic Lambda router lives at the root entry, while the streaming and native HTTP
variants each have their own subpath with clean, unprefixed names:

```ts
import { createRouter, router } from '@vyriy/router';
import { createRouter, router } from '@vyriy/router/http';
import { createRouter, router } from '@vyriy/router/stream';
```

The root entry also re-exports every variant under prefixed names, so a single import keeps
working:

```ts
import { createHttpRouter, createRouter, createStreamRouter } from '@vyriy/router';
import { HttpRouter, Router, StreamRouter } from '@vyriy/router';
```

The low-level `Router` classes are exported from each entry: `Router` from `@vyriy/router`,
`@vyriy/router/http`, and `@vyriy/router/stream`, plus the aggregated `HttpRouter` and
`StreamRouter` names from the root entry.

## API

- `createRouter()` returns a chainable router API.
- `createStreamRouter()` returns a chainable response streaming router API.
- `createHttpRouter()` returns a chainable native HTTP router API.
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
- `httpRouter.all(path, handler)` registers a handler for any HTTP method on an exact path.
- `httpRouter.handle()` returns `(request, response) => httpRouter.route(request, response)` for native HTTP wrappers.
- `httpRouter.route(request, response)` resolves the matching route and lets the handler write the response.

Route handlers may omit `statusCode`; the router normalizes missing status codes to `200` before returning from `router.route(event)`.

The low-level `Router`, `StreamRouter`, and `HttpRouter` classes are also available from `@vyriy/router` (each variant additionally exports its class as `Router` from its own subpath):

- `router.on(method, path, handler)`
- `router.fallback(handler)`
- `router.route(event)`
- `streamRouter.on(method, path, handler)`
- `streamRouter.fallback(handler)`
- `streamRouter.route(event, responseStream)`
- `httpRouter.on(method, path, handler)`
- `httpRouter.all(path, handler)`
- `httpRouter.fallback(handler)`
- `httpRouter.route(request, response)`

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

HTTP route handlers receive the native Node request and response objects directly:

```ts
type HttpHandler = (request: IncomingMessage, response: ServerResponse) => void | Promise<void>;
```

When no HTTP route matches and no fallback is registered, the HTTP router writes a JSON `404` response itself.
