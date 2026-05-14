import { createClient } from './client.js';
export const publish = async (topicArn, message, options = {}) => {
    const client = createClient();
    await client.publish({
        TopicArn: topicArn,
        Message: message,
        ...options,
    });
};
