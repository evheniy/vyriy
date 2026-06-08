# @vyriy/stack

AWS CDK stack helpers for Vyriy projects.

## Purpose

This package keeps small, reusable CDK construction helpers close to the AWS primitives they wrap. The helpers are intentionally thin: they provide calm defaults for common Vyriy infrastructure while leaving the full CDK prop objects available to callers.

## Install

With npm:

```bash
npm install @vyriy/stack aws-cdk-lib
```

With Yarn:

```bash
yarn add @vyriy/stack aws-cdk-lib
```

The `aws-cdk-lib` package is listed because CDK apps and bin entrypoints use CDK stack, app, prop, and resource types directly.

## API

- `s3.createBucket(scope, id, props?)` creates a private S3 bucket with static-site-friendly defaults.
- `cf.createDefaultBehavior(bucket, options?)` creates a CloudFront S3 origin behavior that redirects viewers to HTTPS.
- `cf.createWebsiteRedirectBehavior(bucket, options?)` creates a CloudFront behavior for an S3 website redirect bucket.
- `cf.createCloudFrontFunction(scope, id, props)` creates a CloudFront Function from inline JavaScript source.
- `cf.createIndexRewriteFunctionCode({ rootDomain, wwwDomain })` creates CloudFront Function source for www redirects and clean URL index rewrites.
- `cf.createFunctionAssociations(scope, id, { rootDomain, wwwDomain, ...props })` creates a viewer-request CloudFront Function association for www redirects and index rewrites.
- `cf.createDistribution(scope, id, props)` creates a CloudFront distribution.
- `route53.getHostedZone(scope, id, props)` looks up an existing Route 53 hosted zone.
- `route53.createARecord(scope, id, props)` creates a Route 53 A record.
- `route53.createCloudFrontTarget(distribution)` creates a Route 53 alias target for CloudFront.
- `acm.createCertificate(scope, id, props)` creates an ACM certificate.
- `ses.createEmailReceiving(scope, id, props)` creates an SES domain identity, receipt rule set, receipt rule, raw email bucket permissions, S3-to-Lambda notification, and optional SSM parameter read access.
- `deployment.createBucketDeployment(scope, id, props)` deploys files to S3 with a `512` MB default memory limit.
- `deployment.createHtmlCacheControl()` creates cache-control headers for HTML files that should revalidate before reuse.
- `deployment.createImmutableCacheControl(days?)` creates long-lived immutable cache-control headers.
- `deployment.Source` and `deployment.CacheControl` are re-exported from `aws-cdk-lib/aws-s3-deployment`.

## Static Site Example

This example wires the package helpers into a static website stack:

- find an existing hosted zone
- create a private S3 bucket for `site.com`
- create a DNS-validated ACM certificate
- create a CloudFront distribution for the site
- create a Route 53 alias record
- deploy immutable assets and revalidating HTML files into the bucket
- invalidate CloudFront after each deployment

CloudFront requires ACM certificates for custom aliases to be in `us-east-1`, so deploy this stack in `us-east-1` or split the certificate into a dedicated us-east-1 stack.

