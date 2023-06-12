const authorization = ((req, res, next) => {
  req.user = {
    _id: '6483368ce711963534247a5b',
  };

  next();
});

module.exports = authorization;
