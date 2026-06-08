import { App } from 'aws-cdk-lib';
import { existsEnv, getCdkAccount, getCdkRegion, getStage, isFeature, isHotfix } from '@vyriy/env';
import { getPackage } from '@vyriy/package';
import { id } from './id.js';
export const stack = (CdkStack) => {
    if (!existsEnv('STAGE')) {
        throw new Error([
            'STAGE is required for AWS CDK stacks.',
            'Set STAGE to an explicit cloud deployment stage, for example "dev", "staging", or "production".',
            'The default "local" stage is only for local development and cannot be deployed to AWS.',
        ].join('\n'));
    }
    const stackName = id();
    const { name: service, description, version } = getPackage();
    return new CdkStack(new App(), stackName, {
        stackName,
        description,
        env: {
            account: getCdkAccount(),
            region: getCdkRegion(),
        },
        tags: {
            service,
            env: getStage(),
            version,
        },
        terminationProtection: !isFeature() && !isHotfix(),
    });
};
