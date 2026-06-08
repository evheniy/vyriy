import { renderToString } from 'react-dom/server';
export const html = (component) => renderToString(component);
