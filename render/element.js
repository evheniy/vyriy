import { createRoot, hydrateRoot } from 'react-dom/client';
import { createMissingElementError } from './errors.js';
export const element = ({ root, component, renderedAttribute = 'rendered', options = {}, }) => {
    if (!root) {
        throw createMissingElementError();
    }
    const shouldHydrate = root.hasAttribute(renderedAttribute);
    const reactRoot = shouldHydrate ? hydrateRoot(root, component, options) : createRoot(root, options);
    if (!shouldHydrate) {
        reactRoot.render(component);
    }
    return {
        root: reactRoot,
        unmount: () => {
            reactRoot.unmount();
        },
    };
};
