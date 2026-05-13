import { Construct } from 'constructs';
import { IVpc, InterfaceVpcEndpoint, InterfaceVpcEndpointProps, SecurityGroup, SecurityGroupProps, SubnetType, Vpc, VpcLookupOptions } from 'aws-cdk-lib/aws-ec2';
export { SubnetType };
export type { IVpc, SecurityGroup };
export declare const findVpc: (scope: Construct, id: string, props: VpcLookupOptions) => IVpc;
export declare const createSecurityGroup: (scope: Construct, id: string, props: SecurityGroupProps) => SecurityGroup;
export declare const createVpcEndpoint: (scope: Construct, id: string, props: InterfaceVpcEndpointProps) => InterfaceVpcEndpoint;
export declare const createVpc: (scope: Construct, id: string, props?: Omit<Vpc, "subnetConfiguration">) => Vpc;
