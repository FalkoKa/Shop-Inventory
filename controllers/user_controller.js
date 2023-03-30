const { resolveInclude } = require('ejs');
const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');
const isLoggedIn = require('./../middlewares/isLoggedIn');
const User = require('./../models/user_model');

router.get('/signup', isLoggedIn, (req, res) => {
  res.render('signup');
});

router.post('/signup', (req, res) => {
  const { username, email, password, password2 } = req.body;

  if (password !== password2) {
    return res.render('signup', { message: `Passwords dont't match` });
  }

  const sql = `SELECT * FROM users WHERE email = $1;`;
  db.query(sql, [email], (err, dbRes) => {
    if (dbRes.rows.length !== 0) {
      return res.render('signup', { message: 'Email already exists' });
    }
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(password, salt, (err, digestedPassword) => {
        const sql = `INSERT INTO users (email, username, password_digest, isuser, isadmin) VALUES ($1, $2, $3, $4, $5) RETURNING id, username, isuser, isAdmin;`;
        db.query(
          sql,
          [email, username, digestedPassword, false, false],
          (err, dbRes) => {
            if (err) {
              console.log(err);
            } else {
              req.session.userId = dbRes.rows[0].id;
              req.session.isUser = dbRes.rows[0].isuser;
              req.session.isAdmin = dbRes.rows[0].isadmin;
              req.session.username = dbRes.rows[0].username;
              res.redirect('/categories');
            }
          }
        );
      });
    });
  });
});

router.delete('/user/:id', (req, res, next) => {
  User.delete(req.params.id)
    .then(() => res.redirect('/admin/dashboard'))
    .catch(next);
});

module.exports = router;
