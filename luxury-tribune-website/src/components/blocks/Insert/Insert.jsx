import React from 'react';
import PropTypes from 'prop-types';
import { splitAt } from 'ramda';

const Insert = ({ innerBlocks, resolveBlocksComponents }) => {
  const [firstBlock, otherBlocks] = splitAt(1, innerBlocks);

  return (
    <div className="content-container bg-sand-300 my-30 md:my-60 p-30 pt-30">
      {resolveBlocksComponents(firstBlock).map(({ component, props }, i) =>
        React.createElement(component, { key: i, insert: true, ...props })
      )}
      {resolveBlocksComponents(otherBlocks).map(({ component, props }, i) =>
        React.createElement(component, { key: i, ...props })
      )}
    </div>
  );
};

Insert.propTypes = {
  innerBlocks: PropTypes.array,
  resolveBlocksComponents: PropTypes.func,
};

export default Insert;
