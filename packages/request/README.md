# @vyriy/request

Part of [Vyriy](https://vyriy.dev) - a calm architecture toolkit for TypeScript, React, SSR, SSG, APIs, and cloud-ready apps.

Full documentation: https://vyriy.dev/docs/request/

Shared request utility for Vyriy projects.

## Purpose

This package provides a small wrapper around `fetch` with timeout handling, retry behavior for retryable failures, and basic response parsing for JSON and text payloads.

## Install

With npm:

```bash
npm install @vyriy/request
```

With Yarn:

```bash
yarn add @vyriy/request
```

## Usage

Read JSON:

```ts
import { request, requestStream } from '@vyriy/request';

const profile = await request<{ id: string; name: string }>('/api/profile');
```

Read text with custom retry and timeout behavior:

```ts
const html = await request<string>('https://example.com', null, {
  retries: 1,
  timeout: 5000,
});
```

Send JSON with `POST`:

```ts
type CreatedProfile = {
  id: string;
};

const created = await request<CreatedProfile>('/api/profile', {
  method: 'POST',
  headers: {
    'content-type': 'application/json',
  },
  body: JSON.stringify({
    name: 'Ada',
  }),
});
```

Send authenticated requests:

```ts
const projects = await request<Array<{ id: string; name: string }>>('/api/projects', {
  headers: {
    authorization: `Bearer ${token}`,
    accept: 'application/json',
  },
});
```

Send form data:

```ts
const form = new FormData();
form.append('title', 'Draft');
form.append('file', file);

await request('/api/upload', {
  method: 'POST',
  body: form,
});
```

Use an external abort signal:

```ts
const controller = new AbortController();

const pending = request('/api/search', {
  signal: controller.signal,
});

controller.abort();

await pending;
```

Consume streaming chunks:

```ts
const decoder = new TextDecoder();

await requestStream('/api/events', null, {
  onChunk: (chunk) => {
    console.info(decoder.decode(chunk));
  },
});
```

Get the raw streaming response:

```ts
const response = await requestStream('/api/download');
const body = response.body;
```

## API

- `request(input, init?, options?)` performs a `fetch` call and returns parsed JSON or text.
- `requestStream(input, init?, options?)` performs a `fetch` call and returns the successful `Response`.
- `requestStream(..., { onChunk })` consumes `response.body` and calls `onChunk` for each `Uint8Array` chunk in order.
- `init` may be `null` when you want to skip request init and pass `options` as the third argument.
- `options.timeout` sets the per-attempt timeout in milliseconds.
- `options.retries` controls how many retry attempts are allowed after the initial request.
- `options.retryDelay` sets the base delay in milliseconds between retry attempts.
- `options.retryMethods` overrides which HTTP methods are allowed to retry.
- `options.retryStatuses` overrides which HTTP status codes are considered retryable.

For streaming requests, retries happen only before chunk consumption starts. This avoids delivering duplicate chunks to `onChunk`.
