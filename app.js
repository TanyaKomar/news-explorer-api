const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const { celebrate, errors } = require('celebrate');
const Joi = require('joi');

const app = express();
const jsonParser = bodyParser.json();

const { PORT = 3000 } = process.env;

const { signin, createUser } = require('./controllers/users');
const auth = require('./middleware/auth');
const routes = require('./routes/index');
const NotFoundError = require('./errors/not-found-err');
const errorHandler = require('./middleware/errorHandler');
const { requestLogger, errorLogger } = require('./middleware/logger');
const { DB_ADDRESS, ERROR_MESSAGES } = require('./utils/constants');
const { limiter } = require('./utils/limiter');

mongoose.connect(DB_ADDRESS, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(jsonParser);
app.use(cors());
app.use(helmet());
app.use(requestLogger);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), signin);
app.use(auth);
app.use('/', routes);

app.use(errorLogger);
app.use(errors());
app.use(() => {
  throw new NotFoundError(ERROR_MESSAGES.notFound);
});
app.use(express.static(path.join(__dirname, 'public')));
app.use(errorHandler);
app.use(limiter);
app.listen(PORT, () => {
  console.log(`Link to the server: ${PORT}`);
});
