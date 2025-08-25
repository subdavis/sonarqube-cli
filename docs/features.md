# Features

Reading the API specs in this directory is crucial for building a correct solution.
Other docs can be found at https://docs.sonarsource.com/sonarqube-server/2025.1/extension-guide/web-api/

## Authentication

- API token will come from the `SONAR_TOKEN` env variable.
- It will need to be passed to all API queries using `Authorization: Bearer <token>` header auth.

## CLI commands general features

- The API Spec for SQ Server lives in `./api-spec.json`
- Relevent response examples have been downloaded for you as `./response-example-{controller-name}-{action-name}.json`
  - For example, @docs/response-example-api-issues-search.json
- This API spec will have ALL the available endpoints.
- You should build **only** the features described below with **only** the filter options described below. This is important.
- Do _not_ make exhaustive type definitions for the full API spec.
  - Make only type defs for the optional and required facets.

## CLI Commands to build

- The API Spec for SQ Server lives in `./api-spec.json`

### List Project Issues

- Base command: `issue list`
- Required filter facets: None
- Optional Filter facets: project key, assignee (multiple), organization, severity (multiple), status (multiple), pr number, branch name

### Show Project Issue Details

Achieved by calling `issues/search` with param `issues=<id>`

- Base command: `issue show <id>`

Issue details should include:

- The issue description same as list
- The issue comment history
- The rule description:
  - This will come from the rules api `rule.descriptionSections` `root_cause` from the rules API.
  - Use example response from `docs/response-example-api-rules-show.json`
- The code snippet containing the rule violation:
  - This will come from `/api/sources/issue_snippets?issueKey=<id>`
  - Use example response from `docs/response-example-api-sources-issue_snippets.json`

### List Hotspots

Look at `docs/response-example-api-hotspots-search.json`

- Base command: `hotspot list`
- Required filter facets: None
- Optional Filter facets: project, organization, status, pr number, branch name

### Show Hotspot details

Achieved by calling `hotspots/show` with `hotspot=<id>`
Look at `docs/response-example-api-hotspots-show.json`

- Base command: `hotspot show <id>`

Hotspot details should include:

- Basic details about the hotspot.
- rule.riskDescription in a section if exists
- rule.vulnerabilityDescription in a section if exists
- rule.fixRecommendations in a section if exists

### List projects

Look at `docs/response-example-api-components-search_projects.json`

- Base command: `project list`
- Required filter facets: None
- Optional filter facets: organization, q (query search)

### Check system status

Look at `docs/response-example-api-system-status.json`

Call both system/status and system/web_health and show a simple output.

- Base command: `status`

## Context Awareness

If the working directory (or somewhere up the tree) has a `sonar-project.properties` file with a specified

- `sonar.projectKey`
- `sonar.organization`

Those values should be used. If a user runs a command that accepts either of thse and they weren't provided, please search for them.

## AI Remediation

If the param `--fix` is passed to issues or hotspots (list or show) the CLI should spawn a claude subprocess.

For the list version, the remediation should simply pass each issue/hotspot, fetch the additional details if necessary, and pass the same console output as a prompt with a basic instruction to "Fix the issue described below".

The point of doing things this way is to 1. Save tokens so that each task is a short lived agent session and 2. Handle the TODO list outside the AI session. With hundreds or even thousands of tasks, this is something better suited to manage with regular code.

# Tech and code organization

- Use Axios for requests. Auth should happen using a custom axios instance with a token injection middleware.
- Individual commands should be able to just import and use the axios instance.

## Changelog

This section describes what I've changed in the feature spec since the last time Claude was asked to implement that feature.

- Added section about AI remediation
- Added pr number and branch name to list filters
