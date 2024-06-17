'use strict';
const express = require('express');
const authRouter = express.Router();
const AuthController = require('../controllers/auth.controller');
const errorCatcher = require('../utils/error-catcher');

const { verifyAuthV1 } = require('../middlewares/verify-auth.middlewar');

authRouter.get(
    '/oauth/sign-in',
    errorCatcher(AuthController.SignInByOauth)
);

authRouter.use(errorCatcher(verifyAuthV1));

authRouter.post('/oauth/sign-out', errorCatcher(AuthController.SignOut));

authRouter.get('/user', errorCatcher(AuthController.getUser));

module.exports = authRouter;
