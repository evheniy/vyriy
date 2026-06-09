import { createLogger } from '@vyriy/logger';
import { output } from '@vyriy/cdk';
import { script } from '@vyriy/script';
export const api = (callback, resourceName = 'ApiGatewayUrl') => script(async () => {
    const logger = createLogger();
    logger.info('API Smoke testing...');
    const apiGatewayUrl = output()[resourceName];
    logger.info('API Gateway url:', apiGatewayUrl);
    await callback(apiGatewayUrl);
    logger.info('API Smoke testing finished!');
});
