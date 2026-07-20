/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { getSendPasswordResetEmail } from 'client/client';
import { isNil } from 'ramda';

import Layout from 'components/Layout';
import SEO from 'components/SEO/SEO';
import SiteConfigContext from 'contexts/SiteConfigContext';
import { defaultLng } from 'locales/languages';

const ResetPasswordPage = () => {
  const { setContentTranslations } = useContext(SiteConfigContext);
  const [resetError, setResetError] = useState(false);
  const [success, setSuccess] = useState(false);
  const { i18n, t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async ({ email }) => {
    const confirmation = await getSendPasswordResetEmail({
      user: email,
    });

    setResetError(isNil(confirmation?.sendPasswordResetEmail));
    setSuccess(!isNil(confirmation?.sendPasswordResetEmail));
  };

  useEffect(() => {
    setContentTranslations(
      [
        {
          language: { slug: 'en' },
          uri: '/en/reset-password',
        },
        {
          language: { slug: 'fr' },
          uri: '/reinitialiser-mot-de-passe',
        },
      ],
      i18n.language === defaultLng
        ? 'en/reset-password'
        : 'reinitialiser-mot-de-passe'
    );
  }, []);

  return (
    <Layout>
      <SEO
        title={t('sign.reset_password')}
        metas={{ metaRobotsNoindex: 'noindex' }}
      />
      <div className="mx-15 md:mx-0">
        <div className="content-container md:w-1/2 lg:w-1/3 !mt-30 md:!mt-50 flow-root">
          <h1>{t('sign.reset_password')}</h1>

          {!success && (
            <form onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label
                  className="block font-soehneKraftig text-13 uppercase text-brown-800 mt-30"
                  htmlFor="email"
                >
                  {t('sign.email')}
                </label>
                <input
                  {...register('email', { required: true, minLength: 8 })}
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

              {resetError && (
                <div>
                  <em className="block leading-17 text-15 mt-10 font-soehneLeicht text-red">
                    {t('sign.reset_error')}
                  </em>
                </div>
              )}

              <div className="flex items-center justify-between mt-30">
                <button type="submit" className="btn btn-primary btn-normal">
                  {t('sign.reset')}
                </button>
              </div>
            </form>
          )}

          {success && <p className="mt-30">{t('sign.reset_success')}</p>}
        </div>
      </div>
    </Layout>
  );
};

ResetPasswordPage.propTypes = {};

ResetPasswordPage.defaultProps = {};

export default ResetPasswordPage;
