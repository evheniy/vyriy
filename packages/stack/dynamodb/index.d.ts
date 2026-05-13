import { Construct } from 'constructs';
import { AttributeType, Table, TableProps } from 'aws-cdk-lib/aws-dynamodb';
export { AttributeType };
export declare const createTable: (scope: Construct, id: string, props: TableProps) => Table;
