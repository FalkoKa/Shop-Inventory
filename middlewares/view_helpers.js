function viewHelpers(req, res, next) {
  res.locals.isLoggedIn = () => {
    if (req.session.userId) {
      return true;
    } else {
      return false;
    }
  };
  res.locals.isAdmin = () => {
    if (req.session.isAdmin) {
      return true;
    } else {
      return false;
    }
  };
  res.locals.isUser = () => {
    if (req.session.isUser) {
      return true;
    } else {
      return false;
    }
  };
  next();
}

module.exports = viewHelpers;
