/* eslint-disable react-hooks/rules-of-hooks */
import React from 'react';
import PropTypes from 'prop-types';
import { isNil } from 'ramda';

import TypeListing from 'components/PagesContent/TypeListing';
import { postsAmount } from 'config/config';
import { getTypeList, prefetchType } from 'hooks/useType';
import prefetch from 'utils/prefetch';

const currentLocale = 'en';
const Type = ({ type }) => <TypeListing type={type} lang={currentLocale} />;

export const getStaticProps = async ({ params }) => {
  const { type } = params;

  const dehydratedState = await prefetch([
    prefetchType({
      slug: type,
      amount: postsAmount.type,
      lng: currentLocale.toUpperCase(),
    }),
  ]);
  return isNil(dehydratedState)
    ? { notFound: true, revalidate: 60 }
    : { props: { type, dehydratedState }, revalidate: 300 };
};

export const getStaticPaths = async () => {
  const pages = await getTypeList(currentLocale.toUpperCase());

  return {
    paths: pages.map(page => ({ params: { type: page.slug } })),
    fallback: true,
  };
};

Type.propTypes = {
  type: PropTypes.string,
};

Type.defaultProps = {
  type: '',
};

export default Type;
