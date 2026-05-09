import { createLogger } from '@vyriy/logger';
import { output } from '@vyriy/cdk';
import { script } from '@vyriy/script';
import { request } from '@vyriy/request';
import { retry } from '@vyriy/retry';
export const ui = (resourceName = 'DistributionUrl', hasJs = true) => script(async () => {
    const logger = createLogger();
    logger.info('UI Smoke testing...');
    const retryOptions = {
        retries: 2,
        delay: 2000,
    };
    const uiUrl = output()[resourceName];
    logger.info('UI domain:', uiUrl);
    await retry(async () => {
        logger.info(`Testing: ${uiUrl}`);
        await request(uiUrl);
    }, retryOptions);
    await retry(async () => {
        logger.info(`Testing: ${uiUrl}index.html`);
        await request(`${uiUrl}index.html`);
    }, retryOptions);
    if (hasJs) {
        await retry(async () => {
            logger.info(`Testing: ${uiUrl}index.js`);
            await request(`${uiUrl}index.js`);
        }, retryOptions);
    }
    await retry(async () => {
        logger.info(`Testing: ${uiUrl}robots.txt`);
        await request(`${uiUrl}robots.txt`);
    }, retryOptions);
    logger.info('UI Smoke testing finished!');
});
