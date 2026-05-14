import { S3Client } from '@aws-sdk/client-s3';
import { getRegion, getLocalstackHost, getLocalstackPort, isLocal } from '@vyriy/env';
export const createClient = (options = {}) => {
    const defaultOptions = isLocal()
        ? {
            region: getRegion(),
            endpoint: `http://${getLocalstackHost()}:${getLocalstackPort()}`,
            forcePathStyle: true,
        }
        : {};
    return new S3Client({ ...defaultOptions, ...options });
};
