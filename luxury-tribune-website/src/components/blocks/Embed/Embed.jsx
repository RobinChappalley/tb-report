import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { __, includes, isNil, match, nth, pipe, replace } from 'ramda';

const Embed = ({ attributes }) => {
  const supportedEmbeds = ['youtube', 'vimeo', 'spotify'];

  if (!includes(attributes.providerNameSlug, supportedEmbeds)) {
    return null;
  }

  const getEmbedVideoUrl = provider => url =>
    pipe(
      match(provider.regex),
      nth(provider.matchGroup),
      replace('{id}', __, provider.baseUrl)
    )(url);

  const getYoutubeEmbedUrl = getEmbedVideoUrl({
    regex:
      /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/)|(?:(?:watch)?\?v(?:i)?=|&v(?:i)?=))([^#&?]+).*/,
    matchGroup: 1,
    baseUrl: 'https://www.youtube.com/embed/{id}',
  });

  const getVimeoEmbedUrl = getEmbedVideoUrl({
    regex:
      /https?:\/\/(?:www\.|player\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/([^/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+)(?:$|\/|\?)/,
    matchGroup: 3,
    baseUrl:
      'https://player.vimeo.com/video/{id}?color=F24237&title=0&byline=0&portrait=0',
  });

  // Regex based on https://gist.github.com/fantattitude/3627354
  const getSpotifyEmbedUrl = getEmbedVideoUrl({
    regex:
      /https?:\/\/open.spotify.com\/((track|artist|album|episode)\/[a-zA-Z0-9]+).*|spotify:((track|artist|album|episode):[a-zA-Z0-9]+).*/,
    matchGroup: 1,
    baseUrl: 'https://open.spotify.com/embed/{id}',
  });

  const getSpotifyUrlType = getEmbedVideoUrl({
    regex:
      /https?:\/\/open.spotify.com\/((track|artist|album|episode)\/[a-zA-Z0-9]+).*|spotify:((track|artist|album|episode):[a-zA-Z0-9]+).*/,
    matchGroup: 2,
    baseUrl: '{id}',
  });

  let sourceUrl;
  switch (attributes.providerNameSlug) {
    case 'vimeo':
      sourceUrl = getVimeoEmbedUrl(attributes.url);
      break;
    case 'youtube':
      sourceUrl = getYoutubeEmbedUrl(attributes.url);
      break;
    case 'spotify':
      sourceUrl = getSpotifyEmbedUrl(attributes.url);
      break;
    default:
      sourceUrl = null;
  }

  return (
    <div className="content-container !my-30 md:!my-60">
      {!isNil(sourceUrl) && (
        <figure>
          <div
            style={
              attributes.providerNameSlug !== 'spotify' ||
              (attributes.providerNameSlug === 'spotify' &&
                getSpotifyUrlType(attributes.url) !== 'episode')
                ? {
                    padding: '56.25% 0 0 0',
                  }
                : {}
            }
            className={clsx(
              'relative',
              attributes.providerNameSlug === 'spotify' && 'spotify-track-style'
            )}
          >
            {/* eslint-disable-next-line jsx-a11y/iframe-has-title */}
            <iframe
              src={sourceUrl}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
              }}
              frameBorder="0"
              allow="autoplay; fullscreen; encrypted-media; gyroscope; picture-in-picture; accelerometer"
              allowFullScreen
            />
          </div>
          {attributes.caption && (
            <figcaption
              className="mt-10 font-soehneLeicht text-15 leading-22"
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{ __html: attributes.caption }}
            />
          )}
        </figure>
      )}
    </div>
  );
};

Embed.propTypes = {
  attributes: PropTypes.object,
};

Embed.defaultProps = {
  attributes: {
    url: '#',
    providerNameSlug: 'youtube',
    caption: '',
  },
};

export default Embed;
