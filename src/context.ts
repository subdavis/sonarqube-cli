import * as fs from 'fs';
import * as path from 'path';

interface SonarProjectConfig {
  projectKey?: string;
  organization?: string;
  host?: string;
  branchName?: string;
  projectName?: string;
}

let sonarProjectConfig: SonarProjectConfig | null = null;

function parseProperties(content: string): Record<string, string> {
  const properties: Record<string, string> = {};
  const lines = content.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      if (key && valueParts.length > 0) {
        properties[key.trim()] = valueParts.join('=').trim();
      }
    }
  }

  return properties;
}

function findSonarProjectProperties(
  startDir: string = process.cwd()
): string | null {
  let currentDir = path.resolve(startDir);

  while (currentDir !== path.dirname(currentDir)) {
    const propertiesPath = path.join(currentDir, 'sonar-project.properties');

    if (fs.existsSync(propertiesPath)) {
      return propertiesPath;
    }

    currentDir = path.dirname(currentDir);
  }

  return null;
}

function loadSonarProjectConfig() {
  const propertiesPath = findSonarProjectProperties();

  if (!propertiesPath) {
    return;
  }

  try {
    const content = fs.readFileSync(propertiesPath, 'utf-8');
    const properties = parseProperties(content);

    sonarProjectConfig = {
      projectKey: properties['sonar.projectKey'],
      organization: properties['sonar.organization'],
      host: properties['sonar.host.url'],
      branchName: properties['sonar.branch.name'],
      projectName: properties['sonar.projectName'],
    };
  } catch {
    return;
  }
}

export function getSonarProjectConfig() {
  if (!sonarProjectConfig) {
    loadSonarProjectConfig();
  }
  return sonarProjectConfig ?? {};
}
