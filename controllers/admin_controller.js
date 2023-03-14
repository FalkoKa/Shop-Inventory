const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/dashboard', (req, res) => {
  const sql = 'SELECT * from users ORDER BY id;';
  db.query(sql, (err, dbRes) => {
    const users = dbRes.rows;
    res.render('admin_dashboard', { users });
  });
});

router.post('/dashboard', (req, res) => {
  const userIds = req.body.id;
  console.log(userIds);
  const isUser = req.body.isUser;
  const isUserTrue = isUser.map((element) => {
    return element === 'true' ? (element = true) : (element = false);
  });
  console.log(isUserTrue);
  const data = req.body.data;
  console.log(data);
  // console.log(isUser);

  console.log(req.body.isAdmin);

  // userIds.forEach((element) => {
  //   const sql = `UPDATE users SET isuser = '', isadmin = '' WHERE id = ${element}`;
  //   const values = [];
  //   db.query(sql, values, (err, dbRes) => {
  //     if (err) {
  //       console.log(err);
  //     }
  //   });
  // });

  const sql = 'SELECT * from users ORDER BY id;';
  db.query(sql, (err, dbRes) => {
    const users = dbRes.rows;
    res.render('admin_dashboard', { users });
  });
});

// create new admin
// delete admin

module.exports = router;
