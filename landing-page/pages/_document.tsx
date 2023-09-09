import { config } from '@helpwave/common/twind/config'
import withNextDocument from '@helpwave/common/twind/next/document'
import Document, { Head, Html, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="icon" href="/favicon.svg" />
          <link rel="manifest" href="/manifest.json" />
          <link rel="canonical" href="https://helpwave.de/" />
          <meta name="theme-color" media="(prefers-color-scheme: dark)" content="black" />
          <meta name="description" content="Next generation healthcare software approach!" />
          <meta name="og:title" property="og:title" content="helpwave" />
          <meta property="og:description" content="Next generation healthcare software approach!" />
          <meta property="og:url" content="https://helpwave.de/" />
          <meta property="og:type" content="website" />
          <meta name="twitter:card" content="summary" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default withNextDocument(config, MyDocument)
