import { Construct } from 'constructs';
import { FunctionProps, FunctionUrl, FunctionUrlProps, Function as LambdaFunction, Runtime } from 'aws-cdk-lib/aws-lambda';
export { SqsEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';
export { Code, Runtime, LayerVersion } from 'aws-cdk-lib/aws-lambda';
export type { Function as LambdaFunction, FunctionProps } from 'aws-cdk-lib/aws-lambda';
export declare const createLambda: (scope: Construct, id: string, props: Omit<FunctionProps, "runtime"> & {
    runtime?: Runtime;
}) => LambdaFunction;
export declare const createFunctionUrl: (scope: Construct, id: string, props: FunctionUrlProps) => FunctionUrl;
