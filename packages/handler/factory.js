const createFactory = (wrapper) => (options) => (handler) => async (event, ...args) => wrapper(handler, [event, ...args], options);
export const getContext = (args) => args.at(-1);
export const factory = createFactory;
