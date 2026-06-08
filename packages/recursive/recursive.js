import { createLogger } from '@vyriy/logger';
export const recursive = (handler, list) => {
    const logger = createLogger();
    const run = async (index = 0) => {
        logger.info('Index:', index);
        logger.info('Item:', list[index]);
        const row = list[index];
        if (row) {
            await handler(row);
            await run(index + 1);
        }
    };
    return run();
};
