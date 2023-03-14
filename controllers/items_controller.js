const express = require('express');
const router = express.Router();
const db = require('../db');
const ensureUser = require('./../middlewares/ensure_user');

router.get('/', (req, res) => {
  const sql = `SELECT * FROM items ORDER BY item_id;`;

  db.query(sql, (err, dbRes) => {
    if (err) {
      console.log(err);
    }
    const items = dbRes.rows;
    res.render('items', { items });
  });
});

router.get('/new', ensureUser, (req, res) => {
  db.query(
    'SELECT category_id, category_name FROM categories ORDER BY category_id;',
    (err, dbRes) => {
      if (err) {
        console.log(err);
      }
      const categories = dbRes.rows;
      console.log(categories);
      res.render('create_item', { categories });
    }
  );
});

router.post('/', ensureUser, (req, res) => {
  const sql =
    'INSERT INTO items (title, item_description, image_url, price, stock, user_id, cat_id) VALUES ($1, $2, $3, $4, $5, $6, $7);';
  console.log(req.body);
  const values = [
    req.body.title,
    req.body.item_description,
    req.body.image_url,
    req.body.price,
    req.body.stock,
    req.body.user_id,
    req.body.cat_id,
  ];

  db.query(sql, values, (err, dbRes) => {
    if (err) {
      console.log(err);
    }
    res.redirect('/items');
  });
});

router.get('/:id/edit', ensureUser, (req, res) => {
  db.query(
    `SELECT * FROM items WHERE item_id = $1;`,
    [req.params.id],
    (err, dbRes) => {
      if (err) {
        console.log(err);
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
          const category = dbRes.rows[0];
          res.render('item_details', { item, category });
        }
      );
    }
  );
});

router.put('/:id', ensureUser, (req, res) => {
  db.query(
    'UPDATE items SET title = $1, item_description = $2, image_url = $3, price = $4, stock = $5, user_id = $6, cat_id = $7 WHERE item_id = $8',
    [
      req.body.title,
      req.body.item_description,
      req.body.image_url,
      req.body.price,
      req.body.stock,
      req.body.user_id,
      req.body.cat_id,
      req.params.id,
    ],
    (err, dbRes) => {
      if (err) {
        console.log(err);
      }
      res.redirect('/items');
    }
  );
});

router.delete('/:id', ensureUser, (req, res) => {
  db.query(
    'DELETE FROM items WHERE item_id = $1;',
    [req.params.id],
    (err, dbRes) => {
      if (err) {
        console.log(err);
      }
      res.redirect('/items');
    }
  );
});

module.exports = router;
