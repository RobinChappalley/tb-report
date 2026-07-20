import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import { isNil, toUpper } from 'ramda';

import Ad from 'components/Ad';
import FeaturedCategory from 'components/FeaturedCategory';
import FeaturedContent from 'components/FeaturedContent';
import Icon from 'components/Icon';
import JSONLD from 'components/JSONLD';
import Layout from 'components/Layout';
import NewsCategory from 'components/NewsCategory/NewsCategory';
import PostsWrapper from 'components/PostsWrapper';
import SEO from 'components/SEO/SEO';
import EventHomepageTeaser from 'components/Teaser/EventHomepageTeaser';
import StoriesTeasers from 'components/Teaser/StoriesTeasers';
import {
  featuredCategories,
  newsCategories,
  postsAmount,
  tribuneCategories,
} from 'config/config';
import SiteConfigContext from 'contexts/SiteConfigContext';
import useAds from 'hooks/useAdsCampaign';
import useHomepage, { getPosts } from 'hooks/useHomepage';
import gtm from 'services/google-tag-manager';

// eslint-disable-next-line react/prop-types
const HomePageContent = ({ lang }) => {
  const { setContentTranslations, seo } = useContext(SiteConfigContext);
  const { asPath } = useRouter();
  const { t } = useTranslation();
  const { data } = useHomepage({
    lng: lang,
    tribuneCategory: tribuneCategories[lang],
    newsCategory: newsCategories[lang],
    featuredCategories,
    amountStories: postsAmount.stories,
  });

  const ads = useAds({
    area: 'home',
    formats: '970_250,480_320,9_16',
  });

  const [loadedPosts, setLoadedPosts] = useState(null);
  const [pageInfo, setPageInfo] = useState(null);

  // Transform posts to flatten image structure
  const transformPosts = posts =>
    posts.map(post => ({
      ...post,
      featuredImage: post.featuredImage?.node
        ? { sourceUrl: post.featuredImage.node.sourceUrl }
        : null,
    }));

  const loadMorePosts = async () => {
    const newPosts = await getPosts({
      amount: postsAmount.homeLoadMore,
      lng: toUpper(lang),
      excluded: data.excluded,
      excludedCategory: data?.excludedCategoryId,
      cursor: pageInfo.endCursor,
    });

    const transformedNewPosts = transformPosts(newPosts.posts.nodes);
    setLoadedPosts([...loadedPosts, ...transformedNewPosts]);
    setPageInfo(newPosts.posts.pageInfo);
  };

  useEffect(() => {
    setContentTranslations([], '');

    if (data?.posts) {
      setLoadedPosts(transformPosts(data?.posts.nodes));
      setPageInfo(data?.posts.pageInfo);
    }
  }, [data]);

  useEffect(() => {
    gtm.dl({
      content_type: 'homepage',
    });
    gtm.event('PageView', {
      page_path: asPath,
      page_title: t('homepage.seo_title'),
    });
  }, [asPath]);

  return (
    <Layout>
      <SEO
        title={t('homepage.seo_title')}
        metas={{
          metaDesc: t('homepage.seo_description'),
        }}
      />

      {ads && ads['970_250'] && (
        <Ad ad={ads['970_250']} format="970_250" area="home" />
      )}

      <div className="container">
        {!isNil(data?.pinnedEvent) && (
          <EventHomepageTeaser event={data.pinnedEvent} />
        )}
        {data?.featuredContent && (
          <FeaturedContent
            featuredPost={data.featuredContent.featuredPost}
            lastTribune={data.featuredContent.lastTribune}
            ad={ads && ads['480_320']}
          />
        )}
      </div>

      {data?.featuredContent?.featuredBrief[lang]?.active && (
        <div className="py-40 bg-sand-300 my-60 md:mt-100 md:mb-80 md:py-80">
          <div className="container">
            <div className="px-15 xl:px-0">
              <div className="uppercase text-15 text-orange">
                <Icon name="folder" className="mr-10 text-15 md:text-18" />
                <span className="font-soehneKraftig">
                  {data.featuredContent.featuredBrief[lang].sectionTitle}
                </span>
              </div>
              <h2 className="flex items-center mb-20 uppercase border-b md:mb-25 pb-15 border-sand-500">
                {data.featuredContent.featuredBrief[lang].title}
              </h2>
            </div>
            <PostsWrapper
              posts={data.featuredContent.featuredBrief[lang].posts}
              mini={
                data.featuredContent.featuredBrief[lang].posts?.length === 4
              }
            />
          </div>
        </div>
      )}

      {data?.news?.posts.nodes && (
        <div className="bg-sand-500">
          <div className="container py-40">
            <NewsCategory data={data.news} lng={lang} />
          </div>
        </div>
      )}
      {data?.featuredCategories?.business && (
        <div className="container !my-40 md:!my-80">
          <FeaturedCategory
            category={data.featuredCategories.business}
            icon="pie-chart"
          />
        </div>
      )}
      {data?.stories && (
        <div className="overflow-hidden bg-sand-300">
          <div className="container py-40 md:py-80">
            <StoriesTeasers stories={data.stories} ad={ads && ads['9_16']} />
          </div>
        </div>
      )}
      {data?.featuredCategories?.style && (
        <div className="container !my-40 md:!my-80">
          <FeaturedCategory
            category={data.featuredCategories.style}
            icon="luggage"
          />
        </div>
      )}
      {data?.featuredCategories?.sustainability && (
        <div className="container !my-40 md:!my-80">
          <FeaturedCategory
            category={data.featuredCategories.sustainability}
            icon="leaf"
          />
        </div>
      )}
      {loadedPosts && (
        <div className="container">
          <div className="pb-10 border-b border-solid mx-15 xl:mx-0 md:pb-20 mb-15 md:mb-30 mt-60 border-sand-500">
            <p className="tracking-wide uppercase font-soehneKraftig text-19 leading-28">
              {t('last_posts')}
            </p>
          </div>
          <PostsWrapper
            posts={loadedPosts}
            pageInfo={pageInfo}
            onMoreClicked={loadMorePosts}
          />
        </div>
      )}
      <JSONLD
        data={{
          '@type': 'Organization',
          '@id': 'https://www.luxurytribune.com/',
          name: 'Luxury Tribune',
          logo: seo?.schema?.companyLogo?.sourceUrl,
          image: seo?.schema?.companyLogo?.sourceUrl,
          sameAs: [
            'https://www.facebook.com/LuxuryTribune/',
            'https://www.instagram.com/luxury_tribune/',
            'https://www.linkedin.com/company/luxury-tribune/',
          ],
          address: {
            '@type': 'PostalAddress',
            streetAddress: 'Avenue Charles Ferdinand Ramuz 60',
            addressLocality: 'Pully',
            postalCode: '1009',
            addressCountry: 'Suisse',
          },
          email: 'contact@luxurytribune.com',
        }}
      />
    </Layout>
  );
};

export default HomePageContent;
