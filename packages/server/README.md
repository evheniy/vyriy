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

The server listens on `PORT` from `@vyriy/env`. The default port is `3000`.
