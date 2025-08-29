import { Command } from 'commander';
import { getSonarProjectConfig } from '../context';
import { ProjectListFilters } from '../types/project';
import { handleApiError } from '../utils/error-handler';
import { formatProject } from '../formatters/project';

import { searchProjects } from '../api';

async function listProjects(_options: ProjectListFilters) {
  try {
    const contextConfig = getSonarProjectConfig();

    let options: ProjectListFilters = {
      ...{
        organization: contextConfig.organization,
      },
      ..._options,
    };

    const data = await searchProjects(options);

    if (_options.json) {
      console.log(JSON.stringify(data, null, 2));
      return;
    }

    if (data.components.length === 0) {
      console.log('No projects found.');
      return;
    }

    console.log(
      `Found ${data.paging.total} projects (showing ${data.components.length}):\n`
    );

    data.components.forEach((project) => {
      const formattedProject = `${formatProject(project)}\n`;
      console.log(formattedProject);
    });
  } catch (error) {
    handleApiError(error, 'listing projects');
  }
}

export function createProjectCommands(): Command {
  const projectCommand = new Command('project');
  projectCommand.description('Show SonarQube projects');

  projectCommand
    .command('list')
    .description('List projects')
    .option('-o, --organization <org>', 'Filter by organization')
    .option('-q, --query <query>', 'Search query for project names and keys')
    .option('-f, --favorites', 'Show only favorite projects')
    .option('-p, --page <number>', 'Page number (1-based)', (val) =>
      parseInt(val, 10)
    )
    .option('--page-size <number>', 'Page size (max 500)', (val) =>
      parseInt(val, 10)
    )
    .option('--json', 'Return raw JSON response')
    .action(async (options) => {
      await listProjects({
        organization: options.organization,
        q: options.q,
        favorites: options.favorites,
        p: options.page,
        ps: options.pageSize,
        json: options.json,
      });
    });

  return projectCommand;
}
