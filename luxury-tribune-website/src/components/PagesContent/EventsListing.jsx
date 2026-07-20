import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import he from 'he';
import PropTypes from 'prop-types';
import { pipe, toUpper } from 'ramda';

import Layout from 'components/Layout';
import Page from 'components/Page';
import SEO from 'components/SEO/SEO';
import EventTeaser from 'components/Teaser/EventTeaser';
import SiteConfigContext from 'contexts/SiteConfigContext';
import useEvents, { getEvents } from 'hooks/useEvents';
import useSpecificPage from 'hooks/useSpecificPage';
import { defaultLng } from 'locales/languages';
import extractFirstLead from 'utils/extractFirstLead';
import handleFootnotesAnchors from 'utils/handleFootnotesAnchors';

const slugs = {
  fr: 'evenements',
  en: 'en/events',
};
const getSlug = (lng = defaultLng) => slugs[lng];

const EventsListing = ({ lang }) => {
  const { setContentTranslations } = useContext(SiteConfigContext);
  const { t } = useTranslation();

  const { data: eventsData } = useEvents({
    lng: lang.toUpperCase(),
    amount: 5,
  });

  const { data } = useSpecificPage(getSlug(lang));

  // Transform events to flatten image structure
  const transformEvents = events =>
    events.map(event => ({
      ...event,
      featuredImage: event.featuredImage?.node
        ? { sourceUrl: event.featuredImage.node.sourceUrl }
        : null,
    }));

  const [loadedPastEvents, setLoadedPastEvents] = useState(
    eventsData?.pastEvents?.nodes
  );
  const [pageInfo, setPageInfo] = useState(eventsData?.pastEvents?.pageInfo);

  const loadMorePastEvents = async () => {
    const newEvents = await getEvents({
      amount: 5,
      lng: toUpper(lang),
      cursor: pageInfo.endCursor,
    });

    const transformedNewEvents = transformEvents(newEvents.pastEvents.nodes);
    setLoadedPastEvents([...loadedPastEvents, ...transformedNewEvents]);
    setPageInfo(newEvents.pastEvents.pageInfo);
  };

  useEffect(() => {
    if (data) {
      setContentTranslations(data.translations, getSlug(lang));
    }

    if (eventsData?.pastEvents) {
      setLoadedPastEvents(transformEvents(eventsData?.pastEvents.nodes));
      setPageInfo(eventsData?.pastEvents.pageInfo);
    }
  }, [data, eventsData]);

  return (
    <Layout>
      {data && (
        <>
          <SEO title={he.decode(data.title)} />
          {eventsData?.futureEvents?.length === 0 &&
            eventsData?.pastEvents?.nodes.length === 0 && (
              <Page
                content={pipe(extractFirstLead, handleFootnotesAnchors)(data)}
              />
            )}
        </>
      )}

      <div className="container">
        {eventsData?.futureEvents && eventsData?.futureEvents.length > 0 && (
          <div className="xl:px-0 px-15">
            <div className="md:mb-60 mb-30">
              <h1>{t('events.title')}</h1>
              <h2 className="text-46 leading-56 font-cambon tracking-tightest text-red">
                {t('events.future.title')}
              </h2>
            </div>
            <div className="event-teasers">
              {eventsData?.futureEvents.map((event, index) => (
                <EventTeaser key={`future-event-${index}`} event={event} />
              ))}
            </div>
          </div>
        )}

        {eventsData?.pastEvents?.nodes.length > 0 && (
          <div className="xl:px-0 px-15">
            <div className="md:mb-60 mb-30 mt-100">
              <h2 className="text-46 leading-56 font-cambon tracking-tightest">
                {t('events.title')}
              </h2>
              <h2 className="text-46 leading-56 font-cambon tracking-tightest text-red">
                {t('events.past.title')}
              </h2>
            </div>
            <div className="event-teasers">
              {loadedPastEvents &&
                loadedPastEvents.map((event, index) => (
                  <EventTeaser key={`past-event-${index}`} event={event} />
                ))}
              {pageInfo?.hasNextPage && (
                <button
                  type="button"
                  className="block mx-auto mt-30 btn btn-secondary btn-normal"
                  onClick={loadMorePastEvents}
                >
                  {t('events.more_events')}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

EventsListing.propTypes = {
  lang: PropTypes.string,
};

export default EventsListing;
