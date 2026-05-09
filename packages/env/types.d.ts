export type GetEnv = {
    (name: string): string | never;
    <T extends string>(name: string): T | never;
    <T extends string>(name: string, defaultValue: T): T;
};
export type ExistsEnv = (name: string) => boolean;
export type GetEnvWithValue<T extends string = string> = () => T;
export type GetBooleanEnvWithValue = () => boolean;
export type GetNumberEnvWithValue = () => number;
export type NodeEnv = 'production' | 'development' | 'test';
export type GetNodeEnv = () => NodeEnv;
export type IsNodeEnv = () => boolean;
export type IsStage = () => boolean;
export declare enum AwsRegion {
    UsEast1 = "us-east-1",
    UsEast2 = "us-east-2",
    UsWest1 = "us-west-1",
    UsWest2 = "us-west-2",
    CaCentral1 = "ca-central-1",
    CaWest1 = "ca-west-1",
    MxCentral1 = "mx-central-1",
    SaEast1 = "sa-east-1",
    EuWest1 = "eu-west-1",
    EuWest2 = "eu-west-2",
    EuWest3 = "eu-west-3",
    EuCentral1 = "eu-central-1",
    EuCentral2 = "eu-central-2",
    EuNorth1 = "eu-north-1",
    EuSouth1 = "eu-south-1",
    EuSouth2 = "eu-south-2",
    MeSouth1 = "me-south-1",
    MeCentral1 = "me-central-1",
    AfSouth1 = "af-south-1",
    IlCentral1 = "il-central-1",
    ApNorthEast1 = "ap-northeast-1",
    ApNorthEast2 = "ap-northeast-2",
    ApNorthEast3 = "ap-northeast-3",
    ApSouth1 = "ap-south-1",
    ApSouth2 = "ap-south-2",
    ApEast1 = "ap-east-1",
    ApEast2 = "ap-east-2",
    ApSouthEast1 = "ap-southeast-1",
    ApSouthEast2 = "ap-southeast-2",
    ApSouthEast3 = "ap-southeast-3",
    ApSouthEast4 = "ap-southeast-4",
    ApSouthEast5 = "ap-southeast-5",
    ApSouthEast6 = "ap-southeast-6",
    ApSouthEast7 = "ap-southeast-7",
    UsGovWest1 = "us-gov-west-1",
    UsGovEast1 = "us-gov-east-1",
    CnNorth1 = "cn-north-1",
    CnNorthWest1 = "cn-northwest-1"
}
export declare enum Stage {
    Local = "local",
    Dev = "dev",
    Develop = "develop",
    Test = "test",
    Testing = "testing",
    Qa = "qa",
    Uat = "uat",
    Staging = "staging",
    PreProduction = "pre-production",
    PreProd = "preprod",
    Feature = "feature",
    Hotfix = "hotfix",
    Production = "production"
}
