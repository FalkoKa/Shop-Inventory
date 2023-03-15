const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/dashboard', (req, res) => {
  const sql = 'SELECT * from users ORDER BY id;';
  db.query(sql, (err, dbRes) => {
    const users = dbRes.rows;
    res.render('admin_dashboard2', { users });
  });
});

router.get('/dashboard/edit', (req, res) => {
  const sql = 'SELECT * FROM users ORDER BY id;';
  db.query(sql, (err, dbRes) => {
    const users = dbRes.rows;
    res.render('admin_dashboard', { users });
  });
});

router.post('/dashboard/edit', (req, res) => {
  const keys = Object.keys(req.body);

  keys.forEach((element) => {
    if (element.includes('user')) {
      const splitElement = element.split('_');
      db.query(
        `UPDATE users SET isuser = true WHERE id = ${splitElement[1]}`,
        (err, dbRes) => {
          if (err) {
            console.log(err);
          }
        }
      );
    } else if (element.includes('admin')) {
      const splitElement = element.split('_');
      db.query(
        `UPDATE users SET isadmin = true WHERE id = ${splitElement[1]}`,
        (err, dbRes) => {
          if (err) {
            console.log(err);
          }
        }
      );
    }
  });

  // users
  console.log(keys);
  const userIds = keys.reduce((acc, curr) => {
    if (curr.includes('user')) {
      let split = curr.split('_');
      acc.push(Number(split[1]));
    }
    return acc;
  }, []);

  console.log(userIds);

  const sql = `SELECT id FROM users WHERE id NOT IN (${userIds}) ORDER BY id;`;
  db.query(sql, (err, dbRes) => {
    if (err) {
      console.log(err);
    }
    const uncheckedID = dbRes.rows;
    console.log(uncheckedID);

    uncheckedID.forEach((element) => {
      let id = element.id;
      db.query(
        `UPDATE users SET isuser = false WHERE id = ${id};`,
        (err, dbRes) => {
          if (err) {
            console.log(err);
          }
        }
      );
    });
  });

  // admins
  const adminIds = keys.reduce((acc, curr) => {
    if (curr.includes('admin')) {
      let split = curr.split('_');
      acc.push(Number(split[1]));
    }
    return acc;
  }, []);

  const sqlAdmin = `SELECT id FROM users WHERE id NOT IN (${adminIds}) ORDER BY id;`;
  db.query(sqlAdmin, (err, dbRes) => {
    if (err) {
      console.log(err);
    }
    const uncheckedID = dbRes.rows;
    console.log(uncheckedID);

    uncheckedID.forEach((element) => {
      let id = element.id;
      db.query(
        `UPDATE users SET isadmin = false WHERE id = ${id};`,
        (err, dbRes) => {
          if (err) {
            console.log(err);
          }
        }
      );
    });
  });

  res.redirect('/admin/dashboard');
});

module.exports = router;
