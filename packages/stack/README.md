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
- `cf.createDistribution(scope, id, props)` creates a CloudFront distribution.
- `route53.getHostedZone(scope, id, props)` looks up an existing Route 53 hosted zone.
- `route53.createARecord(scope, id, props)` creates a Route 53 A record.
- `route53.createCloudFrontTarget(distribution)` creates a Route 53 alias target for CloudFront.
- `acm.createCertificate(scope, id, props)` creates an ACM certificate.
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
        defaultBehavior: cf.createDefaultBehavior(siteBucket),
        defaultRootObject: 'index.html',
        domainNames: [domain],
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
