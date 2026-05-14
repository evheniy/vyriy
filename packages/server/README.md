# @vyriy/server

Small HTTP server adapter for running Lambda-style API Gateway handlers.

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

Run a Lambda response streaming handler locally:

```ts
import { api, streamify } from '@vyriy/handler';
import { server } from '@vyriy/server';

server(
  streamify(
    api(async (event, responseStream) => {
      responseStream.setContentType?.('text/plain');
      responseStream.write(`Path: ${event.path}\n`);
      responseStream.end('Done');
    }),
  ),
);
```

Keep the AWS-specific `awslambda.streamifyResponse(handler)` wrapper in a separate Lambda entrypoint.

Serve static files through `@vyriy/router` prefix routes:

```ts
import { createRouter } from '@vyriy/router';
import { staticFiles } from '@vyriy/server/static';

const router = createRouter().prefix('/static', staticFiles('./public'));
```

Serve a static directory directly when the server only needs files:

```ts
import { server, staticFiles } from '@vyriy/server';

server(
  staticFiles('./public', {
    fallback: 'index.html',
    fallbackStatusCode: 200,
  }),
);
```

By default, missing static files fall back to `404.html` from the same directory with status `404` when that file exists.
For static apps that should fall back to `index.html`, configure the fallback explicitly:

```ts
const router = createRouter().prefix(
  '/static',
  staticFiles('./public', {
    fallback: 'index.html',
    fallbackStatusCode: 200,
  }),
);
```

The server listens on `PORT` from `@vyriy/env`. The default port is `3000`.
