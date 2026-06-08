const defaultMeta = '<meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" />';
export const html = (props = {}) => {
    const { htmlAttributes = '', title = '', meta = defaultMeta, base = '', link = '', style = '', bodyAttributes = '', body = '', noscript = '', script = '', } = props;
    return `
  <!DOCTYPE html>
  <html ${htmlAttributes}>
  <head>
    ${title}
    ${base}
    ${meta}
    ${link}
    ${style}
  </head>
  <body ${bodyAttributes}>
    ${body}
    ${noscript}
    ${script}
  </body>
  </html>
  `;
};
