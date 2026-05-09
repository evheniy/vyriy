import { S3Client } from '@aws-sdk/client-s3';
import { getRegion, getLocalstackHost, getLocalstackPort, isLocal } from '@vyriy/env';
const options = isLocal()
    ? {
        region: getRegion(),
        endpoint: `http://${getLocalstackHost()}:${getLocalstackPort()}`,
        forcePathStyle: true,
    }
    : {};
export const client = new S3Client(options);
