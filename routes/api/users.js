const express = require('express');
const router = express.Router();
const {
  signup,
  signin,
  // getUser,
  // logout,
} = require('../../controllers/users');

router.post('/signup', signup);
router.post('/signin', signin);
// router.post('/logout', guard, logout);

module.exports = router;
