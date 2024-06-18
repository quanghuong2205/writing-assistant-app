const server = require('./src/app');
require('dotenv').config();

/* Error route */

/* Open the server */
server.listen(8686, () => {
    console.log(`Server is listening`);
});
