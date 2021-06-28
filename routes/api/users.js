const express = require('express');
const router = express.Router();
const {
  signup,
  login,
  findUserByEmail,
  getCurrentUser,
  logout,
} = require('../../controllers/users');
const {
  validateSignupUser,
  validateLoginUser,
} = require('../../validation/users');
const guard = require('../../helpers/guard');

router.get('/', findUserByEmail); // enter data: raw body JSON format - returns id, name, email
router.post('/signup', validateSignupUser, signup);
router.post('/login', validateLoginUser, login);
router.get('/current', guard, getCurrentUser);
router.post('/logout', guard, logout);

module.exports = router;
