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
            'start:ssg': 'sh workspaces/ssg/bin/start.sh',
            'build:ssg': 'rimraf dist && sh workspaces/ssg/bin/build.sh',
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
            '@vyriy/script': `^${packageJson.version}`,
            react: packageJson.peerDependencies.react,
            'react-dom': packageJson.peerDependencies['react-dom'],
            '@types/react': packageJson.peerDependencies['@types/react'],
            '@types/react-dom': packageJson.peerDependencies['@types/react-dom'],
            '@vyriy/stylelint-config': `^${packageJson.version}`,
            stylelint: packageJson.peerDependencies.stylelint,
            '@vyriy/cn': `^${packageJson.version}`,
            '@vyriy/html': `^${packageJson.version}`,
            sass: packageJson.peerDependencies.sass,
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
    'packages/services/package.json': JSON.stringify({
        name: '@p/services',
        private: true,
        type: 'module',
    }, null, 2) + '\n',
    'packages/services/cms/index.ts': `export const cms = {
  getContent: async () => {
    // Placeholder for fetching content from a CMS
    return Promise.resolve({
      title: 'Sample Content',
      body: 'This is a sample content fetched from the CMS.',
    });
  },
};
`,
    'packages/services/cms/index.test.ts': `import { describe, expect, it } from '@jest/globals';

import { cms } from './index.js';

describe('packages/services/cms', () => {
  it('returns content for rendering a page', async () => {
    await expect(cms.getContent()).resolves.toEqual({
      title: 'Sample Content',
      body: 'This is a sample content fetched from the CMS.',
    });
  });
});
`,
    'workspaces/ssg/bin/build.sh': `#!/usr/bin/env sh

set -e

scriptdir="$PWD/workspaces/ssg";
distdir="$PWD/dist/ssg";

NODE_ENV=production npx webpack --config $scriptdir/webpack.config.ts

yarn exec sass packages/components/page/styles.scss "$distdir/styles.css" --no-source-map --style=compressed
cp $scriptdir/package.json "$distdir/package.json"
npm pkg delete "type" --prefix "$distdir"
npm pkg delete "private" --prefix "$distdir"
`,
    'workspaces/ssg/bin/start.sh': `#!/usr/bin/env sh

set -e

scriptdir="$PWD/workspaces/ssg";
distdir="$PWD/dist/ssg";

mkdir -p "$distdir"
yarn exec sass packages/components/page/styles.scss "$distdir/styles.css" --no-source-map

PROJECT_CWD="$distdir" NODE_ENV=production LOG_LEVEL=info "$PWD/node_modules/.bin/tsx" $scriptdir/index.tsx
`,
    'workspaces/ssg/doc.mdx': `import { Meta, Markdown } from '@storybook/addon-docs/blocks';
import ReadMe from './README.md?raw';

<Meta title="Workspaces/SSG" />

<Markdown>{ReadMe}</Markdown>
`,
    'workspaces/ssg/README.md': `# ${options.name} SSG\n\n${options.description}\n`,
    'workspaces/ssg/webpack.config.ts': `import { path } from '@vyriy/path';
import { ssr, external } from '@vyriy/webpack-config';

export default ssr(
  '@w/ssg',
  {
    path: path('dist', 'ssg'),
    filename: 'index.js',
    library: { type: 'commonjs2' },
  },
  (config) => ({
    ...config,
    externals: [external({ allowlist: [/^@p/, /^@w/, /^@vyriy/] })],
  }),
);
`,
    'workspaces/ssg/package.json': JSON.stringify({
        name: '@w/ssg',
        type: 'module',
        private: true,
    }, null, 2) + '\n',
    'workspaces/ssg/index.tsx': `import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { renderToString } from 'react-dom/server';

import { script } from '@vyriy/script';
import { html, minify } from '@vyriy/html';
import { path } from '@vyriy/path';

import { cms } from '@p/services/cms';
import { Page } from '@p/components';

const dashboardStyles = readFileSync(path('styles.css'), 'utf8');
const staticPath = path('static');

void script(async () => {
  const content = await cms.getContent();

  mkdirSync(staticPath, { recursive: true });

  writeFileSync(
    path(staticPath, 'index.html'),
    minify(
      html({
        htmlAttributes: 'lang="en"',
        title: \`<title>\${content.title}</title>\`,
        meta: '<meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" />',
        style: \`<style>\${dashboardStyles.trim()}</style>\`,
        body: renderToString(<Page content={content.body} />),
      }),
    ),
  );
});
`,
    'workspaces/ssg/index.test.tsx': `import { describe, expect, it, jest } from '@jest/globals';

const getContentMock = jest.fn(() =>
  Promise.resolve({
    title: 'Sample Content',
    body: 'This is a sample content fetched from the CMS.',
  }),
);
let scriptPromise: Promise<void> | undefined;
const scriptMock = jest.fn((handler: () => Promise<void>) => {
  scriptPromise = handler();

  return scriptPromise;
});
const nodeFs = jest.requireActual<typeof import('node:fs')>('node:fs');
const mkdirSyncMock = jest.fn();
const readFileSyncMock = jest.fn<(path: string | URL, encoding: 'utf8') => string>(
  () => '.content { display: block; }',
);
const writeFileSyncMock = jest.fn();

jest.mock('node:fs', () => ({
  ...nodeFs,
  mkdirSync: mkdirSyncMock,
  readFileSync: readFileSyncMock,
  writeFileSync: writeFileSyncMock,
}));

jest.mock('@vyriy/script', () => ({
  script: scriptMock,
}));

jest.mock('@p/services/cms', () => ({
  cms: {
    getContent: getContentMock,
  },
}));

describe('workspaces/ssg/index.tsx', () => {
  it('generates a static index HTML file', async () => {
    await import('./index.js');
    await scriptPromise;

    expect(scriptMock).toHaveBeenCalledTimes(1);
    expect(readFileSyncMock).toHaveBeenCalledWith(expect.stringContaining('styles.css'), 'utf8');
    expect(getContentMock).toHaveBeenCalledTimes(1);
    expect(mkdirSyncMock).toHaveBeenCalledWith(expect.stringContaining('static'), {
      recursive: true,
    });
    expect(writeFileSyncMock).toHaveBeenCalledWith(
      expect.stringContaining('static/index.html'),
      expect.stringContaining('<title>Sample Content</title>'),
    );

    const generatedHtml = writeFileSyncMock.mock.calls[0]?.[1] as string;

    expect(generatedHtml).toContain('<style>.content { display: block; }</style>');
    expect(generatedHtml).toContain('This is a sample content fetched from the CMS.');
  });
});
`,
});
