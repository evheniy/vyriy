import { Construct } from 'constructs';
import { IFunction } from 'aws-cdk-lib/aws-lambda';
import { IBucket } from 'aws-cdk-lib/aws-s3';
import { CfnEmailIdentity, CfnReceiptRule, CfnReceiptRuleSet } from 'aws-cdk-lib/aws-ses';
export type ReceiptRuleTlsPolicy = 'Optional' | 'Require';
export type CreateEmailReceivingProps = {
    domainName: string;
    emailBucket: IBucket;
    receiptRuleName: string;
    receiptRuleSetName: string;
    recipients: string[];
    processor: IFunction;
    rawEmailPrefix?: string;
    scanEnabled?: boolean;
    ssmParameterNames?: string[];
    tlsPolicy?: ReceiptRuleTlsPolicy;
};
export type CreateEmailReceivingResult = {
    emailBucket: IBucket;
    emailIdentity: CfnEmailIdentity;
    receiptRule: CfnReceiptRule;
    receiptRuleSet: CfnReceiptRuleSet;
};
export { CfnEmailIdentity, CfnReceiptRule, CfnReceiptRuleSet } from 'aws-cdk-lib/aws-ses';
export declare const createEmailReceiving: (scope: Construct, id: string, props: CreateEmailReceivingProps) => CreateEmailReceivingResult;
