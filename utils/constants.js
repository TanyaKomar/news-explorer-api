const { NODE_ENV, MONGODB_ADDRESS } = process.env;

module.exports.DB_ADDRESS = NODE_ENV === 'production' ? MONGODB_ADDRESS : 'mongodb://localhost:27017/news-explorer';
module.exports.DEV_KEY = 'tkey';

module.exports.ERROR_MESSAGES = {
  notFound: 'Requested resource not found',
  unauthorized: 'Authorization Required',
  userNotFound: 'User not found',
  userBadRequest: 'Validation failed: user cannot be created',
  userExist: 'User with this email already exists',
  userBadCredentials: 'Incorrect email or password',
  articleNotFound: 'Article not found',
  articleBadRequest: 'Validation failed: article cannot be created',
  articleOwnedOnly: 'You can only delete your own articles',
  interalServer: 'An error has occurred on the server',
};

module.exports.STATUS_CODES = {
  ok: 200,
  created: 201,
  badRequest: 400,
  unauthorized: 401,
  forbidden: 403,
  notFound: 404,
  interalServer: 500,
};
