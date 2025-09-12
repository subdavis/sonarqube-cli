export interface Project {
  organization?: string; // cloud only
  key: string;
  projectId: string;
  projectUuidV4: string;
  name: string;
  isFavorite: boolean;
  tags: string[];
  visibility: string;
  isNew: boolean;
  hasPullRequestOrBranchAnalysis: boolean;
  isAiCodeAssured: boolean;
}

export interface ProjectSearchResponse {
  paging: {
    pageIndex: number;
    pageSize: number;
    total: number;
  };
  organizations: {
    key: string;
    name: string;
  }[];
  components: Project[];
}

export interface ProjectListFilters {
  organization?: string;
  q?: string;
  page?: number;
  pageSize?: number;
  favorites?: boolean;
  json?: boolean;
}

export interface ProjectCreateFilters {
  name: string;
  project: string;
  organization?: string;
  visibility?: string;
  mainBranch?: string;
  newCodeDefinitionValue?: string;
  newCodeDefinitionType?: string;
  json?: boolean;
}

export interface ProjectCreateResponse {
  project: {
    key: string;
    name: string;
    qualifier: string;
  };
}

export interface ProjectDeleteFilters {
  projects?: string[];
  analyzedBefore?: string;
  json?: boolean;
}
