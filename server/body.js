import { toError } from '@vyriy/error';
export const getBody = (request) => new Promise((resolve, reject) => {
    const chunks = [];
    let ended = false;
    request
        .on('data', (chunk) => {
        chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
    })
        .on('end', () => {
        ended = true;
        if (!chunks.length) {
            resolve(undefined);
            return;
        }
        resolve(Buffer.concat(chunks).toString());
    })
        .on('close', () => {
        if (!ended) {
            reject(toError('Request body stream closed before it finished reading'));
        }
    })
        .on('error', (error) => reject(toError(error)));
});
