export type VyriyProjectKind = 'library' | 'api' | 'csr' | 'ssr' | 'ssg' | 'mfe' | 'fullstack' | 'aws-serverless' | 'empty';
export type VyriyPreset = 'library' | 'api' | 'react-csr' | 'react-ssr' | 'react-ssg' | 'mfe' | 'openmfe' | 'mfe-bff' | 'openmfe-bff' | 'fullstack' | 'aws-serverless' | 'empty';
export type VyriyFeature = 'typescript' | 'eslint' | 'prettier' | 'jest' | 'rest-api' | 'graphql-api' | 'react' | 'storybook' | 'webpack' | 'docker' | 'aws-cdk' | 'dynamodb' | 'lambda' | 'fargate' | 's3' | 'cloudfront' | 'openmfe' | 'bff';
export type VyriyPackagePlan = {
    readonly name: string;
    readonly kind: 'core' | 'ui' | 'api' | 'bff' | 'ssr' | 'ssg' | 'mfe' | 'contract';
    readonly publishable: boolean;
};
export type VyriyWorkspacePlan = {
    readonly name: string;
    readonly kind: 'web' | 'api' | 'ssr' | 'ssg' | 'storybook' | 'bff' | 'mfe' | 'openmfe' | 'cdk';
};
export type VyriyCiProvider = 'gitlab' | 'github';
export type VyriyCiPipeline = 'install' | 'typecheck' | 'lint' | 'prettier' | 'test' | 'build' | 'storybook' | 'docker' | 'npm-publish' | 'aws-deploy';
export type VyriyCiPlan = {
    readonly enabled: boolean;
    readonly providers: VyriyCiProvider[];
    readonly pipelines: VyriyCiPipeline[];
};
export type VyriyApiStyle = 'rest' | 'graphql' | 'mixed';
export type VyriyApiRuntime = 'node' | 'lambda' | 'fargate';
export type VyriyApiPlan = {
    readonly enabled: boolean;
    readonly style: VyriyApiStyle;
    readonly runtime: VyriyApiRuntime;
    readonly rest?: {
        readonly router: 'vyriy-router';
        readonly packageName: '@vyriy/router';
    };
    readonly graphql?: {
        readonly packageName: 'graphql';
    };
};
export type VyriyProjectPlan = {
    readonly projectName: string;
    readonly targetDirectory: string;
    readonly packageScope: string;
    readonly description: string;
    readonly projectKind: VyriyProjectKind;
    readonly preset: VyriyPreset;
    readonly features: VyriyFeature[];
    readonly packages: VyriyPackagePlan[];
    readonly workspaces: VyriyWorkspacePlan[];
    readonly ci: VyriyCiPlan;
    readonly api?: VyriyApiPlan;
};
