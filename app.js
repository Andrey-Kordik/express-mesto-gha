const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/users');
const cardRoutes = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const { auth } = require('./middlewares/auth');

const app = express();
app.disable('x-powered-by');

app.use(helmet());
app.use(bodyParser.json());

const { PORT = 3000 } = process.env;
mongoose.connect('mongodb://127.0.0.1:27017/mestodb').then(() => {
  console.log('connected to db');
});

app.use(auth);
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.post('/signin', login);
app.post('/signup', createUser);

app.use('*', (req, res) => res.status(401).send({ message: 'Ошибка 404: Страница не найдена' }));

app.use(userRoutes);
app.use(cardRoutes);

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
