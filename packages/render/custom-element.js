import { createRoot, hydrateRoot } from 'react-dom/client';
import { createMissingCustomElementRootError } from './errors.js';
const rootSelector = '[data-vyriy-root]';
const fallbackRootSelector = ':not(link, style, template)';
const findCustomElementRoot = (shadow) => {
    return shadow.querySelector(rootSelector) ?? shadow.querySelector(fallbackRootSelector);
};
const requireCustomElementRoot = (root) => {
    if (!root) {
        throw createMissingCustomElementRootError();
    }
    return root;
};
export const customElement = ({ tag, mode = 'open', renderedAttribute = 'rendered', elements, render, options = {}, }) => {
    if (customElements.get(tag)) {
        return;
    }
    customElements.define(tag, class extends HTMLElement {
        #root;
        #mount;
        constructor() {
            super();
            const existingShadow = this.shadowRoot;
            const shadow = existingShadow ?? this.attachShadow({ mode });
            const isHydratableShadow = this.hasAttribute(renderedAttribute) && existingShadow;
            if (isHydratableShadow) {
                this.#mount = requireCustomElementRoot(findCustomElementRoot(existingShadow));
                return;
            }
            const renderElements = elements(this);
            this.#mount = requireCustomElementRoot(renderElements.root);
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
