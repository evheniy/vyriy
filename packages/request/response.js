import { HttpError } from './error.js';
export const isJsonResponse = (response) => {
    const contentType = response.headers.get('content-type');
    return contentType?.includes('application/json') === true || contentType?.includes('+json') === true;
};
export const parseResponse = async (response) => {
    if (isJsonResponse(response)) {
        const result = await response.json();
        return result;
    }
    const result = await response.text();
    return result;
};
export const assertSuccessfulResponse = (response) => {
    if (response.type !== 'opaque' && !response.ok) {
        throw new HttpError(response);
    }
};
