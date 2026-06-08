const isLineBreak = (character) => character === '\n' || character === '\r';
const isWhitespace = (character) => character === ' ' || character === '\t' || character === '\n' || character === '\r' || character === '\f';
const trimWhitespaceEnd = (value) => {
    let end = value.length;
    while (end > 0 && isWhitespace(value.charAt(end - 1))) {
        end -= 1;
    }
    return value.slice(0, end);
};
const trimTagGapEnd = (value) => {
    const trimmed = trimWhitespaceEnd(value);
    return trimmed.at(-1) === '>' ? trimmed : value;
};
export const minify = (html) => {
    const trimmed = html.trim();
    let minified = '';
    for (let index = 0; index < trimmed.length; index += 1) {
        const character = trimmed.charAt(index);
        if (isLineBreak(character)) {
            minified = trimWhitespaceEnd(minified);
            while (isWhitespace(trimmed.charAt(index + 1))) {
                index += 1;
            }
            if (minified.at(-1) !== '>' || trimmed.charAt(index + 1) !== '<') {
                minified += ' ';
            }
            continue;
        }
        if (character === '<') {
            minified = trimTagGapEnd(minified);
        }
        minified += character;
    }
    return minified;
};
