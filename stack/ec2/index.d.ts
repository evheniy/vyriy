import { Construct } from 'constructs';
import { InterfaceVpcEndpoint, InterfaceVpcEndpointProps, SecurityGroup, SecurityGroupProps, Vpc, VpcLookupOptions } from 'aws-cdk-lib/aws-ec2';
export { SubnetType } from 'aws-cdk-lib/aws-ec2';
export type { IVpc, SecurityGroup } from 'aws-cdk-lib/aws-ec2';
export declare const findVpc: (scope: Construct, id: string, props: VpcLookupOptions) => import("aws-cdk-lib/aws-ec2").IVpc;
export declare const createSecurityGroup: (scope: Construct, id: string, props: SecurityGroupProps) => SecurityGroup;
export declare const createVpcEndpoint: (scope: Construct, id: string, props: InterfaceVpcEndpointProps) => InterfaceVpcEndpoint;
export declare const createVpc: (scope: Construct, id: string, props?: Omit<Vpc, "subnetConfiguration">) => Vpc;
