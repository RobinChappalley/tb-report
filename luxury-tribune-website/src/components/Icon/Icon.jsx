import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';

const Icon = ({ name, baseline, className, size = '' }) => (
  <span
    className={clsx(
      `icon icon-${name} ${size}`,
      className && className,
      baseline && 'top-0'
    )}
    aria-hidden="true"
  >
    <svg>
      <use xlinkHref={`#${name}`} />
    </svg>
  </span>
);

Icon.propTypes = {
  name: PropTypes.string,
  baseline: PropTypes.bool,
  className: PropTypes.string,
  size: PropTypes.string,
};

Icon.defaultProps = {
  name: 'house',
  baseline: false,
};

export default Icon;
