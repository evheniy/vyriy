export declare const isJsonResponse: (response: Response) => boolean;
export declare const parseResponse: <R>(response: Response) => Promise<R>;
export declare const assertSuccessfulResponse: (response: Response) => void;
