const Card = require('../models/card');
const { VALIDATION_CODE, NOTFOUNDERROR_CODE } = require('./users');

const getCards = (req, res) => Card.find({})
  .then((cards) => res.status(200).send(cards));

const deleteCard = (req, res, next) => {
  const owner = req.user._id;
  Card.findOne({ owner })
    .then((card) => {
      if (!card.owner.equals(owner)) {
        res.status(401).send({ message: 'Нет прав на удаление этой карточки' });
      } else {
        return Card.deleteOne(card)
          .then(() => res.status(200).send({ message: 'Карточка удалена' }));
      }
      return next();
    });
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((newCard) => res.status(201).send(newCard))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(VALIDATION_CODE).send({ message: 'Переданы некорректные данные при создании карточки.' });
      }
      return next(err);
    });
};

const putLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(NOTFOUNDERROR_CODE).send({ message: 'Передан несуществующий _id карточки.' });
      }
      return res.send(card);
    })
    .catch(next);
};

const deleteLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(NOTFOUNDERROR_CODE).send({ message: 'Передан несуществующий _id карточки.' });
      }
      return res.send(card);
    })
    .catch(next);
};

module.exports = {
  getCards, deleteCard, createCard, putLike, deleteLike,
};
