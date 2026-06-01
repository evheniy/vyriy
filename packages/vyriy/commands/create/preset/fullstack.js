import packageJson from '../../../package.json' with { type: 'json' };
import { mfe } from './mfe.js';
const mfeOnlyPaths = [
    'packages/api/',
    'packages/event/',
    'packages/query/',
    'workspaces/api/index.ts',
    'workspaces/api/index.test.ts',
    'workspaces/static/public/icon.svg',
    'workspaces/static/public/screenshots/',
];
const getSharedFiles = (options) => Object.fromEntries(Object.entries(mfe(options)).filter(([file]) => !mfeOnlyPaths.some((path) => file.startsWith(path))));
const projectFiles = {
    '.browserslistrc': '[development]\nextends @vyriy/browserslist-config\n\n[ssr]\nextends @vyriy/browserslist-config\n\n[production]\nextends @vyriy/browserslist-config\n\n[modern]\nextends @vyriy/browserslist-config\n',
    '.storybook/preview.tsx': "import '../packages/components/styles.scss';\n\nexport { default } from '@vyriy/storybook-config/preview';\n",
    'packages/env/env.test.ts': "import { afterEach, describe, expect, it } from '@jest/globals';\n\nimport { getApi, getCdn, getUi } from './env.js';\n\ndescribe('env getters', () => {\n  afterEach(() => {\n    delete process.env.API;\n    delete process.env.CDN;\n    delete process.env.UI;\n  });\n\n  it('reads required environment values', () => {\n    process.env.API = 'http://localhost:3000';\n    process.env.CDN = 'http://localhost:3001';\n    process.env.UI = 'http://localhost:3002';\n\n    expect(getApi()).toBe('http://localhost:3000');\n    expect(getCdn()).toBe('http://localhost:3001');\n    expect(getUi()).toBe('http://localhost:3002');\n  });\n\n  it('throws when a required environment value is missing', () => {\n    expect(() => getUi()).toThrow('Environment variable UI is not defined!');\n  });\n});\n",
    'packages/env/env.ts': "import { getEnv } from '@vyriy/env';\n\n/** Reads the API origin used for server endpoints. */\nexport const getApi = () => getEnv('API');\n\n/** Reads the CDN origin used for static assets. */\nexport const getCdn = () => getEnv('CDN');\n\n/** Reads the UI origin used for browser assets. */\nexport const getUi = () => getEnv('UI');\n",
    'packages/env/index.test.ts': "import { afterEach, describe, expect, it } from '@jest/globals';\n\nimport * as publicApi from './index.js';\n\nconst ENV_NAMES = [\n  'API',\n  'CDN',\n  'UI',\n] as const;\n\nconst clearEnv = () => {\n  for (const name of ENV_NAMES) {\n    delete process.env[name];\n  }\n};\n\ndescribe('env public API', () => {\n  afterEach(() => {\n    clearEnv();\n  });\n\n  it('exports env getters', () => {\n    expect(publicApi.getApi).toBeDefined();\n    expect(publicApi.getCdn).toBeDefined();\n    expect(publicApi.getUi).toBeDefined();\n  });\n\n  it('reads environment variables by public getter name', () => {\n    process.env.API = 'http://localhost:3000';\n    process.env.CDN = 'http://localhost:3001';\n    process.env.UI = 'http://localhost:3002';\n\n    expect(publicApi.getApi()).toBe('http://localhost:3000');\n    expect(publicApi.getCdn()).toBe('http://localhost:3001');\n    expect(publicApi.getUi()).toBe('http://localhost:3002');\n  });\n\n  it('throws when a required environment variable is missing', () => {\n    clearEnv();\n\n    expect(() => publicApi.getApi()).toThrow('Environment variable API is not defined!');\n  });\n});\n",
    'packages/env/README.md': '# @p/env\n\nRequired environment readers shared by API and UI workspaces.\n\n## Exports\n\n- `getApi()` reads `API`.\n- `getCdn()` reads `CDN`.\n- `getUi()` reads `UI`.\n\nEach getter throws when its environment variable is missing.\n',
    'workspaces/api/index.test.tsx': "import { describe, expect, it, jest } from '@jest/globals';\nimport type { APIGatewayProxyEvent } from '@vyriy/router';\n\nconst apiMock = jest.fn((handler) => ({ handler }));\nconst serverMock = jest.fn();\n\njest.mock('@vyriy/handler', () => ({\n  api: apiMock,\n}));\n\njest.mock('@vyriy/server', () => ({\n  server: serverMock,\n}));\n\njest.mock('@p/env', () => ({\n  getUi: () => 'http://localhost:3002',\n}));\n\ndescribe('workspaces/api/index.tsx', () => {\n  type ApiHandler = (event: APIGatewayProxyEvent) => Promise<{\n    body: string;\n    headers?: Record<string, string>;\n    statusCode: number;\n  }>;\n\n  const getEvent = (path: string): APIGatewayProxyEvent =>\n    ({\n      body: null,\n      headers: {},\n      httpMethod: 'GET',\n      path,\n      pathParameters: null,\n      queryStringParameters: null,\n    }) as APIGatewayProxyEvent;\n\n  const loadHandler = async (): Promise<ApiHandler> => {\n    await jest.isolateModulesAsync(async () => {\n      await import('./index.js');\n    });\n\n    expect(apiMock).toHaveBeenCalledTimes(1);\n    expect(serverMock).toHaveBeenCalledTimes(1);\n    expect(serverMock).toHaveBeenCalledWith(apiMock.mock.results[0]?.value);\n\n    return apiMock.mock.calls[0]?.[0] as ApiHandler;\n  };\n\n  it('starts the server with the API handler', async () => {\n    await loadHandler();\n\n    expect(apiMock).toHaveBeenCalledTimes(1);\n  });\n\n  it('renders the demo page for the root route', async () => {\n    const handler = await loadHandler();\n    const response = await handler(getEvent('/'));\n\n    expect(response).toEqual({\n      body: expect.any(String),\n      headers: {\n        'access-control-allow-origin': '*',\n        'cache-control': 'public, max-age=300, s-maxage=3600, stale-while-revalidate=86400',\n        'content-type': 'text/html; charset=utf-8',\n        'x-content-type-options': 'nosniff',\n      },\n      isBase64Encoded: undefined,\n      multiValueHeaders: undefined,\n      statusCode: 200,\n    });\n    expect(response.body).toContain('<title>Demo</title>');\n    expect(response.body).toContain('href=\"http://localhost:3002/main.css\"');\n    expect(response.body).toContain('<div id=\"root\" rendered>');\n    expect(response.body).toContain('Developer');\n    expect(response.body).toContain('Senior IT Professional');\n    expect(response.body).toContain('http://localhost:3001/avatar.svg');\n    expect(response.body).toContain('src=\"http://localhost:3002/index.js\"');\n  });\n\n  it('returns not found for unknown routes', async () => {\n    const handler = await loadHandler();\n\n    await expect(handler(getEvent('/missing'))).resolves.toEqual({\n      body: JSON.stringify({\n        message: 'Not Found',\n      }),\n      statusCode: 404,\n    });\n  });\n});\n",
    'workspaces/api/index.tsx': "import { server } from '@vyriy/server';\nimport { api } from '@vyriy/handler';\nimport { createRouter } from '@vyriy/router';\nimport { minify, html } from '@vyriy/html';\nimport { html as react } from '@vyriy/render';\n\nimport { ProfileCard } from '@p/components/profile-card';\nimport { getUi } from '@p/env';\n\nserver(\n  api(async (event) =>\n    createRouter()\n      .get('/', () => ({\n        body: minify(\n          html({\n            htmlAttributes: 'lang=\"en\"',\n            title: '<title>Demo</title>',\n            meta: '<meta charset=\"utf-8\" /><meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" />',\n            link: `<link rel=\"stylesheet\" type=\"text/css\" href=\"${getUi()}/main.css\" />`,\n            body: `<div id=\"root\" rendered>${react(\n              <ProfileCard\n                name=\"Developer\"\n                title=\"Senior IT Professional\"\n                avatarUrl=\"http://localhost:3001/avatar.svg\"\n              />,\n            )}</div>`,\n            script: `<script defer=\"defer\" src=\"${getUi()}/index.js\"></script>`,\n          }),\n        ),\n        headers: {\n          'content-type': 'text/html; charset=utf-8',\n          'cache-control': 'public, max-age=300, s-maxage=3600, stale-while-revalidate=86400',\n          'access-control-allow-origin': '*',\n          'x-content-type-options': 'nosniff',\n        },\n      }))\n      .route(event),\n  ),\n);\n",
    'workspaces/api/webpack.config.ts': "import { EnvironmentPlugin } from 'webpack';\nimport { path } from '@vyriy/path';\nimport { ssr, external } from '@vyriy/webpack-config';\n\nexport default ssr(\n  '@w/api',\n  {\n    path: path('dist', 'api'),\n    filename: 'index.js',\n    library: { type: 'commonjs2' },\n  },\n  (config) => ({\n    ...config,\n    externals: [external({ allowlist: [/^@p/, /^@w/, /^@vyriy/] })],\n    plugins: [\n      ...(config.plugins ?? []),\n      new EnvironmentPlugin([\n        'API',\n        'CDN',\n        'UI',\n      ]),\n    ],\n  }),\n);\n",
    'workspaces/env.sh': '#!/usr/bin/env sh\n\n: "${API_PORT:=3000}"\n: "${CDN_PORT:=3001}"\n: "${UI_PORT:=3002}"\n: "${API:=http://localhost:$API_PORT}"\n: "${CDN:=http://localhost:$CDN_PORT}"\n: "${UI:=http://localhost:$UI_PORT}"\n\nexport API_PORT\nexport CDN_PORT\nexport UI_PORT\nexport API\nexport CDN\nexport UI\n',
    'workspaces/static/README.md': '# @w/static\n\nStatic asset workspace for the profile-card UI.\n\n## Assets\n\n- `avatar.svg` is the default demo avatar.\n\nThe workspace is served as the CDN origin during local development.\n',
    'workspaces/ui/index.test.tsx': "import { describe, expect, it, jest } from '@jest/globals';\nimport { isValidElement } from 'react';\nimport type { ReactElement } from 'react';\n\nconst elementMock = jest.fn();\n\njest.mock('@vyriy/render/element', () => ({\n  element: elementMock,\n}));\n\ntype ProfileCardProps = {\n  avatarUrl: string;\n  name: string;\n  title: string;\n};\n\ndescribe('workspaces/ui/index.tsx', () => {\n  const loadEntry = async () => {\n    const root = document.createElement('div');\n    root.id = 'root';\n    document.body.replaceChildren();\n    document.body.append(root);\n\n    await jest.isolateModulesAsync(async () => {\n      await import('./index.js');\n    });\n\n    const [{ component }] = elementMock.mock.calls[0] as [{ component: ReactElement<ProfileCardProps> }];\n\n    return {\n      root,\n      component,\n    };\n  };\n\n  it('mounts the UI into the root element', async () => {\n    const { root, component } = await loadEntry();\n\n    expect(elementMock).toHaveBeenCalledTimes(1);\n    expect(elementMock).toHaveBeenCalledWith({\n      root,\n      component,\n    });\n  });\n\n  it('renders the profile card demo component', async () => {\n    const { component } = await loadEntry();\n\n    expect(isValidElement(component)).toBe(true);\n    expect(typeof component.type).toBe('function');\n    expect((component.type as { name?: string }).name).toBe('ProfileCard');\n    expect(component.props).toEqual({\n      avatarUrl: 'http://localhost:3001/avatar.svg',\n      name: 'Developer',\n      title: 'Senior IT Professional',\n    });\n  });\n});\n",
    'workspaces/ui/index.tsx': "import { element } from '@vyriy/render/element';\n\nimport { ProfileCard } from '@p/components/profile-card';\nimport '@p/components/styles.scss';\n\nelement({\n  root: document.getElementById('root'),\n  component: (\n    <ProfileCard name=\"Developer\" title=\"Senior IT Professional\" avatarUrl=\"http://localhost:3001/avatar.svg\" />\n  ),\n});\n",
    'workspaces/ui/webpack.config.ts': "import { EnvironmentPlugin } from 'webpack';\n\nimport { csr, html } from '@vyriy/webpack-config';\nimport { path } from '@vyriy/path';\n\nexport default csr(\n  '@w/ui',\n  {\n    path: path('dist', 'cdn'),\n    filename: 'index.js',\n  },\n  (config) => ({\n    ...config,\n    plugins: [\n      ...(config.plugins ?? []),\n      new EnvironmentPlugin(['API', 'CDN', 'UI']),\n      html({\n        htmlAttributes: 'lang=\"en\"',\n        title: '<title>Demo</title>',\n        meta: '<meta charset=\"utf-8\" /><meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" />',\n        body: '<div id=\"root\"></div>',\n      }),\n    ],\n  }),\n);\n",
};
export const fullstack = (options) => ({
    ...getSharedFiles(options),
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
            serve: packageJson.peerDependencies.serve,
            storybook: packageJson.peerDependencies.storybook,
            stylelint: packageJson.peerDependencies.stylelint,
            tsx: packageJson.peerDependencies.tsx,
            typescript: packageJson.peerDependencies.typescript,
            webpack: packageJson.peerDependencies.webpack,
            'webpack-cli': packageJson.peerDependencies['webpack-cli'],
        },
    }, null, 2) + '\n',
    'README.md': `# ${options.name}

${options.description}

## Setup

\`\`\`bash
yarn install
\`\`\`

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

## Local URLs

Default ports are defined in \`workspaces/env.sh\`:

- API: \`http://localhost:3000\`
- Static/CDN assets: \`http://localhost:3001\`
- UI dev server: \`http://localhost:3002\`

## Validation

\`\`\`bash
yarn lint
yarn test
yarn build
\`\`\`
`,
    'doc.mdx': `import { Meta, Markdown } from '@storybook/addon-docs/blocks';
import ReadMe from './README.md?raw';

<Meta title="${options.name}" />

<Markdown>{ReadMe}</Markdown>
`,
});
