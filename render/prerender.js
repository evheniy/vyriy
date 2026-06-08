import { prerenderToNodeStream } from 'react-dom/static';
const prerender = async ({ component, bootstrapScripts }) => {
    return prerenderToNodeStream(component, {
        bootstrapScripts,
    });
};
export { prerender };
