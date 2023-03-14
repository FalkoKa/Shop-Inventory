const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/dashboard', (req, res) => {
  res.render('admin_dashboard');
});

router.post('/dashboard', (req, res) => {
  res.redirect('admin_dashboard');
});

module.exports = router;
