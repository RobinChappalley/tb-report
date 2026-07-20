/* eslint-disable react/no-danger */
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Modal from 'react-modal';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { isNil } from 'ramda';

import { AdLegend } from 'components/Ad/Ad';
import { defaultLng } from 'locales/languages';
import gtm from 'services/google-tag-manager';
import getVideoId from 'utils/getVideoId';

import { theme } from '../../../tailwind.config';
import Icon from '../Icon';

/* Import has to be done this way, otherwise it bugs if rendered from server-side. */
// https://github.com/metafizzy/flickity/issues/353#issuecomment-585317215
const Flickity =
  typeof window !== 'undefined' ? require('flickity-fullscreen') : () => null;

const ModalStory = ({ stories, ad, handleCloseModal, isOpen, index }) => {
  const flkty = useRef(null);
  const { t, i18n } = useTranslation();
  const [isSelectedSlide, setIsSelectedSlide] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [storiesWithPotentielAd, setStoriesWithPotentielAd] = useState(stories);

  useEffect(() => {
    if (ad) {
      const fakeAdStory = {
        isAd: true,
        title: ad.modal.title,
        sponsorship: {
          sponsored: !!ad.modal.sponsorship?.name,
          sponsor: ad.modal.sponsorship?.name,
          sponsorlink: ad.modal.sponsorship?.url,
        },
        story: {
          copyright: ad.modal.copyright,
          description: ad.modal.description,
          image: {
            sourceUrl: ad.modal.image,
          },
          location: ad.modal.location,
        },
      };
      setStoriesWithPotentielAd([fakeAdStory, ...stories]);
    } else {
      setStoriesWithPotentielAd(stories);
    }
  }, [ad, stories]);

  useEffect(() => {
    Modal.setAppElement('#stories');
  }, [isOpen]);

  const afterOpenModal = () => {
    const el = document.querySelector('#sliderModalStories');
    if (isOpen && el) {
      setIsMobile(window.innerWidth <= 768);

      // Prevent an ugly scroll to top when opening the modal
      document.body.setAttribute(
        'style',
        `position: fixed; top: -${window.scrollY}px; left: 0; right: 0;`
      );
      flkty.current = new Flickity(el, {
        initialIndex: index,
        fullscreen: true,
        pageDots: false,
        lazyLoad: true,
      });
      setIsSelectedSlide(index);

      el.focus();

      flkty.current.on('select', currentIndex => {
        setIsSelectedSlide(currentIndex);
      });
    }
  };

  useEffect(() => {
    if (isOpen && !isNil(isSelectedSlide)) {
      gtm.dl({
        story_title: storiesWithPotentielAd[isSelectedSlide]?.title,
      });
      gtm.event('worlds_of_luxury');
    }
  }, [isOpen, isSelectedSlide]);

  const customStyles = {
    overlay: {
      backgroundColor: theme.colors.sand[100],
      zIndex: 51,
    },
    content: {
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      top: '0',
      right: 'auto',
      bottom: 'auto',
      left: '0',
      width: '100vw',
      height: '100vh',
      padding: 0,
      backgroundColor: theme.colors.sand[100],
    },
  };

  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen);

    if (isFullscreen) {
      const imgEl = document.querySelector(
        '#sliderModalStories.is-fullscreen .story-slide.is-selected img'
      );

      if (imgEl) {
        imgEl.classList.add('fade-out');

        setTimeout(() => {
          imgEl.classList.remove('fade-out');

          flkty.current.toggleFullscreen();
        }, 400);
      } else {
        /* 
        Bug: when in full screen and wanting to toggle it by using the ESC key,
        the '.is-fullscreen' class in the DOM seems to be still present on the '#sliderModalStories' element
        but the imgEl return NULL as if it has been removed.
        I couldn't find an explanation to that bug, but this quick fix seems to do the job. 
        */
        flkty.current.toggleFullscreen();
        flkty.current.toggleFullscreen();
      }
    } else {
      flkty.current.toggleFullscreen();
    }
  };

  const closeModal = () => {
    setIsSelectedSlide(null);
    handleCloseModal();
  };

  const escapeOrClose = () => {
    if (isFullscreen) {
      handleFullscreen();
    } else {
      closeModal();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onAfterOpen={afterOpenModal}
      onRequestClose={escapeOrClose}
      style={customStyles}
      closeTimeoutMS={500}
    >
      <div className="h-full">
        <div className="h-full modal-stories">
          <button
            className="absolute bg-white rounded-full w-50 h-50"
            type="button"
            onClick={closeModal}
          >
            <Icon name="close" />
          </button>

          <div id="sliderModalStories" className="h-full">
            {storiesWithPotentielAd.map((story, key) => (
              <div
                className="flex flex-col items-center justify-center w-full mx-auto md:flex-row md:h-full story-slide"
                key={`modal-slide-${key}`}
              >
                <AnimatePresence>
                  <motion.div
                    className="order-2 md:mr-60 md:order-1 px-15 md:px-0 story-details"
                    animate={isSelectedSlide === key ? 'visible' : 'hidden'}
                    initial={{ opacity: 0 }}
                    variants={{
                      visible: { opacity: 1 },
                      hidden: { opacity: 0 },
                    }}
                    transition={{
                      duration: 1,
                      delay: 0.35,
                      ease: [0.215, 0.61, 0.355, 1],
                    }}
                    exit={{ opacity: 0 }}
                    key={`modal-slide-detail-${key}`}
                  >
                    <span
                      className="mb-5 uppercase text-orange font-soehneKraftig text-13 leading-17"
                      dangerouslySetInnerHTML={{
                        __html: story.story?.location,
                      }}
                    />
                    <h3
                      className="mb-15"
                      dangerouslySetInnerHTML={{
                        __html: story.title,
                      }}
                    />
                    <p
                      className="mb-25 text-19 modal-description"
                      dangerouslySetInnerHTML={{
                        __html: story.story?.description,
                      }}
                    />
                    {story.sponsorship?.sponsored &&
                      story.sponsorship?.sponsor && (
                        <>
                          <div className="py-10 mb-10 border-t border-b border-solid border-sand-500">
                            <p className="font-soehneLeicht text-15 leading-22">
                              {`${t('stories.sponsored')} `}
                              {story.sponsorship?.sponsorlink && (
                                <a
                                  href={story.sponsorship?.sponsorlink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="tracking-wider uppercase font-soehneKraftig"
                                >
                                  {story.sponsorship?.sponsor}
                                </a>
                              )}
                              {!story.sponsorship?.sponsorlink && (
                                <span className="tracking-wider uppercase font-soehneKraftig">
                                  {story.sponsorship?.sponsor}
                                </span>
                              )}
                            </p>
                          </div>
                          {story.story?.copyright && (
                            <p className="text-brown-300 text-15 leading-22 font-soehneLeicht">
                              {t('stories.copyright', {
                                credit: story.story?.copyright,
                              })}
                            </p>
                          )}
                        </>
                      )}
                    {(!story.sponsorship?.sponsored ||
                      !story.sponsorship?.sponsor) &&
                      story.story?.copyright && (
                        <div className="py-10 border-t border-solid border-sand-500">
                          <p className="text-brown-300 text-15 leading-22 font-soehneLeicht">
                            {t('stories.copyright', {
                              credit: story.story?.copyright,
                            })}
                          </p>
                        </div>
                      )}
                    {!story.isAd && (
                      <Link
                        href={`/${
                          i18n.language === defaultLng
                            ? 'mondes-du-luxe'
                            : `${i18n.language}/worlds-of-luxury`
                        }`}
                        onClick={closeModal}
                        className="flex items-center space-x-10 uppercase text-15 leading-20 font-soehneKraftig mt-15"
                      >
                        <span>{t('stories.see_all')}</span>
                        <Icon
                          name="chevron-full"
                          className="w-6 h-6 !top-[-1px] relative"
                        />
                      </Link>
                    )}
                  </motion.div>
                </AnimatePresence>
                <AnimatePresence>
                  <motion.div
                    className="order-1 md:order-2 mb-30 md:mb-0 story-image"
                    key={`modal-slide-img-${key}`}
                    animate={
                      isFullscreen || isSelectedSlide === key
                        ? 'visible'
                        : 'hidden'
                    }
                    initial={{
                      transform: isMobile ? 'scale(1)' : 'scale(0.85)',
                      opacity: 0,
                    }}
                    variants={{
                      visible: { transform: 'scale(1)', opacity: 1 },
                      hidden: {
                        transform: isMobile ? 'scale(1)' : 'scale(0.85)',
                        opacity: 0,
                      },
                    }}
                    transition={{
                      duration: 0.75,
                      ease: [0.215, 0.61, 0.355, 1],
                    }}
                    exit={{
                      transform: isMobile ? 'scale(1)' : 'scale(0.85)',
                      opacity: 0,
                    }}
                  >
                    <div className="relative">
                      {/* Story with video */}
                      {story?.story?.youtubeUrl && (
                        <div
                          className={clsx(
                            'mx-auto',
                            story?.story?.imageFormat === 'portrait'
                              ? 'w-[350px]'
                              : 'w-[500px]'
                          )}
                        >
                          <div
                            className={clsx(
                              'relative',
                              story?.story?.imageFormat === 'portrait'
                                ? 'aspect-[9/16]'
                                : 'aspect-video'
                            )}
                          >
                            <iframe
                              src={`https://www.youtube.com/embed/${getVideoId(
                                story?.story?.youtubeUrl
                              )}?controls=1&disablekb=1&modestbranding=1&rel=0`}
                              title={story.title}
                              className="absolute inset-0 w-full h-full"
                              referrerPolicy="strict-origin-when-cross-origin"
                              allowFullScreen
                            />
                          </div>
                        </div>
                      )}

                      {/* Story without video -> image */}
                      {!story?.story?.youtubeUrl && (
                        <a
                          // If is an add click open ad in new tab else open fullscreen
                          {...(story.isAd && {
                            href: ad.link,
                            target: '_blank',
                            rel: 'noopener noreferrer',
                          })}
                          {...(!story.isAd && {
                            role: 'link',
                            tabIndex: key,
                            onKeyPress: handleFullscreen,
                            onClick: handleFullscreen,
                          })}
                        >
                          <img
                            data-flickity-lazyload={
                              story.story?.image?.sourceUrl
                            }
                            data-flickity-lazyload-srcset={
                              story.story?.image?.srcSet
                            }
                            sizes={story.story?.image?.sizes}
                            alt={story.title}
                            className="w-auto"
                          />
                        </a>
                      )}

                      {!story.isAd && (
                        <>
                          <button
                            type="button"
                            id="viewFullscreenButton"
                            className="absolute top-0 right-0 hidden text-white md:block button-fullscreen"
                            onClick={handleFullscreen}
                          >
                            <Icon name="screen-full" />
                          </button>
                          <button
                            type="button"
                            id="exitFullscreenButton"
                            className="absolute top-0 right-0 hidden text-white button-fullscreen"
                            onClick={handleFullscreen}
                          >
                            <Icon name="screen-reduce" />
                          </button>
                        </>
                      )}
                      <div className="absolute flickity-page-dots">
                        {storiesWithPotentielAd.map((item, i) => (
                          <button
                            type="button"
                            className={clsx('dot', i === key && 'is-selected')}
                            style={{
                              width: `calc(100%/${storiesWithPotentielAd.length} - 6px)`,
                              maxWidth: '30px',
                            }}
                            key={`dot-${i}`}
                            aria-label={`slide-${i}`}
                            onClick={() => flkty.current.select(i)}
                          />
                        ))}
                      </div>
                    </div>

                    {story.isAd && <AdLegend />}
                  </motion.div>
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};

ModalStory.propTypes = {
  stories: PropTypes.array,
  ad: PropTypes.object,
  handleCloseModal: PropTypes.func,
  isOpen: PropTypes.bool,
  index: PropTypes.number,
};

export default ModalStory;
