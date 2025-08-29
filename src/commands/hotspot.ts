import { Command } from 'commander';
import { getSonarProjectConfig } from '../context';
import { HotspotListFilters, HotspotShowFilters } from '../types/hotspot';
import { remediate } from '../remediate';
import { handleApiError } from '../utils/error-handler';
import { formatHotspot, formatHotspotDetails } from '../formatters/hotspot';
import { searchHotspots, getHotspot } from '../api';

async function listHotspots(options: HotspotListFilters) {
  try {
    const contextConfig = getSonarProjectConfig();

    let params: HotspotListFilters = {
      organization: contextConfig.organization,
      project: contextConfig.projectKey,
      ...options
    };

    const data = await searchHotspots(params);

    if (data.hotspots.length === 0) {
      console.log('No hotspots found.');
      return;
    }

    console.log(
      `Found ${data.paging.total} hotspots (showing ${data.hotspots.length}):\n`
    );

    if (options.fix) {
      await remediate(
        data.hotspots.map((hotspot) => {
          return async () => formatHotspot(hotspot);
        })
      );
    } else {
      data.hotspots.forEach((hotspot) => {
        const formattedHotspot = `${formatHotspot(hotspot)}\n`;
        console.log(formattedHotspot);
      });
    }
  } catch (error: unknown) {
    handleApiError(error, 'fetching hotspots');
  }
}

async function showHotspot(hotspotId: string, options: HotspotShowFilters) {
  try {
    const contextConfig = getSonarProjectConfig();
    let params: HotspotShowFilters = {
      organization: contextConfig.organization,
      ...options
    };

    const hotspot = await getHotspot(hotspotId, params);
    if (!hotspot) {
      console.error(`Hotspot with ID '${hotspotId}' not found.`);
      process.exit(1);
    }

    const hotspotOutput = formatHotspotDetails(hotspot);

    if (options.fix) {
      await remediate([() => Promise.resolve(hotspotOutput)]);
    } else {
      console.log(hotspotOutput);
    }
  } catch (error: unknown) {
    handleApiError(error, 'fetching hotspot details');
  }
}

export function createHotspotCommands() {
  const hotspotCmd = new Command('hotspot');
  hotspotCmd.description('Manage security hotspots');

  hotspotCmd
    .command('list')
    .description('List security hotspots')
    .option('--project <key>', 'Project key to filter by')
    .option('--organization <org>', 'Organization to filter by')
    .option(
      '--status <statuses...>',
      'Statuses to filter by: TO_REVIEW, REVIEWED (can specify multiple)'
    )
    .option('--fix', 'Automatically fix hotspots with configured LLM')
    .option(
      '--limit <number>',
      'Maximum number of hotspots to return (default: 20)',
      parseInt
    )
    .action(listHotspots);

  hotspotCmd
    .command('show <id>')
    .option('--organization <org>', 'Organization to filter by')
    .option('--fix', 'Automatically fix the hotspot with configured LLM')
    .description('Show detailed information about a specific hotspot')
    .action(showHotspot);

  return hotspotCmd;
}
