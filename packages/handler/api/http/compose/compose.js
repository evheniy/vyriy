export const compose = (...fns) => fns.reduceRight((prevDecorator, nextDecorator) => (handler) => nextDecorator(prevDecorator(handler)));