```ts
import { CfnOutput, Stack, type StackProps } from 'aws-cdk-lib';
import type { Construct } from 'constructs';

import { stack } from '@vyriy/cdk';
import { acm, cf, deployment, route53, s3 } from '@vyriy/stack';
import { path } from '@vyriy/path';

stack(
  class StaticSiteStack extends Stack {
    constructor(scope: Construct, id: string, props: StackProps & { env: { account: string; region: string } }) {
      super(scope, id, props);

      const domain = 'site.com';

      const hostedZone = route53.getHostedZone(this, 'HostedZone', {
        domainName: domain,
      });

      const siteBucket = s3.createBucket(this, 'Bucket', {
        bucketName: domain,
      });

      const certificate = acm.createCertificate(this, 'Certificate', {
        domainName: domain,
        subjectAlternativeNames: [`*.${domain}`],
        validation: acm.CertificateValidation.fromDns(hostedZone),
      });

      const siteDistribution = cf.createDistribution(this, 'Distribution', {
        certificate,
        defaultBehavior: cf.createDefaultBehavior(siteBucket, {
          functionAssociations: cf.createFunctionAssociations(this, 'IndexRewriteFunction', {
            rootDomain: domain,
            wwwDomain: `www.${domain}`,
          }),
        }),
        defaultRootObject: 'index.html',
        domainNames: [domain, `www.${domain}`],
        errorResponses: [
          {
            httpStatus: 403,
            responseHttpStatus: 404,
            responsePagePath: '/404.html',
          },
          {
            httpStatus: 404,
            responseHttpStatus: 404,
            responsePagePath: '/404.html',
          },
        ],
      });

      route53.createARecord(this, 'RootRecord', {
        target: route53.createCloudFrontTarget(siteDistribution),
        zone: hostedZone,
      });

      const assetDeployment = deployment.createBucketDeployment(this, 'DeploySiteAssets', {
        cacheControl: deployment.createImmutableCacheControl(),
        destinationBucket: siteBucket,
        distribution: siteDistribution,
        exclude: ['index.html', '404.html'],
        distributionPaths: ['/*'],
        sources: [deployment.Source.asset(path('dist'))],
      });

      const htmlDeployment = deployment.createBucketDeployment(this, 'DeploySiteHtml', {
        cacheControl: deployment.createHtmlCacheControl(),
        destinationBucket: siteBucket,
        distribution: siteDistribution,
        distributionPaths: ['/*'],
        exclude: ['*'],
        include: ['index.html', '404.html'],
        prune: false,
        sources: [deployment.Source.asset(path('dist'))],
      });

      htmlDeployment.node.addDependency(assetDeployment);

      new CfnOutput(this, 'Account', { value: props.env.account });
      new CfnOutput(this, 'Region', { value: props.env.region });
      new CfnOutput(this, 'Tags', { value: JSON.stringify(props.tags ?? {}) });

      new CfnOutput(this, 'BucketName', { value: siteBucket.bucketName });

      new CfnOutput(this, 'DistributionDomainName', { value: siteDistribution.domainName });
      new CfnOutput(this, 'DistributionId', { value: siteDistribution.distributionId });
      new CfnOutput(this, 'DistributionUrl', { value: `https://${siteDistribution.domainName}/` });

      new CfnOutput(this, 'SiteUrl', { value: `https://${domain}/` });
    }
  },
);
```

## SES Email Receiving Example

This example configures a domain to receive email through SES, store raw MIME messages in S3, and invoke a Lambda for application-specific processing such as sending a Telegram notification.

SES inbound receiving is region-limited, so deploy this in a region that supports SES email receiving and point your domain MX record to that regional SES inbound endpoint.

```ts
import { CfnOutput, Stack, type StackProps } from 'aws-cdk-lib';
import type { Construct } from 'constructs';

import { stack } from '@vyriy/cdk';
import { lambda, s3, ses } from '@vyriy/stack';
import { path } from '@vyriy/path';

