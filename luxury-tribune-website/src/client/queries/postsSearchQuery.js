const PostsSearchQuery = ({ amount, cursor, lng, search }) => `
query PostsSearchQuery {
  posts(first: ${amount},  ${
  cursor ? `after: "${cursor}",` : ''
} where: {language: ${lng}, search: "${search}", orderby: {field: DATE, order: DESC}}) {
    nodes {
      id
      date
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
`;
export default PostsSearchQuery;
