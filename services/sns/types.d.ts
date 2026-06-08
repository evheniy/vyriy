import type { PublishCommandInput } from '@aws-sdk/client-sns';
export type Publish = (topicArn: string, message: string, options?: Omit<PublishCommandInput, 'TopicArn' | 'Message'>) => Promise<void>;
