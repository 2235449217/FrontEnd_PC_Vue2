const getters = {
  token: state => state.user.token,
  authorities: state => state.user.authorities,
  user: state => state.user,
  flow: state => state.app.flow,
  form: state => state.app.form
};
export default getters;
