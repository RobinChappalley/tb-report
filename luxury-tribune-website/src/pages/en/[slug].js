/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable camelcase */
import React from 'react';
import PropTypes from 'prop-types';
import { isNil } from 'ramda';

import PostOrPageContent from 'components/PagesContent/PostOrPageContent';
import { getPageOrPostList, prefetchPageOrPost } from 'hooks/usePostOrPage';
import prefetch from 'utils/prefetch';

const currentLocale = 'en';
const Content = ({ slug }) => (
  <PostOrPageContent slug={slug} lang={currentLocale} />
);

Content.propTypes = {
  slug: PropTypes.string,
};

Content.defaultProps = {
  slug: '',
};

export const getStaticProps = async ({ params }) => {
  const { slug } = params;

  const dehydratedState = await prefetch([prefetchPageOrPost(slug)]);
  return isNil(dehydratedState)
    ? { notFound: true, revalidate: 60 }
    : { props: { slug, dehydratedState }, revalidate: 30 };
};

const excludedPageSlugs = [
  'about',
  'subscribe',
  'terms-conditions',
  'events',
  'the-sclr',
  'newsletter-subscription',
];

export const getStaticPaths = async () => {
  const pagesOrPosts = await getPageOrPostList('', currentLocale.toUpperCase());

  return {
    paths: pagesOrPosts
      .filter(pageOrPost => !excludedPageSlugs.includes(pageOrPost.slug))
      .map(pageOrPost => ({ params: pageOrPost })),
    fallback: true,
  };
};

export default Content;
