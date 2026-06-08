import { SNS, type SNSClientConfig } from '@aws-sdk/client-sns';
export declare const createClient: (options?: SNSClientConfig) => SNS;
