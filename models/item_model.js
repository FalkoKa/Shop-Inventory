const db = require('../db');

class Item {
  static selectAll() {
    return db
      .query('SELECT * FROM items ORDER BY item_id;')
      .then((result) => result.rows);
  }

  static selectById(id) {
    return db
      .query('SELECT * FROM items WHERE item_id = $1', [id])
      .then((result) => {
        if (result.rows.length === 0) {
          throw new Error(`record with id ${id} not found`);
        }
        return result.rows[0];
      });
  }

  static insert(title, description, imageURL, price, stock, user_id, cat_id) {
    return db.query(
      'INSERT INTO items (title, item_description, image_url, price, stock, user_id, cat_id) VALUES ($1, $2, $3, $4, $5, $6, $7);',
      [title, description, imageURL, price, stock, user_id, cat_id]
    );
  }

  static update(
    title,
    description,
    imageURL,
    price,
    stock,
    user_id,
    cat_id,
    id
  ) {
    return db.query(
      'UPDATE items SET title = $1, item_description = $2, image_url = $3, price = $4, stock = $5, user_id = $6, cat_id = $7 WHERE item_id = $8',
      [title, description, imageURL, price, stock, user_id, cat_id, id]
    );
  }

  static delete(id) {
    return db.query('DELETE FROM items WHERE item_id = $1;', [id]);
  }

  static selectByCategoryId(id) {
    return db
      .query(`SELECT * FROM items WHERE cat_id = $1;`, [id])
      .then((res) => res.rows);
  }
}

module.exports = Item;
