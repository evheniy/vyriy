import { LambdaClient } from '@aws-sdk/client-lambda';
import { getRegion } from '@vyriy/env';
export const createClient = (options = {}) => {
    const defaultOptions = { region: getRegion() };
    return new LambdaClient({ ...defaultOptions, ...options });
};
