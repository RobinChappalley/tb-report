import React, { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import he from 'he';
import PropTypes from 'prop-types';
import { pipe } from 'ramda';

import Icon from 'components/Icon';
import Layout from 'components/Layout';
import Page from 'components/Page';
import SEO from 'components/SEO/SEO';
import SiteConfigContext from 'contexts/SiteConfigContext';
import useSpecificPage from 'hooks/useSpecificPage';
import { defaultLng } from 'locales/languages';
import extractFirstLead from 'utils/extractFirstLead';
import handleFootnotesAnchors from 'utils/handleFootnotesAnchors';

const slugs = {
  fr: 'a-propos',
  en: 'en/about',
};
const getSlug = (lng = defaultLng) => slugs[lng];

const AboutContent = ({ lang }) => {
  const { t } = useTranslation();
  const { data } = useSpecificPage(getSlug(lang));

  const { setContentTranslations } = useContext(SiteConfigContext);

  const editors = [
    {
      picture: '/about/auteur-cristina.jpg',
      name: "Cristina D'Agostino",
      position: t('about.cristina.position'),
      description: t('about.cristina.description'),
      links: [
        {
          title: 'E-mail',
          url: 'mailto:c.dagostino@luxurytribune.com',
        },
        {
          title: 'Linkedin',
          url: 'https://www.linkedin.com/in/cristina-d-agostino-1678307',
        },
      ],
    },
    {
      picture: '/about/auteur-bettina.jpg',
      name: 'Bettina Bush Mignanego',
      position: t('about.bettina.position'),
      description: t('about.bettina.description'),
      links: [],
    },
    {
      picture: '/about/auteur-eva.jpeg',
      name: 'Eva Morletto',
      position: t('about.eva.position'),
      description: t('about.eva.description'),
      links: [],
    },
    {
      picture: '/about/auteur-aymeric.jpg',
      name: 'Aymeric Mantoux',
      position: t('about.aymeric.position'),
      description: t('about.aymeric.description'),
      links: [
        {
          title: 'Linkedin',
          url: 'https://www.linkedin.com/in/aymeric-mantoux-16a6bb2b',
        },
      ],
    },
    {
      picture: '/about/auteur-morgane.jpeg',
      name: 'Morgane Nyfeler',
      position: t('about.morgane.position'),
      description: t('about.morgane.description'),
      links: [],
    },
    {
      picture: '/about/auteur-shilpa.jpeg',
      name: 'Shilpa Dhamija',
      position: t('about.shilpa.position'),
      description: t('about.shilpa.description'),
      links: [],
    },
    {
      picture: '/about/auteur-jacqueline.jpg',
      name: 'Jacqueline Chelliah',
      position: t('about.jacqueline.position'),
      description: t('about.jacqueline.description'),
      links: [],
    },
    {
      picture: '/about/auteur-melissa.jpg',
      name: 'Melissa Kilickaya',
      position: t('about.melissa.position'),
      description: t('about.melissa.description'),
      links: [],
    },
    {
      picture: '/about/auteur-amy.jpg',
      name: 'Amy Weng',
      position: t('about.amy.position'),
      description: t('about.amy.description'),
      links: [],
    },
    {
      picture: '/about/auteur-cecilia.jpg',
      name: 'Cécilia Pelloux',
      position: t('about.cecilia.position'),
      description: t('about.cecilia.description'),
      links: [],
    },
  ];

  useEffect(() => {
    if (data) {
      setContentTranslations(data.translations, getSlug(lang));
    }
  }, [data]);

  return (
    <Layout>
      {data && (
        <>
          <SEO title={he.decode(data.title)} />
          <Page
            content={pipe(extractFirstLead, handleFootnotesAnchors)(data)}
          />
          <section className="content-container px-15 md:px-0 !mt-60 md:!mt-80">
            <h1 className="border-b border-solid pb-30 border-sand-500 mb-30">
              {t('about.editors')}
            </h1>
            <div>
              {editors.map(editor => (
                <div
                  key={editor.name}
                  className="items-start border-b border-solid md:flex pb-30 border-sand-500 mb-30"
                >
                  <img
                    className="rounded-full"
                    style={{ maxWidth: '16rem' }}
                    src={editor.picture}
                    alt={editor.name}
                  />
                  <div className="mt-10 md:mt-0 md:ml-30">
                    <h3>{editor.name}</h3>
                    <h4>{editor.position}</h4>
                    <p className="my-20">{editor.description}</p>
                    <div className="flex items-center">
                      {editor.links.map(link => (
                        <a
                          key={link.url}
                          href={link.url}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="mr-20 uppercase font-soehneKraftig text-13 hover:text-orange"
                        >
                          <span>{link.title}</span>
                          <Icon
                            className="!text-orange !text-10 !ml-5"
                            name="arrow-link"
                            baseline
                          />
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </Layout>
  );
};

AboutContent.propTypes = {
  lang: PropTypes.string,
};

export default AboutContent;
