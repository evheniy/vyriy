import { createLogger } from '@vyriy/logger';
import { script } from '@vyriy/script';
import { invoke } from '@vyriy/services/lambda';
import { request, response } from '@vyriy/smoke';
export const lambda = (name) => script(async () => {
    const logger = createLogger();
    logger.info('Lambda Smoke testing...');
    logger.info('Lambda:', name);
    const res = await invoke(name, JSON.stringify(request));
    logger.info('Response:', res);
    const result = new TextDecoder().decode(res.Payload);
    logger.info('Result:', result);
    if (result !== JSON.stringify(response)) {
        throw new Error('Lambda Smoke testing error!');
    }
    logger.info('Lambda Smoke testing finished!');
});
