const defaultMail = 'rick@gmail.com';

export const getUserToken = (email = defaultMail) => {
  const {signToken} = require('../src/auth/auth.service');
  const {default: User} = require('../src/api/user/user.model');

  return User.findOne({email})
    .then(({_id}) => signToken(_id));
};

export const getAuthorizationHeader = (email = defaultMail) => {
  return getUserToken(email)
    .then(token => `Bearer ${token}`);
};