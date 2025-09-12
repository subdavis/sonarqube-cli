export interface RuleRepository {
  key: string;
  name: string;
  language: string;
}

export interface RuleRepositoriesResponse {
  repositories: RuleRepository[];
}

export interface Rule {
  key: string;
  repo: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  htmlDesc: string;
  severity: string;
  status: string;
  internalKey?: string;
  isTemplate: boolean;
  tags: string[];
  sysTags: string[];
  lang: string;
  langName: string;
  scope: string;
  isExternal: boolean;
  type: string;
  cleanCodeAttributeCategory?: string;
  cleanCodeAttribute?: string;
  impacts?: Array<{
    softwareQuality: string;
    severity: string;
  }>;
  descriptionSections?: Array<{
    key: string;
    content: string;
    context?: {
      displayName: string;
      key: string;
    };
  }>;
  params?: Array<{
    key: string;
    desc: string;
    defaultValue: string;
  }>;
}

export interface RuleSearchResponse {
  /** @param paging is only available from SQ Server responses */
  paging?: {
    pageSize: number;
    total: number;
    pageIndex: number;
  };
  total: number;
  ps: number;
  p: number;
  rules: Rule[];
  facets?: Array<{
    name: string;
    values: Array<{
      val: string;
      count: number;
    }>;
  }>;
}

export interface RuleListFilters {
  organization?: string;
  languages?: string[];
  repositories?: string[];
  severities?: string[];
  types?: string[];
  json?: boolean;
  limit?: number;
}
