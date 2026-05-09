# @vyriy/request

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

```ts
import { request } from '@vyriy/request';

const profile = await request<{ id: string; name: string }>('/api/profile');

const html = await request<string>('https://example.com', null, {
  retries: 1,
  timeout: 5000,
});
```

## API

- `request(input, init?, options?)` performs a `fetch` call and returns parsed JSON or text.
- `init` may be `null` when you want to skip request init and pass `options` as the third argument.
- `options.timeout` sets the per-attempt timeout in milliseconds.
- `options.retries` controls how many retry attempts are allowed after the initial request.
- `options.retryDelay` sets the base delay in milliseconds between retry attempts.
- `options.retryMethods` overrides which HTTP methods are allowed to retry.
- `options.retryStatuses` overrides which HTTP status codes are considered retryable.
