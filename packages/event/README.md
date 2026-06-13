# @vyriy/event

Part of [Vyriy](https://vyriy.dev) - a calm architecture toolkit for TypeScript, React, SSR, SSG, APIs, and cloud-ready apps.

Full documentation: https://vyriy.dev/docs/event/

Shared helpers for building and dispatching `CustomEvent` in Vyriy microfrontends.

## Purpose

This package implements two small outbound event helper groups aligned with the openmfe event rules:

- `custom` validates and dispatches microfrontend-owned custom events
- `analytics` creates and dispatches the standard `openmfe.analytics` event

Invalid input throws an `Error`.

The root package entry point re-exports both groups for backwards-compatible imports.

## Install

With npm:

```bash
npm install @vyriy/event
```

With Yarn:

```bash
yarn add @vyriy/event
```

## Event Naming Rules

Regular custom event names must:

- use lowercase latin letters, numbers, dashes, and dots
- start with the microfrontend tag name
- contain at least one additional name level
- start and end with a lowercase latin letter

Example of a valid event name:

```text
mf-shell.checkout.completed
```

## Usage

Create a validated event:

```ts
import { createCustomEvent } from '@vyriy/event';

const event = createCustomEvent('mf-shell', 'mf-shell.checkout.completed', {
  orderId: '42',
});
```

Dispatch an event from the microfrontend element itself:

```ts
import { dispatchCustomEvent } from '@vyriy/event';

const element = document.querySelector('mf-shell');

dispatchCustomEvent(element!, 'mf-shell.checkout.completed', {
  orderId: '42',
});
```

Emit the standard openmfe analytics event:

```ts
import { dispatchAnalyticsEvent } from '@vyriy/event';

const element = document.querySelector('mf-shell');

dispatchAnalyticsEvent(element!, {
  name: 'checkout_submit',
  action: 'submit form',
  category: 'checkout',
  variant: 'b',
  data: {
    step: 2,
  },
});
```

This produces a `CustomEvent` with the fixed name `openmfe.analytics` and a `detail` payload like:

```ts
{
  name: 'checkout_submit',
  origin: 'mf-shell',
  id: 'checkout-widget',
  variant: 'b',
  action: 'submit form',
  category: 'checkout',
  data: {
    step: 2,
  },
}
```

When `id`, `variant`, or `category` are not available, they are set to `null`. During dispatch, `origin` is inferred from the element `tagName`, and `id` is inferred from the element `id` unless explicitly provided.

## API

Root entry:

- `@vyriy/event` re-exports the public `custom` and `analytics` helpers
- `validateEventName(origin, name)` validates and normalizes a regular custom event name
- `createCustomEvent(origin, name, detail, options?)` creates a validated custom `CustomEvent`
- `dispatchCustomEvent(target, name, detail, options?)` creates and dispatches a validated custom event on the provided target
- `createAnalyticsEvent(origin, input, options?)` creates the standard `openmfe.analytics` event
- `dispatchAnalyticsEvent(target, input, options?)` creates and dispatches the standard analytics event

## Exported Types

- `CustomEventTargetLike`
- `CustomEventOptions`
- `AnalyticsEventTargetLike`
- `AnalyticsEventOptions`
- `AnalyticsInput<Data>`
- `AnalyticsDetail<Data>`
