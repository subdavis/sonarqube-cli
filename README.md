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

- command-line args are highest priority
- next, if there's a `sonar-project.properties` somewhere up your working directory tree, it will be used.
- env variables are checked last.

| Env Variable     | `sonar-project.properties` | Command Line     |
| ---------------- | -------------------------- | ---------------- |
| `SONAR_TOKEN`    | `sonar.token`              | none             |
| `SONAR_HOST_URL` | `sonar.host.url`           | `--base-url`     |
| n/a              | `sonar.projectKey`         | `--project`      |
| n/a              | `sonar.organization`       | `--organization` |

```
~$ snr help
Usage: snr [options] [command]

CLI for SonarQube Server & Cloud API

Options:
  -V, --version     output the version number
  --base-url <url>  SonarQube server base URL
  -h, --help        display help for command

Commands:
  issue             Search and review issues
  hotspot           Search and review security hotspots
  project           Show SonarQube projects
  status            Check system status
  help [command]    display help for command

Examples:
  snr issue list --project my-project --severity HIGH
  snr hotspot show AZjzzVD1Xsy7a47AllAl
  snr project list --favorites --json
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
