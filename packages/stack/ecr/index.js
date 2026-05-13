import { RemovalPolicy } from 'aws-cdk-lib';
import { Repository } from 'aws-cdk-lib/aws-ecr';
export const createRepository = (scope, id, props) => new Repository(scope, id, {
    removalPolicy: RemovalPolicy.DESTROY,
    lifecycleRules: [{ maxImageCount: 3 }],
    emptyOnDelete: true,
    ...props,
});
