import React from 'react';

import EventsListing from 'components/PagesContent/EventsListing';
import { prefetchEvents } from 'hooks/useEvents';
import { prefetchSpecificPage } from 'hooks/useSpecificPage';
import prefetch from 'utils/prefetch';

const currentLocale = 'en';
const Events = () => <EventsListing lang={currentLocale} />;

export const getStaticProps = async () => {
  const dehydratedState = await prefetch([
    prefetchEvents({ lng: currentLocale.toUpperCase(), amount: 5 }),
    prefetchSpecificPage('en/events'),
  ]);
  return {
    props: { dehydratedState },
    revalidate: 10,
  };
};

export default Events;
