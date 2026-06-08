import { Construct } from 'constructs';
import { IStringParameter, ParameterTier, SecureStringParameterAttributes, StringParameterAttributes } from 'aws-cdk-lib/aws-ssm';
export interface ManualStringParameterProps {
    allowedPattern?: string;
    dataType?: string;
    description?: string;
    initialValue?: string;
    parameterName: string;
    simpleName?: boolean;
    tier?: ParameterTier;
}
export type { ParameterValueType } from 'aws-cdk-lib/aws-ssm';
export { ParameterTier } from 'aws-cdk-lib/aws-ssm';
export declare const createManualStringParameter: (scope: Construct, id: string, props: ManualStringParameterProps) => IStringParameter;
export declare const fromStringParameterName: (scope: Construct, id: string, stringParameterName: string) => IStringParameter;
export declare const fromStringParameterAttributes: (scope: Construct, id: string, attrs: StringParameterAttributes) => IStringParameter;
export declare const fromSecureStringParameterAttributes: (scope: Construct, id: string, attrs: SecureStringParameterAttributes) => IStringParameter;
export declare const valueForStringParameter: (scope: Construct, stringParameterName: string) => string;
