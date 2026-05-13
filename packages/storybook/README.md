# @vyriy/storybook-config

Shared Storybook config for Vyriy projects.

## Purpose

This package provides the base Storybook setup used in Vyriy repositories:

- shared `main` config
- shared `preview` config
- addon defaults
- docs and theme behavior
- common Storybook ergonomics for React projects

## Install

With npm:

```bash
npm install -D @vyriy/storybook-config storybook
```

With Yarn:

```bash
yarn add -D @vyriy/storybook-config storybook
```

Install `storybook` in the consumer project so CLI commands are available.

## Usage

Create `.storybook/main.ts`:

```ts
import config, { type StorybookConfig } from '@vyriy/storybook-config/main';
import { path } from '@vyriy/path';

const mainConfig: StorybookConfig = {
  ...config,
  stories: [
    path('packages', '**/*.mdx'),
    path('packages', '**/*.stories.@(js|jsx|mjs|ts|tsx)'),
  ],
};

export default mainConfig;
```

Create `.storybook/preview.ts`:

```ts
export { default } from '@vyriy/storybook-config/preview';
```

If you customize preview locally, the preview module also exposes `Preview`.

```ts
import config, { type Preview } from '@vyriy/storybook-config/main';

const preview: Preview = {
  ...config,
  tags: ['autodocs'],
};
```

## Current Vyriy Usage

In this repository:

- `.storybook/main.ts` re-exports `@vyriy/storybook-config/main`
- `.storybook/preview.ts` imports local styles and re-exports `@vyriy/storybook-config/preview`

See the article with a complete Storybook setup walkthrough: <https://vyriy.dev/examples/vyriy-storybook-config/>.
