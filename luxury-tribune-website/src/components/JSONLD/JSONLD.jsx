import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { mergeDeepRight } from 'ramda';

const JSONLD = ({ data }) => {
  const { asPath } = useRouter();

  // Set URl in 2 phases: ssr standard → client precise
  let url = `https://www.luxurytribune.com${asPath}`;
  if (typeof window !== 'undefined') url = window.location.href;

  const json = mergeDeepRight(
    {
      '@context': 'https://schema.org/',
      url,
    },
    data
  );

  return (
    <Head>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
      />
    </Head>
  );
};

JSONLD.propTypes = {
  data: PropTypes.object.isRequired,
};

JSONLD.defaultProps = {};

export default JSONLD;
