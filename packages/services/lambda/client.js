import { LambdaClient } from '@aws-sdk/client-lambda';
import { getRegion } from '@vyriy/env';
const options = { region: getRegion() };
export const client = new LambdaClient(options);
