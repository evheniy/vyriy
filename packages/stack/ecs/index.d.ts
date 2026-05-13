import { Construct } from 'constructs';
import { AwsLogDriverProps, Cluster, ClusterProps, FargateTaskDefinition, FargateTaskDefinitionProps } from 'aws-cdk-lib/aws-ecs';
export { ContainerImage } from 'aws-cdk-lib/aws-ecs';
export declare const createCluster: (scope: Construct, id: string, props: ClusterProps) => Cluster;
export declare const createTaskDefinition: (scope: Construct, id: string, props: FargateTaskDefinitionProps) => FargateTaskDefinition;
export declare const setLogs: (props: AwsLogDriverProps) => import("aws-cdk-lib/aws-ecs").LogDriver;
