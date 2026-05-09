import { CreateTableCommand } from '@aws-sdk/client-dynamodb';
import { DeleteCommand, GetCommand, PutCommand, QueryCommand, ScanCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { createLogger } from '@vyriy/logger';
import { toError } from '@vyriy/error';
import { client } from './client.js';
export const createTable = async (params) => {
    try {
        createLogger().log('CreateTableCommand:', params);
        await client.send(new CreateTableCommand(params));
    }
    catch (e) {
        throw toError(e);
    }
};
export const createItem = async (TableName, Item, options = {}) => {
    try {
        createLogger().log('PutCommand:', { TableName, Item, ...options });
        await client.send(new PutCommand({ TableName, Item, ...options }));
    }
    catch (e) {
        throw toError(e);
    }
};
export const updateItem = async (TableName, Key, UpdateExpression, ExpressionAttributeValues, options = {}) => {
    try {
        const logger = createLogger();
        const params = {
            TableName,
            Key,
            UpdateExpression,
            ExpressionAttributeValues,
            ...options,
        };
        logger.log('UpdateCommand:', params);
        await client.send(new UpdateCommand(params));
    }
    catch (e) {
        throw toError(e);
    }
};
export const getItem = async (TableName, Key, options = {}) => {
    try {
        createLogger().log('GetCommand:', { TableName, Key, ...options });
        return await client.send(new GetCommand({ TableName, Key, ...options })).then(({ Item }) => Item);
    }
    catch (e) {
        throw toError(e);
    }
};
export const deleteItem = async (TableName, Key, options = {}) => {
    try {
        createLogger().log('DeleteCommand:', { TableName, Key, ...options });
        await client.send(new DeleteCommand({ TableName, Key, ...options }));
    }
    catch (e) {
        throw toError(e);
    }
};
export const getItems = async (TableName, keys, options = {}) => {
    try {
        const logger = createLogger();
        const expressionList = [];
        const ExpressionAttributeNames = {};
        const ExpressionAttributeValues = {};
        Object.keys(keys).forEach((key) => {
            if (keys[key] !== undefined && keys[key] !== '') {
                ExpressionAttributeNames[`#${key}`] = key;
                ExpressionAttributeValues[`:${key}`] = keys[key];
                expressionList.push(`#${key} = :${key}`);
            }
        });
        const queryOptions = {
            ExpressionAttributeNames,
            ExpressionAttributeValues,
            KeyConditionExpression: expressionList.join(' AND '),
        };
        const params = { TableName, ...queryOptions, ...options };
        const items = [];
        const queryUntilDone = async (ExclusiveStartKey) => {
            logger.log('QueryCommand:', { ...params, ExclusiveStartKey });
            const data = await client.send(new QueryCommand({ ...params, ExclusiveStartKey }));
            items.push(...(data.Items || []));
            if (data.LastEvaluatedKey) {
                await queryUntilDone(data.LastEvaluatedKey);
            }
        };
        await queryUntilDone();
        return items;
    }
    catch (e) {
        throw toError(e);
    }
};
export const getAllItems = async (TableName, options = {}) => {
    try {
        const logger = createLogger();
        const params = { TableName, ...options };
        const items = [];
        const scanUntilDone = async (ExclusiveStartKey) => {
            logger.log('ScanCommand:', { ...params, ExclusiveStartKey });
            const data = await client.send(new ScanCommand({ ...params, ExclusiveStartKey }));
            items.push(...(data.Items || []));
            if (data.LastEvaluatedKey) {
                await scanUntilDone(data.LastEvaluatedKey);
            }
        };
        await scanUntilDone();
        return items;
    }
    catch (e) {
        throw toError(e);
    }
};
export const getAllItemsWithHandler = async (TableName, handler, options = {}) => {
    try {
        const logger = createLogger();
        const params = { TableName, ...options };
        const scanUntilDone = async (ExclusiveStartKey) => {
            logger.log('ScanCommand:', { ...params, ExclusiveStartKey });
            const data = await client.send(new ScanCommand({ ...params, ExclusiveStartKey }));
            await handler(data.Items || []);
            if (data.LastEvaluatedKey) {
                await scanUntilDone(data.LastEvaluatedKey);
            }
        };
        await scanUntilDone();
    }
    catch (e) {
        throw toError(e);
    }
};
