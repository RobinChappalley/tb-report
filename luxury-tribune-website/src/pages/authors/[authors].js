/* eslint-disable react-hooks/rules-of-hooks */
import React from 'react';
import PropTypes from 'prop-types';
import { isNil } from 'ramda';

import AuthorContent from 'components/PagesContent/AuthorContent';
import { postsAmount } from 'config/config';
import { getAuthorList, prefetchAuthor } from 'hooks/useAuthor';
import prefetch from 'utils/prefetch';

const currentLocale = 'fr';
const ContentAuthor = ({ authors }) => (
  <AuthorContent authors={authors} lang={currentLocale} />
);

export const getStaticProps = async ({ params }) => {
  const { authors } = params;

  const dehydratedState = await prefetch([
    prefetchAuthor({
      slug: authors,
      amount: postsAmount.category,
      lng: currentLocale.toUpperCase(),
    }),
  ]);
  return isNil(dehydratedState)
    ? { notFound: true, revalidate: 60 }
    : { props: { authors, dehydratedState }, revalidate: 300 };
};

export const getStaticPaths = async () => {
  const pages = await getAuthorList(currentLocale.toUpperCase());

  return {
    paths: pages.map(page => ({ params: { authors: page.slug } })),
    fallback: true,
  };
};

ContentAuthor.propTypes = {
  authors: PropTypes.string,
};

ContentAuthor.defaultProps = {
  authors: '',
};

export default ContentAuthor;
