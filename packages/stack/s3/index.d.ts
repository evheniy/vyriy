import { Construct } from 'constructs';
import { Bucket, BucketProps, RedirectProtocol } from 'aws-cdk-lib/aws-s3';
export { RedirectProtocol };
export declare const createBucket: (scope: Construct, id: string, props?: BucketProps) => Bucket;
