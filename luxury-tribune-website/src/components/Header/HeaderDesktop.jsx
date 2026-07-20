import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import he from 'he';
import Link from 'next/link';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { isEmpty } from 'ramda';

import Logo from 'assets/logo.svg';
import AuthButton from 'components/AuthButton';
import Icon from 'components/Icon';
import LangSelector from 'components/LangSelector';
import SocialNetworks from 'components/SocialNetworks';
import { defaultLng } from 'locales/languages';

const HeaderDesktop = ({ translations, options, mainMenu, secondaryMenu }) => {
  const { i18n, t } = useTranslation();
  const router = useRouter();
  const [showSearchForm, setShowSearchForm] = useState(false);
  const searchInputRef = useRef(null);
  const searchFormRef = useRef(null);
  const mainNavRef = useRef(null);

  const openSearchForm = () => {
    setShowSearchForm(true);

    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 100);
  };

  const closeSearchForm = () => {
    setShowSearchForm(false);
  };

  const handleClickOutside = event => {
    if (!searchFormRef.current?.contains(event.target)) {
      closeSearchForm();
    }
  };

  const handleKeyPress = event => {
    if (event.key === 'Escape') {
      closeSearchForm();
    }

    if (!searchFormRef.current?.contains(document.activeElement)) {
      closeSearchForm();
    }
  };

  useEffect(() => {
    if (showSearchForm) {
      openSearchForm();
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyPress);
    }

    return () => {
      closeSearchForm();
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [showSearchForm]);

  const handleSubmit = e => {
    e.preventDefault();

    // Read the form data
    const form = e.target;
    const formData = new FormData(form);

    router.push({
      pathname: i18n.language === defaultLng ? '/recherche' : '/en/search',
      query: Object.fromEntries(formData.entries()),
    });
  };

  return (
    <div className="hidden md:block">
      <div className="bg-sand-300 px-10 xl:px-0">
        <div className="container py-10 max-lg:gap-10 flex lg:flex-row flex-col items-center">
          <div className="flex-grow">
            {secondaryMenu && !isEmpty(secondaryMenu) && (
              <ul className="list-none flex">
                {secondaryMenu.map((menuItem, index) => (
                  <li key={index}>
                    <Link
                      href={menuItem.as}
                      className={clsx(
                        'secondary-menu-link',
                        menuItem.active && 'active'
                      )}
                    >
                      {he.decode(menuItem.label)}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <SocialNetworks />

          <div>
            <span className="ml-30 mr-10">
              <AuthButton />
            </span>
            <Link
              href={
                i18n.language === defaultLng
                  ? '/sabonner'
                  : `/${i18n.language}/subscribe`
              }
              className="btn btn-small btn-primary"
            >
              {t('header.subscribe')}
            </Link>
          </div>
        </div>
      </div>
      <div className="container px-10 xl:px-0">
        <div className="my-30 relative">
          <div className="absolute inset-y-0 flex items-center">
            <ul className="list-none flex">
              {options &&
                Object.entries(options.general).map(([key, link], index) => (
                  <li className="mr-10" key={index}>
                    <a href={link} target="_blank" rel="noopener noreferrer">
                      <Icon name={key} />
                    </a>
                  </li>
                ))}
            </ul>
          </div>
          <div className="flex justify-center">
            <Link
              href={`/${i18n.language === defaultLng ? '' : i18n.language}`}
              className="w-full cursor-pointer"
              style={{ maxWidth: '52.3rem' }}
            >
              <Logo className="w-full" style={{ maxWidth: '52.3rem' }} />
            </Link>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center">
            <LangSelector translations={translations} />
          </div>
        </div>
        <form
          className={clsx(
            'mb-60 flex header-search-form',
            !showSearchForm && 'hidden'
          )}
          style={{ height: mainNavRef.current?.clientHeight }}
          ref={searchFormRef}
          onSubmit={handleSubmit}
        >
          <input
            className="input-text w-full input-search"
            name="q"
            type="text"
            placeholder={t('header.searchForm.placeholder')}
            aria-label={t('header.searchForm.label')}
            ref={searchInputRef}
          />
          <button
            type="submit"
            className="btn btn-secondary btn-md header-search-submit-btn border-b border-r border-t border-solid border-sand-500"
          >
            <Icon name="search" />
            {t('header.searchForm.submit')}
          </button>
        </form>
        {mainMenu && !isEmpty(mainMenu) && (
          <div
            className={clsx(
              'border-b border-t border-solid border-sand-500 mb-60',
              showSearchForm && 'hidden'
            )}
            ref={mainNavRef}
          >
            <div className="flex items-center justify-center">
              <ul className="list-none flex items-center justify-center">
                {mainMenu.map((menuItem, index) => (
                  <li key={index}>
                    <Link
                      href={menuItem.as}
                      className={clsx(
                        'main-menu-link',
                        menuItem.active && 'active'
                      )}
                    >
                      {he.decode(menuItem.label)}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href={`/${
                      i18n.language === defaultLng
                        ? 'mondes-du-luxe'
                        : `${i18n.language}/worlds-of-luxury`
                    }`}
                    className={clsx(
                      'main-menu-link',
                      (router.pathname === '/mondes-du-luxe' ||
                        router.pathname ===
                          `/${i18n.language}/worlds-of-luxury`) &&
                        'active'
                    )}
                  >
                    {t('stories.title')}
                  </Link>
                </li>
              </ul>
              <button
                type="button"
                className="header-search p-10"
                aria-expanded={showSearchForm}
                onClick={() => setShowSearchForm(true)}
              >
                <Icon name="search" className="relative top-0" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

HeaderDesktop.propTypes = {
  translations: PropTypes.object,
  options: PropTypes.object,
  mainMenu: PropTypes.array,
  secondaryMenu: PropTypes.array,
};

export default HeaderDesktop;
