const db = require('../db');

function ensureAdminOrCreator(req, res, next) {
  db.query(
    `SELECT fk_user_id FROM comments WHERE comment_id = '${req.params.id}'`,
    (err, dbRes) => {
      if (err) {
        console.log(err);
      }
      const creator = dbRes.rows[0].fk_user_id;
      console.log(creator);
      if (req.session.userId === creator || req.session.isAdmin) {
        return next();
      } else {
        return res.render('access_denied', {
          user: req.session.username,
        });
      }
    }
  );
}

module.exports = ensureAdminOrCreator;
