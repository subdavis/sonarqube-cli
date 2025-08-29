# SonarQube CLI

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=sonarqube-cli&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=sonarqube-cli) [![Bugs](https://sonarcloud.io/api/project_badges/measure?project=sonarqube-cli&metric=bugs)](https://sonarcloud.io/summary/new_code?id=sonarqube-cli) [![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=sonarqube-cli&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=sonarqube-cli) [![Duplicated Lines (%)](https://sonarcloud.io/api/project_badges/measure?project=sonarqube-cli&metric=duplicated_lines_density)](https://sonarcloud.io/summary/new_code?id=sonarqube-cli)

Command line interface for SonarQube Server API.

## Installation

- `npm install -g sonarqube-cli`
- The `snr` command should now be installed.

| List issues                                  | Show Issue Details                                  | Show hotspot details                                    |
| -------------------------------------------- | --------------------------------------------------- | ------------------------------------------------------- |
| ![list issues](./docs/images/issue_list.png) | ![show issue details](./docs/images/issue_show.png) | ![show hotspot details](./docs/images/hotspot_show.png) |

## Configuration and Usage

`snr` can be configured according to the table below.

| Env Variable     | `sonar-project.properties` | Command Line     | Required   |
| ---------------- | -------------------------- | ---------------- | ---------- |
| `SONAR_TOKEN`    | `sonar.token`              | none             | yes        |
| `SONAR_HOST_URL` | `sonar.host.url`           | `--base-url`     | yes        |
| n/a              | `sonar.projectKey`         | `--project`      | no         |
| n/a              | `sonar.organization`       | `--organization` | cloud only |

Precedence:

- command-line args are highest priority
- next, if there's a `sonar-project.properties` somewhere up your working directory tree, it will be used.
- env variables are checked last.

```
~$ snr help

CLI for SonarQube Server API

Options:
  -V, --version     output the version number
  --base-url <url>  SonarQube server base URL
  -h, --help        display help for command

Commands:
  info              Show CLI information
  issue             Manage issues
  hotspot           Manage security hotspots
  project           Manage SonarQube projects
  status            Check system status
  help [command]    display help for command
```

## Development

```bash
yarn install
yarn dev          # Run CLI in development
yarn build        # Build for production
yarn lint         # Lint code
yarn format       # Format code
yarn typecheck    # Type check
```

## Contributing

- This project uses TS and commander.js
- `docs/refresh-docs.ts` is used to refresh the API Specs.
