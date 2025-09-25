import chalk from 'chalk';
import { Project } from '../types/project';
import { formatPublicOrPrivate, indent } from './common';
import client from '../http';
import { wrapText } from './html';
import { URL } from 'node:url';

export function formatProject(project: Project) {
  const tags = project.tags.length > 0 ? project.tags.join(', ') : 'No tags';
  const favorite = project.isFavorite ? '⭐ ' : '';

  let titleLine = '';
  if (project.organization) {
    titleLine += `${project.organization}/`;
  }
  titleLine += `${chalk.bold(project.name)} ${favorite}`;

  let line2 = `${chalk.bold('Key')}:${project.key} `;
  if (project.tags.length > 0) {
    line2 += `${chalk.bold('Tags')}:${tags} `;
  }
  line2 += `${chalk.bold('Visibility')}:${formatPublicOrPrivate(project.visibility)}`;

  const issuesUrl = new URL(
    `/project/issues?id=${project.key}`,
    client.defaults.baseURL
  ).href;

  const output = [
    titleLine,
    indent(chalk.blue.dim(wrapText(line2))),
    indent(chalk.gray.dim(issuesUrl)),
  ]
    .filter(Boolean)
    .join('\n');

  return indent(output);
}
