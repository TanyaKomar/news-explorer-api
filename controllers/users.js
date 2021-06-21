const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const UnauthorizedError = require('../errors/unauthorized-err');
const ConflictError = require('../errors/conflict-err');
const { DEV_KEY, ERROR_MESSAGES, STATUS_CODES } = require('../utils/constants');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((user) => res.status(STATUS_CODES.ok).send(user))
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  const userId = req.params.id === 'me' ? req.user._id : req.params.id;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(ERROR_MESSAGES.userNotFound);
      }
      res.status(STATUS_CODES.ok).send(user);
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    email, password, name,
  } = req.body;
  if (!email || !password || !name) {
    throw new BadRequestError(ERROR_MESSAGES.userBadRequest);
  }
  return User.findOne({ email })
    .then((admin) => {
      if (admin) {
        throw new ConflictError(ERROR_MESSAGES.userExist);
      }
      return bcrypt.hash(password, 10)
        .then((hash) => User.create({
          email, password: hash, name,
        }))
        .then((user) => res.status(STATUS_CODES.created).send({
          _id: user._id,
          email: user.email,
        }));
    })
    .catch(next);
};

module.exports.signin = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError(ERROR_MESSAGES.userBadCredentials);
      }
      const token = jwt.sign({ _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : DEV_KEY, { expiresIn: '7d' });
      res.status(STATUS_CODES.ok).send({ token });
    })
    .catch(next);
};
