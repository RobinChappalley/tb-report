const Login = ({ user, password }) => `
mutation LoginUser {
  login(input: {
    clientMutationId: "${+new Date()}",
    username: "${user}", 
    password: "${password}"}
	) {
    refreshToken
  }
}
`;
export default Login;
