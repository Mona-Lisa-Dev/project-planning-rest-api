const express = require('express');
const router = express.Router();
const {
  signup,
  login,
  findEmail,
  getCurrentUser,
  logout,
} = require('../../controllers/users');
const {
  validateSignupUser,
  validateLoginUser,
} = require('../../validation/users');
const guard = require('../../helpers/guard');

router.post('/signup', validateSignupUser, signup);
router.post('/login', validateLoginUser, login);
router.get('/find', findEmail); // test endpoint to get user from DB
router.get('/current', guard, getCurrentUser);
router.post('/logout', guard, logout);

module.exports = router;
