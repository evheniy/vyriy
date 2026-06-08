import type { InvokeCommandInput, InvokeCommandOutput } from '@aws-sdk/client-lambda';
export type Invoke = (functionName: string, payload: string, options?: Omit<InvokeCommandInput, 'FunctionName' | 'Payload'>) => Promise<InvokeCommandOutput>;
