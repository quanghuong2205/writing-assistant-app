'use strict';

require('dotenv').config();

/* DEV ENV */
const DEVELOPMENT = {
    database: {
        host: process.env.DEV_DB_HOST,
        user: process.env.DEV_DB_USER,
        name: process.env.DEV_DB_NAME,
        password: process.env.DEV_DB_PASSWORD,
        dialect: process.env.DEV_DB_DIALECT,
    },

    oauth: {
        clientID: process.env.DEV_OAUTH_CLIENT_ID,
        clientSecret: process.env.DEV_OAUTH_CLIENT_SECRET,
        redirectUrl: process.env.DEV_OAUTH_REDIRECT_URL,
        accessType: process.env.DEV_OAUTH_ACCESS_TYPE,
    },

    openai: {
        apiKey: process.env.DEV_OPEN_AI_KEY,
    },

    google: {
        searchKey: process.env.DEV_GOOGLE_SEARCH_API_KEY,
        searchCx: process.env.DEV_GOOGLE_SEARCH_CX,
    },
};

/* PRO ENV */
const PRODUCTION = {
    client: {
        domain: process.env.PRO_CLIENT_DOMAIN,
    },

    database: {
        host: process.env.PRO_DB_HOST,
        user: process.env.PRO_DB_USER,
        name: process.env.PRO_DB_NAME,
        password: process.env.PRO_DB_PASSWORD,
        dialect: process.env.PRO_DB_DIALECT,
    },

    oauth: {
        clientID: process.env.PRO_OAUTH_CLIENT_ID,
        clientSecret: process.env.PRO_OAUTH_CLIENT_SECRET,
        redirectUrl: process.env.PRO_OAUTH_REDIRECT_URL,
        accessType: process.env.PRO_OAUTH_ACCESS_TYPE,
    },

    openai: {
        apiKey: process.env.PRO_OPEN_AI_KEY,
    },

    google: {
        searchKey: process.env.PRO_GOOGLE_SEARCH_API_KEY,
        searchCx: process.env.PRO_GOOGLE_SEARCH_CX,
    },
};

/* APP CONFIG */
const APP_CONFIGS = {
    DEV: DEVELOPMENT,
    PRO: PRODUCTION,
};

/* GET CONFIG  */
const getConfig = (env = 'PRO') => {
    if (!Object.keys(APP_CONFIGS).includes(env.toUpperCase())) {
        throw new Error(
            `The environment (${env}) is not in configuration`
        );
    }
    return APP_CONFIGS[env.toUpperCase()];
};

module.exports = getConfig;
