import { writeFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const baseUrl = 'https://next.sonarqube.com/sonarqube/api/';
const docsUrl = 'webservices/list?include_internals=true';

async function fetchJson(
  url: string,
  outputFileName: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transform?: (data: unknown) => any
) {
  try {
    const response = await fetch(baseUrl + url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    let data = await response.json();
    if (transform) {
      data = transform(data);
    }

    const docsDir = join(__dirname, '../..', 'docs');
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
  const exampleUrl = `webservices/response_example?controller=${encodeURIComponent(params.controller)}&action=${encodeURIComponent(params.action)}`;
  fetchJson(
    exampleUrl,
    `response-example-${params.controller.replace(/\//g, '-')}-${params.action}.json`,
    (data) => {
      return JSON.parse(data.example);
    }
  );
}

fetchJson(docsUrl, 'api-spec.json');

const controllers = [{ controller: 'api/issues', action: 'search' }];

controllers.forEach(({ controller, action }) => {
  getResponseExample({ controller, action });
});
