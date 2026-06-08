import { ArnFormat, Stack } from 'aws-cdk-lib';
import { Effect, PolicyStatement, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { LambdaDestination } from 'aws-cdk-lib/aws-s3-notifications';
import { EventType } from 'aws-cdk-lib/aws-s3';
import { CfnEmailIdentity, CfnReceiptRule, CfnReceiptRuleSet } from 'aws-cdk-lib/aws-ses';
export { CfnEmailIdentity, CfnReceiptRule, CfnReceiptRuleSet } from 'aws-cdk-lib/aws-ses';
export const createEmailReceiving = (scope, id, props) => {
    const { domainName, emailBucket, processor, rawEmailPrefix = 'incoming/', receiptRuleName, receiptRuleSetName, recipients, scanEnabled = true, ssmParameterNames = [], tlsPolicy = 'Require', } = props;
    const stack = Stack.of(scope);
    const emailIdentity = new CfnEmailIdentity(scope, `${id}EmailIdentity`, {
        dkimAttributes: {
            signingEnabled: true,
        },
        emailIdentity: domainName,
    });
    const receiptRuleSet = new CfnReceiptRuleSet(scope, `${id}ReceiptRuleSet`, {
        ruleSetName: receiptRuleSetName,
    });
    const receiptRuleArn = stack.formatArn({
        arnFormat: ArnFormat.SLASH_RESOURCE_NAME,
        service: 'ses',
        resource: 'receipt-rule-set',
        resourceName: `${receiptRuleSetName}:receipt-rule/${receiptRuleName}`,
    });
    emailBucket.addToResourcePolicy(new PolicyStatement({
        actions: ['s3:PutObject'],
        conditions: {
            StringEquals: {
                'AWS:SourceAccount': stack.account,
            },
            StringLike: {
                'AWS:SourceArn': receiptRuleArn,
            },
        },
        effect: Effect.ALLOW,
        principals: [new ServicePrincipal('ses.amazonaws.com')],
        resources: [emailBucket.arnForObjects(`${rawEmailPrefix}*`)],
    }));
    emailBucket.grantRead(processor);
    emailBucket.addEventNotification(EventType.OBJECT_CREATED, new LambdaDestination(processor), {
        prefix: rawEmailPrefix,
    });
    if (ssmParameterNames.length > 0) {
        processor.addToRolePolicy(new PolicyStatement({
            actions: ['ssm:GetParameter'],
            resources: ssmParameterNames.map((parameterName) => stack.formatArn({
                arnFormat: ArnFormat.SLASH_RESOURCE_NAME,
                service: 'ssm',
                resource: 'parameter',
                resourceName: parameterName.replace(/^\//, ''),
            })),
        }));
    }
    const receiptRule = new CfnReceiptRule(scope, `${id}ReceiptRule`, {
        rule: {
            actions: [
                {
                    s3Action: {
                        bucketName: emailBucket.bucketName,
                        objectKeyPrefix: rawEmailPrefix,
                    },
                },
            ],
            enabled: true,
            name: receiptRuleName,
            recipients,
            scanEnabled,
            tlsPolicy,
        },
        ruleSetName: receiptRuleSetName,
    });
    receiptRule.node.addDependency(receiptRuleSet);
    receiptRule.node.addDependency(emailIdentity);
    return {
        emailBucket,
        emailIdentity,
        receiptRule,
        receiptRuleSet,
    };
};
