import chalk from 'chalk';
import { DepRisk } from '../types';
import { formatSeverity, indent } from './common';

export function formatDepRisk(depRisk: DepRisk) {
  const packageInfo = `${depRisk.release.packageName}@${depRisk.release.version}`;
  const dependencyType = depRisk.release.direct ? 'Direct' : 'Transitive';
  const scope = depRisk.release.productionScope
    ? 'Production'
    : 'Non-Production';

  const line1 = [
    chalk.bold.underline(depRisk.key),
    ':',
    chalk.reset(depRisk.vulnerabilityId || depRisk.type),
    chalk.blue.dim(packageInfo),
    `(${chalk.dim(dependencyType)}, ${chalk.dim(scope)})`,
  ];

  const line2 = chalk.blue(
    `${chalk.dim(depRisk.status)}, Severity:${chalk.dim(formatSeverity(depRisk.severity))}, Type:${chalk.dim(depRisk.type)}, Manager:${chalk.dim(depRisk.release.packageManager)}`
  );

  const line3: string[] = [];

  if (depRisk.cvssScore) {
    line3.push(`CVSS Score: ${chalk.dim(depRisk.cvssScore)}`);
  }
  if (depRisk.assignee) {
    line3.push(
      `Assignee: ${chalk.dim(depRisk.assignee.name)} (${chalk.dim(depRisk.assignee.login)})`
    );
  }
  if (depRisk.vulnerabilityId) {
    line3.push(`Vulnerability ID: ${chalk.dim(depRisk.vulnerabilityId)}`);
  }

  if (depRisk.cweIds && depRisk.cweIds.length > 0) {
    line3.push(`CWE IDs: ${chalk.dim(depRisk.cweIds.join(', '))}`);
  }

  const output = [
    line1.join(' '),
    indent(line2),
    indent(chalk.blue(line3.join(' '))),
  ].join('\n');

  return indent(output);
}
