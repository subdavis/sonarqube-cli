import { transformForCloud } from './http';
import { InternalAxiosRequestConfig } from 'axios';

// Mock axios request config for testing
interface MockAxiosRequestConfig extends Partial<InternalAxiosRequestConfig> {
  url?: string;
  baseURL?: string;
}

jest.mock('axios-curlirize/src/lib/CurlHelper', () => ({
  CurlHelper: jest.fn(),
}));

describe('transformForCloud', () => {
  describe('SonarCloud transformations', () => {
    it('should transform sonarcloud.io URLs correctly', () => {
      const config: MockAxiosRequestConfig = {
        url: '/api/v2/sca/issues-releases',
        baseURL: 'https://sonarcloud.io',
      };

      transformForCloud(config as InternalAxiosRequestConfig);

      expect(config.baseURL).toBe('https://api.sonarcloud.io');
      expect(config.url).toBe('/sca/issues-releases');
    });

    it('should transform subdomain sonarcloud URLs correctly', () => {
      const config: MockAxiosRequestConfig = {
        url: '/api/v2/users',
        baseURL: 'https://dev.sonarcloud.io',
      };

      transformForCloud(config as InternalAxiosRequestConfig);

      expect(config.baseURL).toBe('https://api.sonarcloud.io');
      expect(config.url).toBe('/users');
    });

    it('should not transform if already using api subdomain', () => {
      const config: MockAxiosRequestConfig = {
        url: '/api/v2/projects',
        baseURL: 'https://api.sonarcloud.io',
      };

      transformForCloud(config as InternalAxiosRequestConfig);

      expect(config.baseURL).toBe('https://api.sonarcloud.io');
      expect(config.url).toBe('/projects');
    });
  });

  describe('SonarQube.us transformations', () => {
    it('should transform sonarqube.us URLs correctly', () => {
      const config: MockAxiosRequestConfig = {
        url: '/api/v2/system/status',
        baseURL: 'https://sonarqube.us',
      };

      transformForCloud(config as InternalAxiosRequestConfig);

      expect(config.baseURL).toBe('https://api.sonarqube.us');
      expect(config.url).toBe('/system/status');
    });

    it('should transform subdomain sonarqube.us URLs correctly', () => {
      const config: MockAxiosRequestConfig = {
        url: '/api/v2/organizations',
        baseURL: 'https://myorg.sonarqube.us',
      };

      transformForCloud(config as InternalAxiosRequestConfig);

      expect(config.baseURL).toBe('https://api.sonarqube.us');
      expect(config.url).toBe('/organizations');
    });
  });

  describe('sc-dev URLs transformations', () => {
    it('should transform sc-dev1.io URLs correctly', () => {
      const config: MockAxiosRequestConfig = {
        url: '/api/v2/measures',
        baseURL: 'https://sc-dev1.io',
      };

      transformForCloud(config as InternalAxiosRequestConfig);

      expect(config.baseURL).toBe('https://api.sc-dev1.io');
      expect(config.url).toBe('/measures');
    });

    it('should transform sc-dev14.io URLs correctly', () => {
      const config: MockAxiosRequestConfig = {
        url: '/api/v2/sca/issues-releases',
        baseURL: 'https://dev.sc-dev14.io',
      };

      transformForCloud(config as InternalAxiosRequestConfig);

      expect(config.baseURL).toBe('https://api.sc-dev14.io');
      expect(config.url).toBe('/sca/issues-releases');
    });
  });

  describe('sc-staging.io transformations', () => {
    it('should transform sc-staging.io URLs correctly', () => {
      const config: MockAxiosRequestConfig = {
        url: '/api/v2/webhooks',
        baseURL: 'https://sc-staging.io',
      };

      transformForCloud(config as InternalAxiosRequestConfig);

      expect(config.baseURL).toBe('https://api.sc-staging.io');
      expect(config.url).toBe('/webhooks');
    });

    it('should transform subdomain sc-staging.io URLs correctly', () => {
      const config: MockAxiosRequestConfig = {
        url: '/api/v2/tokens',
        baseURL: 'https://test.sc-staging.io',
      };

      transformForCloud(config as InternalAxiosRequestConfig);

      expect(config.baseURL).toBe('https://api.sc-staging.io');
      expect(config.url).toBe('/tokens');
    });
  });

  describe('URL with query parameters', () => {
    it('should preserve query parameters in the transformed URL', () => {
      const config: MockAxiosRequestConfig = {
        url: '/api/v2/search?q=test&page=1',
        baseURL: 'https://sonarcloud.io',
      };

      transformForCloud(config as InternalAxiosRequestConfig);

      expect(config.baseURL).toBe('https://api.sonarcloud.io');
      expect(config.url).toBe('/search?q=test&page=1');
    });
  });

  describe('Non-cloud URLs', () => {
    it('should not transform non-cloud URLs', () => {
      const config: MockAxiosRequestConfig = {
        url: '/api/v2/issues',
        baseURL: 'https://my-sonarqube.company.com',
      };

      const originalBaseURL = config.baseURL;
      const originalUrl = config.url;

      transformForCloud(config as InternalAxiosRequestConfig);

      expect(config.baseURL).toBe(originalBaseURL);
      expect(config.url).toBe(originalUrl);
    });

    it('should not transform localhost URLs', () => {
      const config: MockAxiosRequestConfig = {
        url: '/api/v2/projects',
        baseURL: 'http://localhost:9000',
      };

      const originalBaseURL = config.baseURL;
      const originalUrl = config.url;

      transformForCloud(config as InternalAxiosRequestConfig);

      expect(config.baseURL).toBe(originalBaseURL);
      expect(config.url).toBe(originalUrl);
    });
  });

  describe('Non-v2 API URLs', () => {
    it('should not transform non-v2 API URLs for cloud hosts', () => {
      const config: MockAxiosRequestConfig = {
        url: '/api/issues/search',
        baseURL: 'https://sonarcloud.io',
      };

      const originalBaseURL = config.baseURL;
      const originalUrl = config.url;

      transformForCloud(config as InternalAxiosRequestConfig);

      expect(config.baseURL).toBe(originalBaseURL);
      expect(config.url).toBe(originalUrl);
    });

    it('should not transform v1 API URLs', () => {
      const config: MockAxiosRequestConfig = {
        url: '/api/v1/projects',
        baseURL: 'https://sonarcloud.io',
      };

      const originalBaseURL = config.baseURL;
      const originalUrl = config.url;

      transformForCloud(config as InternalAxiosRequestConfig);

      expect(config.baseURL).toBe(originalBaseURL);
      expect(config.url).toBe(originalUrl);
    });
  });

  describe('Edge cases', () => {
    it('should handle /api/v2/ path with trailing slash', () => {
      const config: MockAxiosRequestConfig = {
        url: '/api/v2/',
        baseURL: 'https://sonarcloud.io',
      };

      transformForCloud(config as InternalAxiosRequestConfig);

      expect(config.baseURL).toBe('https://api.sonarcloud.io');
      expect(config.url).toBe('/');
    });
  });
});
