function isLoggedIn(req, res, next) {
  if (!req.session.userId) {
    return next();
  } else {
    res.redirect('/categories');
  }
}

module.exports = isLoggedIn;
