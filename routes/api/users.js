const express = require('express');
const router = express.Router();
const {
  signup,
  // login,
  // getUser,
  // logout,
} = require('../../controllers/users');

router.post('/signup', signup);
// router.post('/login', login);
// router.post('/logout', guard, logout);

module.exports = router;
