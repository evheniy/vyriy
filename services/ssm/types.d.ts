export type GetParameter = (parameterName: string, decrypted?: boolean) => Promise<string>;
export type GetParameters = (parameterNames: string[], decrypted?: boolean) => Promise<Record<string, string>>;
