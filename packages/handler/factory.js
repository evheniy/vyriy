export const getContext = (args) => args[1];
export const getResponseStream = (args) => args[1];
export const getStreamContext = (args) => args[2];
export const factory = (wrapper) => (options) => (handler) => async (event, context) => wrapper(handler, [event, context], options);
export const streamFactory = (wrapper) => (options) => (handler) => async (event, responseStream, context) => wrapper(handler, [event, responseStream, context], options);
export const httpFactory = (wrapper) => (options) => (handler) => async (request, response) => wrapper(handler, [request, response], options);
