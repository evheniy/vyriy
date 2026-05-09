export const request = { isSmoke: true };
export const response = { status: 'success' };
export const smoke = (event) => {
    if (JSON.stringify(event) === JSON.stringify(request)) {
        return response;
    }
    return false;
};
