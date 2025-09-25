import { Command } from 'commander';
import { getSonarProjectConfig } from '../context';
import chalk from 'chalk';

export function createConfigCommand(): Command {
  const configCmd = new Command('config');
  configCmd.description('Show discovered configuration').action(() => {
    const config = getSonarProjectConfig();

    console.log(chalk.bold('SonarQube CLI Configuration:'));

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
      console.log(`${chalk.green('sonar.projectKey:')} ${config.projectKey}`);
    }

    if (config.organization) {
      console.log(
        `${chalk.green('sonar.organization:')} ${config.organization}`
      );
    }

    if (config.host) {
      console.log(`${chalk.green('sonar.host.url:')} ${config.host}`);
    }

    if (config.branchName) {
      console.log(`${chalk.green('sonar.branch.name:')} ${config.branchName}`);
    }

    if (config.projectName) {
      console.log(`${chalk.green('sonar.projectName:')} ${config.projectName}`);
    }

    if (process.env.SONAR_HOST_URL) {
      console.log(
        `${chalk.green('sonar.host.url:')} ${process.env.SONAR_HOST_URL}`
      );
    }

    if (process.env.SONAR_TOKEN) {
      console.log(`${chalk.green('sonar.token:')} defined`);
    } else {
      console.log(`${chalk.red('sonar.token:')} undefined`);
    }
  });

  return configCmd;
}
