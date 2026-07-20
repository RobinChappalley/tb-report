import React from 'react';
import PropTypes from 'prop-types';

import FilterAuthorDesktop from 'components/FilterAuthor/FilterAuthorDesktop';
import FilterAuthorMobile from 'components/FilterAuthor/FilterAuthorMobile';

const FilterAuthor = ({ categories, onClick, currentCategory }) => (
  <>
    <FilterAuthorDesktop
      onClick={onClick}
      categories={categories}
      currentCategory={currentCategory}
    />
    <FilterAuthorMobile
      onClick={onClick}
      categories={categories}
      currentCategory={currentCategory}
    />
  </>
);

FilterAuthor.propTypes = {
  categories: PropTypes.array,
  onClick: PropTypes.func,
  currentCategory: PropTypes.string,
};

FilterAuthor.defaultProps = {
  categories: [],
};

export default FilterAuthor;
