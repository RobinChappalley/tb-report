import React from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';

import Icon from 'components/Icon';
import Layout from 'components/Layout';
import SEO from 'components/SEO/SEO';
import { defaultLng } from 'locales/languages';

const Error404 = () => {
  const { t, i18n } = useTranslation();
  const router = useRouter();

  return (
    <Layout>
      <SEO title={t('404.seo_title')} />

      <div className="content-container max-md:px-15">
        <div className="mt-60 md:mt-100 text-orange text-15 uppercase font-soehneKraftig tracking-[1.35px]">
          {`${t('404.subtitle')} `}
        </div>
        <h1 className="text-46 font-bold">{`${t('404.title')} `}</h1>
        <p className="mt-25 font-soehneLeicht font-light text-25 tracking-tightish">
          {`${t('404.description')} `}
        </p>
        <div className="flex gap-15 mt-30 md:mt-50">
          <button
            onClick={() => router.back()}
            type="button"
            aria-label={t('404.back_aria_label')}
            className="btn btn-secondary btn-normal"
          >
            {t('404.back')}
          </button>
          <a
            href={i18n.language === defaultLng ? '/' : '/en'}
            type="button"
            aria-label={t('404.button_aria_label')}
            className="btn btn-primary btn-normal"
          >
            {t('404.button')}
          </a>
        </div>

        {/* Links */}
        <div className="mt-60 md:mt-50 divide-y divide-sand-500 border-y border-sand-500">
          <Error404Link
            title={t('404.links.0.title')}
            subtitle={t('404.links.0.subtitle')}
            link={t('404.links.0.href')}
          />
          <Error404Link
            title={t('404.links.1.title')}
            subtitle={t('404.links.1.subtitle')}
            link={t('404.links.1.href')}
          />
          <Error404Link
            title={t('404.links.2.title')}
            subtitle={t('404.links.2.subtitle')}
            link={t('404.links.2.href')}
          />
        </div>
      </div>
    </Layout>
  );
};

const Error404Link = ({ title, subtitle, link }) => (
  <a className="flex items-center py-20 font-soehneKraftig text-19" href={link}>
    <div className="flex-1">
      <div>{title}</div>
      <div className="font-soehneLeicht font-light">{subtitle}</div>
    </div>
    <Icon name="chevron" className="!text-20 !text-orange" />
  </a>
);

Error404Link.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
};

export default Error404;
