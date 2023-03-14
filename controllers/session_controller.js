const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');

router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/sessions', (req, res) => {
  const { email, password } = req.body;

  const sql = `SELECT * FROM users WHERE email = $1;`;

  db.query(sql, [email], (err, dbRes) => {
    if (dbRes.rows.length === 0) {
      res.render('login', { message: 'Wrong email or password' });
      return;
    }

    const user = dbRes.rows[0];

    bcrypt.compare(password, user.password_digest, (err, result) => {
      if (result) {
        req.session.userId = user.id;
        req.session.isUser = user.isuser;
        req.session.isAdmin = user.isadmin;
        req.session.username = user.username;
        res.redirect('/categories');
      } else {
        res.render('login', { message: 'Wrong email or password' });
      }
    });
  });
});

router.delete('/sessions', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/categories');
  });
});

module.exports = router;
