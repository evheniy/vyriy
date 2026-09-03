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
export const spa = (options) => ({
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
            start: "run-p 'start:*'",
            lint: "run-s 'lint:*'",
            build: "run-s 'build:*'",
            test: "run-s 'test:*'",
            'fix:prettier': 'prettier . --write',
            'fix:eslint': 'eslint . --fix',
            'fix:stylelint': 'stylelint "**/*.{css,scss}" --fix',
            'start:spa': 'sh workspaces/spa/bin/start.sh',
            'lint:ts': 'tsc',
            'lint:prettier': 'prettier . --check',
            'lint:eslint': 'eslint .',
            'lint:stylelint': 'stylelint "**/*.{css,scss}"',
            'build:spa': 'rimraf dist && sh workspaces/spa/bin/build.sh',
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
            react: packageJson.peerDependencies.react,
            'react-dom': packageJson.peerDependencies['react-dom'],
            '@types/react': packageJson.peerDependencies['@types/react'],
            '@types/react-dom': packageJson.peerDependencies['@types/react-dom'],
            '@vyriy/stylelint-config': `^${packageJson.version}`,
            stylelint: packageJson.peerDependencies.stylelint,
            '@vyriy/cn': `^${packageJson.version}`,
            '@vyriy/html': `^${packageJson.version}`,
            '@vyriy/browserslist-config': `^${packageJson.version}`,
            '@vyriy/render': `^${packageJson.version}`,
        },
    }, null, 2) + '\n',
    'README.md': `# SPA

Calm cloud-ready application built as a Yarn workspace monorepo.

## Workspaces

### \`@w/spa\`

Client-side React application in \`workspaces/spa\`.

- Entry point: \`workspaces/spa/index.tsx\`
- Webpack config: \`workspaces/spa/webpack.config.ts\`
- Production output: \`dist/spa/index.js\`
- Documentation: \`workspaces/spa/README.md\`

### \`@p/components\`

Shared React component package in \`packages/components\`.

- Public entry point: \`packages/components/index.ts\`
- Current public exports: \`Page\`, \`PageProps\`, \`PageType\`
- Documentation: \`packages/components/README.md\`

## Requirements

- Node.js \`>=24.0.0\`
- Yarn \`4.16.0\`

## Development

Start the SPA development server:

\`\`\`bash
yarn start:spa
\`\`\`

Start Storybook:

\`\`\`bash
yarn storybook
\`\`\`

Run all start scripts:

\`\`\`bash
yarn start
\`\`\`

## Build

Build the SPA:

\`\`\`bash
yarn build:spa
\`\`\`

Build Storybook:

\`\`\`bash
yarn build:storybook
\`\`\`

Run all build scripts:

\`\`\`bash
yarn build
\`\`\`

## Validation

Run the full project check:

\`\`\`bash
yarn check
\`\`\`

Run individual validation steps:

\`\`\`bash
yarn lint
yarn test
\`\`\`

Run focused Jest checks:

\`\`\`bash
yarn jest packages/components --runInBand --coverage=false
yarn jest workspaces/spa --runInBand --coverage=false
\`\`\`

## Formatting And Fixes

Apply configured format, ESLint, and Stylelint fixes:

\`\`\`bash
yarn fix
\`\`\`

## Project Guidance

These articles describe the development approach behind this preset and provide practical guidance for evolving a project on top of it:

- [Calm Development Environment: Node.js, Corepack, Yarn and Static Preview](https://vyriy.dev/blog/calm-development-setup/) - how to keep the local development environment predictable and easy to reproduce.
- [Calm App Structure for the Vyriy Ecosystem](https://vyriy.dev/blog/vyriy-calm-app-structure/) - a practical project structure for Vyriy applications: shared configs, small packages, thin workspaces, Storybook docs, tests, and deployable entry points.
- [Storybook as Project Documentation](https://vyriy.dev/blog/storybook-as-project-documentation/) - how to use Storybook as living project documentation and a component playground.
`,
    'doc.mdx': `import { Meta, Markdown } from '@storybook/addon-docs/blocks';
import ReadMe from './README.md?raw';

<Meta title="SPA" />

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
    '.yarnrc.yml': 'nodeLinker: node-modules\nnpmMinimalAgeGate: 5\n',
    '.husky/commit-msg': '#!/bin/sh\n',
    '.husky/post-checkout': '#!/bin/sh\n\nyarn\n',
    '.husky/post-merge': '#!/bin/sh\n\nyarn\n',
    '.husky/pre-commit': '#!/bin/sh\n\nyarn check\n',
    '.husky/pre-push': '#!/bin/sh\n\nyarn check\n',
    'yarn.lock': '',
    ...styleToolingFiles,
    '.prettierignore': 'node_modules\ndist\ncoverage\nstorybook-static\nconsumer\n',
    'assets.d.ts': "declare module '*.scss';\n",
    'packages/components/doc.mdx': `import { Meta, Markdown } from '@storybook/addon-docs/blocks';
