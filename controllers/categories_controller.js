const express = require('express');
const router = express.Router();
const db = require('../db');
const setCurrentUser = require('../middlewares/set_current_user');

router.get('/', (req, res) => {
  console.log(req.session.id);
  console.log(req.session.userId);
  console.log(req.session.isUser);
  console.log(req.session.isAdmin);
  const sql = `SELECT * FROM categories ORDER BY category_id;`;

  db.query(sql, (err, dbRes) => {
    if (err) {
      console.log(err);
    }
    const categories = dbRes.rows;
    res.render('categories', { categories });
  });
});

router.get('/new', (req, res) => {
  res.render('create_category');
});

router.post('/', (req, res) => {
  const sql =
    'INSERT INTO categories (category_name, category_description) VALUES ($1, $2);';

  db.query(
    sql,
    [req.body.category_name, req.body.category_description],
    (err, dbRes) => {
      if (err) {
        console.log(err);
      }
      res.redirect('/categories');
    }
  );
});

router.get('/:id/edit', (req, res) => {
  db.query(
    `SELECT * FROM categories WHERE category_id = $1;`,
    [req.params.id],
    (err, dbRes) => {
      if (err) {
        console.log(err);
      }
      const categoryDetails = dbRes.rows[0];
      res.render('category_edit', { categoryDetails });
    }
  );
});

router.get('/:id', (req, res) => {
  db.query(
    `SELECT * FROM categories WHERE category_id = $1;`,
    [req.params.id],
    (err, dbRes) => {
      if (err) {
        console.log(err);
      }
      const categoryDetails = dbRes.rows[0];
      db.query(
        `SELECT * FROM items WHERE cat_id = ${req.params.id}`,
        (err, dbRes) => {
          const categoryItems = dbRes.rows;
          res.render('category_details', { categoryDetails, categoryItems });
        }
      );
    }
  );
});

router.put('/:id', (req, res) => {
  db.query(
    'UPDATE categories SET category_name = $1, category_description = $2 WHERE category_id = $3',
    [req.body.category_name, req.body.category_description, req.params.id],
    (err, dbRes) => {
      if (err) {
        console.log(err);
      }
      res.redirect('/categories');
    }
  );
});

router.delete('/:id', (req, res) => {
  db.query(
    'DELETE FROM categories WHERE category_id = $1;',
    [req.params.id],
    (err, dbRes) => {
      if (err) {
        console.log(err);
      }
      res.redirect('/categories');
    }
  );
});

module.exports = router;
