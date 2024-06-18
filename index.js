// const server = require('./src/app');
// require('dotenv').config();
const express = require('express');
const app = express();
/* Error route */

app.use('/', (req, res, next) => res.send('hello'));

/* Open the server */
app.listen(8686, () => {
    console.log(`Server is listening`);
});
