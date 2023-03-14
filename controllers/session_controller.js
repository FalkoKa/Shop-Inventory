const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/sessions', (req, res) => {});

router.delete('/sessions', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

module.exports = router;
