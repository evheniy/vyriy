export declare const create: {
    api: import("../types.js").Api;
    dynamodb: (options?: import("../types.js").EventHandlerOptions<import("node_modules/@types/aws-lambda/index.js").DynamoDBStreamEvent>) => import("../types.js").Decorator<import("node_modules/@types/aws-lambda/index.js").DynamoDBStreamEvent, void>;
    eventBridge: (options?: import("../types.js").EventHandlerOptions<import("node_modules/@types/aws-lambda/index.js").EventBridgeEvent<string, unknown>>) => import("../types.js").Decorator<import("node_modules/@types/aws-lambda/index.js").EventBridgeEvent<string, unknown>, void>;
    httpApi: import("../types.js").HttpApi;
    s3: (options?: import("../types.js").EventHandlerOptions<import("node_modules/@types/aws-lambda/index.js").S3Event>) => import("../types.js").Decorator<import("node_modules/@types/aws-lambda/index.js").S3Event, void>;
    schedule: (options?: import("../types.js").EventHandlerOptions<import("node_modules/@types/aws-lambda/index.js").ScheduledEvent>) => import("../types.js").Decorator<import("node_modules/@types/aws-lambda/index.js").ScheduledEvent, void>;
    ses: (options?: import("../types.js").EventHandlerOptions<import("node_modules/@types/aws-lambda/index.js").SESEvent>) => import("../types.js").Decorator<import("node_modules/@types/aws-lambda/index.js").SESEvent, void>;
    sns: (options?: import("../types.js").EventHandlerOptions<import("node_modules/@types/aws-lambda/index.js").SNSEvent>) => import("../types.js").Decorator<import("node_modules/@types/aws-lambda/index.js").SNSEvent, void>;
    sqs: (options?: import("../types.js").EventHandlerOptions<import("node_modules/@types/aws-lambda/index.js").SQSEvent>) => import("../types.js").Decorator<import("node_modules/@types/aws-lambda/index.js").SQSEvent, void>;
    streamApi: import("../types.js").StreamApi;
};
