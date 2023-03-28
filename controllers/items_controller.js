const express = require('express');
const router = express.Router();
const db = require('../db');
const ensureUser = require('./../middlewares/ensure_user');
const ensureAdminOrCreator = require('./../middlewares/ensure_admin_creator');
const upload = require('./../middlewares/upload');
const Item = require('./../models/item_model');

router.get('/', (req, res) => {
  db.query(
    'SELECT category_id, category_name FROM categories ORDER BY category_id;',
    (err, dbRes) => {
      if (err) {
        console.log(err);
      }
      const categories = dbRes.rows;
      let sql = `SELECT * FROM items ORDER BY item_id;`;

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
  db.query(
    'SELECT category_id, category_name FROM categories ORDER BY category_id;',
    (err, dbRes) => {
      if (err) {
        console.log(err);
      }
      const categories = dbRes.rows;
      res.render('create_item', { categories });
    }
  );
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

router.get('/:id/edit', ensureUser, ensureAdminOrCreator, (req, res) => {
  db.query(
    `SELECT * FROM items WHERE item_id = $1;`,
    [req.params.id],
    (err, dbRes) => {
      if (err) {
        console.log(err);
        return res.render('404');
      }
      const item = dbRes.rows[0];
      db.query(
        `SELECT category_id, category_name FROM categories ORDER BY category_id;`,
        (err, dbRes) => {
          const categories = dbRes.rows;
          res.render('item_edit', { item, categories });
        }
      );
    }
  );
});

router.get('/:id', (req, res) => {
  db.query(
    `SELECT * FROM items WHERE item_id = $1;`,
    [req.params.id],
    (err, dbRes) => {
      if (err) {
        console.log(err);
      }
      const item = dbRes.rows[0];

      db.query(
        `SELECT category_id, category_name FROM categories WHERE category_id = ${item.cat_id}`,
        (err, dbRes) => {
          if (err) {
            return res.redirect('/items');
          }
          const category = dbRes.rows[0];

          db.query(
            'SELECT comment_id, input, post_date::date, fk_user_id, username FROM comments JOIN users ON fk_user_id  = id WHERE fk_item_key = $1 ORDER BY post_date',
            [req.params.id],
            (err, dbRes) => {
              if (err) {
                console.log(err);
                return res.redirect('/items');
              }
              const comments = dbRes.rows;

              res.render('item_details', { item, category, comments });
            }
          );
        }
      );
    }
  );
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
