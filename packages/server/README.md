# @vyriy/server

Small HTTP server adapter for running Lambda-style API Gateway handlers and native Node HTTP handlers.

## Install

With npm:

```bash
npm install @vyriy/server
```

With Yarn:

```bash
yarn add @vyriy/server
```

## Usage

Run a Lambda-style handler over HTTP:

```ts
import { server } from '@vyriy/server';

server(async () => ({
  statusCode: 200,
  headers: {
    'content-type': 'application/json',
  },
  body: JSON.stringify({ ok: true }),
}));
```

Use `api(...)` when you want the handler package wrappers. It keeps the same `(event, context)` Lambda handler shape.

```ts
import { api } from '@vyriy/handler';
import { server } from '@vyriy/server';

const handler = api(async (event) => ({
  statusCode: 200,
  body: JSON.stringify({
    ok: true,
    path: event.path,
  }),
}));

server(handler);
```

Run a Lambda response streaming handler locally:

```ts
import { streamServer } from '@vyriy/server';

streamServer(async (event, responseStream) => {
  responseStream.setContentType?.('text/plain');
  responseStream.write(`Path: ${event.path}\n`);
  responseStream.end('Done');
});
```

The stream handler receives the API Gateway-style event first, the response stream second, and the Lambda context third.

Use `streamApi(...)` when you want the handler package wrappers. It keeps the same `(event, responseStream, context)` stream handler shape.

```ts
import { streamApi } from '@vyriy/handler';
import { streamServer } from '@vyriy/server';

const handler = streamApi((event, responseStream) => {
  responseStream.setContentType?.('text/plain');
  responseStream.write(`Path: ${event.path}\n`);
  responseStream.end('Done');
});

streamServer(handler);
```

Keep the AWS-specific `awslambda.streamifyResponse(handler)` wrapper in a separate Lambda entrypoint.

Run a native Node HTTP handler with `httpServer(...)`. The handler receives the Node `IncomingMessage` and `ServerResponse` directly and owns the response lifecycle, which fits transports such as MCP Streamable HTTP:

```ts
import { httpServer } from '@vyriy/server';

httpServer((request, response) => {
  response
    .writeHead(200, {
      'content-type': 'application/json',
    })
    .end(JSON.stringify({ ok: true, url: request.url }));
});
```

Use `httpApi(...)` when you want the handler package wrappers. It keeps the same `(request, response)` native handler shape.

```ts
import { httpApi } from '@vyriy/handler';
import { httpServer } from '@vyriy/server';

const handler = httpApi((request, response) => {
  response
    .writeHead(200, {
      'content-type': 'application/json',
    })
    .end(JSON.stringify({ ok: true, url: request.url }));
});

httpServer(handler);
```

Static files are intentionally left to the Docker/web-server layer, for example Nginx, Caddy, or the platform serving assets in front of this Node process.

The server listens on `PORT` from `@vyriy/env`. The default port is `3000`.
