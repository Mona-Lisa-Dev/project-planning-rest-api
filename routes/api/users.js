const express = require('express');
const router = express.Router();
const {
  signup,
  login,
  // findEmail,
  getAllUsers,
  getCurrentUser,
  logout,
} = require('../../controllers/users');
const {
  validateSignupUser,
  validateLoginUser,
} = require('../../validation/users');
const guard = require('../../helpers/guard');

router.get('/', getAllUsers);
router.post('/signup', validateSignupUser, signup);
router.post('/login', validateLoginUser, login);
// router.get('/find', findEmail);
router.get('/current', guard, getCurrentUser);
router.post('/logout', guard, logout);

module.exports = router;
