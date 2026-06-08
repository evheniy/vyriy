import { createLogger } from '@vyriy/logger';
import { output } from '@vyriy/cdk';
import { script } from '@vyriy/script';
import { request } from '@vyriy/request';
import { retry } from '@vyriy/retry';
export const webhooks = (paths = [], stackApiResource = 'ApiGatewayUrl') => script(async () => {
    const logger = createLogger();
    logger.info('Webhooks running...');
    const retryOptions = {
        retries: 2,
        delay: 2000,
    };
    const api = output()[stackApiResource];
    logger.info('API url:', api);
    await Promise.all(paths.map((path) => retry(async () => {
        const webhook = `${api}${path}`;
        logger.info(`Running: ${webhook}`);
        await request(webhook);
    }, retryOptions)));
    logger.info('API webhooks running finished!');
});
