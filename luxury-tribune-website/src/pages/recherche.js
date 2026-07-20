/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable camelcase */
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getPostsSearch } from 'client/client';
import { useRouter } from 'next/router';
import { isEmpty, toUpper } from 'ramda';

import Icon from 'components/Icon';
import Layout from 'components/Layout';
import SEO from 'components/SEO/SEO';
import { postsAmount } from 'config/config';
import SiteConfigContext from 'contexts/SiteConfigContext';
import { defaultLng } from 'locales/languages';
import resolveSearchResultTeaser from 'utils/resolveSearchResultTeaser';

const Search = () => {
  const { query } = useRouter();
  const { setContentTranslations } = useContext(SiteConfigContext);
  const { t, i18n } = useTranslation();
  const [results, setResults] = useState([]);
  const [pageInfo, setPageInfo] = useState(null);
  const [currentQuery, setCurrentQuery] = useState(null);

  const fetchPosts = async () => {
    const isNewSearch = currentQuery !== query.q;

    if (isNewSearch) {
      setCurrentQuery(query.q ?? '');
    }

    const posts = await getPostsSearch({
      search: query.q,
      lng: toUpper(i18n.language),
      amount: postsAmount.search,
      cursor: isNewSearch ? undefined : pageInfo?.endCursor,
    });

    if (posts.posts) {
      setResults(
        isNewSearch
          ? [...posts.posts.nodes]
          : [...results, ...posts.posts.nodes]
      );
      setPageInfo(posts.posts.pageInfo);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [query, i18n]);

  useEffect(() => {
    setContentTranslations(
      [
        {
          language: { slug: 'en' },
          uri: '/en/search',
        },
        {
          language: { slug: 'fr' },
          uri: '/recherche',
        },
      ],
      i18n.language === defaultLng ? 'en/search' : 'recherche'
    );
  }, []);

  return (
    <Layout>
      <SEO title={t('search.page_title')} />
      <div className="mx-15 md:mx-0 mt-30 md:mt-50">
        <div className="content-container">
          <h1 className="flex flex-col items-center mb-30">
            <span className="font-soehneKraftig uppercase text-15 leading-20 tracking-wide text-brown-800">
              Résultats pour
            </span>
            <span className="text-46 leading-56 font-cambon tracking-tightest">{`“${currentQuery}”`}</span>
          </h1>
          <div className="header-mobile-search">
            <form className="relative">
              <input
                className="input-text w-full input-search"
                name="q"
                defaultValue={currentQuery}
                type="text"
                placeholder={t('header.searchForm.placeholder')}
                aria-label={t('header.searchForm.label')}
              />
              <button
                type="submit"
                aria-label={t('header.searchForm.submit')}
                className="absolute flex items-start justify-center h-full inset-y-0 right-0 pl-10 pr-20"
              >
                <Icon name="search" />
              </button>
            </form>
          </div>
        </div>
        {!isEmpty(results) && (
          <div className="mt-60">
            <div className="figure-large">
              <div className="border-b border-solid border-sand-500">
                {results
                  .map(resolveSearchResultTeaser(i18n.language))
                  .map(({ post, author, component }, i) => (
                    <div
                      key={`result-${i}`}
                      className="py-15 md:py-30 border-t border-solid border-sand-500"
                    >
                      {React.createElement(component, {
                        post,
                        author,
                      })}
                    </div>
                  ))}
              </div>
              {pageInfo && pageInfo.hasNextPage && (
                <button
                  type="button"
                  className="mt-30 mx-auto !block btn btn-normal btn-secondary"
                  onClick={fetchPosts}
                >
                  {t('more_posts')}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Search;
