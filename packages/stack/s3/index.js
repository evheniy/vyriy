import { RemovalPolicy } from 'aws-cdk-lib';
import { BlockPublicAccess, Bucket, HttpMethods, BucketEncryption } from 'aws-cdk-lib/aws-s3';
export { RedirectProtocol } from 'aws-cdk-lib/aws-s3';
export const createBucket = (scope, id, props = {}) => {
    const bucketProps = {
        removalPolicy: RemovalPolicy.DESTROY,
        autoDeleteObjects: true,
        versioned: false,
        publicReadAccess: false,
        blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
        cors: [
            {
                allowedMethods: [HttpMethods.GET, HttpMethods.HEAD],
                allowedOrigins: ['*'],
                allowedHeaders: ['*'],
            },
        ],
        encryption: BucketEncryption.S3_MANAGED,
        ...props,
    };
    return new Bucket(scope, id, bucketProps);
};
