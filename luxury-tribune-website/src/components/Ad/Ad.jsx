import React from 'react';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import PropTypes from 'prop-types';

import config from 'config/config';

const AdMedia = ({ ad, format }) => {
  let classes = '';
  const [width, height] = format.split('_');

  if (format === '970_250') {
    classes = 'max-md:hidden';
  }

  return (
    <>
      {/* Desktop, hidden for banner under md */}
      <div className={classes}>
        {!ad.video.url && (
          <Image
            className="w-full"
            width={width}
            height={height}
            src={ad.image.url}
            alt={ad.image.alt}
          />
        )}
        {ad.video.url && (
          <video
            className="w-full"
            poster={`/_next/image?url=${encodeURIComponent(
              ad.image.url
            )}&w=1640&q=90`}
            src={ad.video.url}
            autoPlay={ad.video_has_autoplay}
            controls={!ad.video_has_autoplay}
            muted
            loop
            playsInline
            aria-label={ad.video.caption}
          />
        )}
      </div>

      {/* Mobile, only for banner under md */}
      {format === '970_250' && (
        <div className="md:hidden">
          {!ad.mobile_video?.url && (
            <Image
              className="w-full"
              width={width}
              height={height}
              src={ad.mobile_image?.url || ad.image.url}
              alt={ad.mobile_image?.alt || ad.image.alt}
            />
          )}
          {ad.mobile_video?.url && (
            <video
              className="w-full"
              poster={`/_next/image?url=${encodeURIComponent(
                ad.image.url
              )}&w=1640&q=90`}
              src={ad.mobile_video.url}
              autoPlay={ad.video_has_autoplay}
              controls={!ad.video_has_autoplay}
              muted
              loop
              playsInline
              aria-label={ad.mobile_video.caption}
            />
          )}
        </div>
      )}
    </>
  );
};

export const AdLegend = () => {
  const { t } = useTranslation();

  return (
    <div className="mt-5 uppercase text-brown-300 font-soehneKraftig leading-10 text-10">
      {t('ads_campagin.legend')}
    </div>
  );
};

export const AdLink = ({ ad, area, children }) => {
  if (!ad.link) {
    return null;
  }

  const link = `${config.baseApiHost}/wp-json/ads-campaign/v1/redirect/${
    ad.campaign.id
  }/${area}?url=${encodeURIComponent(ad.link)}`;

  return (
    <a href={link} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
};

export const Ad = ({ ad, area, format }) => {
  let classes = '';

  if (format === '970_250') {
    classes =
      'mx-auto w-full max-w-[970px] my-15 md:-mt-30 md:mb-40 px-40 md:px-10';
  }

  if (format === '480_320') {
    classes = `mx-auto w-full max-w-[480px] px-40 md:px-10 ${
      area === 'article' ? 'my-40 lg:my-50' : ''
    } ${area === 'home' ? 'mt-60' : ''}`;
  }

  if (format === '300_250') {
    classes =
      'mx-auto w-full max-w-[300px] px-40 md:px-10 my-40 lg:float-right lg:mt-20 lg:-mr-20 lg:mb-20 lg:ml-30';
  }

  return (
    <>
      <div className={classes}>
        {ad.link && (
          <AdLink ad={ad} area={area}>
            <AdMedia ad={ad} format={format} />
          </AdLink>
        )}

        {!ad.link && <AdMedia ad={ad} format={format} />}

        <AdLegend />
      </div>
    </>
  );
};

Ad.propTypes = {
  ad: PropTypes.object.isRequired,
  area: PropTypes.string.isRequired,
  format: PropTypes.string.isRequired,
};

AdMedia.propTypes = {
  ad: PropTypes.object.isRequired,
  format: PropTypes.string.isRequired,
};

AdLink.propTypes = {
  ad: PropTypes.object.isRequired,
  area: PropTypes.string.isRequired,
  children: PropTypes.node,
};

export default Ad;
