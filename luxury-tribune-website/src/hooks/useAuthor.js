import { useQuery } from '@tanstack/react-query';
import { gql, request } from 'graphql-request';
import { isNil, toUpper } from 'ramda';

import config from 'config/config';
import { defaultLng } from 'locales/languages';
import flattenQueryRes from 'utils/flattenQueryRes';

const AUTHOR = 'author';

export const translations = `
  translations {
    uri
    language {
      slug
    }
  }
`;

export const seo = `
  seo {
    title
    metaDesc
    focuskw
    opengraphAuthor
    opengraphDescription
    opengraphModifiedTime
    opengraphPublishedTime
    opengraphSiteName
    opengraphTitle
    opengraphType
    opengraphUrl
    opengraphImage {
      mediaItemUrl
    }
    twitterImage {
      mediaItemUrl
    }
  }
`;

export const getAuthorList = async (lng, cursor = '') => {
  let authorsData = [];

  const { luxuryAuthors: data } = await request(
    config.apiHost,
    gql`
      query ($length: Int!, $cursor: String, $lng: LanguageCodeFilterEnum!) {
        luxuryAuthors(
          first: $length
          after: $cursor
          where: { language: $lng }
        ) {
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

  authorsData = [...authorsData, ...flattenQueryRes(data)];

  if (data.pageInfo.hasNextPage) {
    const nextAuthors = await getAuthorList(lng, data.pageInfo.endCursor);
    authorsData = [...authorsData, ...nextAuthors];
  }

  return authorsData;
};

export const getAuthor = async (slug, amount, cursor, lng) => {
  const data = await request(
    config.apiHost,
    gql`
    query GetAuthor {
      author: luxuryAuthor(id: "${slug}", idType: URI) {
        title
        authorMetadatas {
          biography
          more
          subtitle
          avatar {
            node {
              sourceUrl
            }
          }
          links {
            label
            url
          }
          references {
            publication
            referenceAuthors
            title
          }
        }
        ${translations}
        ${seo}
      }
      posts(first: ${amount}, ${
      cursor ? `after: "${cursor}",` : ''
    }, where: {postAuthorSlug: "${slug}", language: ${toUpper(lng)}}) {
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
              nodes {
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
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
    `
  );

  return data;
};

export const prefetchAuthor = ({
  slug,
  amount,
  cursor = '',
  lng = defaultLng,
}) => [
  [AUTHOR, slug, amount, cursor, lng],
  () => getAuthor(slug, amount, cursor, lng),
  { enabled: !isNil(slug) },
];

const useAuthor = ({ slug, amount, cursor = '', lng = defaultLng }) =>
  useQuery(
    [AUTHOR, slug, amount, cursor, lng],
    () => getAuthor(slug, amount, cursor, lng),
    {
      enabled: !isNil(slug),
    }
  );

export default useAuthor;
