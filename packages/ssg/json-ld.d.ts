export type JsonLdValue = boolean | number | string | null | readonly JsonLdValue[] | {
    readonly [key: string]: JsonLdValue | undefined;
};
export type WebPageJsonLdOptions = {
    readonly canonicalPath?: string;
    readonly description: string;
    readonly siteUrl?: string;
    readonly title: string;
};
export declare const renderJsonLdScript: (value: JsonLdValue) => string;
export declare const getWebPageJsonLd: ({ canonicalPath, description, siteUrl, title }: WebPageJsonLdOptions) => JsonLdValue;
