import axios from 'axios';
import { getSonarProjectConfig } from './context';

const DEFAULT_BASE_URL = 'https://next.sonarqube.com/sonarqube';
const tokenFromEnv = process.env.SONAR_TOKEN;
const hostFromEnv = process.env.SONAR_HOST_URL || DEFAULT_BASE_URL;

const client = axios.create();

export function setGlobalBaseUrl(baseUrl?: string) {
  if (baseUrl) {
    client.defaults.baseURL = baseUrl;
    return;
  }
  const context = getSonarProjectConfig();
  if (context.host) {
    client.defaults.baseURL = context.host;
    return;
  }
  client.defaults.baseURL = hostFromEnv;
}

client.interceptors.request.use((config) => {
  if (!tokenFromEnv) {
    console.error('Error: SONAR_TOKEN environment variable is required');
    process.exit(1);
  }
  config.headers.Authorization = `Bearer ${tokenFromEnv}`;
  return config;
});

export default client;
