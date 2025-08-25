## features

Build a modular HTML to CLI plain text formatter to the following specs:

- Each tag has its own formatting function
- tags without a defined function simply return their inner content.
- Semantic HTML tags like ul, li, a, code, headers etc should have visual formatting using chalk js when applicable.
- It's OK to add charcters, like a bullet character for li elements, where appropriate.
- The output should resemble markdown-style formatting.

Newlines should NOT be respected: the output should have line breaks according to the HTML structure rather than preserving line breaks in the input text. [pre tags are the EXCEPTION to this! Important! pre tags preserve newlines and whitespace]

- Block elements should have newlines just like html.
- Inline elements should NOT have newlines.
  - p tags should be treated as inline! important!

The output plain text should be confied to a variable defined max width (default 100),
and line wrapping should preserve left padding! If a a li is intended inside a ul and it has to wrap, it needs to wrap consistent with its left padding.

Build a new src/formatters/html.ts that takes an input HTML string and returns the output plain text. Leave the current formatting code in place.

## how to build it

First, use JSDOM to parse the DOM document.

Then, recursively iterate the DOM tree and render all inline nodes to text.

- An inline node should never have a block node as a child. If you encounter this, treat the block
