/* eslint-disable react-hooks/rules-of-hooks */
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import he from 'he';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';

import Author from 'components/Author';
import Layout from 'components/Layout';
import PostsWrapper from 'components/PostsWrapper';
import SEO from 'components/SEO/SEO';
import { postsAmount } from 'config/config';
import SiteConfigContext from 'contexts/SiteConfigContext';
import useAuthor, { getAuthor } from 'hooks/useAuthor';
import { defaultLng } from 'locales/languages';
import gtm from 'services/google-tag-manager';

const AuthorContent = ({ authors, lang }) => {
  const { setContentTranslations } = useContext(SiteConfigContext);
  const { t } = useTranslation();
  const { asPath } = useRouter();

  const { data } = useAuthor({
    slug: authors,
    amount: postsAmount.category,
    lng: lang.toUpperCase(),
  });

  const [loadedPosts, setLoadedPosts] = useState(null);
  const [pageInfo, setPageInfo] = useState(null);

  const loadMorePosts = async () => {
    const newPosts = await getAuthor(
      authors,
      postsAmount.category,
      pageInfo.endCursor,
      lang.toUpperCase()
    );

    setLoadedPosts([...loadedPosts, ...newPosts?.posts?.nodes]);
    setPageInfo(newPosts?.posts?.pageInfo);
  };

  useEffect(() => {
    if (data) {
      setContentTranslations(
        data.author.translations,
        `${lang === defaultLng ? 'en/' : ''}authors/[...slug]`
      );

      setLoadedPosts(data.posts?.nodes);
      setPageInfo(data.posts?.pageInfo);
    }
  }, [data]);

  useEffect(() => {
    if (data?.author) {
      gtm.dl({
        content_type: 'author',
      });
      gtm.event('PageView', {
        page_path: asPath,
        page_title: data.author.title,
      });
    }
  }, [asPath, data]);

  return (
    <Layout>
      {data?.author && (
        <>
          <SEO title={he.decode(data.author.title)} metas={data.author?.seo} />
          <Author content={data.author} />
          {((loadedPosts && loadedPosts.length > 0) ||
            (data.posts?.nodes && data.posts?.nodes.length > 0)) && (
            <div className="container">
              <h3
                className="pb-20 tracking-wide uppercase border-b mt-80 border-sand-500 font-soehneKraftig text-19 leading-26"
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{
                  __html: `${t('author.articles.title', {
                    name: data.author.title,
                  })}`,
                }}
              />
              <div className="mt-30">
                <PostsWrapper
                  posts={loadedPosts ?? data.posts?.nodes}
                  pageInfo={pageInfo}
                  onMoreClicked={loadMorePosts}
                />
              </div>
            </div>
          )}
        </>
      )}
    </Layout>
  );
};

AuthorContent.propTypes = {
  authors: PropTypes.string,
  lang: PropTypes.string,
};

export default AuthorContent;
