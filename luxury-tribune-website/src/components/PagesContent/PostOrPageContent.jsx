/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable camelcase */
import React, { useContext, useEffect, useState } from 'react';
import he from 'he';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { isNil, pipe, pluck } from 'ramda';

import JSONLD from 'components/JSONLD';
import Layout from 'components/Layout';
import Page from 'components/Page';
import Post from 'components/Post';
import SEO from 'components/SEO/SEO';
import { postsAmount } from 'config/config';
import SiteConfigContext from 'contexts/SiteConfigContext';
import usePageOrPost from 'hooks/usePostOrPage';
import { getRelatedPosts } from 'hooks/useRelatedPosts';
import { defaultLng } from 'locales/languages';
import detectSearchEngine from 'utils/detectSearchEngine';
import extractFirstLead from 'utils/extractFirstLead';
import handleFootnotesAnchors from 'utils/handleFootnotesAnchors';
import resolveCategory from 'utils/resolveCategory';

const PostOrPageContent = ({ slug, lang }) => {
  const { data } = usePageOrPost(slug);

  const [isSearchEngine, setIsSearchEngine] = useState(undefined);

  const { setContentTranslations, seo } = useContext(SiteConfigContext);
  const { asPath } = useRouter();

  useEffect(() => {
    if (data?.post && data.post.related?.posts?.nodes?.length !== 2) {
      const existingRelated = data.post?.related?.posts?.nodes || [];
      const fetchRelatedPosts = async () => {
        const relatedPostsData = await getRelatedPosts(
          postsAmount.related - existingRelated.length,
          resolveCategory(data.post.categories.nodes)?.databaseId,
          [data.post.databaseId, ...pluck('databaseId', existingRelated)]
        );
        return relatedPostsData;
      };
      fetchRelatedPosts().then(d => {
        data.post.related.posts.nodes = [...existingRelated, ...d.posts.nodes];
      });
    }
  }, [data]);

  useEffect(() => {
    if (data?.post) {
      setContentTranslations(
        data.post.translations,
        `${lang === defaultLng ? 'en/' : ''}[slug]`
      );
    }

    if (data?.page) {
      setContentTranslations(
        data.page.translations,
        `${lang === defaultLng ? 'en/' : ''}[slug]`
      );
    }
  }, [data]);

  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      setIsSearchEngine(detectSearchEngine(navigator.userAgent));
    }
  }, []);

  return (
    <Layout>
      {data?.post && (
        <>
          <SEO
            title={data.post ? he.decode(data.post.title) : ''}
            noPageViewEvent
            metas={{
              ...data.post?.seo,
              metaRobotsNoindex: [
                'merci',
                'thank-you',
                'confirmed',
                'confirmation',
              ].includes(data.post?.slug)
                ? 'noindex'
                : 'index',
            }}
            image={data.post?.featuredImage?.node?.sourceUrl}
          />
          <Post
            content={pipe(extractFirstLead, handleFootnotesAnchors)(data.post)}
            host={typeof window !== 'undefined' ? window.location.host : ''}
            // eslint-disable-next-line camelcase
            author={data.post?.postAuthors?.author?.[0]}
            isSearchEngine={isSearchEngine}
          />
          <JSONLD
            data={{
              '@type': 'Article',
              mainEntityOfPage: `https://www.luxurytribune.com${asPath}`,
              name: data.post.title,
              headline: data.post.title,
              editor: 'Luxury Tribune',
              publisher: {
                '@type': 'Organization',
                '@id': 'https://www.luxurytribune.com/',
                name: 'Luxury Tribune',
                url: 'https://www.luxurytribune.com/',
                logo: {
                  '@type': 'ImageObject',
                  url: seo?.schema?.companyLogo?.sourceUrl,
                },
              },
              image: data.post?.featuredImage?.node?.sourceUrl,
              author: {
                '@type': !isNil(data.post?.postAuthors?.author?.[0]?.title)
                  ? 'Person'
                  : 'Organization',
                name:
                  data.post?.postAuthors?.author?.[0]?.title ??
                  'Luxury Tribune',
              },
              description: data.post?.excerpt?.replace(/<\/?[^>]+(>|$)/g, ''),
              datePublished: data.post?.dateGmt,
              dateCreated: data.post?.dateGmt,
              dateModified: data.post?.modifiedGmt,
              isAccessibleForFree: !data.post?.premium?.isPremium,
              hasPart: {
                '@type': 'WebPageElement',
                isAccessibleForFree: !data.post?.premium?.isPremium,
                cssSelector: '.paywall',
              },
            }}
          />
        </>
      )}
      {data?.page && (
        <>
          <SEO
            title={data.page ? he.decode(data.page.title) : ''}
            noPageViewEvent={false}
            metas={{
              ...data.page?.seo,
              metaRobotsNoindex: [
                'merci',
                'thank-you',
                'confirmed',
                'confirmation',
              ].includes(data.page?.slug)
                ? 'noindex'
                : 'index',
            }}
            image={data.page?.featuredImage?.node?.sourceUrl}
          />
          <Page
            content={pipe(extractFirstLead, handleFootnotesAnchors)(data.page)}
          />
        </>
      )}
    </Layout>
  );
};

PostOrPageContent.propTypes = {
  slug: PropTypes.string,
  lang: PropTypes.string,
};

export default PostOrPageContent;
