import packageJson from '../../../package.json' with { type: 'json' };
import { base } from './base.js';
import { assetsDeclarationFile, baseToolingDeps, buildPackageJson, reactComponentFiles, reactDeps, reactServiceFiles, reactWorkspaceScripts, stylelintConfigFile, stylelintDeps, webpackDeps, } from './shared.js';
export const ssg = (options) => ({
    ...base(options),
    ...stylelintConfigFile(),
    ...assetsDeclarationFile(),
    ...reactComponentFiles(),
    ...reactServiceFiles(),
    'package.json': buildPackageJson(options, [
        'packages/*',
        'workspaces/*',
    ], reactWorkspaceScripts('ssg'), {
        ...baseToolingDeps(),
        ...webpackDeps(),
        '@vyriy/script': `^${packageJson.version}`,
        ...reactDeps(),
        ...stylelintDeps(),
        '@vyriy/cn': `^${packageJson.version}`,
        '@vyriy/html': `^${packageJson.version}`,
        sass: packageJson.peerDependencies.sass,
    }),
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
