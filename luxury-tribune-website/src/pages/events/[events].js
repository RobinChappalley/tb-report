/* eslint-disable react-hooks/rules-of-hooks */
import React from 'react';
import PropTypes from 'prop-types';
import { isNil } from 'ramda';

import EventContent from 'components/PagesContent/EventContent';
import { getEventList, prefetchEvent } from 'hooks/useEvent';
import prefetch from 'utils/prefetch';

const currentLocale = 'fr';
const ContentEvent = ({ events }) => (
  <EventContent events={events} lang={currentLocale} />
);

export const getStaticProps = async ({ params }) => {
  const { events } = params;

  const dehydratedState = await prefetch([
    prefetchEvent({ slug: events, lng: currentLocale.toUpperCase() }),
  ]);
  return isNil(dehydratedState)
    ? { notFound: true, revalidate: 60 }
    : { props: { events, dehydratedState }, revalidate: 300 };
};

export const getStaticPaths = async () => {
  const pages = await getEventList(currentLocale.toUpperCase());

  return {
    paths: pages.map(page => ({ params: { events: page.slug } })),
    fallback: true,
  };
};

ContentEvent.propTypes = {
  events: PropTypes.string,
};

ContentEvent.defaultProps = {
  events: '',
};

export default ContentEvent;
