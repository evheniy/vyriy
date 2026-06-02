export const resolveOption = (value, optionNames, fallback) => {
    const normalizedValue = value.trim();
    const numericValue = Number.parseInt(normalizedValue, 10);
    if (Number.isInteger(numericValue)) {
        return optionNames[numericValue - 1] ?? fallback;
    }
    return optionNames.find((optionName) => optionName === normalizedValue) ?? fallback;
};
