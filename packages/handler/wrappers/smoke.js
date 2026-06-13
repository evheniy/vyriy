import { smoke } from '@vyriy/smoke';
export const withSmoke = () => (handler) => async (event, context) => {
    const result = smoke(event);
    return (result || (await handler(event, context)));
};
