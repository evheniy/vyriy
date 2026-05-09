import { existsSync, readFileSync } from 'node:fs';
import { createLogger } from '@vyriy/logger';
import { path } from '@vyriy/path';
import { id } from './id.js';
export const output = () => {
    const logger = createLogger();
    const filePath = path('cdk.out/cdk-outputs.json');
    logger.info('File path:', filePath);
    if (!existsSync(filePath)) {
        logger.error('File "cdk.out/cdk-outputs.json" does not exist!');
        throw new Error('\nFile "cdk.out/cdk-outputs.json" does not exist!');
    }
    const data = JSON.parse(readFileSync(filePath, 'utf8'));
    logger.info('Data:', data);
    const outputData = data[id()];
    logger.info('Output data:', outputData);
    return outputData;
};
