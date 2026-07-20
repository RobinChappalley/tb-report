import React from 'react';
import { isNil } from 'ramda';

import AboutContent from 'components/PagesContent/AboutContent';
import { prefetchSpecificPage } from 'hooks/useSpecificPage';
import prefetch from 'utils/prefetch';

const currentLocale = 'en';
const About = () => <AboutContent lang={currentLocale} />;

export const getStaticProps = async () => {
  const dehydratedState = await prefetch([prefetchSpecificPage('en/about')]);
  return isNil(dehydratedState)
    ? { notFound: true, revalidate: 60 }
    : { props: { dehydratedState }, revalidate: 300 };
};

export default About;
