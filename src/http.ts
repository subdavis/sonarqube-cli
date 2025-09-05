import axios, { InternalAxiosRequestConfig } from 'axios';
// @ts-expect-error No type declarations for CurlHelper
import { CurlHelper } from 'axios-curlirize/src/lib/CurlHelper';
import { URL } from 'node:url';
import { getSonarProjectConfig } from './context';

const DEFAULT_BASE_URL = 'https://next.sonarqube.com/sonarqube';
const tokenFromEnv = process.env.SONAR_TOKEN;
const hostFromEnv = process.env.SONAR_HOST_URL || DEFAULT_BASE_URL;

const client = axios.create();

export function setGlobalOptions({
  baseUrl,
  dryRun,
}: {
  baseUrl?: string;
  dryRun?: boolean;
}) {
  const context = getSonarProjectConfig();
  client.defaults.baseURL = baseUrl || context.host || hostFromEnv;
  client.defaults.headers['X-Dry-Run'] = dryRun ? 'true' : null;
}

/**
 * On CLOUD, special case:
 * https://<host>/api/v2/path should instead to go https://api.<top_level_domain>/path
 * For example,
 *  https://dev.sc-dev.io/api/v2/path should go to https://api.sc-dev.io/path
 *  https://sonarcloud.io/api/v2/path should go to https://api.sonarcloud.io/path
 */
export function transformForCloud(config: InternalAxiosRequestConfig) {
  const fullUrl = new URL(config.url!, config.baseURL);

  if (!fullUrl.pathname.startsWith('/api/v2')) return;

  const cloudPatterns = [
    /sonarcloud/,
    /sonarqube\.us/,
    /sc-dev\d+\.io/,
    /sc-staging\.io/,
  ];

  const isCloudHost = cloudPatterns.some((pattern) =>
    pattern.test(fullUrl.hostname)
  );
  if (!isCloudHost) return;

  if (!fullUrl.hostname.startsWith('api.')) {
    const hostParts = fullUrl.hostname.split('.');
    if (hostParts.length === 2) {
      fullUrl.hostname = `api.${fullUrl.hostname}`;
    } else {
      hostParts[0] = 'api';
      fullUrl.hostname = hostParts.join('.');
    }
  }

  fullUrl.pathname = fullUrl.pathname.replace(/^\/api\/v2/, '');
  config.baseURL = fullUrl.origin;
  config.url = fullUrl.pathname + fullUrl.search;
}

client.interceptors.request.use((config) => {
  if (!tokenFromEnv) {
    console.error('Error: SONAR_TOKEN environment variable is required');
    process.exit(1);
  }

  config.headers['Content-Type'] = 'application/json';
  config.headers.Authorization = `Bearer ${tokenFromEnv}`;
  transformForCloud(config);

  if (client.defaults.headers['X-Dry-Run'] === 'true') {
    const curl = new CurlHelper(config);
    console.log(curl.generateCommand());
    process.exit(0);
  }

  return config;
});

export default client;
