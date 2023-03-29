const express = require('express');
const router = express.Router();
const db = require('../db');
const setCurrentUser = require('../middlewares/set_current_user');
const ensureUser = require('./../middlewares/ensure_user');
const ensureAdmin = require('./../middlewares/ensure_admin');
const Category = require('./../models/category_model');
const Item = require('./../models/item_model');

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

router.get('/:id/edit', ensureAdmin, (req, res, next) => {
  Category.selectById(req.params.id)
    .then((categoryDetails) => res.render('category_edit', { categoryDetails }))
    .catch(next);
});

router.get('/:id', (req, res, next) => {
  let category = Category.selectById(req.params.id);
  let ItemsOfCategory = Item.selectByCategoryId(req.params.id);

  Promise.all([category, ItemsOfCategory])
    .then((result) => {
      console.log(result);
      const [categoryDetails, categoryItems] = result;
      res.render('category_details', { categoryDetails, categoryItems });
    })
    .catch(next);
});

router.put('/:id', ensureAdmin, (req, res, next) => {
  Category.update(
    req.body.category_name,
    req.body.category_description,
    req.params.id
  )
    .then(() => res.redirect('/categories'))
    .catch(next);
});

router.delete('/:id', ensureAdmin, (req, res, next) => {
  Category.delete(req.params.id)
    .then(() => res.redirect('/categories'))
    .catch(next);
});

module.exports = router;
