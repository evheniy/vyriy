import type { APIGatewayProxyResult } from 'aws-lambda';
export type Request = Record<string, unknown>;
export type Response = APIGatewayProxyResult;
export type Smoke = (event: unknown) => Response | false;
