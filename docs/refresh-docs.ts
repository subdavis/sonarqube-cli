import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const baseUrl = 'https://sonarcloud.io/';
const docsUrl = 'api/webservices/list?include_internals=true';
const exampleUrl = 'api/webservices/response_example';

async function fetchJson(
  url: string,
  outputFileName: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transform?: (data: unknown) => any
) {
  try {
    const response = await globalThis.fetch(baseUrl + url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    let data = await response.json();
    if (transform) {
      data = transform(data);
    }

    const docsDir = join(process.cwd(), 'docs');
    const outputPath = join(docsDir, outputFileName);

    // Ensure docs directory exists
    mkdirSync(docsDir, { recursive: true });
    writeFileSync(outputPath, JSON.stringify(data, null, 2));
    console.log(`✅ Fetched JSON from ${url}`);
    console.log(`   Wrote to ${outputPath}`);
  } catch (error) {
    console.error('❌ Failed to fetch JSON:', error);
  }
}

function getResponseExample(params: { controller: string; action: string }) {
  fetchJson(
    `${exampleUrl}?controller=${encodeURIComponent(params.controller)}&action=${encodeURIComponent(params.action)}`,
    `response-example-${params.controller.replace(/\//g, '-')}-${params.action}.json`,
    (data) => {
      return JSON.parse((data as { example: string }).example);
    }
  );
}

fetchJson(docsUrl, 'api-spec.json');

const controllers = [
  { controller: 'api/issues', action: 'search' },
  { controller: 'api/rules', action: 'show' },
  { controller: 'api/sources', action: 'issue_snippets' },
  { controller: 'api/sources', action: 'lines' },
  { controller: 'api/hotspots', action: 'search' },
  { controller: 'api/hotspots', action: 'show' },
  { controller: 'api/components', action: 'search_projects' },
  { controller: 'api/system', action: 'status' },
];

controllers.forEach(({ controller, action }) => {
  getResponseExample({ controller, action });
});
