import React from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import PropTypes from 'prop-types';

import Icon from 'components/Icon';

import './NewsletterType.styles.css';

const NEWSLETTER_TYPES = {
  news: {
    icon: 'newspaper',
    colorClass: 'newsletter-type--news',
  },
  genz: {
    icon: 'genz',
    colorClass: 'newsletter-type--genz',
  },
  analyses: {
    icon: 'chart',
    colorClass: 'newsletter-type--analyses',
  },
  trends: {
    icon: 'watch',
    colorClass: 'newsletter-type--trends',
  },
};

const NewsletterType = ({
  type,
  variant = 'outlined',
  showIcon = true,
  className,
}) => {
  const { t } = useTranslation();

  const typeConfig = NEWSLETTER_TYPES[type];

  if (!typeConfig) {
    return null;
  }

  return (
    <span
      className={clsx(
        'newsletter-type',
        typeConfig.colorClass,
        `newsletter-type--${variant}`,
        className
      )}
    >
      {showIcon && (
        <span className="newsletter-type__icon-wrapper">
          <Icon name={typeConfig.icon} className="smaller" />
        </span>
      )}
      <span className="newsletter-type__text">
        {t(`newsletter.types.${type}`)}
      </span>
    </span>
  );
};

NewsletterType.propTypes = {
  type: PropTypes.oneOf(['news', 'genz', 'analyses', 'trends']).isRequired,
  variant: PropTypes.oneOf(['outlined', 'filled']),
  showIcon: PropTypes.bool,
  className: PropTypes.string,
};

export default NewsletterType;
