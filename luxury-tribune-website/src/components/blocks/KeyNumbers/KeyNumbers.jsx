import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';

import Icon from 'components/Icon';

export const KeyNumber = ({ number }) => (
  <div className="w-full">
    <div className="border-b border-solid border-sand-500 flex items-end pb-10 mb-5">
      <Icon
        name={number.icon}
        className="!text-orange !text-19 md:!text-25 md:!self-start"
      />
      <p className="font-soehneKraftig text-19 md:text-25 ml-10">
        {number.value}
      </p>
    </div>
    <p className="font-soehneLeicht text-15 leading-22">{number.baseline}</p>
  </div>
);

KeyNumber.propTypes = {
  number: PropTypes.object,
};

KeyNumber.defaultProps = {
  number: {},
};

const KeyNumbers = ({ keyNumber, featured, attributes }) => {
  // Parse ACF data from attributes.data field
  let data = null;
  if (attributes?.data) {
    data =
      typeof attributes.data === 'string'
        ? JSON.parse(attributes.data)
        : attributes.data;
  }

  // Build array from ACF indexed fields (keyNumbers_0_, keyNumbers_1_, etc.)
  let keyNumbersData = [];

  if (data && data.keyNumbers) {
    const count = data.keyNumbers;
    keyNumbersData = [];

    for (let i = 0; i < count; i += 1) {
      const icon = data[`keyNumbers_${i}_icon`];
      const value = data[`keyNumbers_${i}_value`];
      const baseline = data[`keyNumbers_${i}_baseline`];

      if (icon || value || baseline) {
        keyNumbersData.push({
          icon: icon || 'money',
          value: value || '',
          baseline: baseline || '',
        });
      }
    }
  }

  // Fallback to original prop if ACF parsing failed
  if (keyNumbersData.length === 0) {
    keyNumbersData = keyNumber?.keyNumbers || [];
  }
  const featuredMode = data?.featured !== undefined ? data.featured : featured;

  // Safety check
  if (!Array.isArray(keyNumbersData)) {
    keyNumbersData = [];
  }

  return (
    <div className="content-container">
      <div
        className={clsx('key-numbers', featuredMode && 'key-numbers-featured')}
      >
        {keyNumbersData.map((number, index) => (
          <KeyNumber key={index} number={number} />
        ))}
      </div>
    </div>
  );
};

KeyNumbers.propTypes = {
  keyNumber: PropTypes.object,
  featured: PropTypes.bool,
  attributes: PropTypes.object,
};

KeyNumbers.defaultProps = {
  keyNumber: {
    keyNumbers: [
      {
        baseline: '',
        icon: 'money',
        value: '0',
      },
    ],
  },
};

export default KeyNumbers;
