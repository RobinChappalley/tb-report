import React, { useContext, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { isEmpty, isNil } from 'ramda';

import SiteConfigContext from 'contexts/SiteConfigContext';
import { lngs } from 'locales/languages';
import gtm from 'services/google-tag-manager';

const SEO = ({ title, children, noPageViewEvent, metas, image }) => {
  const router = useRouter();
  const siteConfig = useContext(SiteConfigContext);
  const currrentPath = `https://www.luxurytribune.com${router.asPath}`;

  useEffect(() => {
    gtm.reset();
    gtm.init();

    if (!noPageViewEvent) {
      gtm.event('PageView', {
        page_path: router.asPath,
        page_title: metas?.title || title,
      });
    }
  }, [router.asPath]);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{metas?.title || title}</title>

        {!isNil(metas?.metaDesc) && (
          <meta name="description" content={metas.metaDesc} />
        )}

        {!isNil(metas?.metaRobotsNoindex) && (
          <meta name="robots" content={metas.metaRobotsNoindex} />
        )}

        {!isNil(metas?.focuskw) && (
          <meta name="keywords" content={metas.focuskw} />
        )}

        {!isNil(metas?.opengraphAuthor) && !isEmpty(metas?.opengraphAuthor) && (
          <meta property="og:author" content={metas.opengraphAuthor} />
        )}

        {!isNil(metas?.opengraphDescription) && (
          <meta
            property="og:description"
            content={metas.opengraphDescription}
          />
        )}

        {isNil(metas?.opengraphDescription) && !isNil(metas?.metaDesc) && (
          <meta property="og:description" content={metas.metaDesc} />
        )}

        {!isNil(metas?.opengraphModifiedTime) && (
          <meta
            property="article:modified_time"
            content={metas.opengraphModifiedTime}
          />
        )}

        {!isNil(metas?.opengraphPublishedTime) && (
          <meta
            property="article:published_time"
            content={metas.opengraphPublishedTime}
          />
        )}

        {!isNil(metas?.opengraphSiteName) && (
          <meta property="og:site_name" content={metas.opengraphSiteName} />
        )}

        {!isNil(metas?.opengraphTitle) && (
          <meta property="og:title" content={metas.opengraphTitle} />
        )}

        {isNil(metas?.opengraphTitle) && (
          <meta property="og:title" content={metas?.title || title} />
        )}

        <meta property="og:type" content={metas?.opengraphType || 'website'} />
        <meta property="og:url" content={metas?.opengraphUrl || currrentPath} />

        {!isNil(metas?.opengraphImage?.sourceUrl) && (
          <meta property="og:image" content={metas.opengraphImage.sourceUrl} />
        )}

        {isNil(metas?.opengraphImage?.sourceUrl) && !isNil(image) && (
          <meta property="og:image" content={image} />
        )}

        {isNil(metas?.opengraphImage?.sourceUrl) && isNil(image) && (
          <meta
            property="og:image"
            content="https://www.luxurytribune.com/og-image.jpg"
          />
        )}

        <link rel="canonical" href={currrentPath} />
        {lngs.map(
          lang =>
            !isNil(siteConfig?.translations?.[lang]) && (
              <link
                key={`canonical-${lang}`}
                rel="alternate"
                href={siteConfig.translations[lang].asPath}
                hrefLang={lang}
              />
            )
        )}

        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link
          rel="manifest"
          href="/site.webmanifest"
          crossOrigin="use-credentials"
        />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#f24237" />
        <meta name="msapplication-TileColor" content="#f24237" />
        <meta name="theme-color" content="#ffffff" />

        <link type="text/plain" rel="author" href="/humans.txt" />
        <script
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: `
              console.log('%cMade by', 'color: #e30074; font-family: sans-serif; font-size: 16px;');
              console.log('%cAntistatique', 'color: #e30074; font-weight: bold; font-family: sans-serif; font-size: 42px;');
              console.log('%chttps://www.luxurytribune.com/humans.txt', 'color: #e30074; font-family: sans-serif; font-size: 16px;');
              console.log('%chttps://antistatique.net', 'color: #e30074; font-family: sans-serif; font-size: 16px;');
            `,
          }}
        />

        {children}
      </Head>
    </>
  );
};

SEO.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node,
  noPageViewEvent: PropTypes.bool,
  metas: PropTypes.object,
  image: PropTypes.string,
};

SEO.defaultProps = {
  noPageViewEvent: false,
};

export default SEO;
