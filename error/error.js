const getErrorMessage = (error) => {
    if (typeof error === 'string') {
        return error;
    }
    if (error === null) {
        return 'null';
    }
    if (error === undefined) {
        return 'undefined';
    }
    if (typeof error === 'number') {
        return `${error}`;
    }
    if (typeof error === 'boolean') {
        return error ? 'true' : 'false';
    }
    if (typeof error === 'bigint') {
        return 'Unknown bigint';
    }
    if (typeof error === 'symbol') {
        return error.description ?? 'Unknown symbol';
    }
    if (typeof error === 'function') {
        return error.name ? `Function ${error.name}` : 'Unknown function';
    }
    try {
        return JSON.stringify(error);
    }
    catch {
        return 'Unknown error';
    }
};
export const toError = (error) => (error instanceof Error ? error : new Error(getErrorMessage(error)));
