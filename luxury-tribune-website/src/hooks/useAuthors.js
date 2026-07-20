import { useQuery } from '@tanstack/react-query';
import { gql, request } from 'graphql-request';
import { toUpper } from 'ramda';

import config from 'config/config';
import { defaultLng } from 'locales/languages';

const AUTHORS = 'authors';

export const getAuthors = async (lng, amount) => {
  const data = await request(
    config.apiHost,
    gql`
    query GetAuthors {
      authors: luxuryAuthors(first: ${amount}, where: {language: ${toUpper(
      lng
    )}}) {
        nodes {
          id
          title
          uri
          authorMetadatas {
            subtitle
            avatar {
              node {
                sourceUrl
              }
            }
          }
        }
      }
      authorsCategories: authorsCategories(where: {language: ${toUpper(lng)}}) {
        nodes {
          slug
          name
        }
      }
    }
    `
  );

  return data;
};

export const prefetchAuthors = ({ lng = toUpper(defaultLng), amount }) => [
  [AUTHORS, lng, amount],
  () => getAuthors(lng, amount),
];

const useAuthors = ({ lng = toUpper(defaultLng), amount }) =>
  useQuery([AUTHORS, lng, amount], () => getAuthors(lng, amount));

export default useAuthors;
