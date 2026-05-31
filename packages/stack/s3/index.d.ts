import { Construct } from 'constructs';
import { Bucket, BucketProps } from 'aws-cdk-lib/aws-s3';
export { RedirectProtocol } from 'aws-cdk-lib/aws-s3';
export declare const createBucket: (scope: Construct, id: string, props?: BucketProps) => Bucket;
