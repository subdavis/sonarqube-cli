export interface HotspotListFilters {
  project?: string;
  organization?: string;
  status?: string[];
  fix?: boolean;
  limit?: number;
}

export interface HotspotShowFilters {
  organization?: string;
  fix?: boolean;
}

export interface Hotspot {
  key: string;
  component: string;
  project: string;
  securityCategory: string;
  vulnerabilityProbability: string;
  status: string;
  line?: number;
  message: string;
  messageFormattings: Array<{
    start: number;
    end: number;
    type: string;
  }>;
  assignee?: string;
  author: string;
  creationDate: string;
  updateDate: string;
  flows: unknown[];
  ruleKey: string;
}

export interface HotspotComponent {
  key: string;
  qualifier: string;
  name: string;
  longName: string;
  path?: string;
}

export interface HotspotListResponse {
  paging: {
    pageIndex: number;
    pageSize: number;
    total: number;
  };
  hotspots: Hotspot[];
  components: HotspotComponent[];
}

export interface HotspotRule {
  key: string;
  name: string;
  securityCategory: string;
  vulnerabilityProbability: string;
  riskDescription?: string;
  vulnerabilityDescription?: string;
  fixRecommendations?: string;
}

export interface HotspotChangelogDiff {
  key: string;
  newValue: string;
  oldValue: string;
}

export interface HotspotChangelog {
  user: string;
  userName: string;
  creationDate: string;
  diffs: HotspotChangelogDiff[];
  avatar?: string;
  isUserActive: boolean;
}

export interface HotspotComment {
  key: string;
  login: string;
  htmlText: string;
  markdown: string;
  createdAt: string;
}

export interface HotspotUser {
  login: string;
  name: string;
  active: boolean;
}

export interface HotspotShowResponse {
  key: string;
  component: HotspotComponent;
  project: HotspotComponent;
  rule: HotspotRule;
  status: string;
  line?: number;
  hash: string;
  message: string;
  messageFormattings: Array<{
    start: number;
    end: number;
    type: string;
  }>;
  assignee?: string;
  author: string;
  creationDate: string;
  updateDate: string;
  changelog: HotspotChangelog[];
  comment: HotspotComment[];
  users: HotspotUser[];
  canChangeStatus: boolean;
  codeVariants?: string[];
}
