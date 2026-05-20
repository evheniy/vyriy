export type VyriyProjectKind = 'library' | 'api' | 'csr' | 'ssr' | 'ssg' | 'mfe' | 'fullstack' | 'empty';
export type VyriyPreset = 'empty' | 'library' | 'api' | 'ssr' | 'ssg' | 'csr' | 'fullstack' | 'mfe';
export type VyriyFeature = 'typescript' | 'eslint' | 'prettier' | 'jest' | 'rest-api' | 'graphql-api' | 'react' | 'storybook' | 'webpack' | 'docker' | 'aws-cdk' | 'apigateway' | 'lambda' | 'fargate' | 's3' | 'cloudfront' | 'openmfe';
export type VyriyPackagePlan = {
    readonly name: string;
    readonly kind: 'core' | 'ui' | 'api' | 'services' | 'stack' | 'config' | 'utils' | 'components' | 'app';
    readonly publishable: boolean;
};
export type VyriyWorkspacePlan = {
    readonly name: string;
    readonly kind: 'api' | 'ui' | 'stack' | 'lambda' | 'fargate';
};
export type VyriyCiProvider = 'gitlab' | 'github';
export type VyriyCiPipeline = 'install' | 'lint' | 'test' | 'build' | 'deploy' | 'smoke' | 'e2e';
export type VyriyCiPlan = {
    readonly enabled: boolean;
    readonly providers: VyriyCiProvider[];
    readonly pipelines: VyriyCiPipeline[];
};
export type VyriyApiStyle = 'rest' | 'graphql';
export type VyriyApiRuntime = 'docker' | 'lambda';
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
