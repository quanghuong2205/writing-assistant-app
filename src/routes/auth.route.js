'use strict';
const express = require('express');
const authRouter = express.Router();
const AuthController = require('../controllers/auth.controller');
const errorCatcher = require('../utils/error-catcher');
const User = require('../model/User.model');

authRouter.use(async (req, res, next) => {
    const user = await User.findOne({
        order: [['updated_at', 'DESC']],
    });

    req.clientID = user?.id;
    next();
});

authRouter.get(
    '/oauth/sign-in',
    errorCatcher(AuthController.SignInByOauth)
);

authRouter.post('/oauth/sign-out', errorCatcher(AuthController.SignOut));

authRouter.get('/user', errorCatcher(AuthController.getUser));

module.exports = authRouter;