stack(
  class EmailStack extends Stack {
    constructor(scope: Construct, id: string, props: StackProps & { env: { account: string; region: string } }) {
      super(scope, id, props);

      const domainName = 'site.com';
      const recipient = `consulting@${domainName}`;
      const processor = lambda.createLambda(this, 'EmailProcessor', {
        code: lambda.Code.fromAsset(path('dist', 'email-processor')),
        description: `Processes raw emails sent to ${recipient}`,
        environment: {
          RAW_EMAIL_PREFIX: 'incoming/',
          TELEGRAM_BOT_TOKEN_PARAMETER_NAME: '/site/consulting-email/telegram/bot-token',
          TELEGRAM_CHAT_ID_PARAMETER_NAME: '/site/consulting-email/telegram/chat-id',
        },
        handler: 'index.handler',
      });
      const emailBucket = s3.createBucket(this, 'RawEmailBucket');

      const emailReceiving = ses.createEmailReceiving(this, 'ConsultingEmail', {
        domainName,
        emailBucket,
        processor,
        rawEmailPrefix: 'incoming/',
        receiptRuleName: 'consulting',
        receiptRuleSetName: 'site-consulting-email',
        recipients: [recipient],
        ssmParameterNames: [
          '/site/consulting-email/telegram/bot-token',
          '/site/consulting-email/telegram/chat-id',
        ],
      });

      processor.addEnvironment('RAW_EMAIL_BUCKET_NAME', emailReceiving.emailBucket.bucketName);

      new CfnOutput(this, 'RawEmailBucketName', { value: emailReceiving.emailBucket.bucketName });
      new CfnOutput(this, 'ConsultingEmail', { value: recipient });
      new CfnOutput(this, 'EmailReceiptRuleSetName', { value: 'site-consulting-email' });
    }
  },
);
```

## API Gateway Lambda Example

This example wires a Lambda-backed REST API to an API Gateway custom domain:

- find an existing hosted zone
- create a DNS-validated ACM certificate
- create a Lambda from built API assets
- create an edge REST API with proxy Lambda integration
- map the API to a custom domain
- create a Route 53 alias record for the API Gateway domain

Edge API Gateway custom domains use edge-optimized CloudFront distributions, so keep the certificate in `us-east-1`.

```ts
import { CfnOutput, Stack, type StackProps } from 'aws-cdk-lib';
import { ApiGatewayDomain } from 'aws-cdk-lib/aws-route53-targets';
import type { Construct } from 'constructs';

import { stack } from '@vyriy/cdk';
import { acm, apigateway, lambda, route53 } from '@vyriy/stack';
import { getPackage } from '@vyriy/package';
import { path } from '@vyriy/path';

stack(
  class ApiStack extends Stack {
    constructor(scope: Construct, id: string, props: StackProps & { env: { account: string; region: string } }) {
      super(scope, id, props);

      const domain = 'api.site.com';
      const hostedZoneName = 'site.com';
      const { description } = getPackage();

      const zone = route53.getHostedZone(this, 'HostedZone', {
        zoneName: hostedZoneName,
      });

      const certificate = acm.createCertificate(this, 'Certificate', {
        domainName: domain,
        validation: acm.CertificateValidation.fromDns(zone),
      });

      const apiLambda = lambda.createLambda(this, 'ApiLambda', {
        code: lambda.Code.fromAsset(path('dist', 'api')),
        description,
        functionName: 'api',
        handler: 'index.handler',
      });

      const apiGateway = apigateway.createApiGateway(this, 'ApiGateway', {
        defaultIntegration: apigateway.createIntegration(apiLambda, { proxy: true }),
        description,
        restApiName: `${id}-api-gateway`,
      });

      const apiDomainName = apigateway.createDomainName(this, 'ApiGatewayDomain', {
        certificate,
        domainName: domain,
      });

      apigateway.createBasePathMapping(this, 'ApiBasePathMapping', {
        domainName: apiDomainName,
        restApi: apiGateway,
      });

      route53.createARecord(this, 'ARecord', {
        recordName: domain,
        target: route53.RecordTarget.fromAlias(new ApiGatewayDomain(apiDomainName)),
        zone,
      });

      new CfnOutput(this, 'Account', { value: props.env.account });
      new CfnOutput(this, 'Region', { value: props.env.region });

      new CfnOutput(this, 'LambdaName', { value: apiLambda.functionName });

      new CfnOutput(this, 'ApiGatewayId', { value: apiGateway.restApiId });
      new CfnOutput(this, 'ApiGatewayUrl', { value: apiGateway.url });

      new CfnOutput(this, 'ApiUrl', { value: `https://${domain}/` });
    }
  },
);
```

## Fargate Worker Example

This example wires a Fargate task foundation to an existing VPC:

- read the VPC id from the environment
- load package metadata for reusable descriptions
- create a security group for the workload
- create an ECR repository for the task image
- create an ECS cluster in the VPC
- create a Fargate task definition with AWS Logs configured

```ts
import { CfnOutput, Stack, type StackProps } from 'aws-cdk-lib';
import type { Construct } from 'constructs';

