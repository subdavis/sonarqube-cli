#!/usr/bin/env node

import { Command } from 'commander';
import { createIssueCommands } from './commands/issue';
import { createHotspotCommands } from './commands/hotspot';
import { createProjectCommands } from './commands/project';
import { createStatusCommand } from './commands/status';
import { createDepRisksCommands } from './commands/dep-risks';
import { setGlobalOptions } from './http';
import pkgData from '../package.json';

const program = new Command();

program
  .name('snr')
  .description('CLI for SonarQube Server & Cloud API')
  .version(pkgData.version)
  .addHelpText(
    'after',
    [
      '',
      'Examples:',
      '  snr issue list --project my-project --severity HIGH',
      '  snr hotspot show AZjzzVD1Xsy7a47AllAl',
      '  snr project list --favorites',
      '  snr risk list --project my-project --severity HIGH CRITICAL',
      '',
    ].join('\n')
  )
  .option('--base-url <url>', 'SonarQube server base URL')
  .option('--dry-run', 'Show what would be done, without making any changes')
  .hook('preAction', (cmd) => {
    setGlobalOptions({
      baseUrl: cmd.opts().baseUrl,
      dryRun: cmd.opts().dryRun,
    });
  });

program.addCommand(createIssueCommands());
program.addCommand(createHotspotCommands());
program.addCommand(createProjectCommands());
program.addCommand(createStatusCommand());
program.addCommand(createDepRisksCommands());

// Show help by default when no command is provided
if (process.argv.length <= 2) {
  program.help();
}

// Parse arguments to get global options
program.parse();
