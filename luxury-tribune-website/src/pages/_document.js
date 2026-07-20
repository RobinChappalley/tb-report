import React from 'react';
import { Head, Html, Main, NextScript } from 'next/document';

import getLang from 'utils/getLang';

// eslint-disable-next-line react/prop-types
export default function Document({ dangerousAsPath }) {
  return (
    <Html lang={getLang(dangerousAsPath)}>
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
