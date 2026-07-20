import React from 'react';
import PropTypes from 'prop-types';

const List = ({ attributes, innerBlocks, resolveBlocksComponents }) => {
  if (!innerBlocks?.length) return null;

  const listItems = resolveBlocksComponents(innerBlocks);
  const ListTag = attributes.ordered ? 'ol' : 'ul';

  return (
    <div className="list content-container !my-30">
      <ListTag className={attributes.className}>
        {listItems.map((item, index) =>
          React.createElement(item.component, {
            key: index,
            ...item.props,
          })
        )}
      </ListTag>
    </div>
  );
};

List.propTypes = {
  attributes: PropTypes.shape({
    ordered: PropTypes.bool,
    className: PropTypes.string,
  }).isRequired,
  innerBlocks: PropTypes.arrayOf(PropTypes.object),
  resolveBlocksComponents: PropTypes.func.isRequired,
};

List.defaultProps = {
  innerBlocks: [],
};

export default List;
