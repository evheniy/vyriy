import { base } from './base.js';
export const ssr = {
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
