import { Cluster, FargateTaskDefinition, LogDrivers, } from 'aws-cdk-lib/aws-ecs';
import { RetentionDays } from 'aws-cdk-lib/aws-logs';
export { ContainerImage } from 'aws-cdk-lib/aws-ecs';
export const createCluster = (scope, id, props) => new Cluster(scope, id, props);
export const createTaskDefinition = (scope, id, props) => new FargateTaskDefinition(scope, id, props);
export const setLogs = (props) => LogDrivers.awsLogs({
    logRetention: RetentionDays.ONE_WEEK,
    ...props,
});
