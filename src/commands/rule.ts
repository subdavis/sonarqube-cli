import { Command } from 'commander';
import { getSonarProjectConfig } from '../context';
import { RuleListFilters } from '../types/rule';
import { handleApiError } from '../utils/error-handler';
import { formatRuleRepository, formatRule } from '../formatters/rule';
import { getRuleRepositories, searchRules } from '../api';

async function listRuleRepositories(options: {
  organization?: string;
  json?: boolean;
}) {
  try {
    const contextConfig = getSonarProjectConfig();
    const organization = options.organization || contextConfig.organization;

    const data = await getRuleRepositories(organization);

    if (options.json) {
      console.log(JSON.stringify(data, null, 2));
      return;
    }

    if (data.repositories.length === 0) {
      console.log('No rule repositories found.');
      return;
    }

    console.log(`Found ${data.repositories.length} rule repositories:\n`);

    data.repositories.forEach((repo) => {
      console.log(formatRuleRepository(repo));
    });
  } catch (error) {
    handleApiError(error, 'listing rule repositories');
  }
}

async function listRules(options: RuleListFilters) {
  try {
    const contextConfig = getSonarProjectConfig();

    const filters: RuleListFilters = {
      organization: contextConfig.organization,
      ...options,
    };

    const data = await searchRules(filters);

    if (options.json) {
      console.log(JSON.stringify(data, null, 2));
      return;
    }

    if (data.rules.length === 0) {
      console.log('No rules found.');
      return;
    }

    console.log(`Found ${data.total} rules (showing ${data.rules.length}):\n`);

    data.rules.forEach((rule) => {
      console.log(formatRule(rule));
    });
  } catch (error) {
    handleApiError(error, 'listing rules');
  }
}

export function createRuleCommands(): Command {
  const ruleCommand = new Command('rule');
  ruleCommand.description('Search and review rules');

  ruleCommand
    .command('repos')
    .description('List rule repositories')
    .option('-o, --organization <org>', 'Filter by organization')
    .option('--json', 'Return raw JSON response')
    .action(listRuleRepositories);

  ruleCommand
    .command('list')
    .description('List rules')
    .option('-o, --organization <org>', 'Filter by organization')
    .option('-l, --languages <langs...>', 'Filter by programming languages')
    .option('-r, --repositories <repos...>', 'Filter by rule repositories')
    .option(
      '-s, --severities <severities...>',
      'Filter by severities (BLOCKER,CRITICAL,MAJOR,MINOR,INFO)'
    )
    .option(
      '-t, --types <types...>',
      'Filter by rule types (BUG,VULNERABILITY,CODE_SMELL,SECURITY_HOTSPOT)'
    )
    .option('--limit <number>', 'Maximum number of rules to return', (val) =>
      parseInt(val, 10)
    )
    .option('--json', 'Return raw JSON response')
    .action(listRules);

  return ruleCommand;
}
