/* eslint-disable radix */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable global-require */
import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  Elements,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { getLogin } from 'client/client';
import {
  createCustomer,
  createStripeCustomer,
  createStripeSource,
  createSubscription,
  getCoupon,
  getCustomer,
  getStripeCustomer,
  listSubscriptionCustomer,
  updateStripeCustomerDefaultSource,
  updateSubscription,
} from 'client/wooCommerceClient';
import clsx from 'clsx';
import Link from 'next/link';
import Router, { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { isEmpty, isNil } from 'ramda';
import * as yup from 'yup';

import Loader from 'components/Loader/Loader';
import config, { subscriptionPromoPeriod } from 'config/config';
import SiteConfigContext from 'contexts/SiteConfigContext';
import { defaultLng } from 'locales/languages';
import gtm from 'services/google-tag-manager';

import { theme } from '../../../tailwind.config';

const SubscriptionForm = ({ signup, subscription }) => {
  const { t, i18n } = useTranslation();
  const [title, setTitle] = useState('sir');
  const [termsAndConditions, setTermsAndConditions] = useState(false);
  const [errorCardInput, setErrorCardInput] = useState(null);
  const { setAlertMessage } = useContext(SiteConfigContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectCountries, setSelectCountries] = useState([]);
  const { asPath } = useRouter();

  const countries = require('i18n-iso-countries');
  countries.registerLocale(require('i18n-iso-countries/langs/en.json'));
  countries.registerLocale(require('i18n-iso-countries/langs/fr.json'));

  useEffect(() => {
    const countryList = require('country-list');
    setSelectCountries(countryList.getData());
  }, []);

  useEffect(() => {
    gtm.dl({
      content_type: 'funnel',
    });
    gtm.event('PageView', {
      page_path: asPath,
      page_title: t('header.subscribe'),
    });
  }, [asPath]);

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
    cardName: yup
      .string()
      .required(t('subscription.form.validation.card-name')),
    coupon: yup.string(),
    termsConditions: yup
      .boolean()
      .oneOf([true], t('subscription.form.validation.terms-conditions')),
  };

  if (signup) {
    validationShape.passwordConfirmation = yup
      .string()
      .oneOf(
        [yup.ref('password'), null],
        t('subscription.form.validation.password-match')
      );
    validationShape.title = yup
      .string()
      .required(t('subscription.form.validation.title'));
    validationShape.firstName = yup
      .string()
      .required(t('subscription.form.validation.firstName'));
    validationShape.lastName = yup
      .string()
      .required(t('subscription.form.validation.lastName'));
    validationShape.country = yup
      .string()
      .required(t('subscription.form.validation.country'));
    validationShape.city = yup
      .string()
      .required(t('subscription.form.validation.city'));
  }

  const stripeElementStyle = {
    base: {
      color: theme.colors.brown['800'],
      fontSize: '19px',
      fontWeight: '300',
      // lineHeight: '26px',
      letterSpacing: theme.letterSpacing.normal,
      '::placeholder': {
        color: 'rgba(40, 29, 29, 0.5)',
      },
    },
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(yup.object().shape(validationShape)),
  });

  const elements = useElements();
  const stripe = useStripe();

  const onSubmit = async data => {
    const cardNumber = elements.getElement(CardNumberElement);
    const result = await stripe.createToken(cardNumber);

    if (result.error) {
      setErrorCardInput(result.error.message);
      return;
    }

    data.token = result.token.id;
    data.subscriptionType = subscription.type;
    data.subscriptionId = subscription.id;
    data.subscriptionIsStudent = subscription.isStudent;
    data.subscriptionPriceInChf = subscription.priceInChf;
    data.locale = i18n.language;
    data.coupon = data.coupon.toLowerCase();

    setIsSubmitting(true);
    gtm.event('subscribe_step2');

    const coupon = await getCoupon(data)().then(d => d);
    console.log('[subscription] getCoupon result:', coupon);

    if (coupon.error) {
      setAlertMessage({ type: 'warning', message: t(coupon.error) });
      setIsSubmitting(false);
      return;
    }

    if (!isEmpty(coupon)) {
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

    if (signup) {
      const customer = await createCustomer(data)().then(d => d);
      console.log('[subscription] createCustomer result:', customer);
      if (customer.error) {
        setAlertMessage({ type: 'warning', message: t(customer.error) });
        setIsSubmitting(false);
        return;
      }
      data.wooCommerceCustomerId = customer.id;

      const stripeCustomer = await createStripeCustomer(data)().then(d => d);
      console.log(
        '[subscription] createStripeCustomer result:',
        stripeCustomer
      );
      if (stripeCustomer.error) {
        setAlertMessage({ type: 'warning', message: t(stripeCustomer.error) });
        setIsSubmitting(false);
        return;
      }
      data.stripeCustomerId = stripeCustomer.id;

      const stripeSource = await createStripeSource(data)().then(d => d);
      console.log('[subscription] createStripeSource result:', stripeSource);
      if (stripeSource.error) {
        setAlertMessage({ type: 'warning', message: t(stripeSource.error) });
        setIsSubmitting(false);
        return;
      }
      data.stripeSourceId = stripeSource.id;

      const newSubscription = await createSubscription(data)().then(d => d);
      console.log('[subscription] createSubscription result:', newSubscription);
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
      console.log('[subscription] getCustomer result:', customer);
      if (!customer) {
        setAlertMessage({
          type: 'warning',
          message: t('error.no-account'),
        });
        setIsSubmitting(false);
        return;
      }

      if (customer.error) {
        setAlertMessage({ type: 'warning', message: t(customer.error) });
        setIsSubmitting(false);
        return;
      }

      data.wooCommerceCustomerId = customer.id;

      let stripeCustomer = await getStripeCustomer(data)().then(d => d);
      console.log('[subscription] getStripeCustomer result:', stripeCustomer);

      if (!stripeCustomer) {
        stripeCustomer = await createStripeCustomer(data)().then(d => d);
        console.log(
          '[subscription] createStripeCustomer result:',
          stripeCustomer
        );
      }

      if (stripeCustomer.error) {
        setAlertMessage({ type: 'warning', message: t(stripeCustomer.error) });
        setIsSubmitting(false);
        return;
      }

      data.stripeCustomerId = stripeCustomer.id;

      /* const stripeSource = await createStripeSource(data)();
      if (stripeSource.error) {
        setAlertMessage({ type: 'warning', message: t(stripeSource.error) });
        setIsSubmitting(false);
        return;
      }

      data.stripeSourceId = stripeSource.id; */

      const updateStripeCustomer = await updateStripeCustomerDefaultSource(
        data
      )().then(d => d);
      console.log(
        '[subscription] updateStripeDefaultSource result:',
        updateStripeCustomer
      );
      if (updateStripeCustomer.error) {
        setAlertMessage({
          type: 'warning',
          message: t(updateStripeCustomer.error),
        });
        setIsSubmitting(false);
        return;
      }

      const listSubscriptions = await listSubscriptionCustomer(data)().then(
        d => d
      );
      console.log(
        '[subscription] listSubscriptions result:',
        listSubscriptions
      );

      if (!listSubscriptions.length) {
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
  const isPromoted =
    new Date() >= subscriptionPromoPeriod.promoStartDate &&
    new Date() <= subscriptionPromoPeriod.promoEndDate &&
    subscriptionPromoPeriod.promoProductId.includes(subscription.id);

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
              <div className="flex flex-col">
                {errors.email && (
                  <span className="mb-5 text-orange text-15">
                    {errors.email?.message}
                  </span>
                )}
                {subscription.isStudent === 'true' && (
                  <span className="text-15 leading-22 text-brown-800 font-soehneLeicht">
                    {t('subscription.form.account.input.email.help-text')}
                  </span>
                )}
              </div>
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
          <h2>{t('subscription.form.payment-information.title')}</h2>
          <div className="flex-wrap mx-0 md:flex md:-mx-15 mt-30">
            <div className="w-full md:w-1/2 md:px-15 mb-30">
              <label htmlFor="cardName" className="flex flex-col w-full">
                <span className="label">
                  {t('subscription.form.payment-information.input.card-name')}
                </span>
                <input
                  className={clsx(
                    'input-text',
                    errors.cardName && 'input-error'
                  )}
                  id="cardName"
                  name="cardName"
                  type="text"
                  placeholder={t(
                    'subscription.form.payment-information.input.card-name'
                  )}
                  aria-label={t(
                    'subscription.form.payment-information.input.card-name'
                  )}
                  {...register('cardName')}
                />
                {errors.cardName && (
                  <span className="text-orange text-15">
                    {errors.cardName?.message}
                  </span>
                )}
              </label>
            </div>
            <div className="w-full md:w-1/2 md:px-15 mb-30">
              <label htmlFor="cardNumber" className="flex flex-col w-full ">
                <span className="label">
                  {t(
                    'subscription.form.payment-information.input.card-number.label'
                  )}
                </span>
                <CardNumberElement
                  options={{
                    placeholder: t(
                      'subscription.form.payment-information.input.card-number.placeholder'
                    ),
                    classes: {
                      base: `input-text${errorCardInput ? ' input-error' : ''}`,
                      invalid: 'input-error',
                    },
                    style: stripeElementStyle,
                  }}
                  id="cardNumber"
                />
                {errorCardInput && (
                  <span className="text-orange text-15">{errorCardInput}</span>
                )}
              </label>
            </div>
          </div>
          <div className="flex-wrap mx-0 md:flex md:-mx-15 mt-30">
            <div className="w-full md:w-1/3 md:px-15 mb-30">
              <label
                htmlFor="expirationDate"
                className="flex flex-col w-full h-full"
              >
                <span className="label">
                  {t(
                    'subscription.form.payment-information.input.expiration-date.label'
                  )}
                </span>
                <CardExpiryElement
                  options={{
                    placeholder: t(
                      'subscription.form.payment-information.input.expiration-date.placeholder'
                    ),
                    classes: {
                      base: 'input-text',
                      invalid: 'input-error',
                    },
                    style: stripeElementStyle,
                  }}
                  id="expirationDate"
                />
              </label>
            </div>
            <div className="w-full md:w-1/3 md:px-15 mb-30">
              <label
                htmlFor="cryptogram"
                className="flex flex-col w-full h-full"
              >
                <span className="label">
                  {t(
                    'subscription.form.payment-information.input.cryptogram.label'
                  )}
                </span>
                <CardCvcElement
                  options={{
                    placeholder: t(
                      'subscription.form.payment-information.input.cryptogram.placeholder'
                    ),
                    classes: {
                      base: 'input-text',
                      invalid: 'input-error',
                    },
                    style: stripeElementStyle,
                  }}
                  id="cryptogram"
                />
              </label>
            </div>
          </div>

          <h2>{t('subscription.form.coupon.title')}</h2>

          <span className="text-15 leading-22 text-brown-800 font-soehneLeicht">
            {t('subscription.form.coupon.helptext')}
          </span>
          <div className="flex-wrap mx-0 md:flex md:-mx-15 mt-15">
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
                  defaultValue={
                    isPromoted ? subscriptionPromoPeriod.promoCode : ''
                  }
                  {...register('coupon')}
                />
                {isPromoted && (
                  <div>
                    <div className="border-orange border-2 mt-15 py-2 px-10 inline-block">
                      <span className="label">
                        <span className="text-orange">
                          {i18n.language === defaultLng
                            ? subscriptionPromoPeriod.fr.promoCodeLabel
                            : subscriptionPromoPeriod.en.promoCodeLabel}
                        </span>
                      </span>
                    </div>
                  </div>
                )}
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
            className="tracking-wide btn btn-normal btn-primary text-15 leading-20"
          >
            {isSubmitting ? <Loader /> : t('subscription.form.submit')}
          </button>
        </div>
      </form>
    </div>
  );
};

SubscriptionForm.propTypes = {
  signup: PropTypes.bool,
  subscription: PropTypes.object,
};

const stripePromise = config.stripePublicKey
  ? loadStripe(config.stripePublicKey)
  : null;

const Subscription = ({ subscription }) => {
  const [signup, setSignup] = useState(subscription?.isRenewal === 'false');
  const { t } = useTranslation();
  const isPromoted =
    new Date() >= subscriptionPromoPeriod.promoStartDate &&
    new Date() <= subscriptionPromoPeriod.promoEndDate &&
    subscriptionPromoPeriod.promoProductId.includes(subscription.id);

  return (
    <div className="mx-15 md:mx-0">
      <div className="content-container">
        <div className="mt-30 md:mt-50 flow-root">
          <h1>{t('subscription.title')}</h1>
          <div className="mt-25 md:mt-30">
            <h2 className="lead">{t('subscription.lead')}</h2>
          </div>
        </div>
        <div className="mt-40 mb-60">
          <div
            className={clsx(
              'subscription-card !w-full mb-60 card-white ',
              isPromoted ? 'border-orange border-4' : ''
            )}
          >
            <div className="flex">
              <h2 className="mr-10">{subscription.title}</h2>
              <div className="flex items-start">
                {isPromoted ? (
                  // active promo
                  <span className="text-30 font-soehneKraftig leading-40">
                    <s>{`${subscription.price}`}</s>
                    <span className="text-orange">
                      {` ${
                        subscription.price * subscriptionPromoPeriod.percentage
                      } `}
                    </span>
                  </span>
                ) : (
                  // not activ promo
                  <span className="text-orange text-30 font-soehneKraftig leading-40">
                    {`${subscription.price} `}
                  </span>
                )}
                <span className="text-orange text-13 font-soehneKraftig leading-17 tracking-wide uppercase ml-5 mt-5 subscription-currency-type">
                  {`${subscription.currency} / `}
                  {subscription.type === 'Mensuel'
                    ? t('subscription.type.monthly')
                    : t('subscription.type.yearly')}
                </span>
              </div>
            </div>
            {subscription.currency !== 'CHF' && (
              <p className="text-13 leading-17 opacity-50 mt-5">
                {t('subscription.charged_price', {
                  price: subscription.priceInChf,
                })}
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-wrap mb-30 lg:mb-40 border-b border-sand-500">
          <button
            className={clsx(
              'mr-20 mt-15 pb-15 uppercase text-15 font-soehneKraftig tracking-wide leading-26',
              signup ? 'text-orange relative' : 'text-brown-500'
            )}
            type="button"
            onClick={() => setSignup(true)}
          >
            {t('subscription.signup')}
            {signup && (
              <div
                className="absolute w-full bg-orange"
                style={{ bottom: '-1px', height: '2px' }}
              />
            )}
          </button>
          <button
            className={clsx(
              'mr-20 mt-15 pb-15 uppercase text-15 font-soehneKraftig tracking-wide leading-26',
              !signup ? 'text-orange relative' : 'text-brown-500'
            )}
            type="button"
            onClick={() => setSignup(false)}
          >
            {t('subscription.login')}
            {!signup && (
              <div
                className="absolute w-full bg-orange"
                style={{ bottom: '-1px', height: '2px' }}
              />
            )}
          </button>
        </div>
        {stripePromise ? (
          <Elements stripe={stripePromise}>
            <SubscriptionForm signup={signup} subscription={subscription} />
          </Elements>
        ) : (
          <div className="p-20 text-center">
            <p className="text-brown-500 mb-10">
              Service de paiement non disponible en développement local
            </p>
            <p className="text-brown-300 text-sm">
              {`Prix: ${subscription?.price} ${subscription?.currency}`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

Subscription.propTypes = {
  subscription: PropTypes.object,
};

export default Subscription;
