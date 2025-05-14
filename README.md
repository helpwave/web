# helpwave web

The official helpwave web frontends.

[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/helpwave/web)

---

## [Projects](./documentation/structure.md) 
This repository is split up into multiple subprojects using [pnpm](https://pnpm.io) workspaces.
- helpwave tasks (see [tasks](/tasks))
- landing page of helpwave (see [landing-page](/landing-page))

## Getting Started

### Prerequisites
Before you can start you need to have these installed:
- [Node.js](https://nodejs.org/)
- [pnpm](https://pnpm.io/) (installation through npm `npm install -g pnpm`)

### Setup
```shell
pnpm install
```

### Usage
```shell
cd tasks # or any other page like e.g. landing-page
pnpm run dev
```

After that you should be able to open the project in the browser [`http://localhost:3000`](http://localhost:3000).

## Testing
This project is tested with [BrowserStack](https://www.browserstack.com).

## Linter
Our projects use linting with `eslint` to create a uniform code style. The linter can be used with:

```shell
pnpm run --filter "@helpwave/*" lint
```

## Scripts
The list of all our scripts can be found [here](documentation/scripts.md).

### Boilerplate generation

Execution with
- `node generate_boilerplate <relative filepath>`
- `pnpm run generate <relative filepath>` (within the projects)

All options can be seen with the `--help` flag

Example: `node scripts/generate_boilerplate tasks/components/test`


