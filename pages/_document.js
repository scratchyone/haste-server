import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html>
      <Head>
        <meta name="robots" content="noindex,nofollow" />
        <title>hastebin</title>
        <noscript>
          <style>
            {`.hastebutton {
            background-color: var(--button-disabled-color) !important;
            cursor: default !important;
          }
          .logo:hover {
            background-color: var(--logo-color) !important;
            cursor: default !important;
          }`}
          </style>
        </noscript>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
