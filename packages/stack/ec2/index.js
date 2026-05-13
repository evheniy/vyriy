import { InterfaceVpcEndpoint, SecurityGroup, SubnetType, Vpc, } from 'aws-cdk-lib/aws-ec2';
export { SubnetType };
export const findVpc = (scope, id, props) => Vpc.fromLookup(scope, id, props);
export const createSecurityGroup = (scope, id, props) => new SecurityGroup(scope, id, props);
export const createVpcEndpoint = (scope, id, props) => new InterfaceVpcEndpoint(scope, id, props);
export const createVpc = (scope, id, props) => new Vpc(scope, id, {
    maxAzs: 2,
    subnetConfiguration: [
        {
            name: 'Public',
            subnetType: SubnetType.PUBLIC,
        },
        {
            name: 'Private',
            subnetType: SubnetType.PRIVATE_WITH_EGRESS,
        },
    ],
    ...props,
});
