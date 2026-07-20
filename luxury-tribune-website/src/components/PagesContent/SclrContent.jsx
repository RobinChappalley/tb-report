import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import he from 'he';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { pipe } from 'ramda';

import FadeInImage from 'components/FadeInImage';
import FilterAuthor from 'components/FilterAuthor';
import Layout from 'components/Layout';
import Page from 'components/Page';
import SEO from 'components/SEO/SEO';
import SiteConfigContext from 'contexts/SiteConfigContext';
import useAuthors from 'hooks/useAuthors';
import useSpecificPage from 'hooks/useSpecificPage';
import { defaultLng } from 'locales/languages';
import extractFirstLead from 'utils/extractFirstLead';
import handleFootnotesAnchors from 'utils/handleFootnotesAnchors';
import sanitizeSlug from 'utils/sanitizeSlug';

const slugs = {
  fr: 'le-sclr',
  en: 'en/the-sclr',
};
const getSlug = (lng = defaultLng) => slugs[lng];

const SclrContent = ({ lang }) => {
  const { setContentTranslations } = useContext(SiteConfigContext);
  const { t } = useTranslation();
  const { data } = useSpecificPage(getSlug(lang));

  const { data: authorsData } = useAuthors({
    amount: 30,
    lng: lang,
  });

  useEffect(() => {
    if (data) {
      setContentTranslations(data.translations, getSlug(lang));
    }
  }, [data]);

  const [sclrAuthors, setSclrAuthors] = useState(null);
  const [authorCategories, setAuthorCategories] = useState([]);
  const [currentCategory, setCurrentCategory] = useState('all');

  useEffect(() => {
    setSclrAuthors(authorsData?.authors.nodes);
    setAuthorCategories(authorsData?.authorsCategories.nodes);
  }, [authorsData]);

  const changeCategory = category => {
    if (category === 'all') {
      setCurrentCategory('all');
      setSclrAuthors(authorsData?.authors.nodes);
    } else {
      setCurrentCategory(category);
      setSclrAuthors(
        authorsData.filter(author =>
          author.authorsCategories.nodes.some(
            authorCategory => authorCategory.name === category
          )
        )
      );
    }
  };

  return (
    <Layout>
      {data && (
        <>
          <SEO title={he.decode(data.title)} />
          <div className="content-container !mt-30 md:!mt-50 flow-root">
            <img src="/sclr/sclr.png" alt={data.title} className="max-w-xs" />
          </div>
          <Page
            content={pipe(extractFirstLead, handleFootnotesAnchors)(data)}
          />
        </>
      )}
      {sclrAuthors && (
        <div className="container px-15 xl:px-0">
          <h2 className="mt-60 md:mt-100 mb-30 md:mb-40">
            {t('sclr.partners')}
          </h2>
          <FilterAuthor
            onClick={changeCategory}
            categories={authorCategories}
            currentCategory={currentCategory}
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-15 md:gap-30">
            {sclrAuthors.map((author, index) => (
              <Link key={author.title} href={sanitizeSlug(author.uri)}>
                <div key={`${currentCategory}-${index}`}>
                  <FadeInImage
                    src={
                      author.authorMetadatas.avatar?.node
                        ? author.authorMetadatas.avatar.node.sourceUrl
                        : '/avatar.png'
                    }
                    alt={author.title}
                    width={1}
                    height={1}
                  />
                  <h3 className="mt-10 md:mt-20">{author.title}</h3>
                  <p className="text-15 font-soehneLeicht">
                    {author.authorMetadatas.subtitle}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </Layout>
  );
};

SclrContent.propTypes = {
  lang: PropTypes.string,
};

export default SclrContent;
