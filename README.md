# helpwave web

The official helpwave web frontends.

[![OpenSSF Scorecard](https://api.securityscorecards.dev/projects/github.com/helpwave/web/badge)](https://securityscorecards.dev/viewer/?uri=github.com/helpwave/web)

---

## [Projects](./documentation/structure.md) 
This repository is split up into multiple subprojects using [pnpm](https://pnpm.io) workspaces.
- helpwave tasks (see [tasks](/tasks))
- landing page of helpwave (see [landing-page](/landing-page))
- library of helpwave (see [lib](/lib))

## Getting Started
To get started you will have to in install [pnpm](https://pnpm.io). After that you
can use the following commands to start one of our projects.
```shell
pnpm install
cd <project> # e.g. tasks, landing-page
pnpm run dev
```

After that you should be able to open the project in the browser [`http://localhost:3000`](http://localhost:3000).

## Storybook

The components of our [library](lib) can be looked at in the storybook, where the different
parameters of the component can be set individually.

This allows you to see which components already exist and how to use them.
The current version can be seen here https://storybook-lib.helpwave.de.

```shell
cd lib
pnpm run storybook
```

## Testing
This project is tested with [BrowserStack](https://www.browserstack.com).

## Linter
Our projects use linting with `eslint` to create a uniform code style. The linter can used with:

```shell
pnpm run --filter "@helpwave/*" lint
```

```shell
pnpm run --filter "@helpwave/*" lint --fix
```

## [Scripts](documentation/scripts.md)
The list of all our scripts can be found [here](documentation/scripts.md).
