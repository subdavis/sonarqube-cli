import { Command } from 'commander';
import { getSonarProjectConfig } from '../context';
import chalk from 'chalk';

export function createConfigCommand(): Command {
  const configCmd = new Command('config');
  configCmd.description('Show discovered configuration').action(() => {
    const config = getSonarProjectConfig();

    console.log(chalk.bold('SonarQube Configuration\n'));

    if (Object.keys(config).length === 0) {
      console.log(chalk.yellow('No configuration found.'));
      console.log(chalk.gray('Configuration can be found in:'));
      console.log(chalk.gray('  • sonar-project.properties files'));
      console.log(
        chalk.gray(
          '  • pom.xml files (sonar.organization, sonar.projectKey, or groupId:artifactId)'
        )
      );
      console.log(chalk.gray('  • Environment variables'));
      console.log(chalk.gray('  • Command line arguments'));
      return;
    }

    if (config.projectKey) {
      console.log(`${chalk.green('Project Key:')} ${config.projectKey}`);
    }

    if (config.organization) {
      console.log(`${chalk.green('Organization:')} ${config.organization}`);
    }

    if (config.host) {
      console.log(`${chalk.green('Host URL:')} ${config.host}`);
    }

    if (config.branchName) {
      console.log(`${chalk.green('Branch Name:')} ${config.branchName}`);
    }

    if (config.projectName) {
      console.log(`${chalk.green('Project Name:')} ${config.projectName}`);
    }
  });

  return configCmd;
}
