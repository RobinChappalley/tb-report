const ResetUserPassword = ({ user, password, key }) => `
mutation ResetUserPassword {
  resetUserPassword(input: {
    clientMutationId: "${+new Date()}",
    key: "${key}",
    login: "${user}",
    password: "${password}"
  }) {
    user {
      email
    }
  }
}
`;
export default ResetUserPassword;