import ReadMe from './README.md?raw';

<Meta title="Packages/Components" />

<Markdown>{ReadMe}</Markdown>
`,
    'packages/components/README.md': `# Components

Shared React components for the SPA workspace.

## Exports

### \`Page\`

SSR-friendly page wrapper that renders string content inside the page content container.

\`\`\`tsx
import { Page } from '@p/components';

export const Example = () => <Page content="Page body" />;
\`\`\`

Rendered markup:

\`\`\`html
<div class="content">Page body</div>
\`\`\`

### \`PageProps\`

Props accepted by \`Page\`.

\`\`\`ts
type PageProps = {
  content: string;
};
\`\`\`

### \`PageType\`

React component type for \`Page\`.

\`\`\`ts
type PageType = FC<PageProps>;
\`\`\`

## Validation

Run the package tests from the repository root:

\`\`\`bash
yarn jest packages/components --runInBand --coverage=false
\`\`\`

Run the full project check when changing public behavior:

\`\`\`bash
yarn check
\`\`\`
`,
    'packages/components/package.json': JSON.stringify({
        name: '@p/components',
        private: true,
        type: 'module',
    }, null, 2) + '\n',
    'packages/components/index.ts': "export * from './page/index.js';\n",
    'packages/components/index.test.tsx': `import { describe, expect, it } from '@jest/globals';

import { Page } from './index.js';
import { Page as PageImplementation } from './page/index.js';

describe('packages/components/page', () => {
  it('re-exports the page component', () => {
    expect(Page).toBe(PageImplementation);
  });
});
`,
    'packages/components/page/index.ts': `export * from './page.js';
export type * from './types.js';
`,
    'packages/components/page/index.test.ts': `import { describe, expect, it } from '@jest/globals';

import { Page } from './index.js';
import { Page as PageImplementation } from './page.js';

describe('packages/components/page', () => {
  it('re-exports the page component', () => {
    expect(Page).toBe(PageImplementation);
  });
});
`,
    'packages/components/page/types.ts': `import { FC } from 'react';

export type PageProps = {
  content: string;
};

export type PageType = FC<PageProps>;
`,
    'packages/components/page/page.tsx': `import type { PageType } from './types.js';

export const Page: PageType = ({ content }) => <div className="content">{content}</div>;
`,
    'packages/components/page/styles.scss': `.content {
  display: block;
}
`,
    'packages/components/page/page.test.tsx': `import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from '@jest/globals';

import { Page } from './page.js';

describe('packages/components/page/page', () => {
  it('renders content inside the page content container', () => {
    expect(renderToStaticMarkup(<Page content="Page body" />)).toBe('<div class="content">Page body</div>');
  });
});
`,
    '.browserslistrc': `[development]
extends @vyriy/browserslist-config

[ssr]
extends @vyriy/browserslist-config

[production]
extends @vyriy/browserslist-config

[modern]
extends @vyriy/browserslist-config
`,
    'workspaces/spa/bin/build.sh': `#!/usr/bin/env sh

set -e

scriptdir="$PWD/workspaces/spa";

NODE_ENV=production npx webpack --config $scriptdir/webpack.config.ts
`,
    'workspaces/spa/bin/start.sh': `#!/usr/bin/env sh

set -e

scriptdir="$PWD/workspaces/spa";

npx webpack serve --open --config $scriptdir/webpack.config.ts
`,
    'workspaces/spa/doc.mdx': `import { Meta, Markdown } from '@storybook/addon-docs/blocks';
import ReadMe from './README.md?raw';

<Meta title="Workspaces/SPA" />

<Markdown>{ReadMe}</Markdown>
`,
    'workspaces/spa/README.md': `# SPA

Client-side React application workspace for the project.

## Entry Point

The application starts from \`index.tsx\`. It mounts into the \`#root\` element created by the workspace Webpack HTML plugin and renders the shared \`Page\` component from \`@p/components\`.

\`\`\`tsx
import { Page } from '@p/components';

import '@p/components/page/styles.scss';

element({
  root: document.getElementById('root'),
  component: <Page content="Test content" />,
});
\`\`\`

## Build Output

The Webpack configuration builds the SPA into:

\`\`\`text
dist/spa/index.js
\`\`\`

The generated HTML document uses:

\`\`\`html
<title>SPA</title>
<div id="root"></div>
\`\`\`

## Development

Start the local development server from the repository root:

\`\`\`bash
yarn start:spa
\`\`\`

Build the production bundle:

\`\`\`bash
yarn build:spa
\`\`\`

Run the focused workspace test:

\`\`\`bash
yarn jest workspaces/spa --runInBand --coverage=false
\`\`\`

Run the full project check when changing shared behavior or build configuration:

\`\`\`bash
yarn check
\`\`\`
`,
    'workspaces/spa/webpack.config.ts': `import { csr, html } from '@vyriy/webpack-config';
import { path } from '@vyriy/path';

export default csr(
  '@w/spa',
  {
    path: path('dist', 'spa'),
    filename: 'index.js',
  },
  (config) => {
    return {
      ...config,
      plugins: [
        ...(config.plugins ?? []),
        html({
          title: '<title>SPA</title>',
          body: '<div id="root"></div>',
        }),
      ],
    };
  },
);
`,
    'workspaces/spa/package.json': JSON.stringify({
        name: '@w/spa',
        type: 'module',
        private: true,
    }, null, 2) + '\n',
    'workspaces/spa/index.tsx': `import { element } from '@vyriy/render/element';

import { Page } from '@p/components';

import '@p/components/page/styles.scss';

element({
  root: document.getElementById('root'),
  component: <Page content="Test content" />,
});
`,
    'workspaces/spa/index.test.tsx': `import type { ReactElement, ReactNode } from 'react';
import { describe, expect, it, jest } from '@jest/globals';

const renderMock = jest.fn<(children: ReactNode) => void>();
const createRootMock = jest.fn<(container: Element | DocumentFragment) => { render: typeof renderMock }>(() => ({
  render: renderMock,
}));
const PageMock = jest.fn(({ content }: { content: string }) => <div>{content}</div>);

jest.mock('react-dom/client', () => ({
  createRoot: createRootMock,
}));

jest.mock('@p/components', () => ({
  Page: PageMock,
}));

describe('workspaces/spa/index.tsx', () => {
  it('mounts the page component into the root element', async () => {
    document.body.innerHTML = '<div id="root"></div>';
    const rootElement = document.getElementById('root');

    if (!rootElement) {
      throw new Error('Expected root element to exist.');
    }

    await import('./index.js');

    expect(createRootMock).toHaveBeenCalledTimes(1);
    expect(createRootMock.mock.calls[0]?.[0]).toBe(rootElement);
    expect(renderMock).toHaveBeenCalledTimes(1);

    const renderedElement = renderMock.mock.calls[0]?.[0] as ReactElement<{ content: string }>;

    expect(renderedElement.type).toBe(PageMock);
    expect(renderedElement.props.content).toBe('Test content');
  });
});
`,
});
