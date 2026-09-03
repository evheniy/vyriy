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
const rawProjectFiles = {
    '.browserslistrc': '[development]\nextends @vyriy/browserslist-config\n\n[ssr]\nextends @vyriy/browserslist-config\n\n[production]\nextends @vyriy/browserslist-config\n\n[modern]\nextends @vyriy/browserslist-config\n',
    'packages/env/doc.mdx': "import { Meta, Markdown } from '@storybook/addon-docs/blocks';\nimport ReadMe from './README.md?raw';\n\n<Meta title=\"Packages/Env\" />\n\n<Markdown>{ReadMe}</Markdown>\n",
    'packages/env/index.ts': "export * from './env.js';\n",
    'packages/env/package.json': '{\n  "name": "@p/env",\n  "type": "module",\n  "private": true\n}\n',
    'packages/env/env.test.ts': "import { afterEach, describe, expect, it } from '@jest/globals';\n\nimport { getApi, getCdn, getUi } from './env.js';\n\ndescribe('env getters', () => {\n  afterEach(() => {\n    delete process.env.API;\n    delete process.env.CDN;\n    delete process.env.UI;\n  });\n\n  it('reads required environment values', () => {\n    process.env.API = 'http://localhost:3000';\n    process.env.CDN = 'http://localhost:3001';\n    process.env.UI = 'http://localhost:3002';\n\n    expect(getApi()).toBe('http://localhost:3000');\n    expect(getCdn()).toBe('http://localhost:3001');\n    expect(getUi()).toBe('http://localhost:3002');\n  });\n\n  it('throws when a required environment value is missing', () => {\n    expect(() => getUi()).toThrow('Environment variable UI is not defined!');\n  });\n});\n",
    'packages/env/env.ts': "import { getEnv } from '@vyriy/env';\n\n/** Reads the API origin used for server endpoints. */\nexport const getApi = () => getEnv('API');\n\n/** Reads the CDN origin used for static assets. */\nexport const getCdn = () => getEnv('CDN');\n\n/** Reads the UI origin used for browser assets. */\nexport const getUi = () => getEnv('UI');\n",
    'packages/env/index.test.ts': "import { afterEach, describe, expect, it } from '@jest/globals';\n\nimport * as publicApi from './index.js';\n\nconst ENV_NAMES = [\n  'API',\n  'CDN',\n  'UI',\n] as const;\n\nconst clearEnv = () => {\n  for (const name of ENV_NAMES) {\n    delete process.env[name];\n  }\n};\n\ndescribe('env public API', () => {\n  afterEach(() => {\n    clearEnv();\n  });\n\n  it('exports env getters', () => {\n    expect(publicApi.getApi).toBeDefined();\n    expect(publicApi.getCdn).toBeDefined();\n    expect(publicApi.getUi).toBeDefined();\n  });\n\n  it('reads environment variables by public getter name', () => {\n    process.env.API = 'http://localhost:3000';\n    process.env.CDN = 'http://localhost:3001';\n    process.env.UI = 'http://localhost:3002';\n\n    expect(publicApi.getApi()).toBe('http://localhost:3000');\n    expect(publicApi.getCdn()).toBe('http://localhost:3001');\n    expect(publicApi.getUi()).toBe('http://localhost:3002');\n  });\n\n  it('throws when a required environment variable is missing', () => {\n    clearEnv();\n\n    expect(() => publicApi.getApi()).toThrow('Environment variable API is not defined!');\n  });\n});\n",
    'packages/env/README.md': `# Env

Required environment readers shared by the API and UI workspaces.

## Exports

- \`getApi()\` reads \`API\`.
- \`getCdn()\` reads \`CDN\`.
- \`getUi()\` reads \`UI\`.

Each getter throws when its environment variable is missing.

## Usage

\`\`\`ts
import { getApi, getCdn, getUi } from '@p/env';

const apiOrigin = getApi();
const cdnOrigin = getCdn();
const uiOrigin = getUi();
\`\`\`

## Local Defaults

Workspace scripts source \`workspaces/env.sh\`, which provides local defaults:

- \`API_PORT=3000\`
- \`CDN_PORT=3001\`
- \`UI_PORT=3002\`
- \`API=http://localhost:$API_PORT\`
- \`CDN=http://localhost:$CDN_PORT\`
- \`UI=http://localhost:$UI_PORT\`

Override these variables before running a workspace script when a different origin or port is needed.

## Notes

- The package is private to this repository.
- The public entry point re-exports from \`env.ts\`.
- The getters are thin wrappers around \`@vyriy/env\` and keep environment access explicit at call sites.
`,
    'workspaces/api/bin/build.sh': '#!/usr/bin/env sh\n\nset -e\n\nscriptdir="$PWD/workspaces/api";\n\n. "$PWD/workspaces/env.sh"\n\nNODE_ENV=production \\\nnpx webpack --config $scriptdir/webpack.config.ts\n\ncp $scriptdir/package.json dist/api/package.json\nnpm pkg delete "type" --prefix dist/api\nnpm pkg delete "private" --prefix dist/api\n',
    'workspaces/api/bin/start.sh': `#!/usr/bin/env sh

set -e

scriptdir="$PWD/workspaces/api";

. "$PWD/workspaces/env.sh"

echo "Demo:\n$API/\n"
echo "Prerender:\n$API/prerender?name=Developer&title=Senior%20IT%20Professional&avatarUrl=http://localhost:3001/avatar.svg\n"
echo "Semantic:\n$API/semantic?name=Developer&title=Senior%20IT%20Professional&avatarUrl=http://localhost:3001/avatar.svg\n"
echo "Manifest:\n$API/manifest.yml\n"

NODE_ENV=production \
LOG_LEVEL=info \
PORT=$API_PORT \
tsx watch $scriptdir/index.tsx
`,
    'workspaces/api/doc.mdx': "import { Meta, Markdown } from '@storybook/addon-docs/blocks';\nimport ReadMe from './README.md?raw';\n\n<Meta title=\"Workspaces/API\" />\n\n<Markdown>{ReadMe}</Markdown>\n",
    'workspaces/api/package.json': '{\n  "name": "@w/api",\n  "type": "module",\n  "private": true\n}\n',
    'workspaces/api/README.md': `# API

Server-rendered demo workspace for the profile-card application.

## Behavior

The API starts an \`@vyriy/server\` handler and serves the root route:

- \`GET /\` returns an HTML document with a server-rendered \`ProfileCard\`.
- Unknown routes return the router \`404\` response.

The HTML includes:

- \`http://localhost:3002/main.css\` by default
- \`http://localhost:3002/index.js\` by default
- the demo avatar at \`http://localhost:3001/avatar.svg\`

The UI origin is read through \`getUi()\` from \`@p/env\`.

## Local Development

From the repository root:

\`\`\`bash
yarn start:api
\`\`\`

The script sources \`workspaces/env.sh\` and starts \`workspaces/api/index.tsx\` with \`tsx watch\`.

Default local values:

- \`API_PORT=3000\`
- \`API=http://localhost:3000\`
- \`UI=http://localhost:3002\`

Run the static and UI workspaces alongside the API when loading the full page:

\`\`\`bash
yarn start
\`\`\`

## Build

\`\`\`bash
yarn build:api
\`\`\`

The build emits the server bundle to \`dist/api/index.js\` and copies the workspace \`package.json\` into \`dist/api\`.

## Validation

\`\`\`bash
yarn test:jest workspaces/api
\`\`\`

The tests verify server registration, the rendered root response, response headers, linked UI assets, and the \`404\` path.
`,
    'workspaces/api/index.test.tsx': "import { describe, expect, it, jest } from '@jest/globals';\nimport type { APIGatewayProxyEvent } from '@vyriy/router';\n\nconst apiMock = jest.fn((handler) => ({ handler }));\nconst serverMock = jest.fn();\n\njest.mock('@vyriy/handler', () => ({\n  api: apiMock,\n}));\n\njest.mock('@vyriy/server', () => ({\n  server: serverMock,\n}));\n\njest.mock('@p/env', () => ({\n  getUi: () => 'http://localhost:3002',\n}));\n\ndescribe('workspaces/api/index.tsx', () => {\n  type ApiHandler = (event: APIGatewayProxyEvent) => Promise<{\n    body: string;\n    headers?: Record<string, string>;\n    statusCode: number;\n  }>;\n\n  const getEvent = (path: string): APIGatewayProxyEvent =>\n    ({\n      body: null,\n      headers: {},\n      httpMethod: 'GET',\n      path,\n      pathParameters: null,\n      queryStringParameters: null,\n    }) as APIGatewayProxyEvent;\n\n  const loadHandler = async (): Promise<ApiHandler> => {\n    await jest.isolateModulesAsync(async () => {\n      await import('./index.js');\n    });\n\n    expect(apiMock).toHaveBeenCalledTimes(1);\n    expect(serverMock).toHaveBeenCalledTimes(1);\n    expect(serverMock).toHaveBeenCalledWith(apiMock.mock.results[0]?.value);\n\n    return apiMock.mock.calls[0]?.[0] as ApiHandler;\n  };\n\n  it('starts the server with the API handler', async () => {\n    await loadHandler();\n\n    expect(apiMock).toHaveBeenCalledTimes(1);\n  });\n\n  it('renders the demo page for the root route', async () => {\n    const handler = await loadHandler();\n    const response = await handler(getEvent('/'));\n\n    expect(response).toEqual({\n      body: expect.any(String),\n      headers: {\n        'access-control-allow-origin': '*',\n        'cache-control': 'public, max-age=300, s-maxage=3600, stale-while-revalidate=86400',\n        'content-type': 'text/html; charset=utf-8',\n        'x-content-type-options': 'nosniff',\n      },\n      isBase64Encoded: undefined,\n      multiValueHeaders: undefined,\n      statusCode: 200,\n    });\n    expect(response.body).toContain('<title>Demo</title>');\n    expect(response.body).toContain('href=\"http://localhost:3002/main.css\"');\n    expect(response.body).toContain('<div id=\"root\" rendered>');\n    expect(response.body).toContain('Developer');\n    expect(response.body).toContain('Senior IT Professional');\n    expect(response.body).toContain('http://localhost:3001/avatar.svg');\n    expect(response.body).toContain('src=\"http://localhost:3002/index.js\"');\n  });\n\n  it('returns not found for unknown routes', async () => {\n    const handler = await loadHandler();\n\n    await expect(handler(getEvent('/missing'))).resolves.toEqual({\n      body: JSON.stringify({\n        message: 'Not Found',\n      }),\n      statusCode: 404,\n    });\n  });\n});\n",
    'workspaces/api/index.tsx': "import { server } from '@vyriy/server';\nimport { api } from '@vyriy/handler';\nimport { createRouter } from '@vyriy/router';\nimport { minify, html } from '@vyriy/html';\nimport { html as react } from '@vyriy/render';\n\nimport { ProfileCard } from '@p/components/profile-card';\nimport { getUi } from '@p/env';\n\nserver(\n  api(async (event) =>\n    createRouter()\n      .get('/', () => ({\n        body: minify(\n          html({\n            htmlAttributes: 'lang=\"en\"',\n            title: '<title>Demo</title>',\n            meta: '<meta charset=\"utf-8\" /><meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" />',\n            link: `<link rel=\"stylesheet\" type=\"text/css\" href=\"${getUi()}/main.css\" />`,\n            body: `<div id=\"root\" rendered>${react(\n              <ProfileCard\n                name=\"Developer\"\n                title=\"Senior IT Professional\"\n                avatarUrl=\"http://localhost:3001/avatar.svg\"\n              />,\n            )}</div>`,\n            script: `<script defer=\"defer\" src=\"${getUi()}/index.js\"></script>`,\n          }),\n        ),\n        headers: {\n          'content-type': 'text/html; charset=utf-8',\n          'cache-control': 'public, max-age=300, s-maxage=3600, stale-while-revalidate=86400',\n          'access-control-allow-origin': '*',\n          'x-content-type-options': 'nosniff',\n        },\n      }))\n      .route(event),\n  ),\n);\n",
    'workspaces/api/webpack.config.ts': "import { EnvironmentPlugin } from 'webpack';\nimport { path } from '@vyriy/path';\nimport { ssr, external } from '@vyriy/webpack-config';\n\nexport default ssr(\n  '@w/api',\n  {\n    path: path('dist', 'api'),\n    filename: 'index.js',\n    library: { type: 'commonjs2' },\n  },\n  (config) => ({\n    ...config,\n    externals: [external({ allowlist: [/^@p/, /^@w/, /^@vyriy/] })],\n    plugins: [\n      ...(config.plugins ?? []),\n      new EnvironmentPlugin([\n        'API',\n        'CDN',\n        'UI',\n      ]),\n    ],\n  }),\n);\n",
    'workspaces/env.sh': '#!/usr/bin/env sh\n\n: "${API_PORT:=3000}"\n: "${CDN_PORT:=3001}"\n: "${UI_PORT:=3002}"\n: "${API:=http://localhost:$API_PORT}"\n: "${CDN:=http://localhost:$CDN_PORT}"\n: "${UI:=http://localhost:$UI_PORT}"\n\nexport API_PORT\nexport CDN_PORT\nexport UI_PORT\nexport API\nexport CDN\nexport UI\n',
    'workspaces/static/bin/build.sh': '#!/usr/bin/env sh\n\nset -e\n\nscriptdir="$PWD/workspaces/static";\ndistdir="$PWD/dist/cdn";\n\ncp -R $scriptdir/public/* $distdir/\n',
    'workspaces/static/bin/start.sh': `#!/usr/bin/env sh

set -e

scriptdir="$PWD/workspaces/static";

. "$PWD/workspaces/env.sh"

npx vs -p $CDN_PORT $scriptdir/public
`,
    'workspaces/static/doc.mdx': "import { Meta, Markdown } from '@storybook/addon-docs/blocks';\nimport ReadMe from './README.md?raw';\n\n<Meta title=\"Workspaces/Static\" />\n\n<Markdown>{ReadMe}</Markdown>\n",
    'workspaces/static/package.json': '{\n  "name": "@w/static",\n  "type": "module",\n  "private": true\n}\n',
    'workspaces/static/public/avatar.svg': '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800">\r\n<rect width="1200" height="800" fill="#0057B7"/>\r\n<rect width="1200" height="400" y="400" fill="#FFD700"/>\r\n</svg>',
    'workspaces/static/README.md': `# Static

Static asset workspace for the profile-card UI. It is served with \`vs\`, the CLI provided by \`@vyriy/static\`.

## Assets

- \`avatar.svg\` is the default demo avatar.

## Local Development

From the repository root:

\`\`\`bash
yarn start:static
\`\`\`

The script sources \`workspaces/env.sh\` and runs:

\`\`\`bash
npx vs -p $CDN_PORT workspaces/static/public
\`\`\`

This serves every file in \`workspaces/static/public\` as a directly addressable static asset for the project.

Default local values:

- \`CDN_PORT=3001\`
- \`CDN=http://localhost:3001\`

The API and UI demo use the avatar at:

\`\`\`text
http://localhost:3001/avatar.svg
\`\`\`

## Global CLI

\`@vyriy/static\` can be installed globally when you want the \`vs\` command available without \`npx\` or project scripts:

\`\`\`bash
npm install --global @vyriy/static
vs -p 3001 workspaces/static/public
\`\`\`

Use the same command shape for any static directory:

\`\`\`bash
vs -p <port> <static-directory>
\`\`\`

## Build

\`\`\`bash
yarn build:static
\`\`\`

The build copies files from \`workspaces/static/public\` into \`dist/cdn\`.

## Notes

- Keep files in \`public\` directly addressable by URL.
- Add shared static demo assets here rather than coupling them to the API or UI workspace.
`,
    'workspaces/ui/bin/build.sh': '#!/usr/bin/env sh\n\nset -e\n\nscriptdir="$PWD/workspaces/ui";\n\n. "$PWD/workspaces/env.sh"\n\nNODE_ENV=production \\\nnpx webpack \\\n--config $scriptdir/webpack.config.ts\n',
    'workspaces/ui/bin/start.sh': '#!/usr/bin/env sh\n\nset -e\n\nscriptdir="$PWD/workspaces/ui";\n\n. "$PWD/workspaces/env.sh"\n\nnpx webpack serve \\\n--open \\\n--config $scriptdir/webpack.config.ts \\\n--port $UI_PORT\n',
    'workspaces/ui/doc.mdx': "import { Meta, Markdown } from '@storybook/addon-docs/blocks';\nimport ReadMe from './README.md?raw';\n\n<Meta title=\"Workspaces/UI\" />\n\n<Markdown>{ReadMe}</Markdown>\n",
    'workspaces/ui/package.json': '{\n  "name": "@w/ui",\n  "type": "module",\n  "private": true\n}\n',
    'workspaces/ui/README.md': `# UI

Client-rendered demo workspace for the profile-card application.

## Behavior

The UI entry point mounts a \`ProfileCard\` into \`#root\` with the same demo data used by the API-rendered page.

It imports shared component styles from:

\`\`\`ts
import '@p/components/styles.scss';
\`\`\`

## Local Development

From the repository root:

\`\`\`bash
yarn start:ui
\`\`\`

The script sources \`workspaces/env.sh\` and starts webpack dev server for \`workspaces/ui/index.tsx\`.

Default local values:

- \`UI_PORT=3002\`
- \`UI=http://localhost:3002\`
- \`CDN=http://localhost:3001\`

Run the full local application when the API, CDN assets, and UI bundle should all be available:

\`\`\`bash
yarn start
\`\`\`

## Build

\`\`\`bash
yarn build:ui
\`\`\`

The build emits the browser bundle and generated HTML into \`dist/cdn\`.

## Validation

\`\`\`bash
yarn test:jest workspaces/ui
\`\`\`

The tests verify that the entry point mounts into \`#root\` and renders the demo \`ProfileCard\` props.
`,
    'workspaces/ui/index.test.tsx': "import { describe, expect, it, jest } from '@jest/globals';\nimport { isValidElement } from 'react';\nimport type { ReactElement } from 'react';\n\nconst elementMock = jest.fn();\n\njest.mock('@vyriy/render/element', () => ({\n  element: elementMock,\n}));\n\ntype ProfileCardProps = {\n  avatarUrl: string;\n  name: string;\n  title: string;\n};\n\ndescribe('workspaces/ui/index.tsx', () => {\n  const loadEntry = async () => {\n    const root = document.createElement('div');\n    root.id = 'root';\n    document.body.replaceChildren();\n    document.body.append(root);\n\n    await jest.isolateModulesAsync(async () => {\n      await import('./index.js');\n    });\n\n    const [{ component }] = elementMock.mock.calls[0] as [{ component: ReactElement<ProfileCardProps> }];\n\n    return {\n      root,\n      component,\n    };\n  };\n\n  it('mounts the UI into the root element', async () => {\n    const { root, component } = await loadEntry();\n\n    expect(elementMock).toHaveBeenCalledTimes(1);\n    expect(elementMock).toHaveBeenCalledWith({\n      root,\n      component,\n    });\n  });\n\n  it('renders the profile card demo component', async () => {\n    const { component } = await loadEntry();\n\n    expect(isValidElement(component)).toBe(true);\n    expect(typeof component.type).toBe('function');\n    expect((component.type as { name?: string }).name).toBe('ProfileCard');\n    expect(component.props).toEqual({\n      avatarUrl: 'http://localhost:3001/avatar.svg',\n      name: 'Developer',\n      title: 'Senior IT Professional',\n    });\n  });\n});\n",
    'workspaces/ui/index.tsx': "import { element } from '@vyriy/render/element';\n\nimport { ProfileCard } from '@p/components/profile-card';\nimport '@p/components/styles.scss';\n\nelement({\n  root: document.getElementById('root'),\n  component: (\n    <ProfileCard name=\"Developer\" title=\"Senior IT Professional\" avatarUrl=\"http://localhost:3001/avatar.svg\" />\n  ),\n});\n",
    'workspaces/ui/webpack.config.ts': "import { EnvironmentPlugin } from 'webpack';\n\nimport { csr, html } from '@vyriy/webpack-config';\nimport { path } from '@vyriy/path';\n\nexport default csr(\n  '@w/ui',\n  {\n    path: path('dist', 'cdn'),\n    filename: 'index.js',\n  },\n  (config) => ({\n    ...config,\n    plugins: [\n      ...(config.plugins ?? []),\n      new EnvironmentPlugin(['API', 'CDN', 'UI']),\n      html({\n        htmlAttributes: 'lang=\"en\"',\n        title: '<title>Demo</title>',\n        meta: '<meta charset=\"utf-8\" /><meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" />',\n        body: '<div id=\"root\"></div>',\n      }),\n    ],\n  }),\n);\n",
};
const projectFiles = {
    ...rawProjectFiles,
    'workspaces/api/index.tsx': String(rawProjectFiles['workspaces/api/index.tsx'])
        .replace("import { getUi } from '@p/env';\n\nserver(", "import { getUi } from '@p/env';\n\ntype RouterEvent = Parameters<ReturnType<typeof createRouter>['route']>[0];\n\nserver(")
        .replace('api(async (event) =>', 'api(async (event: RouterEvent) =>'),
};
export const fullstack = (options) => ({
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
    'packages/components/avatar/avatar.stories.tsx': "import type { Meta, StoryObj } from '@storybook/react-webpack5';\n\nimport { Avatar } from './avatar.js';\nimport avatar from '../../../workspaces/static/public/avatar.svg';\n\nconst meta = {\n  title: 'Components/Avatar',\n  component: Avatar,\n  parameters: { docs: { page: null } },\n  args: { name: 'Ada Lovelace', size: 'md' },\n} satisfies Meta<typeof Avatar>;\n\nexport default meta;\n\ntype Story = StoryObj<typeof meta>;\n\nexport const Default: Story = {};\n\nexport const Image: Story = {\n  args: {\n    src: avatar,\n    alt: 'Profile portrait',\n  },\n};\n\nexport const Large: Story = { args: { size: 'lg' } };\n",
    'packages/components/avatar/avatar.test.tsx': "import { describe, it, expect } from '@jest/globals';\nimport { render, screen } from '@testing-library/react';\n\nimport { Avatar } from './avatar.js';\n\ndescribe('Avatar', () => {\n  it('renders an image when src exists', () => {\n    render(<Avatar src=\"/avatar.png\" name=\"Ada Lovelace\" />);\n\n    expect(screen.getByRole('img', { name: 'Ada Lovelace' })).toBeDefined();\n  });\n\n  it('uses a generic image alt when name and alt are not provided', () => {\n    render(<Avatar src=\"/avatar.png\" />);\n\n    expect(screen.getByRole('img', { name: 'Profile avatar' })).toBeDefined();\n  });\n\n  it('renders initials fallback without exposing decorative text', () => {\n    render(<Avatar name=\"Ada Lovelace\" data-testid=\"avatar-root\" />);\n\n    expect(screen.getByText('AL')).toBeDefined();\n    expect(screen.getByText('AL').getAttribute('aria-hidden')).toBe('true');\n    expect(screen.getByTestId('avatar-root')).toBeDefined();\n  });\n\n  it('renders a stable fallback when name is not provided', () => {\n    render(<Avatar />);\n\n    expect(screen.getByText('?')).toBeDefined();\n  });\n\n  it('renders a stable fallback when name has no initials', () => {\n    render(<Avatar name=\"   \" />);\n\n    expect(screen.getByText('?')).toBeDefined();\n  });\n});\n",
    'packages/components/avatar/avatar.tsx': "import { cn } from '@vyriy/cn';\n\nimport type { AvatarType } from './types.js';\n\nconst getInitials = (name?: string) => {\n  if (!name) {\n    return '?';\n  }\n\n  const initials = name\n    .trim()\n    .split(/\\s+/)\n    .filter(Boolean)\n    .slice(0, 2)\n    .map((part) => part[0]?.toUpperCase())\n    .join('');\n\n  return initials || '?';\n};\n\n/** Renders either a profile image or deterministic initials fallback. */\nexport const Avatar: AvatarType = ({ src, alt, name, size = 'md', className, ...props }) => {\n  return (\n    <div className={cn('avatar', `avatar--${size}`, className)} {...props}>\n      {src ? (\n        <img className=\"avatar__image\" alt={alt ?? name ?? 'Profile avatar'} src={src} />\n      ) : (\n        <span className=\"avatar__initials\" aria-hidden=\"true\">\n          {getInitials(name)}\n        </span>\n      )}\n    </div>\n  );\n};\n",
    'packages/components/avatar/doc.mdx': "import { Meta, Markdown, Canvas } from '@storybook/addon-docs/blocks';\nimport ReadMe from './README.md?raw';\n\nimport * as AvatarStories from './avatar.stories';\n\n<Meta of={AvatarStories} />\n\n<Markdown>{ReadMe}</Markdown>\n\n## Examples\n\n<Canvas of={AvatarStories.Default} />\n<Canvas of={AvatarStories.Image} />\n<Canvas of={AvatarStories.Large} />\n",
    'packages/components/avatar/index.test.ts': "import { describe, it, expect } from '@jest/globals';\n\nimport * as publicApi from './index.js';\n\ndescribe('avatar public API', () => {\n  it('exports Avatar', () => {\n    expect(publicApi.Avatar).toBeDefined();\n  });\n});\n",
    'packages/components/avatar/index.ts': "export * from './avatar.js';\nexport type * from './types.js';\n",
    'packages/components/avatar/README.md': "# Avatar\n\n`Avatar` renders a profile image or deterministic initials fallback.\n\n## Usage\n\n```tsx\nimport { Avatar } from './avatar.js';\n\nexport const Example = () => <Avatar name=\"Ada Lovelace\" />;\n```\n\n## Props\n\n```ts\nexport type AvatarProps = {\n  src?: string;\n  alt?: string;\n  name?: string;\n  size?: 'sm' | 'md' | 'lg';\n} & ComponentProps<'div'>;\n```\n\n## Accessibility\n\nImage avatars receive useful alt text. Initials are decorative and hidden from assistive technology.\n\n## Notes\n\n- SSR/SSG-safe.\n- No browser-only APIs.\n- Shared SCSS styles.\n",
    'packages/components/avatar/styles.scss': '.avatar {\n  display: inline-grid;\n  flex: 0 0 auto;\n  place-items: center;\n  overflow: hidden;\n  border: 1px solid var(--profile-card-border-color, #e5e7eb);\n  border-radius: 999px;\n  background: var(--profile-card-muted-background, #f9fafb);\n  color: var(--profile-card-color, #111827);\n  font-weight: 700;\n  letter-spacing: 0;\n  line-height: 1;\n}\n\n.avatar--sm {\n  width: 2rem;\n  height: 2rem;\n  font-size: 0.75rem;\n}\n\n.avatar--md {\n  width: 3rem;\n  height: 3rem;\n  font-size: 1rem;\n}\n\n.avatar--lg {\n  width: 4rem;\n  height: 4rem;\n  font-size: 1.25rem;\n}\n\n.avatar__image {\n  display: block;\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n}\n\n.avatar__initials {\n  display: inline-block;\n}\n',
    'packages/components/avatar/types.ts': "import type { ComponentProps, FC } from 'react';\n\n/** Props for the Avatar component. */\nexport type AvatarProps = {\n  src?: string;\n  alt?: string;\n  name?: string;\n  size?: 'sm' | 'md' | 'lg';\n} & ComponentProps<'div'>;\n\n/** Avatar component type. */\nexport type AvatarType = FC<AvatarProps>;\n",
    'packages/components/badge/badge.stories.tsx': "import type { Meta, StoryObj } from '@storybook/react-webpack5';\n\nimport { Badge } from './badge.js';\n\nconst meta = {\n  title: 'Components/Badge',\n  component: Badge,\n  parameters: { docs: { page: null } },\n  args: { children: 'React', tone: 'neutral' },\n} satisfies Meta<typeof Badge>;\n\nexport default meta;\n\ntype Story = StoryObj<typeof meta>;\n\nexport const Default: Story = {};\n\nexport const Blue: Story = { args: { tone: 'blue' } };\n\nexport const Green: Story = { args: { tone: 'green', children: 'Available' } };\n\nexport const Amber: Story = { args: { tone: 'amber', children: 'Maintainer' } };\n\nexport const Red: Story = { args: { tone: 'red', children: 'Busy' } };\n",
    'packages/components/badge/badge.test.tsx': "import { describe, it, expect } from '@jest/globals';\nimport { render, screen } from '@testing-library/react';\n\nimport { Badge } from './badge.js';\n\ndescribe('Badge', () => {\n  it('renders label content', () => {\n    render(<Badge tone=\"green\">Available</Badge>);\n\n    expect(screen.getByText('Available')).toBeDefined();\n  });\n\n  it('passes span props to the root element', () => {\n    render(<Badge data-testid=\"badge-root\">React</Badge>);\n\n    expect(screen.getByTestId('badge-root')).toBeDefined();\n  });\n});\n",
    'packages/components/badge/badge.tsx': "import { cn } from '@vyriy/cn';\n\nimport type { BadgeType } from './types.js';\n\n/** Renders a compact tone-aware label. */\nexport const Badge: BadgeType = ({ children, tone = 'neutral', className, ...props }) => {\n  return (\n    <span className={cn('badge', `badge--${tone}`, className)} {...props}>\n      {children}\n    </span>\n  );\n};\n",
    'packages/components/badge/doc.mdx': "import { Meta, Markdown, Canvas } from '@storybook/addon-docs/blocks';\nimport ReadMe from './README.md?raw';\n\nimport * as BadgeStories from './badge.stories';\n\n<Meta of={BadgeStories} />\n\n<Markdown>{ReadMe}</Markdown>\n\n## Examples\n\n<Canvas of={BadgeStories.Default} />\n<Canvas of={BadgeStories.Blue} />\n<Canvas of={BadgeStories.Green} />\n<Canvas of={BadgeStories.Amber} />\n<Canvas of={BadgeStories.Red} />\n",
    'packages/components/badge/index.test.ts': "import { describe, it, expect } from '@jest/globals';\n\nimport * as publicApi from './index.js';\n\ndescribe('badge public API', () => {\n  it('exports Badge', () => {\n    expect(publicApi.Badge).toBeDefined();\n  });\n});\n",
    'packages/components/badge/index.ts': "export * from './badge.js';\nexport type * from './types.js';\n",
    'packages/components/badge/README.md': "# Badge\n\n`Badge` displays compact labels for tags, roles, and statuses.\n\n## Usage\n\n```tsx\nimport { Badge } from './badge.js';\n\nexport const Example = () => <Badge tone=\"green\">Available</Badge>;\n```\n\n## Props\n\n```ts\nexport type BadgeProps = {\n  children: ReactNode;\n  tone?: 'neutral' | 'blue' | 'green' | 'amber' | 'red';\n} & ComponentProps<'span'>;\n```\n\n## Notes\n\n- SSR/SSG-safe.\n- Root element accepts regular `span` props.\n- Shared SCSS styles with tone variants.\n",
    'packages/components/badge/styles.scss': '.badge {\n  display: inline-flex;\n  align-items: center;\n  max-width: 100%;\n  border: 1px solid transparent;\n  border-radius: 999px;\n  font-size: 0.75rem;\n  font-weight: 650;\n  letter-spacing: 0;\n  line-height: 1.2;\n  padding: 0.25rem 0.55rem;\n  white-space: nowrap;\n}\n\n.badge--neutral {\n  border-color: var(--profile-card-border-color, #e5e7eb);\n  background: var(--profile-card-muted-background, #f9fafb);\n  color: var(--profile-card-color, #111827);\n}\n\n.badge--blue {\n  border-color: #bfdbfe;\n  background: #eff6ff;\n  color: #1d4ed8;\n}\n\n.badge--green {\n  border-color: #bbf7d0;\n  background: #f0fdf4;\n  color: #15803d;\n}\n\n.badge--amber {\n  border-color: #fde68a;\n  background: #fffbeb;\n  color: #a16207;\n}\n\n.badge--red {\n  border-color: #fecaca;\n  background: #fef2f2;\n  color: #b91c1c;\n}\n',
    'packages/components/badge/types.ts': "import type { ComponentProps, FC, ReactNode } from 'react';\n\n/** Props for the Badge component. */\nexport type BadgeProps = {\n  children: ReactNode;\n  tone?: 'neutral' | 'blue' | 'green' | 'amber' | 'red';\n} & ComponentProps<'span'>;\n\n/** Badge component type. */\nexport type BadgeType = FC<BadgeProps>;\n",
    'packages/components/button-link/button-link.stories.tsx': "import type { Meta, StoryObj } from '@storybook/react-webpack5';\n\nimport { ButtonLink } from './button-link.js';\n\nconst meta = {\n  title: 'Components/ButtonLink',\n  component: ButtonLink,\n  parameters: { docs: { page: null } },\n  args: { href: '#', children: 'Open profile', variant: 'primary' },\n} satisfies Meta<typeof ButtonLink>;\n\nexport default meta;\n\ntype Story = StoryObj<typeof meta>;\n\nexport const Default: Story = {};\n\nexport const Secondary: Story = { args: { variant: 'secondary' } };\n\nexport const Ghost: Story = { args: { variant: 'ghost' } };\n",
    'packages/components/button-link/button-link.test.tsx': "import { describe, it, expect } from '@jest/globals';\nimport { render, screen } from '@testing-library/react';\n\nimport { ButtonLink } from './button-link.js';\n\ndescribe('ButtonLink', () => {\n  it('renders a native link', () => {\n    render(<ButtonLink href=\"/profile\">Open profile</ButtonLink>);\n\n    expect(screen.getByRole('link', { name: 'Open profile' }).getAttribute('href')).toBe('/profile');\n  });\n\n  it('adds external link attributes', () => {\n    render(\n      <ButtonLink external href=\"https://example.com\">\n        Website\n      </ButtonLink>,\n    );\n\n    const link = screen.getByRole('link', { name: 'Website' });\n\n    expect(link.getAttribute('target')).toBe('_blank');\n    expect(link.getAttribute('rel')).toBe('noreferrer');\n  });\n});\n",
    'packages/components/button-link/button-link.tsx': "import { cn } from '@vyriy/cn';\n\nimport type { ButtonLinkType } from './types.js';\n\n/** Renders an anchor styled as a button. */\nexport const ButtonLink: ButtonLinkType = ({\n  href,\n  children,\n  variant = 'primary',\n  external = false,\n  className,\n  ...props\n}) => {\n  return (\n    <a\n      className={cn('button-link', `button-link--${variant}`, className)}\n      href={href}\n      target={external ? '_blank' : props.target}\n      rel={external ? 'noreferrer' : props.rel}\n      {...props}\n    >\n      {children}\n    </a>\n  );\n};\n",
    'packages/components/button-link/doc.mdx': "import { Meta, Markdown, Canvas } from '@storybook/addon-docs/blocks';\nimport ReadMe from './README.md?raw';\n\nimport * as ButtonLinkStories from './button-link.stories';\n\n<Meta of={ButtonLinkStories} />\n\n<Markdown>{ReadMe}</Markdown>\n\n## Examples\n\n<Canvas of={ButtonLinkStories.Default} />\n<Canvas of={ButtonLinkStories.Secondary} />\n<Canvas of={ButtonLinkStories.Ghost} />\n",
    'packages/components/button-link/index.test.ts': "import { describe, it, expect } from '@jest/globals';\n\nimport * as publicApi from './index.js';\n\ndescribe('button-link public API', () => {\n  it('exports ButtonLink', () => {\n    expect(publicApi.ButtonLink).toBeDefined();\n  });\n});\n",
    'packages/components/button-link/index.ts': "export * from './button-link.js';\nexport type * from './types.js';\n",
    'packages/components/button-link/README.md': "# ButtonLink\n\n`ButtonLink` keeps native anchor semantics while using button-like styling.\n\n## Usage\n\n```tsx\nimport { ButtonLink } from './button-link.js';\n\nexport const Example = () => <ButtonLink href=\"/profile\">Open profile</ButtonLink>;\n```\n\n## Props\n\n```ts\nexport type ButtonLinkProps = {\n  href: string;\n  children: ReactNode;\n  variant?: 'primary' | 'secondary' | 'ghost';\n  external?: boolean;\n} & ComponentProps<'a'>;\n```\n\n## Accessibility\n\nThe component renders a native `<a>`. External links receive `target=\"_blank\"` and `rel=\"noreferrer\"`.\n\n## Notes\n\n- SSR/SSG-safe.\n- Visible focus style.\n- Shared SCSS styles.\n",
    'packages/components/button-link/styles.scss': '.button-link {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  min-height: 2.25rem;\n  border: 1px solid transparent;\n  border-radius: 0.6rem;\n  font-size: 0.875rem;\n  font-weight: 650;\n  letter-spacing: 0;\n  line-height: 1.2;\n  padding: 0.55rem 0.85rem;\n  text-decoration: none;\n  transition:\n    background-color 140ms ease,\n    border-color 140ms ease,\n    color 140ms ease;\n}\n\n.button-link:focus-visible {\n  outline: none;\n  box-shadow: var(--profile-card-focus-ring, 0 0 0 3px rgb(59 130 246 / 30%));\n}\n\n.button-link--primary {\n  background: var(--profile-card-color, #111827);\n  color: var(--profile-card-background, #ffffff);\n}\n\n.button-link--primary:hover {\n  background: #374151;\n}\n\n.button-link--secondary {\n  border-color: var(--profile-card-border-color, #e5e7eb);\n  background: var(--profile-card-background, #ffffff);\n  color: var(--profile-card-color, #111827);\n}\n\n.button-link--secondary:hover {\n  background: var(--profile-card-muted-background, #f9fafb);\n}\n\n.button-link--ghost {\n  background: transparent;\n  color: var(--profile-card-color, #111827);\n}\n\n.button-link--ghost:hover {\n  background: var(--profile-card-muted-background, #f9fafb);\n}\n',
    'packages/components/button-link/types.ts': "import type { ComponentProps, FC, ReactNode } from 'react';\n\n/** Props for the ButtonLink component. */\nexport type ButtonLinkProps = {\n  href: string;\n  children: ReactNode;\n  variant?: 'primary' | 'secondary' | 'ghost';\n  external?: boolean;\n} & ComponentProps<'a'>;\n\n/** ButtonLink component type. */\nexport type ButtonLinkType = FC<ButtonLinkProps>;\n",
    'packages/components/card/card.stories.tsx': "import type { Meta, StoryObj } from '@storybook/react-webpack5';\n\nimport { Card } from './card.js';\n\nconst meta = {\n  title: 'Components/Card',\n  component: Card,\n  parameters: { docs: { page: null } },\n  args: {\n    title: 'Profile',\n    subtitle: 'Calm reusable UI primitive',\n    children: 'Card content',\n  },\n} satisfies Meta<typeof Card>;\n\nexport default meta;\n\ntype Story = StoryObj<typeof meta>;\n\nexport const Default: Story = {};\n\nexport const Muted: Story = { args: { variant: 'muted' } };\n\nexport const Highlighted: Story = { args: { variant: 'highlighted' } };\n",
    'packages/components/card/card.test.tsx': "import { describe, it, expect } from '@jest/globals';\nimport { render, screen } from '@testing-library/react';\n\nimport { Card } from './card.js';\n\ndescribe('Card', () => {\n  it('renders title, subtitle, and children', () => {\n    render(\n      <Card title=\"Profile\" subtitle=\"Frontend engineer\">\n        <span>Content</span>\n      </Card>,\n    );\n\n    expect(screen.getByRole('heading', { name: 'Profile' })).toBeDefined();\n    expect(screen.getByText('Frontend engineer')).toBeDefined();\n    expect(screen.getByText('Content')).toBeDefined();\n  });\n\n  it('passes div props to the root element', () => {\n    render(<Card title=\"Profile\" data-testid=\"card-root\" />);\n\n    expect(screen.getByTestId('card-root')).toBeDefined();\n  });\n});\n",
    'packages/components/card/card.tsx': 'import { cn } from \'@vyriy/cn\';\n\nimport type { CardType } from \'./types.js\';\n\n/** Renders a small content surface with optional heading text. */\nexport const Card: CardType = ({ title, subtitle, children, variant = \'default\', className, ...props }) => {\n  return (\n    <div className={cn(\'card\', `card--${variant}`, className)} {...props}>\n      {(title || subtitle) && (\n        <header className="card__header">\n          {title && <h2 className="card__title">{title}</h2>}\n          {subtitle && <p className="card__subtitle">{subtitle}</p>}\n        </header>\n      )}\n\n      {children && <div className="card__body">{children}</div>}\n    </div>\n  );\n};\n',
    'packages/components/card/doc.mdx': "import { Meta, Markdown, Canvas } from '@storybook/addon-docs/blocks';\nimport ReadMe from './README.md?raw';\n\nimport * as CardStories from './card.stories';\n\n<Meta of={CardStories} />\n\n<Markdown>{ReadMe}</Markdown>\n\n## Examples\n\n<Canvas of={CardStories.Default} />\n<Canvas of={CardStories.Muted} />\n<Canvas of={CardStories.Highlighted} />\n",
    'packages/components/card/index.test.ts': "import { describe, it, expect } from '@jest/globals';\nimport * as publicApi from './index.js';\n\ndescribe('card public API', () => {\n  it('exports Card', () => {\n    expect(publicApi.Card).toBeDefined();\n  });\n});\n",
    'packages/components/card/index.ts': "export * from './card.js';\nexport type * from './types.js';\n",
    'packages/components/card/README.md': "# Card\n\n`Card` is a small layout primitive for profile-card UI surfaces.\n\n## Usage\n\n```tsx\nimport { Card } from './card.js';\n\nexport const Example = () => (\n  <Card title=\"Profile\" subtitle=\"Calm architecture\">\n    Content\n  </Card>\n);\n```\n\n## Props\n\n```ts\nexport type CardProps = {\n  title?: ReactNode;\n  subtitle?: ReactNode;\n  children?: ReactNode;\n  variant?: 'default' | 'muted' | 'highlighted';\n} & ComponentProps<'div'>;\n```\n\n## Notes\n\n- SSR/SSG-safe.\n- Root element accepts regular `div` props.\n- Styles are local to the component.\n",
    'packages/components/card/styles.scss': '.card {\n  border: 1px solid var(--profile-card-border-color, #e5e7eb);\n  border-radius: var(--profile-card-radius, 1rem);\n  background: var(--profile-card-background, #ffffff);\n  box-shadow: var(--profile-card-shadow, 0 10px 30px rgb(15 23 42 / 8%));\n  color: var(--profile-card-color, #111827);\n  padding: var(--profile-card-space, 1rem);\n}\n\n.card--default {\n  background: var(--profile-card-background, #ffffff);\n}\n\n.card--muted {\n  background: var(--profile-card-muted-background, #f9fafb);\n}\n\n.card--highlighted {\n  border-color: var(--profile-card-highlight-border-color, #93c5fd);\n  background: var(--profile-card-highlight-background, #eff6ff);\n}\n\n.card__header {\n  display: grid;\n  gap: 0.25rem;\n  margin-block-end: 0.75rem;\n}\n\n.card__title {\n  margin: 0;\n  font-size: 1rem;\n  font-weight: 650;\n  letter-spacing: 0;\n  line-height: 1.3;\n}\n\n.card__subtitle {\n  margin: 0;\n  color: var(--profile-card-muted-color, #6b7280);\n  font-size: 0.875rem;\n  line-height: 1.4;\n}\n\n.card__body {\n  display: grid;\n  gap: 0.75rem;\n}\n',
    'packages/components/card/types.ts': "import type { ComponentProps, FC, ReactNode } from 'react';\n\n/** Props for the Card component. */\nexport type CardProps = {\n  title?: ReactNode;\n  subtitle?: ReactNode;\n  children?: ReactNode;\n  variant?: 'default' | 'muted' | 'highlighted';\n} & ComponentProps<'div'>;\n\n/** Card component type. */\nexport type CardType = FC<CardProps>;\n",
    'packages/components/doc.mdx': "import { Meta, Markdown } from '@storybook/addon-docs/blocks';\nimport ReadMe from './README.md?raw';\n\n<Meta title=\"Packages/Components\" />\n\n<Markdown>{ReadMe}</Markdown>\n",
    'packages/components/icon-link/doc.mdx': "import { Meta, Markdown, Canvas } from '@storybook/addon-docs/blocks';\nimport ReadMe from './README.md?raw';\n\nimport * as IconLinkStories from './icon-link.stories';\n\n<Meta of={IconLinkStories} />\n\n<Markdown>{ReadMe}</Markdown>\n\n## Examples\n\n<Canvas of={IconLinkStories.Default} />\n<Canvas of={IconLinkStories.External} />\n",
    'packages/components/icon-link/icon-link.stories.tsx': "import type { Meta, StoryObj } from '@storybook/react-webpack5';\n\nimport { IconLink } from './icon-link.js';\n\nconst meta = {\n  title: 'Components/IconLink',\n  component: IconLink,\n  parameters: { docs: { page: null } },\n  args: { href: '#', label: 'GitHub', icon: 'GH' },\n} satisfies Meta<typeof IconLink>;\n\nexport default meta;\n\ntype Story = StoryObj<typeof meta>;\n\nexport const Default: Story = {};\n\nexport const External: Story = {\n  args: { href: 'https://example.com', label: 'Website', external: true },\n};\n",
    'packages/components/icon-link/icon-link.test.tsx': "import { describe, it, expect } from '@jest/globals';\nimport { render, screen } from '@testing-library/react';\n\nimport { IconLink } from './icon-link.js';\n\ndescribe('IconLink', () => {\n  it('renders readable link label', () => {\n    render(<IconLink href=\"/github\" label=\"GitHub\" icon={<span>G</span>} />);\n\n    expect(screen.getByRole('link', { name: 'GitHub' })).toBeDefined();\n  });\n\n  it('adds external link attributes', () => {\n    render(<IconLink external href=\"https://example.com\" label=\"Website\" />);\n\n    const link = screen.getByRole('link', { name: 'Website' });\n\n    expect(link.getAttribute('target')).toBe('_blank');\n    expect(link.getAttribute('rel')).toBe('noreferrer');\n  });\n});\n",
    'packages/components/icon-link/icon-link.tsx': "import { cn } from '@vyriy/cn';\n\nimport type { IconLinkType } from './types.js';\n\n/** Renders a compact accessible link with an optional decorative icon. */\nexport const IconLink: IconLinkType = ({ href, label, icon, external = false, className, ...props }) => {\n  return (\n    <a\n      className={cn('icon-link', className)}\n      href={href}\n      target={external ? '_blank' : props.target}\n      rel={external ? 'noreferrer' : props.rel}\n      {...props}\n    >\n      {icon && (\n        <span className=\"icon-link__icon\" aria-hidden=\"true\">\n          {icon}\n        </span>\n      )}\n      <span className=\"icon-link__label\">{label}</span>\n    </a>\n  );\n};\n",
    'packages/components/icon-link/index.test.ts': "import { describe, it, expect } from '@jest/globals';\n\nimport * as publicApi from './index.js';\n\ndescribe('icon-link public API', () => {\n  it('exports IconLink', () => {\n    expect(publicApi.IconLink).toBeDefined();\n  });\n});\n",
    'packages/components/icon-link/index.ts': "export * from './icon-link.js';\nexport type * from './types.js';\n",
    'packages/components/icon-link/README.md': '# IconLink\n\n`IconLink` renders a compact profile link with optional decorative icon content.\n\n## Usage\n\n```tsx\nimport { IconLink } from \'./icon-link.js\';\n\nexport const Example = () => <IconLink href="/github" label="GitHub" />;\n```\n\n## Props\n\n```ts\nexport type IconLinkProps = {\n  href: string;\n  label: string;\n  icon?: ReactNode;\n  external?: boolean;\n} & ComponentProps<\'a\'>;\n```\n\n## Accessibility\n\nThe label remains readable link text. Optional icon content is decorative.\n\n## Notes\n\n- SSR/SSG-safe.\n- External links receive safe target and rel attributes.\n- Shared SCSS styles.\n',
    'packages/components/icon-link/styles.scss': '.icon-link {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.4rem;\n  min-height: 2rem;\n  border-radius: 0.5rem;\n  color: var(--profile-card-color, #111827);\n  font-size: 0.875rem;\n  font-weight: 600;\n  letter-spacing: 0;\n  line-height: 1.2;\n  text-decoration: none;\n}\n\n.icon-link:hover {\n  color: #1d4ed8;\n}\n\n.icon-link:focus-visible {\n  outline: none;\n  box-shadow: var(--profile-card-focus-ring, 0 0 0 3px rgb(59 130 246 / 30%));\n}\n\n.icon-link__icon {\n  display: inline-grid;\n  width: 1rem;\n  height: 1rem;\n  place-items: center;\n}\n\n.icon-link__label {\n  overflow-wrap: anywhere;\n}\n',
    'packages/components/icon-link/types.ts': "import type { ComponentProps, FC, ReactNode } from 'react';\n\n/** Props for the IconLink component. */\nexport type IconLinkProps = {\n  href: string;\n  label: string;\n  icon?: ReactNode;\n  external?: boolean;\n} & ComponentProps<'a'>;\n\n/** IconLink component type. */\nexport type IconLinkType = FC<IconLinkProps>;\n",
    'packages/components/index.test.ts': "import { describe, it, expect } from '@jest/globals';\n\nimport * as publicApi from './index.js';\n\ndescribe('public API', () => {\n  it('exports public components', () => {\n    expect(publicApi.Avatar).toBeDefined();\n    expect(publicApi.Badge).toBeDefined();\n    expect(publicApi.ButtonLink).toBeDefined();\n    expect(publicApi.Card).toBeDefined();\n    expect(publicApi.IconLink).toBeDefined();\n    expect(publicApi.ProfileCard).toBeDefined();\n    expect(publicApi.ProfileDetails).toBeDefined();\n    expect(publicApi.ProfileHeader).toBeDefined();\n    expect(publicApi.ProfileLinks).toBeDefined();\n    expect(publicApi.ProfileMeta).toBeDefined();\n    expect(publicApi.ProfileTags).toBeDefined();\n  });\n});\n",
    'packages/components/index.ts': "export * from './avatar/index.js';\nexport * from './badge/index.js';\nexport * from './button-link/index.js';\nexport * from './card/index.js';\nexport * from './icon-link/index.js';\nexport * from './profile-card/index.js';\nexport * from './profile-details/index.js';\nexport * from './profile-header/index.js';\nexport * from './profile-links/index.js';\nexport * from './profile-meta/index.js';\nexport * from './profile-tags/index.js';\n",
    'packages/components/profile-card/doc.mdx': "import { Meta, Markdown, Canvas } from '@storybook/addon-docs/blocks';\nimport ReadMe from './README.md?raw';\n\nimport * as ProfileCardStories from './profile-card.stories';\n\n<Meta of={ProfileCardStories} />\n\n<Markdown>{ReadMe}</Markdown>\n\n## Examples\n\n<Canvas of={ProfileCardStories.Default} />\n<Canvas of={ProfileCardStories.Minimal} />\n",
    'packages/components/profile-card/index.test.ts': "import { describe, it, expect } from '@jest/globals';\n\nimport * as publicApi from './index.js';\n\ndescribe('profile-card public API', () => {\n  it('exports ProfileCard', () => {\n    expect(publicApi.ProfileCard).toBeDefined();\n  });\n});\n",
    'packages/components/profile-card/index.ts': "export { ProfileCard } from './profile-card.js';\nexport type {\n  ProfileCard as ProfileCardData,\n  ProfileCardLink,\n  ProfileCardMetaItem,\n  ProfileCardProps,\n  ProfileCardType,\n} from './types.js';\n",
    'packages/components/profile-card/profile-card.stories.tsx': "import type { Meta, StoryObj } from '@storybook/react-webpack5';\n\nimport { ProfileCard } from './profile-card.js';\n\nconst meta = {\n  title: 'Components/ProfileCard',\n  component: ProfileCard,\n  parameters: { docs: { page: null } },\n  args: {\n    name: 'Developer',\n    title: 'Senior IT Professional',\n    description: 'Building calm architecture for cloud-ready applications.',\n    tags: [\n      'React',\n      'TypeScript',\n      'AWS',\n      'Serverless',\n      'Vyriy',\n    ],\n    meta: [\n      { label: 'Project', value: 'Vyriy' },\n      { label: 'Focus', value: 'Calm architecture' },\n    ],\n    links: [\n      { label: 'GitHub', href: 'https://github.com', external: true },\n      { label: 'Website', href: 'https://vyriy.dev', external: true },\n    ],\n    children: <p>Reusable profile UI for MFE preset examples.</p>,\n  },\n} satisfies Meta<typeof ProfileCard>;\n\nexport default meta;\n\ntype Story = StoryObj<typeof meta>;\n\nexport const Default: Story = {};\n\nexport const Minimal: Story = {\n  args: {\n    title: undefined,\n    description: undefined,\n    tags: [],\n    meta: [],\n    links: [],\n    children: undefined,\n  },\n};\n",
    'packages/components/profile-card/profile-card.test.tsx': "import { describe, it, expect } from '@jest/globals';\nimport { render, screen } from '@testing-library/react';\n\nimport { ProfileCard } from './profile-card.js';\n\ndescribe('ProfileCard', () => {\n  it('renders composed profile content', () => {\n    render(\n      <ProfileCard\n        name=\"Developer\"\n        title=\"Senior IT Professional\"\n        description=\"Building calm architecture.\"\n        tags={['React', 'TypeScript']}\n        meta={[{ label: 'Project', value: 'Vyriy' }]}\n        links={[{ href: 'https://vyriy.dev', label: 'Website', external: true }]}\n      >\n        Custom summary\n      </ProfileCard>,\n    );\n\n    expect(screen.getByRole('article')).toBeDefined();\n    expect(screen.getByRole('heading', { name: 'Developer' })).toBeDefined();\n    expect(screen.getByText('Senior IT Professional')).toBeDefined();\n    expect(screen.getByText('React')).toBeDefined();\n    expect(screen.getByText('Vyriy')).toBeDefined();\n    expect(screen.getByText('Custom summary')).toBeDefined();\n    expect(screen.getByRole('link', { name: 'Website' })).toBeDefined();\n  });\n\n  it('passes article props to the root element', () => {\n    render(<ProfileCard name=\"Developer\" data-testid=\"profile-card\" />);\n\n    expect(screen.getByTestId('profile-card')).toBeDefined();\n  });\n});\n",
    'packages/components/profile-card/profile-card.tsx': "import { cn } from '@vyriy/cn';\n\nimport { Card } from '../card/index.js';\nimport { ProfileDetails } from '../profile-details/index.js';\nimport { ProfileHeader } from '../profile-header/index.js';\nimport { ProfileLinks } from '../profile-links/index.js';\nimport { ProfileMeta } from '../profile-meta/index.js';\nimport { ProfileTags } from '../profile-tags/index.js';\nimport type { ProfileCardType } from './types.js';\n\n/** Composes the profile-card primitives into one semantic article. */\nexport const ProfileCard: ProfileCardType = ({\n  name,\n  title,\n  description,\n  avatarUrl,\n  tags = [],\n  meta = [],\n  links = [],\n  children,\n  className,\n  ...props\n}) => {\n  return (\n    <article className={cn('profile-card', className)} {...props}>\n      <Card>\n        <div className=\"profile-card__content\">\n          <ProfileHeader avatarUrl={avatarUrl} description={description} name={name} title={title} />\n          <ProfileMeta items={meta} />\n          <ProfileTags tags={tags} tone=\"blue\" />\n          <ProfileDetails>{children}</ProfileDetails>\n          <ProfileLinks links={links} />\n        </div>\n      </Card>\n    </article>\n  );\n};\n",
    'packages/components/profile-card/README.md': "# ProfileCard\n\n`ProfileCard` composes the profile-card primitives into one semantic article.\n\n## Usage\n\n```tsx\nimport { ProfileCard } from './profile-card.js';\n\nexport const Example = () => (\n  <ProfileCard\n    name=\"Developer\"\n    title=\"Senior IT Professional\"\n    description=\"Building calm architecture for cloud-ready applications.\"\n    tags={['React', 'TypeScript', 'Vyriy']}\n    meta={[{ label: 'Project', value: 'Vyriy' }]}\n    links={[{ href: 'https://vyriy.dev', label: 'Website', external: true }]}\n  />\n);\n```\n\n## Props\n\n```ts\nexport type ProfileCardProps = {\n  name: string;\n  title?: string;\n  description?: string;\n  avatarUrl?: string;\n  tags?: string[];\n  meta?: ProfileCardMetaItem[];\n  links?: ProfileCardLink[];\n  children?: ReactNode;\n} & ComponentProps<'article'>;\n```\n\n## Accessibility\n\nThe root element is an `<article>`. Nested metadata, tag, and link sections use semantic markup.\n\n## Notes\n\n- SSR/SSG-safe.\n- Deterministic output.\n- Shared SCSS styles.\n",
    'packages/components/profile-card/styles.scss': '.profile-card {\n  max-width: 28rem;\n  color: var(--profile-card-color, #111827);\n}\n\n.profile-card__content {\n  display: grid;\n  gap: 1rem;\n}\n',
    'packages/components/profile-card/types.ts': "import type { ComponentProps, FC, ReactNode } from 'react';\n\n/** Link item rendered in a profile card. */\nexport type ProfileCardLink = {\n  href: string;\n  label: string;\n  external?: boolean;\n};\n\n/** Metadata item rendered in a profile card. */\nexport type ProfileCardMetaItem = {\n  label: string;\n  value: ReactNode;\n};\n\n/** Data model accepted by the ProfileCard component and API renderers. */\nexport type ProfileCard = {\n  name: string;\n  title?: string;\n  description?: string;\n  avatarUrl?: string;\n  tags?: string[];\n  meta?: ProfileCardMetaItem[];\n  links?: ProfileCardLink[];\n  children?: ReactNode;\n};\n\n/** Props for the ProfileCard component. */\nexport type ProfileCardProps = ProfileCard & ComponentProps<'article'>;\n\n/** ProfileCard component type. */\nexport type ProfileCardType = FC<ProfileCardProps>;\n",
    'packages/components/profile-details/doc.mdx': "import { Meta, Markdown, Canvas } from '@storybook/addon-docs/blocks';\nimport ReadMe from './README.md?raw';\n\nimport * as ProfileDetailsStories from './profile-details.stories';\n\n<Meta of={ProfileDetailsStories} />\n\n<Markdown>{ReadMe}</Markdown>\n\n## Examples\n\n<Canvas of={ProfileDetailsStories.Default} />\n",
    'packages/components/profile-details/index.test.ts': "import { describe, it, expect } from '@jest/globals';\n\nimport * as publicApi from './index.js';\n\ndescribe('profile-details public API', () => {\n  it('exports ProfileDetails', () => {\n    expect(publicApi.ProfileDetails).toBeDefined();\n  });\n});\n",
    'packages/components/profile-details/index.ts': "export * from './profile-details.js';\nexport type * from './types.js';\n",
    'packages/components/profile-details/profile-details.stories.tsx': "import type { Meta, StoryObj } from '@storybook/react-webpack5';\n\nimport { ProfileDetails } from './profile-details.js';\n\nconst meta = {\n  title: 'Components/ProfileDetails',\n  component: ProfileDetails,\n  parameters: { docs: { page: null } },\n  args: { children: <p>Builds typed, deployable systems with calm boundaries.</p> },\n} satisfies Meta<typeof ProfileDetails>;\n\nexport default meta;\n\ntype Story = StoryObj<typeof meta>;\n\nexport const Default: Story = {};\n",
    'packages/components/profile-details/profile-details.test.tsx': "import { describe, it, expect } from '@jest/globals';\nimport { render, screen } from '@testing-library/react';\n\nimport { ProfileDetails } from './profile-details.js';\n\ndescribe('ProfileDetails', () => {\n  it('renders body content', () => {\n    render(\n      <ProfileDetails>\n        <p>Profile summary</p>\n      </ProfileDetails>,\n    );\n\n    expect(screen.getByText('Profile summary')).toBeDefined();\n  });\n\n  it('does not render an empty wrapper', () => {\n    const { container } = render(<ProfileDetails />);\n\n    expect(container.firstChild).toBeNull();\n  });\n});\n",
    'packages/components/profile-details/profile-details.tsx': "import { cn } from '@vyriy/cn';\n\nimport type { ProfileDetailsType } from './types.js';\n\n/** Renders optional long-form profile details. */\nexport const ProfileDetails: ProfileDetailsType = ({ children, className, ...props }) => {\n  if (!children) {\n    return null;\n  }\n\n  return (\n    <section className={cn('profile-details', className)} {...props}>\n      {children}\n    </section>\n  );\n};\n",
    'packages/components/profile-details/README.md': "# ProfileDetails\n\n`ProfileDetails` renders optional profile summary, skills, or custom body content.\n\n## Usage\n\n```tsx\nimport { ProfileDetails } from './profile-details.js';\n\nexport const Example = () => <ProfileDetails>Profile summary</ProfileDetails>;\n```\n\n## Props\n\n```ts\nexport type ProfileDetailsProps = {\n  children?: ReactNode;\n} & ComponentProps<'section'>;\n```\n\n## Accessibility\n\nThe component renders a semantic `<section>` when content exists.\n\n## Notes\n\n- Empty content renders `null`.\n- SSR/SSG-safe.\n- Shared SCSS styles.\n",
    'packages/components/profile-details/styles.scss': '.profile-details {\n  color: var(--profile-card-muted-color, #6b7280);\n  font-size: 0.9rem;\n  line-height: 1.55;\n}\n\n.profile-details > :first-child {\n  margin-block-start: 0;\n}\n\n.profile-details > :last-child {\n  margin-block-end: 0;\n}\n',
    'packages/components/profile-details/types.ts': "import type { ComponentProps, FC, ReactNode } from 'react';\n\n/** Props for the ProfileDetails component. */\nexport type ProfileDetailsProps = {\n  children?: ReactNode;\n} & ComponentProps<'section'>;\n\n/** ProfileDetails component type. */\nexport type ProfileDetailsType = FC<ProfileDetailsProps>;\n",
    'packages/components/profile-header/doc.mdx': "import { Meta, Markdown, Canvas } from '@storybook/addon-docs/blocks';\nimport ReadMe from './README.md?raw';\n\nimport * as ProfileHeaderStories from './profile-header.stories';\n\n<Meta of={ProfileHeaderStories} />\n\n<Markdown>{ReadMe}</Markdown>\n\n## Examples\n\n<Canvas of={ProfileHeaderStories.Default} />\n<Canvas of={ProfileHeaderStories.WithAvatar} />\n",
    'packages/components/profile-header/index.test.ts': "import { describe, it, expect } from '@jest/globals';\n\nimport * as publicApi from './index.js';\n\ndescribe('profile-header public API', () => {\n  it('exports ProfileHeader', () => {\n    expect(publicApi.ProfileHeader).toBeDefined();\n  });\n});\n",
    'packages/components/profile-header/index.ts': "export * from './profile-header.js';\nexport type * from './types.js';\n",
    'packages/components/profile-header/profile-header.stories.tsx': "import type { Meta, StoryObj } from '@storybook/react-webpack5';\n\nimport { ProfileHeader } from './profile-header.js';\n\nconst meta = {\n  title: 'Components/ProfileHeader',\n  component: ProfileHeader,\n  parameters: { docs: { page: null } },\n  args: {\n    name: 'Developer',\n    title: 'Senior IT Professional',\n    description: 'Building calm architecture for cloud-ready applications.',\n  },\n} satisfies Meta<typeof ProfileHeader>;\n\nexport default meta;\n\ntype Story = StoryObj<typeof meta>;\n\nexport const Default: Story = {};\n\nexport const WithAvatar: Story = {\n  args: {\n    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=128&q=80',\n  },\n};\n",
    'packages/components/profile-header/profile-header.test.tsx': "import { describe, it, expect } from '@jest/globals';\nimport { render, screen } from '@testing-library/react';\n\nimport { ProfileHeader } from './profile-header.js';\n\ndescribe('ProfileHeader', () => {\n  it('renders name, title, and description', () => {\n    render(\n      <ProfileHeader\n        name=\"Ada Lovelace\"\n        title=\"Computing pioneer\"\n        description=\"Wrote early notes about general computation.\"\n      />,\n    );\n\n    expect(screen.getByRole('heading', { name: 'Ada Lovelace' })).toBeDefined();\n    expect(screen.getByText('Computing pioneer')).toBeDefined();\n    expect(screen.getByText('Wrote early notes about general computation.')).toBeDefined();\n  });\n\n  it('passes header props to the root element', () => {\n    render(<ProfileHeader name=\"Ada Lovelace\" data-testid=\"profile-header\" />);\n\n    expect(screen.getByTestId('profile-header')).toBeDefined();\n  });\n});\n",
    'packages/components/profile-header/profile-header.tsx': 'import { cn } from \'@vyriy/cn\';\n\nimport { Avatar } from \'../avatar/index.js\';\nimport type { ProfileHeaderType } from \'./types.js\';\n\n/** Renders profile identity, title, description, and avatar. */\nexport const ProfileHeader: ProfileHeaderType = ({ name, title, description, avatarUrl, className, ...props }) => {\n  return (\n    <header className={cn(\'profile-header\', className)} {...props}>\n      <Avatar src={avatarUrl} name={name} alt={`${name} avatar`} size="lg" />\n      <div className="profile-header__content">\n        <h2 className="profile-header__name">{name}</h2>\n        {title && <p className="profile-header__title">{title}</p>}\n        {description && <p className="profile-header__description">{description}</p>}\n      </div>\n    </header>\n  );\n};\n',
    'packages/components/profile-header/README.md': '# ProfileHeader\n\n`ProfileHeader` composes an avatar, name, title, and short description.\n\n## Usage\n\n```tsx\nimport { ProfileHeader } from \'./profile-header.js\';\n\nexport const Example = () => <ProfileHeader name="Developer" title="Senior IT Professional" />;\n```\n\n## Props\n\n```ts\nexport type ProfileHeaderProps = {\n  name: string;\n  title?: string;\n  description?: string;\n  avatarUrl?: string;\n} & ComponentProps<\'header\'>;\n```\n\n## Accessibility\n\nThe root element is a semantic `<header>`, and avatar alt text is derived from the profile name.\n\n## Notes\n\n- SSR/SSG-safe.\n- Deterministic rendering.\n- Shared SCSS styles.\n',
    'packages/components/profile-header/styles.scss': '.profile-header {\n  display: flex;\n  align-items: flex-start;\n  gap: 0.9rem;\n  min-width: 0;\n}\n\n.profile-header__content {\n  display: grid;\n  min-width: 0;\n  gap: 0.25rem;\n}\n\n.profile-header__name {\n  margin: 0;\n  color: var(--profile-card-color, #111827);\n  font-size: 1.2rem;\n  font-weight: 750;\n  letter-spacing: 0;\n  line-height: 1.2;\n}\n\n.profile-header__title {\n  margin: 0;\n  color: var(--profile-card-color, #111827);\n  font-size: 0.925rem;\n  font-weight: 650;\n  line-height: 1.35;\n}\n\n.profile-header__description {\n  margin: 0.25rem 0 0;\n  color: var(--profile-card-muted-color, #6b7280);\n  font-size: 0.9rem;\n  line-height: 1.45;\n}\n',
    'packages/components/profile-header/types.ts': "import type { ComponentProps, FC } from 'react';\n\n/** Props for the ProfileHeader component. */\nexport type ProfileHeaderProps = {\n  name: string;\n  title?: string;\n  description?: string;\n  avatarUrl?: string;\n} & ComponentProps<'header'>;\n\n/** ProfileHeader component type. */\nexport type ProfileHeaderType = FC<ProfileHeaderProps>;\n",
    'packages/components/profile-links/doc.mdx': "import { Meta, Markdown, Canvas } from '@storybook/addon-docs/blocks';\nimport ReadMe from './README.md?raw';\n\nimport * as ProfileLinksStories from './profile-links.stories';\n\n<Meta of={ProfileLinksStories} />\n\n<Markdown>{ReadMe}</Markdown>\n\n## Examples\n\n<Canvas of={ProfileLinksStories.Default} />\n<Canvas of={ProfileLinksStories.Buttons} />\n",
    'packages/components/profile-links/index.test.ts': "import { describe, it, expect } from '@jest/globals';\n\nimport * as publicApi from './index.js';\n\ndescribe('profile-links public API', () => {\n  it('exports ProfileLinks', () => {\n    expect(publicApi.ProfileLinks).toBeDefined();\n  });\n});\n",
    'packages/components/profile-links/index.ts': "export * from './profile-links.js';\nexport type * from './types.js';\n",
    'packages/components/profile-links/profile-links.stories.tsx': "import type { Meta, StoryObj } from '@storybook/react-webpack5';\n\nimport { ProfileLinks } from './profile-links.js';\n\nconst meta = {\n  title: 'Components/ProfileLinks',\n  component: ProfileLinks,\n  parameters: { docs: { page: null } },\n  args: {\n    links: [\n      { label: 'GitHub', href: 'https://github.com', external: true },\n      { label: 'Website', href: 'https://vyriy.dev', external: true },\n    ],\n  },\n} satisfies Meta<typeof ProfileLinks>;\n\nexport default meta;\n\ntype Story = StoryObj<typeof meta>;\n\nexport const Default: Story = {};\n\nexport const Buttons: Story = { args: { variant: 'buttons' } };\n",
    'packages/components/profile-links/profile-links.test.tsx': "import { describe, it, expect } from '@jest/globals';\nimport { render, screen } from '@testing-library/react';\n\nimport { ProfileLinks } from './profile-links.js';\n\ndescribe('ProfileLinks', () => {\n  it('renders profile links in navigation', () => {\n    render(<ProfileLinks links={[{ href: '/github', label: 'GitHub' }]} />);\n\n    expect(screen.getByRole('navigation', { name: 'Profile links' })).toBeDefined();\n    expect(screen.getByRole('link', { name: 'GitHub' })).toBeDefined();\n  });\n\n  it('renders external button links', () => {\n    render(\n      <ProfileLinks links={[{ href: 'https://example.com', label: 'Website', external: true }]} variant=\"buttons\" />,\n    );\n\n    const link = screen.getByRole('link', { name: 'Website' });\n\n    expect(link.getAttribute('target')).toBe('_blank');\n    expect(link.getAttribute('rel')).toBe('noreferrer');\n  });\n\n  it('does not render an empty wrapper', () => {\n    const { container } = render(<ProfileLinks links={[]} />);\n\n    expect(container.firstChild).toBeNull();\n  });\n});\n",
    'packages/components/profile-links/profile-links.tsx': "import { cn } from '@vyriy/cn';\n\nimport { ButtonLink } from '../button-link/index.js';\nimport { IconLink } from '../icon-link/index.js';\nimport type { ProfileLinksType } from './types.js';\n\n/** Renders profile links as icon links or button-style links. */\nexport const ProfileLinks: ProfileLinksType = ({\n  links,\n  variant = 'icons',\n  className,\n  'aria-label': ariaLabel = 'Profile links',\n  ...props\n}) => {\n  if (links.length === 0) {\n    return null;\n  }\n\n  return (\n    <nav className={cn('profile-links', `profile-links--${variant}`, className)} aria-label={ariaLabel} {...props}>\n      {links.map((link) =>\n        variant === 'buttons' ? (\n          <ButtonLink external={link.external} href={link.href} key={link.href} variant=\"secondary\">\n            {link.label}\n          </ButtonLink>\n        ) : (\n          <IconLink external={link.external} href={link.href} key={link.href} label={link.label} />\n        ),\n      )}\n    </nav>\n  );\n};\n",
    'packages/components/profile-links/README.md': "# ProfileLinks\n\n`ProfileLinks` renders profile links as compact text links or button links.\n\n## Usage\n\n```tsx\nimport { ProfileLinks } from './profile-links.js';\n\nexport const Example = () => <ProfileLinks links={[{ href: '/github', label: 'GitHub' }]} />;\n```\n\n## Props\n\n```ts\nexport type ProfileLink = {\n  href: string;\n  label: string;\n  external?: boolean;\n};\n\nexport type ProfileLinksProps = {\n  links: ProfileLink[];\n  variant?: 'icons' | 'buttons';\n} & ComponentProps<'nav'>;\n```\n\n## Accessibility\n\nThe component renders `<nav aria-label=\"Profile links\">` by default.\n\n## Notes\n\n- Empty link arrays render `null`.\n- External links receive safe target and rel attributes.\n- SSR/SSG-safe.\n",
    'packages/components/profile-links/styles.scss': '.profile-links {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 0.55rem;\n}\n\n.profile-links--icons {\n  align-items: center;\n}\n\n.profile-links--buttons {\n  align-items: stretch;\n}\n',
    'packages/components/profile-links/types.ts': "import type { ComponentProps, FC } from 'react';\n\n/** Link item rendered by ProfileLinks. */\nexport type ProfileLink = {\n  href: string;\n  label: string;\n  external?: boolean;\n};\n\n/** Props for the ProfileLinks component. */\nexport type ProfileLinksProps = {\n  links: ProfileLink[];\n  variant?: 'icons' | 'buttons';\n} & ComponentProps<'nav'>;\n\n/** ProfileLinks component type. */\nexport type ProfileLinksType = FC<ProfileLinksProps>;\n",
    'packages/components/profile-meta/doc.mdx': "import { Meta, Markdown, Canvas } from '@storybook/addon-docs/blocks';\nimport ReadMe from './README.md?raw';\n\nimport * as ProfileMetaStories from './profile-meta.stories';\n\n<Meta of={ProfileMetaStories} />\n\n<Markdown>{ReadMe}</Markdown>\n\n## Examples\n\n<Canvas of={ProfileMetaStories.Default} />\n",
    'packages/components/profile-meta/index.test.ts': "import { describe, it, expect } from '@jest/globals';\n\nimport * as publicApi from './index.js';\n\ndescribe('profile-meta public API', () => {\n  it('exports ProfileMeta', () => {\n    expect(publicApi.ProfileMeta).toBeDefined();\n  });\n});\n",
    'packages/components/profile-meta/index.ts': "export * from './profile-meta.js';\nexport type * from './types.js';\n",
    'packages/components/profile-meta/profile-meta.stories.tsx': "import type { Meta, StoryObj } from '@storybook/react-webpack5';\n\nimport { ProfileMeta } from './profile-meta.js';\n\nconst meta = {\n  title: 'Components/ProfileMeta',\n  component: ProfileMeta,\n  parameters: { docs: { page: null } },\n  args: {\n    items: [\n      { label: 'Project', value: 'Vyriy' },\n      { label: 'Focus', value: 'Calm architecture' },\n    ],\n  },\n} satisfies Meta<typeof ProfileMeta>;\n\nexport default meta;\n\ntype Story = StoryObj<typeof meta>;\n\nexport const Default: Story = {};\n",
    'packages/components/profile-meta/profile-meta.test.tsx': "import { describe, it, expect } from '@jest/globals';\nimport { render, screen } from '@testing-library/react';\n\nimport { ProfileMeta } from './profile-meta.js';\n\ndescribe('ProfileMeta', () => {\n  it('renders metadata in a description list', () => {\n    render(<ProfileMeta items={[{ label: 'Location', value: 'Kyiv' }]} />);\n\n    expect(screen.getByText('Location')).toBeDefined();\n    expect(screen.getByText('Kyiv')).toBeDefined();\n  });\n\n  it('does not render an empty wrapper', () => {\n    const { container } = render(<ProfileMeta items={[]} />);\n\n    expect(container.firstChild).toBeNull();\n  });\n});\n",
    'packages/components/profile-meta/profile-meta.tsx': 'import { cn } from \'@vyriy/cn\';\n\nimport type { ProfileMetaType } from \'./types.js\';\n\n/** Renders profile metadata as a semantic description list. */\nexport const ProfileMeta: ProfileMetaType = ({ items, className, ...props }) => {\n  if (items.length === 0) {\n    return null;\n  }\n\n  return (\n    <dl className={cn(\'profile-meta\', className)} {...props}>\n      {items.map((item) => (\n        <div className="profile-meta__item" key={item.label}>\n          <dt className="profile-meta__label">{item.label}</dt>\n          <dd className="profile-meta__value">{item.value}</dd>\n        </div>\n      ))}\n    </dl>\n  );\n};\n',
    'packages/components/profile-meta/README.md': "# ProfileMeta\n\n`ProfileMeta` renders compact metadata rows for location, company, availability, and stack.\n\n## Usage\n\n```tsx\nimport { ProfileMeta } from './profile-meta.js';\n\nexport const Example = () => <ProfileMeta items={[{ label: 'Project', value: 'Vyriy' }]} />;\n```\n\n## Props\n\n```ts\nexport type ProfileMetaItem = {\n  label: string;\n  value: ReactNode;\n};\n\nexport type ProfileMetaProps = {\n  items: ProfileMetaItem[];\n} & ComponentProps<'dl'>;\n```\n\n## Accessibility\n\nThe component uses semantic `<dl>`, `<dt>`, and `<dd>` markup.\n\n## Notes\n\n- Empty item arrays render `null`.\n- SSR/SSG-safe.\n- Shared SCSS styles.\n",
    'packages/components/profile-meta/styles.scss': '.profile-meta {\n  display: grid;\n  gap: 0.55rem;\n  margin: 0;\n}\n\n.profile-meta__item {\n  display: grid;\n  grid-template-columns: minmax(5rem, 0.45fr) 1fr;\n  gap: 0.75rem;\n  min-width: 0;\n}\n\n.profile-meta__label {\n  color: var(--profile-card-muted-color, #6b7280);\n  font-size: 0.78rem;\n  font-weight: 650;\n  line-height: 1.35;\n}\n\n.profile-meta__value {\n  min-width: 0;\n  margin: 0;\n  color: var(--profile-card-color, #111827);\n  font-size: 0.875rem;\n  line-height: 1.35;\n  overflow-wrap: anywhere;\n}\n',
    'packages/components/profile-meta/types.ts': "import type { ComponentProps, FC, ReactNode } from 'react';\n\n/** Metadata item rendered by ProfileMeta. */\nexport type ProfileMetaItem = {\n  label: string;\n  value: ReactNode;\n};\n\n/** Props for the ProfileMeta component. */\nexport type ProfileMetaProps = {\n  items: ProfileMetaItem[];\n} & ComponentProps<'dl'>;\n\n/** ProfileMeta component type. */\nexport type ProfileMetaType = FC<ProfileMetaProps>;\n",
    'packages/components/profile-tags/doc.mdx': "import { Meta, Markdown, Canvas } from '@storybook/addon-docs/blocks';\nimport ReadMe from './README.md?raw';\n\nimport * as ProfileTagsStories from './profile-tags.stories';\n\n<Meta of={ProfileTagsStories} />\n\n<Markdown>{ReadMe}</Markdown>\n\n## Examples\n\n<Canvas of={ProfileTagsStories.Default} />\n<Canvas of={ProfileTagsStories.Neutral} />\n",
    'packages/components/profile-tags/index.test.ts': "import { describe, it, expect } from '@jest/globals';\n\nimport * as publicApi from './index.js';\n\ndescribe('profile-tags public API', () => {\n  it('exports ProfileTags', () => {\n    expect(publicApi.ProfileTags).toBeDefined();\n  });\n});\n",
    'packages/components/profile-tags/index.ts': "export * from './profile-tags.js';\nexport type * from './types.js';\n",
    'packages/components/profile-tags/profile-tags.stories.tsx': "import type { Meta, StoryObj } from '@storybook/react-webpack5';\n\nimport { ProfileTags } from './profile-tags.js';\n\nconst meta = {\n  title: 'Components/ProfileTags',\n  component: ProfileTags,\n  parameters: { docs: { page: null } },\n  args: {\n    tags: [\n      'React',\n      'TypeScript',\n      'AWS',\n      'Serverless',\n    ],\n    tone: 'blue',\n  },\n} satisfies Meta<typeof ProfileTags>;\n\nexport default meta;\n\ntype Story = StoryObj<typeof meta>;\n\nexport const Default: Story = {};\n\nexport const Neutral: Story = { args: { tone: 'neutral' } };\n",
    'packages/components/profile-tags/profile-tags.test.tsx': "import { describe, it, expect } from '@jest/globals';\nimport { render, screen } from '@testing-library/react';\n\nimport { ProfileTags } from './profile-tags.js';\n\ndescribe('ProfileTags', () => {\n  it('renders tags as a list', () => {\n    render(<ProfileTags tags={['React', 'TypeScript']} />);\n\n    expect(screen.getByRole('list')).toBeDefined();\n    expect(screen.getByText('React')).toBeDefined();\n    expect(screen.getByText('TypeScript')).toBeDefined();\n  });\n\n  it('does not render an empty wrapper', () => {\n    const { container } = render(<ProfileTags tags={[]} />);\n\n    expect(container.firstChild).toBeNull();\n  });\n});\n",
    'packages/components/profile-tags/profile-tags.tsx': "import { cn } from '@vyriy/cn';\n\nimport { Badge } from '../badge/index.js';\nimport type { ProfileTagsType } from './types.js';\n\n/** Renders profile tags as a semantic list of badges. */\nexport const ProfileTags: ProfileTagsType = ({ tags, tone = 'neutral', className, ...props }) => {\n  if (tags.length === 0) {\n    return null;\n  }\n\n  return (\n    <ul className={cn('profile-tags', className)} {...props}>\n      {tags.map((tag) => (\n        <li className=\"profile-tags__item\" key={tag}>\n          <Badge tone={tone}>{tag}</Badge>\n        </li>\n      ))}\n    </ul>\n  );\n};\n",
    'packages/components/profile-tags/README.md': "# ProfileTags\n\n`ProfileTags` renders a list of profile tags using `Badge`.\n\n## Usage\n\n```tsx\nimport { ProfileTags } from './profile-tags.js';\n\nexport const Example = () => <ProfileTags tags={['React', 'TypeScript']} />;\n```\n\n## Props\n\n```ts\nexport type ProfileTagsProps = {\n  tags: string[];\n  tone?: BadgeProps['tone'];\n} & ComponentProps<'ul'>;\n```\n\n## Accessibility\n\nTags are rendered as a semantic `<ul>` with one `<li>` per tag.\n\n## Notes\n\n- Empty tag arrays render `null`.\n- SSR/SSG-safe.\n- Shared SCSS styles.\n",
    'packages/components/profile-tags/styles.scss': '.profile-tags {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 0.4rem;\n  margin: 0;\n  padding: 0;\n  list-style: none;\n}\n\n.profile-tags__item {\n  display: inline-flex;\n}\n',
    'packages/components/profile-tags/types.ts': "import type { ComponentProps, FC } from 'react';\n\nimport type { BadgeProps } from '../badge/index.js';\n\n/** Props for the ProfileTags component. */\nexport type ProfileTagsProps = {\n  tags: string[];\n  tone?: BadgeProps['tone'];\n} & ComponentProps<'ul'>;\n\n/** ProfileTags component type. */\nexport type ProfileTagsType = FC<ProfileTagsProps>;\n",
    'packages/components/README.md': `# Components

Reusable React components for the profile-card demo. The package is private to
this repository and is consumed by the API and UI workspaces.

## Exports

Import the full public surface from \`@p/components\`:

- \`Avatar\`
- \`Badge\`
- \`ButtonLink\`
- \`Card\`
- \`IconLink\`
- \`ProfileCard\`
- \`ProfileDetails\`
- \`ProfileHeader\`
- \`ProfileLinks\`
- \`ProfileMeta\`
- \`ProfileTags\`

Focused component entry points are also available:

\`\`\`tsx
import { ProfileCard } from '@p/components/profile-card';
\`\`\`

## Usage

\`\`\`tsx
import { ProfileCard } from '@p/components/profile-card';
import '@p/components/styles.scss';

export const Example = () => (
  <ProfileCard
    name="Developer"
    title="Senior IT Professional"
    description="Building calm architecture for cloud-ready applications."
    avatarUrl="http://localhost:3001/avatar.svg"
    tags={['React', 'TypeScript', 'Vyriy']}
    meta={[{ label: 'Project', value: 'Fullstack preset' }]}
    links={[{ href: 'https://vyriy.dev', label: 'Website', external: true }]}
  />
);
\`\`\`

## Structure

Each public component lives in its own folder with:

- a focused \`README.md\`
- Storybook docs in \`doc.mdx\`
- stories for visual states
- behavior tests and public entry-point tests
- component-local SCSS

The package-level \`index.ts\` is a re-export surface only.

## Notes

- Components are SSR/SSG-friendly and avoid browser globals during render.
- Shared styles are exposed through \`@p/components/styles.scss\`.
- Public imports use ESM \`.js\` relative specifiers in TypeScript source.
`,
    'packages/components/styles.d.ts': "declare module '*.scss';\ndeclare module '*.scss?inline' {\n  const css: string;\n  export default css;\n}\ndeclare module '*.svg' {\n  const src: string;\n  export default src;\n}\n",
    'packages/components/styles.scss': "@use './avatar/styles' as avatar;\n@use './badge/styles' as badge;\n@use './button-link/styles' as button-link;\n@use './card/styles' as card;\n@use './icon-link/styles' as icon-link;\n@use './profile-card/styles' as profile-card;\n@use './profile-details/styles' as profile-details;\n@use './profile-header/styles' as profile-header;\n@use './profile-links/styles' as profile-links;\n@use './profile-meta/styles' as profile-meta;\n@use './profile-tags/styles' as profile-tags;\n",
    'packages/components/package.json': JSON.stringify({
        name: '@p/components',
        type: 'module',
        private: true,
    }, null, 2) + '\n',
    ...projectFiles,
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
            'fix:stylelint': "stylelint '**/*.{css,scss}' --fix",
            'start:api': 'sh workspaces/api/bin/start.sh',
            'start:static': 'sh workspaces/static/bin/start.sh',
            'start:ui': 'sh workspaces/ui/bin/start.sh',
            'lint:ts': 'tsc',
            'lint:prettier': 'prettier . --check',
            'lint:eslint': 'eslint .',
            'lint:stylelint': "stylelint '**/*.{css,scss}'",
            'build:api': 'sh workspaces/api/bin/build.sh',
            'build:ui': 'sh workspaces/ui/bin/build.sh',
            'build:static': 'sh workspaces/static/bin/build.sh',
            'build:storybook': 'cross-env STORYBOOK_DISABLE_TELEMETRY=1 storybook build --quiet --disable-telemetry',
            'test:jest': 'jest',
            prebuild: 'rimraf dist',
            postinstall: 'husky',
        },
        dependencies: {
            '@testing-library/dom': packageJson.peerDependencies['@testing-library/dom'],
            '@testing-library/react': packageJson.peerDependencies['@testing-library/react'],
            '@types/jest': packageJson.peerDependencies['@types/jest'],
            '@vyriy/browserslist-config': `^${packageJson.version}`,
            '@vyriy/cn': `^${packageJson.version}`,
            '@vyriy/env': `^${packageJson.version}`,
            '@vyriy/eslint-config': `^${packageJson.version}`,
            '@vyriy/handler': `^${packageJson.version}`,
            '@vyriy/html': `^${packageJson.version}`,
            '@vyriy/jest-config': `^${packageJson.version}`,
            '@vyriy/path': `^${packageJson.version}`,
            '@vyriy/prettier-config': `^${packageJson.version}`,
            '@vyriy/render': `^${packageJson.version}`,
            '@vyriy/router': `^${packageJson.version}`,
            '@vyriy/server': `^${packageJson.version}`,
            '@vyriy/storybook-config': `^${packageJson.version}`,
            '@vyriy/stylelint-config': `^${packageJson.version}`,
            '@vyriy/typescript-config': `^${packageJson.version}`,
            '@vyriy/webpack-config': `^${packageJson.version}`,
            'cross-env': packageJson.peerDependencies['cross-env'],
            eslint: packageJson.peerDependencies.eslint,
            husky: packageJson.peerDependencies.husky,
            jest: packageJson.peerDependencies.jest,
            'npm-run-all2': packageJson.peerDependencies['npm-run-all2'],
            prettier: packageJson.peerDependencies.prettier,
            rimraf: packageJson.peerDependencies.rimraf,
            storybook: packageJson.peerDependencies.storybook,
            stylelint: packageJson.peerDependencies.stylelint,
            tsx: packageJson.peerDependencies.tsx,
            typescript: packageJson.peerDependencies.typescript,
            webpack: packageJson.peerDependencies.webpack,
            'webpack-cli': packageJson.peerDependencies['webpack-cli'],
            '@vyriy/static': `^${packageJson.version}`,
        },
    }, null, 2) + '\n',
    'README.md': `# Fullstack

Calm cloud-ready profile-card application.

This repository contains a small fullstack demo with shared React components,
required environment readers, a server-rendered API page, a static asset origin,
and a client-rendered UI bundle.

## Setup

\`\`\`bash
yarn install
\`\`\`

The project uses Yarn workspaces and Node \`>=24.0.0\`.

## Start

Start the API, static asset server, and UI dev server together:

\`\`\`bash
yarn start
\`\`\`

Start individual workspaces:

\`\`\`bash
yarn start:api
yarn start:static
yarn start:ui
\`\`\`

\`yarn start:static\` uses the \`vs\` CLI from \`@vyriy/static\` to serve project
static files from \`workspaces/static/public\`.

## Local URLs

Default ports and origins are defined in \`workspaces/env.sh\`:

- API: \`http://localhost:3000\`
- Static/CDN assets: \`http://localhost:3001\`
- UI dev server: \`http://localhost:3002\`

Override \`API_PORT\`, \`CDN_PORT\`, \`UI_PORT\`, \`API\`, \`CDN\`, or \`UI\` before
running a script when local services need different addresses.

## Workspaces

- \`packages/components\` provides the shared profile-card React component set.
- \`packages/env\` provides required environment readers for \`API\`, \`CDN\`, and
  \`UI\`.
- \`workspaces/api\` serves the SSR demo page at \`GET /\`.
- \`workspaces/static\` serves public static assets such as \`avatar.svg\` through
  \`vs\` from \`@vyriy/static\`.
- \`workspaces/ui\` builds and serves the browser entry point.

Each package or workspace has its own README with focused usage notes.

## Static Server

\`@vyriy/static\` provides the \`vs\` command for serving static files. The project
uses it through \`npx\` in \`workspaces/static/bin/start.sh\`:

\`\`\`bash
npx vs -p 3001 workspaces/static/public
\`\`\`

It can also be installed globally when the same static server is useful outside
the workspace scripts:

\`\`\`bash
npm install --global @vyriy/static
vs -p 3001 workspaces/static/public
\`\`\`

## Storybook

Run Storybook docs and component stories:

\`\`\`bash
yarn storybook
\`\`\`

Storybook loads package and workspace \`doc.mdx\` files and shared component
styles from \`packages/components/styles.scss\`.

## Build

Build all production outputs:

\`\`\`bash
yarn build
\`\`\`

Focused builds are also available:

\`\`\`bash
yarn build:api
yarn build:static
yarn build:ui
yarn build:storybook
\`\`\`

The API bundle is emitted to \`dist/api\`; UI and static assets are emitted to \`dist/cdn\`.

## Validation

\`\`\`bash
yarn lint
yarn test
yarn build
\`\`\`

Use \`yarn check\` to run linting, build, and tests in one command.

## Project Guidance

These articles describe the development approach behind this preset and provide practical guidance for evolving a project on top of it:

- [Calm Development Environment: Node.js, Corepack, Yarn and Static Preview](https://vyriy.dev/blog/calm-development-setup/) - how to keep the local development environment predictable and easy to reproduce.
- [Calm App Structure for the Vyriy Ecosystem](https://vyriy.dev/blog/vyriy-calm-app-structure/) - a practical project structure for Vyriy applications: shared configs, small packages, thin workspaces, Storybook docs, tests, and deployable entry points.
- [One Handler, Many Runtimes](https://vyriy.dev/examples/one-handler-many-runtimes/) - how @vyriy/handler, @vyriy/router, and @vyriy/server compose a calm Lambda-compatible API that can run locally, in Docker, Fargate-style HTTP runtimes, and AWS Lambda.
- [Calm Component Structure](https://vyriy.dev/blog/calm-component-structure/) - how to organize component code, tests, stories, and public exports.
- [Storybook as Project Documentation](https://vyriy.dev/blog/storybook-as-project-documentation/) - how to use Storybook as living project documentation and a component playground.
`,
    'doc.mdx': `import { Meta, Markdown } from '@storybook/addon-docs/blocks';
import ReadMe from './README.md?raw';

<Meta title="Fullstack" />

<Markdown>{ReadMe}</Markdown>
`,
});
