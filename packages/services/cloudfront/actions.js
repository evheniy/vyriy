import { CreateInvalidationCommand, GetInvalidationCommand } from '@aws-sdk/client-cloudfront';
import { createLogger } from '@vyriy/logger';
import { pause } from '@vyriy/pause';
import { toError } from '@vyriy/error';
import { client } from './client.js';
export const invalidate = async (distribution, paths, shouldWait = false) => {
    try {
        const logger = createLogger();
        logger.info('Distribution:', distribution);
        logger.info('Paths:', paths);
        logger.info('CreateInvalidationCommand');
        const invalidationResponse = await client.send(new CreateInvalidationCommand({
            DistributionId: distribution,
            InvalidationBatch: {
                CallerReference: Date.now().toString(),
                Paths: {
                    Quantity: paths.length,
                    Items: paths,
                },
            },
        }));
        const check = async () => {
            const response = await client.send(new GetInvalidationCommand({
                DistributionId: distribution,
                Id: invalidationResponse.Invalidation?.Id,
            }));
            if (response.Invalidation?.Status !== 'Completed') {
                await pause(3000);
                await check();
            }
        };
        if (shouldWait) {
            await check();
        }
    }
    catch (e) {
        createLogger().error(e);
        throw toError(e);
    }
};
