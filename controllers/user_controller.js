const { resolveInclude } = require('ejs');
const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');

router.get('/signup', (req, res) => {
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

// router.put('/user/:id/edit', (req, res) => {
//   db.query(sql, [], (err, dbRes) => {
//     if (err) {
//       console.log(err)
//     }
//   })
// })

router.post('/user/:id/delete', (req, res) => {
  db.query(
    'DELETE FROM users WHERE id = $1;',
    [req.params.id],
    (err, dbRes) => {
      if (err) {
        console.log(err);
      }
      res.render('admin_dashboard');
    }
  );
});
/*


-> this is signup >>> router.get("/users/new") // get new user form


router.delete("/users/:id") // delete a user                -> on admin dashboard?
router.put("/users/:id") // update single user              -> on admin dashboard?
router.get("/users/:id/edit") // get existing user form     -> on admin dashboard?
router.get("/users/:id") // get single user                 -> on admit dashboard?


*/

module.exports = router;
