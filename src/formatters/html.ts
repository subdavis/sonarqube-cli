import chalk from 'chalk';
import TurndownService from 'turndown';

const COLUMNS = process.stdout.columns ?? 100;

function formatCodeLine(line: string): string {
  // Check for inline comments (comments that appear after code on the same line)
  const inlineCommentPatterns = [
    /(.*?)(\s+\/\/.*)/, // JavaScript, C++, Java, etc.
    /(.*?)(\s+#.*)/, // Python, Ruby, Shell, etc. (but be careful with string literals)
    /(.*?)(\s+--.*)/, // SQL, Haskell, etc.
    /(.*?)(\s+;.*)/, // Assembly, some Lisps
    /(.*?)(\s+'.*)/, // VB.NET, etc.
    /(.*?)(\s+%.*)/, // LaTeX, Prolog, etc.
    /(.*?)(\s+\/\*.*\*\/)/, // C-style single-line comments
  ];

  // Check for inline comments first
  for (const pattern of inlineCommentPatterns) {
    const match = pattern.exec(line);
    if (match) {
      const [, codePart, commentPart] = match;
      // Only treat as comment if there's actual code before it (not just whitespace)
      if (codePart.trim()) {
        return `${chalk.cyan.dim(codePart)}${chalk.gray.dim(commentPart)}`;
      }
    }
  }

  // Check for line-start comments (entire line is a comment)
  const lineStartCommentPatterns = [
    /^(\s*)(\/\/.*)/, // JavaScript, C++, Java, etc.
    /^(\s*)(#.*)/, // Python, Ruby, Shell, etc.
    /^(\s*)(--.*)/, // SQL, Haskell, etc.
    /^(\s*)(;.*)/, // Lisp, Assembly, etc.
    /^(\s*)('.*)/, // VB.NET, etc.
    /^(\s*)(%.*)/, // LaTeX, Prolog, etc.
    /^(\s*)(\/\*.*\*\/?)/, // C-style comments
    /^(\s*)(<!--.*-->?)/, // HTML comments
    /^(\s*)(\(\*.*\*\)?)/, // Pascal, OCaml comments
    /^(\s*)(\/\/\/.*)/, // XML doc comments
    /^(\s*)(\/\*\*.*)/, // JSDoc comments
    /^(\s*)(###?.*)/, // Python docstrings/comments
    /^(\s*)(---.*)/, // YAML comments
  ];

  // Check if line starts with a comment
  for (const pattern of lineStartCommentPatterns) {
    const match = pattern.exec(line);
    if (match) {
      const [, whitespace, comment] = match;
      return `${chalk.cyan.dim(whitespace)}${chalk.gray.dim(comment)}`;
    }
  }

  // Check for multi-line comment continuations (lines that are inside /* */ blocks)
  const trimmedLine = line.trim();
  if (trimmedLine.startsWith('*') && !trimmedLine.startsWith('*/')) {
    // This looks like a continuation of a /* */ comment block
    const leadingWhitespace = /^\s*/.exec(line)?.[0] || '';
    const commentPart = line.substring(leadingWhitespace.length);
    return `${chalk.cyan.dim(leadingWhitespace)}${chalk.gray.dim(commentPart)}`;
  }

  // Not a comment, return with normal code formatting
  return chalk.cyan.dim(line);
}

function addLineNumbers(code: string): string {
  const lines = code.split('\n');
  const numberedLines = lines
    .map(
      (line, index) =>
        `${chalk.gray.dim(String(index + 1).padStart(4, ' ') + ' |')} ${formatCodeLine(line)}`
    )
    .join('\n');
  return `\n${numberedLines}\n`;
}

// Backward compatibility with existing stripHtmlTags function
export function stripHtmlTags(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}

function breakLongWord(word: string, maxWidth: number): string[] {
  const chunks: string[] = [];
  for (let i = 0; i < word.length; i += maxWidth) {
    chunks.push(word.slice(i, i + maxWidth));
  }
  return chunks;
}

function addWordToLine(currentLine: string, word: string): string {
  return currentLine + (currentLine ? ' ' : '') + word;
}

function processWordInLine(
  word: string,
  currentLine: string,
  maxWidth: number
): {
  lines: string[];
  newCurrentLine: string;
} {
  const result: string[] = [];
  let newLine = currentLine;

  // Case 1: Word is too long for a single line
  if (word.length > maxWidth) {
    if (newLine) {
      result.push(newLine.trim());
      newLine = '';
    }
    result.push(...breakLongWord(word, maxWidth));
    return { lines: result, newCurrentLine: newLine };
  }

  // Case 2: Word fits on current line
  const lineWithWord = addWordToLine(newLine, word);
  if (lineWithWord.length <= maxWidth) {
    return { lines: result, newCurrentLine: lineWithWord };
  }

  // Case 3: Word needs a new line
  if (newLine) {
    result.push(newLine.trim());
  }
  return { lines: result, newCurrentLine: word };
}

function wrapSingleLine(line: string, maxWidth: number): string[] {
  if (line.length <= maxWidth) {
    return [line];
  }

  const words = line.split(' ');
  const wrappedLines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    const { lines, newCurrentLine } = processWordInLine(
      word,
      currentLine,
      maxWidth
    );
    wrappedLines.push(...lines);
    currentLine = newCurrentLine;
  }

  if (currentLine) {
    wrappedLines.push(currentLine.trim());
  }

  return wrappedLines;
}

export function wrapText(text: string, maxWidth = COLUMNS - 6): string {
  if (!text || maxWidth <= 0) return text;
  if (text.length <= maxWidth) return text;

  const lines = text.split('\n');
  const allWrappedLines: string[] = [];

  for (const line of lines) {
    allWrappedLines.push(...wrapSingleLine(line, maxWidth));
  }

  return allWrappedLines.join('\n');
}

export function formatHtml(html: string): string {
  const td = new TurndownService({
    headingStyle: 'atx',
  });
  td.addRule('pre', {
    filter: 'pre',
    replacement: (content) => {
      return addLineNumbers(content);
    },
  });
  td.addRule('headings strong', {
    filter: ['h1', 'h2', 'h3'],
    replacement: (content, node) => {
      const level = parseInt(node.nodeName.charAt(1));
      return chalk.bold.blue(`#`.repeat(level) + ' ' + content);
    },
  });
  td.addRule('headings weak', {
    filter: ['h4', 'h5', 'h6'],
    replacement: (content) => {
      return chalk.blue.dim(content);
    },
  });
  td.addRule('emphasis', {
    filter: ['em', 'i'],
    replacement: (content) => {
      return chalk.italic(content);
    },
  });
  td.addRule('strong', {
    filter: ['strong', 'b'],
    replacement: (content) => {
      return chalk.bold(content);
    },
  });
  td.addRule('underline', {
    filter: ['u', 'ins'],
    replacement: (content) => {
      return chalk.underline(content);
    },
  });
  td.addRule('strikethrough', {
    filter: ['del', 's', 'strike'],
    replacement: (content) => {
      return chalk.strikethrough(content);
    },
  });
  td.addRule('code', {
    filter: ['code', 'kbd', 'samp', 'var', 'mark'],
    replacement: (content) => {
      return `\`${chalk.cyan(content)}\``;
    },
  });
  td.addRule('too long', {
    filter: ['p'],
    replacement: (content) => `\n\n${wrapText(content)}\n\n`,
  });
  td.addRule('link', {
    filter: ['a'],
    replacement: (content, node) => {
      const href = node.getAttribute('href');
      return `[${content}](${chalk.blue.dim(href)})`;
    },
  });

  const formatted = td.turndown(html);

  return formatted;
}
