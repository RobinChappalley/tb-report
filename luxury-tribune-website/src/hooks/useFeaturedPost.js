import { useQuery } from '@tanstack/react-query';
import { gql, request } from 'graphql-request';
import { isNil } from 'ramda';

import config from 'config/config';

const FEATUREDPOST = 'featuredPost';

const getFeaturedPost = async slug => {
  const { featuredPost } = await request(
    config.apiHost,
    gql`
    query featuredPostQuery {
      featuredPost: posts(first: 1, where: {onlySticky: true, categoryName: "${slug}"}) {
        nodes {
          databaseId
          title
          premium {
            isPremium
          }
          featuredImage {
            node {
              sourceUrl
            }
          }
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
          excerpt
          uri
          postAuthors {
            author {
              edges {
                node {
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
    }
    `
  );

  // Transform posts to flatten image structure
  const transformPosts = posts =>
    posts.map(post => ({
      ...post,
      featuredImage: post.featuredImage?.node
        ? { sourceUrl: post.featuredImage.node.sourceUrl }
        : null,
    }));

  return {
    ...featuredPost,
    nodes: transformPosts(featuredPost.nodes),
  };
};

export const prefetchFeaturedPost = ({ slug }) => [
  [FEATUREDPOST, slug],
  () => getFeaturedPost(slug),
  { enabled: !isNil(slug) },
];

const useFeaturedPost = ({ slug }) =>
  useQuery([FEATUREDPOST, slug], () => getFeaturedPost(slug), {
    enabled: !isNil(slug),
  });

export default useFeaturedPost;
