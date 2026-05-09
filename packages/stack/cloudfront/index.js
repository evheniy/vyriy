import { Distribution, Function as CloudFrontFunction, FunctionCode, FunctionEventType, OriginProtocolPolicy, ViewerProtocolPolicy, } from 'aws-cdk-lib/aws-cloudfront';
import { HttpOrigin, S3BucketOrigin } from 'aws-cdk-lib/aws-cloudfront-origins';
export { FunctionEventType, OriginProtocolPolicy, ViewerProtocolPolicy };
export const createDistribution = (scope, id, props) => new Distribution(scope, id, props);
export const createCloudFrontFunction = (scope, id, props) => new CloudFrontFunction(scope, id, {
    ...props,
    code: FunctionCode.fromInline(props.code),
});
export const createDefaultBehavior = (bucket, options = {}) => ({
    origin: S3BucketOrigin.withOriginAccessControl(bucket),
    viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
    ...options,
});
export const createWebsiteRedirectBehavior = (bucket, options = {}) => ({
    origin: new HttpOrigin(bucket.bucketWebsiteDomainName, {
        protocolPolicy: OriginProtocolPolicy.HTTP_ONLY,
    }),
    viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
    ...options,
});
