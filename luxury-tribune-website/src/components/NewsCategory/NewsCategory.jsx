import React, { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import PropTypes from 'prop-types';

import Icon from 'components/Icon';
import NewsTeaser from 'components/Teaser/NewsTeaser';
import { newsCategories } from 'config/config';
import SiteConfigContext from 'contexts/SiteConfigContext';
import { defaultLng } from 'locales/languages';
import sanitizeSlug from 'utils/sanitizeSlug';

const NewsCategory = ({ data, lng }) => {
  const { t, i18n } = useTranslation();
  const { setContentTranslations } = useContext(SiteConfigContext);

  // Transform posts to flatten image structure
  const transformPosts = posts =>
    posts.map(post => ({
      ...post,
      featuredImage: post.featuredImage?.node
        ? { sourceUrl: post.featuredImage.node.sourceUrl }
        : post.featuredImage || null,
    }));

  useEffect(() => {
    setContentTranslations(
      data.translations,
      `${i18n.language === defaultLng ? 'en/' : ''}category/[category]`
    );
  }, [data]);

  return (
    <div className="px-15 xl:px-0">
      <div className="flex items-center justify-between mb-25">
        <div className="flex items-center">
          <span
            aria-hidden="true"
            className="bg-orange  rounded-full block"
            style={{ width: '15px', height: '15px', marginRight: '3px' }}
          />
          <h2
            className="text-brown-800 text-18 leading-20 uppercase tracking-wide font-soehneKraftig"
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: data.name }}
          />
        </div>
        <Link
          href={`${lng === defaultLng ? '' : `/en`}/category${sanitizeSlug(
            newsCategories[lng]
          )}`}
          className="group"
        >
          <span
            className="font-soehneLeicht text-15 leading-22 text-brown-800 border-b border-transparent border-solid group-hover:border-brown-800 transition-all"
            style={{ marginRight: '4px' }}
          >
            {t('news.listing_cta')}
          </span>
          <span className="text-orange">
            <Icon name="arrow" className="!text-11" />
          </span>
        </Link>
      </div>
      <div className="grid md:grid-cols-4 gap-15 md:gap-30">
        {transformPosts(data?.posts.nodes || []).map(post => (
          <NewsTeaser key={post.title} post={post} />
        ))}
      </div>
    </div>
  );
};

NewsCategory.propTypes = {
  data: PropTypes.object,
  lng: PropTypes.string,
};

export default NewsCategory;
