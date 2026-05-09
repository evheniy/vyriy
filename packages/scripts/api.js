import { script } from '@vyriy/script';
import { createLogger } from '@vyriy/logger';
import { retry } from '@vyriy/retry';
import { request } from '@vyriy/request';
import { output } from '@vyriy/cdk';
export const api = (stackApiResource = 'ApiGatewayUrl', healthcheckUrl = 'healthcheck') => script(async () => {
    const logger = createLogger();
    logger.info('API Smoke testing...');
    const url = output()[stackApiResource];
    logger.info('API url:', url);
    const testingUrl = `${url}${healthcheckUrl}`;
    logger.info(`Testing: ${testingUrl}`);
    await retry(async () => request(testingUrl), { retries: 2, delay: 2000 });
    logger.info('\nAPI Smoke testing finished!');
});
