import React from 'react';
import PropTypes from 'prop-types';

const ListItem = ({ attributes }) => (
  <li
    className="!mt-0"
    dangerouslySetInnerHTML={{ __html: attributes.content }}
  />
);

ListItem.propTypes = {
  attributes: PropTypes.object,
};

ListItem.defaultProps = {
  attributes: {
    className: '',
    content: '',
  },
};

export default ListItem;
