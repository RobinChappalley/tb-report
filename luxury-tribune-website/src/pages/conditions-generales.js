import React, { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import he from 'he';
import { isNil, pipe } from 'ramda';

import Lead from 'components/blocks/Lead';
import Layout from 'components/Layout';
import Page from 'components/Page';
import SEO from 'components/SEO/SEO';
import SiteConfigContext from 'contexts/SiteConfigContext';
import useSpecificPage, { prefetchSpecificPage } from 'hooks/useSpecificPage';
import { defaultLng } from 'locales/languages';
import extractFirstLead from 'utils/extractFirstLead';
import handleFootnotesAnchors from 'utils/handleFootnotesAnchors';
import prefetch from 'utils/prefetch';

const slugs = {
  fr: 'conditions-generales',
  en: 'en/terms-conditions',
};
const getSlug = (lng = defaultLng) => slugs[lng];

const TermsAndCondition = () => {
  const { setContentTranslations } = useContext(SiteConfigContext);
  const { i18n } = useTranslation();
  const { data } = useSpecificPage(getSlug(i18n.language));

  useEffect(() => {
    if (data) {
      setContentTranslations(data.translations, getSlug(i18n.language));
    }
  }, [data]);

  return (
    <Layout>
      {data && (
        <>
          <SEO title={he.decode(data.title)} />
          <div className="mx-15 md:mx-0">
            <div className="content-container !mt-30 md:!mt-50 flow-root">
              {/* eslint-disable-next-line react/no-danger */}
              <h1 dangerouslySetInnerHTML={{ __html: data.title }} />
              {data.lead && <Lead lead={data.lead.lead} />}
            </div>
          </div>
          <Page
            content={pipe(extractFirstLead, handleFootnotesAnchors)(data)}
            withoutTitle
          />
        </>
      )}
    </Layout>
  );
};

export const getStaticProps = async () => {
  const prefetchQueries = [];
  Object.keys(slugs).forEach(key =>
    prefetchQueries.push(prefetchSpecificPage(slugs[key]))
  );
  const dehydratedState = await prefetch(prefetchQueries);
  return isNil(dehydratedState)
    ? { notFound: true, revalidate: 60 }
    : { props: { dehydratedState }, revalidate: 30 };
};

export default TermsAndCondition;
