import React, { useEffect, useState } from 'react';
import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { getSiteConfig } from 'client/client';
import i18next from 'i18next';
// eslint-disable-next-line import/order
import Router, { useRouter } from 'next/router';
import NProgress from 'nprogress';
import PropTypes from 'prop-types';

import Alert from 'components/Alert';
import SiteConfigContext from 'contexts/SiteConfigContext';
import getLang from 'utils/getLang';
import sanitizeSlug from 'utils/sanitizeSlug';

import 'locales/i18n';

import 'styles/globals.css';
import 'styles/fonts.css';
/* Outside libs */
import 'flickity/dist/flickity.min.css';
import 'flickity-fullscreen/fullscreen.css';
/* General styling */
import 'styles/button.css';
import 'styles/card.css';
import 'styles/modal-style.css';
import 'styles/nprogress.css';
/* Components */
import 'components/Alert/Alert.styles.css';
import 'components/Calendar/Calendar.styles.css';
import 'components/CookieBanner/CookieBanner.styles.css';
import 'components/FadeInImage/FadeInImage.styles.css';
import 'components/FeaturedCategory/FeaturedCategory.styles.css';
import 'components/FeaturedContent/FeaturedContent.styles.css';
import 'components/FilterAuthor/FilterAuthor.styles.css';
import 'components/Header/Header.styles.css';
import 'components/Icon/Icon.styles.css';
import 'components/LangSelector/LangSelector.styles.css';
import 'components/PostsWrapper/PostsWrapper.styles.css';
import 'components/SocialBar/SocialBar.styles.css';
import 'components/SocialShare/SocialShare.styles.css';
import 'components/StoryModal/StoryModal.styles.css';
import 'components/Subscription/Subscription.styles.css';
import 'components/SubscriptionForm/SubscriptionForm.styles.css';
import 'components/Teaser/EventHomepageTeaser.styles.css';
import 'components/Teaser/Stories.styles.css';
import 'components/Teaser/Teaser.styles.css';
/* Blocks */
import 'components/blocks/DigitalProduct/DigitalProduct.styles.css';
import 'components/blocks/Embed/Embed.styles.css';
import 'components/blocks/Footnotes/Footnotes.styles.css';
import 'components/blocks/Gallery/Gallery.styles.css';
import 'components/blocks/Image/Image.styles.css';
import 'components/blocks/KeyNumbers/KeyNumbers.styles.css';
import 'components/blocks/List/List.styles.css';
import 'components/blocks/Newsletter/Newsletter.styles.css';
import 'components/blocks/Paywall/Paywall.styles.css';
import 'components/blocks/Quote/Quote.styles.css';
import 'components/blocks/RelatedLink/RelatedLink.styles.css';
import 'components/blocks/StudyLink/StudyLink.styles.css';
import 'components/blocks/Text/Text.styles.css';

// Remove query params from next's useRouter() asPath
const getPathname = asPath => {
  // We don't need the host (2nd argument) since we only care about the pathname
  const { pathname } = new URL(asPath, 'https://doesnt.matter');

  return pathname;
};

NProgress.configure({ showSpinner: false });
Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

const queryClient = new QueryClient();

queryClient.setDefaultOptions({
  queries: {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  },
});

const LuxuryTribuneApp = ({ Component, pageProps }) => {
  const { asPath } = useRouter();
  const [siteConfig, setSiteConfig] = useState(null);
  const [translations, setTranslations] = useState({});
  const [alertMessage, setAlertMessage] = useState(null);

  useEffect(() => {
    i18next.changeLanguage(getLang(asPath));
  }, [asPath]);

  useEffect(() => {
    const fetchSiteConfig = async () => {
      await getSiteConfig().then(data => {
        setSiteConfig(data);
      });
    };

    fetchSiteConfig();
  }, []);

  const setContentTranslations = (trans, href) => {
    // Edge case where the content translation is trashed, graphQL returns [null] instead of []
    const sanitizedTranslations = trans[0] === null ? [] : trans;
    setTranslations(
      sanitizedTranslations.reduce(
        (acc, { uri }) => ({
          ...acc,
          [uri.includes('/en/') ? 'en' : 'fr']: {
            href,
            asPath: sanitizeSlug(uri),
          },
        }),
        {}
      )
    );
  };

  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <SiteConfigContext.Provider
          value={{
            ...siteConfig,
            translations,
            setContentTranslations,
            alertMessage,
            setAlertMessage,
          }}
        >
          {alertMessage && (
            <Alert
              handleClose={() => setAlertMessage(null)}
              message={alertMessage.message}
              type={alertMessage.type}
            />
          )}

          <Component key={getPathname(asPath)} {...pageProps} />
        </SiteConfigContext.Provider>
      </Hydrate>
    </QueryClientProvider>
  );
};

LuxuryTribuneApp.propTypes = {
  Component: PropTypes.func,
  pageProps: PropTypes.object,
};

export default LuxuryTribuneApp;
