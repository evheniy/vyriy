export const replaceInlineCode = (value) => {
    let result = '';
    let index = 0;
    while (index < value.length) {
        if (value[index] === '`') {
            const endIndex = value.indexOf('`', index + 1);
            if (endIndex !== -1) {
                result += ` ${value.slice(index + 1, endIndex)} `;
                index = endIndex + 1;
                continue;
            }
        }
        result += value[index];
        index += 1;
    }
    return result;
};
export const replaceMarkdownLinks = (value) => {
    let result = '';
    let index = 0;
    while (index < value.length) {
        const isImage = value[index] === '!' && value[index + 1] === '[';
        const isLink = value[index] === '[';
        if (isImage || isLink) {
            const labelStartIndex = index + (isImage ? 2 : 1);
            const labelEndIndex = value.indexOf(']', labelStartIndex);
            const urlStartIndex = labelEndIndex + 1;
            if (labelEndIndex !== -1 && value[urlStartIndex] === '(') {
                const urlEndIndex = value.indexOf(')', urlStartIndex + 1);
                if (urlEndIndex !== -1) {
                    result += ` ${value.slice(labelStartIndex, labelEndIndex)} `;
                    index = urlEndIndex + 1;
                    continue;
                }
            }
        }
        result += value[index];
        index += 1;
    }
    return result;
};
export const stripFencedCode = (value) => {
    let result = '';
    let index = 0;
    while (index < value.length) {
        if (value.startsWith('```', index)) {
            const endIndex = value.indexOf('```', index + 3);
            result += ' ';
            index = endIndex === -1 ? value.length : endIndex + 3;
            continue;
        }
        result += value[index];
        index += 1;
    }
    return result;
};
export const stripHtmlTags = (value) => {
    let result = '';
    let index = 0;
    while (index < value.length) {
        if (value[index] === '<') {
            const endIndex = value.indexOf('>', index + 1);
            if (endIndex !== -1) {
                result += ' ';
                index = endIndex + 1;
                continue;
            }
        }
        result += value[index];
        index += 1;
    }
    return result;
};
