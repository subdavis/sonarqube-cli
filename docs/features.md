# Features

Read about how to use the API at https://docs.sonarsource.com/sonarqube-server/2025.1/extension-guide/web-api/
You may read any of the documents at https://docs.sonarsource.com if needed

## Authentication

- API token will come from the `SONARQUBE_TOKEN` env variable.
- It will need to be passed to all API queries using `Authorization: Bearer <token>` header auth.

## CLI commands general features

- The API Spec for SQ Server lives in @docs/api-spec.json
- Relevent response examples have been downloaded for you as `./response-example-{controller-name}-{action-name}.json`
  - For example, @docs/response-example-api-issues-search.json
- This API spec will have ALL the available endpoints.
- You should build **only** the features described below with **only** the filter options described below. This is important.
- Do _not_ make exhaustive type definitions for the full API spec.
  - Make only type defs for the optional and required facets, but not for the output.

## CLI Commands to build

### List Project Issues

- Base command: `issue list`
- Required filter facets: None
- Optional Filter facets: project key, assignee (multiple), organization, severity (multiple), status (multiple)

### Show Project Issue Details

- Base command: `issue show <id>`

## Context Awareness

If the working directory (or somewhere up the tree) has a `sonar-project.properties` file with a specified `sonar.projectKey`, that project key should be used for queries that accept a project key filter by default.

# Tech and code organization

- Use Axios for requests. Auth should happen using a custom axios instance with a token injection middleware.
- Individual commands should be able to just import and use the axios instance.
