'use strict';
const express = require('express');
const authRouter = express.Router();
const AuthController = require('../controllers/auth.controller');
const errorCatcher = require('../utils/error-catcher');

authRouter.get(
    '/oauth/sign-in',
    errorCatcher(AuthController.SignInByOauth)
);

authRouter.post('/oauth/sign-out', errorCatcher(AuthController.SignOut));

authRouter.get('/user', errorCatcher(AuthController.getUser));

module.exports = authRouter;
