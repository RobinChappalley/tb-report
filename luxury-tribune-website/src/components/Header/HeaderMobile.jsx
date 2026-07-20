import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';

import Logo from 'assets/logo-without-tm.svg';
import AuthButton from 'components/AuthButton';
import Icon from 'components/Icon';
import LangSelector from 'components/LangSelector';
import SocialNetworks from 'components/SocialNetworks';
import { defaultLng } from 'locales/languages';

const HeaderMobile = ({ translations, options, mainMenu, secondaryMenu }) => {
  const { i18n, t } = useTranslation();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);

  const header = useRef(null);

  const toggleMenu = () => {
    setOpen(!open);
    setOpenSearch(false);
    document.body.style.overflow = !open ? 'hidden' : 'visible';
  };

  const closeMenu = () => {
    setOpen(false);
    document.body.style.overflow = 'visible';
  };

  const toggleSearch = () => {
    setOpenSearch(!openSearch);
    setOpen(false);
    document.body.style.overflow = !openSearch ? 'hidden' : 'visible';
  };

  const handleSubmit = e => {
    e.preventDefault();

    // Read the form data
    const form = e.target;
    const formData = new FormData(form);

    router.push({
      pathname: i18n.language === defaultLng ? '/recherche' : '/en/search',
      query: Object.fromEntries(formData.entries()),
    });

    toggleSearch();
  };

  return (
    <>
      {open && (
        <div className="absolute top-0 bottom-0 left-0 right-0 z-40 h-full opacity-50 bg-brown-800" />
      )}
      <div
        className="relative z-50 md:hidden px-15 pt-15 bg-sand-100"
        ref={header}
      >
        <div className="border-b border-solid border-sand-500 pb-15">
          <div className="flex justify-center">
            <Link
              href={`/${i18n.language === defaultLng ? '' : i18n.language}`}
              className="inline-block w-full cursor-pointer"
              style={{ maxWidth: '51rem' }}
            >
              <Logo className="w-full" style={{ maxWidth: '51rem' }} />
            </Link>
          </div>
          <div className="flex items-center justify-between mt-15">
            <div>
              <span className="mr-10">
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
            <div className="flex items-center">
              <button
                type="button"
                aria-expanded={openSearch}
                aria-label={t('header.searchForm.mobile.btnLabel')}
                aria-controls="mobileSearch"
                className="mr-5 toggle-btn"
                onClick={toggleSearch}
              >
                <Icon name={openSearch ? 'close-search' : 'search'} />
              </button>
              <button
                type="button"
                aria-expanded={open}
                aria-controls="mobileMenu"
                aria-label={t('header.mobile.btnLabel')}
                className="mr-5 toggle-btn"
                onClick={toggleMenu}
              >
                <Icon name={open ? 'close-search' : 'burger'} />
              </button>
            </div>
          </div>
        </div>
        <div
          className="absolute left-0 z-50 w-full min-h-screen overflow-scroll bg-sand-100 px-15 header-mobile-search"
          id="mobileSearch"
          style={{
            top: '100%',
            visibility: openSearch ? 'visible' : 'hidden',
            maxHeight: `calc(100vh - ${
              header.current ? header.current.clientHeight : 0
            }px)`,
          }}
        >
          <form className="relative mx-10 mt-25" onSubmit={handleSubmit}>
            <input
              className="w-full input-text input-search"
              name="q"
              type="text"
              placeholder={t('header.searchForm.placeholder')}
              aria-label={t('header.searchForm.label')}
            />
            <button
              type="submit"
              aria-label={t('header.searchForm.submit')}
              className="absolute inset-y-0 right-0 flex items-start justify-center h-full pl-10 pr-20"
            >
              <Icon name="search" />
            </button>
          </form>
        </div>
        <div
          className="absolute left-0 z-50 w-full overflow-scroll bg-sand-100 px-15"
          id="mobileMenu"
          style={{
            top: '100%',
            visibility: open ? 'visible' : 'hidden',
            maxHeight: `calc(100vh - ${
              header.current ? header.current.clientHeight : 0
            }px)`,
          }}
        >
          {mainMenu && (
            <ul className="mx-10 list-none py-15">
              {mainMenu.map((menuItem, index) => (
                <li key={index}>
                  <Link
                    href={menuItem.as}
                    className="mobile-menu-link"
                    onClick={closeMenu}
                  >
                    {menuItem.label}
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
                  className="mobile-menu-link"
                >
                  {t('stories.title')}
                </Link>
              </li>
            </ul>
          )}
          {secondaryMenu && (
            <ul className="mx-10 list-none border-t border-solid py-15 border-sand-500">
              {secondaryMenu.map((menuItem, index) => (
                <li key={index}>
                  <Link
                    href={menuItem.as}
                    className="mobile-menu-link"
                    onClick={closeMenu}
                  >
                    {menuItem.label}
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <div className="flex items-center justify-between px-10 mt-10 pb-25">
            <SocialNetworks />

            <ul className="flex list-none">
              {options &&
                Object.entries(options.general).map(([key, link], index) => (
                  <li className="mr-20" key={index}>
                    <a href={link} target="_blank" rel="noopener noreferrer">
                      <Icon name={key} />
                    </a>
                  </li>
                ))}
            </ul>
            <LangSelector translations={translations} closeMenu={closeMenu} />
          </div>
        </div>
      </div>
    </>
  );
};

HeaderMobile.propTypes = {
  translations: PropTypes.object,
  options: PropTypes.object,
  mainMenu: PropTypes.array,
  secondaryMenu: PropTypes.array,
};

export default HeaderMobile;
