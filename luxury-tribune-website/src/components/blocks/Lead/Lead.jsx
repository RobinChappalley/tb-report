import React from 'react';
import PropTypes from 'prop-types';

const Lead = ({ lead, attributes }) => {
  // Handle ACF data structure
  let leadText = '';

  if (attributes?.data) {
    const data =
      typeof attributes.data === 'string'
        ? JSON.parse(attributes.data)
        : attributes.data;
    leadText = data.lead || '';
  } else if (lead?.lead) {
    leadText = lead.lead;
  }

  return (
    <div className="content-container !mt-25 md:!mt-30">
      <h2 className="lead">{leadText}</h2>
    </div>
  );
};

Lead.propTypes = {
  lead: PropTypes.object,
  attributes: PropTypes.object,
};

Lead.defaultProps = {
  lead: {
    lead: '',
  },
};

export default Lead;
