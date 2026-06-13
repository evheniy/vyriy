import type { Context } from 'aws-lambda';
import type { Factory, HandlerParams } from '../types.js';
export declare const getContext: <Event>(args: HandlerParams<Event>) => Context;
export declare const factory: Factory;
