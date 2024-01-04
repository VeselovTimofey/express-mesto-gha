require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const {
  PATH = 'mongodb://localhost:27017/mestodb',
  PORT = 3000,
} = process.env;
const app = express();

app.use(express.json());

mongoose.connect(PATH, {});

app.use('/', require('./routes/index'));

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
