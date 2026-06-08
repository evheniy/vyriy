export const request = { isSmoke: true };
export const response = {
    statusCode: 200,
    body: JSON.stringify({
        status: 'success',
    }),
};
export const smoke = (event) => {
    if (typeof event === 'object' && event && 'isSmoke' in event && event.isSmoke === request.isSmoke) {
        return response;
    }
    return false;
};
