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
export const gql = (options) => ({
    'README.md': `# GraphQL API

Calm cloud-ready GraphQL application.

This repository is a Yarn workspace monorepo with a reusable GraphQL API package and a runtime workspace that serves it over HTTP.

## Requirements

- Node.js \`>=24.0.0\`
- Yarn \`4.16.0\`

## Workspaces

- \`packages/graphql\` - reusable \`@p/graphql\` package that owns the GraphQL schema, embedded GraphiQL page, and public router export.
- \`workspaces/graphql\` - \`@w/graphql\` runtime workspace that mounts the shared router through \`@vyriy/handler\` and \`@vyriy/server\`.

## Development

Install dependencies:

\`\`\`bash
yarn install
\`\`\`

Start the local GraphQL server:

\`\`\`bash
yarn start:graphql
\`\`\`

Open \`http://localhost:3000\` to use GraphiQL, or send a request directly:

\`\`\`bash
curl http://localhost:3000 \
  --header 'Content-Type: application/json' \
  --data '{"query":"{ hello test { ok message } }"}'
\`\`\`

## Scripts

- \`yarn start\` - starts all runtime workspaces.
- \`yarn start:graphql\` - starts the GraphQL HTTP server.
- \`yarn build\` - builds all deployable outputs.
- \`yarn build:graphql\` - builds the GraphQL runtime to \`dist/graphql\`.
- \`yarn test\` - runs the Jest test suite.
- \`yarn lint\` - runs TypeScript, Prettier, and ESLint checks.
- \`yarn check\` - runs linting, builds, and tests.

## GraphQL

The root endpoint is handled by \`@p/graphql\`:

- \`GET /\` serves the embedded GraphiQL page.
- \`POST /\` executes GraphQL requests.

Current schema fields:

\`\`\`graphql
type Query {
  hello: String
  test: Test
}

type Test {
  ok: Boolean
  message: String
}

type Mutation {
  ping(message: String): String
}
\`\`\`

See the package and runtime READMEs for the detailed API and deployment notes:

- \`packages/graphql/README.md\`
- \`workspaces/graphql/README.md\`

## Project Guidance

These articles describe the development approach behind this preset and provide practical guidance for evolving a project on top of it:

- [Calm Development Environment: Node.js, Corepack, Yarn and Static Preview](https://vyriy.dev/blog/calm-development-setup/) - how to keep the local development environment predictable and easy to reproduce.
- [Calm App Structure for the Vyriy Ecosystem](https://vyriy.dev/blog/vyriy-calm-app-structure/) - a practical project structure for Vyriy applications: shared configs, small packages, thin workspaces, Storybook docs, tests, and deployable entry points.
- [One Handler, Many Runtimes](https://vyriy.dev/examples/one-handler-many-runtimes/) - how @vyriy/handler, @vyriy/router, and @vyriy/server compose a calm Lambda-compatible API that can run locally, in Docker, Fargate-style HTTP runtimes, and AWS Lambda.
- [Storybook as Project Documentation](https://vyriy.dev/blog/storybook-as-project-documentation/) - how to use Storybook as living project documentation and a component playground.
`,
    'doc.mdx': `import { Meta, Markdown } from '@storybook/addon-docs/blocks';
import ReadMe from './README.md?raw';

<Meta title="GraphQL API" />

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
            'start:graphql': 'sh workspaces/graphql/bin/start.sh',
            'lint:ts': 'tsc',
            'lint:prettier': 'prettier . --check',
            'lint:eslint': 'eslint .',
            'build:graphql': 'rimraf dist && sh workspaces/graphql/bin/build.sh',
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
            '@vyriy/handler': `^${packageJson.version}`,
            '@vyriy/server': `^${packageJson.version}`,
            '@vyriy/router': `^${packageJson.version}`,
            tsx: packageJson.peerDependencies.tsx,
            'webpack-cli': packageJson.peerDependencies['webpack-cli'],
            graphql: packageJson.peerDependencies.graphql,
            '@vyriy/html': `^${packageJson.version}`,
        },
    }, null, 2) + '\n',
    'packages/graphql/doc.mdx': `import { Meta, Markdown } from '@storybook/addon-docs/blocks';
import ReadMe from './README.md?raw';

<Meta title="Packages/GraphQL" />

<Markdown>{ReadMe}</Markdown>
`,
    'packages/graphql/graphiql.test.ts': `import { describe, expect, it } from '@jest/globals';

import { graphiql } from './graphiql.js';

describe('packages/graphql/graphiql.ts', () => {
  it('returns the embedded GraphiQL HTML page', () => {
    const page = graphiql();

    expect(page).toContain('<html lang="en">');
    expect(page).toContain('<title>GraphiQL</title>');
    expect(page).toContain('<meta charset="UTF-8"');
    expect(page).toContain('<div id="graphiql"><div class="loading">Loading');
    expect(page).toContain('https://esm.sh/graphiql@5.2.2/dist/style.css');
    expect(page).toContain('https://esm.sh/@graphiql/plugin-explorer@5.1.1/dist/style.css');
    expect(page).toContain('<script type="importmap">');
    expect(page).toContain('"graphiql": "https://esm.sh/graphiql@5.2.2?standalone');
    expect(page).toContain('const fetcher = createGraphiQLFetcher({');
    expect(page).toContain("url: 'http://localhost:3000'");
    expect(page).toContain('root.render(React.createElement(App));');
  });
});
`,
    'packages/graphql/graphiql.ts': `import { html, minify } from '@vyriy/html';

export const graphiql = () =>
  minify(
    html({
      htmlAttributes: 'lang="en"',
      title: '<title>GraphiQL</title>',
      meta: '<meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" />',
      link: [
        \`<link
          rel="stylesheet"
          href="https://esm.sh/graphiql@5.2.2/dist/style.css"
          integrity="sha384-f6GHLfCwoa4MFYUMd3rieGOsIVAte/evKbJhMigNdzUf52U9bV2JQBMQLke0ua+2"
          crossorigin="anonymous"
        />\`,
        \`<link
          rel="stylesheet"
          href="https://esm.sh/@graphiql/plugin-explorer@5.1.1/dist/style.css"
          integrity="sha384-vTFGj0krVqwFXLB7kq/VHR0/j2+cCT/B63rge2mULaqnib2OX7DVLUVksTlqvMab"
          crossorigin="anonymous"
        />\`,
      ].join(''),
      style: \`<style>
          body {
            margin: 0;
          }

          #graphiql {
            height: 100dvh;
          }

          .loading {
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 4rem;
          }
        </style>\`,
      script: [
        \`<script type="importmap">
          {
            "imports": {
              "react": "https://esm.sh/react@19.2.5",
              "react/": "https://esm.sh/react@19.2.5/",
              "react-dom": "https://esm.sh/react-dom@19.2.5",
              "react-dom/": "https://esm.sh/react-dom@19.2.5/",
              "graphiql": "https://esm.sh/graphiql@5.2.2?standalone&external=react,react-dom,@graphiql/react,graphql",
              "graphiql/": "https://esm.sh/graphiql@5.2.2/",
              "@graphiql/plugin-explorer": "https://esm.sh/@graphiql/plugin-explorer@5.1.1?standalone&external=react,@graphiql/react,graphql",
              "@graphiql/react": "https://esm.sh/@graphiql/react@0.37.3?standalone&external=react,react-dom,graphql,@graphiql/toolkit,@emotion/is-prop-valid",
              "@graphiql/toolkit": "https://esm.sh/@graphiql/toolkit@0.11.3?standalone&external=graphql",
              "graphql": "https://esm.sh/graphql@16.13.2",
              "@emotion/is-prop-valid": "data:text/javascript,"
            },
            "integrity": {
              "https://esm.sh/react@19.2.5": "sha384-ZNmUQ9QQgyl95nnD/FJTBQn2ZEPTbWtMuWCXTKWNuF6Si7nC+6bvSgk5LWu+ELHn",
              "https://esm.sh/react-dom@19.2.5": "sha384-qtNxBzn9gBs3CmJItMuvIVyjW3VIU0/rzGhCm9MippVU1BpR/c4VgaFYDIg/FrY2",
              "https://esm.sh/graphiql@5.2.2": "sha384-MBVZMq1pmz8DwpwIWPWLk2tmS6tGiSi6WwbXvy9NhuDYASAAWd2m96xbxLqszig9",
              "https://esm.sh/graphiql@5.2.2?standalone&external=react,react-dom,@graphiql/react,graphql": "sha384-SzHBEbcQfhvmwqh5Vtat9k7b/kIzmdVO3KMzQiAYwcxCA9x7vZwFRUgjzN1AeV3q",
              "https://esm.sh/@graphiql/plugin-explorer@5.1.1": "sha384-83REbLb9KtIhL/6J1n91SLoP0648KOKZLIDdHRx/a0E7T3ajq6PzKz+815SCfN52",
              "https://esm.sh/@graphiql/react@0.37.3?standalone&external=react,react-dom,graphql,@graphiql/toolkit,@emotion/is-prop-valid": "sha384-iZsbTy9B0VcX2BOTdqMuX0uJ9Hff5GbG2QeOt4OeMp0GHza76dwQaYQYNYkZkIVq",
              "https://esm.sh/@graphiql/toolkit@0.11.3?standalone&external=graphql": "sha384-ZsnupyYmzpNjF1Z/81zwi4nV352n4P7vm0JOFKiYnAwVGOf9twnEMnnxmxabMBXe",
              "https://esm.sh/graphql@16.13.2": "sha384-TQg9alwG3P9fzBErDW011vKuyTnrwpBZsl3SdMAh6DwBcv9ezFOl0djGI/68VOyy"
            }
          }
        </script>\`,
        \`<script type="module">
          import React from 'react';
          import ReactDOM from 'react-dom/client';
          import { GraphiQL, HISTORY_PLUGIN } from 'graphiql';
          import { createGraphiQLFetcher } from '@graphiql/toolkit';
          import { explorerPlugin } from '@graphiql/plugin-explorer';
          import 'graphiql/setup-workers/esm.sh';

          const fetcher = createGraphiQLFetcher({
            url: 'http://localhost:3000',
          });
          const plugins = [HISTORY_PLUGIN, explorerPlugin()];

          function App() {
            return React.createElement(GraphiQL, {
              fetcher,
              plugins,
              defaultEditorToolsVisibility: true,
            });
          }

          const container = document.getElementById('graphiql');
          const root = ReactDOM.createRoot(container);
          root.render(React.createElement(App));
        </script>\`,
      ].join(''),
      body: '<div id="graphiql"><div class="loading">Loading…</div></div>',
    }),
  );
`,
    'packages/graphql/index.test.ts': `import { describe, expect, it } from '@jest/globals';

import { router } from './router.js';

describe('packages/graphql/index.ts', () => {
  it('re-exports the GraphQL router', async () => {
    await expect(import('./index.js')).resolves.toMatchObject({
      router,
    });
  });
});
`,
    'packages/graphql/index.ts': "export * from './router.js';\n",
    'packages/graphql/package.json': `{
  "name": "@p/graphql",
  "type": "module",
  "private": true
}
`,
    'packages/graphql/README.md': `# GraphQL

Reusable GraphQL API package for the application.

The package owns the GraphQL schema, embeds the GraphiQL browser UI, and exposes an \`@vyriy/router\` router that can be mounted by an HTTP runtime.

## Public API

### \`router\`

\`router\` is the package public export. It handles the root GraphQL endpoint:

- \`GET /\` returns the embedded GraphiQL page with \`Content-Type: text/html; charset=UTF-8\`.
- \`POST /\` executes a GraphQL request body against the package schema.

\`\`\`ts
import { router } from '@p/graphql';

const response = await router.route(event);
\`\`\`

## GraphQL HTTP

\`POST /\` expects a JSON body with a GraphQL request:

\`\`\`json
{
  "query": "query Hello { hello }",
  "variables": {},
  "operationName": "Hello"
}
\`\`\`

Supported fields:

- \`query\` - required GraphQL query or mutation source.
- \`variables\` - optional GraphQL variables object.
- \`operationName\` - optional operation name used when the request contains more than one operation.

Successful requests return the standard GraphQL execution result as JSON:

\`\`\`json
{
  "data": {
    "hello": "Hello from GraphQL"
  }
}
\`\`\`

Invalid input returns a \`400\` response with a GraphQL-style \`errors\` array:

- Missing or invalid JSON body: \`Invalid JSON body\`
- Body without \`query\`: \`Missing GraphQL query\`

## Schema

The current schema supports these fields:

\`\`\`graphql
type Query {
  hello: String
  test: Test
}

type Test {
  ok: Boolean
  message: String
}

type Mutation {
  ping(message: String): String
}
\`\`\`

Example query:

\`\`\`graphql
query Status {
  hello
  test {
    ok
    message
  }
}
\`\`\`

Example mutation:

\`\`\`graphql
mutation Ping($message: String) {
  ping(message: $message)
}
\`\`\`

## GraphiQL

\`GET /\` serves the embedded GraphiQL page. The page loads GraphiQL, the explorer plugin, React, and GraphQL from pinned \`esm.sh\` URLs and configures the fetcher for \`http://localhost:3000\`.

## Tests

Run the package tests from the repository root:

\`\`\`bash
yarn jest packages/graphql --runInBand --coverage=false
\`\`\`
`,
    'packages/graphql/router.test.ts': `import { describe, expect, it } from '@jest/globals';
import type { APIGatewayProxyEvent, APIGatewayProxyResult } from '@vyriy/router';

import { router } from './router.js';

type GraphQLBody = {
  data?: Record<string, unknown> | null;
  errors?: Array<{
    message: string;
  }>;
};

const getPostEvent = (
  body: string | null,
  headers: APIGatewayProxyEvent['headers'] | null = {
    authorization: 'Bearer token',
  },
): APIGatewayProxyEvent =>
  ({
    body,
    headers,
    httpMethod: 'POST',
    path: '/',
    pathParameters: null,
    queryStringParameters: null,
  }) as unknown as APIGatewayProxyEvent;

const getEvent = (path = '/'): APIGatewayProxyEvent =>
  ({
    body: null,
    headers: {},
    httpMethod: 'GET',
    path,
    pathParameters: null,
    queryStringParameters: null,
  }) as unknown as APIGatewayProxyEvent;

const parseBody = <Value>(response: APIGatewayProxyResult): Value => JSON.parse(response.body) as Value;

describe('packages/graphql/router.ts', () => {
  it('serves the embedded GraphiQL page', async () => {
    const response = await router.route(getEvent());

    expect(response.statusCode).toBe(200);
    expect(response.headers).toEqual({
      'content-type': 'text/html; charset=UTF-8',
    });
    expect(response.body).toContain('<title>GraphiQL</title>');
    expect(response.body).toContain('<div id="graphiql">');
  });

  it('executes GraphQL requests', async () => {
    const response = await router.route(
      getPostEvent(
        JSON.stringify({
          query: 'query Hello { hello }',
          operationName: 'Hello',
        }),
      ),
    );

    expect(response.statusCode).toBe(200);
    expect(parseBody<GraphQLBody>(response)).toEqual({
      data: {
        hello: 'Hello from GraphQL',
      },
    });
  });

  it('passes variables to GraphQL execution', async () => {
    const response = await router.route(
      getPostEvent(
        JSON.stringify({
          query: 'mutation Ping($message: String) { ping(message: $message) }',
          variables: {
            message: 'from router',
          },
        }),
      ),
    );

    expect(response.statusCode).toBe(200);
    expect(parseBody<GraphQLBody>(response)).toEqual({
      data: {
        ping: 'pong: from router',
      },
    });
  });

  it('executes GraphQL requests without request headers', async () => {
    const response = await router.route(
      getPostEvent(
        JSON.stringify({
          query: '{ test { ok message } }',
        }),
        null,
      ),
    );

    expect(response.statusCode).toBe(200);
    expect(parseBody<GraphQLBody>(response)).toEqual({
      data: {
        test: {
          ok: true,
          message: 'GraphQL works',
        },
      },
    });
  });

  it('rejects missing bodies', async () => {
    await expect(router.route(getPostEvent(null))).resolves.toEqual({
      body: JSON.stringify({
        errors: [{ message: 'Invalid JSON body' }],
      }),
      statusCode: 400,
    });
  });

  it('rejects invalid JSON bodies', async () => {
    await expect(router.route(getPostEvent('{'))).resolves.toEqual({
      body: JSON.stringify({
        errors: [{ message: 'Invalid JSON body' }],
      }),
      statusCode: 400,
    });
  });

  it('rejects bodies without a GraphQL query', async () => {
    await expect(router.route(getPostEvent(JSON.stringify({ variables: {} })))).resolves.toEqual({
      body: JSON.stringify({
        errors: [{ message: 'Missing GraphQL query' }],
      }),
      statusCode: 400,
    });
  });
});
`,
    'packages/graphql/router.ts': `import { createRouter } from '@vyriy/router';

import { graphql } from 'graphql';

import { graphiql } from './graphiql.js';
import { schema } from './schema.js';

export const router = createRouter();

router.get('/', () => ({
  headers: {
    'content-type': 'text/html; charset=UTF-8',
  },
  body: graphiql(),
}));

router.post('/', async (params) => {
  let payload: {
    query?: string;
    variables?: Record<string, unknown>;
    operationName?: string;
  };

  if (!params.body) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        errors: [{ message: 'Invalid JSON body' }],
      }),
    };
  }

  try {
    payload = JSON.parse(params.body) as typeof payload;
  } catch {
    return {
      statusCode: 400,
      body: JSON.stringify({
        errors: [{ message: 'Invalid JSON body' }],
      }),
    };
  }

  if (!payload.query) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        errors: [{ message: 'Missing GraphQL query' }],
      }),
    };
  }

  return {
    body: JSON.stringify(
      await graphql({
        schema,
        source: payload.query,
        variableValues: payload.variables,
        operationName: payload.operationName,
        contextValue: {
          event: params.event,
          headers: params.headers ?? {},
        },
      }),
    ),
  };
});
`,
    'packages/graphql/schema.test.ts': `import { describe, expect, it } from '@jest/globals';
import { graphql } from 'graphql';

import { schema } from './schema.js';

describe('packages/graphql/schema.ts', () => {
  it('resolves query fields', async () => {
    await expect(
      graphql({
        schema,
        source: '{ hello test { ok message } }',
      }),
    ).resolves.toEqual({
      data: {
        hello: 'Hello from GraphQL',
        test: {
          ok: true,
          message: 'GraphQL works',
        },
      },
    });
  });

  it('resolves the ping mutation', async () => {
    await expect(
      graphql({
        schema,
        source: 'mutation Ping($message: String) { ping(message: $message) }',
        variableValues: {
          message: 'hello',
        },
      }),
    ).resolves.toEqual({
      data: {
        ping: 'pong: hello',
      },
    });
  });
});
`,
    'packages/graphql/schema.ts': `import { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLBoolean } from 'graphql';

const TestType = new GraphQLObjectType({
  name: 'Test',
  fields: {
    ok: {
      type: GraphQLBoolean,
    },
    message: {
      type: GraphQLString,
    },
  },
});

const QueryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    hello: {
      type: GraphQLString,
      resolve: () => 'Hello from GraphQL',
    },

    test: {
      type: TestType,
      resolve: () => ({
        ok: true,
        message: 'GraphQL works',
      }),
    },
  },
});

const MutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    ping: {
      type: GraphQLString,
      args: {
        message: {
          type: GraphQLString,
        },
      },
      resolve: (_source, args: { message: string }) => {
        return \`pong: \${args.message}\`;
      },
    },
  },
});

export const schema = new GraphQLSchema({
  query: QueryType,
  mutation: MutationType,
});
`,
    'workspaces/graphql/bin/build.sh': `#!/usr/bin/env sh

set -e

scriptdir="$PWD/workspaces/graphql";
distdir="dist/graphql";

NODE_ENV=production npx webpack --config $scriptdir/webpack.config.ts

cp $scriptdir/package.json $distdir/package.json
npm pkg delete "type" --prefix $distdir
npm pkg delete "private" --prefix $distdir
`,
    'workspaces/graphql/bin/start.sh': `#!/usr/bin/env sh

set -e

scriptdir="$PWD/workspaces/graphql";

NODE_ENV=production LOG_LEVEL=info tsx $scriptdir/index.ts
`,
    'workspaces/graphql/doc.mdx': `import { Meta, Markdown } from '@storybook/addon-docs/blocks';
import ReadMe from './README.md?raw';

<Meta title="Workspaces/GraphQL" />

<Markdown>{ReadMe}</Markdown>
`,
    'workspaces/graphql/index.test.ts': `import { describe, expect, it, jest } from '@jest/globals';
import type { APIGatewayProxyEvent } from '@vyriy/router';

const apiMock = jest.fn((handler) => ({
  handler,
}));
const serverMock = jest.fn();

jest.mock('@vyriy/handler', () => ({
  api: apiMock,
}));

jest.mock('@vyriy/server', () => ({
  server: serverMock,
}));

describe('workspaces/graphql/index.ts', () => {
  const getPostEvent = (body: string | null, path = '/'): APIGatewayProxyEvent =>
    ({
      body,
      headers: {},
      httpMethod: 'POST',
      path,
      pathParameters: null,
      queryStringParameters: null,
    }) as unknown as APIGatewayProxyEvent;

  const getEvent = (path = '/'): APIGatewayProxyEvent =>
    ({
      body: null,
      headers: {},
      httpMethod: 'GET',
      path,
      pathParameters: null,
      queryStringParameters: null,
    }) as unknown as APIGatewayProxyEvent;

  it('starts the server with the API router handler', async () => {
    await import('./index.js');

    expect(apiMock).toHaveBeenCalledTimes(1);
    expect(serverMock).toHaveBeenCalledTimes(1);
    expect(serverMock).toHaveBeenCalledWith(apiMock.mock.results[0]?.value);

    const handler = apiMock.mock.calls[0]?.[0] as (event: APIGatewayProxyEvent) => Promise<{
      body: string;
      headers?: Record<string, string>;
      statusCode: number;
    }>;

    await expect(
      handler(
        getPostEvent(
          JSON.stringify({
            query: '{ hello test { ok message } }',
          }),
        ),
      ),
    ).resolves.toEqual({
      body: JSON.stringify({
        data: {
          hello: 'Hello from GraphQL',
          test: {
            ok: true,
            message: 'GraphQL works',
          },
        },
      }),
      statusCode: 200,
    });

    const graphiqlResponse = await handler(getEvent());

    expect(graphiqlResponse).toEqual({
      body: expect.stringContaining('<title>GraphiQL</title>'),
      headers: {
        'content-type': 'text/html; charset=UTF-8',
      },
      statusCode: 200,
    });

    await expect(handler(getEvent('/healthcheck'))).resolves.toEqual({
      body: JSON.stringify({
        message: 'Not Found',
      }),
      statusCode: 404,
    });
  });
});
`,
    'workspaces/graphql/index.ts': `import { server } from '@vyriy/server';
import { api } from '@vyriy/handler';

import { router } from '@p/graphql';

server(api(router.handle()));
`,
    'workspaces/graphql/package.json': `{
  "name": "@w/graphql",
  "type": "module",
  "private": true
}
`,
    'workspaces/graphql/README.md': `# GraphQL

GraphQL runtime workspace for the application.

This workspace starts the HTTP server and mounts the reusable \`@p/graphql\` router through \`@vyriy/handler\` and \`@vyriy/server\`.

## Runtime

The workspace entrypoint is \`index.ts\`. It adapts API Gateway-style events with \`api()\` and passes the handler to \`server()\`:

\`\`\`ts
server(api(router.handle()));
\`\`\`

The shared router handles:

- \`GET /\` - serves the embedded GraphiQL page.
- \`POST /\` - executes GraphQL requests against the \`@p/graphql\` schema.

Other paths are handled by the router fallback and return \`404\`.

## Local Development

Start the local GraphQL server:

\`\`\`bash
yarn start:graphql
\`\`\`

The start script runs \`workspaces/graphql/index.ts\` with \`NODE_ENV=production\` and \`LOG_LEVEL=info\`.

Example request:

\`\`\`bash
curl http://localhost:3000 \
  --header 'Content-Type: application/json' \
  --data '{"query":"{ hello test { ok message } }"}'
\`\`\`

Open \`http://localhost:3000\` in a browser to use GraphiQL.

## Build

Build the deployable bundle:

\`\`\`bash
yarn build:graphql
\`\`\`

The build writes a CommonJS server bundle to \`dist/graphql/index.js\`, copies the workspace \`package.json\`, and removes deployment-irrelevant \`type\` and \`private\` fields from the generated package metadata.

## Tests

Run the workspace tests from the repository root:

\`\`\`bash
yarn jest workspaces/graphql --runInBand --coverage=false
\`\`\`
`,
    'workspaces/graphql/webpack.config.ts': `import { path } from '@vyriy/path';
import { ssr, external } from '@vyriy/webpack-config';

export default ssr(
  '@w/graphql',
  {
    path: path('dist', 'graphql'),
    filename: 'index.js',
    library: { type: 'commonjs2' },
  },
  (config) => ({
    ...config,
    externals: [external({ allowlist: [/^@p/, /^@w/, /^@vyriy/] })],
  }),
);
`,
});
