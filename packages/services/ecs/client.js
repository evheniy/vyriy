import { ECSClient } from '@aws-sdk/client-ecs';
import { getRegion, isLocal } from '@vyriy/env';
const options = isLocal() ? { region: getRegion() } : {};
export const client = new ECSClient(options);
