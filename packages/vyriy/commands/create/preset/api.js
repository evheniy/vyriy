import { base } from './base.js';
export const api = {
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
