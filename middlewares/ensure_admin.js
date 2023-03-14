function ensureAdmin(req, res, next) {
  if (req.session.isAdmin) return next();
  res.render('access_denied', { user: req.session.username });
}

module.exports = ensureAdmin;
