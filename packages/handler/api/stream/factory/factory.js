export const getResponseStream = (args) => args[1];
export const getContext = (args) => args[2];
export const factory = (wrapper) => (options) => (handler) => async (event, responseStream, context) => wrapper(handler, [event, responseStream, context], options);
