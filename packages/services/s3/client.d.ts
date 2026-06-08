import { S3Client, type S3ClientConfig } from '@aws-sdk/client-s3';
export declare const createClient: (options?: S3ClientConfig) => S3Client;
