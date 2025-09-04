import { Command } from 'commander';
import { getSonarProjectConfig } from '../context';
import { DepRisksListFilters } from '../types';
import { handleApiError } from '../utils/error-handler';
import { formatDepRisk } from '../formatters/dep-risks';
import { searchDepRisks } from '../api';

interface DepRisksCommandOptions {
  project?: string;
  branch?: string;
  pullRequest?: string;
  packageManager?: string[];
  severity?: string[];
  status?: string[];
  newlyIntroduced?: boolean;
  direct?: boolean;
  productionScope?: boolean;
  assignee?: string[];
  page?: number;
  pageSize?: number;
  json?: boolean;
}

async function listDepRisks(_options: DepRisksCommandOptions) {
  try {
    const contextConfig = getSonarProjectConfig();

    let options: DepRisksListFilters = {
      projectKey: _options.project || contextConfig.projectKey,
      branchKey: _options.branch || contextConfig.branchName,
      pullRequestKey: _options.pullRequest,
      packageManagers: _options.packageManager,
      severities: _options.severity,
      statuses: _options.status,
      newlyIntroduced: _options.newlyIntroduced,
      direct: _options.direct,
      productionScope: _options.productionScope,
      assignees: _options.assignee,
      pageIndex: _options.page,
      pageSize: _options.pageSize,
      json: _options.json,
    };

    const data = await searchDepRisks(options);

    if (_options.json) {
      console.log(JSON.stringify(data, null, 2));
      return;
    }

    if (!data.issuesReleases || data.issuesReleases.length === 0) {
      console.log('No dependency risks found.');
      return;
    }

    console.log(
      `Found ${data.page.total} dependency risks (showing ${data.issuesReleases.length}):\n`
    );

    data.issuesReleases.forEach((depRisk) => {
      const formattedDepRisk = `${formatDepRisk(depRisk)}\n`;
      console.log(formattedDepRisk);
    });
  } catch (error) {
    handleApiError(error, 'listing dependency risks');
  }
}

export function createDepRisksCommands() {
  const depRisks = new Command('risk');
  depRisks.description('Search and review dependency risks');

  depRisks
    .command('list')
    .description('List dependency risks')
    .option('-p, --project <key>', 'Project key to filter by')
    .option('--branch <name>', 'Branch name')
    .option('--pull-request <key>', 'Pull request key')
    .option(
      '--package-manager <managers...>',
      'Package managers (can specify multiple)'
    )
    .option('--severity <severities...>', 'Severities (can specify multiple)')
    .option('--status <statuses...>', 'Statuses (can specify multiple)')
    .option('--newly-introduced', 'Show only newly introduced risks')
    .option('--direct', 'Show only direct dependencies')
    .option('--production-scope', 'Show only production scope dependencies')
    .option('--assignee <assignees...>', 'Assignees (can specify multiple)')
    .option('--page <number>', 'Page number', parseInt)
    .option('--page-size <number>', 'Page size', parseInt)
    .option('--json', 'Return raw JSON response')
    .action(listDepRisks);

  return depRisks;
}
