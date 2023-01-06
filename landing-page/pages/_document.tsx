import Document, { Html, Head, Main, NextScript } from 'next/document'
import withNextDocument from '../twind/next/document'
import { config } from '../twind.config'

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default withNextDocument(config, MyDocument)
