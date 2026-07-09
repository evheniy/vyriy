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
            'fix:prettier': 'prettier . --write',
            'fix:eslint': 'eslint . --fix',
            'fix:stylelint': 'stylelint "**/*.{css,scss}" --fix',
            'lint:ts': 'tsc',
            'lint:prettier': 'prettier . --check',
            'lint:eslint': 'eslint .',
            'lint:stylelint': 'stylelint "**/*.{css,scss}"',
            'build:ssg': 'rimraf dist && sh workspaces/ssg/bin/build.sh',
            'build:storybook': 'cross-env STORYBOOK_DISABLE_TELEMETRY=1 storybook build --quiet --disable-telemetry',
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
            tsx: packageJson.peerDependencies.tsx,
            'webpack-cli': packageJson.peerDependencies['webpack-cli'],
            '@vyriy/stylelint-config': `^${packageJson.version}`,
            stylelint: packageJson.peerDependencies.stylelint,
            sass: packageJson.peerDependencies.sass,
            '@vyriy/ssg': `^${packageJson.version}`,
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
    'packages/components/styles.scss': `:root {
  --color-bg: #ffffff;
  --color-text: #28323c;
  --color-heading: #3d5165;
  --color-link: #365f8c;
  --color-border: #dbe1e5;
  --font-sans: system-ui, -apple-system, blinkmacsystemfont, 'Segoe UI', sans-serif;
}

body {
  background: var(--color-bg);
  color: var(--color-text);
  font-family: var(--font-sans);
}

a {
  color: var(--color-link);
}
`,
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
