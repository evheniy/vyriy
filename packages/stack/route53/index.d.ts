import { Construct } from 'constructs';
import { Distribution } from 'aws-cdk-lib/aws-cloudfront';
import { HostedZoneProviderProps, ARecord, ARecordProps, MxRecord, MxRecordProps, RecordTarget } from 'aws-cdk-lib/aws-route53';
export { RecordTarget } from 'aws-cdk-lib/aws-route53';
export declare const getHostedZone: (scope: Construct, id: string, props: HostedZoneProviderProps) => import("aws-cdk-lib/aws-route53").IHostedZone;
export declare const createARecord: (scope: Construct, id: string, props: ARecordProps) => ARecord;
export declare const createMxRecord: (scope: Construct, id: string, props: MxRecordProps) => MxRecord;
export declare const createCloudFrontTarget: (distribution: Distribution) => RecordTarget;
