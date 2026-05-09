import { STATUS_CODES } from 'node:http';
export const result = (response, value) => {
    if (!value) {
        response
            .writeHead(404, {
            'content-type': 'application/json',
        })
            .end(JSON.stringify({ message: STATUS_CODES[404] }));
        return;
    }
    const { body, headers, multiValueHeaders, statusCode } = value;
    response.writeHead(statusCode, {
        ...headers,
        ...multiValueHeaders,
    });
    response.end(body);
};
export const error = (response) => {
    response
        .writeHead(500, {
        'content-type': 'application/json',
    })
        .end(JSON.stringify({ message: STATUS_CODES[500] }));
};
