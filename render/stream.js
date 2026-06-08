import { renderToReadableStream } from 'react-dom/server';
export const stream = async ({ component, bootstrapScripts }) => {
    return renderToReadableStream(component, {
        bootstrapScripts,
    });
};
