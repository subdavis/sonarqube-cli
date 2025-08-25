import { Command } from 'commander';
import client from '../http';
import chalk from 'chalk';

interface SystemStatus {
  id: string;
  version: string;
  status: string;
}


export function createStatusCommand(): Command {
  const statusCmd = new Command('status');
  statusCmd
    .description('Check system status')
    .action(async () => {
      try {
        // Call system/status
        const response = await client.get<SystemStatus>('/api/system/status');
        const { data } = response;

        console.log(chalk.bold('SonarQube System Status\n'));

        console.log(`${chalk.blue('Server URL:')} ${client.defaults.baseURL}`);
        console.log(`${chalk.blue('Status:')} ${getStatusColor(data.status)}`);
        console.log(`${chalk.blue('Version:')} ${data.version}`);
        console.log(`${chalk.blue('ID:')} ${data.id}`);

      } catch (error) {
        console.error(chalk.red('Error checking system status:'));
        console.error(error instanceof Error ? error.message : String(error));
        process.exit(1);
      }
    });

  return statusCmd;
}

function getStatusColor(status: string): string {
  switch (status.toUpperCase()) {
    case 'UP':
      return chalk.green(status);
    case 'DOWN':
      return chalk.red(status);
    case 'STARTING':
    case 'RESTARTING':
      return chalk.yellow(status);
    default:
      return chalk.gray(status);
  }
}

