import { ECSClient, type ECSClientConfig } from '@aws-sdk/client-ecs';
export declare const createClient: (options?: ECSClientConfig) => ECSClient;
