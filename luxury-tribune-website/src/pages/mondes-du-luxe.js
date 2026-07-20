import React from 'react';

import WorldOfLuxurylisting from 'components/PagesContent/WorldOfLuxuryListing';
import { prefetchWorldsOfLuxuries } from 'hooks/useStories';
import prefetch from 'utils/prefetch';

const currentLocale = 'fr';
const MondeDuLuxe = () => <WorldOfLuxurylisting lang={currentLocale} />;

export const getStaticProps = async () => {
  const dehydratedState = await prefetch([
    prefetchWorldsOfLuxuries({ length: 15, lng: currentLocale.toUpperCase() }),
  ]);
  return {
    props: { dehydratedState },
    revalidate: 10,
  };
};

export default MondeDuLuxe;
