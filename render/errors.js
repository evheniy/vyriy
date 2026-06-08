export const createMissingElementError = () => {
    return new Error('Render element is required.');
};
export const createMissingCustomElementRootError = () => {
    return new Error('Custom element render root is required.');
};
