const db = require('../db');

class Category {
  static selectAll() {
    return db
      .query('SELECT * FROM categories ORDER BY category_id;')
      .then((result) => result.rows);
  }

  static selectById(id) {
    return db
      .query('SELECT * FROM categories WHERE category_id = $1', [id])
      .then((result) => {
        if (result.rows[0] === 0) {
          throw new Error(`record with id ${id} not found`);
        }
        return result.rows[0];
      });
  }

  static insert(name, description) {
    return db.query(
      'INSERT INTO categories (category_name, category_description) VALUES ($1, $2);',
      [name, description]
    );
  }

  static update(name, description, id) {
    return db.query(
      'UPDATE categories SET category_name = $1, category_description = $2 WHERE category_id = $3',
      [name, description, id]
    );
  }

  static delete(id) {
    return db.query('DELETE FROM categories WHERE category_id = $1;', [id]);
  }

  static getByIdAndItems() {}
}

module.exports = Category;
