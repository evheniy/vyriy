import { Topic } from 'aws-cdk-lib/aws-sns';
export const createTopic = (scope, id, props = {}) => new Topic(scope, id, props);
export const fromTopicArn = (scope, id, topicArn) => Topic.fromTopicArn(scope, id, topicArn);
export const fromTopicAttributes = (scope, id, attrs) => Topic.fromTopicAttributes(scope, id, attrs);
