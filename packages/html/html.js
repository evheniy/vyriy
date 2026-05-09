export const html = (props = {}) => {
    const { htmlAttributes = '', title = '', meta = '', base = '', link = '', style = '', bodyAttributes = '', body = '', noscript = '', script = '', } = props;
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
