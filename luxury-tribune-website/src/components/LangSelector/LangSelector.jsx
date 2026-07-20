import React from 'react';
import { useTranslation } from 'react-i18next';
import Cookies from 'js-cookie';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { pathOr } from 'ramda';

import { defaultLng, lngs } from 'locales/languages';

const LangSelector = ({ translations, closeMenu }) => {
  const { i18n } = useTranslation();

  return (
    <ul className="flex list-none lang-selector">
      {lngs.map((lng, index) => {
        const path = pathOr(
          lng === defaultLng ? '' : lng,
          [lng, 'asPath'],
          translations
        );
        return (
          <li key={index}>
            {lng === i18n.language && (
              <span className="inline-flex items-center self-center justify-center tracking-wide uppercase border border-solid rounded-full font-soehneKraftig text-12 border-brown-800">
                <span className="tracking-wide uppercase font-soehneKraftig text-12">
                  {lng}
                </span>
              </span>
            )}
            {lng !== i18n.language && (
              <Link
                href={`${path[0] !== '/' ? '/' : ''}${path}`}
                onClick={() => {
                  if (typeof closeMenu !== 'undefined') {
                    closeMenu();
                  }

                  Cookies.set('LTLangDetected', lng, { expires: 7 });
                }}
                className="tracking-wide uppercase font-soehneKraftig text-12 hover:border-b hover:border-solid hover:border-brown-800"
              >
                {lng}
              </Link>
            )}
          </li>
        );
      })}
    </ul>
  );
};

LangSelector.propTypes = {
  translations: PropTypes.object,
  closeMenu: PropTypes.func,
};

LangSelector.defaultProps = {
  translations: {},
};

export default LangSelector;
