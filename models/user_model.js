const db = require('./../db');

class User {
  static selectAll() {
    return db
      .query('SELECT * FROM users ORDER BY id;')
      .then((result) => result.rows);
  }

  static selectByEmail(email) {
    return db
      .query('SELECT * FROM users WHERE email = $1;', [email])
      .then((result) => {
        if (result.rows.length === 0) {
          throw new Error(`user with email ${email} not found`);
        }
        return result.rows[0];
      });
  }

  static insert(email, username, password, isUser, isAdmin) {
    return db
      .query(
        'INSERT INTO users (email, username, password_digest, isuser, isadmin) VALUES ($1, $2, $3, $4, $5) RETURNING id, username, isuser, isAdmin;',
        [email, username, password, isUser, isAdmin]
      )
      .then((result) => result.rows[0]);
  }

  static delete(id) {
    return db.query('DELETE FROM users WHERE id = $1;', [id]);
  }
}

module.exports = User;
