import { GetParameterCommand, GetParametersCommand } from '@aws-sdk/client-ssm';
import { createLogger } from '@vyriy/logger';
import { toError } from '@vyriy/error';
import { createClient } from './client.js';
export const getParameter = async (parameterName, decrypted = true) => {
    try {
        const client = createClient();
        const logger = createLogger();
        logger.log('GetParameterCommand:', parameterName, decrypted);
        const response = await client.send(new GetParameterCommand({ Name: parameterName, WithDecryption: decrypted }));
        const parameter = response.Parameter?.Value || '';
        logger.log(parameter);
        return parameter;
    }
    catch (e) {
        createLogger().error(e);
        throw toError(e);
    }
};
export const getParameters = async (parameterNames, decrypted = true) => {
    try {
        const client = createClient();
        const logger = createLogger();
        logger.log('GetParametersCommand:', parameterNames, decrypted);
        const response = await client.send(new GetParametersCommand({ Names: parameterNames, WithDecryption: decrypted }));
        const parameters = response.Parameters?.reduce((result, { Name, Value }) => {
            if (Name && Value !== undefined) {
                result[Name] = Value;
            }
            return result;
        }, {}) ?? {};
        logger.log(parameters);
        return parameters;
    }
    catch (e) {
        createLogger().error(e);
        throw toError(e);
    }
};
