'use strict';
const { Sequelize } = require('sequelize');
const getConfig = require('../config');
const path = require('path');

/* Get configs */
const config = getConfig('dev');

class DBConnector {
    static instance = null;
    constructor() {
        if (DBConnector.instance) {
            throw new Error('Only one sequilize instance allowed');
        }

        /* Create instance */
        DBConnector.instance = new Sequelize({
            dialect: 'sqlite',
            storage: path.join(__dirname, 'app.db'),
        });
    }

    static connect() {
        return DBConnector.instance
            .authenticate()
            .then(() => {
                console.log(
                    `Connected to the database::`,
                    config.database.name
                );
            })
            .catch((err) => {
                console.log(
                    `Failed to the database::`,
                    config.database.name
                );
                console.error(`Got an error::`, err.message);
            });
    }

    static close() {
        if (!DBConnector.instance) {
            throw new Error('Connector is undefined');
        }

        return DBConnector.instance
            .close()
            .then(() => {
                console.log(
                    `Closed to the database::`,
                    config.database.name
                );
            })
            .then(() => {
                DBConnector.instance = null;
            })
            .catch((err) => {
                console.log(
                    `Failed to close the database::`,
                    config.database.name
                );
                console.error(`Got an error::`, err.message);
            });
    }

    static initTables() {
        if (!DBConnector.instance) {
            throw new Error('Connector is undefined');
        }

        DBConnector.instance
            .sync({
                force: false,
                // alter: true,
            })
            .then(() => {
                console.log(
                    'Tables have been successfully created, if they do not already exist'
                );
            })
            .catch((err) => {
                console.log('Unable to create tables');
                console.error('Got an error::', err);
            });
    }

    static getConnector() {
        if (DBConnector.instance) {
            return DBConnector.instance;
        }
        new DBConnector();
        DBConnector.connect();
        DBConnector.initTables();

        return DBConnector.instance;
    }
}

module.exports = DBConnector;
