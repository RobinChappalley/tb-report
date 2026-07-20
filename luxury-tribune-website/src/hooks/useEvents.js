import { useQuery } from '@tanstack/react-query';
import { gql, request } from 'graphql-request';
import { toUpper } from 'ramda';

import config from 'config/config';
import { defaultLng } from 'locales/languages';

const EVENTS = 'events';
const defaultLength = 5;

export const getEvents = async (lng, amount, cursor) => {
  const data = await request(
    config.apiHost,
    gql`
    query EventsQuery {
      futureEvents: events(where: {todayOrAfter: true, language: ${toUpper(
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
          excerpt
          eventsCategories(first: 1) {
            nodes {
              name
            }
          }
        }
      }
      pastEvents: events(first: ${amount}, ${
      cursor ? `after: "${cursor}",` : ''
    } where: {beforeToday: true, language: ${toUpper(
      lng
    )}, orderby: {field: START_DATE, order: DESC}}) {
        nodes {
          title
          sponsorship {
            sponsored
            sponsor
            sponsorLink          }
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
          excerpt
          eventsCategories(first: 1) {
            nodes {
              name
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

export const prefetchEvents = ({
  lng = toUpper(defaultLng),
  amount = defaultLength,
  cursor = '',
}) => [[EVENTS, lng, amount, cursor], () => getEvents(lng, amount, cursor)];

const useEvents = ({
  lng = toUpper(defaultLng),
  amount = defaultLength,
  cursor = '',
}) =>
  useQuery([EVENTS, lng, amount, cursor], () => getEvents(lng, amount, cursor));

export default useEvents;
