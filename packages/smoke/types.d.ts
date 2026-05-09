export type Request = Record<string, unknown>;
export type Response = Record<string, unknown>;
export type Smoke = (event: unknown) => Response | false;
