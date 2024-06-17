const server = require('./src/app');
require('dotenv').config();
// const DBConnector = require('./src/helper/db-connector.helper');

/* Error route */

/* Open the server */
server.listen(process.env.SERVER_PORT, () => {
    console.log(
        `Server is listening on :: http://${process.env.SERVER_DOMAIN}:${process.env.SERVER_PORT}`
    );
});

/* Close the server */
process.on('SIGINT', async () => {
    /* Close the database connector */
    // await DBConnector.close();

    /* Close the server */
    console.log(
        `Closed the server on :: http://${process.env.SERVER_DOMAIN}:${process.env.SERVER_PORT}`
    );
    process.exit();
});
