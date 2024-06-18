'use strict';
const express = require('express');
const app = express();
var cookieParser = require('cookie-parser');
const cors = require('cors');

/* Parser */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    cors({
        origin: 'https://writing-assistant-nine.vercel.app',
        credentials: true,
    })
);
app.use(cookieParser());

/* Connect to the database */
const DBConnector = require('./helper/db-connector.helper');
DBConnector.getConnector();
require('./model/User.model');
require('./model/Token.model');
require('./model/Oauth.model');
require('./model/History.model');

app.use('/test', (req, res, next) => {
    res.cookie('myCookie', 'cookieValue', {
        maxAge: 900000, // 15 minutes
        httpOnly: true, // Cookie cannot be accessed via client-side JavaScript
        secure: true, // Cookie will only be sent over HTTPS
        sameSite: 'None', // Allows cookie to be sent cross-origin
        domain: '.netlify.app', // Adjust domain based on your specific setup
    });

    res.redirect(`https://hippo-tea-and-tarot.netlify.app`);
});

/* Init routers */
const initRoutes = require('./routes');
initRoutes(app);

/* Catch error */
app.use((error, req, res, next) => {
    res.status(error?.status || 500).json({
        message: error?.message || 'Server Internal Error',
        code: error?.code || 500,
        status: error?.status || 500,
    });
});

module.exports = app;
