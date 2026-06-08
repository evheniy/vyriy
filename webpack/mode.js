import { isNodeEnvProduction } from '@vyriy/env';
export const mode = () => (isNodeEnvProduction() ? 'production' : 'development');
