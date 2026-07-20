import React from 'react';
// eslint-disable-next-line import/no-unresolved
import { Analytics } from '@vercel/analytics/next';
import PlausibleProvider from 'next-plausible';
import PropTypes from 'prop-types';

import Footer from 'components/Footer';
import Header from 'components/Header';
import Icons from 'components/Icon/Icons';

const Layout = ({ children }) => (
  <>
    <Analytics />
    <Icons />
    <link
      rel="stylesheet"
      href="//www.unpkg.com/@antistatique/leckerli@1.2/dist/assets/leckerli.min.css"
    />
    <PlausibleProvider domain="luxurytribune.com">
      <Header />
      <main>{children}</main>
      <Footer />
    </PlausibleProvider>
  </>
);

Layout.propTypes = {
  children: PropTypes.node,
};

export default Layout;
