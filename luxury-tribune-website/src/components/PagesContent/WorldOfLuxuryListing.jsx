import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Masonry from 'react-masonry-css';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';

import Layout from 'components/Layout';
import SEO from 'components/SEO/SEO';
import StoryTeaser from 'components/StoryTeaser';
import SiteConfigContext from 'contexts/SiteConfigContext';
import useWorldsOfLuxuries, { getWorldsOfLuxuries } from 'hooks/useStories';
import { defaultLng } from 'locales/languages';
import gtm from 'services/google-tag-manager';

const WorldOfLuxurylisting = ({ lang }) => {
  const { setContentTranslations } = useContext(SiteConfigContext);
  const { t } = useTranslation();
  const { asPath } = useRouter();
  const { data } = useWorldsOfLuxuries({ length: 15, lng: lang.toUpperCase() });

  const [loadedStories, setLoadedStories] = useState(data?.edges);
  const [pageInfo, setPageInfo] = useState(data?.pageInfo);

  const loadMorePosts = async () => {
    const newStories = await getWorldsOfLuxuries(
      15,
      lang.toUpperCase(),
      pageInfo.endCursor
    );

    setLoadedStories([...loadedStories, ...newStories.edges]);
    setPageInfo(newStories.pageInfo);
  };

  useEffect(() => {
    setLoadedStories(data?.edges);
    setPageInfo(data?.pageInfo);
  }, [data]);

  useEffect(() => {
    gtm.dl({
      content_type: 'mondes du luxe',
    });
    gtm.event('PageView', {
      page_path: asPath,
      page_title: 'Mondes du Luxe',
    });
  }, [asPath]);

  useEffect(() => {
    setContentTranslations(
      [
        {
          language: { slug: 'en' },
          uri: '/en/worlds-of-luxury',
        },
        {
          language: { slug: 'fr' },
          uri: '/mondes-du-luxe',
        },
      ],
      lang === defaultLng ? 'en/worlds-of-luxury' : 'mondes-du-luxe'
    );
  }, []);

  return (
    <Layout>
      <SEO title={t('stories.title')} />
      <div className="container">
        <div className="pb-20 border-b border-solid mx-15 xl:mx-0 md:pb-60 mb-15 md:mb-30 mt-60 border-sand-500">
          <h1 className="text-46 leading-56 font-cambon tracking-tightest">
            {t('stories.title')}
          </h1>
        </div>
        {loadedStories && (
          <div className="px-15 xl:px-0">
            <Masonry
              breakpointCols={{
                default: 3,
                1023: 2,
                767: 1,
              }}
              className="my-masonry-grid"
              columnClassName="my-masonry-grid_column"
            >
              {loadedStories.map(({ node }, i) =>
                React.createElement(StoryTeaser, {
                  key: i,
                  story: node,
                })
              )}
            </Masonry>
            {pageInfo.hasNextPage && (
              <button
                type="button"
                className="mt-30 mx-auto !block btn btn-normal btn-secondary"
                onClick={loadMorePosts}
              >
                {t('more_posts')}
              </button>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

WorldOfLuxurylisting.propTypes = {
  lang: PropTypes.string,
};

export default WorldOfLuxurylisting;
