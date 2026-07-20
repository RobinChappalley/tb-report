import React from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import PropTypes from 'prop-types';

const FilterAuthorDesktop = ({ categories, onClick, currentCategory }) => {
  const { t } = useTranslation();

  return (
    <div className="hidden lg:flex flex-wrap mb-30 lg:mb-40 border-b border-sand-500">
      <button
        className={clsx(
          'mr-20 mt-15 pb-15 uppercase text-15 font-soehneKraftig tracking-wide leading-26',
          currentCategory === 'all'
            ? 'text-brown-800 relative'
            : 'text-brown-300'
        )}
        type="button"
        onClick={() => onClick('all')}
      >
        {t('sclr.filter.all')}
        {currentCategory === 'all' && (
          <div
            className="absolute w-full bg-brown-800"
            style={{ bottom: '-1px', height: '2px' }}
          />
        )}
      </button>
      {categories.map((category, index) => (
        <button
          className={clsx(
            'mr-20 mt-15 pb-15 uppercase text-15 font-soehneKraftig tracking-wide leading-26',
            currentCategory === category.name
              ? 'text-brown-800 relative'
              : 'text-brown-300'
          )}
          type="button"
          key={index}
          onClick={() => onClick(category.name)}
        >
          {category.name}
          {currentCategory === category.name && (
            <div
              className="absolute w-full bg-brown-800"
              style={{ bottom: '-1px', height: '2px' }}
            />
          )}
        </button>
      ))}
    </div>
  );
};

FilterAuthorDesktop.propTypes = {
  categories: PropTypes.array,
  onClick: PropTypes.func,
  currentCategory: PropTypes.string,
};

export default FilterAuthorDesktop;
