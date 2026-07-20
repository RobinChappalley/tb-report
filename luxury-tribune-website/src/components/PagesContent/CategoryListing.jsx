/* eslint-disable react-hooks/rules-of-hooks */
import React, { useContext, useEffect, useState } from 'react';
import he from 'he';
import PropTypes from 'prop-types';

import Ad from 'components/Ad';
import FeaturedContent from 'components/FeaturedContent';
import Layout from 'components/Layout';
import PostsWrapper from 'components/PostsWrapper';
import SEO from 'components/SEO/SEO';
import { newsCategories, postsAmount } from 'config/config';
import SiteConfigContext from 'contexts/SiteConfigContext';
import useAds from 'hooks/useAdsCampaign';
import useCategory, { getCategory } from 'hooks/useCategory';
import useFeaturedPost from 'hooks/useFeaturedPost';
import { defaultLng } from 'locales/languages';

const CategoryListing = ({ category, lang }) => {
  const { setContentTranslations } = useContext(SiteConfigContext);

  const isNews = category === newsCategories[lang];
  const [featuredNewsId, setFeaturedNewsId] = useState(null);

  const { data: featuredPostData } = useFeaturedPost({ slug: category });

  const { data } = useCategory({
    slug: category,
    amount: postsAmount.category,
    excluded: null,
  });

  const [loadedPosts, setLoadedPosts] = useState(null);
  const [pageInfo, setPageInfo] = useState(null);

  const ads = useAds({
    area: 'category',
    formats: '970_250',
  });

  // Transform posts to flatten image structure
  const transformPosts = posts =>
    posts.map(post => ({
      ...post,
      featuredImage: post.featuredImage?.node
        ? { sourceUrl: post.featuredImage.node.sourceUrl }
        : null,
    }));

  const loadMorePosts = async () => {
    const newPosts = await getCategory(
      category,
      postsAmount.category,
      [],
      pageInfo.endCursor
    );

    const transformedNewPosts = transformPosts(newPosts.posts.nodes);
    setLoadedPosts([...loadedPosts, ...transformedNewPosts]);
    setPageInfo(newPosts.posts.pageInfo);
  };

  useEffect(() => {
    if (featuredPostData?.nodes[0]) {
      setFeaturedNewsId(featuredPostData?.nodes[0].databaseId);
    }
  }, [featuredPostData]);

  useEffect(() => {
    if (data) {
      setContentTranslations(
        data.translations,
        `${lang === defaultLng ? 'en/' : ''}category/[category]`
      );
    }
  }, [data]);

  useEffect(() => {
    const fetchPosts = async () => {
      const postsWithoutFeaturedNews = await getCategory(
        category,
        postsAmount.category,
        featuredNewsId
      );

      setLoadedPosts(transformPosts(postsWithoutFeaturedNews.posts.nodes));
      setPageInfo(postsWithoutFeaturedNews.posts.pageInfo);
    };

    if (featuredNewsId) {
      fetchPosts();
    }

    if (data?.posts && !featuredNewsId) {
      setLoadedPosts(transformPosts(data.posts.nodes));
      setPageInfo(data.posts.pageInfo);
    }
  }, [data, featuredNewsId]);

  return (
    <Layout>
      {data && (
        <>
          <SEO title={he.decode(data.name)} />

          {ads && ads['970_250'] && (
            <Ad ad={ads['970_250']} format="970_250" area="category" />
          )}

          <div className="container">
            <h1
              className="mt-30 md:mt-0 mx-15 md:mx-10 xl:mx-0 mb-15 md:mb-60"
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{ __html: data.name }}
            />
            {featuredPostData?.nodes[0] && (
              <FeaturedContent featuredPost={featuredPostData?.nodes[0]} />
            )}
            <div className="mt-60">
              <PostsWrapper
                posts={loadedPosts ?? data.posts.nodes}
                pageInfo={pageInfo}
                onMoreClicked={loadMorePosts}
                isNews={isNews}
              />
            </div>
          </div>
        </>
      )}
    </Layout>
  );
};

CategoryListing.propTypes = {
  category: PropTypes.string,
  lang: PropTypes.string,
};

CategoryListing.defaultProps = {
  category: '',
};

export default CategoryListing;
