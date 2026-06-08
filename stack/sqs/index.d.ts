import { Construct } from 'constructs';
import { Queue, QueueProps } from 'aws-cdk-lib/aws-sqs';
export declare const createQueue: (scope: Construct, id: string, props?: QueueProps) => Queue;
export declare const fromQueueArn: (scope: Construct, id: string, queueArn: string) => import("aws-cdk-lib/aws-sqs").IQueue;
export declare const fromQueueAttributes: (scope: Construct, id: string, attrs: {
    queueArn: string;
    queueUrl: string;
}) => import("aws-cdk-lib/aws-sqs").IQueue;
