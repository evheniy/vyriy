import { RemovalPolicy } from 'aws-cdk-lib';
import { BillingMode, Table } from 'aws-cdk-lib/aws-dynamodb';
export { AttributeType } from 'aws-cdk-lib/aws-dynamodb';
export const createTable = (scope, id, props) => new Table(scope, id, {
    billingMode: BillingMode.PAY_PER_REQUEST,
    removalPolicy: RemovalPolicy.DESTROY,
    ...props,
});
