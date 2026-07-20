import { useQuery } from '@tanstack/react-query';
import { gql, request } from 'graphql-request';
import { isNil, toUpper } from 'ramda';

import config from 'config/config';
import { defaultLng } from 'locales/languages';
import flattenQueryRes from 'utils/flattenQueryRes';

export const translations = `
  translations {
    uri
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
      sourceUrl
    }
    twitterImage {
      sourceUrl
    }
  }
`;

export const editorBlocksContent = `
editorBlocks {
  __typename
  name
  renderedHtml
  apiVersion
  innerBlocks {
    __typename
    name
    renderedHtml
        ... on CoreImage {
          attributes {
            url
            alt
            caption
            align
            className
          }
        }
        ... on CoreListItem {
          attributes {
            content
            className
          }
        }
  }
  ... on CoreParagraph {
    attributes {
      content
      align
      className
      dropCap
    }
  }
  ... on CoreHeading {
    attributes {
      content
      level
      align
      className
    }
  }
  ... on CoreImage {
    attributes {
      url
      className
      alt
      caption
      align
    }
  }
  ... on CoreList {
    attributes {
      values
      ordered
      className
    }
  }
  ... on AcfDigitalProduct {
    digitalProduct {
      digitalProductTitle
      digitalProductSurTitle
      digitalProductDescription
      digitalProductButtonText
      digitalProductBuyLink
      digitalProductPrice
      digitalProductImage {
        node {
          sourceUrl
          altText
        }
      }
      digitalProductSinglePageLinkLabel
      digitalProductProductId
      digitalProductSinglePageLink {
        url
        title
        target
      }
    }
  }
  ... on AcfKeyNumbers {
    attributes {
      data
    }
  }
  ... on CoreGallery {
    attributes {
      caption
      align
      className
    }
  }
  ... on AcfLead {
    attributes {
      data
    }
  }
  ... on AcfAd {
    attributes {
      adAlign: align
    }
  }
  ... on AcfRelatedLink {
    attributes {
      data
    }
  }
  ... on CoreEmbed {
    attributes {
      url
      providerNameSlug
      caption
      type
    }
  }
  ... on CoreButtons {
    attributes {
      layout
    }
  }
  ... on CoreSeparator {
    attributes {
      className
      align
    }
  }
  ... on AcfFootnotes {
    attributes {
      data
    }
  }
  ... on AcfStudyLink {
    attributes {
      data
    }
    linkedStudy {
      linkType
      url
      file {
        node {
          sourceUrl
        }
      }
      professors {
        nodes {
          ... on LuxuryAuthor {
            title
            authorMetadatas {
              avatar {
                node {
                  sourceUrl
                }
              }
            }
          }
        }
      }
    }
  }
  ... on AcfQuote {
    attributes {
      data
    }
  }
  ... on AcfPaywall {
    attributes {
      data
    }
  }
  ... on AcfNewsletter {
    attributes {
      data
    }
  }
}`;

const PAGEORPOST = 'pageOrPost';

const getPagesList = async (lng, cursor = '') => {
  const data = await request(
    config.apiHost,
    gql`
      query ($length: Int!, $cursor: String, $lng: LanguageCodeFilterEnum!) {
        pages(first: $length, after: $cursor, where: { language: $lng }) {
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
      lng: toUpper(lng),
    }
  );

  let pages = flattenQueryRes(data.pages);

  if (data.pages.pageInfo.hasNextPage) {
    const nextPages = await getPagesList(lng, data.pages.pageInfo.endCursor);
    pages = [...pages, ...nextPages];
  }

  return pages;
};

const getPostsList = async (lng, cursor = '') => {
  const data = await request(
    config.apiHost,
    gql`
      query ($length: Int!, $cursor: String, $lng: LanguageCodeFilterEnum!) {
        posts(first: $length, after: $cursor, where: { language: $lng }) {
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
      lng: toUpper(lng),
    }
  );

  let posts = flattenQueryRes(data.posts);

  if (data.posts.pageInfo.hasNextPage) {
    const nextPosts = await getPostsList(lng, data.posts.pageInfo.endCursor);
    posts = [...posts, ...nextPosts];
  }

  return posts;
};

export const getPageOrPostList = async (cursor = '', lng = defaultLng) => {
  const pages = await getPagesList(lng, cursor);
  const posts = await getPostsList(lng, cursor);
  return [...pages, ...posts];
};

const getPageOrPost = async slug => {
  const data = await request(
    config.apiHost,
    gql`
    query GetPageOrPost {
      post(id: "${slug}", idType: SLUG) {
        databaseId
        title
        slug
        dateGmt
        modifiedGmt
        excerpt
        isSearchEngine
        featuredImage {
          node {
            sourceUrl
          }
        }
        date
        types {
          nodes {
            name
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
        sponsorship {
          sponsored
          sponsor
          sponsorLink
        }
        displayAds {
          displayAds
        }
        premium {
          isPremium
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
                  links {
                    label
                    url
                  }
                }
                title
              }
            }
          }
        }
        related {
          posts {
            nodes {
              ... on Post {
                databaseId
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
                teaserOptions {
                  imageFormat
                  style
                  keyNumber {
                    baseline
                    icon
                    value
                  }
                }
              }
            }
          }
        }
        ${editorBlocksContent}
        ${translations}
        ${seo}
      }
      page(id: "${slug}", idType: URI) {
        title
        slug
        date
        ${editorBlocksContent}
        ${translations}
        ${seo}
      }
    }
    `
  );

  // Transform featuredImage structure to flatten node.sourceUrl
  const transformData = postData => {
    if (postData.post) {
      // Transform main post featuredImage
      if (postData.post.featuredImage?.node) {
        postData.post.featuredImage = {
          sourceUrl: postData.post.featuredImage.node.sourceUrl,
        };
      }

      // Transform related posts featuredImages
      if (postData.post.related?.posts?.nodes) {
        postData.post.related.posts.nodes =
          postData.post.related.posts.nodes.map(post => ({
            ...post,
            featuredImage: post.featuredImage?.node
              ? { sourceUrl: post.featuredImage.node.sourceUrl }
              : null,
          }));
      }
    }

    return postData;
  };

  return transformData(data);
};

export const prefetchPageOrPost = slug => [
  [PAGEORPOST, slug],
  () => getPageOrPost(slug),
  { enabled: !isNil(slug) },
];

const usePageOrPost = slug =>
  useQuery([PAGEORPOST, slug], () => getPageOrPost(slug), {
    enabled: !isNil(slug),
  });

export default usePageOrPost;
