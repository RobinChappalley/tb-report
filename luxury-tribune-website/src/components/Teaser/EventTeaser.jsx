import React from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import PropTypes from 'prop-types';

import Calendar from 'components/Calendar';
import FadeInImage from 'components/FadeInImage';
import getDate from 'utils/getDate';
import getEventUrl from 'utils/getEventUrl';

const EventTeaser = ({ event }) => {
  const { i18n } = useTranslation();

  const getHours = getDate('HH');
  const getMinutes = getDate('mm');
  const startHours = event.eventMetadata?.startDate
    ? getHours(event.eventMetadata.startDate)
    : '';
  const startMinutes = event.eventMetadata?.startDate
    ? getMinutes(event.eventMetadata.startDate)
    : '';

  return (
    <div className="md:flex py-30 border-b border-solid border-sand-700">
      <div className="w-full md:w-1/2 relative mr-0 md:mr-30 md:mb-0 mb-20">
        <Link href={getEventUrl(i18n.language, event.slug)}>
          <div className="flex-initial">
            <FadeInImage
              src={event?.featuredImage?.sourceUrl}
              alt={event.title}
              width={3}
              height={2}
            />
          </div>
        </Link>
        {event.eventMetadata && (
          <Calendar
            eventInfo={event.eventMetadata}
            className="absolute md:top-0 md:right-0 md:bottom-auto bottom-0 md:left-auto left-0 md:mt-15 md:mr-15 md:mb-0 mb-15 md:ml-0 ml-15"
          />
        )}
      </div>
      <div className="w-full md:w-1/2">
        <div className="inline-flex">
          <span className="text-orange uppercase text-13 font-soehneKraftig tracking-wider leading-17">
            {event.eventMetadata?.location || ''}
          </span>
          {startHours && startMinutes && (
            <span className="uppercase text-13 font-soehneKraftig tracking-wider leading-17 border-l border-solid border-sand-700 pl-5 ml-5">
              {`${startHours}:${startMinutes}`}
            </span>
          )}
          {event.eventsCategories.nodes.length > 0 && (
            <span className="uppercase text-13 font-soehneKraftig tracking-wider leading-17 border-l border-solid border-sand-700 pl-5 ml-5">
              {event.eventsCategories.nodes[0].name}
            </span>
          )}
        </div>
        <h3 className="text-46 leading-56 font-cambon tracking-tightest">
          <Link
            href={getEventUrl(i18n.language, event.slug)}
            className="hover:border-b border-solid border-brown-800"
          >
            {event.title}
          </Link>
        </h3>
        <div
          className="lead mt-25 md:mt-30"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: event.excerpt }}
        />
      </div>
    </div>
  );
};

EventTeaser.propTypes = {
  event: PropTypes.object,
};

export default EventTeaser;
