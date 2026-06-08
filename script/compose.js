export const compose = (...fns) => fns.length
    ? fns.reduceRight((prevFn, nextFn) => async (task) => nextFn(async () => prevFn(task)))
    : async (task) => task();
