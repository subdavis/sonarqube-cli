import chalk from 'chalk';

export function indent(text: string | (() => string)): string {
  const indentedText = typeof text === 'function' ? text() : text;
  return indentedText
    .split('\n')
    .map((line) => `  ${line}`)
    .join('\n');
}

export function formatSeverity(val: string): string {
  let severity = val.split(':')[1];
  if (!severity) {
    severity = val;
  }
  switch (severity.toUpperCase()) {
    case 'INFO':
    case 'LOW':
      return chalk.blue(val);
    case 'MEDIUM':
      return chalk.yellow(val);
    case 'HIGH':
      // Orange is not standard in chalk, use hex or rgb
      return chalk.hex('#FFA500')(val);
    case 'BLOCKER':
      return chalk.red(val);
    default:
      return severity;
  }
}

export function decodeEntities(encodedString: string) {
  const translate_re = /&(nbsp|amp|quot|lt|gt);/g;
  const translate = {
    nbsp: ' ',
    amp: '&',
    quot: '"',
    lt: '<',
    gt: '>',
  };
  return encodedString
    .replace(
      translate_re,
      function (match: string, entity: keyof typeof translate) {
        return translate[entity];
      }
    )
    .replace(/&#(\d+);/gi, function (match: string, numStr: string) {
      const num = parseInt(numStr, 10);
      return String.fromCharCode(num);
    });
}

export function addLineNumbers(code: string): string {
  const lines = code
    .split('\n')
    .slice(1, -1)
    .map(
      (line, index) =>
        `${chalk.gray.dim(String(index + 1).padStart(4, ' ') + ' |')} ${chalk.cyan.dim(line)}`
    )
    .join('\n');
  return `\n${lines}\n`;
}

export function formatCode(html: string): string {
  return html.replaceAll(/<pre[^>]*>.*?<\/pre>/gs, addLineNumbers);
}

export function stripHtmlTags(html: string): string {
  return decodeEntities(formatCode(html).replace(/<[^>]*>/g, ''));
}

export function formatPublicOrPrivate(visibility: string): string {
  return visibility === 'public'
    ? chalk.green(visibility)
    : chalk.blue.dim(visibility);
}
