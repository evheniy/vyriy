import { createLogger } from '@vyriy/logger';
import { output } from '@vyriy/cdk';
import { script } from '@vyriy/script';
export const e2e = (callback, resourceName = 'ApiGatewayUrl') => script(async () => {
    const logger = createLogger();
    logger.info('E2E testing...');
    const apiGatewayUrl = output()[resourceName];
    logger.info('API Gateway url:', apiGatewayUrl);
    await callback(apiGatewayUrl);
    logger.info('E2E testing finished!');
});
