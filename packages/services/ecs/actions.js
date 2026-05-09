import { RunTaskCommand } from '@aws-sdk/client-ecs';
import { getEcsClusterName, getEcsTaskDefinition, getVpcSecurityGroup, getVpcSubnets } from '@vyriy/env';
import { createLogger } from '@vyriy/logger';
import { client } from './client.js';
export const runTask = async (task, environment = [], taskDefinition = getEcsTaskDefinition()) => {
    const cluster = getEcsClusterName();
    const subnets = getVpcSubnets();
    const securityGroup = getVpcSecurityGroup();
    if (!cluster) {
        throw new Error('Cluster must be set!');
    }
    if (!taskDefinition) {
        throw new Error('Task definition must be set!');
    }
    if (!subnets) {
        throw new Error('Subnets must be set!');
    }
    if (!securityGroup) {
        throw new Error('SecurityGroup must be set!');
    }
    const params = {
        cluster,
        taskDefinition,
        launchType: 'FARGATE',
        count: 1,
        networkConfiguration: {
            awsvpcConfiguration: {
                assignPublicIp: 'ENABLED',
                subnets: subnets.split(','),
                securityGroups: [securityGroup],
            },
        },
        overrides: {
            containerOverrides: [
                {
                    name: task,
                    environment: [
                        {
                            name: 'TASK',
                            value: task,
                        },
                        ...environment,
                    ],
                },
            ],
        },
    };
    createLogger().info('Params:', params);
    await client.send(new RunTaskCommand(params));
};
