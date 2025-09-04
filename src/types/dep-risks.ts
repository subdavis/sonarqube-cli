export interface DepRisksListFilters {
  projectKey?: string;
  branchKey?: string;
  pullRequestKey?: string;
  sort?:
    | '+identity'
    | '-identity'
    | '+severity'
    | '-severity'
    | '+cvssScore'
    | '-cvssScore';
  packageManagers?: string[];
  severities?: string[];
  statuses?: string[];
  newlyIntroduced?: boolean;
  direct?: boolean;
  productionScope?: boolean;
  assignees?: string[];
  pageIndex?: number;
  pageSize?: number;
  json?: boolean;
}

export interface DepRisk {
  key: string;
  severity: string;
  originalSeverity: string;
  manualSeverity: string | null;
  release: {
    packageName: string;
    version: string;
    packageManager: string;
    direct: boolean;
    productionScope: boolean;
  };
  type: string;
  quality: string;
  status: string;
  commentCount: string;
  vulnerabilityId?: string;
  cweIds?: string[];
  cvssScore?: string;
  spdxLicenseId?: string;
  transitions?: string[];
  actions?: string[];
  assignee?: {
    login: string;
    name: string;
  };
  createdAt: string;
}

export interface DepRisksListResponse {
  page: {
    pageIndex: number;
    pageSize: number;
    total: number;
  };
  issuesReleases: DepRisk[];
}
