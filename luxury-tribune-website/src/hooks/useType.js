import { useQuery } from '@tanstack/react-query';
import { gql, request } from 'graphql-request';
import { isNil } from 'ramda';

import config from 'config/config';
import flattenQueryRes from 'utils/flattenQueryRes';

const TYPE = 'type';

export const getTypeList = async (lng, cursor = '') => {
  let types = [];

  const { types: data } = await request(
    config.apiHost,
    gql`
      query ($length: Int!, $cursor: String, $lng: LanguageCodeFilterEnum!) {
        types(first: $length, after: $cursor, where: { language: $lng }) {
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

  types = [...types, ...flattenQueryRes(data)];

  if (data.pageInfo.hasNextPage) {
    const nextTypes = await getTypeList(lng, data.pageInfo.endCursor);
    types = [...types, ...nextTypes];
  }

  return types;
};

export const getType = async (slug, amount, cursor) => {
  const { type } = await request(
    config.apiHost,
    gql`
    query TypeQuery {
      type(id: "${slug}", idType: SLUG) {
        name
        slug
        description
        descriptionLink {
          link {
            target
            title
            url
          }
        }
        translations {
          uri
          language {
            slug
          }
        }
        posts(first: ${amount}, ${cursor ? `after: "${cursor}",` : ''}) {
          nodes {
            id
            featuredImage {
              node {
                sourceUrl
              }
            }
            sponsorship {
              sponsored
            }
            title
            uri
            excerpt
            categories {
              nodes {
                databaseId
                name
                slug
                ancestors {
                  nodes {
                    id
                  }
                }
              }
            }
            types {
              nodes {
                name
              }
            }
            teaserOptions {
              imageFormat
              style
              keyNumber {
                baseline
                icon
                value
              }
            }
            postAuthors {
              author {
                edges {
                  node {
                    ... on LuxuryAuthor {
                      uri
                      authorMetadatas {
                        avatar {
                          node {
                            sourceUrl
                          }
                        }
                      }
                      title
                    }
                  }
                }
              }
            }
          }
          pageInfo {
            endCursor
            hasNextPage
          }
        }
      }
    }
    `
  );

  return type;
};

export const prefetchType = ({ slug, amount, cursor, lng }) => [
  [TYPE, slug, amount, cursor, lng],
  () => getType(slug, amount, cursor),
  { enabled: !isNil(slug) },
];

const useType = ({ slug, amount, cursor, lng }) =>
  useQuery(
    [TYPE, slug, amount, cursor, lng],
    () => getType(slug, amount, cursor),
    {
      enabled: !isNil(slug),
    }
  );

export default useType;
