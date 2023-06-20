const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const VALIDATION_CODE = 400;
const NOTFOUNDERROR_CODE = 404;

const getUsers = (req, res) => User.find({})
  .then((users) => res.send(users));

const getUserById = (req, res, next) => {
  const { id } = req.params;

  return User.findById(id)
    .then((user) => {
      if (!user) {
        return res.status(NOTFOUNDERROR_CODE).send({ message: 'Пользователь по указанному _id не найден' });
      }
      return res.send(user);
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email,
  } = req.body;

  bcrypt.hash(req.body.password, 8)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((newUser) => res.status(201).send(newUser))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(VALIDATION_CODE).send({ message: 'Переданы некорректные данные при создании пользователя' });
      }
      return next(err);
    });
};

const updateUserData = (req, res, next) => {
  const { name, about } = req.body;
  return User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { runValidators: true },
  )
    .then((user) => {
      if (!user) {
        return res.status(NOTFOUNDERROR_CODE).send({ message: 'Пользователь по указанному _id не найден' });
      }
      return res.send(user);
    })
    .catch(next);
};

const updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  return User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { runValidators: true },
  )
    .then((user) => {
      if (!user) {
        return res.status(NOTFOUNDERROR_CODE).send({ message: 'Пользователь по указанному _id не найден' });
      }
      return res.status(200).send(user);
    })
    .catch(next);
};

const login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then(() => {
      const token = jwt.sign({ _id: 'd285e3dceed844f902650f40' }, 'super-strong-secret', { expiresIn: '7d' });

      res.send({ token });
    })
    .catch((err) => {
      res.status(401).send({ message: err.message });
    });
};

const getMyData = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        return res.status(NOTFOUNDERROR_CODE).send({ message: 'Пользователь по указанному _id не найден' });
      }
      return res.status(200).send(user);
    })
    .catch(next);
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUserData,
  updateUserAvatar,
  login,
  getMyData,
  VALIDATION_CODE,
  NOTFOUNDERROR_CODE,
};
