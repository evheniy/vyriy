import { Duration } from 'aws-cdk-lib';
import { BucketDeployment, CacheControl } from 'aws-cdk-lib/aws-s3-deployment';
export { Source, CacheControl } from 'aws-cdk-lib/aws-s3-deployment';
export const createBucketDeployment = (scope, id, props) => new BucketDeployment(scope, id, {
    memoryLimit: 512,
    ...props,
});
export const createImmutableCacheControl = (days = 365) => [
    CacheControl.setPublic(),
    CacheControl.maxAge(Duration.days(days)),
    CacheControl.immutable(),
];
export const createHtmlCacheControl = () => [
    CacheControl.setPublic(),
    CacheControl.maxAge(Duration.seconds(0)),
    CacheControl.mustRevalidate(),
];
