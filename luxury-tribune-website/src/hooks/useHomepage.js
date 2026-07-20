import { useQuery } from '@tanstack/react-query';
import { gql, request } from 'graphql-request';
import { isEmpty, pluck, toUpper } from 'ramda';

import config, {
  featuredCategories as featuredCategoriesData,
  postsAmount,
} from 'config/config';
import { defaultLng } from 'locales/languages';
import addSponsoredPost from 'utils/addSponsoredPost';

const HOMEPAGE = 'homepage';

const homepageFeaturedQuery = ({
  lng,
  tribuneCategory,
  newsCategory,
  featuredCategories,
  amountStories,
}) => `query HomePageFeaturedQuery {
  featuredBrief {
    featuredBriefOptions {
      fr {
        active
        posts {
          edges {
            node {
              ... on Post {
            databaseId
            title
            excerpt
            uri
            sponsorship {
              sponsored
            }
            premium {
              isPremium
            }
            featuredImage {
              node {
                sourceUrl
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
            types {
              nodes {
                name
              }
            }
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
            }
          }
        }
        title
        sectionTitle
      }
      en {
        active
        posts {
          edges {
            node {
              ... on Post {
            databaseId
            title
            excerpt
            uri
            sponsorship {
              sponsored
            }
            featuredImage {
              node {
                sourceUrl
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
            types {
              nodes {
                name
              }
            }
            premium {
              isPremium
            }
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
            }
          }
        }
        title
        sectionTitle
      }
    }
  }
  featuredPost: posts(first: 1, where: {onlySticky: true, language: ${toUpper(
    lng
  )}}) {
    nodes {
      databaseId
      title
      featuredImage {
        node {
          sourceUrl
        }
      }
      premium {
        isPremium
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
  }
  lastTribune: category(id: "${tribuneCategory}", idType: SLUG) {
    name
    posts(first: 1) {
      nodes {
        databaseId
        title
        excerpt
        uri
        premium {
          isPremium
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
    }
  }
  news: category(id: "${newsCategory}", idType: SLUG) {
    name
    slug
    databaseId
    translations {
      uri
      language {
        slug
      }
    }
    posts(first: 4) {
      nodes {
        databaseId
        title
        uri
        featuredImage {
          node {
            sourceUrl
          }
        }
        teaserOptions {
          imageFormat
        }
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
      }
    }
  }
  ${featuredCategories.map(
    featuredCategory => `
      ${featuredCategory.sponsored}: posts(first: 1, where: {categoryName: "${featuredCategory[lng]}", onlySponsored: true}) {
        nodes {
          databaseId
          title
          excerpt
          uri
          sponsorship {
            sponsored
          }
          premium {
            isPremium
          }
          featuredImage {
            node {
              sourceUrl
            }
          }
          teaserOptions {
            imageFormat
          }
          types {
            nodes {
              name
            }
          }
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
      }`
  )}
  pinnedEvent: events(first: 1, where: {sticky: true, language: ${toUpper(
    lng
  )}, orderby: {field: START_DATE, order: ASC}}) {
    nodes {
      title
      sponsorship {
        sponsored
        sponsor
        sponsorLink
      }
      eventMetadata {
        endDate
        location
        startDate
      }
      slug
      featuredImage {
        node {
          sourceUrl
        }
      }
      uri
      eventsCategories(first: 1) {
        nodes {
          name
        }
      }
    }
  }
  stories: stories(where: {language: ${toUpper(
    lng
  )}}, first: ${amountStories}) {
    nodes {
      storyId
      title
      slug
      storyFields {
        image {
          node {
            sourceUrl
          }
        }
        copyright
        description
        location
        image {
          node {
            sourceUrl
          }
        }
        imageFormat
        youtubeUrl
      }
      sponsorship {
        sponsor
        sponsored
        sponsorLink
      }
    }
  }
}`;

const featuredCategoriesQuery = ({ lng, excluded }) => `
query FeaturedCategoriesQuery {
  ${featuredCategoriesData.map(
    featuredCategory =>
      `${featuredCategory.name}: category(id: "${featuredCategory[lng]}", idType: SLUG) {
        name
        posts(first: ${postsAmount.featuredCategories}, where: {notIn: [${excluded}]}) {
          nodes {
            databaseId
            title
            excerpt
            uri
            sponsorship {
              sponsored
            }
            premium {
              isPremium
            }
            featuredImage {
              node {
                sourceUrl
              }
            }
            teaserOptions {
              imageFormat
            }
            types {
              nodes {
                name
              }
            }
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
      }`
  )}
}
`;

export const postsQuery = ({
  amount,
  excluded,
  lng,
  cursor,
  excludedCategory,
}) => `
query PostsQuery {
  posts(first: ${amount}, ${
  cursor ? `after: "${cursor}",` : ''
} where: {notIn: [${excluded}], language: ${lng}${
  excludedCategory ? `, categoryNotIn: ${excludedCategory}` : ''
}}) {
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
      premium {
        isPremium
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
`;

export const getPosts = ({ amount, excluded, lng, cursor, excludedCategory }) =>
  request(
    config.apiHost,
    gql`
      ${postsQuery({
        amount,
        lng,
        excluded,
        excludedCategory,
        cursor,
      })}
    `
  );

const getHomepage = async ({
  lng,
  tribuneCategory,
  newsCategory,
  featuredCategories,
  amountStories,
}) => {
  const {
    featuredPost,
    lastTribune,
    featuredBrief,
    businessSponsored,
    styleSponsored,
    sustainabilitySponsored,
    pinnedEvent,
    stories,
    news,
  } = await request(
    config.apiHost,
    gql`
      ${homepageFeaturedQuery({
        lng,
        tribuneCategory,
        newsCategory,
        featuredCategories,
        amountStories,
      })}
    `
  );

  // Helper function to extract nodes from edges
  const extractNodes = edges => edges?.map(edge => edge.node) || [];

  // Exclude all posts we don't want on other requests
  const featuredExcluded = [
    featuredPost?.nodes[0]?.databaseId,
    lastTribune?.posts?.nodes[0]?.databaseId,
    businessSponsored?.nodes[0]?.databaseId,
    styleSponsored?.nodes[0]?.databaseId,
    sustainabilitySponsored?.nodes[0]?.databaseId,
  ];

  // Get featured categories last 5 posts
  const { businessFeatured, styleFeatured, sustainabilityFeatured } =
    await request(
      config.apiHost,
      gql`
        ${featuredCategoriesQuery({
          lng,
          excluded: featuredExcluded,
        })}
      `
    );

  // Extract posts from nodes structure
  const businessPostsNodes = businessFeatured.posts.nodes || [];
  const stylePostsNodes = styleFeatured.posts.nodes || [];
  const sustainabilityPostsNodes = sustainabilityFeatured.posts.nodes || [];

  // Transform featuredBriefOptions to extract posts from edges
  const transformedFeaturedBrief = {
    fr: featuredBrief.featuredBriefOptions.fr
      ? {
          ...featuredBrief.featuredBriefOptions.fr,
          posts: extractNodes(
            featuredBrief.featuredBriefOptions.fr.posts?.edges
          ),
        }
      : null,
    en: featuredBrief.featuredBriefOptions.en
      ? {
          ...featuredBrief.featuredBriefOptions.en,
          posts: extractNodes(
            featuredBrief.featuredBriefOptions.en.posts?.edges
          ),
        }
      : null,
  };

  // Transform posts to flatten image structure
  const transformPosts = posts =>
    posts.map(post => ({
      ...post,
      featuredImage: post.featuredImage?.node
        ? { sourceUrl: post.featuredImage.node.sourceUrl }
        : null,
    }));

  // Add sponsored posts to each category.
  const businessPosts = !isEmpty(businessSponsored.nodes)
    ? addSponsoredPost(
        transformPosts(businessPostsNodes),
        transformPosts([businessSponsored.nodes[0]])[0]
      )
    : transformPosts(businessPostsNodes);
  const stylePosts = !isEmpty(styleSponsored.nodes)
    ? addSponsoredPost(
        transformPosts(stylePostsNodes),
        transformPosts([styleSponsored.nodes[0]])[0]
      )
    : transformPosts(stylePostsNodes);
  const sustainabilityPosts = !isEmpty(sustainabilitySponsored.nodes)
    ? addSponsoredPost(
        transformPosts(sustainabilityPostsNodes),
        transformPosts([sustainabilitySponsored.nodes[0]])[0]
      )
    : transformPosts(sustainabilityPostsNodes);

  const getDatabaseIds = pluck('databaseId');

  const excluded = [
    ...featuredExcluded,
    ...getDatabaseIds(businessPosts),
    ...getDatabaseIds(stylePosts),
    ...getDatabaseIds(sustainabilityPosts),
  ];

  const excludedCategoryId = news?.databaseId;

  const latestPosts = await getPosts({
    amount: postsAmount.homeInitial,
    lng: toUpper(lng),
    excluded,
    excludedCategory: excludedCategoryId,
  });

  return {
    featuredContent: {
      featuredPost: featuredPost?.nodes[0]
        ? transformPosts([featuredPost.nodes[0]])[0]
        : null,
      lastTribune: !isEmpty(lastTribune?.posts?.nodes)
        ? {
            categoryName: lastTribune?.name,
            post: transformPosts([lastTribune?.posts?.nodes[0]])[0],
          }
        : null,
      featuredBrief: transformedFeaturedBrief,
    },
    featuredCategories: {
      business: {
        name: businessFeatured.name,
        posts: businessPosts,
      },
      style: {
        name: styleFeatured.name,
        posts: stylePosts,
      },
      sustainability: {
        name: sustainabilityFeatured.name,
        posts: sustainabilityPosts,
      },
    },
    posts: latestPosts?.posts,
    excluded,
    excludedCategoryId,
    lng,
    pinnedEvent: pinnedEvent?.nodes[0],
    stories: stories?.nodes?.map(story => ({
      ...story,
      story: {
        ...story.storyFields,
        image: story.storyFields?.image?.node
          ? {
              sourceUrl: story.storyFields.image.node.sourceUrl,
              srcSet: story.storyFields.image.node.srcSet,
              sizes: story.storyFields.image.node.sizes,
            }
          : null,
      },
    })),
    news: news
      ? {
          ...news,
          posts: {
            ...news.posts,
            nodes: transformPosts(news.posts.nodes),
          },
        }
      : null,
  };
};

export const prefetchHomepage = ({
  lng = defaultLng,
  tribuneCategory,
  newsCategory,
  featuredCategories,
  amountStories,
}) => [
  [
    HOMEPAGE,
    lng,
    tribuneCategory,
    newsCategory,
    featuredCategories,
    amountStories,
  ],
  () =>
    getHomepage({
      lng,
      tribuneCategory,
      newsCategory,
      featuredCategories,
      amountStories,
    }),
];

const useHomepage = ({
  lng = defaultLng,
  tribuneCategory,
  newsCategory,
  featuredCategories,
  amountStories,
}) =>
  useQuery(
    [
      HOMEPAGE,
      lng,
      tribuneCategory,
      newsCategory,
      featuredCategories,
      amountStories,
    ],
    () =>
      getHomepage({
        lng,
        tribuneCategory,
        newsCategory,
        featuredCategories,
        amountStories,
      })
  );

export default useHomepage;
