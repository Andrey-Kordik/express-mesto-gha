const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/users');
const cardRoutes = require('./routes/cards');
const authorization = require('./middlewares/authorization');

const app = express();

const { PORT = 3000 } = process.env;
mongoose.connect('mongodb://127.0.0.1:27017/mestodb').then(() => {
  console.log('connected to db');
});

app.use(bodyParser.json());

app.use(authorization);

app.get('/', (req, res) => {
  res.send('<p>немного html</p>');
});
app.use(userRoutes);
app.use(cardRoutes);

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
