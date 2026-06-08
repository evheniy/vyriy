import type { Stack as AppStack } from 'aws-cdk-lib';
export type Id = () => string;
export type StackOutput = Record<string, string>;
export type Output = () => StackOutput;
export type Stack = (CdkStack: typeof AppStack) => AppStack;
