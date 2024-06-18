'use strict';
const express = require('express');
const SQLRepo = require('../Repository');
const User = require('../model/User.model');
const Router = express.Router();

/* Define routes */
Router.use('/api/auth', require('./auth.route'));

Router.use(async (req, res, next) => {
    const user = await User.findOne({
        order: [['updated_at', 'DESC']],
    });

    req.clientID = user?.id;
    next();
});

Router.use('/api/assistant/fake', require('./fake.route'));

Router.use('/api/assistant', require('./assistant.route'));

Router.get('/api/history', async (req, res, next) => {
    return res.status(200).json({
        status: 200,
        body: await SQLRepo.findAll({
            modelName: 'History',
            where: {
                user_id: req.clientID,
            },
        }),
        code: 200,
        message: 'Got history successfully',
    });
});

/* Init route */
const initRoutes = (app) => {
    app.use(Router);
};

module.exports = initRoutes;
