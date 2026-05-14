import { STATUS_CODES } from 'node:http';
const notFound = (response) => {
    response
        .writeHead(404, {
        'content-type': 'application/json',
    })
        .end(JSON.stringify({ message: STATUS_CODES[404] }));
};
export const result = (response, value) => {
    if (!value) {
        notFound(response);
        return;
    }
    const { body, headers, isBase64Encoded, multiValueHeaders, statusCode } = value;
    response.writeHead(statusCode, {
        ...headers,
        ...multiValueHeaders,
    });
    response.end(isBase64Encoded ? Buffer.from(body, 'base64') : body);
};
export const error = (response) => {
    response
        .writeHead(500, {
        'content-type': 'application/json',
    })
        .end(JSON.stringify({ message: STATUS_CODES[500] }));
};
