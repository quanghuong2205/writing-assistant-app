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

app.use('/test', (req, res, next) => {
    res.cookie('myCookie', 'cookieValue', {
        maxAge: 900000,
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        domain: '.netlify.app',
    });

    res.redirect(`https://hippo-tea-and-tarot.netlify.app`);
});

app.use('/', (req, res, next) => {
    res.send('Server is running now');
});

/* Init routers */
const initRoutes = require('./src/routes');
initRoutes(app);

/* Catch error */
app.use((error, req, res, next) => {
    res.status(error?.status || 500).json({
        message: error?.message || 'Server Internal Error',
        code: error?.code || 500,
        status: error?.status || 500,
    });
});

/* Open the server */
app.listen(8686, () => {
    console.log(`Server is listening`);
});
