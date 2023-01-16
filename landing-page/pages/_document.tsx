import Document, { Html, Head, Main, NextScript } from 'next/document'
import withNextDocument from '../twind/next/document'
import { config } from '../twind.config'

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <title>helpwave</title>
          <link rel="icon" href="/favicon.ico" />
          <link rel="manifest" href="/manifest.json" />
          <link rel="canonical" href="https://helpwave.de/" />
          <meta name="theme-color" media="(prefers-color-scheme: dark)" content="black" />
          <meta name="description" content="Next generation healthcare software approach!" />
          <meta name="og:title" property="og:title" content="helpwave" />
          <meta property="og:description" content="Next generation healthcare software approach!" />
          <meta property="og:url" content="https://helpwave.de/" />
          <meta property="og:type" content="website" />
          <meta name="twitter:card" content="summary" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=1" />
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
