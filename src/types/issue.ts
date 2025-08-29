export interface IssueListFilters {
  project?: string;
  assignee?: string[];
  organization?: string;
  severity?: string[];
  status?: string[];
  fix?: boolean;
  limit?: number;
  json?: boolean;
}

export interface IssueShowOptions {
  organization?: string;
  fix?: boolean;
  json?: boolean;
}

export interface Issue {
  key: string;
  component: string;
  project: string;
  rule: string;
  cleanCodeAttribute: string;
  cleanCodeAttributeCategory: string;
  issueStatus: string;
  prioritizedRule: boolean;
  impacts: Array<{
    softwareQuality: string;
    severity: string;
  }>;
  message: string;
  line?: number;
  hash: string;
  author?: string;
  effort?: string;
  creationDate: string;
  updateDate: string;
  tags?: string[];
  textRange?: {
    startLine: number;
    endLine: number;
    startOffset: number;
    endOffset: number;
  };
}

export interface IssueListResponse {
  paging: {
    pageIndex: number;
    pageSize: number;
    total: number;
  };
  issues: Issue[];
}

export interface RuleDescriptionSection {
  key: string;
  content: string;
  context?: {
    displayName: string;
    key: string;
  };
}

export interface RuleResponse {
  rule: {
    key: string;
    name: string;
    descriptionSections: RuleDescriptionSection[];
  };
}

export interface SourceLine {
  line: number;
  code: string;
  scmRevision?: string;
  scmAuthor?: string;
  scmDate?: string;
  duplicated: boolean;
  isNew: boolean;
}

export interface IssueSnippetResponse {
  [componentKey: string]: {
    component: {
      key: string;
      path: string;
      name: string;
    };
    sources: SourceLine[];
  };
}
