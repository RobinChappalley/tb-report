/* eslint-disable react-hooks/rules-of-hooks */
import React, { useContext, useEffect, useState } from 'react';
import he from 'he';
import Link from 'next/link';
import PropTypes from 'prop-types';

import Layout from 'components/Layout';
import PostsWrapper from 'components/PostsWrapper';
import SEO from 'components/SEO/SEO';
import { postsAmount } from 'config/config';
import SiteConfigContext from 'contexts/SiteConfigContext';
import useType, { getType } from 'hooks/useType';
import { defaultLng } from 'locales/languages';
import sanitizeUrl, { isLocalLink } from 'utils/sanitizeUrl';

const TypeListing = ({ type, lang }) => {
  const { setContentTranslations } = useContext(SiteConfigContext);

  const { data } = useType({
    slug: type,
    amount: postsAmount.type,
    lng: lang.toUpperCase(),
  });

  const [loadedPosts, setLoadedPosts] = useState(data?.posts?.nodes);
  const [pageInfo, setPageInfo] = useState(data?.posts?.pageInfo);

  // Transform posts to flatten image structure
  const transformPosts = posts =>
    posts.map(post => ({
      ...post,
      featuredImage: post.featuredImage?.node
        ? { sourceUrl: post.featuredImage.node.sourceUrl }
        : null,
    }));

  const loadMorePosts = async () => {
    const newPosts = await getType(type, postsAmount.type, pageInfo.endCursor);

    const transformedNewPosts = transformPosts(newPosts.posts.nodes);
    setLoadedPosts([...loadedPosts, ...transformedNewPosts]);
    setPageInfo(newPosts.posts.pageInfo);
  };

  useEffect(() => {
    if (data) {
      setContentTranslations(
        data.translations,
        `${lang === defaultLng ? 'en/' : ''}'type/[type]'`
      );
      setLoadedPosts(transformPosts(data.posts.nodes));
      setPageInfo(data.posts.pageInfo);
    }
  }, [data]);

  return (
    <Layout>
      {data && (
        <>
          <SEO title={he.decode(data.name)} />
          <div className="container">
            <div className="pb-10 border-b border-solid border-sand-500 md:pb-20 xl:pb-60 mb-30 mx-15 md:mx-10 xl:mx-0">
              {(type === 'academique' || type === 'academic') && (
                <img
                  src="/sclr/sclr.png"
                  alt="Swiss Center for Luxury Research"
                  className="max-w-xs mb-30"
                />
              )}
              <h1
                className="mt-30 md:mt-0 mb-15 md:mb-30"
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{ __html: data.name }}
              />
              <div className="md:w-content">
                {data.description && (
                  <p className="mb-15 md:mb-30">{data.description}</p>
                )}
                {data?.descriptionLink?.link && (
                  <div>
                    {isLocalLink(data.descriptionLink.link?.url) && (
                      <Link
                        href={sanitizeUrl(data.descriptionLink.link.url)}
                        className="tracking-wide uppercase border-b border-solid border-brown-800 font-soehneKraftig text-15"
                      >
                        {data.descriptionLink.link.title}
                      </Link>
                    )}
                    {!isLocalLink(data.descriptionLink.link?.url) && (
                      <a
                        className="tracking-wide uppercase border-b border-solid border-brown-800 font-soehneKraftig text-15"
                        href={sanitizeUrl(data.descriptionLink.link.url)}
                      >
                        {data.descriptionLink.link.title}
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
            <PostsWrapper
              posts={loadedPosts ?? data.posts.nodes}
              pageInfo={pageInfo}
              onMoreClicked={loadMorePosts}
            />
          </div>
        </>
      )}
    </Layout>
  );
};

TypeListing.propTypes = {
  type: PropTypes.string,
  lang: PropTypes.string,
};

export default TypeListing;
