const express = require('express');
const router = express.Router();
const db = require('../db');
const setCurrentUser = require('../middlewares/set_current_user');
const ensureUser = require('./../middlewares/ensure_user');
const ensureAdminOrCreator = require('./../middlewares/ensure_admin_creator');

router.delete('/:id', ensureAdminOrCreator, (req, res) => {
  const sql = 'DELETE FROM comments WHERE comment_id = $1;';
  db.query(sql, [req.params.id], (err, dbRes) => {
    res.redirect(`/items/${req.body.itemId}`);
  });
});

module.exports = router;

// view for editing
