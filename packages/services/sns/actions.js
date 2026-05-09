import { client } from './client.js';
export const publish = async (topicArn, message, options = {}) => {
    await client.publish({
        TopicArn: topicArn,
        Message: message,
        ...options,
    });
};
