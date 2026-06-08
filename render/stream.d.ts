import type { StreamOptions } from './types.js';
export declare const stream: ({ component, bootstrapScripts }: StreamOptions) => Promise<ReadableStream<Uint8Array>>;
