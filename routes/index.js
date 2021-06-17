const router = require('express').Router();

const users = require('./users');
const articles = require('./articles');
const auth = require('../middleware/auth');

router.use('/users', auth, users);
router.use('/articles', auth, articles);

module.exports = router;
