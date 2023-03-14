const db = require('../db');

function setCurrentUser(req, res, next) {
  res.locals.currentUser = {};
  const { userId } = req.session;

  if (userId) {
    const sql = `SELECT id, email, username FROM users WHERE id = ${userId}`;
    db.query(sql, (err, dbRes) => {
      if (err) {
        console.log(err);
      } else {
        res.locals.currentUser = dbRes.rows[0];
        next();
      }
    });
  } else {
    next();
  }
}

module.exports = setCurrentUser;
