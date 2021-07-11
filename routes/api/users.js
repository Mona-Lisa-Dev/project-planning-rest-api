const express = require('express');
const router = express.Router();
const ctrl = require('../../controllers/users');
const valid = require('../../validation/users');
const guard = require('../../helpers/guard');

router.post('/', guard, valid.validateEmail, ctrl.findUserByEmail); // TODO  DELETE??? // enter data: raw body JSON format - returns id, name, email
router.post('/signup', valid.validateSignupUser, ctrl.signup);
router.post('/login', valid.validateLoginUser, ctrl.login);
router.get('/current', guard, ctrl.getCurrentUser);
router.post('/logout', guard, ctrl.logout);
router.get('/google', ctrl.googleAuth);
router.get('/google-redirect', ctrl.googleRedirect);
router.get('/google-user', ctrl.findGoogleUser);
// router.get('/frontend-redirect', ctrl.frontRedirect);

module.exports = router;
