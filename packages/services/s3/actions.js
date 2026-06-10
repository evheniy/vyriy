import { DeleteObjectCommand, GetObjectCommand, HeadObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { createLogger } from '@vyriy/logger';
import { toError } from '@vyriy/error';
import { createClient } from './client.js';
export const download = async (bucketName, path, options = {}) => {
    try {
        const client = createClient();
        const logger = createLogger();
        logger.log('GetObjectCommand:', { Bucket: bucketName, Key: path, ...options });
        const response = await client.send(new GetObjectCommand({ Bucket: bucketName, Key: path, ...options }));
        const str = await response.Body?.transformToString();
        logger.log(str);
        return str;
    }
    catch (e) {
        createLogger().error(e);
        throw toError(e);
    }
};
export const upload = async (bucketName, path, body, mimeType = 'application/json;charset=utf-8', options = {}) => {
    try {
        const client = createClient();
        createLogger().log('PutObjectCommand:', {
            Bucket: bucketName,
            Key: path,
            Body: body,
            ContentType: mimeType,
            ...options,
        });
        await client.send(new PutObjectCommand({
            Bucket: bucketName,
            Key: path,
            Body: body,
            ContentType: mimeType,
            ...options,
        }));
    }
    catch (e) {
        createLogger().error(e);
        throw toError(e);
    }
};
export const remove = async (bucketName, path, options = {}) => {
    try {
        const client = createClient();
        createLogger().log('DeleteObjectCommand:', {
            Bucket: bucketName,
            Key: path,
            ...options,
        });
        await client.send(new DeleteObjectCommand({
            Bucket: bucketName,
            Key: path,
            ...options,
        }));
    }
    catch (e) {
        createLogger().error(e);
        throw toError(e);
    }
};
export const exists = async (bucketName, path, options = {}) => {
    try {
        const client = createClient();
        createLogger().log('HeadObjectCommand:', {
            Bucket: bucketName,
            Key: path,
            ...options,
        });
        const output = await client.send(new HeadObjectCommand({
            Bucket: bucketName,
            Key: path,
            ...options,
        }));
        return output.$metadata.httpStatusCode === 200;
    }
    catch (e) {
        createLogger().error(e);
        throw toError(e);
    }
};
