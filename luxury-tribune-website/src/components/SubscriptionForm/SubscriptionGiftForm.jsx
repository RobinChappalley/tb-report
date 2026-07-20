/* eslint-disable radix */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable global-require */
import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import { getLogin } from 'client/client';
import {
  createCustomer,
  createSubscription,
  getCoupon,
  getCustomer,
  listSubscriptionCustomer,
  updateSubscription,
} from 'client/wooCommerceClient';
import clsx from 'clsx';
import Link from 'next/link';
import Router from 'next/router';
import PropTypes from 'prop-types';
import { isNil } from 'ramda';
import * as yup from 'yup';

import Loader from 'components/Loader/Loader';
import SiteConfigContext from 'contexts/SiteConfigContext';
import { defaultLng } from 'locales/languages';

const SubscriptionGiftForm = ({ signup, subscription }) => {
  const { t, i18n } = useTranslation();
  const [title, setTitle] = useState('sir');
  const { setAlertMessage } = useContext(SiteConfigContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectCountries, setSelectCountries] = useState([]);
  const [termsAndConditions, setTermsAndConditions] = useState(false);

  const countries = require('i18n-iso-countries');
  countries.registerLocale(require('i18n-iso-countries/langs/en.json'));
  countries.registerLocale(require('i18n-iso-countries/langs/fr.json'));

  useEffect(() => {
    const countryList = require('country-list');
    setSelectCountries(countryList.getData());
  }, []);

  const validationShape = {
    isSignup: yup.boolean(),
    email: yup
      .string()
      .required(t('subscription.form.validation.email.required'))
      .email(t('subscription.form.validation.email.format')),
    password: yup
      .string()
      .required(t('subscription.form.validation.password'))
      .min(6, t('subscription.form.validation.password-format')),
    coupon: yup.string().required(t('subscription.form.validation.coupon')),
    termsConditions: yup
      .boolean()
      .oneOf([true], t('subscription.form.validation.terms-conditions')),
  };

  if (signup) {
    validationShape.title = yup.string().when('isSignup', {
      is: true,
      then: yup.string().required(t('subscription.form.validation.title')),
    });
    validationShape.firstName = yup.string().when('isSignup', {
      is: true,
      then: yup.string().required(t('subscription.form.validation.firstName')),
    });
    validationShape.lastName = yup.string().when('isSignup', {
      is: true,
      then: yup.string().required(t('subscription.form.validation.lastName')),
    });
    validationShape.country = yup.string().when('isSignup', {
      is: true,
      then: yup.string().required(t('subscription.form.validation.country')),
    });
    validationShape.city = yup.string().when('isSignup', {
      is: true,
      then: yup.string().required(t('subscription.form.validation.city')),
    });
    validationShape.passwordConfirmation = yup
      .string()
      .oneOf(
        [yup.ref('password'), null],
        t('subscription.form.validation.password-match')
      );
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(yup.object().shape(validationShape)),
  });

  const onSubmit = async data => {
    data.subscriptionType = subscription?.acf?.type;
    data.subscriptionId = subscription.id;
    data.subscriptionPriceInChf = subscription.priceInChf;
    data.coupon = data.coupon.toLowerCase();

    setIsSubmitting(true);

    if (signup) {
      const coupon = await getCoupon(data)().then(d => d);
      if (coupon.error) {
        setAlertMessage({ type: 'warning', message: t(coupon.error) });
        setIsSubmitting(false);
        return;
      }

      if (!coupon) {
        setAlertMessage({ type: 'warning', message: t('error.no-coupon') });
        setIsSubmitting(false);
        return;
      }

      if (coupon) {
        let allowedSubscriptions = coupon.product_ids ?? [];
        // Ensure every items in the array are integer
        allowedSubscriptions = allowedSubscriptions.map(id => parseInt(id));
        if (
          // eslint-disable-next-line radix
          !allowedSubscriptions?.includes(parseInt(data.subscriptionId))
        ) {
          setAlertMessage({
            type: 'warning',
            message: t('error.coupon-invalid-subscription'),
          });
          setIsSubmitting(false);
          return;
        }

        // Check the expiration date
        const expirationDate = new Date(coupon.date_expires).getTime();
        if (expirationDate && expirationDate <= Date.now()) {
          setAlertMessage({
            type: 'warning',
            message: t('error.coupon-invalid'),
          });
          setIsSubmitting(false);
          return;
        }

        // Check if the number of time the coupon can be used has exceeded
        const usageLimit = coupon.usage_limit;
        const usageCount = coupon.usage_count;
        if (usageLimit && usageCount >= usageLimit) {
          setAlertMessage({
            type: 'warning',
            message: t('error.coupon-invalid'),
          });
          setIsSubmitting(false);
          return;
        }

        data.coupon = coupon;
      }

      const customer = await createCustomer(data)().then(d => d);
      if (customer.error) {
        setAlertMessage({ type: 'warning', message: t(customer.error) });
        setIsSubmitting(false);
        return;
      }
      data.wooCommerceCustomerId = customer.id;

      // Create subscription with data info coupon
      const newSubscription = await createSubscription(data)().then(d => d);
      if (newSubscription.error) {
        setAlertMessage({ type: 'warning', message: t(newSubscription.error) });
        setIsSubmitting(false);
        return;
      }
    } else {
      const access = await getLogin({
        user: data.email,
        password: data.password,
      });

      if (isNil(access?.login)) {
        setAlertMessage({
          type: 'warning',
          message: t('error.wrong-credential'),
        });
        setIsSubmitting(false);
        return;
      }

      const customer = await getCustomer(data)().then(d => d);
      if (!customer) {
        setAlertMessage({ type: 'warning', message: t('error.no-account') });
        setIsSubmitting(false);
        return;
      }

      if (customer.error) {
        setAlertMessage(t(customer.error));
        setAlertMessage({ type: 'warning', message: t(customer.error) });
        setIsSubmitting(false);
        return;
      }

      data.wooCommerceCustomerId = customer.id;

      const coupon = await getCoupon(data)().then(d => d);
      if (coupon.error) {
        setAlertMessage({ type: 'warning', message: t(coupon.error) });
        setIsSubmitting(false);
        return;
      }

      if (!coupon) {
        setAlertMessage({ type: 'warning', message: t('error.no-coupon') });
        setIsSubmitting(false);
        return;
      }

      if (coupon) {
        let allowedSubscriptions = coupon.product_ids ?? [];
        // Ensure every items in the array are integer
        allowedSubscriptions = allowedSubscriptions.map(id => parseInt(id));
        if (
          // eslint-disable-next-line radix
          !allowedSubscriptions?.includes(parseInt(data.subscriptionId))
        ) {
          setAlertMessage({
            type: 'warning',
            message: t('error.coupon-invalid-subscription'),
          });
          setIsSubmitting(false);
          return;
        }

        // Check the expiration date
        const expirationDate = new Date(coupon.date_expires).getTime();
        if (expirationDate && expirationDate <= Date.now()) {
          setAlertMessage({
            type: 'warning',
            message: t('error.coupon-invalid'),
          });
          setIsSubmitting(false);
          return;
        }

        // Check if the number of time the coupon can be used has exceeded
        const usageLimit = coupon.usage_limit;
        const usageCount = coupon.usage_count;
        if (usageLimit && usageCount >= usageLimit) {
          setAlertMessage({
            type: 'warning',
            message: t('error.coupon-invalid'),
          });
          setIsSubmitting(false);
          return;
        }

        data.coupon = coupon;
      }

      const listSubscriptions = await listSubscriptionCustomer(data)();

      if (!listSubscriptions.length) {
        // Specific for the coupon
        const newSubscription = await createSubscription(data)().then(d => d);
        if (newSubscription.error) {
          setAlertMessage({
            type: 'warning',
            message: t(newSubscription.error),
          });
          setIsSubmitting(false);
          return;
        }
      } else {
        // eslint-disable-next-line camelcase
        data.lineItemId = listSubscriptions?.[0]?.line_items?.[0]?.id;
        data.subscription_id = listSubscriptions?.[0]?.id;

        // Specific for the coupon
        const previousSubscription = await updateSubscription(data)().then(
          d => d
        );
        if (previousSubscription.error) {
          setAlertMessage({
            type: 'warning',
            message: t(previousSubscription.error),
          });
          setIsSubmitting(false);
          return;
        }
      }
    }

    Router.push(
      i18n.language === defaultLng ? '/connection' : `/${i18n.language}/login`
    );
    setAlertMessage({ type: 'success', message: t('success.subscription') });
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="subscription-form">
        {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
        <input
          type="hidden"
          name="isSignup"
          value={signup}
          {...register('isSignup')}
        />
        {signup && (
          <div className="general-information mb-30">
            <h2>{t('subscription.form.general-information.title')}</h2>
            <ul className="flex list-none mt-30">
              <li>
                <label htmlFor="radioSir">
                  <input
                    name="title"
                    type="radio"
                    value="sir"
                    id="radioSir"
                    defaultChecked={title === 'sir'}
                    onClick={() => setTitle('sir')}
                    aria-label={t(
                      'subscription.form.general-information.radio.sir'
                    )}
                    {...register('title')}
                  />
                  <span className="ml-10 text-19 text-brown-800 font-soehneLeicht leading-26">
                    {t('subscription.form.general-information.radio.sir')}
                  </span>
                </label>
              </li>
              <li className="ml-30">
                <label htmlFor="radioMadam">
                  <input
                    name="title"
                    type="radio"
                    value="madam"
                    id="radioMadam"
                    defaultChecked={title === 'madam'}
                    onClick={() => setTitle('madam')}
                    aria-label={t(
                      'subscription.form.general-information.radio.madam'
                    )}
                    {...register('title')}
                  />
                  <span className="ml-10 text-19 text-brown-800 font-soehneLeicht leading-26">
                    {t('subscription.form.general-information.radio.madam')}
                  </span>
                </label>
              </li>
            </ul>
            {errors.title && (
              <span className="text-orange text-15">
                {errors.title?.message}
              </span>
            )}
            <div className="flex-wrap mx-0 md:flex md:-mx-15 mt-30">
              <div className="w-full md:w-1/2 md:px-15 mb-30">
                <label htmlFor="firstName" className="flex flex-col w-full">
                  <span className="label">
                    {t(
                      'subscription.form.general-information.input.first-name'
                    )}
                  </span>
                  <input
                    className={clsx(
                      'input-text',
                      errors.firstName && 'input-error'
                    )}
                    id="firstName"
                    name="firstName"
                    type="text"
                    placeholder={t(
                      'subscription.form.general-information.input.first-name'
                    )}
                    aria-label={t(
                      'subscription.form.general-information.input.first-name'
                    )}
                    {...register('firstName')}
                  />
                  {errors.firstName && (
                    <span className="text-orange text-15">
                      {errors.firstName?.message}
                    </span>
                  )}
                </label>
              </div>
              <div className="w-full md:w-1/2 md:px-15 mb-30">
                <label htmlFor="lastName" className="flex flex-col w-full">
                  <span className="label">
                    {t('subscription.form.general-information.input.last-name')}
                  </span>
                  <input
                    className={clsx(
                      'input-text',
                      errors.lastName && 'input-error'
                    )}
                    id="lastName"
                    name="lastName"
                    type="text"
                    placeholder={t(
                      'subscription.form.general-information.input.last-name'
                    )}
                    aria-label={t(
                      'subscription.form.general-information.input.last-name'
                    )}
                    {...register('lastName')}
                  />
                  {errors.lastName && (
                    <span className="text-orange text-15">
                      {errors.lastName?.message}
                    </span>
                  )}
                </label>
              </div>
              <div className="w-full md:w-1/2 md:px-15 mb-30">
                <label htmlFor="country" className="flex flex-col w-full ">
                  <span className="label">
                    {t(
                      'subscription.form.general-information.input.country.label'
                    )}
                  </span>
                  <select
                    name="country"
                    id="country"
                    className="input-select"
                    defaultValue=""
                    {...register('country')}
                  >
                    <option disabled value="">
                      {t(
                        'subscription.form.general-information.input.country.default-option'
                      )}
                    </option>
                    {selectCountries
                      .sort((a, b) =>
                        countries.getName(a.code, i18n.language, {
                          select: 'official',
                        }) >
                        countries.getName(b.code, i18n.language, {
                          select: 'official',
                        })
                          ? 1
                          : -1
                      )
                      .map(country => (
                        <option value={country.code} key={country.code}>
                          {countries.getName(country.code, i18n.language, {
                            select: 'official',
                          })}
                        </option>
                      ))}
                  </select>
                  {errors.country && (
                    <span className="text-orange text-15">
                      {errors.country?.message}
                    </span>
                  )}
                </label>
              </div>
              <div className="w-full md:w-1/2 md:px-15 mb-30">
                <label htmlFor="city" className="flex flex-col w-full h-full">
                  <span className="label">
                    {t('subscription.form.general-information.input.city')}
                  </span>
                  <input
                    className={clsx('input-text', errors.city && 'input-error')}
                    id="city"
                    name="city"
                    type="text"
                    placeholder={t(
                      'subscription.form.general-information.input.city'
                    )}
                    aria-label={t(
                      'subscription.form.general-information.input.city'
                    )}
                    {...register('city')}
                  />
                  {errors.city && (
                    <span className="text-orange text-15">
                      {errors.city?.message}
                    </span>
                  )}
                </label>
              </div>
            </div>
          </div>
        )}

        <div className="account-information mb-30">
          <h2>{t('subscription.form.account.title')}</h2>
          <div className="flex-wrap mx-0 md:flex md:-mx-15 mt-30">
            <div className="w-full md:w-1/2 md:px-15 mb-30">
              <label htmlFor="email" className="flex flex-col">
                <span className="label">
                  {t('subscription.form.account.input.email.label')}
                </span>
                <input
                  className={clsx('input-text', errors.email && 'input-error')}
                  id="email"
                  name="email"
                  type="text"
                  placeholder={t('subscription.form.account.input.email.label')}
                  aria-label={t('subscription.form.account.input.email.label')}
                  style={{ marginBottom: '10px' }}
                  {...register('email')}
                />
              </label>
              {errors.email && (
                <span className="mb-5 text-orange text-15">
                  {errors.email?.message}
                </span>
              )}
            </div>
          </div>
          <div className="flex-wrap mx-0 md:flex md:-mx-15 mt-30">
            <div className="w-full md:w-1/2 md:px-15 mb-30">
              <label htmlFor="password" className="flex flex-col w-full">
                <span className="label">
                  {t('subscription.form.account.input.password.label')}
                </span>
                <input
                  className={clsx(
                    'input-text',
                    errors.password && 'input-error'
                  )}
                  id="password"
                  name="password"
                  type="password"
                  placeholder={t(
                    'subscription.form.account.input.password.placeholder'
                  )}
                  aria-label={t(
                    'subscription.form.account.input.password.label'
                  )}
                  {...register('password')}
                />
                {errors.password && (
                  <span className="text-orange text-15">
                    {errors.password?.message}
                  </span>
                )}
              </label>
            </div>
            {signup && (
              <div className="w-full md:w-1/2 md:px-15 mb-30">
                <label
                  htmlFor="passwordConfirmation"
                  className="flex flex-col w-full"
                >
                  <span className="label">
                    {t(
                      'subscription.form.account.input.password-confirm.label'
                    )}
                  </span>
                  <input
                    className={clsx(
                      'input-text',
                      errors.passwordConfirmation && 'input-error'
                    )}
                    id="passwordConfirmation"
                    name="passwordConfirmation"
                    type="password"
                    placeholder={t(
                      'subscription.form.account.input.password.placeholder'
                    )}
                    aria-label={t(
                      'subscription.form.account.input.password-confirm.label'
                    )}
                    {...register('passwordConfirmation')}
                  />
                  {errors.passwordConfirmation && (
                    <span className="text-orange text-15">
                      {errors.passwordConfirmation?.message}
                    </span>
                  )}
                </label>
              </div>
            )}
          </div>
        </div>

        <div className="payment-information">
          <h2>{t('subscription.form.coupon.title')}</h2>
          <div className="flex-wrap mx-0 md:flex md:-mx-15 mt-30">
            <div className="w-full md:w-1/2 md:px-15 mb-30">
              <label htmlFor="coupon" className="flex flex-col w-full">
                <span className="label">
                  {t('subscription.form.coupon.input.label')}
                </span>
                <input
                  className={clsx('input-text', errors.coupon && 'input-error')}
                  id="coupon"
                  name="coupon"
                  type="text"
                  placeholder={t('subscription.form.coupon.input.placeholder')}
                  aria-label={t('subscription.form.coupon.input.placeholder')}
                  {...register('coupon')}
                />
                {errors.coupon && (
                  <span className="text-orange text-15">
                    {errors.coupon?.message}
                  </span>
                )}
              </label>
            </div>
          </div>
        </div>
        <div className="mb-30">
          <label htmlFor="termsConditions">
            <input
              type="checkbox"
              id="termsConditions"
              name="termsConditions"
              value={termsAndConditions}
              onClick={() => setTermsAndConditions(!termsAndConditions)}
              {...register('termsConditions')}
            />
            <span className="ml-10 tracking-normal text-19 text-brown-800 leading-17 font-soehneLeicht">
              {`${t('subscription.form.terms_conditions.label')} `}
              <Link
                href={
                  i18n.language === defaultLng
                    ? '/conditions-generales'
                    : '/en/terms-conditions'
                }
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange hover:underline"
              >
                {t('subscription.form.terms_conditions.link')}
              </Link>
            </span>
          </label>
          {errors.termsConditions && (
            <p className="text-orange text-15">
              {errors.termsConditions?.message}
            </p>
          )}
        </div>
        <div>
          <button
            type="submit"
            className="tracking-wide text-15 leading-20 btn btn-normal btn-primary"
          >
            {isSubmitting ? <Loader /> : t('subscription.form.submit')}
          </button>
        </div>
      </form>
    </div>
  );
};

SubscriptionGiftForm.propTypes = {
  signup: PropTypes.bool,
  subscription: PropTypes.object,
};

SubscriptionGiftForm.defaultProps = {
  signup: true,
  subscription: {},
};

export default SubscriptionGiftForm;
