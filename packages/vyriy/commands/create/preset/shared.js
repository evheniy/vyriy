import packageJson from '../../../package.json' with { type: 'json' };
export const baseToolingDeps = () => ({
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
});
export const webpackDeps = () => ({
    rimraf: packageJson.peerDependencies.rimraf,
    '@vyriy/webpack-config': `^${packageJson.version}`,
    tsx: packageJson.peerDependencies.tsx,
    'webpack-cli': packageJson.peerDependencies['webpack-cli'],
});
export const reactDeps = () => ({
    react: packageJson.peerDependencies.react,
    'react-dom': packageJson.peerDependencies['react-dom'],
    '@types/react': packageJson.peerDependencies['@types/react'],
    '@types/react-dom': packageJson.peerDependencies['@types/react-dom'],
});
export const stylelintDeps = () => ({
    '@vyriy/stylelint-config': `^${packageJson.version}`,
    stylelint: packageJson.peerDependencies.stylelint,
});
export const serverDeps = () => ({
    '@vyriy/handler': `^${packageJson.version}`,
    '@vyriy/server': `^${packageJson.version}`,
});
export const buildPackageJson = (options, workspaces, scripts, dependencies) => JSON.stringify({
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
    workspaces,
    scripts,
    dependencies,
}, null, 2) + '\n';
export const reactWorkspaceBaseScripts = () => ({
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
});
export const workspaceBaseScripts = () => ({
    storybook: 'cross-env STORYBOOK_DISABLE_TELEMETRY=1 storybook dev -p 6006 --disable-telemetry',
    check: 'run-s lint build test',
    fix: "run-s 'fix:*'",
    start: "run-p 'start:*'",
    lint: "run-s 'lint:*'",
    build: "run-s 'build:*'",
    test: "run-s 'test:*'",
    'fix:prettier': 'prettier . --write',
    'fix:eslint': 'eslint . --fix',
    'lint:ts': 'tsc',
    'lint:prettier': 'prettier . --check',
    'lint:eslint': 'eslint .',
    'build:storybook': 'cross-env STORYBOOK_DISABLE_TELEMETRY=1 storybook build --quiet --disable-telemetry',
    'test:jest': 'jest',
    postinstall: 'husky',
});
export const reactWorkspaceScripts = (workspaceName) => ({
    ...reactWorkspaceBaseScripts(),
    [`start:${workspaceName}`]: `sh workspaces/${workspaceName}/bin/start.sh`,
    [`build:${workspaceName}`]: `rimraf dist && sh workspaces/${workspaceName}/bin/build.sh`,
});
export const workspaceScripts = (workspaceName) => ({
    ...workspaceBaseScripts(),
    [`start:${workspaceName}`]: `sh workspaces/${workspaceName}/bin/start.sh`,
    [`build:${workspaceName}`]: `rimraf dist && sh workspaces/${workspaceName}/bin/build.sh`,
});
export const stylelintConfigFile = () => ({
    'stylelint.config.ts': "export { default } from '@vyriy/stylelint-config';\n",
});
export const assetsDeclarationFile = () => ({
    'assets.d.ts': "declare module '*.scss';\n",
});
export const reactComponentFiles = () => ({
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
});
export const reactServiceFiles = () => ({
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
});
export const apiWorkspaceBaseFiles = (name, description) => ({
    'workspaces/api/bin/build.sh': `#!/usr/bin/env sh

set -e

scriptdir="$PWD/workspaces/api";

NODE_ENV=production npx webpack --config $scriptdir/webpack.config.ts

cp $scriptdir/package.json dist/api/package.json
npm pkg delete "type" --prefix dist/api
npm pkg delete "private" --prefix dist/api
`,
    'workspaces/api/bin/start.sh': `#!/usr/bin/env sh

set -e

scriptdir="$PWD/workspaces/api";

NODE_ENV=production LOG_LEVEL=info tsx $scriptdir/index.ts
`,
    'workspaces/api/doc.mdx': `import { Meta, Markdown } from '@storybook/addon-docs/blocks';
import ReadMe from './README.md?raw';

<Meta title="Workspaces/API" />

<Markdown>{ReadMe}</Markdown>
`,
    'workspaces/api/README.md': `# ${name} API\n\n${description}\n`,
    'workspaces/api/webpack.config.ts': `import { path } from '@vyriy/path';
import { ssr, external } from '@vyriy/webpack-config';

export default ssr(
  '@w/api',
  {
    path: path('dist', 'api'),
    filename: 'index.js',
    library: { type: 'commonjs2' },
  },
  (config) => ({
    ...config,
    externals: [external({ allowlist: [/^@p/, /^@w/, /^@vyriy/] })],
  }),
);
`,
    'workspaces/api/package.json': JSON.stringify({
        name: '@w/api',
        type: 'module',
        private: true,
    }, null, 2) + '\n',
});
