const getLambdaResponseStream = (responseStream, result) => {
    const response = globalThis.awslambda?.HttpResponseStream?.from?.(responseStream, {
        headers: result.headers,
        statusCode: result.statusCode ?? 200,
    });
    return response ?? responseStream;
};
const isStreamResult = (result) => 'stream' in result && typeof result.stream === 'function';
const writeResult = async (responseStream, result) => {
    if (!result) {
        if (!responseStream.writableEnded) {
            responseStream.end();
        }
        return;
    }
    const stream = getLambdaResponseStream(responseStream, result);
    if (isStreamResult(result)) {
        await result.stream(stream);
        return;
    }
    if ('body' in result && result.body !== undefined) {
        stream.write(result.body);
    }
    stream.end();
};
export const streamifyApiResponse = (handler) => async (event, responseStream, context) => {
    const result = await handler(event, context);
    await writeResult(responseStream, result);
};
export const streamify = (handler) => async (event, responseStream, context) => {
    const result = await handler(event, responseStream, context);
    await writeResult(responseStream, result);
};
