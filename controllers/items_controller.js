const express = require('express');
const router = express.Router();
const db = require('../db');
const ensureUser = require('./../middlewares/ensure_user');
const ensureAdminOrCreator = require('./../middlewares/ensure_admin_creator');
const upload = require('./../middlewares/upload');
const Item = require('./../models/item_model');
const Category = require('../models/category_model');
const Comment = require('./../models/comment_model');

router.get('/', (req, res, next) => {
  Item.selectAll()
    .then((items) => res.render('items', { items }))
    .catch(next);
});

router.post('/sort', (req, res) => {
  let sql = '';
  if (req.body.sort === 'high') {
    sql = `SELECT * FROM items ORDER BY price ASC`;
  } else if (req.body.sort === 'low') {
    sql = `SELECT * FROM items ORDER BY price DESC`;
  } else if (req.body.sort === 'alpha') {
    sql = `SELECT * FROM items ORDER BY title`;
  } else {
    sql = `SELECT * FROM items ORDER BY item_id;`;
  }

  db.query(
    'SELECT category_id, category_name FROM categories ORDER BY category_id;',
    (err, dbRes) => {
      if (err) {
        console.log(err);
      }
      const categories = dbRes.rows;
      db.query(sql, (err, dbRes) => {
        if (err) {
          console.log(err);
        }
        const items = dbRes.rows;
        res.render('items', { items, categories });
      });
    }
  );
});

router.post('/filter', (req, res) => {
  const categoryID = req.body.filter;
  db.query(
    'SELECT category_id, category_name FROM categories ORDER BY category_id;',
    (err, dbRes) => {
      if (err) {
        console.log(err);
      }
      const categories = dbRes.rows;
      db.query(
        'SELECT * FROM items WHERE cat_id = $1',
        [categoryID],
        (err, dbRes) => {
          if (err) {
            console.log(err);
          }
          const items = dbRes.rows;
          res.render('items', { items, categories });
        }
      );
    }
  );
});

router.get('/search', (req, res) => {
  const searchTerm = '%' + req.query.q + '%';
  db.query(
    'SELECT category_id, category_name FROM categories ORDER BY category_id;',
    (err, dbRes) => {
      if (err) {
        console.log(err);
      }
      const categories = dbRes.rows;

      db.query(
        `SELECT * FROM items WHERE title ILIKE '${searchTerm}';`,
        (err, dbRes) => {
          if (err) {
            console.log(err);
          }
          const items = dbRes.rows;
          res.render('items', { categories, items });
        }
      );
    }
  );
});

router.get('/new', ensureUser, (req, res) => {
  res.render('create_item');
});

router.post('/new', ensureUser, upload.single('uploadedFile'), (req, res) => {
  let imageURL = '';
  if (typeof req.file === 'undefined') {
    imageURL = req.body.image_url;
  } else {
    imageURL = req.file.path;
  }

  Item.insert(
    req.body.title,
    req.body.item_description,
    imageURL,
    req.body.price,
    req.body.stock,
    req.body.user_id,
    req.body.cat_id
  ).then(() => res.redirect('/items'));
});

router.get('/:id/edit', ensureUser, ensureAdminOrCreator, (req, res, next) => {
  Item.selectById(req.params.id)
    .then((item) => res.render('item_edit', { item }))
    .catch(next);
});

router.get('/:id', async (req, res, next) => {
  try {
    let item = await Item.selectById(req.params.id);
    let category = await db
      .query(
        'SELECT category_id, category_name FROM categories WHERE category_id = $1;',
        [item.cat_id]
      )
      .then((res) => res.rows[0]);
    let comments = await Comment.getByIdWithUser(req.params.id);

    Promise.all([item, category, comments])
      .then((result) => {
        console.log(result);
        const [item, category, comments] = result;
        res.render('item_details', { item, category, comments });
      })
      .catch(next);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', ensureUser, ensureAdminOrCreator, (req, res) => {
  Item.update(
    req.body.title,
    req.body.item_description,
    req.body.image_url,
    req.body.price,
    req.body.stock,
    req.body.user_id,
    req.body.cat_id,
    req.params.id
  ).then(() => res.redirect('/items'));
});

router.delete('/:id', ensureUser, ensureAdminOrCreator, (req, res) => {
  Item.delete(req.params.id).then(() => res.redirect('/items'));
});

module.exports = router;
