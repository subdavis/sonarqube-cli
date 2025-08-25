#!/usr/bin/env node

import { Command } from 'commander';
import { createIssueCommands } from './commands/issue';
import { createHotspotCommands } from './commands/hotspot';
import { createProjectCommands } from './commands/project';
import { createStatusCommand } from './commands/status';
import { setGlobalBaseUrl } from './http';

const program = new Command();

program
  .name('sonarqube-cli')
  .description('CLI for SonarQube Server API')
  .version('0.1.0')
  .option('--base-url <url>', 'SonarQube server base URL')
  .hook('preAction', (cmd) => {
    setGlobalBaseUrl(cmd.opts().baseUrl);
  });

program
  .command('info')
  .description('Show CLI information')
  .action(() => {
    console.log('SonarQube CLI v0.1.0');
    console.log('Use --help to see available commands');
  });

program.addCommand(createIssueCommands());
program.addCommand(createHotspotCommands());
program.addCommand(createProjectCommands());
program.addCommand(createStatusCommand());

// Show help by default when no command is provided
if (process.argv.length <= 2) {
  program.help();
}

// Parse arguments to get global options
program.parse();
