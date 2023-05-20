import { Preview } from "@storybook/react"
import withNextApp from "../twind/next/app"
import config from "../twind/config"
import { Inter, Space_Grotesk } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter'
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk'
})

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
      return (
        <main>
          <style>{`
        :root {
          --font-inter: ${inter.style.fontFamily};
          --font-space: ${spaceGrotesk.style.fontFamily};
        }
      `}</style>
          <App/>
        </main>
      );
    },
  ],
};

export default preview;
