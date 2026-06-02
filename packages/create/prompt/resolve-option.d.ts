type ResolveOption = {
    <OptionName extends string>(value: string, optionNames: readonly OptionName[], fallback: OptionName): OptionName;
    <OptionName extends string>(value: string, optionNames: readonly OptionName[]): OptionName | undefined;
};
export declare const resolveOption: ResolveOption;
export {};
