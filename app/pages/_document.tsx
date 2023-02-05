import Document, { Html, Head, Main, NextScript } from 'next/document'
import withNextDocument from '../twind/next/document'
import { config } from '@helpwave/common/twind/config'

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link rel="icon" href="/favicon.ico" />
          <meta name="description" content="Next generation healthcare software approach!" />
          <meta name="og:title" property="og:title" content="helpwave" />
          <meta property="og:description" content="Next generation healthcare software approach!" />
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
