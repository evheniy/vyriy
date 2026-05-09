const createFactory = (wrapper) => (options) => (handler) => async (event, context) => wrapper(handler, [event, context], options);
export const factory = createFactory;
