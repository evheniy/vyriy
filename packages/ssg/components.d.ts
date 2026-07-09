import type { ComponentProps, FC, ReactNode } from 'react';
type CardProps = ComponentProps<'article'> & {
    readonly date?: string;
    readonly description: string;
    readonly href: string;
    readonly tags?: readonly string[];
    readonly title: string;
};
type CatalogProps = {
    readonly content: ReactNode;
    readonly paginate: {
        readonly getHref?: (page: number) => string;
        readonly page: number;
        readonly pages: number;
    };
};
type PageRelatedItem = {
    readonly description: string;
    readonly href: string;
    readonly title: string;
};
type PageProps = {
    readonly content: ReactNode;
    readonly featured?: readonly PageRelatedItem[];
    readonly related?: readonly PageRelatedItem[];
    readonly tags?: readonly string[];
};
type SearchPageProps = {
    readonly documentsUrl?: string;
    readonly indexUrl?: string;
    readonly miniSearchScriptUrl?: string;
};
export declare const Card: FC<CardProps>;
export declare const Page: FC<PageProps>;
export declare const Catalog: FC<CatalogProps>;
export declare const NotFoundPage: FC<{
    readonly homeHref?: string;
}>;
export declare const SearchPage: FC<SearchPageProps>;
export {};
