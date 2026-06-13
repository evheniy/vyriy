export declare const create: {
    api: import("../types.js").Api;
    dynamodb: (options?: import("../types.js").EventHandlerOptions<import("aws-lambda").DynamoDBStreamEvent>) => import("../types.js").Decorator<import("aws-lambda").DynamoDBStreamEvent, void>;
    eventBridge: (options?: import("../types.js").EventHandlerOptions<import("aws-lambda").EventBridgeEvent<string, unknown>>) => import("../types.js").Decorator<import("aws-lambda").EventBridgeEvent<string, unknown>, void>;
    httpApi: import("../types.js").HttpApi;
    s3: (options?: import("../types.js").EventHandlerOptions<import("aws-lambda").S3Event>) => import("../types.js").Decorator<import("aws-lambda").S3Event, void>;
    schedule: (options?: import("../types.js").EventHandlerOptions<import("aws-lambda").ScheduledEvent>) => import("../types.js").Decorator<import("aws-lambda").ScheduledEvent, void>;
    ses: (options?: import("../types.js").EventHandlerOptions<import("aws-lambda").SESEvent>) => import("../types.js").Decorator<import("aws-lambda").SESEvent, void>;
    sns: (options?: import("../types.js").EventHandlerOptions<import("aws-lambda").SNSEvent>) => import("../types.js").Decorator<import("aws-lambda").SNSEvent, void>;
    sqs: (options?: import("../types.js").EventHandlerOptions<import("aws-lambda").SQSEvent>) => import("../types.js").Decorator<import("aws-lambda").SQSEvent, void>;
    streamApi: import("../types.js").StreamApi;
};
