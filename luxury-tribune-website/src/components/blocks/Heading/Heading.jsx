import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';

const Heading = ({ attributes, insert }) => (
  <div
    className={clsx(
      insert
        ? 'content-container mb-10 md:mb-20 flow-root'
        : 'content-container !mt-30 md:!mt-50 mb-10 md:mb-20 flow-root'
    )}
  >
    {React.createElement(`h${attributes.level}`, {
      dangerouslySetInnerHTML: { __html: attributes.content },
    })}
  </div>
);

Heading.propTypes = {
  attributes: PropTypes.object,
  insert: PropTypes.bool,
};

Heading.defaultProps = {
  attributes: {
    content: '',
    level: 2,
  },
  insert: false,
};

export default Heading;
