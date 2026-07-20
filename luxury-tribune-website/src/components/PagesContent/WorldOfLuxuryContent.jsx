/* eslint-disable react/no-danger */
import React, { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import he from 'he';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { toUpper } from 'ramda';

import Icon from 'components/Icon/Icon';
import Layout from 'components/Layout';
import SEO from 'components/SEO/SEO';
import SocialShare from 'components/SocialShare';
import RelatedStories from 'components/Stories/RelatedStories';
import SiteConfigContext from 'contexts/SiteConfigContext';
import useWorldsOfLuxury from 'hooks/useStory';
import { defaultLng } from 'locales/languages';
import gtm from 'services/google-tag-manager';
import getVideoId from 'utils/getVideoId';

const WorldOfLuxuryContent = ({ slug, lang }) => {
  const { data } = useWorldsOfLuxury({ slug, lng: toUpper(lang) });
  const { setContentTranslations } = useContext(SiteConfigContext);
  const { t } = useTranslation();
  const { asPath } = useRouter();

  const handleFullscreen = () => {
    const fullscreenModal = document.getElementById('fullscreenModal');
    if (fullscreenModal) {
      fullscreenModal.classList.toggle('hidden');
      document.querySelector('body').classList.toggle('overflow-hidden');
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        handleFullscreen();
      }
    });

    const modalFullscreen = document.getElementById('fullscreenModal');
    if (modalFullscreen) {
      modalFullscreen.addEventListener('click', handleFullscreen);
    }

    return () => {
      document.removeEventListener('keydown', e => {
        if (e.key === 'Escape') {
          handleFullscreen();
        }
      });

      if (modalFullscreen) {
        modalFullscreen.removeEventListener('click', handleFullscreen);
      }
    };
  }, []);

  useEffect(() => {
    if (data) {
      gtm.dl({
        content_type: 'mondes du luxe',
      });
      gtm.event('PageView', {
        page_path: asPath,
        page_title: data.title,
      });
    }
  }, [asPath, data]);

  useEffect(() => {
    if (data) {
      setContentTranslations(
        data.translations,
        `${lang === defaultLng ? 'en/' : ''}stories/[slug]`
      );
    }
  }, [data]);

  return (
    <Layout>
      {data && data?.story && (
        <>
          <SEO
            title={he.decode(data.title)}
            image={data?.story?.image?.sourceUrl}
          />
          <div className="mx-15 md:mx-0">
            <div className="container !mt-30 md:!mt-50 ">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-30">
                <div>
                  <span
                    className="mb-5 uppercase text-orange font-soehneKraftig text-15 leading-20"
                    dangerouslySetInnerHTML={{
                      __html: data.story?.location ?? '',
                    }}
                  />
                  <h1
                    className="tracking-tight mb-30 text-30 leading-40"
                    dangerouslySetInnerHTML={{
                      __html: data.title ?? '',
                    }}
                  />
                  <div
                    className="text-19 leading-26"
                    dangerouslySetInnerHTML={{
                      __html: data.story.description ?? '',
                    }}
                  />
                  <div className="container !mt-50">
                    <p className="tracking-wide uppercase font-soehneKraftig text-15 leading-22">
                      {t('post.share')}
                    </p>
                    <SocialShare
                      host={
                        typeof window !== 'undefined'
                          ? window.location.host
                          : ''
                      }
                      contentType="mondesDuLuxe"
                      title={data.title}
                    />
                  </div>
                </div>

                <div className="lg:col-span-2">
                  <div
                    className={clsx(
                      'mx-auto',
                      data?.story?.imageFormat === 'portrait'
                        ? 'lg:w-[62.5%]'
                        : 'w-full'
                    )}
                  >
                    {/* Video */}
                    {data?.story?.youtubeUrl && (
                      <div
                        className={clsx(
                          'relative',
                          data?.story?.imageFormat === 'portrait'
                            ? 'aspect-[9/16]'
                            : 'aspect-video'
                        )}
                      >
                        <iframe
                          src={`https://www.youtube.com/embed/${getVideoId(
                            data?.story?.youtubeUrl
                          )}?controls=1&disablekb=1&modestbranding=1&rel=0`}
                          title={data.title}
                          className="absolute inset-0 w-full h-full"
                          referrerPolicy="strict-origin-when-cross-origin"
                          allowFullScreen
                        />
                      </div>
                    )}

                    {/* Image */}
                    {!data?.story?.youtubeUrl && (
                      <figure className="relative w-full">
                        <img
                          src={data?.story?.image?.sourceUrl}
                          alt={data.title}
                          className="w-full"
                        />
                        <button
                          type="button"
                          id="viewFullscreenButton"
                          onClick={handleFullscreen}
                          aria-controls="fullscreenModal"
                          aria-label={t('stories.view_fullscreen')}
                          className="absolute inset-0"
                        >
                          <div className="relative h-full">
                            <div className="absolute top-0 left-0 flex justify-end w-full text-white button-fullscreen">
                              <Icon name="screen-full" />
                            </div>
                          </div>
                        </button>
                      </figure>
                    )}

                    {/* Sponsorship & Copyright */}
                    {((data.sponsorship?.sponsored &&
                      data.sponsorship?.sponsor) ||
                      data.story?.copyright) && (
                      <div className="mt-10 text-15 leading-22 font-soehneLeicht">
                        {data.sponsorship?.sponsored &&
                          data.sponsorship?.sponsor && (
                            <p className="font-soehneLeicht text-15 leading-22">
                              {`${t('stories.sponsored')} `}
                              {data.sponsorship?.sponsorlink && (
                                <a
                                  href={data.sponsorship?.sponsorlink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="tracking-wider uppercase font-soehneKraftig"
                                >
                                  {data.sponsorship?.sponsor}
                                </a>
                              )}
                              {!data.sponsorship?.sponsorlink && (
                                <span className="tracking-wider uppercase font-soehneKraftig">
                                  {data.sponsorship?.sponsor}
                                </span>
                              )}
                            </p>
                          )}
                        {data.story?.copyright && (
                          <p className="text-15 leading-22 font-soehneLeicht">
                            {t(
                              data?.story?.youtubeUrl
                                ? 'stories.copyright_video'
                                : 'stories.copyright',
                              {
                                credit: data.story?.copyright,
                              }
                            )}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {/* Image fullscreen */}
              {!data?.story?.youtubeUrl && (
                <div
                  className="fixed inset-0 z-50 hidden w-screen h-screen bg-black"
                  id="fullscreenModal"
                >
                  <div className="relative flex items-center justify-center h-full">
                    <img
                      src={data?.story?.image?.sourceUrl}
                      alt={data.title}
                      className="w-auto h-full"
                    />
                    <button
                      type="button"
                      id="exitFullscreenButton"
                      className="absolute top-0 right-0 text-white button-fullscreen"
                      aria-controls="fullscreenModal"
                      aria-label={t('stories.exit_fullscreen')}
                    >
                      <Icon name="screen-reduce" />
                    </button>
                  </div>
                </div>
              )}
            </div>
            {data?.date && <RelatedStories date={data.date} />}
          </div>
        </>
      )}
    </Layout>
  );
};

WorldOfLuxuryContent.propTypes = {
  slug: PropTypes.string,
  lang: PropTypes.string,
};

export default WorldOfLuxuryContent;
