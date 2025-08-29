import { Command } from 'commander';
import { getSonarProjectConfig } from '../context';
import { IssueListFilters, IssueShowOptions } from '../types';
import { remediate } from '../remediate';
import { handleApiError } from '../utils/error-handler';
import { formatIssue, formatIssueDetails } from '../formatters/issue';
import { searchIssues, getIssue, getRule, getIssueSnippet } from '../api';

async function listIssues(_options: IssueListFilters) {
  try {
    const contextConfig = getSonarProjectConfig();

    let options: IssueListFilters = {
      organization: contextConfig.organization,
      project: contextConfig.projectKey,
      ..._options
    };

    const data = await searchIssues(options);

    if (data.issues.length === 0) {
      console.log('No issues found.');
      return;
    }

    console.log(
      `Found ${data.paging.total} issues (showing ${data.issues.length}):\n`
    );

    if (_options.fix) {
      await remediate(
        data.issues.map((issue) => {
          return async () => {
            const snippet = await getIssueSnippet(
              issue.key,
              options.organization
            );
            const rule = await getRule(issue.rule, options.organization);
            return formatIssueDetails(issue, rule, snippet);
          };
        })
      );
    } else {
      data.issues.forEach((issue) => {
        const formattedIssue = `${formatIssue(issue)}\n`;

        if (!_options.fix) {
          console.log(formattedIssue);
        }
      });
    }
  } catch (error: unknown) {
    handleApiError(error, 'fetching issues');
  }
}

async function showIssue(issueId: string, _options: IssueShowOptions) {
  try {
    const contextConfig = getSonarProjectConfig();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { fix, ...optionsWithoutFix } = _options;
    let options: Omit<IssueShowOptions, 'fix'> = {
      organization: contextConfig.organization,
      ...optionsWithoutFix
    };
    const [issueResponse, snippetResponse] = await Promise.all([
      getIssue(issueId, options.organization),
      getIssueSnippet(issueId, options.organization),
    ]);

    const issue = issueResponse.issues[0];
    if (!issue) {
      console.error(`Issue with ID '${issueId}' not found.`);
      process.exit(1);
    }

    const ruleResp = await getRule(issue.rule, options.organization);

    const issueOutput = formatIssueDetails(issue, ruleResp, snippetResponse);

    console.log(issueOutput);

    if (_options.fix) {
      remediate([() => Promise.resolve(issueOutput)]);
    }
  } catch (error: unknown) {
    handleApiError(error, 'fetching issue details');
  }
}

export function createIssueCommands() {
  const issueCmd = new Command('issue');
  issueCmd.description('Manage issues');

  issueCmd
    .command('list')
    .description('List project issues')
    .option('--project <key>', 'Project key to filter by')
    .option(
      '--assignee <assignees...>',
      'Assignee logins to filter by (can specify multiple)'
    )
    .option('--organization <org>', 'Organization to filter by')
    .option(
      '--severity <severities...>',
      'Severities to filter by: INFO, LOW, MEDIUM, HIGH, BLOCKER (can specify multiple)'
    )
    .option(
      '--status <statuses...>',
      'Statuses to filter by: OPEN, CONFIRMED, REOPENED, RESOLVED, CLOSED (can specify multiple)'
    )
    .option('--fix', 'Automatically fix issues with configured LLM')
    .option(
      '--limit <number>',
      'Maximum number of issues to return (default: 20)',
      parseInt
    )
    .action(async (options) => {
      await listIssues(options);
    });

  issueCmd
    .command('show <id>')
    .option('--organization <org>', 'Organization to filter by')
    .option('--fix', 'Automatically fix the issue with configured LLM')
    .description('Show detailed information about a specific issue')
    .action((id: string, options: IssueShowOptions) => {
      showIssue(id, options);
    });

  return issueCmd;
}
