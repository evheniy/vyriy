# @vyriy/router

Router utility for Vyriy projects.

## Purpose

This package provides a small API Gateway router for Lambda handlers.

It is intentionally kept small:

- matches by HTTP method and exact path
- supports simple prefix dispatch for handler factories such as static file serving
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

## Usage

```ts
import { createRouter } from '@vyriy/router';
import { staticFiles } from '@vyriy/server/static';

const router = createRouter();

router.get('/health', async ({ event, query, headers, pathParameters, body }) => ({
  statusCode: 200,
  body: JSON.stringify({
    ok: true,
    method: event.httpMethod,
    query,
    headers,
    pathParameters,
    body,
  }),
}));

router.prefix('/static', staticFiles('./public'));

router.fallback(async ({ event }) => ({
  statusCode: 404,
  body: JSON.stringify({
    message: 'Not Found',
    path: event.path,
  }),
}));
```

Prefix handlers receive the relative matched path in `pathParameters.proxy`, so they can behave like normal handlers:

```ts
router.prefix('/events', async ({ pathParameters, responseStream }) => {
  responseStream?.setContentType?.('text/plain');
  responseStream?.write(`Path: ${pathParameters?.proxy}`);
  responseStream?.end();
});
```

## Exports

The package exposes both the root entry and the direct module entry:

```ts
import { createRouter } from '@vyriy/router';
import { Router } from '@vyriy/router/router';
```

## API

- `createRouter()` returns a chainable router API.
- `router.get(path, handler)` registers a `GET` handler.
- `router.post(path, handler)` registers a `POST` handler.
- `router.put(path, handler)` registers a `PUT` handler.
- `router.delete(path, handler)` registers a `DELETE` handler.
- `router.patch(path, handler)` registers a `PATCH` handler.
- `router.prefix(pathPrefix, handler)` registers a handler for every request under a URL prefix.
- `router.fallback(handler)` registers a handler for unmatched requests.
- `router.route(event)` resolves the matching route and returns an API Gateway response.

The low-level `Router` class is also available from `@vyriy/router/router` and exposes only:

- `router.on(method, path, handler)`
- `router.prefix(pathPrefix, handler)`
- `router.fallback(handler)`
- `router.route(event)`

Route handlers receive:

```ts
type HandlerParams = {
  query?: APIGatewayProxyEventQueryStringParameters;
  body?: string;
  headers?: APIGatewayProxyEvent['headers'];
  pathParameters?: APIGatewayProxyEvent['pathParameters'];
  responseStream?: ResponseStream;
  event: APIGatewayProxyEvent;
};
```
