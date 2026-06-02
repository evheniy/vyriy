import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import packageJson from '../package.json' with { type: 'json' };
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
            'lint:ts': 'tsc',
            'lint:prettier': 'prettier . --check',
            'lint:eslint': 'eslint .',
            'lint:stylelint': 'stylelint "**/*.{css,scss}"',
            'build:storybook': 'cross-env STORYBOOK_DISABLE_TELEMETRY=1 storybook build --quiet --disable-telemetry',
            'test:jest': 'jest',
            postinstall: 'husky',
            'start:spa': 'sh workspaces/spa/bin/start.sh',
            'build:spa': 'rimraf dist && sh workspaces/spa/bin/build.sh',
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
        },
    }, null, 2) + '\n',
    'README.md': `# ${options.name}\n\n${options.description}\n`,
    'doc.mdx': `import { Meta, Markdown } from '@storybook/addon-docs/blocks';
import ReadMe from './README.md?raw';

<Meta title="${options.name}" />

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
    '.storybook/main.ts': `import config from '@vyriy/storybook-config';
import { path } from '@vyriy/path';

export default {
  ...config,
  stories: [
    path('**/*.mdx'),
    path('**/*.stories.@(js|jsx|mjs|ts|tsx)'),
  ],
};
`,
    '.storybook/preview.tsx': "export { default } from '@vyriy/storybook-config/preview';\n",
    'yarn.lock': '',
    'tsconfig.json': JSON.stringify({
        extends: '@vyriy/typescript-config/index.json',
        include: [
            '.storybook/**/*.ts',
            '.storybook/**/*.tsx',
            'packages/**/*.ts',
            'packages/**/*.tsx',
            'workspaces/**/*.ts',
            'workspaces/**/*.tsx',
            '*.ts',
        ],
    }, null, 2) + '\n',
    'prettier.config.ts': "export { default } from '@vyriy/prettier-config';\n",
    '.prettierignore': 'node_modules\ndist\ncoverage\nstorybook-static\nconsumer\n',
    'eslint.config.ts': "export { default } from '@vyriy/eslint-config';\n",
    'jest.config.ts': "export { default } from '@vyriy/jest-config';\n",
    'stylelint.config.ts': "export { default } from '@vyriy/stylelint-config';\n",
    'assets.d.ts': "declare module '*.scss';\n",
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
    'workspaces/spa/README.md': `# ${options.name} SPA\n\n${options.description}\n`,
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
    'workspaces/spa/index.tsx': `import { createRoot } from 'react-dom/client';

import { Page } from '@p/components';

import '@p/components/page/styles.scss';

createRoot(document.getElementById('root')!).render(<Page content="Test content" />);
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
