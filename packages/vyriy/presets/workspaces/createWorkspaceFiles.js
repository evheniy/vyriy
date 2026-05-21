import { json, packageVersion, publishedPackageJson } from '../config.js';
const getWorkspacePath = (workspacePlan) => workspacePlan.kind === 'lambda' && workspacePlan.name === 'api'
    ? `workspaces/lambda/${workspacePlan.name}`
    : `workspaces/${workspacePlan.name}`;
const getWorkspacePackageName = ({ packageScope, workspacePlan, }) => workspacePlan.kind === 'lambda' && workspacePlan.name === 'api'
    ? `${packageScope}/lambda-api-workspace`
    : `${packageScope}/${workspacePlan.name}-workspace`;
const isApiWorkspace = (workspacePlan) => [
    'api',
    'lambda',
    'fargate',
].includes(workspacePlan.kind);
const createApiWorkspaceDependencies = (workspacePlan) => isApiWorkspace(workspacePlan)
    ? {
        '@vyriy/handler': packageVersion(publishedPackageJson.version),
        '@vyriy/server': packageVersion(publishedPackageJson.version),
    }
    : {};
const createApiHandlerFile = (workspacePath) => ({
    path: `${workspacePath}/handler.ts`,
    content: `import { api } from '@vyriy/handler';

export const handler = api(async (event) => ({
  statusCode: 200,
  body: JSON.stringify({
    path: event.path,
  }),
}));
`,
});
const createApiServerFile = ({ entrypoint, workspacePath, }) => ({
    path: `${workspacePath}/${entrypoint}`,
    content: `import { server } from '@vyriy/server';

import { handler } from './handler.js';

server(handler);
`,
});
const createDockerfile = (workspacePath) => ({
    path: `${workspacePath}/Dockerfile`,
    content: `FROM node:24-alpine

WORKDIR /app

COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn ./.yarn
COPY packages ./packages
COPY workspaces ./workspaces

RUN corepack enable && yarn install --immutable
RUN yarn build

CMD ["node", "workspaces/api/index.js"]
`,
});
const createApiWorkspaceFiles = (plan, workspacePlan) => {
    const workspacePath = getWorkspacePath(workspacePlan);
    const isLambda = workspacePlan.kind === 'lambda';
    return [
        createApiHandlerFile(workspacePath),
        createApiServerFile({ entrypoint: isLambda ? 'server.ts' : 'index.ts', workspacePath }),
        {
            path: `${workspacePath}/${workspacePlan.name}.test.ts`,
            content: "import { describe, expect, it } from '@jest/globals';\n\nimport { handler } from './handler.js';\n\ndescribe('api workspace', () => {\n  it('exports a handler', () => {\n    expect(handler).toEqual(expect.any(Function));\n  });\n});\n",
        },
        ...(plan.features.includes('docker') && !isLambda ? [createDockerfile(workspacePath)] : []),
    ];
};
export const createWorkspaceFiles = (plan, workspacePlan) => {
    const workspacePath = getWorkspacePath(workspacePlan);
    const dependencies = createApiWorkspaceDependencies(workspacePlan);
    return [
        {
            path: `${workspacePath}/package.json`,
            content: json({
                name: getWorkspacePackageName({ packageScope: plan.packageScope, workspacePlan }),
                version: '0.0.0',
                private: true,
                type: 'module',
                main: workspacePlan.kind === 'lambda' ? 'server.js' : 'index.js',
                ...(Object.keys(dependencies).length > 0 ? { dependencies } : {}),
            }),
        },
        ...(isApiWorkspace(workspacePlan)
            ? createApiWorkspaceFiles(plan, workspacePlan)
            : [
                {
                    path: `${workspacePath}/index.ts`,
                    content: 'export type WorkspaceName = string;\n',
                },
                {
                    path: `${workspacePath}/${workspacePlan.name}.test.ts`,
                    content: "import { describe, expect, it } from '@jest/globals';\n\ndescribe('workspace', () => {\n  it('has a test harness', () => {\n    expect(true).toBe(true);\n  });\n});\n",
                },
            ]),
    ];
};
