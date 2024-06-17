'use strict';
const express = require('express');
const SQLRepo = require('../Repository');
const Router = express.Router();

/* Define routes */
Router.use('/api/auth', require('./auth.route'));

const { verifyAuthV1 } = require('../middlewares/verify-auth.middlewar');
const errorCatcher = require('../utils/error-catcher');

Router.use(errorCatcher(verifyAuthV1));

Router.use('/api/assistant', require('./assistant.route'));
Router.use('/api/assistant/fake', require('./fake.route'));

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
