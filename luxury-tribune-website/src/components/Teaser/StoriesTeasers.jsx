import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ReactModal from 'react-modal';
import Link from 'next/link';
import PropTypes from 'prop-types';

import { AdLegend } from 'components/Ad/Ad';
import FadeInImage from 'components/FadeInImage';
import Icon from 'components/Icon';
import { defaultLng } from 'locales/languages';

import ModalStory from '../StoryModal/StoryModal';

/* Import has to be done this way, otherwise it bugs if rendered from server-side. */
// https://github.com/metafizzy/flickity/issues/353#issuecomment-585317215
const Flickity =
  typeof window !== 'undefined' ? require('flickity-fullscreen') : () => null;

const StoriesTeasers = ({ stories, ad }) => {
  const { i18n, t } = useTranslation();
  const [startX, setStartX] = useState(0);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [indexActiveSlide, setIndexActiveSlide] = useState(0);
  const flkty = useRef(null);

  const openModal = index => {
    // eslint-disable-next-line radix
    setIndexActiveSlide(parseInt(index));
    setModalIsOpen(true);
  };

  useEffect(() => {
    if (stories) {
      const flickityOptions = {
        cellAlign: 'left',
        setGallerySize: true,
        pageDots: false,
        contain: true,
        groupCells: false,
        lazyLoad: true,
      };

      flkty.current = new Flickity('#sliderStories', flickityOptions);

      flkty.current.on(
        'staticClick',
        (event, pointer, cellElement, cellIndex) => {
          openModal(cellIndex);
        }
      );
    }

    // eslint-disable-next-line consistent-return
    return () => flkty.current.destroy();
  }, [stories, ad]);

  // Handle iOS 11.3 bug - page scrolls while dragging
  // https://github.com/metafizzy/flickity/issues/740#issuecomment-485562201
  const handleToucheMove = e => {
    if (Math.abs(e.touches[0].clientX - startX) > 5 && e.cancelable) {
      e.preventDefault();
    }
  };

  const closeModal = () => {
    // Prevent an ugly scroll to top when closing the modal
    document.body.setAttribute('style', '');
    document.querySelector('#stories').scrollIntoView();
    setModalIsOpen(false);
  };

  return (
    <div className="px-15 xl:px-0" id="stories">
      <div className="mb-15 md:mb-25 pb-15 border-b border-sand-500 flex items-center justify-between">
        <h2 className="uppercase ">
          <Icon
            name="world"
            className="!text-orange !text-19 md:!text-25 !mr-10"
          />
          <span>{t('stories.title')}</span>
        </h2>
        <Link
          href={`/${
            i18n.language === defaultLng
              ? 'mondes-du-luxe'
              : `${i18n.language}/worlds-of-luxury`
          }`}
          className="text-15 leading-20 uppercase font-soehneKraftig mt-15 flex space-x-10 items-center"
        >
          <span>{t('stories.see_all')}</span>
          <Icon name="chevron-full" className="w-6 h-6 !top-[-1px] relative" />
        </Link>
      </div>

      <div
        id="sliderStories"
        key={`stories-${ad ? stories.length + 1 : stories.length}`}
      >
        {ad && (
          <a
            key="story-0"
            className="story"
            role="link"
            tabIndex={0}
            onKeyDown={() => openModal(0)}
            onTouchStart={e => setStartX(e.touches[0].clientX)}
            onTouchMove={e => handleToucheMove(e)}
          >
            <div className="relative overflow-hidden img-hover">
              <FadeInImage
                src={ad.image.url}
                alt={ad.image.alt}
                width={9}
                height={16}
                className="mr-10"
              />
              <div className="absolute bottom-0 flex flex-col justify-end discover-hover">
                <div className="flex text-white justify-center left-0 right-0 uppercase font-soehneKraftig text-12 leading-16">
                  <Icon name="eye" />
                  <span className="ml-10">{t('stories.discover')}</span>
                </div>
              </div>
            </div>
            <AdLegend />
          </a>
        )}

        {stories.map((story, i) => (
          <a
            key={`story-${i + 1}`}
            className="story"
            role="link"
            tabIndex={i + 1}
            onKeyDown={() => openModal(i + 1)}
            onTouchStart={e => setStartX(e.touches[0].clientX)}
            onTouchMove={e => handleToucheMove(e)}
          >
            <div className="relative overflow-hidden img-hover">
              <FadeInImage
                src={story.story.image.sourceUrl}
                alt={story.title}
                width={9}
                height={16}
                className="mr-10"
              />
              <div className="absolute bottom-0 flex flex-col justify-end discover-hover">
                <div className="flex text-white justify-center left-0 right-0 uppercase font-soehneKraftig text-12 leading-16">
                  <Icon name="eye" />
                  <span className="ml-10">{t('stories.discover')}</span>
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>

      <ModalStory
        stories={stories}
        ad={ad}
        isOpen={modalIsOpen}
        handleCloseModal={closeModal}
        index={indexActiveSlide}
      />
    </div>
  );
};

StoriesTeasers.propTypes = {
  stories: PropTypes.array,
  ad: PropTypes.object,
};

StoriesTeasers.defaultProps = {
  stories: [],
};

export default StoriesTeasers;
