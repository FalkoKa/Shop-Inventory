const express = require('express');
const router = express.Router();
const db = require('../db');
const setCurrentUser = require('../middlewares/set_current_user');
const ensureUser = require('./../middlewares/ensure_user');
const ensureAdmin = require('./../middlewares/ensure_admin');

router.get('/', (req, res) => {
  const sql = `SELECT * FROM categories ORDER BY category_id;`;

  db.query(sql, (err, dbRes) => {
    if (err) {
      console.log(err);
    }
    const categories = dbRes.rows;
    res.render('categories', { categories });
  });
});

router.get('/new', ensureUser, (req, res) => {
  res.render('create_category');
});

router.post('/', ensureUser, (req, res) => {
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

router.get('/:id/edit', ensureAdmin, (req, res) => {
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
  try {
    db.query(
      `SELECT * FROM categories WHERE category_id = $1;`,
      [req.params.id],
      (err, dbRes) => {
        if (err) {
          console.log(err);
          return res.redirect('/categories');
        }
        const categoryDetails = dbRes.rows[0];
        db.query(
          `SELECT * FROM items WHERE cat_id = ${req.params.id}`,
          (err, dbRes) => {
            if (err) {
              console.log(err);
            }
            const categoryItems = dbRes.rows;
            res.render('category_details', { categoryDetails, categoryItems });
          }
        );
      }
    );
  } catch (err) {
    res.send('test');
  }
});

router.put('/:id', ensureAdmin, (req, res) => {
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

router.delete('/:id', ensureAdmin, (req, res) => {
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
