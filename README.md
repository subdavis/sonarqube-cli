# SonarQube CLI

Command line interface for SonarQube Server API.

## Installation

- `npm install -g sonarqube-cli`
- The `snr` command should now be installed.

## Configuration and Usage

`snr` can be configured according to the table below.

| Env Variable     | `sonar-project.properties` | Command Line     | Required | Default |
| ---------------- | -------------------------- | ---------------- | -------- | ------- |
| `SONAR_TOKEN`    | `sonar.token`              | none             | yes      | None    |
| `SONAR_HOST_URL` | `sonar.host.url`           | `--base-url`     | yes      | None    |
| n/a              | `sonar.projectKey`         | `--project`      | no       | None    |
| n/a              | `sonar.organization`       | `--organization` | \*       | None    |

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
