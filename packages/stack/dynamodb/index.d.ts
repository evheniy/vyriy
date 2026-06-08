import { Construct } from 'constructs';
import { Table, TableProps } from 'aws-cdk-lib/aws-dynamodb';
export { AttributeType } from 'aws-cdk-lib/aws-dynamodb';
export declare const createTable: (scope: Construct, id: string, props: TableProps) => Table;
