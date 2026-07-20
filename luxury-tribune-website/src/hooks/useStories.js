import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { gql, request } from 'graphql-request';
import { toUpper } from 'ramda';

import config from 'config/config';
import { defaultLng } from 'locales/languages';

const WORLDSOFLUXURIES = 'worldsOfLuxuries';
const defaultLength = 15;

export const getWorldsOfLuxuries = async (length, lng, cursor, date) => {
  const { stories: data } = await request(
    config.apiHost,
    gql`
      query ($length: Int!, $lng: LanguageCodeFilterEnum!, $cursor: String) {
        stories(
          first: $length
          after: $cursor
          where: {
            language: $lng
            ${
              date
                ? `, dateQuery: { before: { day: ${format(
                    date,
                    'd'
                  )}, month: ${format(date, 'M')}, year:  ${format(
                    date,
                    'y'
                  )} } }`
                : ''
            }
            
          }
        ) {
          edges {
            node {
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
              }
              title
              slug
              uri
              sponsorship {
                sponsor
                sponsored
                sponsorLink
              }
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
      length,
      lng,
      cursor,
    }
  );

  // Transform storyFields to story and flatten image structure
  const transformedData = {
    ...data,
    edges: data.edges.map(edge => ({
      ...edge,
      node: {
        ...edge.node,
        story: {
          ...edge.node.storyFields,
          image: edge.node.storyFields?.image?.node
            ? {
                sourceUrl: edge.node.storyFields.image.node.sourceUrl,
              }
            : null,
        },
      },
    })),
  };

  return transformedData;
};

export const prefetchWorldsOfLuxuries = ({
  length = defaultLength,
  lng = toUpper(defaultLng),
  cursor = '',
  date,
}) => [
  [WORLDSOFLUXURIES, length, lng, cursor, date],
  () => getWorldsOfLuxuries(length, lng, cursor, date),
];

const useWorldsOfLuxuries = ({
  length = defaultLength,
  lng = toUpper(defaultLng),
  cursor = '',
  date,
}) =>
  useQuery([WORLDSOFLUXURIES, length, lng, cursor, date], () =>
    getWorldsOfLuxuries(length, lng, cursor, date)
  );

export default useWorldsOfLuxuries;
