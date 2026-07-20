import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import Calendar from 'components/Calendar';
import gtm from 'services/google-tag-manager';
import getDate from 'utils/getDate';

const CalendarCta = ({ eventInfo, title }) => {
  const { t } = useTranslation();

  const getHours = getDate('HH');
  const getMinutes = getDate('mm');
  const startHours = eventInfo?.startDate ? getHours(eventInfo.startDate) : '';
  const startMinutes = eventInfo?.startDate
    ? getMinutes(eventInfo.startDate)
    : '';

  const handleClick = () => {
    gtm.dl({
      title,
    });
    gtm.event('event_subscribe');
  };

  return (
    <div className="bg-sand-500 flex my-30">
      <div className="relative flex justify-between flex-col md:flex-row md:items-center flex-1 py-25 xl:px-30 px-15">
        <div className="flex items-center mb-20 md:mb-0">
          <Calendar eventInfo={eventInfo} className="mr-20 relative" />
          <div>
            <p className="uppercase text-12 font-soehneKraftig tracking-wider leading-16 text-brown-500">
              {t('event.homepage.hours')}
            </p>
            <p className="text-19 font-soehneKraftig tracking-normal leading-28 text-brown-800">
              {startHours && startMinutes
                ? `${startHours}:${startMinutes}`
                : ''}
            </p>
          </div>
          <div className="border-l border-solid border-sand-700 pl-25 py-10 ml-25">
            <p className="uppercase text-12 font-soehneKraftig tracking-wider leading-16 text-brown-500">
              {t('event.homepage.location')}
            </p>
            <p className="text-19 font-soehneKraftig tracking-normal leading-28 text-brown-800">
              {eventInfo?.location || ''}
            </p>
          </div>
        </div>
        {eventInfo?.buttonLink && eventInfo?.buttonText && (
          <div>
            <a
              href={eventInfo?.buttonLink}
              target="_blank"
              rel="noreferrer noopener"
              className="w-full md:w-auto cursor-pointer text-center btn btn-normal btn-primary"
              onClick={handleClick}
            >
              {eventInfo?.buttonText}
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

CalendarCta.propTypes = {
  eventInfo: PropTypes.object,
  title: PropTypes.string,
};

export default CalendarCta;
