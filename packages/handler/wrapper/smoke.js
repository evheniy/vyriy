import { smoke } from '@vyriy/smoke';
import { factory } from '../factory.js';
const smokeWrapper = async (handler, args) => smoke(args[0]) || handler(...args);
export const withSmoke = factory(smokeWrapper);
