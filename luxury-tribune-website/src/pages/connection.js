import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { getLogin } from 'client/client';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { isNil } from 'ramda';

import Layout from 'components/Layout';
import SEO from 'components/SEO/SEO';
import SiteConfigContext from 'contexts/SiteConfigContext';
import { defaultLng } from 'locales/languages';

const LoginPage = () => {
  const { setContentTranslations } = useContext(SiteConfigContext);
  const [loginError, setLoginError] = useState(false);
  const { i18n, t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const router = useRouter();

  const onSubmit = async ({ email, password }) => {
    const access = await getLogin({
      user: email,
      password,
    });

    setLoginError(isNil(access?.login));
    if (!isNil(access?.login)) {
      // Cookie wil expire 90 days from now
      Cookies.set('refreshToken', access?.login?.refreshToken, { expires: 90 });
      router.push(`/${i18n.language === defaultLng ? '' : i18n.language}`);
    }
  };

  useEffect(() => {
    setContentTranslations(
      [
        {
          language: { slug: 'en' },
          uri: '/en/login',
        },
        {
          language: { slug: 'fr' },
          uri: '/connection',
        },
      ],
      i18n.language === defaultLng ? 'en/login' : 'connection'
    );
  }, []);

  return (
    <Layout>
      <SEO title={t('header.login')} metas={{ metaRobotsNoindex: 'noindex' }} />
      <div className="mx-15 md:mx-0">
        <div className="content-container md:w-1/2 lg:w-1/3 !mt-30 md:!mt-50 flow-root">
          <h1>{t('header.login')}</h1>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label
                className="block font-soehneKraftig text-13 uppercase text-brown-800 mt-30"
                htmlFor="email"
              >
                {t('sign.email')}
              </label>
              <input
                {...register('email', { required: true })}
                className="appearance-none border border-sand-300 w-full focus:outline-none focus:ring py-10 px-15 font-soehneLeicht text-19 mt-5"
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder={t('sign.email')}
              />
              {errors.email !== undefined && (
                <em className="block leading-17 text-15 mt-10 font-soehneLeicht text-red">
                  {t('sign.email_missing')}
                </em>
              )}
            </div>
            <div>
              <label
                className="block font-soehneKraftig text-13 uppercase text-brown-800 mt-10"
                htmlFor="password"
              >
                {t('sign.password')}
              </label>
              <input
                {...register('password', { required: true })}
                className="appearance-none border border-sand-300 w-full focus:outline-none focus:ring py-10 px-15 font-soehneLeicht text-19 mt-5"
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="***********"
              />
              {errors.password !== undefined && (
                <em className="block leading-17 text-15 mt-10 font-soehneLeicht text-red">
                  {t('sign.password_missing')}
                </em>
              )}
            </div>

            {loginError && (
              <div>
                <em className="block leading-17 text-15 mt-10 font-soehneLeicht text-red">
                  {t('sign.signin_error')}
                </em>
              </div>
            )}

            <div className="flex items-center justify-between mt-30">
              <button type="submit" className="btn btn-primary btn-normal">
                {t('sign.signin')}
              </button>
              <Link
                href={
                  i18n.language === defaultLng
                    ? '/reinitialiser-mot-de-passe'
                    : `/${i18n.language}/reset-password`
                }
                className="uppercase text-13 font-soehneKraftig leading-17 text-brown-800 mr-20"
              >
                {t('sign.forgot_password')}
              </Link>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default LoginPage;
