const db = require('./../db');

class Comment {
  static getByIdWithUser(id) {
    return db
      .query(
        'SELECT comment_id, input, post_date::date, fk_user_id, username FROM comments JOIN users ON fk_user_id  = id WHERE fk_item_key = $1 ORDER BY post_date',
        [id]
      )
      .then((res) => res.rows);
  }

  static insert(input, itemKey, userId) {
    return db.query(
      'INSERT INTO comments (input, fk_item_key, fk_user_id) VALUES ($1, $2, $3);',
      [input, itemKey, userId]
    );
  }

  static delete(id) {
    return db.query('DELETE FROM comments WHERE comment_id = $1;', [id]);
  }
}

module.exports = Comment;
