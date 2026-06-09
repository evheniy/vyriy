import { createLogger } from '@vyriy/logger';
import { output } from '@vyriy/cdk';
import { script } from '@vyriy/script';
import { request } from '@vyriy/request';
import { retry } from '@vyriy/retry';
export const mfe = (resourceName = 'DistributionUrl') => script(async () => {
    const logger = createLogger();
    logger.info('MFE Smoke testing...');
    const retryOptions = {
        retries: 2,
        delay: 2000,
    };
    const mfeUrl = output()[resourceName];
    logger.info('MFE domain:', mfeUrl);
    await retry(async () => {
        logger.info(`Testing: ${mfeUrl}`);
        await request(mfeUrl);
    }, retryOptions);
    await retry(async () => {
        logger.info(`Testing: ${mfeUrl}index.html`);
        await request(`${mfeUrl}index.html`);
    }, retryOptions);
    await retry(async () => {
        logger.info(`Testing: ${mfeUrl}index.js`);
        await request(`${mfeUrl}index.js`);
    }, retryOptions);
    logger.info('MFE Smoke testing finished!');
});
