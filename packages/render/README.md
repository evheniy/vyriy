# @vyriy/render

Small explicit React rendering adapters for browser DOM rendering, hydration, custom elements, SSR, streaming SSR, and static generation.

`@vyriy/render` is not a framework. It wraps official React rendering APIs into small predictable helpers that are easy to use in Vyriy-style applications, MFEs, SSR pages, SSG pipelines, and custom elements.

## Install

With npm:

```bash
npm install @vyriy/render
```

With Yarn:

```bash
yarn add @vyriy/render
```

## API

| API             | Purpose                                                           |
| --------------- | ----------------------------------------------------------------- |
| `element`       | Render or hydrate a React component into an existing DOM element. |
| `customElement` | Register a custom element that renders a React component.         |
| `html`          | Render a React component to an HTML string.                       |
| `stream`        | Render a React component to a Web `ReadableStream`.               |
| `prerender`     | Prerender a React component for static generation.                |

Hydration auto-detection uses a `rendered` marker attribute by default.

## Browser rendering

```tsx
import { element } from '@vyriy/render';

import { App } from './app.js';

element({
  root: document.getElementById('root'),
  component: <App />,
});
```

## Browser hydration

```tsx
import { element } from '@vyriy/render';

import { App } from './app.js';

element({
  root: document.getElementById('root'),
  component: <App />,
});
```

Server markup:

```html
<div id="root" rendered></div>
```

## Custom element

```tsx
import { customElement } from '@vyriy/render';

import { ProfileCard } from './profile-card.js';

customElement({
  tag: 'vyriy-profile-card',
  elements: () => {
    const styles = document.createElement('style');
    const container = document.createElement('div');

    styles.textContent = '.profile-card { display: block; }';

    return {
      elements: [styles, container],
      root: container,
    };
  },
  render: (customElement) => {
    return <ProfileCard name={customElement.getAttribute('name') ?? ''} />;
  },
});
```

## HTML string

```tsx
import { html } from '@vyriy/render';

import { App } from './app.js';

const body = html(<App />);
```

## Stream

```tsx
import { stream } from '@vyriy/render';

import { App } from './app.js';

const htmlStream = await stream({
  component: <App />,
  bootstrapScripts: ['/assets/app.js'],
});
```

## Rrerender

```tsx
import { prerender } from '@vyriy/render';

import { App } from './app.js';

const result = await prerender({
  component: <App />,
  bootstrapScripts: ['/assets/app.js'],
});
```

## Non-goals

This package intentionally does not provide routing, data loading, bundling, CSS handling, asset manifest loading, or application framework behavior.
