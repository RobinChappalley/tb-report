import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getrefreshedToken } from 'client/client';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { isNil } from 'ramda';

import { defaultLng } from 'locales/languages';

const AuthButton = () => {
  const [isAuth, setIsAuth] = useState(false);
  const { i18n, t } = useTranslation();
  const { asPath } = useRouter();

  let path =
    i18n.language === defaultLng ? '/connection' : `/${i18n.language}/login`;
  if (isAuth) path = `/${i18n.language === defaultLng ? '' : i18n.language}`;

  // Refresh authentication state
  const checkAuthentication = async (favorAuthentication = true) => {
    const currentToken = Cookies.get('refreshToken');

    if (!isNil(currentToken)) {
      // Use refreshJwtAuthToken to ensure current token validity
      const response = await getrefreshedToken(currentToken);

      if (!isNil(response?.refreshJwtAuthToken) && favorAuthentication) {
        setIsAuth(true);
      } else {
        setIsAuth(false);
        Cookies.remove('refreshToken');
      }
    }
  };

  // Test authentication status on each new page
  useEffect(() => {
    checkAuthentication();
  }, [asPath]);

  return (
    <Link
      href={path}
      className="btn btn-small btn-secondary"
      onClick={() => checkAuthentication(!isAuth)}
    >
      {isAuth ? t('header.logout') : t('header.login')}
    </Link>
  );
};

export default AuthButton;
