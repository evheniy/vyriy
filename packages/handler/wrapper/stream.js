const getContentType = (headers) => headers?.['content-type'] ?? headers?.['Content-Type'];
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
        stream.setContentType?.(String(contentType));
    }
    return stream;
};
