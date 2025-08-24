#!/usr/bin/env node

import { Command } from 'commander';

const program = new Command();

program
  .name('sonarqube-cli')
  .description('CLI for SonarQube Server API')
  .version('0.1.0');

program
  .command('info')
  .description('Show CLI information')
  .action(() => {
    console.log('SonarQube CLI v0.1.0');
    console.log('Use --help to see available commands');
  });

// Show help by default when no command is provided
if (process.argv.length <= 2) {
  program.help();
}

program.parse();
