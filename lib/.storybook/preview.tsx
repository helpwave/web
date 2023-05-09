import { Preview } from "@storybook/react";
import withNextApp from "../twind/next/app";
import config from "../twind/config";
import React from "react";
const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
  decorators: [
    (Story) => {
      const App = withNextApp(config, Story);
      return <App />;
    },
  ],
};

export default preview;
