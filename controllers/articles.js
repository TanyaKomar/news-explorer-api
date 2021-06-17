const Article = require('../models/article');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const UnauthorizedError = require('../errors/unauthorized-err');
const ForbiddenError = require('../errors/forbidden-err');
const { ERROR_MESSAGES, STATUS_CODES } = require('../utils/constants');

module.exports.getArticles = (req, res, next) => {
  Article.find({})
    .then((article) => res.status(STATUS_CODES.ok).send(article))
    .catch(next);
};

module.exports.createArticle = (req, res, next) => {
  const {
    keyword, title, text, date, source, link, image,
  } = req.body;
  Article.create({
    keyword, title, text, date, source, link, image, owner: req.user._id,
  })
    .then((article) => res.status(STATUS_CODES.created).send(article))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError(ERROR_MESSAGES.articleBadRequest);
      }
    })
    .catch(next);
};

module.exports.deleteArticleById = (req, res, next) => {
  Article.findByIdAndRemove(req.params.ArticleId)
    .then((article) => {
      if (article && req.user._id.toString() !== article.owner.toString()) {
        throw new ForbiddenError(ERROR_MESSAGES.articleOwnedOnly);
      }
      if (article) {
        res.status(STATUS_CODES.ok).send(article);
      } else if (!article) {
        throw new NotFoundError(ERROR_MESSAGES.articleNotFound);
      } else {
        throw new UnauthorizedError(ERROR_MESSAGES.unauthorized);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new NotFoundError(ERROR_MESSAGES.articleNotFound);
      }
    })
    .catch(next);
};
