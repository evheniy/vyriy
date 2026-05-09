import { exec } from '@vyriy/exec';
import { script } from '@vyriy/script';
import { createLogger } from '@vyriy/logger';
import { output } from '@vyriy/cdk';
export const kaniko = (path, repositoryUri = 'RepositoryUri') => script(async () => {
    const logger = createLogger();
    logger.info('Kaniko deploying...');
    const repository = output()[repositoryUri];
    logger.info('Repository:', repository);
    await exec(`/kaniko/executor \
        --context "${path}" \
        --dockerfile "${path}/Dockerfile" \
        --destination "${repository}:latest" \
        --single-snapshot > cdk.out/kaniko.logs.txt`);
    logger.info('Kaniko deploying finished!');
});
