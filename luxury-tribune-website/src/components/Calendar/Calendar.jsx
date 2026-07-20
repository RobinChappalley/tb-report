import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';

import getDate from 'utils/getDate';

import { theme } from '../../../tailwind.config';

const Calendar = ({ eventInfo, className }) => {
  if (!eventInfo) return null;
  const { startDate, endDate } = eventInfo;

  // Intermediate methods
  const getDay = getDate('d');
  const getMonth = getDate('MMM');

  // Get values
  const startDay = getDay(startDate);
  const endDay = getDay(endDate);
  const startMonth = getMonth(startDate);
  const endMonth = getMonth(endDate);
  const twoDaysOneMonth = startDay !== endDay && startMonth === endMonth;
  const twoDaysMultipleMonths = startMonth !== endMonth && endDate;
  const width = twoDaysOneMonth ? '89' : '62';

  return (
    <div className="flex items-center">
      {!twoDaysMultipleMonths && (
        <div className={clsx('calendar', className && className)}>
          <svg
            width={width}
            height="62"
            viewBox={`0 0 ${width} 62`}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="0.5"
              y="0.5"
              width={width - 1}
              height="61"
              fill={theme.colors.white}
              stroke={theme.colors.sand['300']}
            />
            <rect
              x="1"
              y="1"
              width={width - 2}
              height="17"
              fill={theme.colors.orange}
            />

            <text
              x="50%"
              y="11"
              className="uppercase text-10 font-soehneKraftig tracking-normal text-white"
              dominantBaseline="middle"
              textAnchor="middle"
              fill={theme.colors.white}
            >
              {startMonth}
            </text>
            {twoDaysOneMonth && (
              <text
                x="50%"
                y="45"
                dominantBaseline="middle"
                textAnchor="middle"
                className="uppercase text-30 font-soehneKraftig leading-40 tracking-tight text-brown-800 text-center"
                fill={theme.colors.brown['800']}
              >
                {`${startDay}-${endDay}`}
              </text>
            )}
            {!twoDaysOneMonth && (
              <text
                x="50%"
                y="45"
                dominantBaseline="middle"
                textAnchor="middle"
                className="uppercase text-30 font-soehneKraftig leading-40 tracking-tight text-brown-800 text-center"
                fill={theme.colors.brown['800']}
              >
                {startDay}
              </text>
            )}
          </svg>
        </div>
      )}
      {twoDaysMultipleMonths && (
        <div className={clsx('calendar-multiple', className && className)}>
          <div className="calendar">
            <svg
              width={width}
              height="62"
              viewBox={`0 0 ${width} 62`}
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="0.5"
                y="0.5"
                width={width - 1}
                height="61"
                fill={theme.colors.white}
                stroke={theme.colors.sand['300']}
              />
              <rect
                x="1"
                y="1"
                width={width - 2}
                height="17"
                fill={theme.colors.orange}
              />
              <text
                x="50%"
                y="11"
                className="uppercase text-10 font-soehneKraftig tracking-normal text-white"
                dominantBaseline="middle"
                textAnchor="middle"
                fill={theme.colors.white}
              >
                {startMonth}
              </text>
              <text
                x="50%"
                y="45"
                dominantBaseline="middle"
                textAnchor="middle"
                className="uppercase text-30 font-soehneKraftig leading-40 tracking-tight text-brown-800 text-center"
                fill={theme.colors.brown['800']}
              >
                {startDay}
              </text>
            </svg>
          </div>
          <span className="hyphen">-</span>
          <div className="calendar">
            <svg
              width={width}
              height="62"
              viewBox={`0 0 ${width} 62`}
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="0.5"
                y="0.5"
                width={width - 1}
                height="61"
                fill={theme.colors.white}
                stroke={theme.colors.sand['300']}
              />
              <rect
                x="1"
                y="1"
                width={width - 2}
                height="17"
                fill={theme.colors.orange}
              />
              <text
                x="50%"
                y="11"
                className="uppercase text-10 font-soehneKraftig tracking-normal text-white"
                dominantBaseline="middle"
                textAnchor="middle"
                fill={theme.colors.white}
              >
                {endMonth}
              </text>
              <text
                x="50%"
                y="45"
                dominantBaseline="middle"
                textAnchor="middle"
                className="uppercase text-30 font-soehneKraftig leading-40 tracking-tight text-brown-800 text-center"
                fill={theme.colors.brown['800']}
              >
                {endDay}
              </text>
            </svg>
          </div>
        </div>
      )}
    </div>
  );
};

Calendar.propTypes = {
  eventInfo: PropTypes.object,
  className: PropTypes.string,
};

Calendar.defaultProps = {
  className: null,
};

export default Calendar;
