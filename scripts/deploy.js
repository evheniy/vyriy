import { script } from '@vyriy/script';
import { createLogger } from '@vyriy/logger';
import { exec } from '@vyriy/exec';
export const deploy = () => script(async () => {
    const logger = createLogger();
    logger.info('Deploying...');
    await exec('mkdir cdk.out');
    await exec('npx cdk synth > cdk.out/cloudformation.yml');
    await exec('npx aws-cdk diff');
    await exec('npx cdk deploy --outputs-file ./cdk.out/cdk-outputs.json --require-approval never --ci --progress events');
    logger.info('Deploying finished!');
});
