import { useQuery } from '@tanstack/react-query';
import { gql, request } from 'graphql-request';
import { isNil } from 'ramda';

import config from 'config/config';
import flattenQueryRes from 'utils/flattenQueryRes';

const CATEGORY = 'category';

export const getCategoryList = async (lng, cursor = '') => {
  let categoriesData = [];

  const { categories: data } = await request(
    config.apiHost,
    gql`
      query ($length: Int!, $cursor: String, $lng: LanguageCodeFilterEnum!) {
        categories(first: $length, after: $cursor, where: { language: $lng }) {
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

  categoriesData = [...categoriesData, ...flattenQueryRes(data)];

  if (data.pageInfo.hasNextPage) {
    const nextCategories = await getCategoryList(lng, data.pageInfo.endCursor);
    categoriesData = [...categoriesData, ...nextCategories];
  }

  return categoriesData;
};

export const getCategory = async (slug, amount, excluded, cursor) => {
  const { category } = await request(
    config.apiHost,
    gql`
    query CategoryQuery {
      category(id: "${slug}", idType: SLUG) {
        name
        slug
        translations {
          uri
          language {
            slug
          }
        }
        posts(first: ${amount}, ${
      cursor ? `after: "${cursor}",` : ''
    }, where: {notIn: [${excluded}]}) {
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

  return category;
};

export const prefetchCategory = ({ slug, amount, excluded, cursor = '' }) => [
  [CATEGORY, slug, amount, excluded, cursor],
  () => getCategory(slug, amount, excluded, cursor),
  { enabled: !isNil(slug) },
];

const useCategory = ({ slug, amount, excluded, cursor = '' }) =>
  useQuery(
    [CATEGORY, slug, amount, excluded, cursor],
    () => getCategory(slug, amount, excluded, cursor),
    {
      enabled: !isNil(slug),
    }
  );

export default useCategory;
