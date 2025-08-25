import chalk from 'chalk';
import { indent } from './common';
import { formatHtml } from './html';
import { Hotspot, HotspotShowResponse } from '../types';

export function formatHotspot(hotspot: Hotspot) {
  return indent(
    [
      `${chalk.bold.underline(hotspot.key)}: ${chalk.reset(hotspot.message)}`,
      indent(
        `${chalk.blue.dim(hotspot.component)}${hotspot.line ? chalk.dim(`:${hotspot.line}`) : ''}`
      ),
      chalk.blue(
        indent(
          `${chalk.dim(hotspot.status)}, Rule:${chalk.dim(hotspot.ruleKey)}, Category:${chalk.dim(hotspot.securityCategory)}, Probability:${chalk.dim(hotspot.vulnerabilityProbability)}, Created:${chalk.dim(hotspot.creationDate)}`
        )
      ),
    ]
      .filter(Boolean)
      .join('\n')
  );
}

export function formatHotspotDetails(hotspot: HotspotShowResponse): string {
  let output = '';

  output += chalk.bold.inverse('Hotspot Details\n\n');
  output += indent(() => {
    let description = '';
    description += `${chalk.cyan('Key')}: ${hotspot.key}\n`;
    description += `${chalk.cyan('Project')}: ${hotspot.project.name}\n`;
    description += `${chalk.cyan('Component')}: ${hotspot.component.path || hotspot.component.name}\n`;
    description += `${chalk.cyan('Security Category')}: ${hotspot.rule.securityCategory}\n`;
    description += `${chalk.cyan('Vulnerability Probability')}: ${hotspot.rule.vulnerabilityProbability}\n`;
    description += `${chalk.cyan('Status')}: ${hotspot.status}\n`;
    description += `${chalk.cyan('Rule')}: ${hotspot.rule.key}\n`;
    description += `${chalk.cyan('Message')}: ${hotspot.message}\n`;
    description += `${chalk.cyan('Created')}: ${hotspot.creationDate}\n`;
    if (hotspot.line) description += `${chalk.cyan('Line')}: ${hotspot.line}\n`;
    if (hotspot.assignee)
      description += `${chalk.cyan('Assignee')}: ${hotspot.assignee}\n`;
    if (hotspot.author)
      description += `${chalk.cyan('Author')}: ${hotspot.author}\n`;
    return description;
  });

  if (hotspot.rule.riskDescription) {
    output += chalk.bold.inverse('\n\nRisk Description\n\n');
    output += indent(formatHtml(hotspot.rule.riskDescription));
  }

  if (hotspot.rule.vulnerabilityDescription) {
    output += chalk.bold.inverse('\n\nVulnerability Description\n\n');
    output += indent(formatHtml(hotspot.rule.vulnerabilityDescription));
  }

  if (hotspot.rule.fixRecommendations) {
    output += chalk.bold.inverse('\n\nFix Recommendations\n\n');
    output += indent(formatHtml(hotspot.rule.fixRecommendations));
  }

  if (hotspot.comment && hotspot.comment.length > 0) {
    output += chalk.bold.inverse('\n\nComments\n\n');
    hotspot.comment.forEach((comment) => {
      output += `${comment.login} (${comment.createdAt}):\n`;
      output += indent(formatHtml(comment.htmlText));
      output += '\n';
    });
  }

  if (hotspot.changelog && hotspot.changelog.length > 0) {
    output += chalk.bold.inverse('\n\nChangelog\n\n');
    hotspot.changelog.forEach((change) => {
      output += `${change.userName} (${change.creationDate}):\n`;
      change.diffs.forEach((diff) => {
        output += `  ${diff.key}: ${diff.oldValue} → ${diff.newValue}\n`;
      });
      output += '\n';
    });
  }

  return output;
}
