import React from 'react';
import { isNil } from 'ramda';

import SclrContent from 'components/PagesContent/SclrContent';
import { prefetchAuthors } from 'hooks/useAuthors';
import { prefetchSpecificPage } from 'hooks/useSpecificPage';
import prefetch from 'utils/prefetch';

const currentLocale = 'en';
const LeSclr = () => <SclrContent lang={currentLocale} />;

export const getStaticProps = async () => {
  const dehydratedState = await prefetch([
    prefetchAuthors({
      amount: 30,
      lng: currentLocale,
    }),
    prefetchSpecificPage('en/the-sclr'),
  ]);
  return isNil(dehydratedState)
    ? { notFound: true, revalidate: 60 }
    : { props: { dehydratedState }, revalidate: 300 };
};

export default LeSclr;
