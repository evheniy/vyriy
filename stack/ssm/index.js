import { ArnFormat, Stack } from 'aws-cdk-lib';
import { AwsCustomResource, AwsCustomResourcePolicy, PhysicalResourceId } from 'aws-cdk-lib/custom-resources';
import { StringParameter, } from 'aws-cdk-lib/aws-ssm';
export { ParameterTier } from 'aws-cdk-lib/aws-ssm';
const defaultManualParameterInitialValue = 'CHANGE_ME';
const parameterArn = (scope, parameterName) => Stack.of(scope).formatArn({
    arnFormat: ArnFormat.SLASH_RESOURCE_NAME,
    service: 'ssm',
    resource: 'parameter',
    resourceName: parameterName.replace(/^\//, ''),
});
const definedParameterProps = (props) => ({
    ...(props.allowedPattern === undefined ? {} : { AllowedPattern: props.allowedPattern }),
    ...(props.dataType === undefined ? {} : { DataType: props.dataType }),
    ...(props.description === undefined ? {} : { Description: props.description }),
    ...(props.tier === undefined ? {} : { Tier: props.tier }),
});
export const createManualStringParameter = (scope, id, props) => {
    const { initialValue = defaultManualParameterInitialValue, parameterName, simpleName } = props;
    const resource = new AwsCustomResource(scope, `${id}Resource`, {
        installLatestAwsSdk: false,
        onCreate: {
            action: 'putParameter',
            parameters: {
                ...definedParameterProps(props),
                Name: parameterName,
                Overwrite: false,
                Type: 'String',
                Value: initialValue,
            },
            physicalResourceId: PhysicalResourceId.of(parameterName),
            service: 'SSM',
        },
        onDelete: {
            action: 'deleteParameter',
            ignoreErrorCodesMatching: 'ParameterNotFound',
            parameters: {
                Name: parameterName,
            },
            service: 'SSM',
        },
        policy: AwsCustomResourcePolicy.fromSdkCalls({
            resources: [parameterArn(scope, parameterName)],
        }),
    });
    const parameter = StringParameter.fromStringParameterAttributes(scope, id, {
        parameterName,
        simpleName,
    });
    parameter.node.addDependency(resource);
    return parameter;
};
export const fromStringParameterName = (scope, id, stringParameterName) => StringParameter.fromStringParameterName(scope, id, stringParameterName);
export const fromStringParameterAttributes = (scope, id, attrs) => StringParameter.fromStringParameterAttributes(scope, id, attrs);
export const fromSecureStringParameterAttributes = (scope, id, attrs) => StringParameter.fromSecureStringParameterAttributes(scope, id, attrs);
export const valueForStringParameter = (scope, stringParameterName) => StringParameter.valueForStringParameter(scope, stringParameterName);
