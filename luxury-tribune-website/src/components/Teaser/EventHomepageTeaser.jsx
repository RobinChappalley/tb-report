import React from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import PropTypes from 'prop-types';

import Calendar from 'components/Calendar';
import getDate from 'utils/getDate';
import getEventUrl from 'utils/getEventUrl';

import { theme } from '../../../tailwind.config';

const EventHomepageTeaser = ({ event }) => {
  const { t, i18n } = useTranslation();

  const getHours = getDate('HH');
  const getMinutes = getDate('mm');
  const getFullDate = getDate('MM-dd-yyyy HH:mm:ss');
  const getFullDateNoHours = getDate('MM-dd-yyyy');
  const startHours = getHours(event.event_metadata.startDate);
  const startMinutes = getMinutes(event.event_metadata.startDate);

  const now = new Date();
  const dateEventStart = new Date(getFullDate(event.event_metadata.startDate));
  const dateEventEnd = event.event_metadata.endDate
    ? new Date(getFullDate(event.event_metadata.endDate))
    : new Date(
        `${getFullDateNoHours(event.event_metadata.startDate)} 23:59:59`
      );

  const isLive = now > dateEventStart && now <= dateEventEnd;

  return (
    <div className="bg-sand-500 flex mb-30">
      <div className="relative flex flex-col md:flex-row md:items-center flex-1 py-25 xl:px-30 px-15">
        <div className="flex items-center sm:mr-40 mb-20 md:mb-0">
          <Calendar
            eventInfo={event.event_metadata}
            className="mr-20 relative"
          />
          <div>
            <p className="uppercase text-12 font-soehneKraftig tracking-wider leading-16 text-brown-500">
              {t('event.homepage.hours')}
            </p>
            <p className="text-19 font-soehneKraftig tracking-normal leading-28 text-brown-800">
              {`${startHours}:${startMinutes}`}
            </p>
          </div>
          <div className="border-l border-solid border-sand-700 pl-25 py-10 ml-25">
            <p className="uppercase text-12 font-soehneKraftig tracking-wider leading-16 text-brown-500">
              {t('event.homepage.location')}
            </p>
            <p className="text-19 font-soehneKraftig tracking-normal leading-28 text-brown-800">
              {event.event_metadata.location}
            </p>
          </div>
        </div>
        <div>
          <div className="inline-flex">
            <span className="text-orange uppercase text-13 font-soehneKraftig tracking-wider leading-17">
              {t('event.homepage.event')}
            </span>

            {event.eventsCategories.nodes.length > 0 && (
              <span className="uppercase text-13 font-soehneKraftig tracking-wider leading-17 border-l border-solid border-sand-700 pl-5 ml-5">
                {event.eventsCategories.nodes[0].name}
              </span>
            )}
          </div>
          <h3 className="mt-0">
            <Link
              href={getEventUrl(i18n.language, event.slug)}
              className="hover:border-b border-solid border-brown-800"
            >
              {event.title}
            </Link>
          </h3>
        </div>

        {isLive && (
          <div className="absolute top-0 right-0 md:mr-15 mr-0 md:mt-15 mt-0 live-btn">
            <span className="inline-flex items-center btn btn-small btn-primary">
              <svg
                width="9"
                height="9"
                viewBox="0 0 9 9"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ marginRight: '0.5rem' }}
              >
                <circle cx="4.5" cy="4.5" r="4.5" fill={theme.colors.white} />
              </svg>
              Live
            </span>
          </div>
        )}
      </div>
      <Link
        href={getEventUrl(i18n.language, event.slug)}
        className="hidden md:block flex-shrink-0 bg-no-repeat bg-center bg-cover text-transparent"
        style={{
          flexBasis: '20%',
          backgroundImage: `url(${event?.featuredImage?.sourceUrl})`,
        }}
      >
        {event.title}
      </Link>
    </div>
  );
};

EventHomepageTeaser.propTypes = {
  event: PropTypes.object,
};

export default EventHomepageTeaser;
