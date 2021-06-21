const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

const {
  getArticles, createArticle, deleteArticleById,
} = require('../controllers/articles');

const method = (value) => {
  const result = validator.isURL(value);
  if (result) {
    return value;
  }
  throw new Error('URL is not valid');
};

router.get('/', getArticles);
router.post('/', celebrate({
  body: Joi.object().keys({
    keyword: Joi.string().required(),
    title: Joi.string().required(),
    text: Joi.string().required(),
    date: Joi.string().required(),
    source: Joi.string().required(),
    link: Joi.string().required().custom(method),
    image: Joi.string().required().custom(method),
  }),
}), createArticle);

router.delete('/:articleId', celebrate({
  params: Joi.object().keys({
    articleId: Joi.string().required().hex().length(24),
  }),
}), deleteArticleById);

module.exports = router;
