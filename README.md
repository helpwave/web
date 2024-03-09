# helpwave web

The official helpwave web frontends.

[![OpenSSF Scorecard](https://api.securityscorecards.dev/projects/github.com/helpwave/web/badge)](https://securityscorecards.dev/viewer/?uri=github.com/helpwave/web)

---

## [Projects](./documentation/structure.md) 
This repository is split up into multiple subprojects using [pnpm](https://pnpm.io) workspaces.
- helpwave tasks (see [tasks](/tasks))
- landing page of helpwave (see [landing-page](/landing-page))
- library of helpwave (see [lib](/lib))

## [Getting Started](documentation/gettingStarted.md)
The short version can be found below and a more detailed instruction [here](documentation/gettingStarted.md). 
```shell
pnpm install
cd <project> # e.g. tasks, landing-page
pnpm run dev
```

## [Storybook](documentation/storybook.md)

To preview our component library head to [https://storybook-lib.helpwave.de](https://storybook-lib.helpwave.de).

Or run in locally from the [lib folder](./lib)
```
pnpm run storybook
```

## Testing
This project is tested with [BrowserStack](https://www.browserstack.com).

## [Linter](./documentation/linter.md)
```shell
pnpm run --filter "@helpwave/*" lint
```

## [Scripts](documentation/scripts.md)
The list of all our scripts can be found [here](documentation/scripts.md).
