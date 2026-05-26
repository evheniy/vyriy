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

The shared SCSS loaders are resolved from `@vyriy/storybook-config`, so consumers do not need local `style-loader`, `css-loader`, or `sass-loader` dependencies for the default setup.

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
import config, { type Preview } from '@vyriy/storybook-config/preview';

const preview: Preview = {
  ...config,
  tags: ['autodocs'],
};
```

When a project needs custom docs themes, use `createThemedDocsContainer` so shared Markdown behavior stays enabled.

```ts
import config, { createThemedDocsContainer, type Preview } from '@vyriy/storybook-config/preview';
import themeDark from './theme-dark';
import themeLight from './theme-light';

const preview: Preview = {
  ...config,
  parameters: {
    ...config.parameters,
    docs: {
      container: createThemedDocsContainer({
        dark: themeDark,
        light: themeLight,
      }),
    },
  },
};
```

The shared preview container configures Storybook `Markdown` blocks to render Mermaid fenced code blocks.

```tsx
import Structure from './STRUCTURE.md?raw';
import { Markdown } from '@storybook/addon-docs/blocks';

<Markdown>{Structure}</Markdown>;
```

The underlying renderer is also available as `@vyriy/storybook-config/mermaid-markdown` for custom docs surfaces outside the shared preview container.

## Current Vyriy Usage

In this repository:

- `.storybook/main.ts` re-exports `@vyriy/storybook-config/main`
- `.storybook/preview.ts` imports local styles and re-exports `@vyriy/storybook-config/preview`

See the article with a complete Storybook setup walkthrough: <https://vyriy.dev/examples/vyriy-storybook-config/>.
