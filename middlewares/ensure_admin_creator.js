const db = require('../db');

function ensureAdminOrCreator(req, res, next) {
  db.query(`SELECT user_id FROM items WHERE item_id = '${req.params.id}';`)
    .then((result) => {
      const creator = result.rows[0].user_id;
      if (req.session.userId === creator || req.session.isAdmin) {
        return next();
      } else {
        return res.render('access_denied', {
          user: req.session.username,
        });
      }
    })
    .catch(next);
  // db.query(
  //   `SELECT user_id FROM items WHERE item_id = '${req.params.id}'`,
  //   (err, dbRes) => {
  //     if (err) {
  //       console.log(err);
  //     }
  //     const creator = dbRes.rows[0].user_id;
  //     if (req.session.userId === creator || req.session.isAdmin) {
  //       return next();
  //     } else {
  //       return res.render('access_denied', {
  //         user: req.session.username,
  //       });
  //     }
  //   }
  // );
}

module.exports = ensureAdminOrCreator;
