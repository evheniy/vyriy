import { DynamoDBClient, type DynamoDBClientConfig } from '@aws-sdk/client-dynamodb';
export declare const createClient: (options?: DynamoDBClientConfig) => DynamoDBClient;
