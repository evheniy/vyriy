export class HttpError extends Error {
    status;
    url;
    constructor(response) {
        const details = response.statusText ? ` ${response.statusText}` : '';
        super(`Request failed with status ${response.status}${details}`);
        this.name = 'HttpError';
        this.status = response.status;
        this.url = response.url;
    }
}
export class TimeoutError extends Error {
    timeout;
    constructor(timeout) {
        super(`Request timed out after ${timeout}ms`);
        this.name = 'TimeoutError';
        this.timeout = timeout;
    }
}
