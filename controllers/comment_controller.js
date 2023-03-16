const express = require('express');
const router = express.Router();
const db = require('../db');
const setCurrentUser = require('../middlewares/set_current_user');
const ensureUser = require('./../middlewares/ensure_user');
const ensureAdminOrCreator = require('./../middlewares/ensure_admin_creator');

router.post('/', ensureUser, (req, res) => {
  const sql =
    'INSERT INTO comments (input, fk_item_key, fk_user_id) VALUES ($1, $2, $3);';
  db.query(
    sql,
    [req.body.input, req.body.fk_item_key, req.body.fk_user_id],
    (err, dbRes) => {
      if (err) {
        console.log(err);
      }
      res.redirect(`/items/${req.body.itemId}`);
    }
  );
});

router.delete('/:id', ensureAdminOrCreator, (req, res) => {
  const sql = 'DELETE FROM comments WHERE comment_id = $1;';
  db.query(sql, [req.params.id], (err, dbRes) => {
    res.redirect(`/items/${req.body.itemId}`);
  });
});

module.exports = router;

// view for editing
