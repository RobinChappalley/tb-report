import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';

import HeaderDesktop from 'components/Header/HeaderDesktop';
import HeaderMobile from 'components/Header/HeaderMobile';
import SiteConfigContext from 'contexts/SiteConfigContext';
import formatMenu from 'utils/formatMenu';

const Header = () => {
  const { translations, options, ...menus } = useContext(SiteConfigContext);
  const { i18n } = useTranslation();
  const router = useRouter();

  const formatMenuWithContext = formatMenu(i18n.language, router.asPath);

  const mainMenu = formatMenuWithContext(
    menus[`${i18n.language}_headerMainMenu`]
  );

  const secondaryMenu = formatMenuWithContext(
    menus[`${i18n.language}_headerSecondaryMenu`]
  );

  return (
    <>
      <HeaderDesktop
        translations={translations}
        options={options}
        mainMenu={mainMenu}
        secondaryMenu={secondaryMenu}
      />
      <HeaderMobile
        translations={translations}
        options={options}
        mainMenu={mainMenu}
        secondaryMenu={secondaryMenu}
      />
    </>
  );
};

export default Header;
