import { Construct } from 'constructs';
import { Code, FunctionProps, FunctionUrl, FunctionUrlProps, Function as LambdaFunction, LayerVersion, Runtime } from 'aws-cdk-lib/aws-lambda';
export { SqsEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';
export { Code, Runtime, LayerVersion };
export type { LambdaFunction, FunctionProps };
export declare const createLambda: (scope: Construct, id: string, props: Omit<FunctionProps, "runtime"> & {
    runtime?: Runtime;
}) => LambdaFunction;
export declare const createFunctionUrl: (scope: Construct, id: string, props: FunctionUrlProps) => FunctionUrl;
