import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <meta name="og:title" property="og:title" content="helpwave tasks" />
          <meta name="description" content="The first open-source team management platform for healthcare workers" />
          <meta property="og:description" content="The first open-source team management platform for healthcare workers" />
          <link rel="icon" href="/favicon.ico" />
          <link rel="apple-touch-icon" href="/touch-icon-128.png" />
          <link rel="apple-touch-icon" sizes="152x152" href="/touch-icon-152.png" />
          <link rel="apple-touch-icon" sizes="167x167" href="/touch-icon-167.png" />
          <link rel="apple-touch-icon" sizes="180x180" href="/touch-icon-180.png" />
          <link rel="manifest" href="/manifest.json" />
          <meta name="theme-color" media="(prefers-color-scheme: light)" content="white" />
          <meta property="og:site_name" content="helpwave" />
          <meta property="og:image" content="https://cdn.helpwave.de/thumbnail_tasks.png" />
          <meta property="og:image:url" content="https://cdn.helpwave.de/thumbnail_tasks.png" />
          <meta property="og:image:secure_url" content="https://cdn.helpwave.de/thumbnail_tasks.png" />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="627" />
          <meta property="og:image:alt" content="helpwave tasks: open-source team management platform for healthcare workers" />
          <meta property="og:type" content="website" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:site" content="@helpwave_org" />
          <meta name="twitter:creator" content="@helpwave_org" />
          <meta property="og:locale" content="en_US" />
          <meta property="og:locale:alternate" content="en_GB" />
          <meta property="og:locale:alternate" content="de_DE" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
