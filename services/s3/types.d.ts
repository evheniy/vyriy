import type { GetObjectCommandInput, HeadObjectCommandInput, PutObjectCommandInput } from '@aws-sdk/client-s3';
export type Download = (bucketName: string, path: string, options?: Omit<GetObjectCommandInput, 'Bucket' | 'Key'>) => Promise<string | undefined>;
export type Upload = (bucketName: string, path: string, body: string | Buffer, mimeType?: string, options?: Omit<PutObjectCommandInput, 'Bucket' | 'Key' | 'Body' | 'ContentType'>) => Promise<void>;
export type Exists = (bucketName: string, path: string, options?: Omit<HeadObjectCommandInput, 'Bucket' | 'Key' | 'Body' | 'ContentType'>) => Promise<boolean>;
