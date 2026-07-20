/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { getResetUserPassword } from 'client/client';
import { useRouter } from 'next/router';
import queryString from 'query-string';
import { isNil } from 'ramda';

import Layout from 'components/Layout';
import SEO from 'components/SEO/SEO';
import SiteConfigContext from 'contexts/SiteConfigContext';
import { defaultLng } from 'locales/languages';

const NewPasswordPage = () => {
  const { setContentTranslations } = useContext(SiteConfigContext);
  const [saveError, setSaveError] = useState(false);
  const [success, setSuccess] = useState(false);
  const { i18n, t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm();
  const { query } = useRouter();

  const onSubmit = async ({ password }) => {
    const { key, user } = query;
    const confirmation = await getResetUserPassword({
      user,
      password,
      key,
    });

    setSaveError(isNil(confirmation?.resetUserPassword));
    setSuccess(!isNil(confirmation?.resetUserPassword));
  };

  const translatedPath =
    i18n.language === defaultLng ? 'en/new-password' : 'nouveau-mot-de-passe';

  useEffect(() => {
    setContentTranslations(
      [
        {
          language: { slug: 'en' },
          uri: `/en/new-password?${queryString.stringify(query)}`,
        },
        {
          language: { slug: 'fr' },
          uri: `/nouveau-mot-de-passe?${queryString.stringify(query)}`,
        },
      ],
      `${translatedPath}?${queryString.stringify(query)}`
    );
  }, []);

  return (
    <Layout>
      <SEO
        title={t('sign.new_password')}
        metas={{ metaRobotsNoindex: 'noindex' }}
      />
      <div className="mx-15 md:mx-0">
        <div className="content-container md:w-1/2 lg:w-1/3 !mt-30 md:!mt-50 flow-root">
          <h1>{t('sign.new_password')}</h1>

          {!success && (
            <form onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label
                  className="block font-soehneKraftig text-13 uppercase text-brown-800 mt-30"
                  htmlFor="password"
                >
                  {t('sign.password')}
                </label>
                <input
                  {...register('password', { required: true, minLength: 8 })}
                  className="appearance-none border border-sand-300 w-full focus:outline-none focus:ring py-10 px-15 font-soehneLeicht text-19 mt-5"
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="password"
                  placeholder="***********"
                />
                {errors.password !== undefined &&
                  errors.password.type === 'minLength' && (
                    <em className="block leading-17 text-15 mt-10 font-soehneLeicht text-red">
                      {t('sign.password_weak')}
                    </em>
                  )}
                {errors.password !== undefined &&
                  errors.password.type !== 'minLength' && (
                    <em className="block leading-17 text-15 mt-10 font-soehneLeicht text-red">
                      {t('sign.password_missing')}
                    </em>
                  )}
              </div>

              <div>
                <label
                  className="block font-soehneKraftig text-13 uppercase text-brown-800 mt-15"
                  htmlFor="password_again"
                >
                  {t('sign.password_again')}
                </label>
                <input
                  {...register('password_again', {
                    required: true,
                    validate: v => v === getValues('password'),
                  })}
                  className="appearance-none border border-sand-300 w-full focus:outline-none focus:ring py-10 px-15 font-soehneLeicht text-19 mt-5"
                  id="password_again"
                  name="password_again"
                  type="password"
                  autoComplete="password_again"
                  placeholder="***********"
                />
                {errors.password_again !== undefined && (
                  <em className="block leading-17 text-15 mt-10 font-soehneLeicht text-red">
                    {t('sign.password_same')}
                  </em>
                )}
              </div>

              {saveError && (
                <div>
                  <em className="block leading-17 text-15 mt-10 font-soehneLeicht text-red">
                    {t('sign.save_error')}
                  </em>
                </div>
              )}

              <div className="flex items-center justify-between mt-30">
                <button type="submit" className="btn btn-normal btn-primary">
                  {t('sign.save')}
                </button>
              </div>
            </form>
          )}

          {success && <p className="mt-30">{t('sign.save_success')}</p>}
        </div>
      </div>
    </Layout>
  );
};

NewPasswordPage.propTypes = {};

NewPasswordPage.defaultProps = {};

export default NewPasswordPage;
