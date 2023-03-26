const express = require('express');
const router = express.Router();
const db = require('../db');
const setCurrentUser = require('../middlewares/set_current_user');
const ensureUser = require('./../middlewares/ensure_user');
const ensureAdmin = require('./../middlewares/ensure_admin');
const Category = require('./../models/category_model');

router.get('/', (req, res) => {
  Category.selectAll().then((categories) =>
    res.render('categories', { categories })
  );
});

router.get('/new', ensureUser, (req, res) => {
  res.render('create_category');
});

router.post('/', ensureUser, (req, res) => {
  Category.insert(req.body.category_name, req.body.category_description).then(
    () => res.redirect('/categories')
  );
});

router.get('/:id/edit', ensureAdmin, (req, res) => {
  Category.selectById(req.params.id)
    .then((categoryDetails) => res.render('category_edit', { categoryDetails }))
    .catch((err) => next(err)); // .catch(next) is not working at all
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
          if (err) {
            console.log(err);
          }
          const categoryItems = dbRes.rows;
          res.render('category_details', { categoryDetails, categoryItems });
        }
      );
    }
  );
});

router.put('/:id', ensureAdmin, (req, res) => {
  Category.update(
    req.body.category_name,
    req.body.category_description,
    req.params.id
  ).then(() => res.redirect('/categories'));
});

router.delete('/:id', ensureAdmin, (req, res) => {
  Category.delete(req.params.id).then(() => res.redirect('/categories'));
});

module.exports = router;
