import React from 'react';
import PropTypes from 'prop-types';

/* TODO: Handle link */
const Buttons = ({ renderedHtml }) => {
  // Transform WordPress HTML to frontend HTML
  const transformedHtml = renderedHtml?.replace(
    /class="wp-block-button__link"/g,
    'class="btn-normal btn btn-primary mr-20"'
  );

  return (
    <div className="content-container !my-20 md:!my-30">
      {/* eslint-disable-next-line react/no-danger */}
      <div dangerouslySetInnerHTML={{ __html: transformedHtml }} />
    </div>
  );
};

Buttons.propTypes = {
  renderedHtml: PropTypes.string,
};

Buttons.defaultProps = {
  renderedHtml: '',
};

export default Buttons;
