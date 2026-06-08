import { Construct } from 'constructs';
import { Bucket, BucketProps } from 'aws-cdk-lib/aws-s3';
export { RedirectProtocol, type BucketProps } from 'aws-cdk-lib/aws-s3';
export declare const findBucket: (scope: Construct, id: string, bucketName: string) => import("aws-cdk-lib/aws-s3").IBucket;
export declare const createBucket: (scope: Construct, id: string, props?: BucketProps) => Bucket;
