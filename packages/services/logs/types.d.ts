import type { FilterLogEventsCommandInput } from '@aws-sdk/client-cloudwatch-logs';
export type WaitForMarkerOptions = Omit<FilterLogEventsCommandInput, 'filterPattern' | 'logGroupName'> & {
    pollIntervalMs?: number;
    timeoutMs?: number;
};
export type WaitForMarker = (logGroupName: string, marker: string, options?: WaitForMarkerOptions) => Promise<void>;
