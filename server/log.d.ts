import type { AddressInfo } from 'node:net';
export declare const logListening: (address: AddressInfo) => void;
export declare const logError: (label: string, value: Error) => void;
