// Подключение dotenv для загрузки переменных окружения из файла .env
require('dotenv').config();

// Подключение необходимых библиотек
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { errors } = require('celebrate');
const bodyParser = require('body-parser');
const cors = require('cors');

// Подключение собственных middleware и роутеров
const { limiter } = require('./middlewares/limiter');
const errorHandler = require('./middlewares/errorHandler');
const router = require('./routers');
const { requestLogger, errorLogger } = require('./middlewares/logger');

// Подключение конфигураций из файла config.js
const { PORT, MONGO_URL } = require('./utils/config');

// Создаем экземпляр приложения
const app = express();

// Устанавливаем подключение к MongoDB с использованием строки подключения из переменной окружения MONGO_URL
mongoose.connect(MONGO_URL)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

// Настройка middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Подключаем логгер запросов
app.use(requestLogger);

// Разрешаем кросс-доменные запросы
app.use('*', cors());
app.options('*', cors());

// Подключаем роуты
app.use('/', router);

// Подключаем Helmet для безопасности
app.use(helmet());

// Подключаем логгер ошибок
app.use(errorLogger);

// Применяем лимитирование запросов
app.use(limiter);

// Обработка ошибок
app.use(errors());
app.use(errorHandler);

// Запуск сервера на порту
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
