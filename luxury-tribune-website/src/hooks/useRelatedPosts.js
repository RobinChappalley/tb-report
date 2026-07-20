import { useQuery } from '@tanstack/react-query';
import { gql, request } from 'graphql-request';

import config from 'config/config';

const RELATEDPOSTS = 'relatedPosts';

export const getRelatedPosts = async (amount, category, excluded) => {
  const data = await request(
    config.apiHost,
    gql`
    query PostsQuery {
      posts(first: ${amount}, where: {notIn: [${excluded}], categoryId: ${category}}) {
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
          premium {
            isPremium
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
          postAuthors {
            author {
              nodes {
                ... on LuxuryAuthor {
                  uri
                  title
                }
              }
            }
          }
        }
      }
    }
    `
  );

  return data;
};

const useRelatedPosts = ({ amount, category, excluded = [] }) =>
  useQuery([RELATEDPOSTS, amount, category, excluded], () =>
    getRelatedPosts(amount, category, excluded)
  );

export default useRelatedPosts;
