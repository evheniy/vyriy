import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { getLocalstackHost, getLocalstackPort, getRegion, isLocal } from '@vyriy/env';
export const createClient = (options = {}) => {
    const defaultOptions = isLocal()
        ? {
            region: getRegion(),
            endpoint: `http://${getLocalstackHost()}:${getLocalstackPort()}`,
        }
        : {};
    return new DynamoDBClient({ ...defaultOptions, ...options });
};
