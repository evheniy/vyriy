import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { getLocalstackHost, getLocalstackPort, getRegion, isLocal } from '@vyriy/env';
const options = isLocal()
    ? {
        region: getRegion(),
        endpoint: `http://${getLocalstackHost()}:${getLocalstackPort()}`,
    }
    : {};
export const client = new DynamoDBClient(options);
