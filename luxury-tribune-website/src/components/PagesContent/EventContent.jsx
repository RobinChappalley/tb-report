/* eslint-disable react-hooks/rules-of-hooks */
import React, { useContext, useEffect } from 'react';
import { endOfDay, format } from 'date-fns';
import he from 'he';
import PropTypes from 'prop-types';
import { isNil, pipe } from 'ramda';

import Event from 'components/Event';
import JSONLD from 'components/JSONLD';
import Layout from 'components/Layout';
import SEO from 'components/SEO/SEO';
import SiteConfigContext from 'contexts/SiteConfigContext';
import useEvent from 'hooks/useEvent';
import { defaultLng } from 'locales/languages';
import extractFirstLead from 'utils/extractFirstLead';
import getDate from 'utils/getDate';

const EventContent = ({ events, lang }) => {
  const { setContentTranslations, seo } = useContext(SiteConfigContext);

  const { data } = useEvent({
    slug: events,
    lng: lang.toUpperCase(),
  });

  const getFullDate = getDate("yyyy-MM-dd'T'HH:mm:ss.SSSxxx");

  useEffect(() => {
    if (data) {
      setContentTranslations(
        data.translations,
        `${lang === defaultLng ? 'en/' : ''}events/[events]`
      );
    }
  }, [data]);

  return (
    <Layout>
      {data && (
        <>
          <SEO title={he.decode(data.title)} metas={data?.seo} />
          <Event
            content={pipe(extractFirstLead)(data)}
            host={typeof window !== 'undefined' ? window.location.host : ''}
          />
          <JSONLD
            data={{
              '@type': 'Event',
              name: data.title,
              eventStatus: 'EventScheduled',
              startDate: new Date(getFullDate(data?.eventMetadata?.startDate)),
              endDate: data?.eventMetadata?.endDate
                ? new Date(getFullDate(data.eventMetadata.endDate))
                : format(
                    endOfDay(new Date(data?.eventMetadata?.startDate)),
                    "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"
                  ),
              eventAttendanceMode: !isNil(data.eventMetadata?.buttonLink)
                ? 'OnlineEventAttendanceMode'
                : 'OfflineEventAttendanceMode',
              location: !isNil(data.eventMetadata?.buttonLink)
                ? {
                    '@type': 'VirtualLocation',
                    url: data.eventMetadata?.buttonLink,
                  }
                : {
                    '@type': 'Place',
                    name: data.eventMetadata?.location,
                    address: data.eventMetadata?.location,
                  },
              image: [data?.featuredImage?.node?.sourceUrl],
              // Excerpt stripped of the HTML tags
              description: data?.excerpt?.replace(/<\/?[^>]+(>|$)/g, ''),
              organizer: {
                '@type': 'Organization',
                '@id': 'https://www.luxurytribune.com/',
                name: 'Luxury Tribune',
                logo: seo?.schema?.companyLogo?.sourceUrl,
                url: 'https://www.luxurytribune.com/',
              },
            }}
          />
        </>
      )}
    </Layout>
  );
};

EventContent.propTypes = {
  events: PropTypes.string,
  lang: PropTypes.string,
};

export default EventContent;
