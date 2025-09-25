import * as fs from 'fs';
import * as path from 'path';
import { XMLParser } from 'fast-xml-parser';

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

function parsePomXml(content: string): Record<string, string> {
  const properties: Record<string, string> = {};

  try {
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@_',
      textNodeName: '#text',
      parseAttributeValue: true,
      parseTagValue: true,
      trimValues: true,
    });

    const parsedXml = parser.parse(content);
    const project = parsedXml.project;

    if (!project) {
      return properties;
    }

    // Extract properties from the properties section
    if (project.properties && typeof project.properties === 'object') {
      for (const [key, value] of Object.entries(project.properties)) {
        if (typeof value === 'string') {
          properties[key] = value;
        }
      }
    }

    // Extract project coordinates (groupId and artifactId)
    if (project.groupId && typeof project.groupId === 'string') {
      properties['project.groupId'] = project.groupId;
    }

    if (project.artifactId && typeof project.artifactId === 'string') {
      properties['project.artifactId'] = project.artifactId;
    }
  } catch {
    // If parsing fails, return empty properties
  }

  return properties;
}

function findPropertiesFile(
  fileName: string = 'sonar-project.properties',
  startDir: string = process.cwd()
): string | null {
  let currentDir = path.resolve(startDir);

  while (currentDir !== path.dirname(currentDir)) {
    const propertiesPath = path.join(currentDir, fileName);

    if (fs.existsSync(propertiesPath)) {
      return propertiesPath;
    }

    currentDir = path.dirname(currentDir);
  }

  return null;
}

function loadSonarProjectConfig() {
  const propertiesPath = findPropertiesFile();

  if (propertiesPath) {
    // Try sonar-project.properties first (highest priority)
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
      return;
    } catch {
      // If parsing fails, fall through to pom.xml fallback
    }
  }

  // Fallback to pom.xml if no sonar-project.properties found or parsing failed
  const pomPath = findPropertiesFile('pom.xml');
  if (pomPath) {
    try {
      const content = fs.readFileSync(pomPath, 'utf-8');
      const properties = parsePomXml(content);

      const pomConfig: Partial<SonarProjectConfig> = {};

      // Extract sonar.organization from pom.xml properties
      if (properties['sonar.organization']) {
        pomConfig.organization = properties['sonar.organization'];
      }

      // Extract sonar.projectKey from pom.xml properties, or fallback to groupId:artifactId
      if (properties['sonar.projectKey']) {
        pomConfig.projectKey = properties['sonar.projectKey'];
      } else if (properties['project.groupId'] && properties['project.artifactId']) {
        pomConfig.projectKey = `${properties['project.groupId']}:${properties['project.artifactId']}`;
      }

      // Only set config if we found at least one property
      if (Object.keys(pomConfig).length > 0) {
        sonarProjectConfig = pomConfig;
      }
    } catch {
      return;
    }
  }
}

export function getSonarProjectConfig() {
  if (!sonarProjectConfig) {
    loadSonarProjectConfig();
  }
  return sonarProjectConfig ?? {};
}
