import { formatDepRisk } from './dep-risks';
import { DepRisk } from '../types/dep-risks';

// Mock chalk to avoid ESM issues
jest.mock('chalk', () => {
  const mockChalkFunction = (str: string) => str;
  mockChalkFunction.dim = (str: string) => str;

  return {
    __esModule: true,
    default: {
      bold: { underline: (str: string) => str },
      reset: (str: string) => str,
      blue: Object.assign(mockChalkFunction, {
        dim: (str: string) => str,
      }),
      dim: (str: string) => str,
      yellow: (str: string) => str,
      red: (str: string) => str,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      hex: (color: string) => (str: string) => str,
    },
  };
});

describe('formatDepRisk', () => {
  const baseDepRisk: DepRisk = {
    key: 'AY1234567890',
    severity: 'HIGH',
    originalSeverity: 'HIGH',
    manualSeverity: null,
    release: {
      packageName: 'lodash',
      version: '4.17.20',
      packageManager: 'npm',
      direct: true,
      productionScope: true,
    },
    type: 'VULNERABILITY',
    quality: 'UNKNOWN',
    status: 'OPEN',
    commentCount: '0',
    createdAt: '2023-01-01T00:00:00.000Z',
  };

  it('should format basic dep risk information', () => {
    const result = formatDepRisk(baseDepRisk);

    expect(result).toContain(baseDepRisk.key);
    expect(result).toContain('lodash@4.17.20');
    expect(result).toContain('Direct');
    expect(result).toContain('Production');
    expect(result).toContain('OPEN');
    expect(result).toContain('HIGH');
    expect(result).toContain('VULNERABILITY');
    expect(result).toContain('npm');
  });

  it('should show transitive and non-production dependencies correctly', () => {
    const transitiveRisk: DepRisk = {
      ...baseDepRisk,
      release: {
        ...baseDepRisk.release,
        direct: false,
        productionScope: false,
      },
    };

    const result = formatDepRisk(transitiveRisk);

    expect(result).toContain('Transitive');
    expect(result).toContain('Non-Production');
  });

  it('should include CVSS score when present', () => {
    const riskWithCvss: DepRisk = {
      ...baseDepRisk,
      cvssScore: '7.5',
    };

    const result = formatDepRisk(riskWithCvss);

    expect(result).toContain('CVSS Score');
    expect(result).toContain('7.5');
  });

  it('should include assignee information when present', () => {
    const riskWithAssignee: DepRisk = {
      ...baseDepRisk,
      assignee: {
        login: 'john.doe',
        name: 'John Doe',
      },
    };

    const result = formatDepRisk(riskWithAssignee);

    expect(result).toContain('Assignee');
    expect(result).toContain('John Doe');
    expect(result).toContain('john.doe');
  });

  it('should include vulnerability ID when present', () => {
    const riskWithVuln: DepRisk = {
      ...baseDepRisk,
      vulnerabilityId: 'CVE-2021-23337',
    };

    const result = formatDepRisk(riskWithVuln);

    expect(result).toContain('CVE-2021-23337');
    expect(result).toContain('Vulnerability ID');
  });

  it('should include CWE IDs when present', () => {
    const riskWithCwe: DepRisk = {
      ...baseDepRisk,
      cweIds: ['CWE-79', 'CWE-89'],
    };

    const result = formatDepRisk(riskWithCwe);

    expect(result).toContain('CWE IDs');
    expect(result).toContain('CWE-79');
    expect(result).toContain('CWE-89');
  });

  it('should handle all optional fields together', () => {
    const fullRisk: DepRisk = {
      ...baseDepRisk,
      vulnerabilityId: 'CVE-2021-23337',
      cvssScore: '9.8',
      cweIds: ['CWE-79', 'CWE-89', 'CWE-20'],
      assignee: {
        login: 'security.team',
        name: 'Security Team',
      },
    };

    const result = formatDepRisk(fullRisk);

    expect(result).toContain('CVE-2021-23337');
    expect(result).toContain('CVSS Score');
    expect(result).toContain('9.8');
    expect(result).toContain('CWE IDs');
    expect(result).toContain('CWE-79, CWE-89, CWE-20');
    expect(result).toContain('Assignee');
    expect(result).toContain('Security Team');
  });

  it('should not include optional fields when they are not present', () => {
    const result = formatDepRisk(baseDepRisk);

    expect(result).not.toContain('CVSS Score');
    expect(result).not.toContain('Assignee');
    expect(result).not.toContain('Vulnerability ID');
    expect(result).not.toContain('CWE IDs');
  });
});
