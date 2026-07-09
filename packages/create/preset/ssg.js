import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import packageJson from '../package.json' with { type: 'json' };
import { styleToolingFiles } from './tooling.js';
const presetDir = dirname(fileURLToPath(import.meta.url));
const agentsPath = [
    resolve(presetDir, '../../../AGENTS.md'),
    resolve(presetDir, '../../../../AGENTS.md'),
].find(existsSync) ?? '';
const agentsContent = agentsPath ? readFileSync(agentsPath, 'utf8') : '';
const readSsgPublicAsset = (file) => readFileSync(resolve(presetDir, '../assets/ssg-public', file));
export const ssg = (options) => ({
    'package.json': JSON.stringify({
        name: options.name,
        version: '0.0.0',
        description: options.description,
        private: true,
        type: 'module',
        agents: './AGENTS.md',
        packageManager: packageJson.packageManager,
        engines: {
            node: packageJson.engines.node,
        },
        workspaces: [
            'packages/*',
            'workspaces/*',
        ],
        scripts: {
            storybook: 'cross-env STORYBOOK_DISABLE_TELEMETRY=1 storybook dev -p 6006 --disable-telemetry',
            check: 'run-s lint build test',
            fix: "run-s 'fix:*'",
            lint: "run-s 'lint:*'",
            build: "run-s 'build:*'",
            test: "run-s 'test:*'",
            start: "run-p 'start:*'",
            'fix:prettier': 'prettier . --write',
            'fix:eslint': 'eslint . --fix',
            'fix:stylelint': 'stylelint "**/*.{css,scss}" --fix',
            'lint:ts': 'tsc',
            'lint:prettier': 'prettier . --check',
            'lint:eslint': 'eslint .',
            'lint:stylelint': 'stylelint "**/*.{css,scss}"',
            'build:ssg': 'rimraf dist && sh workspaces/ssg/bin/build.sh',
            'build:storybook': 'cross-env STORYBOOK_DISABLE_TELEMETRY=1 storybook build --quiet --disable-telemetry',
            'start:ssg': 'npx vs -p 3000 dist --cache static',
            'test:jest': 'jest',
            postinstall: 'husky',
        },
        dependencies: {
            '@vyriy/typescript-config': `^${packageJson.version}`,
            typescript: packageJson.peerDependencies.typescript,
            '@vyriy/prettier-config': `^${packageJson.version}`,
            prettier: packageJson.peerDependencies.prettier,
            '@vyriy/eslint-config': `^${packageJson.version}`,
            eslint: packageJson.peerDependencies.eslint,
            '@vyriy/jest-config': `^${packageJson.version}`,
            jest: packageJson.peerDependencies.jest,
            '@vyriy/storybook-config': `^${packageJson.version}`,
            storybook: packageJson.peerDependencies.storybook,
            '@vyriy/path': `^${packageJson.version}`,
            husky: packageJson.peerDependencies.husky,
            'npm-run-all2': packageJson.peerDependencies['npm-run-all2'],
            'cross-env': packageJson.peerDependencies['cross-env'],
            rimraf: packageJson.peerDependencies.rimraf,
            '@vyriy/webpack-config': `^${packageJson.version}`,
            webpack: packageJson.peerDependencies.webpack,
            tsx: packageJson.peerDependencies.tsx,
            'webpack-cli': packageJson.peerDependencies['webpack-cli'],
            '@vyriy/stylelint-config': `^${packageJson.version}`,
            stylelint: packageJson.peerDependencies.stylelint,
            sass: packageJson.peerDependencies.sass,
            '@vyriy/ssg': `^${packageJson.version}`,
            '@vyriy/static': `^${packageJson.version}`,
        },
    }, null, 2) + '\n',
    'README.md': `# SSG

Markdown-first static site generated with \`@vyriy/ssg\`.

The repository keeps content under \`site/*\`, styling under
\`packages/components/styles.scss\`, and the build entry point in
\`workspaces/ssg\`.

## Structure

\`\`\`text
packages/
  components/   Site stylesheet and style documentation.
site/
  home/         Home page Markdown.
  consulting/   Standalone consulting page Markdown.
  docs/         Documentation landing page and docs entries.
  blog/         Blog entries.
  examples/     Example entries.
  public/       Static assets copied into dist.
workspaces/
  ssg/          Thin build workspace around @vyriy/ssg.
\`\`\`

## Build Flow

1. \`workspaces/ssg\` is bundled into \`dist/index.js\`.
2. \`packages/components/styles.scss\` is compiled into \`dist/styles.css\`.
3. \`@vyriy/ssg\` reads Markdown from \`site\` and writes static output to \`dist\`.
4. The generated site includes HTML pages, search data, sitemap, robots.txt, and copied public assets.

## Development

Install dependencies:

\`\`\`bash
yarn install
\`\`\`

Build the static site:

\`\`\`bash
yarn build:ssg
\`\`\`

Preview the built site with the Vyriy static server:

\`\`\`bash
yarn start:ssg
\`\`\`

Run all checks:

\`\`\`bash
yarn check
\`\`\`

Focused validation:

\`\`\`bash
yarn jest workspaces/ssg --runInBand --coverage=false
yarn lint:stylelint
\`\`\`

## Content

Each content page is a \`README.md\` file with optional frontmatter:

\`\`\`md
---
title: Calm page
description: A short page description.
published: true
tags:
  - ssg
---

# Calm page

Page content.
\`\`\`

By default \`@vyriy/ssg\` builds \`home\`, \`consulting\`, \`docs\`, \`blog\`,
\`examples\`, search pages, related content metadata, \`sitemap.xml\`, and
\`robots.txt\`.

## Project Guidance

These articles describe the development approach behind this preset and provide practical guidance for evolving a project on top of it:

- [Calm Development Environment: Node.js, Corepack, Yarn and Static Preview](https://vyriy.dev/blog/calm-development-setup/) - how to keep the local development environment predictable and easy to reproduce.
- [Calm App Structure for the Vyriy Ecosystem](https://vyriy.dev/blog/vyriy-calm-app-structure/) - a practical project structure for Vyriy applications: shared configs, small packages, thin workspaces, Storybook docs, tests, and deployable entry points.
- [Storybook as Project Documentation](https://vyriy.dev/blog/storybook-as-project-documentation/) - how to use Storybook as living project documentation and a component playground.
`,
    'doc.mdx': `import { Meta, Markdown } from '@storybook/addon-docs/blocks';
import ReadMe from './README.md?raw';

<Meta title="SSG" />

<Markdown>{ReadMe}</Markdown>
`,
    'AGENTS.md': agentsContent,
    '.editorconfig': `# https://editorconfig.org
root = true

[*]
charset = utf-8
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true

indent_style = space
indent_size = 2

max_line_length = 100

# Markdown
[*.md]
trim_trailing_whitespace = false
max_line_length = off

# YAML / YML
[*.{yml,yaml}]
indent_size = 2

# JSON
[*.json]
indent_size = 2

# TypeScript / JavaScript
[*.{ts,tsx,js,jsx}]
indent_size = 2

# Shell / Bash
[*.sh]
indent_size = 2
`,
    '.gitignore': `.yarn/*
!.yarn/cache
!.yarn/patches
!.yarn/plugins
!.yarn/releases
!.yarn/sdks
!.yarn/versions

.DS_Store
.idea
node_modules
coverage
dist
storybook-static
*storybook.log
consumer

cdk.out
cdk.context.json

.claude
.codex
.agents

!/**/.gitkeep
`,
    '.npmrc': 'engine-strict=true\n',
    '.nvmrc': 'lts/krypton\n',
    '.yarnrc.yml': 'nodeLinker: node-modules\nnpmMinimalAgeGate: 0\n',
    '.husky/commit-msg': '#!/bin/sh\n',
    '.husky/post-checkout': '#!/bin/sh\n\nyarn\n',
    '.husky/post-merge': '#!/bin/sh\n\nyarn\n',
    '.husky/pre-commit': '#!/bin/sh\n\nyarn check\n',
    '.husky/pre-push': '#!/bin/sh\n\nyarn check\n',
    'yarn.lock': '',
    ...styleToolingFiles,
    '.prettierignore': 'node_modules\ndist\ncoverage\nstorybook-static\nconsumer\n',
    'packages/components/doc.mdx': `import { Meta, Markdown } from '@storybook/addon-docs/blocks';
import ReadMe from './README.md?raw';

<Meta title="Packages/Components" />

<Markdown>{ReadMe}</Markdown>
`,
    'packages/components/README.md': `# Components

Site presentation package.

The starter keeps only shared stylesheet ownership here. \`@vyriy/ssg\` owns the
default static rendering system, while this package owns project-specific visual
tokens and small CSS adjustments.

## Files

- \`styles.scss\` - compiled into \`dist/styles.css\` before the static site is generated.

## Validation

\`\`\`bash
yarn lint:stylelint
\`\`\`
`,
    'packages/components/package.json': JSON.stringify({
        name: '@p/components',
        private: true,
        type: 'module',
    }, null, 2) + '\n',
    'packages/components/styles.scss': `*,
*::before,
*::after {
  box-sizing: border-box;
}

:root {
  --color-bg: #ffffff;
  --color-surface: #f6f7f7;
  --color-surface-muted: #eef1f2;
  --color-text: #28323c;
  --color-muted: #687580;
  --color-heading: #3d5165;
  --color-primary: #3d5165;
  --color-primary-hover: #334557;
  --color-accent: #365f8c;
  --color-chrome-bg: var(--color-primary);
  --color-chrome-text: #ffffff;
  --color-border: #dbe1e5;
  --color-border-strong: #c6d0d8;
  --color-link: var(--color-primary);
  --color-link-hover: #263848;
  --color-focus: #6f8293;
  --font-sans: system-ui, -apple-system, blinkmacsystemfont, 'Segoe UI', sans-serif;
  --font-mono: 'SFMono-Regular', consolas, 'Liberation Mono', monospace;
}

html {
  background: var(--color-bg);
  color: var(--color-text);
  font-family: var(--font-sans);
  text-size-adjust: none;
}

body {
  min-width: 20rem;
  min-height: 100vh;
  margin: 0;
  background: var(--color-bg);
  color: var(--color-text);
  font-family: var(--font-sans);
}

img,
picture,
svg,
video,
canvas {
  display: block;
  max-width: 100%;
}

button,
input,
textarea,
select {
  font: inherit;
}

a {
  color: var(--color-link);
}

a:hover {
  color: var(--color-link-hover);
}

.vyriy-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  min-height: 100dvh;
  background: var(--color-bg);
  color: var(--color-text);
}

.vyriy-layout__main {
  flex: 1;
  padding-block: 2rem 3rem;
}

.vyriy-header,
.vyriy-footer {
  background: var(--color-chrome-bg);
  color: var(--color-chrome-text);
}

.vyriy-header {
  position: relative;
  border-block-end: 1px solid rgb(255 255 255 / 14%);
}

.vyriy-header__inner,
.vyriy-footer__inner {
  box-sizing: border-box;
  width: min(100% - 2rem, 76rem);
  margin-inline: auto;
}

.vyriy-header__inner {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 1rem;
  align-items: center;
  padding-block: 1rem;
}

.vyriy-header__brand {
  display: inline-flex;
  gap: 0.6rem;
  align-items: center;
  color: #ffffff;
  font-size: 2rem;
  font-weight: 700;
  text-decoration: none;
}

.vyriy-header__logo {
  width: 4.5rem;
  height: auto;
  object-fit: contain;
}

.vyriy-header__actions {
  display: flex;
  gap: 0.35rem;
  align-items: center;
  justify-content: flex-end;
}

.vyriy-header__search-checkbox,
.vyriy-header__search-label,
.vyriy-navigation__checkbox,
.vyriy-navigation__toggle-text,
.vyriy-search-form__label {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}

.vyriy-header__search-toggle,
.vyriy-navigation__toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 3.25rem;
  min-height: 3.25rem;
  color: #dedbd8;
  cursor: pointer;
}

.vyriy-header__search-icon {
  position: relative;
  display: block;
  width: 1.35rem;
  height: 1.35rem;
  border: 0.18rem solid currentcolor;
  border-radius: 999rem;
}

.vyriy-header__search-icon::after {
  position: absolute;
  inset-block-start: 0.95rem;
  inset-inline-start: 0.95rem;
  display: block;
  width: 0.65rem;
  height: 0.18rem;
  background: currentcolor;
  border-radius: 999rem;
  content: '';
  transform: rotate(45deg);
  transform-origin: 0 50%;
}

.vyriy-search-form {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  width: 100%;
}

.vyriy-search-form__input {
  box-sizing: border-box;
  min-width: 0;
  flex: 1 1 auto;
  width: 100%;
  min-height: 2.5rem;
  padding: 0.45rem 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 0.25rem;
  background: #ffffff;
  color: var(--color-text);
}

.vyriy-header__search.vyriy-search-form {
  position: absolute;
  inset-block-start: 100%;
  inset-inline: 0;
  z-index: 2;
  max-height: 0;
  padding: 0 1rem;
  overflow: hidden;
  background: var(--color-chrome-bg);
  opacity: 0;
  pointer-events: none;
  visibility: hidden;
}

.vyriy-header__search-checkbox:checked ~ .vyriy-header__search {
  max-height: 5rem;
  padding-block: 0.75rem;
  opacity: 1;
  pointer-events: auto;
  visibility: visible;
}

.vyriy-navigation__toggle-icon {
  display: inline-flex;
  flex-direction: column;
  gap: 0.35rem;
  width: 2rem;
}

.vyriy-navigation__toggle-line {
  display: block;
  height: 0.18rem;
  border-radius: 999rem;
  background: currentcolor;
}

.vyriy-navigation__list {
  display: none;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0;
  margin: 0;
  list-style: none;
}

.vyriy-navigation__checkbox:checked ~ .vyriy-navigation__list {
  display: flex;
}

.vyriy-navigation__link {
  display: block;
  padding-block: 0.35rem;
  color: #dedbd8;
  font-size: 1.2rem;
  text-decoration: none;
}

.vyriy-navigation__link:hover,
.vyriy-header__brand:hover,
.vyriy-header__search-toggle:hover,
.vyriy-navigation__toggle:hover {
  color: #ffffff;
}

.vyriy-page,
.vyriy-catalog {
  width: min(100% - 2rem, 56rem);
  margin-inline: auto;
}

.vyriy-page__content,
.vyriy-catalog__content {
  max-width: 56rem;
  color: var(--color-text);
  line-height: 1.7;
}

.vyriy-page__content > :first-child {
  margin-block-start: 0;
}

.vyriy-page__content h1 {
  margin: 0;
  color: var(--color-text);
  font-size: 2rem;
  line-height: 1.08;
}

.vyriy-page__content h2,
.vyriy-page__content h3 {
  padding-block-start: 1.5rem;
  border-block-start: 1px solid var(--color-border);
  margin: 2rem 0 1rem;
  color: var(--color-heading);
  line-height: 1.25;
}

.vyriy-page__content p,
.vyriy-page__content ul,
.vyriy-page__content pre {
  margin: 1rem 0 0;
}

.vyriy-page__content code {
  padding: 0.1rem 0.25rem;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background: var(--color-surface);
  font-family: var(--font-mono);
  font-size: 0.9em;
}

.vyriy-page__content pre {
  overflow-x: auto;
  padding: 1rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: var(--color-surface);
  line-height: 1.55;
}

.vyriy-page__content pre code {
  display: block;
  min-width: max-content;
  padding: 0;
  border: 0;
  background: transparent;
}

.vyriy-card,
.vyriy-search-page__result {
  border-block-end: 1px solid var(--color-border);
}

.vyriy-card__link,
.vyriy-search-page__result-link {
  display: block;
  padding-block: 1.25rem;
  color: inherit;
  text-decoration: none;
}

.vyriy-card__title,
.vyriy-search-page__result-title {
  margin: 0;
  color: var(--color-heading);
  font-size: 1.25rem;
  line-height: 1.35;
}

.vyriy-card__description,
.vyriy-search-page__result-description {
  max-width: 42rem;
  margin: 0.5rem 0 0.75rem;
  color: var(--color-muted);
  line-height: 1.65;
}

.vyriy-card__tags,
.vyriy-search-page__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  padding: 0;
  margin: 0;
  list-style: none;
}

.vyriy-card__tag,
.vyriy-page__tag,
.vyriy-search-page__tag {
  max-width: 100%;
  padding: 0.15rem 0.5rem;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  background: var(--color-surface);
  color: var(--color-link);
  font-size: 0.875rem;
  line-height: 1.35;
  overflow-wrap: anywhere;
  text-decoration: none;
}

.vyriy-page__featured,
.vyriy-page__related {
  padding-block-start: 1.5rem;
  border-block-start: 1px solid var(--color-border);
  margin-block-start: 2rem;
}

.vyriy-page__featured-list,
.vyriy-page__related-list {
  display: grid;
  gap: 1rem;
}

.vyriy-pagination {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
  justify-content: center;
  margin-block-start: 2rem;
}

.vyriy-pagination__pages {
  display: flex;
  gap: 0.25rem;
  padding: 0;
  margin: 0;
  list-style: none;
}

.vyriy-pagination__control,
.vyriy-pagination__page,
.vyriy-search-form__button,
.vyriy-search-page__more {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 2.5rem;
  padding: 0.45rem 0.85rem;
  border: 1px solid var(--color-primary);
  border-radius: 0.25rem;
  background: var(--color-primary);
  color: #ffffff;
  cursor: pointer;
  font: inherit;
  font-weight: 600;
  text-decoration: none;
}

.vyriy-pagination__page[aria-current='page'] {
  background: var(--color-primary-hover);
}

.vyriy-footer {
  border-block-start: 1px solid rgb(255 255 255 / 14%);
}

.vyriy-footer__inner {
  padding-block: 1rem;
  text-align: center;
}

.vyriy-footer__text {
  margin: 0;
  color: #ffffff;
  font-size: 1.125rem;
}

@media (min-width: 48rem) {
  .vyriy-header__inner {
    display: flex;
    min-height: 4rem;
    padding-block: 0;
    justify-content: space-between;
  }

  .vyriy-header__search-shell {
    position: relative;
  }

  .vyriy-header__search.vyriy-search-form {
    inset-block-start: 50%;
    inset-inline: auto calc(100% + 0.35rem);
    width: min(21rem, 36vw);
    max-height: none;
    padding: 0;
    background: transparent;
    transform: translateY(-50%);
  }

  .vyriy-header__search-checkbox:checked ~ .vyriy-header__search {
    max-height: none;
    padding-block: 0;
  }

  .vyriy-navigation__toggle {
    display: none;
  }

  .vyriy-navigation__list {
    display: flex;
    flex-flow: row wrap;
    gap: 0.5rem 1rem;
    align-items: center;
  }

  .vyriy-navigation__link {
    padding-block: 0;
  }

  .vyriy-page__featured-list,
  .vyriy-page__related-list {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
`,
    'site/public/favicon.ico': readSsgPublicAsset('favicon.ico'),
    'site/public/favicon-16x16.png': readSsgPublicAsset('favicon-16x16.png'),
    'site/public/favicon-32x32.png': readSsgPublicAsset('favicon-32x32.png'),
    'site/public/apple-touch-icon.png': readSsgPublicAsset('apple-touch-icon.png'),
    'site/public/assets/vyriy-v-wings.png': readSsgPublicAsset('assets/vyriy-v-wings.png'),
    'site/public/assets/vyriy-calm-architecture.png': readSsgPublicAsset('assets/vyriy-calm-architecture.png'),
    'workspaces/ssg/bin/build.sh': `#!/usr/bin/env sh

set -eu

NODE_ENV=production npx webpack --config "$PWD/workspaces/ssg/webpack.config.ts"

yarn exec sass packages/components/styles.scss dist/styles.css --no-source-map --style=compressed

cp -R "$PWD/site/public/." dist/

mkdir -p dist/assets
cp "$PWD/node_modules/minisearch/dist/umd/index.js" dist/assets/minisearch.js

cp "$PWD/workspaces/ssg/package.json" dist/package.json
npm pkg delete type --prefix dist

node dist/index.js

rm dist/index.js
rm dist/package.json
`,
    'workspaces/ssg/doc.mdx': `import { Meta, Markdown } from '@storybook/addon-docs/blocks';
import ReadMe from './README.md?raw';

<Meta title="Workspaces/SSG" />

<Markdown>{ReadMe}</Markdown>
`,
    'workspaces/ssg/README.md': `# @w/ssg

Static site build workspace.

The workspace is intentionally thin. It calls \`buildStaticSite\` from
\`@vyriy/ssg\`, passes the compiled stylesheet content, and lets the reusable
generator build the static site from Markdown content under \`site\`.

## Build

\`\`\`bash
yarn build:ssg
\`\`\`

The build writes output into \`dist\`.

## Preview

\`\`\`bash
yarn start:ssg
\`\`\`

This serves \`dist\` with \`vs\`, the CLI provided by \`@vyriy/static\`.
`,
    'workspaces/ssg/webpack.config.ts': `import 'webpack';

import { path } from '@vyriy/path';
import { ssr, external } from '@vyriy/webpack-config';

export default ssr(
  '@w/ssg',
  {
    path: path('dist'),
    filename: 'index.js',
    library: { type: 'commonjs2' },
    clean: false,
  },
  (config) => ({
    ...config,
    externals: [external({ allowlist: [/^@w/] })],
  }),
);
`,
    'workspaces/ssg/package.json': JSON.stringify({
        name: '@w/ssg',
        type: 'module',
        private: true,
    }, null, 2) + '\n',
    'workspaces/ssg/index.ts': `import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import { buildStaticSite } from '@vyriy/ssg';

export const buildWorkspaceStaticSite = async () =>
  buildStaticSite({
    siteUrl: process.env.SITE_URL,
    stylesheetContent: await readFile(join(process.cwd(), 'dist/styles.css'), 'utf8'),
  });

void buildWorkspaceStaticSite();
`,
    'workspaces/ssg/index.test.ts': `import { join } from 'node:path';

import { describe, expect, it, jest } from '@jest/globals';

const mockReadFile = jest.fn<(path: string, encoding: string) => Promise<string>>(() =>
  Promise.resolve('body { color: #28323c; }'),
);
const mockBuildStaticSite = jest.fn<
  (options: { readonly siteUrl?: string; readonly stylesheetContent: string }) => Promise<void>
>(() => Promise.resolve());

jest.mock('node:fs/promises', () => ({
  readFile: mockReadFile,
}));

jest.mock('@vyriy/ssg', () => ({
  buildStaticSite: mockBuildStaticSite,
}));

describe('@w/ssg entry point', () => {
  it('builds the static site with the compiled stylesheet content', async () => {
    const cwd = jest.spyOn(process, 'cwd').mockReturnValue('/project');
    const siteUrl = process.env.SITE_URL;
    process.env.SITE_URL = 'https://example.com';

    try {
      await import('./index.js');
      await Promise.resolve();

      expect(mockReadFile).toHaveBeenCalledWith(join('/project', 'dist/styles.css'), 'utf8');
      expect(mockBuildStaticSite).toHaveBeenCalledWith({
        siteUrl: 'https://example.com',
        stylesheetContent: 'body { color: #28323c; }',
      });
    } finally {
      cwd.mockRestore();
      if (siteUrl === undefined) {
        delete process.env.SITE_URL;
      } else {
        process.env.SITE_URL = siteUrl;
      }
    }
  });
});
`,
    'site/home/README.md': `---
title: Site
description: A calm static site generated with @vyriy/ssg.
---

# Site

This is a Markdown-first static site generated with \`@vyriy/ssg\`.

Edit content under \`site/*/README.md\`, then run:

\`\`\`bash
yarn build:ssg
\`\`\`
`,
    'site/consulting/README.md': `---
title: Consulting
description: A standalone page generated from Markdown.
published: true
---

# Consulting

This standalone page is optional, but it shows how \`@vyriy/ssg\` can generate
top-level content pages alongside indexed sections.
`,
    'site/docs/README.md': `---
title: Documentation
description: Documentation landing page for the generated static site.
published: true
tags:
  - docs
---

# Documentation

Add documentation entries under \`site/docs/<slug>/README.md\`.
`,
    'site/blog/hello-world/README.md': `---
title: Hello static site
description: First published blog entry for the generated SSG preset.
date: 2026-06-19
published: true
homePage: true
homePageOrder: 1
tags:
  - ssg
  - vyriy
---

# Hello static site

This starter blog entry proves that the generated site can build indexed content
sections from Markdown.
`,
    'site/examples/hello-world/README.md': `---
title: Hello example
description: First example entry for the generated SSG preset.
date: 2026-06-19
published: true
tags:
  - example
  - ssg
---

# Hello example

Examples live under \`site/examples/<slug>/README.md\`.
`,
    'site/public/.gitkeep': '',
});
