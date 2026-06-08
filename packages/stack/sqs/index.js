import { Queue } from 'aws-cdk-lib/aws-sqs';
export const createQueue = (scope, id, props = {}) => new Queue(scope, id, props);
export const fromQueueArn = (scope, id, queueArn) => Queue.fromQueueArn(scope, id, queueArn);
export const fromQueueAttributes = (scope, id, attrs) => Queue.fromQueueAttributes(scope, id, attrs);
