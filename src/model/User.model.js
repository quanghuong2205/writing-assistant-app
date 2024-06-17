'use strict';
const { DataTypes } = require('sequelize');
const DBConnector = require('../helper/db-connector.helper');
const connector = DBConnector.getConnector();

const User = connector.define(
    'User',
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },

        name: {
            type: DataTypes.STRING,
            defaultValue: '',
        },

        email: {
            type: DataTypes.STRING,
            defaultValue: '',
        },

        password: {
            type: DataTypes.STRING,
            defaultValue: '',
        },

        avatar_url: {
            type: DataTypes.STRING,
            defaultValue: '',
        },
    },
    {
        timestamps: true,
        tableName: 'User',
        underscored: true,
    }
);

module.exports = User;
