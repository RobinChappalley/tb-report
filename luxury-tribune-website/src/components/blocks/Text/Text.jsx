import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';

const Text = ({ attributes, insert, renderedHtml }) => {
  // Fallback: try attributes.content first, then renderedHtml
  const content = attributes?.content || renderedHtml || '';

  return (
    <div
      className={clsx(
        'rich-text',
        insert ? 'content-container' : 'content-container !mt-10 md:!mt-20'
      )}
    >
      {/* eslint-disable react/no-danger */}
      <div
        dangerouslySetInnerHTML={{ __html: content }}
        className={clsx(attributes?.dropCap && 'lettrine')}
      />
    </div>
  );
};

Text.propTypes = {
  attributes: PropTypes.object,
  insert: PropTypes.bool,
  renderedHtml: PropTypes.string,
};

Text.defaultProps = {
  attributes: {
    content: '',
    dropCap: false,
  },
  insert: false,
};

export default Text;
