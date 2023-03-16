const db = require('./../db');

function getCurrentCategories(req, res, next) {
  db.query(
    'SELECT category_id, category_name FROM categories ORDER BY category_id;',
    (err, dbRes) => {
      res.locals.currentCategories = dbRes.rows;
      console.log(res.locals.currentCategories);
      next();
    }
  );
}

module.exports = getCurrentCategories;
