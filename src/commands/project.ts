import { Command } from 'commander';
import { getSonarProjectConfig } from '../context';
import { ProjectListFilters, ProjectCreateFilters, ProjectDeleteFilters } from '../types/project';
import { handleApiError } from '../utils/error-handler';
import { formatProject } from '../formatters/project';

import { searchProjects, createProject, deleteProject } from '../api';

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

async function createNewProject(overrides: ProjectCreateFilters) {
  try {
    const contextConfig = getSonarProjectConfig();
    const fromContext: Partial<ProjectCreateFilters> = {
      organization: contextConfig.organization,
      project: contextConfig.projectKey,
      mainBranch: contextConfig.branchName,
      name: contextConfig.projectName,
    };

    let options: ProjectCreateFilters = {
      ...fromContext,
      ...overrides,
    };

    const data = await createProject(options);

    if (options.json) {
      console.log(JSON.stringify(data, null, 2));
      return;
    }

    const output = `Project created successfully:
      Key: ${data.project.key}
      Name: ${data.project.name}
      Qualifier: ${data.project.qualifier}`;
    console.log(output);
  } catch (error) {
    handleApiError(error, 'creating project');
  }
}

async function deleteProjects(options: ProjectDeleteFilters) {
  try {
    if (!options.projects && !options.analyzedBefore) {
      console.error('Error: Either --project or --analyzed-before must be specified');
      process.exit(1);
    }

    await deleteProject(options);

    if (options.json) {
      console.log(JSON.stringify({ message: 'Projects deleted successfully' }, null, 2));
    } else {
      const projectCount = options.projects?.length || 0;
      if (projectCount > 0) {
        console.log(`Successfully deleted ${projectCount} project(s): ${options.projects!.join(', ')}`);
      } else {
        console.log(`Successfully deleted projects analyzed before ${options.analyzedBefore}`);
      }
    }
  } catch (error) {
    handleApiError(error, 'deleting projects');
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
    .action(listProjects);

  projectCommand
    .command('create')
    .description('Create a new project')
    .option('-n, --name <name>', 'Project name')
    .option('-p, --project <key>', 'Project key')
    .option('-o, --organization <org>', 'Organization')
    .option(
      '-v, --visibility <visibility>',
      'Project visibility (public or private)'
    )
    .option('-b, --main-branch <branch>', 'Main branch name')
    .option('--new-code-definition-value <value>', 'New code definition value')
    .option('--new-code-definition-type <type>', 'New code definition type')
    .option('--json', 'Return raw JSON response')
    .action(createNewProject);

  projectCommand
    .command('delete')
    .description('Delete projects')
    .option('-p, --project <keys...>', 'Project keys to delete')
    .option('--analyzed-before <date>', 'Delete projects analyzed before this date (YYYY-MM-DD)')
    .option('--json', 'Return raw JSON response')
    .action(deleteProjects);

  return projectCommand;
}
