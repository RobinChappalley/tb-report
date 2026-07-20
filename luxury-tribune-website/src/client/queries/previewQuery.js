import { editorBlocksContent } from 'hooks/usePostOrPage';

const PreviewQuery = ({ id }) => `
query Preview {
  post(id: "${id}", idType: DATABASE_ID) {
    databaseId
    revisions(first: 1) {
      nodes {
        title
        date
        blocks {
         ${editorBlocksContent}
        }
      }
    }
  }
}
`;
export default PreviewQuery;
