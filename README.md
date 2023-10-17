# helpwave web

The official helpwave web frontends.

[![OpenSSF Scorecard](https://api.securityscorecards.dev/projects/github.com/helpwave/web/badge)](https://securityscorecards.dev/viewer/?uri=github.com/helpwave/web)

---

## Projects 
This repository is split up into multiple subprojects using [pnpm](https://pnpm.io) workspaces.
- helpwave tasks (see [tasks](/tasks))
- Landing Page of helpwave (see [landing-page](/landing-page))

## Getting Started
1. `pnpm install`
2. `cd <project>`
3. `pnpm run dev`
4. open [`http://localhost:3000`](http://localhost:3000)

## Storybook
`pnpm run storybook` in the lib folder

We are about to adopting Storybook to develop, preview, testing and showcasing our components. Below you will find a listing of our deployed Storybook. You can also run these locally to develop new stories via the above command (open the displayed port in your browser of choice) in the supported projects.

- [`lib` https://storybook-lib.helpwave.de](https://storybook-lib.helpwave.de)

## Testing
This project is tested with [BrowserStack](https://www.browserstack.com).

## Linter
1. `cd <project>`
2. `pnpm run lint` or `pnpm run lint --fix`

## Boilerplate generation
The script lies in [scripts](/scripts)

Execution with 
- `node generate_boilerplate <relative filepath>`
- `pnpm run generate <relative filepath>` (within the projects)

All options can be seen with the `--help` flag
