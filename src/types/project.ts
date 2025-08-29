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
  p?: number;
  ps?: number;
  favorites?: boolean;
  json?: boolean;
}
