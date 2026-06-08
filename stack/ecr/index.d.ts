import { Construct } from 'constructs';
import { Repository, RepositoryProps } from 'aws-cdk-lib/aws-ecr';
export declare const createRepository: (scope: Construct, id: string, props: RepositoryProps) => Repository;
