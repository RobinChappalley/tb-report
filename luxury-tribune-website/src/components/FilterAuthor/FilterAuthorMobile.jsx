import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import PropTypes from 'prop-types';

const FilterAuthorMobile = ({ categories, onClick, currentCategory }) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);

  const toggleMenu = () => {
    setOpen(!open);
  };

  const closeMenu = cat => {
    setOpen(false);
    onClick(cat);
  };

  const sentence =
    currentCategory === 'all' ? t('sclr.filter.mobile') : currentCategory;

  return (
    <div className="relative">
      <div
        className={clsx(
          'flex lg:hidden justify-between items-center mb-30 lg:mb-40 bg-sand-500 px-20',
          open && 'border-b border-brown-300'
        )}
      >
        <span className="text-brown-800 py-15 uppercase text-15 font-soehneKraftig tracking-wide leading-26">
          {sentence}
        </span>
        {/* eslint-disable-next-line */}
        <span
          className={clsx('burger-menu', open && 'open')}
          onClick={toggleMenu}
        />
      </div>
      <div
        className="absolute bg-sand-500 w-full overflow-scroll z-10"
        style={{
          top: '100%',
          visibility: open ? 'visible' : 'hidden',
          maxHeight: `calc(100vh - 104px)`,
        }}
      >
        {categories && (
          <ul className="list-none mx-20 py-15">
            <li>
              <button
                type="button"
                onClick={() => closeMenu('all')}
                className="text-brown-800 uppercase text-15 font-soehneKraftig tracking-wide leading-26 pb-10 w-full text-left"
              >
                {t('sclr.filter.all')}
              </button>
            </li>
            {categories.map((category, index) => (
              <li key={index}>
                <button
                  type="button"
                  className="text-brown-800 uppercase text-15 font-soehneKraftig tracking-wide leading-26 pb-10 w-full text-left"
                  onClick={() => closeMenu(category.name)}
                >
                  {category.name}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

FilterAuthorMobile.propTypes = {
  categories: PropTypes.array,
  onClick: PropTypes.func,
  currentCategory: PropTypes.string,
};

export default FilterAuthorMobile;
