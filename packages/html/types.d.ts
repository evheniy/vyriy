export type HtmlProps = {
    htmlAttributes?: string;
    title?: string;
    meta?: string;
    base?: string;
    link?: string;
    style?: string;
    bodyAttributes?: string;
    body?: string;
    noscript?: string;
    script?: string;
};
export type Html = (props?: HtmlProps) => string;
export type Minify = (html: string) => string;
