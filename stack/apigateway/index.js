import { AwsIntegration, BasePathMapping, DomainName, EndpointType, LambdaIntegration, RestApi, } from 'aws-cdk-lib/aws-apigateway';
export { RestApi, EndpointType, Model } from 'aws-cdk-lib/aws-apigateway';
export const createApiGateway = (scope, id, props) => {
    const { defaultIntegration, ...rest } = props;
    const apiProps = {
        deployOptions: {
            stageName: 'api',
            methodOptions: {
                '/*/*': {
                    throttlingRateLimit: 100,
                    throttlingBurstLimit: 200,
                },
            },
        },
        defaultIntegration,
        endpointTypes: [EndpointType.EDGE],
        ...rest,
    };
    const apiGateway = new RestApi(scope, id, apiProps);
    apiGateway.root.addProxy({ anyMethod: true, defaultIntegration });
    return apiGateway;
};
export const createIntegration = (lambda, options) => new LambdaIntegration(lambda, options);
export const createDomainName = (scope, id, props) => new DomainName(scope, id, {
    endpointType: EndpointType.EDGE,
    ...props,
});
export const createBasePathMapping = (scope, id, props) => new BasePathMapping(scope, id, props);
export const createAwsIntegration = (props) => new AwsIntegration(props);
