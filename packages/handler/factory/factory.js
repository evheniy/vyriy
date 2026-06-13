export const getContext = (args) => args[1];
export const factory = (wrapper) => (options) => (handler) => async (event, context) => wrapper(handler, [event, context], options);
