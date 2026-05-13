import { Construct } from 'constructs';
import { ParameterValueType, SecureStringParameterAttributes, StringParameterAttributes } from 'aws-cdk-lib/aws-ssm';
export type { ParameterValueType };
export declare const fromStringParameterName: (scope: Construct, id: string, stringParameterName: string) => import("aws-cdk-lib/aws-ssm").IStringParameter;
export declare const fromStringParameterAttributes: (scope: Construct, id: string, attrs: StringParameterAttributes) => import("aws-cdk-lib/aws-ssm").IStringParameter;
export declare const fromSecureStringParameterAttributes: (scope: Construct, id: string, attrs: SecureStringParameterAttributes) => import("aws-cdk-lib/aws-ssm").IStringParameter;
export declare const valueForStringParameter: (scope: Construct, stringParameterName: string) => string;
