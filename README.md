# helpwave web

The official helpwave web frontends.

## Projects 
This repository is split up into multiple subprojects using [pnpm](https://pnpm.io) workspaces.
- helpwave tasks (see [tasks](/tasks))
- Landing Page of helpwave (see [landing-page](/landing-page))

## Getting Started
1. `pnpm install`
1. `cd <project>`
1. `pnpm run dev`
1. open [`http://localhost:3000`](http://localhost:3000)

## Storybook

We are about to adopting Storybook to develop, preview, testing and showcasing our components. Below you will find a listing of our deployt Storybook. You can also run these locally to develop new stories via `pnpm run storybook` (open the displayed port in your browser of choice) in the supported projects.

- [`lib` https://storybook-lib.helpwave.de](https://storybook-lib.helpwave.de)

## Testing
This project is tested with [BrowserStack](https://www.browserstack.com).

## Linter
1. `cd <project>`
1. `pnpm run lint` or `pnpm run lint --fix`
