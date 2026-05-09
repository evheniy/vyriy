import { Construct } from 'constructs';
import { AddBehaviorOptions, Distribution, DistributionProps, Function as CloudFrontFunction, FunctionEventType, FunctionProps, OriginProtocolPolicy, ViewerProtocolPolicy } from 'aws-cdk-lib/aws-cloudfront';
import { HttpOrigin } from 'aws-cdk-lib/aws-cloudfront-origins';
import { Bucket } from 'aws-cdk-lib/aws-s3';
export { FunctionEventType, OriginProtocolPolicy, ViewerProtocolPolicy };
export interface CreateCloudFrontFunctionProps extends Omit<FunctionProps, 'code'> {
    readonly code: string;
}
export declare const createDistribution: (scope: Construct, id: string, props: DistributionProps) => Distribution;
export declare const createCloudFrontFunction: (scope: Construct, id: string, props: CreateCloudFrontFunctionProps) => CloudFrontFunction;
export declare const createDefaultBehavior: (bucket: Bucket, options?: AddBehaviorOptions) => {
    allowedMethods?: import("aws-cdk-lib/aws-cloudfront").AllowedMethods;
    cachedMethods?: import("aws-cdk-lib/aws-cloudfront").CachedMethods;
    cachePolicy?: import("aws-cdk-lib/aws-cloudfront").ICachePolicyRef;
    compress?: boolean;
    originRequestPolicy?: import("aws-cdk-lib/aws-cloudfront").IOriginRequestPolicyRef;
    realtimeLogConfig?: import("aws-cdk-lib/aws-cloudfront").IRealtimeLogConfigRef;
    responseHeadersPolicy?: import("aws-cdk-lib/aws-cloudfront").IResponseHeadersPolicyRef;
    smoothStreaming?: boolean;
    viewerProtocolPolicy: ViewerProtocolPolicy;
    functionAssociations?: import("aws-cdk-lib/aws-cloudfront").FunctionAssociation[];
    edgeLambdas?: import("aws-cdk-lib/aws-cloudfront").EdgeLambda[];
    trustedKeyGroups?: import("aws-cdk-lib/aws-cloudfront").IKeyGroupRef[];
    enableGrpc?: boolean;
    origin: import("aws-cdk-lib/aws-cloudfront").IOrigin;
};
export declare const createWebsiteRedirectBehavior: (bucket: Bucket, options?: AddBehaviorOptions) => {
    allowedMethods?: import("aws-cdk-lib/aws-cloudfront").AllowedMethods;
    cachedMethods?: import("aws-cdk-lib/aws-cloudfront").CachedMethods;
    cachePolicy?: import("aws-cdk-lib/aws-cloudfront").ICachePolicyRef;
    compress?: boolean;
    originRequestPolicy?: import("aws-cdk-lib/aws-cloudfront").IOriginRequestPolicyRef;
    realtimeLogConfig?: import("aws-cdk-lib/aws-cloudfront").IRealtimeLogConfigRef;
    responseHeadersPolicy?: import("aws-cdk-lib/aws-cloudfront").IResponseHeadersPolicyRef;
    smoothStreaming?: boolean;
    viewerProtocolPolicy: ViewerProtocolPolicy;
    functionAssociations?: import("aws-cdk-lib/aws-cloudfront").FunctionAssociation[];
    edgeLambdas?: import("aws-cdk-lib/aws-cloudfront").EdgeLambda[];
    trustedKeyGroups?: import("aws-cdk-lib/aws-cloudfront").IKeyGroupRef[];
    enableGrpc?: boolean;
    origin: HttpOrigin;
};
