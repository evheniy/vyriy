import { HostedZone, ARecord, RecordTarget } from 'aws-cdk-lib/aws-route53';
import { CloudFrontTarget } from 'aws-cdk-lib/aws-route53-targets';
export { RecordTarget } from 'aws-cdk-lib/aws-route53';
export const getHostedZone = (scope, id, props) => HostedZone.fromLookup(scope, id, props);
export const createARecord = (scope, id, props) => new ARecord(scope, id, props);
export const createCloudFrontTarget = (distribution) => RecordTarget.fromAlias(new CloudFrontTarget(distribution));
