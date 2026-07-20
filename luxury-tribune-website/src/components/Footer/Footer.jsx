import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import he from 'he';
import Link from 'next/link';
import { useRouter } from 'next/router';

import Icon from 'components/Icon';
import SocialNetworks from 'components/SocialNetworks';
import SiteConfigContext from 'contexts/SiteConfigContext';
import formatMenu from 'utils/formatMenu';

const Footer = () => {
  const { options, ...menus } = useContext(SiteConfigContext);
  const { i18n, t } = useTranslation();
  const router = useRouter();

  const formatMenuWithContext = formatMenu(i18n.language, router.asPath);

  const mainMenuName = `${i18n.language}_footerMainMenu`;
  const secondaryMenuName = `${i18n.language}_footerSecondaryMenu`;

  return (
    <div className="bg-sand-300 mt-60 md:mt-100 py-30 md:py-40 px-15 xl:px-0">
      <div className="container">
        <div className="md:flex flex-wrap md:items-start lg:items-center justify-between">
          <SocialNetworks />
          <ul className="list-none flex mb-20 md:mb-0 md:order-3 lg:order-none lg:mr-40">
            {options &&
              Object.entries(options.general).map(([key, link], index) => (
                <li className="mr-20 md:mr-10" key={index}>
                  <a href={link} target="_blank" rel="noopener noreferrer">
                    <Icon name={key} />
                  </a>
                </li>
              ))}
          </ul>
          <div className="md:w-1/2 lg:w-auto lg:flex-grow md:mb-30 lg:mb-0">
            {menus[mainMenuName] && (
              <ul className="list-none flex flex-col lg:flex-row">
                {formatMenuWithContext(menus[mainMenuName]).map(
                  (menuItem, index) => (
                    <li key={index}>
                      <Link
                        href={menuItem.as}
                        className="font-soehneKraftig uppercase tracking-wider leading-16 text-12 mr-15"
                      >
                        {he.decode(menuItem.label)}
                      </Link>
                    </li>
                  )
                )}
                <li>
                  <a
                    className="font-soehneLeicht text-brown-800 leading-16 text-15 lg:ml-15 hover:border-b hover:border-solid hover:border-sand-500"
                    href="mailto:contact@luxurytribune.com"
                  >
                    contact@luxurytribune.com
                  </a>
                </li>
              </ul>
            )}
          </div>
          <div>
            {menus[secondaryMenuName] && (
              <ul className="list-none my-20 md:my-0 md:flex">
                {formatMenuWithContext(menus[secondaryMenuName]).map(
                  (menuItem, index) => (
                    <li key={index}>
                      <Link
                        href={menuItem.as}
                        className="font-soehneLeicht text-brown-500 leading-16 text-15 md:ml-15 border-b border-solid border-sand-500"
                      >
                        {he.decode(menuItem.label)}
                      </Link>
                    </li>
                  )
                )}
              </ul>
            )}
          </div>
          <div className="md:ml-20 md:order-4 lg:order-none">
            <p className="font-soehneLeicht text-15 leading-22 text-brown-500">
              {t('footer.madeBy')}
              <a
                className="font-soehneKraftig border-b border-solid border-sand-500 hover:border-brown-500"
                target="_blank"
                rel="noreferrer noopener"
                href="https://antistatique.net"
              >
                Antistatique
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
