const express = require('express');
const router = express.Router();
const {
  signup,
  signin,
  findEmail,
  logout,
} = require('../../controllers/users');
const {
  validateSignupUser,
  validateSigninUser,
} = require('../../validation/users');
const guard = require('../../helpers/guard');

router.post('/signup', validateSignupUser, signup);
router.post('/signin', validateSigninUser, signin);
router.get('/find', findEmail); // test endpoint to get user from DB
router.post('/logout', guard, logout);

module.exports = router;
