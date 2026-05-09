import { GetObjectCommand, HeadObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { createLogger } from '@vyriy/logger';
import { toError } from '@vyriy/error';
import { client } from './client.js';
export const download = async (bucketName, path, options = {}) => {
    try {
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
export const exists = async (bucketName, path, options = {}) => {
    try {
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