import { stack } from '@vyriy/cdk';
import { getVpc } from '@vyriy/env';
import { getPackage } from '@vyriy/package';
import { ec2, ecr, ecs } from '@vyriy/stack';

stack(
  class FargateWorkerStack extends Stack {
    constructor(scope: Construct, id: string, props: StackProps & { env: { account: string; region: string } }) {
      super(scope, id, props);

      const { description } = getPackage();
      const vpc = ec2.findVpc(this, 'Vpc', { vpcId: getVpc() });
      const subnets = vpc.privateSubnets;

      const securityGroup = ec2.createSecurityGroup(this, 'SecurityGroup', {
        allowAllOutbound: true,
        description,
        securityGroupName: `${id}-${vpc.vpcId}-securityGroup`,
        vpc,
      });

      const repository = ecr.createRepository(this, 'SyncRepository', {
        repositoryName: `${id}-repository`,
      });

      const cluster = ecs.createCluster(this, 'FargateCluster', {
        clusterName: `${id}-cluster`,
        vpc,
      });

      const taskDefinition = ecs.createTaskDefinition(this, 'SyncFargateTaskDefinition', {
        cpu: 256,
        family: `${id}-task-definition`,
        memoryLimitMiB: 512,
      });

      taskDefinition.addContainer('SyncTaskDefinition', {
        cpu: 256,
        image: ecs.ContainerImage.fromEcrRepository(repository),
        logging: ecs.setLogs({ streamPrefix: `${id}-cluster-logs` }),
        memoryLimitMiB: 512,
      });

      new CfnOutput(this, 'Account', { value: props.env.account });
      new CfnOutput(this, 'Region', { value: props.env.region });

      new CfnOutput(this, 'VpcId', { value: vpc.vpcId });
      new CfnOutput(this, 'PrivateSubnetIds', { value: subnets.map((subnet) => subnet.subnetId).join(',') });
      new CfnOutput(this, 'SecurityGroupId', { value: securityGroup.securityGroupId });

      new CfnOutput(this, 'RepositoryName', { value: repository.repositoryName });
      new CfnOutput(this, 'ClusterName', { value: cluster.clusterName });

      new CfnOutput(this, 'TaskDefinitionArn', { value: taskDefinition.taskDefinitionArn });
    }
  },
);
```

## DynamoDB Access Examples

These examples show small DynamoDB table definitions and common IAM access patterns for Lambda and Fargate workloads.

Create two country tables:

```ts
import { dynamodb } from '@vyriy/stack';

const countriesIndexTable = dynamodb.createTable(this, 'CountriesIndexTable', {
  partitionKey: {
    name: 'key',
    type: dynamodb.AttributeType.STRING,
  },
  tableName: `${id}-countries-index`,
});

const countriesTable = dynamodb.createTable(this, 'CountriesTable', {
  partitionKey: {
    name: 'key',
    type: dynamodb.AttributeType.STRING,
  },
  sortKey: {
    name: 'code',
    type: dynamodb.AttributeType.STRING,
  },
  tableName: `${id}-countries`,
});
```

Grant Lambda access to the tables:

```ts
countriesIndexTable.grantReadData(apiLambda);
countriesTable.grantReadWriteData(apiLambda);

// Use full access only for maintenance or sync jobs that really need table-level control.
countriesIndexTable.grantFullAccess(apiLambda);
```

Grant Fargate task access through the task role:

```ts
countriesIndexTable.grantReadData(taskDefinition.taskRole);
countriesTable.grantReadWriteData(taskDefinition.taskRole);

