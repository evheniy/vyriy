import packageJson from '../../../package.json' with { type: 'json' };
import { base } from './base.js';
import { assetsDeclarationFile, baseToolingDeps, buildPackageJson, reactComponentFiles, reactDeps, reactWorkspaceScripts, stylelintConfigFile, stylelintDeps, webpackDeps, } from './shared.js';
export const spa = (options) => ({
    ...base(options),
    ...stylelintConfigFile(),
    ...assetsDeclarationFile(),
    ...reactComponentFiles(),
    'package.json': buildPackageJson(options, [
        'packages/*',
        'workspaces/*',
    ], reactWorkspaceScripts('spa'), {
        ...baseToolingDeps(),
        ...webpackDeps(),
        ...reactDeps(),
        ...stylelintDeps(),
        '@vyriy/cn': `^${packageJson.version}`,
        '@vyriy/html': `^${packageJson.version}`,
        '@vyriy/browserslist-config': `^${packageJson.version}`,
    }),
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
