/* eslint-disable react/no-danger */
import React from 'react';
import PropTypes from 'prop-types';
import { isNil } from 'ramda';

import WorldOfLuxuryContent from 'components/PagesContent/WorldOfLuxuryContent';
import { getWorldsOfLuxuryList, prefetchWorldsOfLuxury } from 'hooks/useStory';
import prefetch from 'utils/prefetch';

const currentLocale = 'en';
const WorldsOfLuxury = ({ slug }) => (
  <WorldOfLuxuryContent slug={slug} lang={currentLocale} />
);

WorldsOfLuxury.propTypes = {
  slug: PropTypes.string,
};

export const getStaticProps = async ({ params }) => {
  const { slug } = params;

  const dehydratedState = await prefetch([
    prefetchWorldsOfLuxury({ slug, lng: currentLocale.toUpperCase() }),
  ]);
  return isNil(dehydratedState)
    ? { notFound: true, revalidate: 60 }
    : { props: { slug, dehydratedState }, revalidate: 300 };
};

export const getStaticPaths = async () => {
  const pages = await getWorldsOfLuxuryList(currentLocale.toUpperCase());

  return {
    paths: pages.map(page => ({ params: page })),
    fallback: true,
  };
};

export default WorldsOfLuxury;
