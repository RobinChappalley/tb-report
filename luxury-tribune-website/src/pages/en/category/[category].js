/* eslint-disable react-hooks/rules-of-hooks */
import React from 'react';
import PropTypes from 'prop-types';
import { isNil } from 'ramda';

import CategoryListing from 'components/PagesContent/CategoryListing';
import { postsAmount } from 'config/config';
import { getCategoryList, prefetchCategory } from 'hooks/useCategory';
import { prefetchFeaturedPost } from 'hooks/useFeaturedPost';
import prefetch from 'utils/prefetch';

const currentLocale = 'en';
const Category = ({ category }) => (
  <CategoryListing lang={currentLocale} category={category} />
);

export const getStaticProps = async ({ params }) => {
  const { category } = params;

  const dehydratedState = await prefetch([
    prefetchFeaturedPost({ slug: category }),
    prefetchCategory({
      slug: category,
      amount: postsAmount.category,
      excluded: null,
    }),
  ]);
  return isNil(dehydratedState)
    ? { notFound: true, revalidate: 60 }
    : { props: { category, dehydratedState }, revalidate: 300 };
};

export const getStaticPaths = async () => {
  const pages = await getCategoryList(currentLocale.toUpperCase());

  return {
    paths: pages.map(page => ({ params: { category: page.slug } })),
    fallback: true,
  };
};

Category.propTypes = {
  category: PropTypes.string,
};

Category.defaultProps = {
  category: '',
};

export default Category;
