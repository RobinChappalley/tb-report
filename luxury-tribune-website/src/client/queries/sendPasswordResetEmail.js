const SendPasswordResetEmail = ({ user }) => `
mutation SendPasswordResetEmail {
  sendPasswordResetEmail(input: {
    clientMutationId: "${+new Date()}",
    username: "${user}"
  }) {
    user {
      email
    }
  }
}
`;
export default SendPasswordResetEmail;
