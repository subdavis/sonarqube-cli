# SonarQube CLI

Command line interface for SonarQube Server API.

## Setup

```bash
yarn install
```

## Development

```bash
yarn dev          # Run CLI in development
yarn build        # Build for production
yarn lint         # Lint code
yarn format       # Format code
yarn typecheck    # Type check
```

## Contributing

- This project uses TS and commander.js
- `scripts/refresh-docs.ts` is used to refresh the API Specs.

## Usage

```bash
# Development
yarn dev

# Production
yarn build
./dist/index.js
```
