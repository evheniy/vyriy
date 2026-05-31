import { StringParameter } from 'aws-cdk-lib/aws-ssm';
export const fromStringParameterName = (scope, id, stringParameterName) => StringParameter.fromStringParameterName(scope, id, stringParameterName);
export const fromStringParameterAttributes = (scope, id, attrs) => StringParameter.fromStringParameterAttributes(scope, id, attrs);
export const fromSecureStringParameterAttributes = (scope, id, attrs) => StringParameter.fromSecureStringParameterAttributes(scope, id, attrs);
export const valueForStringParameter = (scope, stringParameterName) => StringParameter.valueForStringParameter(scope, stringParameterName);
