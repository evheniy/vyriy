import { script } from '@vyriy/script';
import { createLogger } from '@vyriy/logger';
import { output } from '@vyriy/cdk';
import { exec } from '@vyriy/exec';
export const docker = (path, repositoryUri = 'RepositoryUri') => script(async () => {
    const logger = createLogger();
    logger.info('Docker deploying...');
    const stackInfo = output();
    const region = stackInfo.Region;
    logger.info('Region:', region);
    const repository = stackInfo[repositoryUri];
    logger.info('Repository:', repository);
    const tag = `${repository}:latest`;
    await exec(`aws ecr get-login-password --region ${region} | docker login --username AWS --password-stdin ${repository}`);
    await exec(`docker buildx build --push -t ${tag} -f ${path}/Dockerfile --no-cache ${path}`);
    logger.info('Docker deploying finished!');
});
