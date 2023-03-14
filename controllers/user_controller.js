const { resolveInclude } = require('ejs');
const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/signup', (req, res) => {
  res.render('signup');
});

/*


-> this is signup >>> router.get("/users/new") // get new user form


router.delete("/users/:id") // delete a user                -> on admin dashboard?
router.put("/users/:id") // update single user              -> on admin dashboard?
router.get("/users/:id/edit") // get existing user form     -> on admin dashboard?
router.get("/users/:id") // get single user                 -> on admit dashboard?


*/

module.exports = router;
