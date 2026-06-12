export const compose = (...fns) => fns.reduceRight((prevDecorator, nextDecorator) => (handler) => nextDecorator(prevDecorator(handler)));
export const streamCompose = (...fns) => fns.reduceRight((prevDecorator, nextDecorator) => (handler) => nextDecorator(prevDecorator(handler)));
export const httpCompose = (...fns) => fns.reduceRight((prevDecorator, nextDecorator) => (handler) => nextDecorator(prevDecorator(handler)));
