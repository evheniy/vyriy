# @vyriy/hoc

Part of [Vyriy](https://vyriy.dev) - a calm architecture toolkit for TypeScript, React, SSR, SSG, APIs, and cloud-ready apps.

Full documentation: https://vyriy.dev/docs/hoc/

React higher-order component utilities for Vyriy projects.

## Purpose

This package is a home for reusable React HOC helpers such as strict rendering wrappers and other component decorators.

## Install

With npm:

```bash
npm install @vyriy/hoc
```

With Yarn:

```bash
yarn add @vyriy/hoc
```

## Usage

Wrap a component with React `StrictMode`:

```tsx
import { withStrictMode } from '@vyriy/hoc';

const App = () => <main />;

export default withStrictMode(App);
```

Wrap a component with the default React HOC stack:

```tsx
import { withReact } from '@vyriy/hoc';

const App = () => <main />;

export default withReact(App);
```

Compose your own HOC stack:

```tsx
import { compose, withActivity, withProfiler, withStrictMode, withSuspense } from '@vyriy/hoc';

const withApp = compose(withStrictMode, withSuspense, withActivity, withProfiler);

export default withApp(App);
```

Create a custom HOC from a wrapper component:

```tsx
import { builder } from '@vyriy/hoc';
import type { PropsWithChildren } from 'react';

type LayoutProps = {
  title: string;
};

const Layout = ({ children, title }: PropsWithChildren<LayoutProps>) => (
  <section aria-label={title}>{children}</section>
);

export const withLayout = builder(Layout, {
  title: 'Application',
});
```

Use the shared HOC type when declaring package-local helpers:

```ts
import type { Hoc } from '@vyriy/hoc';
```

## API

- `builder(WrapperComponent, wrapperProps?, childrenProps?)` creates a HOC from a wrapper component.
- `builder(WrapperComponent, wrapperProps, childrenProps, Component)` wraps a component immediately.
- `compose(...hocs)` composes HOCs from outermost to innermost.
- `wrapper(WrapperComponent, wrapperProps, childrenProps, Component)` wraps a component directly.
- `withActivity(Component)` wraps a component with React `Activity`.
- `withProfiler(Component)` wraps a component with React `Profiler` and default no-op profiling props.
- `withReact(Component)` wraps a component with `StrictMode`, `Suspense`, `Activity`, and `Profiler`.
- `withStrictMode(Component)` wraps a component with React `StrictMode`.
- `withSuspense(Component)` wraps a component with React `Suspense` and the default `<div>Loading...</div>` fallback.
- `Hoc<Props>` describes a React higher-order component that receives a component and returns a component with the same props.
- `ChildrenProps<Props, LocalProps>` maps render-prop wrapper values into wrapped component props.
- `WrapperComponent<WrapperProps, Children>` describes a component that accepts wrapper props and `children`.
