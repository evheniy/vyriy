export const factory = (wrapper) => (options) => (handler) => async (request, response) => wrapper(handler, [request, response], options);
