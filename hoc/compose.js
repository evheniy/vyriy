export const compose = (...hocs) => (Component) => hocs.reduceRight((CurrentComponent, hoc) => hoc(CurrentComponent), Component);
