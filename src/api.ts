import client from './http';
import {
  IssueListFilters,
  IssueListResponse,
  RuleResponse,
  IssueSnippetResponse,
} from './types';
import {
  HotspotListFilters,
  HotspotListResponse,
  HotspotShowResponse,
  HotspotShowFilters,
} from './types/hotspot';
import {
  ProjectListFilters,
  ProjectSearchResponse,
  ProjectCreateFilters,
  ProjectCreateResponse,
} from './types/project';

// Issue API calls
export async function searchIssues(
  filters: IssueListFilters
): Promise<IssueListResponse> {
  const response = await client.get<IssueListResponse>('/api/issues/search', {
    params: {
      componentKeys: filters.project,
      assignees: filters.assignee?.join(','),
      organization: filters.organization,
      impactSeverities: filters.severity?.join(','),
      issueStatuses: filters.status?.map((s) => s.toUpperCase()).join(','),
      ps: filters.limit || 20,
    },
  });
  return response.data;
}

export async function getIssue(
  issueId: string,
  organization?: string
): Promise<IssueListResponse> {
  const response = await client.get<IssueListResponse>('/api/issues/search', {
    params: { issues: issueId, organization },
  });
  return response.data;
}

export async function getRule(
  ruleKey: string,
  organization?: string
): Promise<RuleResponse> {
  const response = await client.get<RuleResponse>('/api/rules/show', {
    params: { key: ruleKey, organization },
  });
  return response.data;
}

export async function getIssueSnippet(
  issueKey: string,
  organization?: string
): Promise<IssueSnippetResponse> {
  const response = await client.get<IssueSnippetResponse>(
    '/api/sources/issue_snippets',
    {
      params: { issueKey, organization },
    }
  );
  return response.data;
}

// Hotspot API calls
export async function searchHotspots(
  filters: HotspotListFilters
): Promise<HotspotListResponse> {
  const response = await client.get<HotspotListResponse>(
    '/api/hotspots/search',
    {
      params: {
        projectKey: filters.project,
        organization: filters.organization,
        status: filters.status?.map((s) => s.toUpperCase()).join(','),
        ps: filters.limit || 20,
      },
    }
  );
  return response.data;
}

export async function getHotspot(
  hotspotId: string,
  filters: HotspotShowFilters
): Promise<HotspotShowResponse> {
  const response = await client.get<HotspotShowResponse>('/api/hotspots/show', {
    params: { hotspot: hotspotId, ...filters },
  });
  return response.data;
}

// Project API calls
export async function searchProjects(
  filters: ProjectListFilters
): Promise<ProjectSearchResponse> {
  const response = await client.get<ProjectSearchResponse>(
    '/api/components/search_projects',
    {
      params: {
        organization: filters.organization,
        q: filters.q,
        p: filters.page,
        ps: filters.pageSize || 100,
        filter: filters.favorites ? 'isFavorite' : undefined,
      },
    }
  );
  return response.data;
}

export async function createProject(
  filters: ProjectCreateFilters
): Promise<ProjectCreateResponse> {
  const response = await client.post<ProjectCreateResponse>(
    '/api/projects/create',
    null,
    {
      params: {
        name: filters.name,
        project: filters.project,
        organization: filters.organization,
        visibility: filters.visibility,
        mainBranch: filters.mainBranch,
        newCodeDefinitionValue: filters.newCodeDefinitionValue,
        newCodeDefinitionType: filters.newCodeDefinitionType,
      },
    }
  );
  return response.data;
}
