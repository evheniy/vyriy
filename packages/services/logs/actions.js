import { FilterLogEventsCommand } from '@aws-sdk/client-cloudwatch-logs';
import { toError } from '@vyriy/error';
import { createLogger } from '@vyriy/logger';
import { pause } from '@vyriy/pause';
import { timeout as error } from '@vyriy/timeout';
import { createClient } from './client.js';
const defaultPollIntervalMs = 1000;
const defaultTimeoutMs = 60000;
export const waitForMarker = async (logGroupName, marker, options = {}) => {
    const { pollIntervalMs = defaultPollIntervalMs, timeoutMs = defaultTimeoutMs, ...commandOptions } = options;
    const startedAt = Date.now();
    const logger = createLogger();
    const client = createClient();
    const timeoutMessage = `Timed out waiting for "${marker}" in ${logGroupName}`;
    const poll = async () => {
        const input = {
            filterPattern: `"${marker}"`,
            logGroupName,
            startTime: startedAt - pollIntervalMs,
            ...commandOptions,
        };
        logger.log('FilterLogEventsCommand:', input);
        const response = await client.send(new FilterLogEventsCommand(input));
        const hasMarker = response.events?.some((event) => event.message?.includes(marker));
        if (!hasMarker) {
            await pause(pollIntervalMs);
            await poll();
        }
    };
    try {
        await Promise.race([poll(), error(timeoutMs, timeoutMessage)]);
    }
    catch (e) {
        logger.error(e);
        throw toError(e);
    }
};
