import { Construct } from 'constructs';
import { Topic, TopicProps, TopicAttributes } from 'aws-cdk-lib/aws-sns';
export declare const createTopic: (scope: Construct, id: string, props?: TopicProps) => Topic;
export declare const fromTopicArn: (scope: Construct, id: string, topicArn: string) => import("aws-cdk-lib/aws-sns").ITopic;
export declare const fromTopicAttributes: (scope: Construct, id: string, attrs: TopicAttributes) => import("aws-cdk-lib/aws-sns").ITopic;
