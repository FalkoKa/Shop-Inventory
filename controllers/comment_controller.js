const express = require('express');
const router = express.Router();
const db = require('../db');
const setCurrentUser = require('../middlewares/set_current_user');
const ensureUser = require('./../middlewares/ensure_user');
const ensureAdminOrCreator2 = require('./../middlewares/ensure_admin_creator2');
const Comment = require('./../models/comment_model');

router.post('/', ensureUser, (req, res) => {
  Comment.insert(
    req.body.input,
    req.body.fk_item_key,
    req.body.fk_user_id
  ).then(() => res.redirect(`/items/${req.body.itemId}`));
});

router.delete('/:id', ensureAdminOrCreator2, (req, res) => {
  Comment.delete(req.params.id).then(() =>
    res.redirect(`/items/${req.body.itemId}`)
  );
});

module.exports = router;
