const RefreshToken = token => `
mutation RefreshAuthToken {
  refreshJwtAuthToken(
    input: {
      clientMutationId: "${+new Date()}"
      jwtRefreshToken: "${token}",
  }) {
    authToken
  }
}
`;
export default RefreshToken;
