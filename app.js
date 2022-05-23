require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { PORT, MONGO_URL } = require('./controllers/config');

mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

const app = express();
app.listen(PORT, () => {
  console.log(`application run on port ${PORT}`);
});
