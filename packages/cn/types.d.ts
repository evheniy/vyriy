export type ClassDictionary = Record<string, boolean | undefined | null>;
export type ClassItem = string | ClassDictionary | ClassItem[] | null | undefined | false;
export type ClassNames = (...items: ClassItem[]) => string;
