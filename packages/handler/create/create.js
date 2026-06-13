import { createApi } from '../api/index.js';
import { createDynamodb } from '../dynamodb/index.js';
import { createEventBridge } from '../eventBridge/index.js';
import { createApi as createHttpApi } from '../api/http/index.js';
import { createS3 } from '../s3/index.js';
import { createSchedule } from '../schedule/index.js';
import { createSes } from '../ses/index.js';
import { createSns } from '../sns/index.js';
import { createSqs } from '../sqs/index.js';
import { createApi as createStreamApi } from '../api/stream/index.js';
export const create = {
    api: createApi,
    dynamodb: createDynamodb,
    eventBridge: createEventBridge,
    httpApi: createHttpApi,
    s3: createS3,
    schedule: createSchedule,
    ses: createSes,
    sns: createSns,
    sqs: createSqs,
    streamApi: createStreamApi,
};