// Full access is useful for controlled backfill or indexing tasks.
countriesIndexTable.grantFullAccess(taskDefinition.taskRole);
```

Allow a Lambda to run the Fargate task definition:

```ts
taskDefinition.grantRun(apiLambda);
```

## Messaging And Parameter Examples

These examples show simple SNS, SQS, and SSM helper usage for application stacks.

Create an SNS topic and grant publishers/subscribers:

```ts
import { sns } from '@vyriy/stack';

const eventsTopic = sns.createTopic(this, 'EventsTopic', {
  topicName: `${id}-events`,
});

eventsTopic.grantPublish(apiLambda);
eventsTopic.grantSubscribe(taskDefinition.taskRole);
```

Import an existing SNS topic:

```ts
const importedEventsTopic = sns.fromTopicArn(
  this,
  'ImportedEventsTopic',
  `arn:aws:sns:${this.region}:${this.account}:${id}-events`,
);

importedEventsTopic.grantPublish(taskDefinition.taskRole);
```

Create an SQS queue and allow Lambda/Fargate workers to use it:

```ts
import { Duration } from 'aws-cdk-lib';

import { sqs } from '@vyriy/stack';

const jobsQueue = sqs.createQueue(this, 'JobsQueue', {
  queueName: `${id}-jobs`,
  visibilityTimeout: Duration.seconds(60),
});

jobsQueue.grantSendMessages(apiLambda);
jobsQueue.grantConsumeMessages(taskDefinition.taskRole);
```

Import an existing SQS queue:

```ts
const importedJobsQueue = sqs.fromQueueAttributes(this, 'ImportedJobsQueue', {
  queueArn: `arn:aws:sqs:${this.region}:${this.account}:${id}-jobs`,
  queueUrl: `https://sqs.${this.region}.amazonaws.com/${this.account}/${id}-jobs`,
});

importedJobsQueue.grantConsumeMessages(apiLambda);
```

Read SSM parameter values and import parameters:

```ts
import { ssm } from '@vyriy/stack';

const manualApiKey = ssm.createManualStringParameter(this, 'ManualApiKey', {
  description: 'API key filled after first deploy',
  initialValue: 'CHANGE_ME',
  parameterName: `/${id}/api/key`,
});

const apiBaseUrl = ssm.valueForStringParameter(this, `/${id}/api/base-url`);

const importedApiKey = ssm.fromSecureStringParameterAttributes(this, 'ImportedApiKey', {
  parameterName: `/${id}/api/key`,
  version: 1,
});

manualApiKey.grantRead(apiLambda);
importedApiKey.grantRead(apiLambda);
importedApiKey.grantRead(taskDefinition.taskRole);
```

`createManualStringParameter` writes the initial value only when CloudFormation creates the resource. Later stack updates do
not overwrite a manually edited value, and stack deletion removes the parameter.

Pass SSM parameter values into Lambda and Fargate environment variables:

```ts
const apiBaseUrlParameterName = `/${id}/api/base-url`;
const apiKeyParameterName = `/${id}/api/key`;

const apiBaseUrl = ssm.valueForStringParameter(this, apiBaseUrlParameterName);
const apiKey = ssm.valueForStringParameter(this, apiKeyParameterName);

const apiLambda = lambda.createLambda(this, 'ApiLambda', {
  code: lambda.Code.fromAsset(path('dist', 'api')),
  environment: {
    API_BASE_URL: apiBaseUrl,
    API_KEY_PARAMETER_NAME: apiKeyParameterName,
  },
  handler: 'index.handler',
});

taskDefinition.addContainer('WorkerContainer', {
  environment: {
    API_BASE_URL: apiBaseUrl,
    API_KEY: apiKey,
  },
  image: ecs.ContainerImage.fromEcrRepository(repository),
  logging: ecs.setLogs({ streamPrefix: `${id}-worker-logs` }),
});

const importedApiKeyForEnv = ssm.fromStringParameterName(this, 'ImportedApiKeyForEnv', apiKeyParameterName);

importedApiKeyForEnv.grantRead(apiLambda);
importedApiKeyForEnv.grantRead(taskDefinition.taskRole);
```
