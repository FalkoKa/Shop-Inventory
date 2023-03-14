function ensureUser(req, res, next) {
  if (req.session.isUser) return next();
  if (req.session.userId)
    return res.render('access_denied', {
      user: req.session.username,
    });
  res.render('login', { message: 'Please log in to perfom this action' });
}

module.exports = ensureUser;
