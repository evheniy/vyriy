import { Distribution, Function as CloudFrontFunction, FunctionCode, FunctionEventType, OriginProtocolPolicy, ViewerProtocolPolicy, } from 'aws-cdk-lib/aws-cloudfront';
import { HttpOrigin, S3BucketOrigin } from 'aws-cdk-lib/aws-cloudfront-origins';
export { FunctionEventType, OriginProtocolPolicy, ViewerProtocolPolicy } from 'aws-cdk-lib/aws-cloudfront';
export const findDistribution = (scope, id, props) => Distribution.fromDistributionAttributes(scope, id, props);
export const createDistribution = (scope, id, props) => new Distribution(scope, id, props);
export const createCloudFrontFunction = (scope, id, props) => new CloudFrontFunction(scope, id, {
    ...props,
    code: FunctionCode.fromInline(props.code),
});
export const createIndexRewriteFunctionCode = ({ rootDomain, wwwDomain }) => `
function handler(event) {
  var request = event.request;
  var host = request.headers.host.value;

  if (host === ${JSON.stringify(wwwDomain)}) {
    return {
      statusCode: 301,
      statusDescription: 'Moved Permanently',
      headers: {
        location: {
          value: ${JSON.stringify(`https://${rootDomain}`)} + request.uri,
        },
      },
    };
  }

  var uri = request.uri;
  var lastSegment = uri.split('/').pop();

  if (uri.endsWith('/')) {
    request.uri = uri + 'index.html';
  } else if (!lastSegment.includes('.')) {
    request.uri = uri + '/index.html';
  }

  return request;
}
`;
export const createFunctionAssociations = (scope, id, { rootDomain, wwwDomain, ...props }) => [
    {
        eventType: FunctionEventType.VIEWER_REQUEST,
        function: createCloudFrontFunction(scope, id, {
            ...props,
            code: createIndexRewriteFunctionCode({ rootDomain, wwwDomain }),
        }),
    },
];
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
