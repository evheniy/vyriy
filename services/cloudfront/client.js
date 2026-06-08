import { CloudFrontClient } from '@aws-sdk/client-cloudfront';
export const createClient = (options = {}) => new CloudFrontClient(options);
