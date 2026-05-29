import { createRoot, hydrateRoot } from 'react-dom/client';
import { createMissingCustomElementRootError } from './errors.js';
export const customElement = ({ tag, mode = 'open', renderedAttribute = 'rendered', elements, render, options = {}, }) => {
    if (customElements.get(tag)) {
        return;
    }
    customElements.define(tag, class extends HTMLElement {
        #root;
        #mount;
        constructor() {
            super();
            const shadow = this.attachShadow({ mode });
            const renderElements = elements(this);
            if (!renderElements.root) {
                throw createMissingCustomElementRootError();
            }
            this.#mount = renderElements.root;
            shadow.append(...renderElements.elements);
        }
        connectedCallback() {
            const reactNode = render(this);
            if (this.hasAttribute(renderedAttribute)) {
                this.#root = hydrateRoot(this.#mount, reactNode, options);
                return;
            }
            this.#root ??= createRoot(this.#mount, options);
            this.#root.render(reactNode);
        }
        disconnectedCallback() {
            this.#root?.unmount();
            this.#root = undefined;
        }
    });
};
