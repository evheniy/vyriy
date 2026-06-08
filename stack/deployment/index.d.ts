import { Construct } from 'constructs';
import { BucketDeployment, BucketDeploymentProps, CacheControl } from 'aws-cdk-lib/aws-s3-deployment';
export { Source, CacheControl } from 'aws-cdk-lib/aws-s3-deployment';
export declare const createBucketDeployment: (scope: Construct, id: string, props: BucketDeploymentProps) => BucketDeployment;
export declare const createImmutableCacheControl: (days?: number) => CacheControl[];
export declare const createHtmlCacheControl: () => CacheControl[];
