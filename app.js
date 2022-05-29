require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { errors } = require('celebrate');
const bodyParser = require('body-parser');
const cors = require('cors');
const { limiter } = require('./middlewares/limiter');
const errorHandler = require('./middlewares/errorHandler');

const router = require('./routers');

const { requestLogger, errorLogger } = require('./middlewares/logger');
const { PORT, MONGO_URL } = require('./utils/config');

mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
});

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(requestLogger); // подключаем логгер запросов
app.use('*', cors());
app.options('*', cors());

app.use('/', router);

app.use(helmet());
app.use(errorLogger); // подключаем логгер ошибок
app.use(limiter);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`application run on port ${PORT}`);
});
