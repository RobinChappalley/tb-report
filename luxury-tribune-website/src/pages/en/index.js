import React from 'react';

import HomepageContent from 'components/PagesContent/HomepageContent';
import {
  featuredCategories,
  newsCategories,
  postsAmount,
  tribuneCategories,
} from 'config/config';
import { prefetchHomepage } from 'hooks/useHomepage';
import prefetch from 'utils/prefetch';

const currentLocale = 'en';
const HomePage = () => <HomepageContent lang={currentLocale} />;

export const getStaticProps = async () => {
  const dehydratedState = await prefetch([
    prefetchHomepage({
      lng: currentLocale,
      tribuneCategory: tribuneCategories[currentLocale],
      newsCategory: newsCategories[currentLocale],
      featuredCategories,
      amountStories: postsAmount.stories,
    }),
  ]);
  return { props: { dehydratedState }, revalidate: 10 };
};

export default HomePage;
