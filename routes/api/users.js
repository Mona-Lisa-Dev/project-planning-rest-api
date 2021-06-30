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
  validateEmail,
} = require('../../validation/users');
const guard = require('../../helpers/guard');
// TODO
router.post('/', guard, validateEmail, findUserByEmail); // TODO  DELETE??? // enter data: raw body JSON format - returns id, name, email
router.post('/signup', validateSignupUser, signup);
router.post('/login', validateLoginUser, login);
router.get('/current', guard, getCurrentUser);
router.post('/logout', guard, logout);

module.exports = router;
