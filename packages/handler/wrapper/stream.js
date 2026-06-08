const getContentType = (headers) => {
    const contentType = Object.entries(headers ?? {}).find(([key]) => key.toLowerCase() === 'content-type')?.[1];
    return typeof contentType === 'string' ? contentType : undefined;
};
export const responseStream = (stream, metadata = {}) => {
    const runtimeStream = globalThis.awslambda?.HttpResponseStream?.from?.(stream, {
        headers: metadata.headers,
        statusCode: metadata.statusCode ?? 200,
    });
    if (runtimeStream) {
        return runtimeStream;
    }
    const contentType = getContentType(metadata.headers);
    if (contentType) {
        stream.setContentType?.(contentType);
    }
    return stream;
};
