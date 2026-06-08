import { Duration, RemovalPolicy } from 'aws-cdk-lib';
import { FunctionUrl, Function as LambdaFunction, Runtime, } from 'aws-cdk-lib/aws-lambda';
import { LogGroup, RetentionDays } from 'aws-cdk-lib/aws-logs';
export { SqsEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';
export { Code, Runtime, LayerVersion } from 'aws-cdk-lib/aws-lambda';
export const createLambda = (scope, id, props) => {
    const { functionName, code, handler, runtime = Runtime.NODEJS_24_X, timeout = Duration.seconds(29), memorySize = 128, environment = {}, ...rest } = props;
    const lambdaFunction = new LambdaFunction(scope, id, {
        functionName,
        code,
        handler,
        runtime,
        timeout,
        memorySize,
        environment: {
            NODE_ENV: 'production',
            ...environment,
        },
        logGroup: new LogGroup(scope, `${id}LogGroup`, {
            retention: RetentionDays.ONE_WEEK,
            removalPolicy: RemovalPolicy.DESTROY,
        }),
        ...rest,
    });
    return lambdaFunction;
};
export const createFunctionUrl = (scope, id, props) => new FunctionUrl(scope, id, props);
