import chalk from 'chalk';
import { Issue, RuleResponse, IssueSnippetResponse } from '../types';
import { formatSeverity, indent } from './common';
import { formatHtml, stripHtmlTags } from './html';

export function formatIssue(issue: Issue) {
  const impactText =
    issue.impacts
      ?.map((impact) => `${impact.softwareQuality}:${impact.severity}`)
      .join(', ') || 'N/A';

  const output = [
    `${chalk.bold.underline(issue.key)}: ${chalk.reset(issue.message)}`,
    indent(`${chalk.blue.dim(issue.component)}${chalk.dim(issue.line ?? '')}`),
    chalk.blue(
      indent(
        `${chalk.dim(issue.issueStatus)}, Rule:${chalk.dim(issue.rule)},  Impact:${chalk.dim(formatSeverity(impactText))}, Created:${chalk.dim(issue.creationDate)}`
      )
    ),
  ]
    .filter(Boolean)
    .join('\n');

  return indent(output);
}

export function formatIssueDetails(
  issue: Issue,
  rule: RuleResponse,
  snippet: IssueSnippetResponse
): string {
  let output = '';

  output += chalk.bold.inverse('Issue Details\n\n');

  output += indent(() => {
    let description = '';
    description += `${chalk.cyan('Key')}: ${issue.key}\n`;
    description += `${chalk.cyan('Project')}: ${issue.project}\n`;
    description += `${chalk.cyan('Component')}: ${issue.component}\n`;
    description += `${chalk.cyan('Rule')}: ${issue.rule}\n`;
    description += `${chalk.cyan('Message')}: ${issue.message}\n`;
    description += `${chalk.cyan('Status')}: ${issue.issueStatus}\n`;
    description += `${chalk.cyan('Clean Code Attribute')}: ${issue.cleanCodeAttribute}\n`;
    description += `${chalk.cyan('Clean Code Category')}: ${issue.cleanCodeAttributeCategory}\n`;
    description += `${chalk.cyan('Prioritized Rule')}: ${issue.prioritizedRule ? 'Yes' : 'No'}\n`;

    const impactText =
      issue.impacts
        ?.map((impact) => `${impact.softwareQuality}:${impact.severity}`)
        .join(', ') || 'N/A';
    description += `${chalk.cyan('Impacts')}: ${formatSeverity(impactText)}\n`;

    description += `${chalk.cyan('Created')}: ${issue.creationDate}\n`;
    description += `${chalk.cyan('Updated')}: ${issue.updateDate}\n`;
    if (issue.line) description += `${chalk.cyan('Line')}: ${issue.line}\n`;
    if (issue.author)
      description += `${chalk.cyan('Author')}: ${issue.author}\n`;
    if (issue.effort)
      description += `${chalk.cyan('Effort')}: ${issue.effort}\n`;
    if (issue.tags && issue.tags.length > 0)
      description += `${chalk.cyan('Tags')}: ${issue.tags.join(', ')}\n`;
    if (issue.textRange) {
      description += `${chalk.cyan('Text Range')}: ${issue.textRange.startLine}-${issue.textRange.endLine} (${issue.textRange.startOffset}-${issue.textRange.endOffset})\n`;
    }
    return description;
  });

  output += chalk.bold.inverse('\n\nRule Description\n\n');

  output += indent(() =>
    rule.rule.descriptionSections
      .map((section) => {
        const title = chalk.bold.bgGray(
          `${section.key.replaceAll('_', ' ').toLowerCase()}:`
        );
        const body = indent(formatHtml(section.content));
        return `\n${title}\n\n${body}\n`;
      })
      .join('')
  );

  output += chalk.bold.inverse('\n\nCode Snippet\n\n');
  const componentKey = Object.keys(snippet)[0];

  if (componentKey && snippet[componentKey]) {
    const component = snippet[componentKey];
    output += indent(`File(${chalk.bold(component.component.path)})\n\n`);

    component.sources.forEach((source) => {
      const lineNumber = source.line.toString().padStart(4, ' ');
      let code = stripHtmlTags(source.code);

      // Apply red background to problematic code if textRange matches this line
      if (
        issue.textRange &&
        source.line >= issue.textRange.startLine &&
        source.line <= issue.textRange.endLine
      ) {
        if (issue.textRange.startLine === issue.textRange.endLine) {
          // Single line issue - highlight specific character range
          const before = code.substring(0, issue.textRange.startOffset);
          const problematic = code.substring(
            issue.textRange.startOffset,
            issue.textRange.endOffset
          );
          const after = code.substring(issue.textRange.endOffset);
          code = before + chalk.reset.bgRed(problematic) + after;
        } else {
          // Multi-line issue - highlight entire line
          code = chalk.reset.bgRed(code);
        }
      }

      output += indent(
        `${chalk.dim.gray(lineNumber + ' |')} ${chalk.cyan(code)}\n`
      );
    });
  } else {
    output += indent('No code snippet available.');
  }

  return indent(output);
}
