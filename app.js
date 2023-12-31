const express = require('express');
const mongoose = require('mongoose');

const { PORT = 3000 } = process.env;
const app = express();

app.use(express.json());

mongoose.connect('mongodb://localhost:27017/mestodb', {});

app.use((req, res, next) => {
  req.user = {
    _id: '658ef7d49f58e88a2681a306',
  };

  next();
});

app.use('/', require('./routes/index'));

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
