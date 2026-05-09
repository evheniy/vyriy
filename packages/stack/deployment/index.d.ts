import { Construct } from 'constructs';
import { BucketDeployment, BucketDeploymentProps, CacheControl, Source } from 'aws-cdk-lib/aws-s3-deployment';
export { Source, CacheControl };
export declare const createBucketDeployment: (scope: Construct, id: string, props: BucketDeploymentProps) => BucketDeployment;
export declare const createImmutableCacheControl: (days?: number) => CacheControl[];
