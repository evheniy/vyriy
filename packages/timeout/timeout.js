import { pause } from '@vyriy/pause';
export const message = 'Timeout error!';
export const timeout = async (time, msg = message) => {
    await pause(time);
    throw new Error(msg);
};
