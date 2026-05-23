import { base } from './base.js';
export const rest = {
    files: (options) => ({
        ...base.files(options),
    }),
    ci: {
        github: {
            '.gitlab-ci.yml': 'code',
        },
    },
    deploy: {
        docker: {
            Dockerfile: 'code',
        },
    },
};
