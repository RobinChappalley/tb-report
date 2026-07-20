import { useQuery } from '@tanstack/react-query';
import { gql, request } from 'graphql-request';
import { isNil } from 'ramda';

import config from 'config/config';
import { defaultLng } from 'locales/languages';
import flattenQueryRes from 'utils/flattenQueryRes';

const EVENT = 'event';

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
    }`;

export const getEventList = async (lng, cursor = '') => {
  let eventsData = [];

  const { events: data } = await request(
    config.apiHost,
    gql`
      query ($length: Int!, $cursor: String, $lng: LanguageCodeFilterEnum!) {
        events(first: $length, after: $cursor, where: { language: $lng }) {
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

  eventsData = [...eventsData, ...flattenQueryRes(data)];

  if (data.pageInfo.hasNextPage) {
    const nextEvents = await getEventList(data.pageInfo.endCursor);
    eventsData = [...eventsData, ...nextEvents];
  }

  return eventsData;
};

const getEvent = async slug => {
  const { event } = await request(
    config.apiHost,
    gql`
    query GetEvent {
      event(id: "${slug}", idType: URI) {
        title
        excerpt
        eventMetadata {
          buttonLink
          buttonText
          endDate
          location
          startDate
        }
        eventsCategories {
          nodes {
            databaseId
            name
            slug
          }
        }
        sponsorship {
          sponsored
          sponsor
          sponsorLink
        }
        featuredImage {
          node {
            sourceUrl
          }
        }
        ${editorBlocksContent}
        ${translations}
        ${seo}
      }
    }
    `
  );

  // Transform featuredImage structure to flatten node.sourceUrl
  const transformEvent = eventData => {
    if (eventData.featuredImage?.node) {
      eventData.featuredImage = {
        sourceUrl: eventData.featuredImage.node.sourceUrl,
      };
    }

    return eventData;
  };

  return transformEvent(event);
};

export const prefetchEvent = ({ slug, lng = defaultLng }) => [
  [EVENT, slug, lng],
  () => getEvent(slug, lng),
  { enabled: !isNil(slug) },
];

const useEvent = ({ slug, lng = defaultLng }) =>
  useQuery([EVENT, slug, lng], () => getEvent(slug, lng), {
    enabled: !isNil(slug),
  });

export default useEvent;
