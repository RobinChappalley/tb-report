import { useQuery } from '@tanstack/react-query';
import { gql, request } from 'graphql-request';
import { isNil } from 'ramda';

import config from 'config/config';
import { defaultLng } from 'locales/languages';
import flattenQueryRes from 'utils/flattenQueryRes';

const WORLDSOFLUXURY = 'story';

export const getWorldsOfLuxuryList = async (lng, cursor = '') => {
  let worldsOfLuxuries = [];

  const { stories: data } = await request(
    config.apiHost,
    gql`
      query ($length: Int!, $cursor: String, $lng: LanguageCodeFilterEnum!) {
        stories(first: $length, after: $cursor, where: { language: $lng }) {
          edges {
            node {
              slug
            }
          }
          pageInfo {
            endCursor
            hasNextPage
          }
        }
      }
    `,
    {
      length: 100,
      cursor,
      lng,
    }
  );

  worldsOfLuxuries = [...worldsOfLuxuries, ...flattenQueryRes(data)];

  if (data.pageInfo.hasNextPage) {
    const nextPosts = await getWorldsOfLuxuryList(lng, data.pageInfo.endCursor);
    worldsOfLuxuries = [...worldsOfLuxuries, ...nextPosts];
  }

  return worldsOfLuxuries;
};

const getWorldsOfLuxury = async slug => {
  const { story } = await request(
    config.apiHost,
    gql`
      query ($slug: ID!) {
        story(id: $slug, idType: SLUG) {
          storyFields {
            image {
              node {
                sourceUrl
              }
            }
            copyright
            description
            location
            imageFormat
            youtubeUrl
          }
          title
          slug
          date
          sponsorship {
            sponsor
            sponsored
            sponsorLink
          }
          translations {
            uri
            language {
              slug
            }
          }
        }
      }
    `,
    {
      slug,
    }
  );

  // Transform storyFields to story and flatten image structure
  const transformedStory = {
    ...story,
    story: {
      ...story.storyFields,
      image: story.storyFields?.image?.node
        ? {
            sourceUrl: story.storyFields.image.node.sourceUrl,
          }
        : null,
    },
  };

  return flattenQueryRes(transformedStory);
};

export const prefetchWorldsOfLuxury = ({ slug, lng = defaultLng }) => [
  [WORLDSOFLUXURY, slug, lng],
  () => getWorldsOfLuxury(slug, lng),
  { enabled: !isNil(slug) },
];

const useWorldsOfLuxury = ({ slug, lng = defaultLng }) =>
  useQuery([WORLDSOFLUXURY, slug, lng], () => getWorldsOfLuxury(slug, lng), {
    enabled: !isNil(slug),
  });

export default useWorldsOfLuxury;
