import { ECSClient } from '@aws-sdk/client-ecs';
import { getRegion, isLocal } from '@vyriy/env';
export const createClient = (options = {}) => {
    const defaultOptions = isLocal() ? { region: getRegion() } : {};
    return new ECSClient({ ...defaultOptions, ...options });
};
